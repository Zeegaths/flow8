import { useState, useEffect } from 'react';
import { backendService } from '../services/BackendService';
import type { Project } from '../types/index.ts';
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Plus,
  ArrowRight,
} from 'lucide-react';
interface DashboardProps {
  onNavigate: (page: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await backendService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    totalEarned: projects
      .flatMap((p) => p.milestones)
      .filter((m) => m.status === 'paid')
      .reduce((sum, m) => sum + m.amount, 0),
    pending: projects
      .flatMap((p) => p.milestones)
      .filter((m) => m.status === 'submitted' || m.status === 'under_review').length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your projects and milestones</p>
          </div>
          <button
            onClick={() => onNavigate('create-project')}
            className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Briefcase}
            label="Active Projects"
            value={stats.active}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Clock}
            label="Pending Reviews"
            value={stats.pending}
            color="from-orange-500 to-yellow-500"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completed}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Earned"
            value={`${stats.totalEarned} MNEE`}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No projects yet</p>
              <button
                onClick={() => onNavigate('create-project')}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function ProjectCard({ project, onNavigate }: any) {
  const completedMilestones = project.milestones.filter((m: any) => m.status === 'paid').length;
  const totalMilestones = project.milestones.length;
  const progress = (completedMilestones / totalMilestones) * 100;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm">{project.description}</p>
        </div>
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

      <div className="flex items-center gap-6 mb-4">
        <div className="text-sm">
          <span className="text-gray-400">Total: </span>
          <span className="font-bold">{project.totalAmount} MNEE</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Milestones: </span>
          <span className="font-bold">
            {completedMilestones}/{totalMilestones}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onNavigate('project-detail', project.id)}
        className="text-purple-400 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all"
      >
        View Details
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}