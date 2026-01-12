import { v4 as uuidv4 } from 'uuid';
import type { Project, Milestone } from '../types/index';
import { mneeService } from './MNEEService';

export class ProjectService {
  // Use the instance directly or as a type
  private projects: Map<string, Project> = new Map();

  async createProject(
    clientAddress: string,
    freelancerAddress: string,
    milestones: Omit<Milestone, 'id' | 'projectId' | 'status' | 'verificationMethod'>[],
    title: string,
    description: string
  ): Promise<Project> {
    const projectId = uuidv4();
    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

    // FIX: Updated to use balanceFormatted check (since validateSufficientBalance doesn't exist)
    const balanceData = await mneeService.getBalance(clientAddress);
    const hasFunds = parseFloat(balanceData.balanceFormatted) >= totalAmount;

    if (!hasFunds) {
      throw new Error(`Insufficient funds. Need ${totalAmount} MNEE.`);
    }

    const project: Project = {
      id: projectId,
      title, 
      description, 
      clientAddress,
      freelancerAddress,
      totalAmount,
      status: 'pending',
      milestones: milestones.map((m) => ({
        ...m,
        id: uuidv4(),
        projectId,
        status: 'pending',
        verificationMethod: this.determineVerificationMethod(
            m.deliverables?.map(d => d.url || d.title) || []
        ),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.projects.set(projectId, project);
    return project;
  }

  // FIX: Removed clientWif. Privy handles signing via the browser provider.
  async lockProjectFunds(projectId: string, escrowAddress: string) {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    if (project.status !== 'pending') {
      throw new Error('Project is not in pending status');
    }

    // FIX: lockInEscrow returns TransactionResult { hash, confirmed, ... }
    const result = await mneeService.lockInEscrow(
      escrowAddress,
      project.totalAmount.toString(),
      projectId,
      project.freelancerAddress
    );

    if (!result.confirmed) {
      throw new Error('Blockchain transaction failed to confirm');
    }

    project.status = 'active';
    project.updatedAt = Date.now();

    // Mark first milestone as in-progress
    if (project.milestones.length > 0) {
      project.milestones[0].status = 'in-progress';
      project.milestones[0].escrowTxId = result.hash; // txId is result.hash in Ethers
    }

    this.projects.set(projectId, project);
    return { projectId, txId: result.hash };
  }

  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId);
  }

  private determineVerificationMethod(deliverables: string[]): 'ai' | 'validator' | 'client' {
    const codeKeywords = ['github', 'gitlab', 'code', 'repository', 'pr'];
    if (deliverables.some((d) => codeKeywords.some(kw => d.toLowerCase().includes(kw)))) {
      return 'ai';
    }
    return 'validator';
  }
}

// Export the instance
export const projectService = new ProjectService();