import { useState, useEffect } from 'react';
import { backendService } from '../services/BackendService';
import { walletService } from '../services/WalletService';
// import type { Milestone, Deliverable } from '../types/index.ts';
import {
  ArrowLeft,
  Plus,
  X,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface CreateProjectProps {
  onNavigate: (page: any) => void;
}

interface MilestoneForm {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  deliverables: string[];
}

export default function CreateProject({ onNavigate }: CreateProjectProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const connectedWallet = walletService.getWallet();

  // Project basic info
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [clientAddress, setClientAddress] = useState(connectedWallet?.address || '');

  // Redirect if no wallet connected
  useEffect(() => {
    if (!connectedWallet) {
      alert('Please connect your wallet first');
      onNavigate('dashboard');
    }
  }, []);

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneForm[]>([
    {
      title: '',
      description: '',
      amount: '',
      dueDate: '',
      deliverables: [''],
    },
  ]);

  const totalAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: '',
        description: '',
        amount: '',
        dueDate: '',
        deliverables: [''],
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof MilestoneForm, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const addDeliverable = (milestoneIndex: number) => {
    const updated = [...milestones];
    updated[milestoneIndex].deliverables.push('');
    setMilestones(updated);
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    const updated = [...milestones];
    if (updated[milestoneIndex].deliverables.length > 1) {
      updated[milestoneIndex].deliverables = updated[milestoneIndex].deliverables.filter(
        (_, i) => i !== deliverableIndex
      );
      setMilestones(updated);
    }
  };

  const updateDeliverable = (
    milestoneIndex: number,
    deliverableIndex: number,
    value: string
  ) => {
    const updated = [...milestones];
    updated[milestoneIndex].deliverables[deliverableIndex] = value;
    setMilestones(updated);
  };

  const validateStep1 = () => {
    if (!projectTitle.trim()) {
      setError('Project title is required');
      return false;
    }
    if (!projectDescription.trim()) {
      setError('Project description is required');
      return false;
    }
    if (!freelancerAddress.trim()) {
      setError('Freelancer address is required');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (!m.title.trim()) {
        setError(`Milestone ${i + 1}: Title is required`);
        return false;
      }
      if (!m.description.trim()) {
        setError(`Milestone ${i + 1}: Description is required`);
        return false;
      }
      if (!m.amount || parseFloat(m.amount) <= 0) {
        setError(`Milestone ${i + 1}: Valid amount is required`);
        return false;
      }
      if (m.deliverables.some((d) => !d.trim())) {
        setError(`Milestone ${i + 1}: All deliverable descriptions must be filled`);
        return false;
      }
    }
    if (totalAmount <= 0) {
      setError('Total project amount must be greater than 0');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      // Convert milestone forms to proper Milestone objects
      const projectMilestones = milestones.map((m, index) => ({
        id: `mile_${Date.now()}_${index}`,
        title: m.title,
        description: m.description,
        amount: parseFloat(m.amount),
        status: index === 0 ? 'in_progress' : 'pending',
        deliverables: m.deliverables.map((d, dIndex) => ({
          id: `del_${Date.now()}_${index}_${dIndex}`,
          type: 'other',
          title: d,
          description: d,
          verificationStatus: 'pending',
        })),
        verificationMethod: 'client',
        dueDate: m.dueDate ? new Date(m.dueDate) : null,
      }));

      const projectData = {
        id: `proj_${Date.now()}`,
        clientAddress,
        freelancerAddress,
        title: projectTitle,
        description: projectDescription,
        totalAmount,
        status: 'pending',
        milestones: projectMilestones,
      };

      const project = await backendService.createProject(projectData);
      console.log('Project created:', project);

      // Navigate to dashboard after success
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black">Create New Project</h1>
            <p className="text-gray-400">Set up milestones and escrow payment</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Project Details' },
              { num: 2, label: 'Milestones' },
              { num: 3, label: 'Review & Create' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step >= s.num
                      ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                      }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                  </div>
                  <span className="text-sm mt-2 text-gray-400">{s.label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${step > s.num ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gray-700'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="E.g., Landing Page Design & Development"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Description</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the project scope, requirements, and expectations..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Freelancer Address</label>
                  <input
                    type="text"
                    value={freelancerAddress}
                    onChange={(e) => setFreelancerAddress(e.target.value)}
                    placeholder="1FreelancerBitcoinAddress..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    The Bitcoin address of the freelancer who will receive payments
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Next: Set Milestones
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Milestones */}
        {step === 2 && (
          <div className="space-y-6">
            {milestones.map((milestone, mIndex) => (
              <div
                key={mIndex}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold">Milestone {mIndex + 1}</h3>
                  {milestones.length > 1 && (
                    <button
                      onClick={() => removeMilestone(mIndex)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Milestone Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(mIndex, 'title', e.target.value)}
                      placeholder="E.g., Design Mockups"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(mIndex, 'description', e.target.value)}
                      placeholder="What needs to be delivered for this milestone?"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount (MNEE)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={milestone.amount}
                          onChange={(e) => updateMilestone(mIndex, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(mIndex, 'dueDate', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Deliverables</label>
                    <div className="space-y-2">
                      {milestone.deliverables.map((deliverable, dIndex) => (
                        <div key={dIndex} className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          <input
                            type="text"
                            value={deliverable}
                            onChange={(e) =>
                              updateDeliverable(mIndex, dIndex, e.target.value)
                            }
                            placeholder="E.g., Figma file with 3 page designs"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-all"
                          />
                          {milestone.deliverables.length > 1 && (
                            <button
                              onClick={() => removeDeliverable(mIndex, dIndex)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addDeliverable(mIndex)}
                        className="text-purple-400 text-sm flex items-center gap-2 hover:text-purple-300 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Deliverable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addMilestone}
              className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another Milestone
            </button>

            {/* Total */}
            <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Project Amount</span>
                <span className="text-3xl font-black">{totalAmount.toFixed(2)} MNEE</span>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Review Project
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Project Summary</h3>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm text-gray-400">Project Title</label>
                  <p className="text-lg font-medium">{projectTitle}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-gray-300">{projectDescription}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Freelancer Address</label>
                  <p className="font-mono text-sm text-gray-300">{freelancerAddress}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="font-bold mb-4">Milestones ({milestones.length})</h4>
                <div className="space-y-4">
                  {milestones.map((m, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold">{m.title}</h5>
                        <span className="text-purple-400 font-bold">{m.amount} MNEE</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{m.description}</p>
                      <div className="text-xs text-gray-500">
                        {m.deliverables.length} deliverable(s)
                        {m.dueDate && ` • Due ${new Date(m.dueDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount to Lock in Escrow</span>
                  <span className="text-2xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    {totalAmount.toFixed(2)} MNEE
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Ready to create your project?</p>
                <p>
                  Funds will be locked in escrow and released to the freelancer as each milestone
                  is completed and verified.
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Create Project & Lock Funds
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}