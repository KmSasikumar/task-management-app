import type { Task, Project, User, Subtask, Comment } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async guestLogin(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/guest`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  },

  async login(email: string, pass: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to login');
    }
    return res.json();
  },

  async signup(name: string, email: string, pass: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to sign up');
    }
    return res.json();
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to update user');
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
