import { ethers } from 'ethers';
import { walletService } from './WalletService';

const MNEE_CONTRACT_ADDRESS = '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF';

const MNEE_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

export interface MNEEBalance {
  balance: string;
  balanceFormatted: string;
  decimals: number;
}

export interface TransactionResult {
  hash: string;
  confirmed: boolean;
  blockNumber?: number;
}

class MNEEService {
  // Use a helper to always get a fresh, resolved contract instance
  private async getContract(): Promise<ethers.Contract> {
    const provider = walletService.getProvider();
    // CRITICAL FIX: We must await the signer here
    const signer = await walletService.getSigner(); 

    if (!provider) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    // Pass the resolved signer (or provider) to the contract
    return new ethers.Contract(
      MNEE_CONTRACT_ADDRESS,
      MNEE_ABI,
      signer || provider
    );
  }

  async getTokenInfo(): Promise<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  }> {
    try {
      const contract = await this.getContract(); // Added await
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals)
      };
    } catch (error: any) {
      console.error('Error getting token info:', error);
      throw new Error('Failed to get MNEE token information');
    }
  }

  async getBalance(address?: string): Promise<MNEEBalance> {
    try {
      const contract = await this.getContract(); // Added await
      const wallet = walletService.getWallet();
      
      const addr = address || wallet?.address;
      if (!addr) throw new Error('No address provided');

      const [balance, decimals] = await Promise.all([
        contract.balanceOf(addr),
        contract.decimals()
      ]);

      return {
        balance: balance.toString(),
        balanceFormatted: ethers.formatUnits(balance, decimals),
        decimals: Number(decimals)
      };
    } catch (error: any) {
      console.error('Error getting MNEE balance:', error);
      throw new Error('Failed to get MNEE balance');
    }
  }

  async transfer(to: string, amount: string): Promise<TransactionResult> {
    try {
      const contract = await this.getContract(); // Added await
      const decimals = await contract.decimals();
      const amountInUnits = ethers.parseUnits(amount, decimals);

      const tx = await contract.transfer(to, amountInUnits);
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        confirmed: true,
        blockNumber: receipt.blockNumber
      };
    } catch (error: any) {
      if (error.code === 'ACTION_REJECTED') throw new Error('Transaction rejected');
      throw new Error(error.message || 'Transfer failed');
    }
  }

  async approve(spender: string, amount: string): Promise<TransactionResult> {
    try {
      const contract = await this.getContract(); // Added await
      const decimals = await contract.decimals();
      const amountInUnits = ethers.parseUnits(amount, decimals);

      const tx = await contract.approve(spender, amountInUnits);
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        confirmed: true,
        blockNumber: receipt.blockNumber
      };
    } catch (error: any) {
      throw new Error(error.message || 'Approval failed');
    }
  }

  // Helper for the escrow flow
  async lockInEscrow(
    escrowAddress: string,
    amount: string,
    projectId: string
  ): Promise<TransactionResult> {
    try {
      // Step 1: Client grants Escrow permission to take MNEE
      await this.approve(escrowAddress, amount);
      
      // Step 2: In a real app, you'd call a specific Escrow contract function
      // For now, we simulate the lock by transferring to the escrow address
      return await this.transfer(escrowAddress, amount);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to lock funds');
    }
  }
}

export const mneeService = new MNEEService();