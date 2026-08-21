'use client';

import { useApp } from '@/lib/store';
import Avatar from '@/components/ui/Avatar';
import PriorityBadge from '@/components/ui/PriorityBadge';

function formatDate(d: string) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectsPage() {
  const { state } = useApp();
  
  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Projects</h1>
        <button className="h-9 px-4 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-1.5">
          <span className="text-lg leading-none">+</span>
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.projects.map(project => (
          <div key={project.id} className="bg-bg-primary border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-text-primary text-lg">{project.name}</h3>
              <button className="text-text-tertiary hover:text-text-secondary transition-colors">⋯</button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Priority</span>
                <PriorityBadge priority={project.priority} showLabel={false} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Due Date</span>
                <span className="text-text-primary font-medium">{formatDate(project.dueDate)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-text-secondary mb-1">Team Members</p>
                <div className="flex -space-x-1.5">
                  {project.members.map(m => <Avatar key={m} userId={m} size="sm" />)}
                  <button className="w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-tertiary text-xs hover:border-accent hover:text-accent transition-colors">+</button>
                </div>
              </div>
              <button className="text-sm font-medium text-accent hover:underline">View tasks →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
