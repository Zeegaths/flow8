import type { Project, Milestone, User, PaymentRecord, Deliverable } from '../types/index.ts';

export class MockDataService {
  private projects: Map<string, Project> = new Map();
  private users: Map<string, User> = new Map();
  private payments: Map<string, PaymentRecord> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock user (freelancer)
    const freelancer: User = {
      address: '1FreelancerMockAddress123',
      name: 'Jane Developer',
      email: 'jane@flow8.dev',
      role: 'freelancer',
      reputation: 4.8,
      completedProjects: 12,
      totalEarned: 45.5,
      totalPaid: 0,
      joinedAt: new Date('2025-11-01'),
    };

    // Mock user (client)
    const client: User = {
      address: '1ClientMockAddress456',
      name: 'Tech Startup Inc',
      email: 'hire@techstartup.com',
      role: 'client',
      reputation: 4.9,
      completedProjects: 8,
      totalEarned: 0,
      totalPaid: 38.2,
      joinedAt: new Date('2025-10-15'),
    };

    this.users.set(freelancer.address, freelancer);
    this.users.set(client.address, client);

    // Mock project
    const project1: Project = {
      id: 'proj_001',
      clientAddress: client.address,
      freelancerAddress: freelancer.address,
      title: 'Landing Page Design & Development',
      description:
        'Design and develop a modern landing page for our SaaS product with responsive design and smooth animations.',
      totalAmount: 10,
      status: 'active',
      escrowTxId: 'mock_tx_escrow_001',
      milestones: [
        {
          id: 'mile_001',
          projectId: 'proj_001',
          title: 'Design Mockups',
          description: 'Create Figma designs for desktop and mobile views',
          amount: 2.5,
          status: 'paid',
          deliverables: [
            {
              id: 'del_001',
              type: 'design',
              title: 'Figma Design File',
              description: 'Complete landing page designs',
              url: 'https://figma.com/file/mock',
              verificationStatus: 'verified',
            },
          ],
          verificationMethod: 'client',
          submittedAt: new Date('2026-01-02'),
          verifiedAt: new Date('2026-01-03'),
          paidAt: new Date('2026-01-03'),
          releaseTxId: 'mock_tx_release_001',
        },
        {
          id: 'mile_002',
          projectId: 'proj_001',
          title: 'Frontend Development',
          description: 'Implement responsive React components',
          amount: 5,
          status: 'submitted',
          deliverables: [
            {
              id: 'del_002',
              type: 'code',
              title: 'GitHub Repository',
              description: 'React components with Tailwind CSS',
              url: 'https://github.com/mock/landing-page',
              proof: 'Commit: abc123def',
              verificationStatus: 'pending',
            },
            {
              id: 'del_003',
              type: 'link',
              title: 'Preview URL',
              description: 'Deployed preview on Vercel',
              url: 'https://preview.vercel.app/mock',
              verificationStatus: 'pending',
            },
          ],
          verificationMethod: 'ai',
          submittedAt: new Date('2026-01-05'),
          dueDate: new Date('2026-01-08'),
        },
        {
          id: 'mile_003',
          projectId: 'proj_001',
          title: 'Final Deployment & Documentation',
          description: 'Deploy to production and provide documentation',
          amount: 2.5,
          status: 'in_progress',
          deliverables: [],
          verificationMethod: 'client',
          dueDate: new Date('2026-01-10'),
        },
      ],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-05'),
    };

    this.projects.set(project1.id, project1);

    // Mock payments
    const payment1: PaymentRecord = {
      id: 'pay_001',
      projectId: 'proj_001',
      type: 'escrow_lock',
      amount: 10,
      fromAddress: client.address,
      toAddress: 'escrow_address',
      txId: 'mock_tx_escrow_001',
      status: 'confirmed',
      createdAt: new Date('2026-01-01'),
      confirmedAt: new Date('2026-01-01'),
    };

    const payment2: PaymentRecord = {
      id: 'pay_002',
      projectId: 'proj_001',
      milestoneId: 'mile_001',
      type: 'milestone_release',
      amount: 2.5,
      fromAddress: 'escrow_address',
      toAddress: freelancer.address,
      txId: 'mock_tx_release_001',
      status: 'confirmed',
      createdAt: new Date('2026-01-03'),
      confirmedAt: new Date('2026-01-03'),
    };

    this.payments.set(payment1.id, payment1);
    this.payments.set(payment2.id, payment2);
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(projectId: string): Promise<Project | null> {
    return this.projects.get(projectId) || null;
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project: Project = {
      ...projectData,
      id: `proj_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(projectId, updated);
    return updated;
  }

  // Milestone methods
  async updateMilestone(
    projectId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ): Promise<Milestone | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const milestoneIndex = project.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) return null;

    project.milestones[milestoneIndex] = {
      ...project.milestones[milestoneIndex],
      ...updates,
    };

    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return project.milestones[milestoneIndex];
  }

  async submitMilestone(projectId: string, milestoneId: string, deliverables: Deliverable[]): Promise<boolean> {
    const milestone = await this.updateMilestone(projectId, milestoneId, {
      status: 'submitted',
      deliverables,
      submittedAt: new Date(),
    });
    return !!milestone;
  }

  async verifyMilestone(projectId: string, milestoneId: string, approved: boolean): Promise<boolean> {
    if (approved) {
      const milestone = await this.updateMilestone(projectId, milestoneId, {
        status: 'verified',
        verifiedAt: new Date(),
      });
      return !!milestone;
    } else {
      const milestone = await this.updateMilestone(projectId, milestoneId, {
        status: 'in_progress',
      });
      return !!milestone;
    }
  }

  async releaseMilestonePayment(projectId: string, milestoneId: string): Promise<string> {
    // Simulate payment release
    const mockTxId = `mock_tx_release_${Date.now()}`;

    await this.updateMilestone(projectId, milestoneId, {
      status: 'paid',
      paidAt: new Date(),
      releaseTxId: mockTxId,
    });

    const project = this.projects.get(projectId);
    const milestone = project?.milestones.find((m) => m.id === milestoneId);

    if (project && milestone) {
      const payment: PaymentRecord = {
        id: `pay_${Date.now()}`,
        projectId,
        milestoneId,
        type: 'milestone_release',
        amount: milestone.amount,
        fromAddress: 'escrow_address',
        toAddress: project.freelancerAddress,
        txId: mockTxId,
        status: 'confirmed',
        createdAt: new Date(),
        confirmedAt: new Date(),
      };
      this.payments.set(payment.id, payment);
    }

    return mockTxId;
  }

  // User methods
  async getUser(address: string): Promise<User | null> {
    return this.users.get(address) || null;
  }

  // Payment methods
  async getPayments(projectId?: string): Promise<PaymentRecord[]> {
    const allPayments = Array.from(this.payments.values());
    if (projectId) {
      return allPayments.filter((p) => p.projectId === projectId);
    }
    return allPayments;
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();