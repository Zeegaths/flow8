const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export class BackendService {
  // Projects
  async getProjects() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects`);
      
      // If backend is not running, return empty array
      if (!response.ok) {
        console.warn('Backend not available, returning empty projects');
        return [];
      }
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.projects || [];
    } catch (error: any) {
      console.warn('Backend not available:', error.message);
      return []; // Return empty array instead of throwing
    }
  }

  async getProject(_projectId: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/projects/${_projectId}`);
      
      if (!response.ok) {
        throw new Error('Project not found');
      }
      
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
      
      if (!response.ok) {
        throw new Error('Failed to create project - backend not available');
      }
      
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
      
      if (!response.ok) {
        throw new Error('Failed to update milestone');
      }
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.milestone;
    } catch (error: any) {
      console.error('Update milestone failed:', error);
      throw error;
    }
  }

  async submitMilestone(projectId: string, milestoneId: string, deliverables: any[]) {
    return await this.updateMilestone(milestoneId, {
      status: 'submitted',
      deliverables,
      submittedAt: new Date().getTime(), // Use timestamp
    });
  }

  async verifyMilestone(milestoneId: string, approved: boolean) {
    if (approved) {
      return await this.updateMilestone(milestoneId, {
        status: 'verified',
        verifiedAt: new Date().getTime(),
      });
    } else {
      return await this.updateMilestone(milestoneId, {
        status: 'in-progress',
      });
    }
  }

  async releaseMilestonePayment(milestoneId: string) {
    return await this.updateMilestone(milestoneId, {
      status: 'paid',
      paidAt: new Date().getTime(),
      releaseTxId: `mnee_tx_${Date.now()}`,
    });
  }
}

export const backendService = new BackendService();