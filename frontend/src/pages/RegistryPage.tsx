import { Link } from 'react-router-dom';

export default function RegistryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-evergreen-700 mb-8">Land Registry</h1>
        <p className="text-lg text-evergreen-600 mb-12">
          Manage your land tokens and create new registries
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/registry/new"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-evergreen-700 mb-4">New Registry</h2>
            <p className="text-evergreen-600">
              Create a new land token registry with your property details
            </p>
          </Link>

          <Link
            to="/registry/my-nfts"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold text-evergreen-700 mb-4">My Registries</h2>
            <p className="text-evergreen-600">
              View and manage your existing land token registries
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
} 