interface Wallet {
  address: string;
  publicKey: string;
  connected: boolean;
  provider: 'leather' | 'xverse' | 'unisat' | null;
}

export class WalletService {
  private wallet: Wallet | null = null;

  // Check if wallets are available
  hasLeather(): boolean {
    return typeof (window as any).LeatherProvider !== 'undefined';
  }

  hasXverse(): boolean {
    return typeof (window as any).XverseProviders !== 'undefined';
  }

  hasUniSat(): boolean {
    return typeof (window as any).unisat !== 'undefined';
  }

  // Connect Leather Wallet
  async connectLeather(): Promise<Wallet> {
    if (!this.hasLeather()) {
      throw new Error('Leather wallet not installed. Install from leather.io');
    }

    try {
      const leather = (window as any).LeatherProvider;
      const response = await leather.request('getAddresses');
      
      const btcAddress = response.result.addresses.find(
        (addr: any) => addr.symbol === 'BTC'
      );

      if (!btcAddress) {
        throw new Error('No Bitcoin address found');
      }

      this.wallet = {
        address: btcAddress.address,
        publicKey: btcAddress.publicKey || '',
        connected: true,
        provider: 'leather',
      };

      // Save to localStorage
      localStorage.setItem('flow8_wallet', JSON.stringify(this.wallet));
      return this.wallet;
    } catch (error: any) {
      console.error('Leather connection failed:', error);
      throw new Error(error.message || 'Failed to connect Leather wallet');
    }
  }

  // Connect Xverse Wallet
  async connectXverse(): Promise<Wallet> {
    if (!this.hasXverse()) {
      throw new Error('Xverse wallet not installed. Install from xverse.app');
    }

    try {
      const xverse = (window as any).XverseProviders;
      const response = await xverse.BitcoinProvider.request('getAccounts', null);

      if (!response || response.length === 0) {
        throw new Error('No Bitcoin address found');
      }

      const btcAccount = response[0];

      this.wallet = {
        address: btcAccount.address,
        publicKey: btcAccount.publicKey || '',
        connected: true,
        provider: 'xverse',
      };

      localStorage.setItem('flow8_wallet', JSON.stringify(this.wallet));
      return this.wallet;
    } catch (error: any) {
      console.error('Xverse connection failed:', error);
      throw new Error(error.message || 'Failed to connect Xverse wallet');
    }
  }

  // Connect UniSat Wallet
  async connectUniSat(): Promise<Wallet> {
    if (!this.hasUniSat()) {
      throw new Error('UniSat wallet not installed. Install from unisat.io');
    }

    try {
      const unisat = (window as any).unisat;
      const accounts = await unisat.requestAccounts();

      if (!accounts || accounts.length === 0) {
        throw new Error('No Bitcoin address found');
      }

      this.wallet = {
        address: accounts[0],
        publicKey: await unisat.getPublicKey(),
        connected: true,
        provider: 'unisat',
      };

      localStorage.setItem('flow8_wallet', JSON.stringify(this.wallet));
      return this.wallet;
    } catch (error: any) {
      console.error('UniSat connection failed:', error);
      throw new Error(error.message || 'Failed to connect UniSat wallet');
    }
  }

  // Auto-connect (try all wallets)
  async connectWallet(): Promise<Wallet> {
    if (this.hasLeather()) {
      return this.connectLeather();
    } else if (this.hasXverse()) {
      return this.connectXverse();
    } else if (this.hasUniSat()) {
      return this.connectUniSat();
    } else {
      throw new Error(
        'No Bitcoin wallet found. Please install Leather, Xverse, or UniSat wallet.'
      );
    }
  }

  // Restore wallet from localStorage
  restoreWallet(): Wallet | null {
    try {
      const saved = localStorage.getItem('flow8_wallet');
      if (saved) {
        this.wallet = JSON.parse(saved);
        return this.wallet;
      }
    } catch (error) {
      console.error('Failed to restore wallet:', error);
    }
    return null;
  }

  // Disconnect wallet
  disconnect(): void {
    this.wallet = null;
    localStorage.removeItem('flow8_wallet');
  }

  // Get current wallet
  getWallet(): Wallet | null {
    if (!this.wallet) {
      this.wallet = this.restoreWallet();
    }
    return this.wallet;
  }

  // Check if connected
  isConnected(): boolean {
    return this.getWallet() !== null && this.wallet!.connected;
  }
}

export const walletService = new WalletService();