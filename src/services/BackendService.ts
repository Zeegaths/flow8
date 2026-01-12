const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export class BackendService {
  // Projects
  async getProjects() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.projects;
    } catch (error: any) {
      console.error('Get projects failed:', error);
      throw error;
    }
  }

  async getProject(_projectId: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/${_projectId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.project;
    } catch (error: any) {
      console.error('Get project failed:', error);
      throw error;
    }
  }

  async createProject(projectData: any) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.project;
    } catch (error: any) {
      console.error('Create project failed:', error);
      throw error;
    }
  }

  // Milestones
  async updateMilestone(milestoneId: string, updates: any) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.milestone;
    } catch (error: any) {
      console.error('Update milestone failed:', error);
      throw error;
    }
  }

  async submitMilestone(projectId: string, milestoneId: string, deliverables: any[]) {
    try {
      return await this.updateMilestone(milestoneId, {
        status: 'submitted',
        deliverables,
        submittedAt: new Date(),
      });
    } catch (error: any) {
      console.error('Submit milestone failed:', error);
      throw error;
    }
  }

  async verifyMilestone(milestoneId: string, approved: boolean) {
    try {
      if (approved) {
        return await this.updateMilestone(milestoneId, {
          status: 'verified',
          verifiedAt: new Date(),
        });
      } else {
        return await this.updateMilestone(milestoneId, {
          status: 'in_progress',
        });
      }
    } catch (error: any) {
      console.error('Verify milestone failed:', error);
      throw error;
    }
  }

  async releaseMilestonePayment(milestoneId: string) {
    try {
      return await this.updateMilestone(milestoneId, {
        status: 'paid',
        paidAt: new Date(),
        releaseTxId: `mock_tx_${Date.now()}`, // TODO: Real MNEE transaction
      });
    } catch (error: any) {
      console.error('Release payment failed:', error);
      throw error;
    }
  }
}

export const backendService = new BackendService();