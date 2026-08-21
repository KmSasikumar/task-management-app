export type Priority = 'none' | 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'doing' | 'completed' | 'on-hold' | 'backlog';
export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';
export type ViewMode = 'list' | 'board';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  username: string;
  initials: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  priority: Priority;
  members: string[];
  dueDate: string;
  status: Status;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  members: string[];
  dueDate: string;
  labels: string[];
  reporter: string;
  projectId: string | null;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  lead: string;
  dueDate: string;
  members: string[];
  createdAt: string;
}

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  search: string;
}

export interface AppState {
  user: User;
  tasks: Task[];
  projects: Project[];
  viewMode: ViewMode;
  fieldVisibility: FieldVisibility;
  filters: FilterState;
  theme: ThemeMode;
  accentColor: AccentColor;
  isLoggedIn: boolean;
}
