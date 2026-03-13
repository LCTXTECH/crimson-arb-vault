import {
  Connection,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
  PublicKey,
  Keypair,
  AddressLookupTableAccount,
} from "@solana/web3.js";

/**
 * Helper for sending versioned transactions with Address Lookup Tables
 * Used for complex transactions that exceed account limit
 */
export async function sendVersionedTransaction(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  signers: Keypair[],
  lookupTableAccounts?: AddressLookupTableAccount[]
): Promise<string> {
  // Get latest blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  // Create versioned transaction message
  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message(lookupTableAccounts);

  // Create versioned transaction
  const transaction = new VersionedTransaction(messageV0);

  // Sign with all signers
  transaction.sign(signers);

  // Send and confirm
  const signature = await connection.sendTransaction(transaction, {
    maxRetries: 3,
  });

  // Wait for confirmation
  await connection.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  return signature;
}

/**
 * Create remaining accounts array for Voltr SDK calls
 */
export function createRemainingAccounts(
  accounts: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[]
): { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] {
  return accounts.map((acc) => ({
    pubkey: acc.pubkey,
    isSigner: acc.isSigner,
    isWritable: acc.isWritable,
  }));
}

/**
 * Helper to create initialize strategy remaining accounts
 */
export function createInitializeRemainingAccounts(params: {
  market: PublicKey;
  vaultAssetMint: PublicKey;
  ctokenMint: PublicKey;
  marketLiquidityAta: PublicKey;
  userCtokenAta: PublicKey;
  ctokenMarketProgramId: PublicKey;
}): { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] {
  const {
    market,
    vaultAssetMint,
    ctokenMint,
    marketLiquidityAta,
    userCtokenAta,
    ctokenMarketProgramId,
  } = params;

  return [
    { pubkey: market, isSigner: false, isWritable: true }, // market
    { pubkey: vaultAssetMint, isSigner: false, isWritable: false }, // liquidity_mint
    { pubkey: ctokenMint, isSigner: false, isWritable: true }, // ctoken_mint
    { pubkey: marketLiquidityAta, isSigner: false, isWritable: true }, // market_liquidity_ata
    { pubkey: userCtokenAta, isSigner: false, isWritable: true }, // user_ctoken_ata
    {
      pubkey: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      isSigner: false,
      isWritable: false,
    }, // associated_token_program
    {
      pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      isSigner: false,
      isWritable: false,
    }, // liquidity_token_program
    {
      pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      isSigner: false,
      isWritable: false,
    }, // ctoken_token_program
    {
      pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"),
      isSigner: false,
      isWritable: false,
    }, // rent
    { pubkey: ctokenMarketProgramId, isSigner: false, isWritable: false }, // ctoken_market_program
  ];
}

/**
 * Helper to create deposit/withdraw strategy remaining accounts
 */
export function createDepositWithdrawRemainingAccounts(params: {
  market: PublicKey;
  ctokenMint: PublicKey;
  marketLiquidityAta: PublicKey;
  userCtokenAta: PublicKey;
  ctokenMarketProgramId: PublicKey;
}): { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] {
  const {
    market,
    ctokenMint,
    marketLiquidityAta,
    userCtokenAta,
    ctokenMarketProgramId,
  } = params;

  return [
    { pubkey: market, isSigner: false, isWritable: true }, // market
    { pubkey: ctokenMint, isSigner: false, isWritable: true }, // ctoken_mint
    { pubkey: marketLiquidityAta, isSigner: false, isWritable: true }, // market_liquidity_ata
    { pubkey: userCtokenAta, isSigner: false, isWritable: true }, // user_ctoken_ata
    {
      pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      isSigner: false,
      isWritable: false,
    }, // ctoken_token_program
    { pubkey: ctokenMarketProgramId, isSigner: false, isWritable: false }, // ctoken_market_program
  ];
}
