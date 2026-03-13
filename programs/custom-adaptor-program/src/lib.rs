use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use ctoken_market_program::{
    self,
    program::CtokenMarketProgram,
    Market, MARKET_SEED, CTOKEN_MINT_SEED,
};

declare_id!("CustAdpt11111111111111111111111111111111111");

/// Custom Adaptor Program
/// 
/// This adaptor connects Ranger Earn vaults to the cToken Market Program via CPI.
/// It implements the three required adaptor instructions: initialize, deposit, withdraw.
/// 
/// Account ordering is critical - the vault passes a fixed set of accounts:
/// - Initialize: payer, vault_strategy_auth (signer), strategy, system_program, then remaining accounts
/// - Deposit/Withdraw: vault_strategy_auth (signer), strategy, vault_asset_mint, vault_strategy_asset_ata, asset_token_program, then remaining accounts
#[program]
pub mod custom_adaptor_program {
    use super::*;

    /// Initialize a new strategy
    /// Called by the Manager when creating a new strategy in the vault
    /// Returns: Result<()>
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // CPI to ctoken_market_program::initialize_market_and_user
        ctoken_market_program::cpi::initialize_market_and_user(CpiContext::new(
            ctx.accounts.ctoken_market_program.to_account_info(),
            ctoken_market_program::cpi::accounts::InitializeMarketAndUser {
                payer: ctx.accounts.payer.to_account_info(),
                user: ctx.accounts.authority.to_account_info(),
                market: ctx.accounts.market.to_account_info(),
                liquidity_mint: ctx.accounts.liquidity_mint.to_account_info(),
                ctoken_mint: ctx.accounts.ctoken_mint.to_account_info(),
                market_liquidity_ata: ctx.accounts.market_liquidity_ata.to_account_info(),
                user_ctoken_ata: ctx.accounts.user_ctoken_ata.to_account_info(),
                associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
                liquidity_token_program: ctx.accounts.liquidity_token_program.to_account_info(),
                ctoken_token_program: ctx.accounts.ctoken_token_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
            },
        ))?;
        
        msg!("Strategy initialized via adaptor");
        Ok(())
    }

    /// Deposit funds into the strategy
    /// Called by the Manager when allocating funds from the vault
    /// Returns: Result<u64> - current position value in underlying token terms
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<u64> {
        if amount > 0 {
            // CPI to ctoken_market_program::deposit_market
            ctoken_market_program::cpi::deposit_market(
                CpiContext::new(
                    ctx.accounts.ctoken_market_program.to_account_info(),
                    ctoken_market_program::cpi::accounts::DepositOrWithdraw {
                        user: ctx.accounts.user.to_account_info(),
                        market: ctx.accounts.market.to_account_info(),
                        liquidity_mint: ctx.accounts.token_mint.to_account_info(),
                        ctoken_mint: ctx.accounts.ctoken_mint.to_account_info(),
                        user_liquidity_ata: ctx.accounts.user_token_ata.to_account_info(),
                        market_liquidity_ata: ctx.accounts.market_liquidity_ata.to_account_info(),
                        user_ctoken_ata: ctx.accounts.user_ctoken_ata.to_account_info(),
                        liquidity_token_program: ctx.accounts.token_program.to_account_info(),
                        ctoken_token_program: ctx.accounts.ctoken_token_program.to_account_info(),
                    },
                ),
                amount,
            )?;
            
            // Reload accounts to get fresh state after CPI
            ctx.accounts.user_ctoken_ata.reload()?;
            ctx.accounts.market.reload()?;
        }
        
        // Calculate and return current position value
        let authority_holdings = ctx
            .accounts
            .market
            .ctoken_to_liquidity(ctx.accounts.user_ctoken_ata.amount);
        
        msg!("Deposit complete. Current holdings: {}", authority_holdings);
        Ok(authority_holdings)
    }

    /// Withdraw funds from the strategy
    /// Called by the Manager when deallocating funds from the strategy
    /// Returns: Result<u64> - remaining position value in underlying token terms
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<u64> {
        // Calculate how many cTokens to burn for the requested liquidity amount
        let authority_holdings_pre_withdraw = ctx
            .accounts
            .market
            .ctoken_to_liquidity(ctx.accounts.user_ctoken_ata.amount);
        
        let ctoken_amount = amount
            .checked_mul(ctx.accounts.user_ctoken_ata.amount)
            .ok_or(AdaptorError::MathOverflow)?
            .checked_div(authority_holdings_pre_withdraw)
            .ok_or(AdaptorError::MathOverflow)?;
        
        // CPI to ctoken_market_program::withdraw_market
        ctoken_market_program::cpi::withdraw_market(
            CpiContext::new(
                ctx.accounts.ctoken_market_program.to_account_info(),
                ctoken_market_program::cpi::accounts::DepositOrWithdraw {
                    user: ctx.accounts.user.to_account_info(),
                    market: ctx.accounts.market.to_account_info(),
                    liquidity_mint: ctx.accounts.token_mint.to_account_info(),
                    ctoken_mint: ctx.accounts.ctoken_mint.to_account_info(),
                    user_liquidity_ata: ctx.accounts.user_token_ata.to_account_info(),
                    market_liquidity_ata: ctx.accounts.market_liquidity_ata.to_account_info(),
                    user_ctoken_ata: ctx.accounts.user_ctoken_ata.to_account_info(),
                    liquidity_token_program: ctx.accounts.token_program.to_account_info(),
                    ctoken_token_program: ctx.accounts.ctoken_token_program.to_account_info(),
                },
            ),
            ctoken_amount,
        )?;
        
        // Reload accounts to get fresh state after CPI
        ctx.accounts.user_ctoken_ata.reload()?;
        ctx.accounts.market.reload()?;
        
        // Calculate and return remaining position value
        let authority_holdings_post_withdraw = ctx
            .accounts
            .market
            .ctoken_to_liquidity(ctx.accounts.user_ctoken_ata.amount);
        
        msg!("Withdraw complete. Remaining holdings: {}", authority_holdings_post_withdraw);
        Ok(authority_holdings_post_withdraw)
    }
}

