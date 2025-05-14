const { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const PdaService = require('./pdaService');
const idl = require('../idl/backend.json');

class VaultService {
  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
    this.provider = new AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed' }
    );
    this.program = new Program(idl, process.env.PROGRAM_ID, this.provider);
    this.pdaService = new PdaService(process.env.PROGRAM_ID);
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

  async depositUsdc(amount) {
    try {
      const accounts = await this.pdaService.getAllAccounts(
        this.provider.wallet.publicKey,
        process.env.USDC_MINT
      );

      const tx = await this.program.methods
        .depositUsdc(new BN(amount))
        .accounts({
          vault: accounts.vaultPda,
          userUsdcAccount: accounts.tokenAccounts.usdc,
          vaultUsdcAccount: accounts.tokenAccounts.usdc,
          evgSMint: accounts.evgSMintPda,
          userEvgSAccount: accounts.tokenAccounts.evgS,
          user: this.provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      return { success: true, tx };
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
