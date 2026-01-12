// Project & Milestone Types
export interface Project {
  id: string;
  clientAddress: string;
  freelancerAddress: string;
  title: string;
  description: string;
  totalAmount: number; // in MNEE
  status: 'pending' | 'active' | 'completed' | 'disputed' | 'cancelled';
  milestones: Milestone[];
  escrowTxId?: string; // Transaction where total funds are locked
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number; // in MNEE
  deliverables: Deliverable[];
  status: 'pending' | 'in_progress' | 'submitted' | 'under_review' | 'verified' | 'paid' | 'disputed';
  dueDate?: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  paidAt?: Date;
  releaseTxId?: string; // Transaction where funds are released
  verificationMethod: 'ai' | 'validator' | 'client';
  validatorAddress?: string;
  validatorFee?: number;
}

export interface Deliverable {
  id: string;
  type: 'code' | 'document' | 'design' | 'link' | 'other';
  title: string;
  description: string;
  url?: string;
  proof?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}
// Escrow Types
export interface EscrowUTXO {
  txid: string;
  vout: number;
  amount: number;
  milestone: string;
  projectId: string;
}

// Verification Types
export interface VerificationRequest {
  milestoneId: string;
  projectId: string;
  deliverables: Deliverable[];
  submittedBy: string;
  submittedAt: Date;
}

export interface VerificationResult {
  milestoneId: string;
  approved: boolean;
  verifiedBy: 'ai' | 'validator' | 'client';
  verifierAddress?: string;
  feedback?: string;
  verifiedAt: Date;
}

// Dispute Types
export interface DisputeRequest {
  milestoneId: string;
  reason: string;
  evidence: string[];
  filedBy: 'client' | 'freelancer';
}

export interface Dispute {
  id: string;
  milestoneId: string;
  projectId: string;
  reason: string;
  evidence: Evidence[];
  filedBy: 'client' | 'freelancer';
  filedByAddress: string;
  status: 'open' | 'under_review' | 'resolved' | 'escalated';
  arbitratorAddress?: string;
  resolution?: DisputeResolution;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'chat_log' | 'code' | 'other';
  url: string;
  description: string;
  uploadedBy: 'client' | 'freelancer';
  uploadedAt: Date;
}

export interface DisputeResolution {
  decision: 'favor_client' | 'favor_freelancer' | 'split';
  amountToClient?: number;
  amountToFreelancer?: number;
  reasoning: string;
  resolvedBy: string;
  resolvedAt: Date;
}

// Payment Types
export interface PaymentRecord {
  id: string;
  projectId: string;
  milestoneId?: string;
  type: 'escrow_lock' | 'milestone_release' | 'refund' | 'validator_fee';
  amount: number;
  fromAddress: string;
  toAddress: string;
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
  confirmedAt?: Date;
}

// User Types
export interface User {
  address: string;
  name?: string;
  email?: string;
  role: 'client' | 'freelancer' | 'validator' | 'both';
  reputation: number;
  completedProjects: number;
  totalEarned: number;
  totalPaid: number;
  joinedAt: Date;
}

// UI Types
export type Page = 'landing' | 'dashboard' | 'create-project' | 'project-detail' | 'profile';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}