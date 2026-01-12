import { walletService } from '../services/WalletService';
import { Wallet as WalletIcon, Check, X } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  showDisconnect?: boolean;
}

export default function WalletConnect({ onConnect, showDisconnect = true }: WalletConnectProps) {
  // 1. Privy Hooks
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const userWallet = wallets[0];
  const address = userWallet?.address || '';

  // 2. Sync Privy state with WalletService and trigger onConnect callback
  useEffect(() => {
    const sync = async () => {
      if (authenticated && userWallet) {
        const provider = await userWallet.getEthereumProvider();
        await walletService.setProvider(provider, userWallet.address, userWallet.walletClientType);
        
        if (onConnect) {
          onConnect(userWallet.address);
        }
      }
    };
    sync();
  }, [authenticated, userWallet, onConnect]);

  const handleConnect = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error("Login failed", err);
    }
  };

  const handleDisconnect = async () => {
    await logout();
    walletService.disconnect();
  };

  if (!ready) return null;

  if (authenticated && address) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Wallet Connected</p>
            <p className="text-xs text-gray-400 font-mono">
              {address.substring(0, 8)}...{address.substring(address.length - 6)}
            </p>
          </div>
        </div>
        {showDisconnect && (
          <button
            onClick={handleDisconnect}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <WalletIcon className="h-6 w-6 text-purple-400" />
        <h3 className="text-lg font-bold">Connect Your Wallet</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Securely connect your wallet to manage MNEE payments and escrow projects.
      </p>

      <div className="space-y-3">
        <button
          onClick={handleConnect}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <WalletIcon className="h-5 w-5" />
          Connect Wallet
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Powered by Privy • Supports MetaMask, Coinbase, and more
      </p>
    </div>
  );
}