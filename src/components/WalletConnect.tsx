import { useState } from 'react';
import { walletService } from '../services/WalletService';
import { Wallet, Check, X, ExternalLink } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  showDisconnect?: boolean;
}

export default function WalletConnect({ onConnect, showDisconnect = true }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(walletService.isConnected());
  const [address, setAddress] = useState(walletService.getWallet()?.address || '');

  const handleConnect = async (provider?: 'leather' | 'xverse' | 'unisat') => {
    setConnecting(true);
    setError('');

    try {
      let wallet;
      if (provider === 'leather') {
        wallet = await walletService.connectLeather();
      } else if (provider === 'xverse') {
        wallet = await walletService.connectXverse();
      } else if (provider === 'unisat') {
        wallet = await walletService.connectUniSat();
      } else {
        wallet = await walletService.connectWallet();
      }

      setConnected(true);
      setAddress(wallet.address);
      
      if (onConnect) {
        onConnect(wallet.address);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setConnected(false);
    setAddress('');
  };

  if (connected && address) {
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
        <Wallet className="h-6 w-6 text-purple-400" />
        <h3 className="text-lg font-bold">Connect Your Wallet</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Connect your Bitcoin wallet to create projects and manage payments
      </p>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
          <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => handleConnect('leather')}
          disabled={connecting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {connecting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Connecting...
            </>
          ) : (
            'Connect Leather Wallet'
          )}
        </button>

        <button
          onClick={() => handleConnect('xverse')}
          disabled={connecting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {connecting ? 'Connecting...' : 'Connect Xverse Wallet'}
        </button>

        <button
          onClick={() => handleConnect('unisat')}
          disabled={connecting}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {connecting ? 'Connecting...' : 'Connect UniSat Wallet'}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center mb-3">
          Don't have a wallet?
        </p>
        <div className="flex justify-center gap-4">
          
            <a href="https://leather.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            Install Leather
            <ExternalLink className="h-3 w-3" />
          </a>
          
            <a href="https://xverse.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            Install Xverse
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}