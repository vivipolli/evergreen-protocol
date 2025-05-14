use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("BrZ7wezEyEWncfSc2vu9dRs1yZP9uw9M7atpki9ovnL1");

// Constantes para taxas
const MINT_FEE_BASIS_POINTS: u64 = 200; // 2%
const SALE_FEE_BASIS_POINTS: u64 = 250; // 2.5%
const DISTRIBUTION_FEE_BASIS_POINTS: u64 = 50; // 0.5%

#[program]
pub mod backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

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
        vault.fee_account = ctx.accounts.fee_account.key();

        // Inicializa o token EVG-S
        token::initialize_mint(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::InitializeMint {
                    mint: ctx.accounts.evg_s_mint.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            9, // 9 casas decimais como USDC
            ctx.accounts.authority.key(),
            Some(ctx.accounts.authority.key()),
        )?;

        Ok(())
    }

    // Deposita USDC e recebe EVG-S
    pub fn deposit_usdc(
        ctx: Context<DepositUsdc>,
        amount: u64,
    ) -> Result<()> {
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

        // Calcular quantidade de EVG-S baseado no valor total do vault
        let evg_s_amount = calculate_evg_s_amount(amount, vault)?;

        // Emitir EVG-S tokens
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.evg_s_mint.to_account_info(),
                    to: ctx.accounts.user_evg_s_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
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
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.seller_usdc_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            seller_amount,
        )?;

        // Transfere taxa para o vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.vault_fee_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            sale_fee,
        )?;

        // Atualiza contadores do vault
        vault.total_evg_l_tokens += 1;

        Ok(())
    }

    // Distribui rendimentos para holders de EVG-S
    pub fn distribute_earnings(
        ctx: Context<DistributeEarnings>,
        amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // Calcula taxa de distribuição
        let distribution_fee = (amount * DISTRIBUTION_FEE_BASIS_POINTS) / 10000;
        let distribution_amount = amount - distribution_fee;

        // Transfere taxa para o tesouro
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.treasury_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            distribution_fee,
        )?;

        // Calcula distribuição por token EVG-S
        let evg_s_supply = vault.total_evg_s_supply;
        let amount_per_token = distribution_amount / evg_s_supply;

        // Distribui para todos os holders de EVG-S
        // (Implementação simplificada - na prática precisaria de um loop)
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.vault_usdc_account.to_account_info(),
                    to: ctx.accounts.holder_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount_per_token,
        )?;

        Ok(())
    }
}

// Função auxiliar para calcular quantidade de EVG-S
fn calculate_evg_s_amount(usdc_amount: u64, vault: &Account<Vault>) -> Result<u64> {
    if vault.total_evg_s_supply == 0 {
        // Primeiro depósito: 1:1
        return Ok(usdc_amount);
    }

    // Calcular baseado no valor total do vault
    let total_value = vault.total_evg_l_tokens * 1000000; // Valor médio por NFT em USDC
    let evg_s_amount = (usdc_amount * vault.total_evg_s_supply) / total_value;
    
    Ok(evg_s_amount)
}

// Erros personalizados
#[error_code]
pub enum VaultError {
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
    #[msg("Invalid token amount")]
    InvalidAmount,
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub total_evg_s_supply: u64,
    pub total_evg_l_tokens: u64,
    pub treasury_account: Pubkey,
    pub fee_account: Pubkey,
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8 + 8 + 32 + 32)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub evg_s_mint: Account<'info, Mint>,
    pub treasury_account: AccountInfo<'info>,
    pub fee_account: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositUsdc<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub evg_s_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_evg_s_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeEarnings<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub holder_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PurchaseEvgL<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub vault_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_fee_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_usdc_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
