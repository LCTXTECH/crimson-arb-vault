use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("CrmsnVLT1111111111111111111111111111111111");

/// CrimsonArb Vault Program
/// Architecture follows Ranger/Voltr pattern:
/// - Vault holds user deposits and manages LP token accounting
/// - Calls Custom Adaptor via CPI for fund allocation
/// - Adaptor translates to target protocol (Drift)
#[program]
pub mod crimson_vault {
    use super::*;

    /// Initialize a new CrimsonArb vault
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        vault_config: VaultConfig,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.admin = ctx.accounts.admin.key();
        vault.manager = ctx.accounts.admin.key(); // Admin is initial manager
        vault.underlying_mint = ctx.accounts.underlying_mint.key();
        vault.lp_mint = ctx.accounts.lp_mint.key();
        vault.total_deposits = 0;
        vault.total_lp_supply = 0;
        vault.performance_fee_bps = vault_config.performance_fee_bps;
        vault.management_fee_bps = vault_config.management_fee_bps;
        vault.deposit_cap = vault_config.deposit_cap;
        vault.is_paused = false;
        vault.bump = ctx.bumps.vault;
        
        emit!(VaultInitialized {
            vault: vault.key(),
            admin: vault.admin,
            underlying_mint: vault.underlying_mint,
        });
        
        Ok(())
    }

    /// Deposit underlying tokens and receive LP tokens
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require!(!vault.is_paused, VaultError::VaultPaused);
        require!(amount > 0, VaultError::InvalidAmount);
        require!(
            vault.total_deposits.checked_add(amount).unwrap() <= vault.deposit_cap,
            VaultError::DepositCapExceeded
        );

        // Calculate LP tokens to mint based on exchange rate
        let lp_to_mint = calculate_lp_tokens(amount, vault.total_deposits, vault.total_lp_supply);

        // Transfer underlying tokens from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_underlying.to_account_info(),
            to: ctx.accounts.vault_underlying.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Mint LP tokens to user
        let seeds = &[
            b"vault".as_ref(),
            vault.underlying_mint.as_ref(),
            &[vault.bump],
        ];
        let signer = &[&seeds[..]];
        
        let mint_accounts = token::MintTo {
            mint: ctx.accounts.lp_mint.to_account_info(),
            to: ctx.accounts.user_lp.to_account_info(),
            authority: vault.to_account_info(),
        };
        let mint_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            mint_accounts,
            signer,
        );
        token::mint_to(mint_ctx, lp_to_mint)?;

        // Update vault state
        vault.total_deposits = vault.total_deposits.checked_add(amount).unwrap();
        vault.total_lp_supply = vault.total_lp_supply.checked_add(lp_to_mint).unwrap();

        emit!(DepositEvent {
            vault: vault.key(),
            user: ctx.accounts.user.key(),
            amount,
            lp_minted: lp_to_mint,
        });

        Ok(())
    }

    /// Withdraw underlying tokens by burning LP tokens
    pub fn withdraw(ctx: Context<Withdraw>, lp_amount: u64) -> Result<u64> {
        let vault = &mut ctx.accounts.vault;
        
        require!(!vault.is_paused, VaultError::VaultPaused);
        require!(lp_amount > 0, VaultError::InvalidAmount);

        // Calculate underlying tokens to return based on exchange rate
        let underlying_to_return = calculate_underlying_tokens(
            lp_amount,
            vault.total_deposits,
            vault.total_lp_supply,
        );

        // Burn LP tokens from user
        let burn_accounts = token::Burn {
            mint: ctx.accounts.lp_mint.to_account_info(),
            from: ctx.accounts.user_lp.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let burn_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
        token::burn(burn_ctx, lp_amount)?;

        // Transfer underlying tokens from vault to user
        let seeds = &[
            b"vault".as_ref(),
            vault.underlying_mint.as_ref(),
            &[vault.bump],
        ];
        let signer = &[&seeds[..]];
        
        let transfer_accounts = Transfer {
            from: ctx.accounts.vault_underlying.to_account_info(),
            to: ctx.accounts.user_underlying.to_account_info(),
            authority: vault.to_account_info(),
        };
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_accounts,
            signer,
        );
        token::transfer(transfer_ctx, underlying_to_return)?;

        // Update vault state
        vault.total_deposits = vault.total_deposits.checked_sub(underlying_to_return).unwrap();
        vault.total_lp_supply = vault.total_lp_supply.checked_sub(lp_amount).unwrap();

        emit!(WithdrawEvent {
            vault: vault.key(),
            user: ctx.accounts.user.key(),
            lp_burned: lp_amount,
            underlying_returned: underlying_to_return,
        });

        Ok(underlying_to_return)
    }

    /// Allocate funds to adaptor for yield generation (Manager only)
    pub fn allocate_to_adaptor(
        ctx: Context<AllocateToAdaptor>,
        amount: u64,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        
        require!(!vault.is_paused, VaultError::VaultPaused);
        require!(
            ctx.accounts.manager.key() == vault.manager,
            VaultError::Unauthorized
        );

        // CPI call to adaptor's deposit instruction
        // This follows the Voltr SDK pattern for adaptor integration
        let adaptor_cpi_accounts = crimson_adaptor::cpi::accounts::Deposit {
            adaptor: ctx.accounts.adaptor.to_account_info(),
            vault_authority: vault.to_account_info(),
            vault_underlying: ctx.accounts.vault_underlying.to_account_info(),
            adaptor_underlying: ctx.accounts.adaptor_underlying.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };
        
        let seeds = &[
            b"vault".as_ref(),
            vault.underlying_mint.as_ref(),
            &[vault.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.adaptor_program.to_account_info(),
            adaptor_cpi_accounts,
            signer,
        );
        
        crimson_adaptor::cpi::deposit(cpi_ctx, amount)?;

        emit!(AllocationEvent {
            vault: vault.key(),
            adaptor: ctx.accounts.adaptor.key(),
            amount,
        });

        Ok(())
    }

    /// Update vault manager (Admin only)
    pub fn update_manager(ctx: Context<UpdateManager>, new_manager: Pubkey) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        require!(
            ctx.accounts.admin.key() == vault.admin,
            VaultError::Unauthorized
        );
        
        let old_manager = vault.manager;
        vault.manager = new_manager;

        emit!(ManagerUpdated {
            vault: vault.key(),
            old_manager,
            new_manager,
        });

        Ok(())
    }

    /// Pause/unpause vault (Admin only)
    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        require!(
            ctx.accounts.admin.key() == vault.admin,
            VaultError::Unauthorized
        );
        
        vault.is_paused = paused;

        emit!(VaultPausedEvent {
            vault: vault.key(),
            paused,
        });

        Ok(())
    }
}

