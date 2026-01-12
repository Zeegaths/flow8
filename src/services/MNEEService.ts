import Mnee from '@mnee/ts-sdk';

export class MNEEService {
  private mnee: Mnee;
  private config: any;

  constructor() {
    const environment = import.meta.env.VITE_MNEE_ENVIRONMENT || 'sandbox';
    const apiKey = import.meta.env.VITE_MNEE_API_KEY || '';

    // Validate environment
    if (environment !== 'sandbox' && environment !== 'production') {
      throw new Error('Invalid MNEE environment. Check your .env file');
    }

    console.log('Initializing MNEE with environment:', environment);

    // Use proxy for development
    const baseUrl = import.meta.env.DEV 
      ? 'http://localhost:5173/api'  // Use Vite proxy in dev
      : undefined; // Use default in production

    this.mnee = new Mnee({
      environment: environment as 'sandbox' | 'production',
      apiKey: apiKey,
      ...(baseUrl && { baseUrl }) // Only add baseUrl if it exists
    });
  }

  async initialize() {
    try {
      this.config = await this.mnee.config();
      console.log('MNEE Service initialized:', this.config);
      return this.config;
    } catch (error) {
      console.error('Failed to initialize MNEE:', error);
      throw error;
    }
  }

  // Check balance for an address
  async getBalance(address: string) {
    const balance = await this.mnee.balance(address);
    return balance;
  }

  // Lock funds in escrow (send from client to escrow address)
  async lockFundsInEscrow(clientWif: string, escrowAddress: string, amount: number) {
    try {
      const response = await this.mnee.transfer(
        [{ address: escrowAddress, amount }],
        clientWif
      );

      console.log(`Funds locked in escrow. Ticket: ${response.ticketId}`);

      // Wait for confirmation
      const status = await this.waitForConfirmation(response.ticketId!);
      return status.tx_id;
    } catch (error: any) {
      throw new Error(`Failed to lock funds: ${error.message}`);
    }
  }

  // Release funds from escrow to freelancer
  async releaseFunds(
    escrowWif: string,
    freelancerAddress: string,
    amount: number,
    callbackUrl?: string
  ) {
    try {
      const response = await this.mnee.transfer(
        [{ address: freelancerAddress, amount }],
        escrowWif,
        { broadcast: true, callbackUrl }
      );

      console.log(`Funds released. Ticket: ${response.ticketId}`);

      // Wait for confirmation
      const status = await this.waitForConfirmation(response.ticketId!);
      return status.tx_id;
    } catch (error: any) {
      throw new Error(`Failed to release funds: ${error.message}`);
    }
  }

  // Create multi-output transaction (for splitting payments)
  async splitPayment(escrowWif: string, recipients: { address: string; amount: number }[]) {
    try {
      const response = await this.mnee.transfer(recipients, escrowWif);

      console.log(`Payment split. Ticket: ${response.ticketId}`);

      // Wait for confirmation
      const status = await this.waitForConfirmation(response.ticketId!);
      return status.tx_id;
    } catch (error: any) {
      throw new Error(`Failed to split payment: ${error.message}`);
    }
  }

  // Get UTXOs for an address (to track escrow funds)
  async getUTXOs(address: string) {
    try {
      const utxos = await this.mnee.getUtxos(address, 0, 100);
      return utxos;
    } catch (error: any) {
      throw new Error(`Failed to get UTXOs: ${error.message}`);
    }
  }

  // Wait for transaction confirmation
  private async waitForConfirmation(ticketId: string, maxAttempts = 30) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.mnee.getTxStatus(ticketId);

      if (status.status === 'SUCCESS' || status.status === 'MINED') {
        return status;
      }

      if (status.status === 'FAILED') {
        throw new Error(`Transaction failed: ${status.errors}`);
      }

      // Wait 2 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Transaction confirmation timeout');
  }

  // Validate sufficient balance
  async validateSufficientBalance(address: string, requiredAmount: number): Promise<boolean> {
    const balance = await this.getBalance(address);
    return balance.decimalAmount >= requiredAmount;
  }

  // Calculate fees for a transaction
  calculateFees(amount: number): number {
    const atomicAmount = this.mnee.toAtomicAmount(amount);
    const feeTier = this.config.fees.find(
      (tier: any) => atomicAmount >= tier.min && atomicAmount <= tier.max
    );

    if (feeTier) {
      return this.mnee.fromAtomicAmount(feeTier.fee);
    }

    return 0;
  }

  // Get MNEE instance for direct access
  getMNEE() {
    return this.mnee;
  }
}