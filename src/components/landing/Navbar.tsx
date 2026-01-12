import { useState, useEffect } from 'react';
import { walletService } from '../../services/WalletService';
import { mneeService } from '../../services/MNEEService';
import { Wallet, LogOut, CheckSquare } from 'lucide-react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface NavbarProps {
  onNavigate: (page: any) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  // Privy Hooks
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  
  // Derived Data
  const address = wallets[0]?.address || '';
  
  // State
  const [mneeBalance, setMneeBalance] = useState<number>(0);

  // Sync Provider to Service
  useEffect(() => {
    const sync = async () => {
      if (authenticated && wallets[0]) {
        const provider = await wallets[0].getEthereumProvider();
        await walletService.setProvider(provider, wallets[0].address, wallets[0].walletClientType);
        loadMneeBalance(wallets[0].address);
      }
    };
    sync();
  }, [authenticated, wallets]);

  const loadMneeBalance = async (walletAddress: string) => {
    try {
      const data = await mneeService.getBalance(walletAddress);
      setMneeBalance(parseFloat(data.balanceFormatted) || 0);
    } catch (error) {
      setMneeBalance(0);
    }
  };

  const handleConnect = () => login(); 
  const handleDisconnect = () => logout();

  if (!ready) return null;

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Flow8
          </span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {authenticated && (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium transition-colors ${currentPage === 'dashboard'
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('create-project')}
                className={`text-sm font-medium transition-colors ${currentPage === 'create-project'
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Create Project
              </button>
            </>
          )}

          {/* Wallet Connection */}
          {authenticated && address ? (
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="flex flex-col items-start">
                <span className="text-xs font-mono text-gray-400">
                  {address.substring(0, 6)}...{address.substring(address.length - 4)}
                </span>
                <span className="text-xs font-bold text-purple-400">
                  {mneeBalance.toFixed(2)} MNEE
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="Disconnect"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}