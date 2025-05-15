import { Link, useLocation } from 'react-router-dom';
import WalletButton from './WalletButton';
import { useWallet } from '../hooks/useWallet';

export default function Navbar() {
  const location = useLocation();
  const { connected } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-evergreen-700 shadow-eco">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Evergreen</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {connected && (
              <>
                <Link
                  to="/create"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/create')
                      ? 'bg-earth-500 text-white'
                      : 'text-white hover:bg-earth-500/20'
                  }`}
                >
                  Create Token
                </Link>
                <Link
                  to="/vault"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/vault')
                      ? 'bg-earth-500 text-white'
                      : 'text-white hover:bg-earth-500/20'
                  }`}
                >
                  Vault
                </Link>
                <Link
                  to="/portfolio"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/portfolio')
                      ? 'bg-earth-500 text-white'
                      : 'text-white hover:bg-earth-500/20'
                  }`}
                >
                  Portfolio
                </Link>
              </>
            )}
            <div className="ml-4">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 