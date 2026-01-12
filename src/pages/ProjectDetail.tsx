import { useState, useEffect } from 'react';
import { backendService } from '../services/BackendService';
import { aiVerificationService } from '../services/AIVerificationService';
import type { Project, Milestone, Deliverable } from '../types/index.ts';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    AlertCircle,
    ExternalLink,
    Upload,
    Sparkles,
    DollarSign,
    Calendar,
    FileText,
    X,
    Plus,
} from 'lucide-react';

interface ProjectDetailProps {
    projectId: string;
    onNavigate: (page: any) => void;
}

export default function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);


    // Submission form state
    const [deliverables, setDeliverables] = useState<{ title: string; url: string; proof: string }[]>([
        { title: '', url: '', proof: '' }
    ]);

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            const data = await backendService.getProject(projectId);
            setProject(data);
        } catch (error) {
            console.error('Failed to load project:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitMilestone = (milestone: Milestone) => {
        setSelectedMilestone(milestone);
        setShowSubmitModal(true);
        setDeliverables([{ title: '', url: '', proof: '' }]);
        setVerificationResult(null);
    };

    const addDeliverable = () => {
        setDeliverables([...deliverables, { title: '', url: '', proof: '' }]);
    };

    const removeDeliverable = (index: number) => {
        if (deliverables.length > 1) {
            setDeliverables(deliverables.filter((_, i) => i !== index));
        }
    };

    const updateDeliverable = (index: number, field: string, value: string) => {
        const updated = [...deliverables];
        updated[index] = { ...updated[index], [field]: value };
        setDeliverables(updated);
    };
    const handleVerifyWithAI = async () => {
        if (!selectedMilestone) return;

        setVerifying(true);
        try {
            // Call AI verification service
            const result = await aiVerificationService.verifyDeliverables(
                selectedMilestone.title,
                selectedMilestone.description,
                deliverables.map((d) => ({
                    title: d.title,
                    description: d.title,
                    url: d.url,
                    proof: d.proof,
                    type: 'other',
                }))
            );

            setVerificationResult(result);

            // If approved, update milestone
            if (result.approved) {
                const deliverablesData = deliverables.map((d, i) => ({
                    id: `del_${Date.now()}_${i}`,
                    type: 'other',
                    title: d.title,
                    description: d.title,
                    url: d.url,
                    proof: d.proof,
                    verificationStatus: 'verified',
                }));

                // Submit milestone with deliverables
                await backendService.submitMilestone(
                    projectId,
                    selectedMilestone.id,
                    deliverablesData
                );

                // Verify milestone
                await backendService.verifyMilestone(selectedMilestone.id, true);

                // Release payment
                await backendService.releaseMilestonePayment(selectedMilestone.id);

                // Reload project
                await loadProject();

                // Close modal after 3 seconds
                setTimeout(() => {
                    setShowSubmitModal(false);
                    setSelectedMilestone(null);
                }, 3000);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            setError('Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="text-purple-400 hover:text-purple-300"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black">{project.title}</h1>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'active'
                                    ? 'bg-green-500/20 text-green-400'
                                    : project.status === 'completed'
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}
                            >
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-400">{project.description}</p>
                    </div>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="h-5 w-5 text-purple-400" />
                            <span className="text-sm text-gray-400">Total Amount</span>
                        </div>
                        <p className="text-2xl font-black">{project.totalAmount} MNEE</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="text-sm text-gray-400">Milestones</span>
                        </div>
                        <p className="text-2xl font-black">
                            {project.milestones.filter((m) => m.status === 'paid').length}/
                            {project.milestones.length}
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="h-5 w-5 text-blue-400" />
                            <span className="text-sm text-gray-400">Paid Out</span>
                        </div>
                        <p className="text-2xl font-black">
                            {project.milestones
                                .filter((m) => m.status === 'paid')
                                .reduce((sum, m) => sum + m.amount, 0)}{' '}
                            MNEE
                        </p>
                    </div>
                </div>

                {/* Milestones */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Milestones</h2>
                    <div className="space-y-4">
                        {project.milestones.map((milestone, index) => (
                            <MilestoneCard
                                key={milestone.id}
                                milestone={milestone}
                                index={index}
                                onSubmit={handleSubmitMilestone}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && selectedMilestone && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-2xl font-bold">Submit Milestone</h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="font-bold text-lg mb-2">{selectedMilestone.title}</h4>
                                <p className="text-gray-400 text-sm">{selectedMilestone.description}</p>
                            </div>

                            {/* Deliverables Form */}
                            <div className="space-y-4 mb-6">
                                <label className="block text-sm font-medium">Deliverables</label>
                                {deliverables.map((deliverable, index) => (
                                    <div key={index} className="bg-white/5 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Deliverable {index + 1}</span>
                                            {deliverables.length > 1 && (
                                                <button
                                                    onClick={() => removeDeliverable(index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Title (e.g., GitHub Repository)"
                                            value={deliverable.title}
                                            onChange={(e) => updateDeliverable(index, 'title', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            placeholder="URL (e.g., https://github.com/...)"
                                            value={deliverable.url}
                                            onChange={(e) => updateDeliverable(index, 'url', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Proof (e.g., Commit hash, screenshot link)"
                                            value={deliverable.proof}
                                            onChange={(e) => updateDeliverable(index, 'proof', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                ))}

                                <button
                                    onClick={addDeliverable}
                                    className="text-purple-400 text-sm flex items-center gap-2 hover:text-purple-300"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Another Deliverable
                                </button>
                            </div>

                            {/* Verification Result */}
                            {verificationResult && (
                                <div
                                    className={`mb-6 rounded-xl p-6 border-2 ${verificationResult.approved
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-red-500/10 border-red-500/30'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        {verificationResult.approved ? (
                                            <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-2">
                                                {verificationResult.approved ? 'Milestone Approved!' : 'Needs Improvement'}
                                            </h4>
                                            <p className="text-sm mb-3">{verificationResult.reasoning}</p>
                                            <div className="text-xs">
                                                <span className="text-gray-400">AI Confidence: </span>
                                                <span className="font-bold">{verificationResult.confidence}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {verificationResult.suggestions &&
                                        verificationResult.suggestions.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-sm font-medium mb-2">Suggestions:</p>
                                                <ul className="space-y-1">
                                                    {verificationResult.suggestions.map((suggestion: string, i: number) => (
                                                        <li key={i} className="text-sm text-gray-400">
                                                            • {suggestion}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                    {verificationResult.approved && (
                                        <div className="mt-4 pt-4 border-t border-green-500/30">
                                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>
                                                    Payment of {selectedMilestone.amount} MNEE has been released!
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    disabled={verifying}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVerifyWithAI}
                                    disabled={
                                        verifying ||
                                        deliverables.some((d) => !d.title.trim()) ||
                                        !!verificationResult
                                    }
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {verifying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                            AI Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5" />
                                            Verify with AI
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function MilestoneCard({
    milestone,
    index,
    onSubmit,
}: {
    milestone: Milestone;
    index: number;
    onSubmit: (milestone: Milestone) => void;
}) {
    const statusConfig = {
        pending: { color: 'bg-gray-500/20 text-gray-400', icon: Clock },
        in_progress: { color: 'bg-blue-500/20 text-blue-400', icon: Clock },
        submitted: { color: 'bg-yellow-500/20 text-yellow-400', icon: Upload },
        under_review: { color: 'bg-orange-500/20 text-orange-400', icon: Sparkles },
        verified: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
        paid: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
        disputed: { color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
    };

    const config = statusConfig[milestone.status];
    const StatusIcon = config.icon;

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">Milestone {index + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${config.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {milestone.status.replace('_', ' ')}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{milestone.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <span className="text-gray-400">Amount: </span>
                            <span className="font-bold text-purple-400">{milestone.amount} MNEE</span>
                        </div>
                        {milestone.dueDate && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="h-4 w-4" />
                                Due {new Date(milestone.dueDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                {milestone.status === 'in_progress' && (
                    <button
                        onClick={() => onSubmit(milestone)}
                        className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4" />
                        Submit Work
                    </button>
                )}

                {milestone.status === 'paid' && milestone.releaseTxId && (
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Payment Released</p>

                        <a href={`#tx-${milestone.releaseTxId}`}
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                            View TX
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                )}
            </div>

            {
                milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div className="border-t border-white/10 pt-4">
                        <p className="text-sm text-gray-400 mb-2">Deliverables:</p>
                        <div className="space-y-2">
                            {milestone.deliverables.map((d) => (
                                <div key={d.id} className="flex items-start gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium">{d.title}</p>
                                        {d.url && (

                                            <a href={d.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                                            >
                                                View
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div >
                )
            }
        </div >
    );
}