import { useState } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth'; // Add Privy hooks
import { backendService } from '../services/BackendService';
import { mneeService } from '../services/MNEEService';
import { walletService } from '../services/WalletService';
import type { Milestone } from '../types/index';
import { Plus, X, ArrowRight, Lock } from 'lucide-react';

interface CreateProjectProps {
  onNavigate: (page: any) => void;
}

export default function CreateProject({ onNavigate }: CreateProjectProps) {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const userWallet = wallets[0]; // Privy's primary wallet

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [milestones, setMilestones] = useState<Partial<Milestone>[]>([
    { title: '', description: '', amount: 0 }
  ]);

  const [createdProject, setCreatedProject] = useState<any>(null);
  const [lockingFunds, setLockingFunds] = useState(false);

  // Total amount from UI state
  const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: 0 }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleCreateProject = async () => {
    if (!authenticated || !userWallet) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      if (!title || !description || !freelancerAddress) {
        alert('Please fill all fields');
        return;
      }

      const project = await backendService.createProject({
        title,
        description,
        clientAddress: userWallet.address, // Use Privy address
        freelancerAddress,
        totalAmount,
        milestones: milestones.map((m, i) => ({
          ...m,
          status: 'pending',
          dueDate: Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000,
        })),
      });

      setCreatedProject(project);
      setStep(2);
    } catch (error: any) {
      alert(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleLockFunds = async () => {
    if (!userWallet || !createdProject) return;

    setLockingFunds(true);
    try {
      // 1. Sync the provider to the service just in case
      const provider = await userWallet.getEthereumProvider();
      await walletService.setProvider(provider, userWallet.address, userWallet.walletClientType);

      // 2. Fix Build Error: Use balanceFormatted
      const balanceData = await mneeService.getBalance(userWallet.address);
      const currentBalance = parseFloat(balanceData.balanceFormatted);

      if (currentBalance < totalAmount) {
        alert(`Insufficient balance. You need ${totalAmount} MNEE but have ${currentBalance}`);
        return;
      }

      // 3. Trigger actual Smart Contract Escrow Lock
      // Replace 'ESCROW_CONTRACT_ADDRESS' with your actual contract address
      const ESCROW_CONTRACT_ADDRESS = '0x...';

      const result = await mneeService.lockInEscrow(
        ESCROW_CONTRACT_ADDRESS,
        totalAmount.toString(),
        createdProject.id,
        freelancerAddress
      );

      if (result.confirmed) {
        alert('Funds successfully locked in escrow!');
        onNavigate('dashboard');
      }
    } catch (error: any) {
      console.error('Escrow error:', error);
      alert(error.message || 'Failed to lock funds');
    } finally {
      setLockingFunds(false);
    }
  };

  if (step === 2 && createdProject) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white/5 rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Lock Funds in Escrow</h2>
            <p className="text-gray-400">
              Secure your payment by locking {totalAmount} MNEE in escrow
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Project:</span>
                <span className="font-bold">{createdProject.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount:</span>
                <span className="font-bold text-purple-400">{totalAmount} MNEE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Milestones:</span>
                <span className="font-bold">{milestones.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Freelancer:</span>
                <span className="font-mono text-xs">{freelancerAddress.substring(0, 10)}...</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              ⚠️ Funds will be locked until milestones are verified and approved
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-all"
            >
              Skip for Now
            </button>
            <button
              onClick={handleLockFunds}
              disabled={lockingFunds}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {lockingFunds ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Locking Funds...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Lock {totalAmount} MNEE
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Create New Project</h1>
          <p className="text-gray-400">Set up milestones and escrow payments</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
          {/* Project Details */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Website Redesign"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project scope..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Freelancer Bitcoin Address</label>
              <input
                type="text"
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                placeholder="bc1..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Milestones</h3>
              <button
                onClick={addMilestone}
                className="text-purple-400 text-sm flex items-center gap-2 hover:text-purple-300"
              >
                <Plus className="h-4 w-4" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={milestone.title || ''}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />

                  <textarea
                    placeholder="Milestone description"
                    value={milestone.description || ''}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Amount in MNEE"
                    value={milestone.amount || ''}
                    onChange={(e) => updateMilestone(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Project Value:</span>
              <span className="text-2xl font-bold text-purple-400">{totalAmount} MNEE</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                <>
                  Create Project
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}