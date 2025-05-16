import { Link, useLocation } from 'react-router-dom';
import WalletButton from './WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const { connected } = useWallet();
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-evergreen-600">Evergreen</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
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
            {connected && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setIsRegistryOpen(!isRegistryOpen)}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      isActive('/registry')
                        ? 'bg-white text-gray-900'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    Registry
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform ${isRegistryOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isRegistryOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/registry/new"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsRegistryOpen(false)}
                        >
                          New Registry
                        </Link>
                        <Link
                          to="/registry/my-nfts"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsRegistryOpen(false)}
                        >
                          My Registries
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
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