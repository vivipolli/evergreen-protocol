import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return (
    <WalletMultiButton 
      style={{ 
        backgroundColor: '#059669', 
        color: 'white',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500'
      }} 
      className="hover:opacity-90 transition-opacity"
    />
  );
} 