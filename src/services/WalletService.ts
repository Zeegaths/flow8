import { ethers } from 'ethers';

export interface Wallet {
  address: string;
  connected: boolean;
  walletClientType: string;
}

export class WalletService {
  private provider: any = null;
  private currentAddress: string | null = null;
  private walletType: string = 'unknown';

  // This is called by Navbar when Privy is ready
  async setProvider(privyProvider: any, address: string, type: string) {
    this.provider = privyProvider;
    this.currentAddress = address;
    this.walletType = type;
  }

  // RE-ADD THIS METHOD: MNEEService needs it
  getWallet(): Wallet | null {
    if (!this.currentAddress) return null;
    return {
      address: this.currentAddress,
      connected: !!this.provider,
      walletClientType: this.walletType
    };
  }

  getProvider(): ethers.BrowserProvider | null {
    if (!this.provider) return null;
    return new ethers.BrowserProvider(this.provider);
  }

  async getSigner(): Promise<ethers.JsonRpcSigner | null> {
    const provider = this.getProvider();
    if (!provider) return null;
    return await provider.getSigner();
  }

  isConnected(): boolean {
    return !!this.provider;
  }

  disconnect(): void {
    this.provider = null;
    this.currentAddress = null;
    localStorage.removeItem('flow8_wallet');
  }
}

export const walletService = new WalletService();