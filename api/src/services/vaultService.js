const { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, BN } = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const PdaService = require('./pdaService');
const fs = require('fs');
const idl = require('../idl/backend.json');

class VaultService {
  constructor() {
    // Initialize connection
    this.connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
    
    // Load wallet
    const walletKeypair = JSON.parse(
      fs.readFileSync(process.env.ANCHOR_WALLET, 'utf-8')
    );
    this.wallet = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
    
    // Initialize provider
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );

    // Initialize program
    this.programId = new PublicKey(process.env.VAULT_PROGRAM_ID);
    this.program = new Program(idl, this.programId, this.provider);
    this.pdaService = new PdaService(this.programId.toString());
  }

  async initializeVault(usdcMint) {
    try {
      const accounts = await this.pdaService.getAllAccounts(
        this.provider.wallet.publicKey,
        usdcMint
      );

      const tx = await this.program.methods
        .initializeVault(new PublicKey(usdcMint))
        .accounts({
          vault: accounts.vaultPda,
          authority: this.provider.wallet.publicKey,
          evgSMint: accounts.evgSMintPda,
          treasuryAccount: accounts.treasuryPda,
          feeAccount: accounts.feePda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('Error initializing vault:', error);
      throw error;
    }
  }

  async getVaultStats() {
    try {
      const accounts = await this.pdaService.getAllAccounts(
        this.wallet.publicKey.toString(),
        process.env.USDC_MINT
      );

      const vaultAccount = await this.program.account.vault.fetch(accounts.vaultPda);

      return {
        totalUsdc: vaultAccount.totalUsdc.toString(),
        totalEvgS: vaultAccount.totalEvgS.toString(),
        landTokens: []
      };
    } catch (error) {
      console.error('Error fetching vault stats:', error);
      throw error;
    }
  }

  async depositUsdc(amount) {
    try {
      const accounts = await this.pdaService.getAllAccounts(
        this.wallet.publicKey.toString(),
        process.env.USDC_MINT
      );

      const tx = await this.program.methods
        .depositUsdc(new BN(amount))
        .accounts({
          vault: accounts.vaultPda,
          userUsdcAccount: accounts.tokenAccounts.usdc,
          vaultUsdcAccount: accounts.tokenAccounts.usdc,
          userEvgSAccount: accounts.tokenAccounts.evgS,
          user: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, transactionId: tx };
    } catch (error) {
      console.error('Error depositing USDC:', error);
      throw error;
    }
  }

  async purchaseEvgL(price, sellerAddress) {
    try {
      const tx = await this.program.methods
        .purchaseEvgL(new BN(price))
        .accounts({
          vault: vaultPDA,
          vaultUsdcAccount: vaultUsdcATA,
          vaultFeeAccount: vaultFeeATA,
          sellerUsdcAccount: sellerUsdcATA,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('Error purchasing EVG-L:', error);
      throw error;
    }
  }

  async distributeEarnings(amount) {
    try {
      const tx = await this.program.methods
        .distributeEarnings(new BN(amount))
        .accounts({
          vault: vaultPDA,
          vaultUsdcAccount: vaultUsdcATA,
          treasuryAccount: treasuryATA,
          holderAccount: holderATA,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('Error distributing earnings:', error);
      throw error;
    }
  }
}

module.exports = new VaultService();
