import type { Task, Project, User, Subtask, Comment } from './types';

const API_URL = 'http://localhost:3001';

export const api = {
  async guestLogin(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/guest`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  },
  
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) return [];
    return res.json();
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return res.json();
  },
  
  async deleteTask(id: string): Promise<void> {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) return [];
    return res.json();
  }
};
