use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("CrmsnADP1111111111111111111111111111111111");

/// CrimsonArb Custom Adaptor Program
/// Follows Ranger/Voltr pattern for adaptor integration
/// 
/// Architecture:
/// - Receives CPI calls from CrimsonVault
/// - Translates calls to Drift Protocol interface
/// - Returns position value (u64) for vault accounting
#[program]
pub mod crimson_adaptor {
    use super::*;

    /// Initialize the adaptor for a specific vault
    pub fn initialize(
        ctx: Context<Initialize>,
        drift_user_subaccount: u16,
    ) -> Result<()> {
        let adaptor = &mut ctx.accounts.adaptor;
        adaptor.vault = ctx.accounts.vault.key();
        adaptor.authority = ctx.accounts.authority.key();
        adaptor.drift_user = ctx.accounts.drift_user.key();
        adaptor.drift_user_subaccount = drift_user_subaccount;
        adaptor.total_deposited = 0;
        adaptor.current_position_value = 0;
        adaptor.last_update_slot = Clock::get()?.slot;
        adaptor.is_active = true;
        adaptor.bump = ctx.bumps.adaptor;

        emit!(AdaptorInitialized {
            adaptor: adaptor.key(),
            vault: adaptor.vault,
            drift_user: adaptor.drift_user,
        });

        Ok(())
    }

    /// Deposit funds from vault into Drift position
    /// Called via CPI from CrimsonVault
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let adaptor = &mut ctx.accounts.adaptor;
        
        require!(adaptor.is_active, AdaptorError::AdaptorInactive);
        require!(amount > 0, AdaptorError::InvalidAmount);

        // Transfer underlying from vault to adaptor's drift collateral
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_underlying.to_account_info(),
            to: ctx.accounts.adaptor_underlying.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // CPI to Drift Protocol to deposit collateral
        // This would call drift_program.deposit() in production
        // For now, we track the deposit internally
        adaptor.total_deposited = adaptor.total_deposited.checked_add(amount).unwrap();
        adaptor.current_position_value = adaptor.current_position_value.checked_add(amount).unwrap();
        adaptor.last_update_slot = Clock::get()?.slot;

        emit!(DepositToAdaptor {
            adaptor: adaptor.key(),
            amount,
            total_deposited: adaptor.total_deposited,
        });

