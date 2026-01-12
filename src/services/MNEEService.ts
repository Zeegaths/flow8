import { ethers } from 'ethers';
import { walletService } from './WalletService';

// Pull from environment variables
const MNEE_TOKEN_ADDRESS = import.meta.env.VITE_MNEE_TOKEN_ADDRESS;
const ESCROW_CONTRACT_ADDRESS = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS;

const MNEE_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
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
  private async getContract(): Promise<ethers.Contract> {
    const provider = walletService.getProvider();
    const signer = await walletService.getSigner(); //

    if (!provider) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    return new ethers.Contract(
      MNEE_TOKEN_ADDRESS, // Use the ENV variable
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
      const contract = await this.getContract();
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: "0" // Simplified for initialization
      };
    } catch (error: any) {
      console.error('Error getting token info:', error);
      throw new Error('Failed to get MNEE token information');
    }
  }
  /**
   * Main Escrow Logic: Handles both Approval and Locking
   */
  async lockInEscrow(
    escrowAddress: string,
    amount: string,
    projectId: string,
    freelancerAddress: string
  ): Promise<TransactionResult> {
    try {
      const tokenContract = await this.getContract();
      const signer = await walletService.getSigner();
      if (!signer) throw new Error("No signer found");

      const decimals = await tokenContract.decimals();
      const amountInUnits = ethers.parseUnits(amount, decimals);

      // STEP 1: Approve the Escrow Contract
      console.log("Step 1: Requesting MNEE approval...");
      const approveTx = await tokenContract.approve(escrowAddress, amountInUnits);
      await approveTx.wait();

      // STEP 2: Call 'lockFunds' on the Escrow Contract
      const escrowInstance = new ethers.Contract(
        escrowAddress,
        ['function lockFunds(string _projectId, address _freelancer, uint256 _amount)'],
        signer
      );

      console.log("Step 2: Locking MNEE in escrow...");
      const lockTx = await escrowInstance.lockFunds(projectId, freelancerAddress, amountInUnits);
      const receipt = await lockTx.wait();

      return {
        hash: lockTx.hash,
        confirmed: true,
        blockNumber: receipt.blockNumber
      };
    } catch (error: any) {
      console.error("Escrow failed:", error);
      throw error;
    }
  }

  async getBalance(address?: string): Promise<MNEEBalance> {
    try {
      const contract = await this.getContract();
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
}

export const mneeService = new MNEEService();