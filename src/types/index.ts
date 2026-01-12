// src/types/index.ts - Complete version
export type Page = 
  | 'landing' 
  | 'dashboard' 
  | 'create-project'
  | 'project-detail'
  | 'create-invoice'
  | 'team-payments'
  | 'client-portal'
  | 'settings'
  | 'my-wallet';

export interface User {
  id: string;
  address: string;
  name?: string;
  email?: string;
  role?: string;  // ADD THIS
}

export interface Deliverable {
  id: string;
  url: string;
  type: string;
  name: string;
  title: string;
  uploadedAt: number;
  description?: string;
  verificationStatus?: string;  // ADD THIS
  proof?: string;  // ADD THIS
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  txId: string;
  timestamp: number;
  type?: string;
  fromAddress?: string;  // ADD THIS
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'submitted' | 'under_review' | 'paid';
  dueDate?: number;
  completedAt?: number;
  deliverableUrl?: string;
  deliverables?: Deliverable[];
  releaseTxId?: string;
  verifiedAt?: number;
  projectId?: string;
  submittedAt?: number;
  paidAt?: number;
  verificationMethod?: string;
  escrowTxId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientAddress: string;
  freelancerAddress: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'disputed' | 'pending';
  createdAt: number;
  updatedAt?: number;
  milestones: Milestone[];
}