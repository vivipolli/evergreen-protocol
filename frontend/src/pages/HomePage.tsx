import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-evergreen-700 mb-6">
        Welcome to Evergreen Protocol
      </h1>
      <p className="text-lg text-water-600 mb-8">
        Tokenize your land, preserve nature, and create sustainable value.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/create"
          className="card hover:shadow-eco-lg transition-shadow bg-earth-50"
        >
          <h2 className="text-xl font-semibold text-earth-700 mb-2">
            Create Land Token
          </h2>
          <p className="text-earth-600">
            Register your property and create a new land token.
          </p>
        </Link>
        <Link
          to="/marketplace"
          className="card hover:shadow-eco-lg transition-shadow bg-water-50"
        >
          <h2 className="text-xl font-semibold text-water-700 mb-2">
            Marketplace
          </h2>
          <p className="text-water-600">
            Browse and invest in land tokens.
          </p>
        </Link>
        <Link
          to="/vault"
          className="card hover:shadow-eco-lg transition-shadow bg-evergreen-50"
        >
          <h2 className="text-xl font-semibold text-evergreen-700 mb-2">
            Vault
          </h2>
          <p className="text-evergreen-600">
            Manage your EVG-S tokens and USDC deposits.
          </p>
        </Link>
        <Link
          to="/portfolio"
          className="card hover:shadow-eco-lg transition-shadow bg-accent-50"
        >
          <h2 className="text-xl font-semibold text-accent-700 mb-2">
            Portfolio
          </h2>
          <p className="text-accent-600">
            View and manage your land token investments.
          </p>
        </Link>
      </div>
    </div>
  );
} 