import { v4 as uuidv4 } from 'uuid';
import { Project, Milestone } from '../types';
import { MNEEService } from './MNEEService';

export class ProjectService {
  private mneeService: MNEEService;
  private projects: Map<string, Project> = new Map();

  constructor(mneeService: MNEEService) {
    this.mneeService = mneeService;
  }

  async createProject(
    clientAddress: string,
    freelancerAddress: string,
    milestones: Omit<Milestone, 'id' | 'projectId' | 'status' | 'verificationMethod'>[]
  ): Promise<Project> {
    const projectId = uuidv4();
    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

    // Validate client has sufficient balance
    const hasFunds = await this.mneeService.validateSufficientBalance(
      clientAddress,
      totalAmount
    );

    if (!hasFunds) {
      throw new Error('Insufficient funds in client address');
    }

    const project: Project = {
      id: projectId,
      clientAddress,
      freelancerAddress,
      totalAmount,
      status: 'pending',
      milestones: milestones.map((m) => ({
        ...m,
        id: uuidv4(),
        projectId,
        status: 'pending',
        verificationMethod: this.determineVerificationMethod(m.deliverables),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.set(projectId, project);
    return project;
  }

  async lockProjectFunds(projectId: string, clientWif: string, escrowAddress: string) {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    if (project.status !== 'pending') {
      throw new Error('Project is not in pending status');
    }

    // Lock total project funds in escrow
    const txId = await this.mneeService.lockFundsInEscrow(
      clientWif,
      escrowAddress,
      project.totalAmount
    );

    project.status = 'active';
    project.updatedAt = new Date();

    // Mark first milestone as in_progress
    if (project.milestones.length > 0) {
      project.milestones[0].status = 'in_progress';
      project.milestones[0].escrowTxId = txId;
    }

    this.projects.set(projectId, project);
    return { projectId, txId };
  }

  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId);
  }

  private determineVerificationMethod(deliverables: string[]): 'ai' | 'validator' | 'client' {
    // Simple logic - can be enhanced
    if (deliverables.some((d) => d.includes('github') || d.includes('code'))) {
      return 'ai'; // Code can be auto-verified
    }
    return 'validator'; // Complex work needs human review
  }
}