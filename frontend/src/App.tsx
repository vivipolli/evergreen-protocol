import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletContextProvider } from './contexts/WalletContext';
import Navbar from './components/Navbar';
import CreateLandTokenPage from './pages/CreateLandTokenPage';
import MarketplacePage from './pages/MarketplacePage';
import VaultPage from './pages/VaultPage';
import PortfolioPage from './pages/PortfolioPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <WalletContextProvider>
      <Router>
        <div className="min-h-screen bg-evergreen-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateLandTokenPage />
                </ProtectedRoute>
              } />
              <Route path="/vault" element={
                <ProtectedRoute>
                  <VaultPage />
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WalletContextProvider>
  );
}
