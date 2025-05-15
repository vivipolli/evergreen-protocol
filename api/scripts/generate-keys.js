const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Create keys directory if it doesn't exist
const keysDir = path.join(__dirname, '../keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Generate Anchor Wallet keypair
const anchorWalletKeypair = Keypair.generate();
fs.writeFileSync(
  path.join(keysDir, 'anchor-wallet-keypair.json'),
  JSON.stringify(Array.from(anchorWalletKeypair.secretKey))
);
console.log('Anchor Wallet Public Key:', anchorWalletKeypair.publicKey.toString());

// Generate Vault Program keypair
const vaultProgramKeypair = Keypair.generate();
fs.writeFileSync(
  path.join(keysDir, 'vault-program-keypair.json'),
  JSON.stringify(Array.from(vaultProgramKeypair.secretKey))
);
console.log('Vault Program ID:', vaultProgramKeypair.publicKey.toString());

// Generate Vault Account keypair
const vaultAccountKeypair = Keypair.generate();
fs.writeFileSync(
  path.join(keysDir, 'vault-account-keypair.json'),
  JSON.stringify(Array.from(vaultAccountKeypair.secretKey))
);
console.log('Vault Account:', vaultAccountKeypair.publicKey.toString());

// Print USDC mint addresses
console.log('\nUSDC Mint Addresses:');
console.log('Devnet:', '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
console.log('Mainnet:', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

console.log('\nKeys generated successfully!');
console.log('Update your .env file with these values:');
console.log(`
ANCHOR_WALLET=${path.join(keysDir, 'anchor-wallet-keypair.json')}
VAULT_PROGRAM_ID=${vaultProgramKeypair.publicKey.toString()}
VAULT_ACCOUNT=${vaultAccountKeypair.publicKey.toString()}
USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU # Devnet USDC
`); 