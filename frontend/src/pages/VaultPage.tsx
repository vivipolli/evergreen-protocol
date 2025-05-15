import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { Input } from '../components/ui/Input';
import { vaultService } from '../services/vaultService';

interface VaultStats {
  totalUsdc: number;
  totalEvgS: number;
  landTokens: {
    address: string;
    name: string;
    value: number;
  }[];
}

export default function VaultPage() {
  const { publicKey, connected } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    totalUsdc: 0,
    totalEvgS: 0,
    landTokens: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      fetchVaultStats();
    }
  }, [connected, publicKey]);

  const fetchVaultStats = async () => {
    try {
      setIsLoading(true);
      const stats = await vaultService.getVaultStats(publicKey!.toString());
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
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const tx = await vaultService.depositUsdc(
        publicKey.toString(),
        parseFloat(depositAmount)
      );

      console.log('Deposit transaction:', tx);
      await fetchVaultStats();
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
          <h2 className="text-3xl font-bold text-evergreen-700">Connect Your Wallet</h2>
          <p className="mt-4 text-lg text-evergreen-600">
            Please connect your wallet to access the Evergreen Vault
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-evergreen-700 mb-8">Evergreen Vault</h1>
        
        {/* Vault Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-evergreen-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-evergreen-700">Total USDC</h3>
            <p className="text-2xl font-bold text-evergreen-600">${vaultStats.totalUsdc.toFixed(2)}</p>
          </div>
          <div className="bg-evergreen-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-evergreen-700">EVG-S Tokens</h3>
            <p className="text-2xl font-bold text-evergreen-600">{vaultStats.totalEvgS.toFixed(2)}</p>
          </div>
          <div className="bg-evergreen-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-evergreen-700">Land Tokens</h3>
            <p className="text-2xl font-bold text-evergreen-600">{vaultStats.landTokens.length}</p>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="bg-evergreen-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-evergreen-700 mb-4">Deposit USDC</h2>
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

        {/* Land Tokens List */}
        <div className="bg-evergreen-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-evergreen-700 mb-4">Land Tokens in Vault</h2>
          {vaultStats.landTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaultStats.landTokens.map((token) => (
                <div key={token.address} className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-medium text-evergreen-700">{token.name}</h3>
                  <p className="text-sm text-evergreen-600">Value: ${token.value.toFixed(2)}</p>
                  <p className="text-xs text-evergreen-500 truncate">{token.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-evergreen-600">No land tokens in vault yet</p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 