/// Initialize accounts struct
/// Fixed accounts from vault: payer, vault_strategy_auth (authority), strategy, system_program
/// Then remaining accounts for protocol-specific CPI
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// vault_strategy_auth - the signer passed by the vault
    pub authority: Signer<'info>,
    
    /// strategy account - 1:1 mapping to protocol state (market PDA)
    #[account(constraint = strategy.key() == market.key())]
    pub strategy: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
    
    // Protocol-specific remaining accounts for CPI to initialize_market_and_user
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub market: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    pub liquidity_mint: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub ctoken_mint: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub market_liquidity_ata: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub user_ctoken_ata: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    pub associated_token_program: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    pub liquidity_token_program: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    pub ctoken_token_program: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    pub rent: AccountInfo<'info>,
    
    pub ctoken_market_program: Program<'info, CtokenMarketProgram>,
}

/// Deposit accounts struct
/// Fixed accounts from vault: vault_strategy_auth (user), strategy, vault_asset_mint, vault_strategy_asset_ata, asset_token_program
/// Then remaining accounts for protocol-specific CPI
#[derive(Accounts)]
pub struct Deposit<'info> {
    /// vault_strategy_auth - the signer passed by the vault
    pub user: Signer<'info>,
    
    /// strategy account - 1:1 mapping to protocol state (market PDA)
    #[account(constraint = strategy.key() == market.key())]
    pub strategy: AccountInfo<'info>,
    
    /// vault_asset_mint - the liquidity token mint
    pub token_mint: InterfaceAccount<'info, Mint>,
    
    /// vault_strategy_asset_ata - user's liquidity token ATA
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_ata: InterfaceAccount<'info, TokenAccount>,
    
    /// asset_token_program
    pub token_program: Interface<'info, TokenInterface>,
    
    // Protocol-specific remaining accounts for CPI to deposit_market
    
    /// Market PDA - validated with cross-program seeds
    #[account(
        mut,
        seeds = [MARKET_SEED, token_mint.key().as_ref()],
        bump,
        seeds::program = ctoken_market_program.key()
    )]
    pub market: Account<'info, Market>,
    
    /// cToken mint PDA - validated with cross-program seeds
    /// CHECK: validated via cross-program PDA seeds
    #[account(
        mut,
        seeds = [CTOKEN_MINT_SEED, token_mint.key().as_ref()],
        bump,
        seeds::program = ctoken_market_program.key()
    )]
    pub ctoken_mint: AccountInfo<'info>,
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub market_liquidity_ata: AccountInfo<'info>,
    
    /// User's cToken ATA
    #[account(
        mut,
        associated_token::mint = ctoken_mint,
        associated_token::authority = user,
        associated_token::token_program = ctoken_token_program,
    )]
    pub user_ctoken_ata: Box<InterfaceAccount<'info, TokenAccount>>,
    
    /// CHECK: validated in CPI call
    pub ctoken_token_program: AccountInfo<'info>,
    
    pub ctoken_market_program: Program<'info, CtokenMarketProgram>,
}

/// Withdraw accounts struct
/// Fixed accounts from vault: vault_strategy_auth (user), strategy, vault_asset_mint, vault_strategy_asset_ata, asset_token_program
/// Then remaining accounts for protocol-specific CPI
#[derive(Accounts)]
pub struct Withdraw<'info> {
    /// vault_strategy_auth - the signer passed by the vault
    pub user: Signer<'info>,
    
    /// strategy account - 1:1 mapping to protocol state (market PDA)
    #[account(constraint = strategy.key() == market.key())]
    pub strategy: AccountInfo<'info>,
    
    /// vault_asset_mint - the liquidity token mint
    pub token_mint: InterfaceAccount<'info, Mint>,
    
    /// vault_strategy_asset_ata - user's liquidity token ATA
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_ata: InterfaceAccount<'info, TokenAccount>,
    
    /// asset_token_program
    pub token_program: Interface<'info, TokenInterface>,
    
    // Protocol-specific remaining accounts for CPI to withdraw_market
    
    /// Market PDA - deserialized to call ctoken_to_liquidity()
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    /// cToken mint PDA
    #[account(mut)]
    pub ctoken_mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: validated in CPI call
    #[account(mut)]
    pub market_liquidity_ata: AccountInfo<'info>,
    
    /// User's cToken ATA
    #[account(mut)]
    pub user_ctoken_ata: Box<InterfaceAccount<'info, TokenAccount>>,
    
    /// CHECK: validated in CPI call
    pub ctoken_token_program: AccountInfo<'info>,
    
    pub ctoken_market_program: Program<'info, CtokenMarketProgram>,
}

#[error_code]
pub enum AdaptorError {
    #[msg("Math overflow")]
    MathOverflow,
}
