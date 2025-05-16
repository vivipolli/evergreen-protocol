use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

mod getrandom_backend;

declare_id!("FrhgU1YQivVRKdbW9iFGfBiVYLSkuCuM8ZyjXiMrtNF1");

// Constantes para taxas
const SALE_FEE_BASIS_POINTS: u64 = 250; // 2.5%

#[program]
pub mod backend {
    use super::*;

    // Inicializa o vault e cria o token EVG-S
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        usdc_mint: Pubkey,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.usdc_mint = usdc_mint;
        vault.total_evg_s_supply = 0;
        vault.total_evg_l_tokens = 0;
        vault.treasury_account = ctx.accounts.treasury_account.key();

        Ok(())
    }

    // Deposita USDC e recebe EVG-S
    pub fn deposit_usdc(
        ctx: Context<DepositUsdc>,
        amount: u64,
    ) -> Result<()> {
        // Get vault_info first
        let vault_info = ctx.accounts.vault.to_account_info();
        let vault = &mut ctx.accounts.vault;
        
        // Transferir USDC para o vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.user_usdc_account.to_account_info(),
                    to: ctx.accounts.vault_usdc_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Calcular quantidade de EVG-S (1:1 para simplificar)
        let evg_s_amount = amount;

        // Emitir EVG-S tokens
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: vault_info,
                },
                &[&[
                    b"vault".as_ref(),
                    &[*ctx.bumps.get("vault").unwrap()],
                ]],
            ),
            evg_s_amount,
        )?;

        // Atualizar supply total
        vault.total_evg_s_supply += evg_s_amount;

        Ok(())
    }

    // Compra EVG-L token
    pub fn purchase_evg_l(
        ctx: Context<PurchaseEvgL>,
        price: u64,
    ) -> Result<()> {
        // Get vault_info first
        let vault_info = ctx.accounts.vault.to_account_info();
        let vault = &mut ctx.accounts.vault;
        
        // Validar se o vault tem USDC suficiente
        require!(
            ctx.accounts.vault_usdc_account.amount >= price,
            VaultError::InsufficientFunds
        );

        // Calcula taxas
        let sale_fee = (price * SALE_FEE_BASIS_POINTS) / 10000;
        let seller_amount = price - sale_fee;

        // Transfere USDC para o vendedor
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.seller_usdc_account.to_account_info(),
                    authority: vault_info,
                },
                &[&[
                    b"vault".as_ref(),
                    &[*ctx.bumps.get("vault").unwrap()],
                ]],
            ),
            seller_amount,
        )?;

        // Atualiza contadores do vault
        vault.total_evg_l_tokens += 1;

        Ok(())
    }
}

// Erros personalizados
#[error_code]
pub enum VaultError {
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
    #[msg("Invalid token amount")]
    InvalidAmount,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub total_evg_s_supply: u64,
    pub total_evg_l_tokens: u64,
    pub treasury_account: Pubkey,
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8 + 8 + 32, seeds = [b"vault"], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [b"evg_s_mint"],
        bump,
        mint::decimals = 9,
        mint::authority = vault,
    )]
    pub mint: Account<'info, Mint>,
    pub treasury_account: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositUsdc<'info> {
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PurchaseEvgL<'info> {
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_usdc_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
