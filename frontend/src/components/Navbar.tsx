import { Link, useLocation } from 'react-router-dom';
import WalletButton from './WalletButton';
import { useWallet } from '../hooks/useWallet';

export default function Navbar() {
  const location = useLocation();
  const { connected } = useWallet();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-evergreen-600">Evergreen</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {connected && (
              <>
                <Link
                  to="/registry"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/registry')
                      ? 'bg-white text-gray-900'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  Registry
                </Link>
                <Link
                  to="/whitepaper"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/whitepaper')
                      ? 'bg-white text-gray-900'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  White Paper
                </Link>
                <Link
                  to="/vault"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/vault')
                      ? 'bg-white text-gray-900'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  Vault
                </Link>
                <Link
                  to="/portfolio"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/portfolio')
                      ? 'bg-white text-gray-900'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
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