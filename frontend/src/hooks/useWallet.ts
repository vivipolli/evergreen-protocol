import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

export const useWallet = () => {
  const { connection } = useConnection();
  const wallet = useSolanaWallet();

  const connect = async () => {
    try {
      await wallet.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await wallet.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const getBalance = async (publicKey: PublicKey): Promise<number> => {
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };

  return {
    ...wallet,
    connection,
    connect,
    disconnect,
    getBalance,
  };
}; 