        Ok(())
    }

    /// Withdraw funds from Drift position back to vault
    /// Returns the actual amount withdrawn (u64)
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<u64> {
        let adaptor = &mut ctx.accounts.adaptor;
        
        require!(adaptor.is_active, AdaptorError::AdaptorInactive);
        require!(amount > 0, AdaptorError::InvalidAmount);
        require!(
            amount <= adaptor.current_position_value,
            AdaptorError::InsufficientFunds
        );

        // CPI to Drift Protocol to withdraw collateral
        // In production, this would call drift_program.withdraw()
        
        // Transfer from adaptor back to vault
        let seeds = &[
            b"adaptor".as_ref(),
            adaptor.vault.as_ref(),
            &[adaptor.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.adaptor_underlying.to_account_info(),
            to: ctx.accounts.vault_underlying.to_account_info(),
            authority: adaptor.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        token::transfer(cpi_ctx, amount)?;

        // Update adaptor state
        adaptor.total_deposited = adaptor.total_deposited.checked_sub(amount).unwrap();
        adaptor.current_position_value = adaptor.current_position_value.checked_sub(amount).unwrap();
        adaptor.last_update_slot = Clock::get()?.slot;

        emit!(WithdrawFromAdaptor {
            adaptor: adaptor.key(),
            amount,
            remaining_value: adaptor.current_position_value,
        });

        Ok(amount)
    }

    /// Update position value from Drift
    /// Called by keeper/crank to sync Drift PnL
    pub fn update_position_value(ctx: Context<UpdatePositionValue>) -> Result<u64> {
        let adaptor = &mut ctx.accounts.adaptor;
        
        // In production, this would read from Drift user account:
        // - Collateral value
        // - Unrealized PnL from perpetual positions
        // - Funding payments received
        
        // For now, simulate a small yield (funding rate capture)
        let current_slot = Clock::get()?.slot;
        let slots_elapsed = current_slot.saturating_sub(adaptor.last_update_slot);
        
        // Simulate ~15% APY from basis trading (funding capture)
        // This is placeholder logic - real implementation reads from Drift
        if slots_elapsed > 0 && adaptor.current_position_value > 0 {
            let yield_per_slot = adaptor.current_position_value / 1_000_000; // ~0.0001% per slot
            let yield_earned = yield_per_slot.saturating_mul(slots_elapsed.min(1000));
            adaptor.current_position_value = adaptor.current_position_value.saturating_add(yield_earned);
        }
        
        adaptor.last_update_slot = current_slot;

        emit!(PositionValueUpdated {
            adaptor: adaptor.key(),
            new_value: adaptor.current_position_value,
            slot: current_slot,
        });

        Ok(adaptor.current_position_value)
    }

    /// Execute basis trade (open delta-neutral position)
    /// Manager calls this to capture funding rate
    pub fn execute_basis_trade(
        ctx: Context<ExecuteBasisTrade>,
        spot_amount: u64,
        perp_market_index: u16,
    ) -> Result<()> {
        let adaptor = &ctx.accounts.adaptor;
        
        require!(adaptor.is_active, AdaptorError::AdaptorInactive);
        require!(
            ctx.accounts.manager.key() == adaptor.authority,
            AdaptorError::Unauthorized
        );

        // In production, this would:
        // 1. Buy spot SOL (long exposure)
        // 2. Open short SOL-PERP (short exposure)
        // 3. Net delta = 0 (delta neutral)
        // 4. Earn funding rate when shorts pay longs

        emit!(BasisTradeExecuted {
            adaptor: adaptor.key(),
            spot_amount,
            perp_market_index,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Close basis trade (unwind delta-neutral position)
    pub fn close_basis_trade(
        ctx: Context<CloseBasisTrade>,
        perp_market_index: u16,
    ) -> Result<()> {
        let adaptor = &ctx.accounts.adaptor;
        
        require!(adaptor.is_active, AdaptorError::AdaptorInactive);
        require!(
            ctx.accounts.manager.key() == adaptor.authority,
            AdaptorError::Unauthorized
        );

        // In production, this would:
        // 1. Close short SOL-PERP position
        // 2. Sell spot SOL
        // 3. Return USDC to adaptor collateral

        emit!(BasisTradeClosed {
            adaptor: adaptor.key(),
            perp_market_index,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Pause adaptor (emergency)
    pub fn set_active(ctx: Context<SetActive>, active: bool) -> Result<()> {
        let adaptor = &mut ctx.accounts.adaptor;
        require!(
            ctx.accounts.authority.key() == adaptor.authority,
            AdaptorError::Unauthorized
        );
        
        adaptor.is_active = active;

        Ok(())
    }
}

// === Account Structures ===

#[account]
#[derive(Default)]
pub struct Adaptor {
    pub vault: Pubkey,              // Parent vault this adaptor serves
    pub authority: Pubkey,          // Manager who can execute trades
    pub drift_user: Pubkey,         // Drift user account
    pub drift_user_subaccount: u16, // Drift subaccount index
    pub total_deposited: u64,       // Total deposited from vault
    pub current_position_value: u64, // Current value including PnL
    pub last_update_slot: u64,      // Last position value update
    pub is_active: bool,            // Active/paused flag
    pub bump: u8,                   // PDA bump
}

// === Contexts ===

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Adaptor>(),
        seeds = [b"adaptor", vault.key().as_ref()],
        bump
    )]
    pub adaptor: Account<'info, Adaptor>,
    
    /// CHECK: Vault account from CrimsonVault program
    pub vault: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: Drift user account
    pub drift_user: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    
    /// CHECK: Vault authority PDA
    pub vault_authority: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub vault_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub adaptor_underlying: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    
    #[account(mut)]
    pub vault_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub adaptor_underlying: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdatePositionValue<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    
    /// CHECK: Drift user account for reading position
    pub drift_user: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ExecuteBasisTrade<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    
    pub manager: Signer<'info>,
    
    /// CHECK: Drift program
    pub drift_program: UncheckedAccount<'info>,
    
    /// CHECK: Drift user account
    #[account(mut)]
    pub drift_user: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct CloseBasisTrade<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    
    pub manager: Signer<'info>,
    
    /// CHECK: Drift program
    pub drift_program: UncheckedAccount<'info>,
    
    /// CHECK: Drift user account
    #[account(mut)]
    pub drift_user: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct SetActive<'info> {
    #[account(mut)]
    pub adaptor: Account<'info, Adaptor>,
    pub authority: Signer<'info>,
}

// === Events ===

#[event]
pub struct AdaptorInitialized {
    pub adaptor: Pubkey,
    pub vault: Pubkey,
    pub drift_user: Pubkey,
}

#[event]
pub struct DepositToAdaptor {
    pub adaptor: Pubkey,
    pub amount: u64,
    pub total_deposited: u64,
}

#[event]
pub struct WithdrawFromAdaptor {
    pub adaptor: Pubkey,
    pub amount: u64,
    pub remaining_value: u64,
}

#[event]
pub struct PositionValueUpdated {
    pub adaptor: Pubkey,
    pub new_value: u64,
    pub slot: u64,
}

#[event]
pub struct BasisTradeExecuted {
    pub adaptor: Pubkey,
    pub spot_amount: u64,
    pub perp_market_index: u16,
    pub timestamp: i64,
}

#[event]
pub struct BasisTradeClosed {
    pub adaptor: Pubkey,
    pub perp_market_index: u16,
    pub timestamp: i64,
}

// === Errors ===

#[error_code]
pub enum AdaptorError {
    #[msg("Adaptor is inactive")]
    AdaptorInactive,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Unauthorized")]
    Unauthorized,
}
