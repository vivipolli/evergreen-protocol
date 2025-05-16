const { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, BN, Wallet, workspace } = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require('@solana/spl-token');
const PdaService = require('./pdaService');
const fs = require('fs');
const path = require('path');
const { Transaction } = require('@solana/web3.js');
const idl = require('../idl/backend.json');

class VaultService {
  constructor() {
    console.log('Initializing VaultService...');
    
    // Initialize connection with retry
    const rpcUrl = process.env.SOLANA_RPC_URL || 'http://localhost:8899';
    console.log('Connecting to Solana at:', rpcUrl);
    
    try {
      this.connection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        wsEndpoint: rpcUrl.replace('http', 'ws')
      });
      
      // Test connection
      this.connection.getVersion()
        .then(version => console.log('Connected to Solana version:', version))
        .catch(err => {
          console.error('Failed to connect to Solana:', err);
          throw new Error(`Failed to connect to Solana: ${err.message}`);
        });
    } catch (error) {
      console.error('Error initializing connection:', error);
      throw new Error(`Failed to initialize Solana connection: ${error.message}`);
    }
    
    // Load wallet
    try {
      let keypair;
      if (process.env.NODE_ENV === 'production') {
        // In production, use private key from environment variable
        const privateKeyString = process.env.WALLET_PRIVATE_KEY;
        if (!privateKeyString) {
          throw new Error('WALLET_PRIVATE_KEY environment variable is not set');
        }
        const privateKeyArray = privateKeyString.split(',').map(num => parseInt(num));
        keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
      } else {
        // In development, use wallet file
        const walletPath = process.env.ANCHOR_WALLET || '/home/vivi/.config/solana/id.json';
        console.log('Loading wallet from:', walletPath);
        const walletKeypair = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
        keypair = Keypair.fromSecretKey(new Uint8Array(walletKeypair));
      }
      
      this.wallet = new Wallet(keypair);
      console.log('Wallet loaded:', this.wallet.publicKey.toString());
    } catch (error) {
      console.error('Error loading wallet:', error);
      throw new Error(`Failed to load wallet: ${error.message}`);
    }
    
    // Initialize provider
    try {
      this.provider = new AnchorProvider(
        this.connection,
        this.wallet,
        { commitment: 'confirmed' }
      );
      console.log('Provider initialized');
    } catch (error) {
      console.error('Error initializing provider:', error);
      throw new Error(`Failed to initialize provider: ${error.message}`);
    }

    // Initialize program
    try {
      this.programId = new PublicKey('FrhgU1YQivVRKdbW9iFGfBiVYLSkuCuM8ZyjXiMrtNF1');
      console.log('Program ID:', this.programId.toString());
      
      // Create program with IDL
      this.program = new Program(idl, this.programId, this.provider);
      console.log('Program methods:', Object.keys(this.program.methods));
      
      this.pdaService = new PdaService(this.programId.toString());
      
      // Vault configuration
      this.usdcMint = new PublicKey(process.env.USDC_MINT);
      console.log('USDC Mint:', this.usdcMint.toString());
    } catch (error) {
      console.error('Error initializing program:', error);
      throw new Error(`Failed to initialize program: ${error.message}`);
    }
  }

  async getVaultPda() {
    try {
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from('vault')],
        this.programId
      );
      console.log('Vault PDA:', vaultPda.toString());
      return vaultPda;
    } catch (error) {
      console.error('Error getting vault PDA:', error);
      throw error;
    }
  }

  async getVaultStats() {
    try {
      console.log('Fetching vault stats...');
      
      // Get vault PDA
      const vaultPda = await this.getVaultPda();
      console.log('Using vault PDA:', vaultPda.toString());
      
      // Try to fetch vault account
      let vaultAccount;
      try {
        console.log('Attempting to fetch vault account...');
        vaultAccount = await this.program.account.vault.fetch(vaultPda);
        console.log('Vault account fetched successfully');
        console.log('Raw vault account data:', JSON.stringify(vaultAccount, null, 2));
      } catch (error) {
        console.log('Error fetching vault:', error.message);
        if (error.message.includes('Account does not exist')) {
          console.log('Vault not found, initializing...');
          await this.initializeVault();
          console.log('Vault initialized, fetching account...');
          vaultAccount = await this.program.account.vault.fetch(vaultPda);
          console.log('Raw vault account data after initialization:', JSON.stringify(vaultAccount, null, 2));
        } else {
          throw error;
        }
      }

      // Log each field before accessing
      console.log('Authority:', vaultAccount.authority);
      console.log('USDC Mint:', vaultAccount.usdc_mint);
      console.log('Total EVG-S Supply:', vaultAccount.total_evg_s_supply);
      console.log('Total EVG-L Tokens:', vaultAccount.total_evg_l_tokens);
      console.log('Treasury Account:', vaultAccount.treasury_account);

      // Ensure all fields are properly initialized
      const stats = {
        totalEvgS: vaultAccount.total_evg_s_supply ? vaultAccount.total_evg_s_supply.toString() : '0',
        totalEvgL: vaultAccount.total_evg_l_tokens ? vaultAccount.total_evg_l_tokens.toString() : '0',
        authority: vaultAccount.authority ? vaultAccount.authority.toString() : this.wallet.publicKey.toString(),
        usdcMint: vaultAccount.usdc_mint ? vaultAccount.usdc_mint.toString() : this.usdcMint.toString(),
        treasuryAccount: vaultAccount.treasury_account ? vaultAccount.treasury_account.toString() : this.wallet.publicKey.toString()
      };
      console.log('Vault stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getVaultStats:', error);
      throw new Error(`Failed to fetch vault statistics: ${error.message}`);
    }
  }

  async initializeVault() {
    try {
      console.log('Initializing vault...');
      const vaultPda = await this.getVaultPda();
      const mintPda = await this.pdaService.getEvgSMintPda();
      console.log('Using vault PDA for initialization:', vaultPda.toString());
      console.log('Using mint PDA for initialization:', mintPda.toString());

      // Check if vault already exists
      try {
        const existingVault = await this.program.account.vault.fetch(vaultPda);
        console.log('Vault already exists:', existingVault);
        return null;
      } catch (error) {
        if (!error.message.includes('Account does not exist')) {
          throw error;
        }
      }

      console.log('Creating initialize vault transaction...');
      const tx = await this.program.methods
        .initializeVault(this.usdcMint)
        .accounts({
          vault: vaultPda,
          authority: this.wallet.publicKey,
          mint: mintPda,
          treasuryAccount: this.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      console.log('Vault initialized successfully:', tx);
      return tx;
    } catch (error) {
      console.error('Error in initializeVault:', error);
      throw new Error(`Failed to initialize vault: ${error.message}`);
    }
  }

  async depositUsdc(userAddress, amount, serializedTransaction) {
    try {
      console.log('Processing USDC deposit...');
      console.log('User address:', userAddress);
      console.log('Amount:', amount);

      const vaultPda = await this.getVaultPda();
      const accounts = await this.pdaService.getAllAccounts(
        userAddress,
        this.usdcMint.toString()
      );

      console.log('Account PDAs:', {
        vault: vaultPda.toString(),
        userUsdcAccount: accounts.tokenAccounts.usdc.toString(),
        vaultUsdcAccount: accounts.tokenAccounts.vaultUsdc.toString(),
        mint: accounts.evgSMintPda.toString(),
        userTokenAccount: accounts.tokenAccounts.evgS.toString()
      });

      // If we have a serialized transaction from the frontend, use it
      if (serializedTransaction) {
        const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
        console.log('Using frontend transaction:', transaction);
        
        // Send the transaction
        const tx = await this.connection.sendRawTransaction(transaction.serialize());
        console.log('Deposit successful:', tx);
        return { success: true, transactionId: tx };
      }

      throw new Error('No transaction provided from frontend');
    } catch (error) {
      console.error('Error in depositUsdc:', error);
      throw new Error(`Failed to deposit USDC: ${error.message}`);
    }
  }

  async purchaseEvgL(price, sellerAddress) {
    try {
      console.log('Processing EVG-L purchase...');
      console.log('Price:', price);
      console.log('Seller address:', sellerAddress);

      const vaultPda = await this.getVaultPda();
      const accounts = await this.pdaService.getAllAccounts(
        sellerAddress,
        this.usdcMint.toString()
      );

      console.log('Account PDAs:', {
        vault: vaultPda.toString(),
        vaultUsdcAccount: accounts.tokenAccounts.vaultUsdc.toString(),
        sellerUsdcAccount: accounts.tokenAccounts.usdc.toString()
      });

      console.log('Creating purchase transaction...');
      const tx = await this.program.methods
        .purchaseEvgL(new BN(price))
        .accounts({
          vault: vaultPda,
          vaultUsdcAccount: accounts.tokenAccounts.vaultUsdc,
          sellerUsdcAccount: accounts.tokenAccounts.usdc,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log('Purchase successful:', tx);
      return { success: true, tx };
    } catch (error) {
      console.error('Error in purchaseEvgL:', error);
      throw new Error(`Failed to purchase EVG-L: ${error.message}`);
    }
  }
}

module.exports = new VaultService();
