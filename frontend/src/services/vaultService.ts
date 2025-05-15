import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface VaultStats {
  totalUsdc: number;
  totalEvgS: number;
  landTokens: {
    address: string;
    name: string;
    value: number;
  }[];
}

class VaultService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
  }

  async getVaultStats(walletAddress: string): Promise<VaultStats> {
    try {
      const response = await fetch(`/api/vault/stats?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vault stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vault stats:', error);
      throw error;
    }
  }

  async depositUsdc(walletAddress: string, amount: number): Promise<string> {
    try {
      const response = await fetch('/api/vault/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletAddress,
          amount
        }),
      });

      if (!response.ok) {
        throw new Error('Deposit failed');
      }

      const { tx } = await response.json();
      return tx;
    } catch (error) {
      console.error('Error depositing USDC:', error);
      throw error;
    }
  }

  async getEvgSBalance(walletAddress: string): Promise<number> {
    try {
      const response = await fetch(`/api/vault/evgs-balance?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch EVG-S balance');
      }
      const { balance } = await response.json();
      return balance;
    } catch (error) {
      console.error('Error fetching EVG-S balance:', error);
      throw error;
    }
  }

  async getLandTokens(walletAddress: string): Promise<Array<{ address: string; name: string; value: number }>> {
    try {
      const response = await fetch(`/api/vault/land-tokens?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch land tokens');
      }
      const { tokens } = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error fetching land tokens:', error);
      throw error;
    }
  }
}

export const vaultService = new VaultService(); 