import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, getAccount } from '@solana/spl-token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // Devnet USDC

interface VaultStats {
  totalEvgS: string;
  totalEvgL: string;
  authority: string;
  usdcMint: string;
  treasuryAccount: string;
}

class VaultService {
  private connection: Connection;
  private wallet: any;

  constructor() {
    this.connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'http://localhost:8899');
  }

  setWallet(wallet: any) {
    this.wallet = wallet;
  }

  async getVaultStats(walletAddress: string): Promise<VaultStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vault/stats?wallet=${walletAddress}`);
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
      if (!this.wallet) {
        throw new Error('Wallet not connected');
      }

      // Get the vault's USDC account
      const response = await fetch(`${API_BASE_URL}/api/vault/stats?wallet=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vault stats');
      }
      const vaultStats = await response.json();
      const vaultUsdcAccount = new PublicKey(vaultStats.treasuryAccount);

      // Get the user's USDC account
      const userUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        new PublicKey(walletAddress)
      );

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        userUsdcAccount,
        vaultUsdcAccount,
        new PublicKey(walletAddress),
        amount * 1e6 // Convert to USDC decimals (6)
      );

      // Create transaction and add recent blockhash
      const transaction = new Transaction();
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletAddress);
      transaction.add(transferInstruction);

      // Sign transaction with wallet
      const signedTransaction = await this.wallet.adapter.signTransaction(transaction);
      
      // Send transaction to backend for processing
      const response2 = await fetch(`${API_BASE_URL}/api/vault/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletAddress,
          amount,
          transaction: signedTransaction.serialize().toString('base64')
        }),
      });

      if (!response2.ok) {
        throw new Error('Deposit failed');
      }

      const { tx } = await response2.json();
      return tx;
    } catch (error) {
      console.error('Error depositing USDC:', error);
      throw error;
    }
  }

  async getEvgSBalance(walletAddress: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vault/evgs-balance?wallet=${walletAddress}`);
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
      const response = await fetch(`${API_BASE_URL}/api/vault/land-tokens?wallet=${walletAddress}`);
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

  async getUsdcBalance(walletAddress: string): Promise<number> {
    try {
      const userUsdcAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        new PublicKey(walletAddress)
      );

      const account = await getAccount(this.connection, userUsdcAccount);
      return Number(account.amount) / 1e6; // Convert from USDC decimals (6) to whole units
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return 0;
    }
  }
}

export const vaultService = new VaultService(); 