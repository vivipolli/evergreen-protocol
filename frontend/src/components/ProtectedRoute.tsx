import { Navigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { connected } = useWallet();

  if (!connected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 