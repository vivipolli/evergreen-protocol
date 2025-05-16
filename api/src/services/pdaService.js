const { PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

class PdaService {
  constructor(programId) {
    this.programId = new PublicKey(programId);
  }

  async getEvgSMintPda() {
    const [mintPda] = await PublicKey.findProgramAddress(
      [Buffer.from('evg_s_mint')],
      this.programId
    );
    return mintPda;
  }

  async getEvgLMintPda() {
    const [mintPda] = await PublicKey.findProgramAddress(
      [Buffer.from('evg_l_mint')],
      this.programId
    );
    return mintPda;
  }

  async getVaultUsdcAccountPda() {
    const [accountPda] = await PublicKey.findProgramAddress(
      [Buffer.from('vault_usdc')],
      this.programId
    );
    return accountPda;
  }

  async getVaultEvgSAccountPda() {
    const [accountPda] = await PublicKey.findProgramAddress(
      [Buffer.from('vault_evg_s')],
      this.programId
    );
    return accountPda;
  }

  async getVaultEvgLAccountPda() {
    const [accountPda] = await PublicKey.findProgramAddress(
      [Buffer.from('vault_evg_l')],
      this.programId
    );
    return accountPda;
  }

  async getUserTokenAccountPda(userAddress, mintAddress) {
    const [accountPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('user_token'),
        new PublicKey(userAddress).toBuffer(),
        new PublicKey(mintAddress).toBuffer()
      ],
      this.programId
    );
    return accountPda;
  }

  async getAllAccounts(userAddress, usdcMintAddress) {
    const evgSMintPda = await this.getEvgSMintPda();
    const evgLMintPda = await this.getEvgLMintPda();
    const vaultUsdcAccountPda = await this.getVaultUsdcAccountPda();
    const vaultEvgSAccountPda = await this.getVaultEvgSAccountPda();
    const vaultEvgLAccountPda = await this.getVaultEvgLAccountPda();

    const userUsdcAccountPda = await this.getUserTokenAccountPda(userAddress, usdcMintAddress);
    const userEvgSAccountPda = await this.getUserTokenAccountPda(userAddress, evgSMintPda.toString());
    const userEvgLAccountPda = await this.getUserTokenAccountPda(userAddress, evgLMintPda.toString());

    return {
      evgSMintPda,
      evgLMintPda,
      tokenAccounts: {
        usdc: userUsdcAccountPda,
        evgS: userEvgSAccountPda,
        evgL: userEvgLAccountPda,
        vaultUsdc: vaultUsdcAccountPda,
        vaultEvgS: vaultEvgSAccountPda,
        vaultEvgL: vaultEvgLAccountPda
      }
    };
  }
}

module.exports = PdaService;
