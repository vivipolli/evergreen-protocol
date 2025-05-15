const { PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

class PdaService {
  constructor(programId) {
    this.programId = new PublicKey(programId);
  }

  // Gera PDAs para o vault
  async getVaultPdas() {
    const [vaultPda] = await PublicKey.findProgramAddress(
      [Buffer.from('vault')],
      this.programId
    );

    const [evgSMintPda] = await PublicKey.findProgramAddress(
      [Buffer.from('evg_s_mint')],
      this.programId
    );

    const [treasuryPda] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury')],
      this.programId
    );

    const [feePda] = await PublicKey.findProgramAddress(
      [Buffer.from('fee')],
      this.programId
    );

    return {
      vaultPda,
      evgSMintPda,
      treasuryPda,
      feePda
    };
  }

  // Gera ATAs para tokens
  async getTokenAccounts(owner, mints) {
    const accounts = {};
    
    for (const [key, mint] of Object.entries(mints)) {
      accounts[key] = await PublicKey.findAssociatedTokenAddress(
        owner,
        new PublicKey(mint)
      );
    }

    return accounts;
  }

  // Gera todas as contas necessárias para uma operação
  async getAllAccounts(walletAddress, usdcMint) {
    const [vaultPda] = await PublicKey.findProgramAddress(
      [Buffer.from('vault')],
      this.programId
    );

    const [evgSMintPda] = await PublicKey.findProgramAddress(
      [Buffer.from('evg_s_mint')],
      this.programId
    );

    const [treasuryPda] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury')],
      this.programId
    );

    const [feePda] = await PublicKey.findProgramAddress(
      [Buffer.from('fee')],
      this.programId
    );

    return {
      vaultPda,
      evgSMintPda,
      treasuryPda,
      feePda,
      tokenAccounts: {
        usdc: new PublicKey(usdcMint),
        evgS: evgSMintPda
      }
    };
  }
}

module.exports = PdaService;
