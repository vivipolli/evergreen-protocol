import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Input } from '../components/ui/Input';
import { vaultService } from '../services/vaultService';

interface VaultStats {
  totalEvgS: string;
  totalEvgL: string;
  authority: string;
  usdcMint: string;
  treasuryAccount: string;
}

export default function VaultPage() {
  const { publicKey, connected, wallet } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    totalEvgS: '0',
    totalEvgL: '0',
    authority: '',
    usdcMint: '',
    treasuryAccount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      if (connected && publicKey && wallet) {
        console.log('Setting wallet:', wallet);
        vaultService.setWallet(wallet);
        await fetchVaultStats();
        await fetchUsdcBalance();
      }
    };

    initializeWallet();
  }, [connected, publicKey, wallet]);

  const fetchUsdcBalance = async () => {
    if (!publicKey) return;
    
    try {
      const balance = await vaultService.getUsdcBalance(publicKey.toString());
      setUsdcBalance(balance);
    } catch (err) {
      console.error('Error fetching USDC balance:', err);
    }
  };

  const fetchVaultStats = async () => {
    if (!publicKey) return;
    
    try {
      setIsLoading(true);
      const stats = await vaultService.getVaultStats(publicKey.toString());
      setVaultStats(stats);
    } catch (err) {
      setError('Failed to fetch vault statistics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !wallet) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure wallet is set before deposit
      vaultService.setWallet(wallet);
      
      const tx = await vaultService.depositUsdc(
        publicKey.toString(),
        parseFloat(depositAmount)
      );

      console.log('Deposit transaction:', tx);
      await fetchVaultStats();
      await fetchUsdcBalance();
      setDepositAmount('');
    } catch (err) {
      setError('Failed to deposit USDC');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-evergreen-400">Connect Your Wallet</h2>
          <p className="mt-4 text-lg text-gray-300">
            Please connect your wallet to access the Evergreen Vault
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#0F2A0F] rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-evergreen-400 mb-8">Evergreen Vault</h1>
        
        {/* Vault Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">USDC Balance</h3>
            <p className="text-2xl font-bold text-gray-900">{usdcBalance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">EVG-S Tokens</h3>
            <p className="text-2xl font-bold text-gray-900">{parseFloat(vaultStats.totalEvgS).toFixed(2)}</p>
          </div>
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">EVG-L Tokens</h3>
            <p className="text-2xl font-bold text-gray-900">{parseFloat(vaultStats.totalEvgL).toFixed(2)}</p>
          </div>
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800">Authority</h3>
            <p className="text-sm font-bold text-gray-900 truncate">{vaultStats.authority}</p>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="bg-gray-300 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Deposit USDC</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <Input
              label="Amount (USDC)"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-evergreen-600 hover:bg-evergreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-evergreen-500 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Deposit USDC'}
            </button>
          </form>
        </div>

        {/* Vault Info */}
        <div className="bg-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vault Information</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">USDC Mint:</span> {vaultStats.usdcMint}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Treasury Account:</span> {vaultStats.treasuryAccount}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 