// === Account Structures ===

#[account]
#[derive(Default)]
pub struct Vault {
    pub admin: Pubkey,           // Can update manager, pause vault
    pub manager: Pubkey,         // Can allocate funds to adaptors
    pub underlying_mint: Pubkey, // USDC mint
    pub lp_mint: Pubkey,         // crmSOL or similar LP token
    pub total_deposits: u64,     // Total underlying in vault
    pub total_lp_supply: u64,    // Total LP tokens minted
    pub performance_fee_bps: u16, // Performance fee in basis points
    pub management_fee_bps: u16,  // Annual management fee in bps
    pub deposit_cap: u64,        // Maximum deposits allowed
    pub is_paused: bool,         // Emergency pause flag
    pub bump: u8,                // PDA bump seed
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultConfig {
    pub performance_fee_bps: u16,
    pub management_fee_bps: u16,
    pub deposit_cap: u64,
}

// === Contexts ===

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<Vault>(),
        seeds = [b"vault", underlying_mint.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub underlying_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = admin,
        mint::decimals = 6,
        mint::authority = vault,
    )]
    pub lp_mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_lp: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_lp: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_underlying: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AllocateToAdaptor<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    
    pub manager: Signer<'info>,
    
    #[account(mut)]
    pub vault_underlying: Account<'info, TokenAccount>,
    
    /// CHECK: Adaptor account validated by adaptor program
    #[account(mut)]
    pub adaptor: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub adaptor_underlying: Account<'info, TokenAccount>,
    
    /// CHECK: Adaptor program ID
    pub adaptor_program: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateManager<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub admin: Signer<'info>,
}

// === Helper Functions ===

fn calculate_lp_tokens(deposit_amount: u64, total_deposits: u64, total_lp_supply: u64) -> u64 {
    if total_lp_supply == 0 || total_deposits == 0 {
        // Initial deposit: 1:1 ratio
        deposit_amount
    } else {
        // LP tokens = deposit * (total_lp / total_deposits)
        (deposit_amount as u128)
            .checked_mul(total_lp_supply as u128)
            .unwrap()
            .checked_div(total_deposits as u128)
            .unwrap() as u64
    }
}

fn calculate_underlying_tokens(lp_amount: u64, total_deposits: u64, total_lp_supply: u64) -> u64 {
    if total_lp_supply == 0 {
        0
    } else {
        // Underlying = lp * (total_deposits / total_lp)
        (lp_amount as u128)
            .checked_mul(total_deposits as u128)
            .unwrap()
            .checked_div(total_lp_supply as u128)
            .unwrap() as u64
    }
}

// === Events ===

#[event]
pub struct VaultInitialized {
    pub vault: Pubkey,
    pub admin: Pubkey,
    pub underlying_mint: Pubkey,
}

#[event]
pub struct DepositEvent {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub lp_minted: u64,
}

#[event]
pub struct WithdrawEvent {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub lp_burned: u64,
    pub underlying_returned: u64,
}

#[event]
pub struct AllocationEvent {
    pub vault: Pubkey,
    pub adaptor: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ManagerUpdated {
    pub vault: Pubkey,
    pub old_manager: Pubkey,
    pub new_manager: Pubkey,
}

#[event]
pub struct VaultPausedEvent {
    pub vault: Pubkey,
    pub paused: bool,
}

// === Errors ===

#[error_code]
pub enum VaultError {
    #[msg("Vault is paused")]
    VaultPaused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Deposit cap exceeded")]
    DepositCapExceeded,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
}

// === CPI Module for Adaptor ===
// Placeholder for adaptor CPI - to be generated by Anchor
pub mod crimson_adaptor {
    use super::*;
    
    pub mod cpi {
        use super::*;
        
        pub mod accounts {
            use super::*;
            
            #[derive(Accounts)]
            pub struct Deposit<'info> {
                /// CHECK: Adaptor account
                pub adaptor: AccountInfo<'info>,
                /// CHECK: Vault authority
                pub vault_authority: AccountInfo<'info>,
                /// CHECK: Vault underlying token account
                pub vault_underlying: AccountInfo<'info>,
                /// CHECK: Adaptor underlying token account
                pub adaptor_underlying: AccountInfo<'info>,
                /// CHECK: Token program
                pub token_program: AccountInfo<'info>,
            }
        }
        
        pub fn deposit<'info>(
            _ctx: CpiContext<'_, '_, '_, 'info, accounts::Deposit<'info>>,
            _amount: u64,
        ) -> Result<()> {
            // CPI call implemented by Anchor
            Ok(())
        }
    }
}
