import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CustomAdaptorProgram } from "../target/types/custom_adaptor_program";
import { CtokenMarketProgram } from "../target/types/ctoken_market_program";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createMint,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

// Voltr SDK imports - for integration with Ranger Earn Vault
// import { VoltrClient, createInitializeStrategyIx, createDepositStrategyIx, createWithdrawStrategyIx } from "@voltr/vault-sdk";

describe("custom-adaptor-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const customAdaptorProgram = anchor.workspace.CustomAdaptorProgram as Program<CustomAdaptorProgram>;
  const ctokenMarketProgram = anchor.workspace.CtokenMarketProgram as Program<CtokenMarketProgram>;

  // Test accounts
  const admin = Keypair.generate();
  const manager = Keypair.generate();
  const user = Keypair.generate();
  
  let vaultAssetMint: PublicKey;
  let market: PublicKey;
  let ctokenMint: PublicKey;
  let marketLiquidityAta: PublicKey;
  let userCtokenAta: PublicKey;
  let userLiquidityAta: PublicKey;

  // PDA seeds
  const MARKET_SEED = Buffer.from("market");
  const CTOKEN_MINT_SEED = Buffer.from("ctoken_mint");

  before(async () => {
    // Airdrop SOL to test accounts
    const airdropAdmin = await provider.connection.requestAirdrop(
      admin.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropAdmin);

    const airdropManager = await provider.connection.requestAirdrop(
      manager.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropManager);

    const airdropUser = await provider.connection.requestAirdrop(
      user.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropUser);

    // Create the vault asset mint (e.g., USDC or SOL wrapper)
    vaultAssetMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6 // 6 decimals like USDC
    );

    // Derive PDAs
    [market] = PublicKey.findProgramAddressSync(
      [MARKET_SEED, vaultAssetMint.toBuffer()],
      ctokenMarketProgram.programId
    );

    [ctokenMint] = PublicKey.findProgramAddressSync(
      [CTOKEN_MINT_SEED, vaultAssetMint.toBuffer()],
      ctokenMarketProgram.programId
    );

    marketLiquidityAta = getAssociatedTokenAddressSync(
      vaultAssetMint,
      market,
      true // allowOwnerOffCurve for PDA
    );

    userCtokenAta = getAssociatedTokenAddressSync(
      ctokenMint,
      manager.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    userLiquidityAta = getAssociatedTokenAddressSync(
      vaultAssetMint,
      manager.publicKey
    );

    // Mint some liquidity tokens to the manager for testing
    // First create the manager's ATA
    const { createAssociatedTokenAccountInstruction } = await import("@solana/spl-token");
    
    console.log("Test setup complete");
    console.log("Vault Asset Mint:", vaultAssetMint.toBase58());
    console.log("Market PDA:", market.toBase58());
    console.log("cToken Mint PDA:", ctokenMint.toBase58());
  });

  describe("Manager initializes strategy", () => {
    it("should initialize the cToken market via adaptor", async () => {
      // In a full integration, this would use Voltr SDK:
      // const initIx = createInitializeStrategyIx({
      //   vault: vaultPda,
      //   strategy: market, // strategy = market PDA
      //   adaptor: customAdaptorProgram.programId,
      //   manager: manager.publicKey,
      //   remainingAccounts: [...] // protocol-specific accounts
      // });

      // For direct testing, call the adaptor's initialize instruction
      const tx = await customAdaptorProgram.methods
        .initialize()
        .accounts({
          payer: admin.publicKey,
          authority: manager.publicKey,
          strategy: market,
          systemProgram: SystemProgram.programId,
          market: market,
          liquidityMint: vaultAssetMint,
          ctokenMint: ctokenMint,
          marketLiquidityAta: marketLiquidityAta,
          userCtokenAta: userCtokenAta,
          associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
          liquidityTokenProgram: TOKEN_PROGRAM_ID,
          ctokenTokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          ctokenMarketProgram: ctokenMarketProgram.programId,
        })
        .signers([admin, manager])
        .rpc();

      console.log("Initialize strategy tx:", tx);

      // Verify market was created
      const marketAccount = await ctokenMarketProgram.account.market.fetch(market);
      assert.equal(marketAccount.liquidityMint.toBase58(), vaultAssetMint.toBase58());
      assert.equal(marketAccount.ctokenMint.toBase58(), ctokenMint.toBase58());
      assert.equal(marketAccount.liquidityDeposited.toNumber(), 0);
      assert.equal(marketAccount.ctokensMinted.toNumber(), 0);

      console.log("Strategy initialized successfully!");
    });
  });

  describe("Manager deposits into strategy", () => {
    const depositAmount = 1_000_000; // 1 USDC (6 decimals)

    before(async () => {
      // Mint liquidity tokens to manager's ATA for deposit testing
      await mintTo(
        provider.connection,
        admin,
        vaultAssetMint,
        userLiquidityAta,
        admin,
        depositAmount * 10 // Mint 10x for multiple tests
      );
    });

    it("should deposit liquidity and receive cTokens", async () => {
      // In a full integration, this would use Voltr SDK:
      // const depositIx = createDepositStrategyIx({
      //   vault: vaultPda,
      //   strategy: market,
      //   adaptor: customAdaptorProgram.programId,
      //   amount: depositAmount,
      //   remainingAccounts: [...] // protocol-specific accounts
      // });

      const tx = await customAdaptorProgram.methods
        .deposit(new anchor.BN(depositAmount))
        .accounts({
          user: manager.publicKey,
          strategy: market,
          tokenMint: vaultAssetMint,
          userTokenAta: userLiquidityAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          market: market,
          ctokenMint: ctokenMint,
          marketLiquidityAta: marketLiquidityAta,
          userCtokenAta: userCtokenAta,
          ctokenTokenProgram: TOKEN_PROGRAM_ID,
          ctokenMarketProgram: ctokenMarketProgram.programId,
        })
        .signers([manager])
        .rpc();

      console.log("Deposit tx:", tx);

      // Verify deposit
      const marketAccount = await ctokenMarketProgram.account.market.fetch(market);
      assert.equal(marketAccount.liquidityDeposited.toNumber(), depositAmount);
      assert.equal(marketAccount.ctokensMinted.toNumber(), depositAmount); // 1:1 for first deposit

      const userCtokenAccount = await getAccount(provider.connection, userCtokenAta);
      assert.equal(Number(userCtokenAccount.amount), depositAmount);

      console.log(`Deposited ${depositAmount} liquidity, received ${depositAmount} cTokens`);
    });
  });

  describe("Manager withdraws from strategy", () => {
    const withdrawAmount = 500_000; // 0.5 USDC

    it("should withdraw liquidity by burning cTokens", async () => {
      // In a full integration, this would use Voltr SDK:
      // const withdrawIx = createWithdrawStrategyIx({
      //   vault: vaultPda,
      //   strategy: market,
      //   adaptor: customAdaptorProgram.programId,
      //   amount: withdrawAmount,
      //   remainingAccounts: [...] // protocol-specific accounts
      // });

      const preMarketAccount = await ctokenMarketProgram.account.market.fetch(market);
      const preLiquidityDeposited = preMarketAccount.liquidityDeposited.toNumber();

      const tx = await customAdaptorProgram.methods
        .withdraw(new anchor.BN(withdrawAmount))
        .accounts({
          user: manager.publicKey,
          strategy: market,
          tokenMint: vaultAssetMint,
          userTokenAta: userLiquidityAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          market: market,
          ctokenMint: ctokenMint,
          marketLiquidityAta: marketLiquidityAta,
          userCtokenAta: userCtokenAta,
          ctokenTokenProgram: TOKEN_PROGRAM_ID,
          ctokenMarketProgram: ctokenMarketProgram.programId,
        })
        .signers([manager])
        .rpc();

      console.log("Withdraw tx:", tx);

      // Verify withdrawal
      const marketAccount = await ctokenMarketProgram.account.market.fetch(market);
      const expectedRemaining = preLiquidityDeposited - withdrawAmount;
      assert.equal(marketAccount.liquidityDeposited.toNumber(), expectedRemaining);

      console.log(`Withdrew ${withdrawAmount} liquidity, ${expectedRemaining} remaining`);
    });
  });

  describe("Position value tracking", () => {
    it("should correctly report position value after operations", async () => {
      const marketAccount = await ctokenMarketProgram.account.market.fetch(market);
      const userCtokenAccount = await getAccount(provider.connection, userCtokenAta);

      // Calculate expected position value using the market's exchange rate
      const ctokensHeld = Number(userCtokenAccount.amount);
      const totalLiquidity = marketAccount.liquidityDeposited.toNumber();
      const totalCtokens = marketAccount.ctokensMinted.toNumber();

      const positionValue = Math.floor((ctokensHeld * totalLiquidity) / totalCtokens);

      console.log("Position tracking:");
      console.log(`  cTokens held: ${ctokensHeld}`);
      console.log(`  Total liquidity in market: ${totalLiquidity}`);
      console.log(`  Total cTokens minted: ${totalCtokens}`);
      console.log(`  Position value: ${positionValue}`);

      // Position value should equal remaining liquidity (since we're the only depositor)
      assert.equal(positionValue, totalLiquidity);
    });
  });
});
