use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface, MintTo, Burn, TransferChecked, mint_to, burn, transfer_checked},
};

declare_id!("CtkMkt11111111111111111111111111111111111111");

pub const MARKET_SEED: &[u8] = b"market";
pub const CTOKEN_MINT_SEED: &[u8] = b"ctoken_mint";

#[program]
pub mod ctoken_market_program {
    use super::*;

    /// Initialize the market, cToken mint, market's liquidity ATA, and user's cToken ATA
    pub fn initialize_market_and_user(ctx: Context<InitializeMarketAndUser>) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.liquidity_mint = ctx.accounts.liquidity_mint.key();
        market.ctoken_mint = ctx.accounts.ctoken_mint.key();
        market.liquidity_deposited = 0;
        market.ctokens_minted = 0;
        market.bump = ctx.bumps.market;
        market.ctoken_bump = ctx.bumps.ctoken_mint;
        
        msg!("Market initialized for liquidity mint: {}", market.liquidity_mint);
        Ok(())
    }

    /// Deposit liquidity tokens and receive cTokens proportionally
    /// Exchange rate: ctoken_amount = (liquidity_amount × ctokens_minted) / liquidity_deposited
    pub fn deposit_market(ctx: Context<DepositOrWithdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, MarketError::ZeroAmount);
        
        let market = &mut ctx.accounts.market;
        
        // Calculate cTokens to mint
        let ctokens_to_mint = if market.liquidity_deposited == 0 || market.ctokens_minted == 0 {
            // First deposit - 1:1 ratio
            amount
        } else {
            // Proportional: (amount * ctokens_minted) / liquidity_deposited
            amount
                .checked_mul(market.ctokens_minted)
                .ok_or(MarketError::MathOverflow)?
                .checked_div(market.liquidity_deposited)
                .ok_or(MarketError::MathOverflow)?
        };
        
        // Transfer liquidity tokens from user to market
        transfer_checked(
            CpiContext::new(
                ctx.accounts.liquidity_token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.user_liquidity_ata.to_account_info(),
                    mint: ctx.accounts.liquidity_mint.to_account_info(),
                    to: ctx.accounts.market_liquidity_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
            ctx.accounts.liquidity_mint.decimals,
        )?;
        
        // Mint cTokens to user
        let liquidity_mint_key = ctx.accounts.liquidity_mint.key();
        let seeds = &[
            MARKET_SEED,
            liquidity_mint_key.as_ref(),
            &[market.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.ctoken_token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.ctoken_mint.to_account_info(),
                    to: ctx.accounts.user_ctoken_ata.to_account_info(),
                    authority: ctx.accounts.market.to_account_info(),
                },
                signer_seeds,
            ),
            ctokens_to_mint,
        )?;
        
        // Update market state
        market.liquidity_deposited = market.liquidity_deposited
            .checked_add(amount)
            .ok_or(MarketError::MathOverflow)?;
        market.ctokens_minted = market.ctokens_minted
            .checked_add(ctokens_to_mint)
            .ok_or(MarketError::MathOverflow)?;
        
        msg!("Deposited {} liquidity, minted {} cTokens", amount, ctokens_to_mint);
        Ok(())
    }

    /// Withdraw liquidity tokens by burning cTokens
    /// Exchange rate: liquidity_amount = (ctoken_amount × liquidity_deposited) / ctokens_minted
    pub fn withdraw_market(ctx: Context<DepositOrWithdraw>, ctoken_amount: u64) -> Result<()> {
        require!(ctoken_amount > 0, MarketError::ZeroAmount);
        
        let market = &mut ctx.accounts.market;
        require!(market.ctokens_minted >= ctoken_amount, MarketError::InsufficientCTokens);
        
        // Calculate liquidity to return
        let liquidity_to_return = ctoken_amount
            .checked_mul(market.liquidity_deposited)
            .ok_or(MarketError::MathOverflow)?
            .checked_div(market.ctokens_minted)
            .ok_or(MarketError::MathOverflow)?;
        
        require!(market.liquidity_deposited >= liquidity_to_return, MarketError::InsufficientLiquidity);
        
        // Burn cTokens from user
        burn(
            CpiContext::new(
                ctx.accounts.ctoken_token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.ctoken_mint.to_account_info(),
                    from: ctx.accounts.user_ctoken_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            ctoken_amount,
        )?;
        
        // Transfer liquidity tokens from market to user
        let liquidity_mint_key = ctx.accounts.liquidity_mint.key();
        let seeds = &[
            MARKET_SEED,
            liquidity_mint_key.as_ref(),
            &[market.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        
        transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.liquidity_token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.market_liquidity_ata.to_account_info(),
                    mint: ctx.accounts.liquidity_mint.to_account_info(),
                    to: ctx.accounts.user_liquidity_ata.to_account_info(),
                    authority: ctx.accounts.market.to_account_info(),
                },
                signer_seeds,
            ),
            liquidity_to_return,
            ctx.accounts.liquidity_mint.decimals,
        )?;
        
        // Update market state
        market.liquidity_deposited = market.liquidity_deposited
            .checked_sub(liquidity_to_return)
            .ok_or(MarketError::MathOverflow)?;
        market.ctokens_minted = market.ctokens_minted
            .checked_sub(ctoken_amount)
            .ok_or(MarketError::MathOverflow)?;
        
        msg!("Burned {} cTokens, returned {} liquidity", ctoken_amount, liquidity_to_return);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarketAndUser<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// The user who will receive cTokens (vault_strategy_auth in adaptor context)
    pub user: Signer<'info>,
    
    /// Market PDA - tracks liquidity_deposited and ctokens_minted
    #[account(
        init,
        payer = payer,
        space = 8 + Market::INIT_SPACE,
        seeds = [MARKET_SEED, liquidity_mint.key().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    /// The liquidity token mint (e.g., USDC, SOL)
    pub liquidity_mint: InterfaceAccount<'info, Mint>,
    
    /// cToken mint PDA - receipt token representing pool shares
    #[account(
        init,
        payer = payer,
        seeds = [CTOKEN_MINT_SEED, liquidity_mint.key().as_ref()],
        bump,
        mint::decimals = liquidity_mint.decimals,
        mint::authority = market,
        mint::token_program = ctoken_token_program,
    )]
    pub ctoken_mint: InterfaceAccount<'info, Mint>,
    
    /// Market's liquidity token ATA
    #[account(
        init,
        payer = payer,
        associated_token::mint = liquidity_mint,
        associated_token::authority = market,
        associated_token::token_program = liquidity_token_program,
    )]
    pub market_liquidity_ata: InterfaceAccount<'info, TokenAccount>,
    
    /// User's cToken ATA
    #[account(
        init,
        payer = payer,
        associated_token::mint = ctoken_mint,
        associated_token::authority = user,
        associated_token::token_program = ctoken_token_program,
    )]
    pub user_ctoken_ata: InterfaceAccount<'info, TokenAccount>,
    
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub liquidity_token_program: Interface<'info, TokenInterface>,
    pub ctoken_token_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositOrWithdraw<'info> {
    /// The user performing the deposit/withdraw
    pub user: Signer<'info>,
    
    /// Market PDA
    #[account(
        mut,
        seeds = [MARKET_SEED, liquidity_mint.key().as_ref()],
        bump = market.bump,
    )]
    pub market: Account<'info, Market>,
    
    /// The liquidity token mint
    pub liquidity_mint: InterfaceAccount<'info, Mint>,
    
    /// cToken mint PDA
    #[account(
        mut,
        seeds = [CTOKEN_MINT_SEED, liquidity_mint.key().as_ref()],
        bump = market.ctoken_bump,
    )]
    pub ctoken_mint: InterfaceAccount<'info, Mint>,
    
    /// User's liquidity token ATA
    #[account(
        mut,
        associated_token::mint = liquidity_mint,
        associated_token::authority = user,
        associated_token::token_program = liquidity_token_program,
    )]
    pub user_liquidity_ata: InterfaceAccount<'info, TokenAccount>,
    
    /// Market's liquidity token ATA
    #[account(
        mut,
        associated_token::mint = liquidity_mint,
        associated_token::authority = market,
        associated_token::token_program = liquidity_token_program,
    )]
    pub market_liquidity_ata: InterfaceAccount<'info, TokenAccount>,
    
    /// User's cToken ATA
    #[account(
        mut,
        associated_token::mint = ctoken_mint,
        associated_token::authority = user,
        associated_token::token_program = ctoken_token_program,
    )]
    pub user_ctoken_ata: InterfaceAccount<'info, TokenAccount>,
    
    pub liquidity_token_program: Interface<'info, TokenInterface>,
    pub ctoken_token_program: Interface<'info, TokenInterface>,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    /// The liquidity token mint
    pub liquidity_mint: Pubkey,
    /// The cToken mint (receipt token)
    pub ctoken_mint: Pubkey,
    /// Total liquidity deposited in the market
    pub liquidity_deposited: u64,
    /// Total cTokens minted
    pub ctokens_minted: u64,
    /// Market PDA bump
    pub bump: u8,
    /// cToken mint PDA bump
    pub ctoken_bump: u8,
}

impl Market {
    /// Convert cToken amount to liquidity amount
    pub fn ctoken_to_liquidity(&self, ctoken_amount: u64) -> u64 {
        if self.ctokens_minted == 0 {
            return 0;
        }
        ctoken_amount
            .checked_mul(self.liquidity_deposited)
            .unwrap_or(0)
            .checked_div(self.ctokens_minted)
            .unwrap_or(0)
    }
}

#[error_code]
pub enum MarketError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Insufficient cTokens")]
    InsufficientCTokens,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
}
