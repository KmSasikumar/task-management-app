'use client';

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, Task, Project, User, Status, ViewMode, ThemeMode, AccentColor, FieldVisibility, FilterState, Subtask, Comment } from './types';

// ── Seed Data ──────────────────────────────────────────────────────────────

const defaultUser: User = {
  id: 'u1',
  name: 'Sasikumar',
  email: 'Sasikumar@gmail.com',
  avatar: '',
  title: 'Developer',
  username: 'Sasikumar',
  initials: 'S',
};

const seedMembers: Record<string, User> = {
  u1: defaultUser,
  u2: { id: 'u2', name: 'Ankit Dutta', email: 'ankit@gmail.com', avatar: '', title: 'Developer', username: 'ankit', initials: 'AD' },
  u3: { id: 'u3', name: 'Chris Nolan', email: 'chris@gmail.com', avatar: '', title: 'QA Lead', username: 'chris', initials: 'CN' },
  u4: { id: 'u4', name: 'Sarah Park', email: 'sarah@gmail.com', avatar: '', title: 'DevOps', username: 'sarah', initials: 'SP' },
};

const seedTasks: Task[] = [
  {
    id: 't1', title: 'Write API Documentation', description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.', status: 'todo', priority: 'urgent', members: ['u1'], dueDate: '2026-07-29', labels: ['Research', 'Design', 'Development', 'Testing', 'Deployment'], reporter: 'u1', projectId: 'p1', createdAt: '2026-07-20T10:00:00Z', updatedAt: '2026-08-21T10:00:00Z',
    subtasks: [
      { id: 'st1', title: 'Subtask 1', priority: 'high', members: ['u1'], dueDate: '2026-09-12', status: 'todo' },
      { id: 'st2', title: 'Subtask 2', priority: 'low', members: ['u3'], dueDate: '2026-09-15', status: 'doing' },
      { id: 'st3', title: 'Subtask 3', priority: 'medium', members: [], dueDate: '2026-09-18', status: 'todo' },
    ],
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Ankit Dutta', userAvatar: '', content: 'dsds', createdAt: '2026-08-21T14:00:00Z' },
    ],
  },
  {
    id: 't2', title: 'Implement Search Function', description: 'Add full-text search across tasks and projects.', status: 'todo', priority: 'high', members: ['u1'], dueDate: '2026-07-29', labels: ['Deployment'], reporter: 'u1', projectId: null, createdAt: '2026-07-21T10:00:00Z', updatedAt: '2026-07-21T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't3', title: 'Deploy to Production', description: 'Final deployment of the current sprint.', status: 'todo', priority: 'medium', members: ['u1'], dueDate: '2026-07-29', labels: ['Deployment'], reporter: 'u1', projectId: null, createdAt: '2026-07-22T10:00:00Z', updatedAt: '2026-07-22T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't4', title: 'Code Review Completed', description: 'All code has been reviewed for the sprint.', status: 'doing', priority: 'high', members: ['u1'], dueDate: '2026-07-29', labels: ['Deployment'], reporter: 'u2', projectId: null, createdAt: '2026-07-23T10:00:00Z', updatedAt: '2026-07-23T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't5', title: 'Design Mockups Finalized', description: 'Design mockups are complete and ready for dev.', status: 'doing', priority: 'medium', members: ['u1'], dueDate: '2026-07-29', labels: ['Deployment'], reporter: 'u1', projectId: null, createdAt: '2026-07-24T10:00:00Z', updatedAt: '2026-07-24T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't6', title: 'Feature Testing Passed', description: 'QA testing complete.', status: 'completed', priority: 'high', members: ['u3'], dueDate: '2026-07-30', labels: ['Testing', 'Passed'], reporter: 'u3', projectId: null, createdAt: '2026-07-25T10:00:00Z', updatedAt: '2026-07-25T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't7', title: 'UI Design Updated', description: 'Updated all UI components.', status: 'completed', priority: 'medium', members: ['u1'], dueDate: '2026-07-31', labels: ['Design', 'Updated'], reporter: 'u1', projectId: null, createdAt: '2026-07-26T10:00:00Z', updatedAt: '2026-07-26T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't8', title: 'Security Audit Scheduled', description: 'Security audit for Q3.', status: 'completed', priority: 'urgent', members: ['u4'], dueDate: '2026-08-01', labels: ['Audit', 'Scheduled'], reporter: 'u4', projectId: null, createdAt: '2026-07-27T10:00:00Z', updatedAt: '2026-07-27T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't9', title: 'Design Homepage', description: 'Create the homepage design.', status: 'todo', priority: 'high', members: ['u1'], dueDate: '2026-09-12', labels: ['Design'], reporter: 'u1', projectId: 'p1', createdAt: '2026-08-01T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't10', title: 'Develop Login Feature', description: 'Implement login/auth flow.', status: 'todo', priority: 'low', members: ['u3'], dueDate: '2026-09-15', labels: ['Development'], reporter: 'u3', projectId: 'p1', createdAt: '2026-08-02T10:00:00Z', updatedAt: '2026-08-02T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't11', title: 'Test Payment Gateway', description: 'Run payment tests.', status: 'todo', priority: 'medium', members: [], dueDate: '2026-09-18', labels: ['Testing'], reporter: 'u1', projectId: 'p1', createdAt: '2026-08-03T10:00:00Z', updatedAt: '2026-08-03T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't12', title: 'UI Review Pending', description: 'UI design review.', status: 'on-hold', priority: 'high', members: ['u1'], dueDate: '2026-08-05', labels: ['Design', 'Review'], reporter: 'u1', projectId: null, createdAt: '2026-07-28T10:00:00Z', updatedAt: '2026-07-28T10:00:00Z',
    subtasks: [], comments: [],
  },
  {
    id: 't13', title: 'Backend Integration', description: 'Backend API integration.', status: 'on-hold', priority: 'medium', members: ['u2'], dueDate: '2026-08-10', labels: ['Development'], reporter: 'u2', projectId: null, createdAt: '2026-07-29T10:00:00Z', updatedAt: '2026-07-29T10:00:00Z',
    subtasks: [], comments: [],
  },
];

const seedProjects: Project[] = [
  { id: 'p1', name: 'Design Homepage', priority: 'high', lead: 'u1', dueDate: '2026-09-12', members: ['u1', 'u3'], createdAt: '2026-08-01T10:00:00Z' },
  { id: 'p2', name: 'Develop Login Feature', priority: 'low', lead: 'u3', dueDate: '2026-09-15', members: ['u3'], createdAt: '2026-08-02T10:00:00Z' },
  { id: 'p3', name: 'Test Payment Gateway', priority: 'medium', lead: 'u4', dueDate: '2026-09-18', members: ['u1', 'u4'], createdAt: '2026-08-03T10:00:00Z' },
];

// ── Initial State ──────────────────────────────────────────────────────────

const defaultState: AppState = {
  user: defaultUser,
  tasks: seedTasks,
  projects: seedProjects,
  viewMode: 'list',
  fieldVisibility: { priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false },
  filters: { status: [], priority: [], search: '' },
  theme: 'light',
  accentColor: 'amber',
  isLoggedIn: false,
};

// ── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_ACCENT'; payload: AccentColor }
  | { type: 'SET_FIELD_VISIBILITY'; payload: Partial<FieldVisibility> }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_SUBTASK'; payload: { taskId: string; subtask: Subtask } }
  | { type: 'ADD_COMMENT'; payload: { taskId: string; comment: Comment } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: Status } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...defaultState };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ACCENT':
      return { ...state, accentColor: action.payload };
    case 'SET_FIELD_VISIBILITY':
      return { ...state, fieldVisibility: { ...state.fieldVisibility, ...action.payload } };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'UPDATE_TASK_STATUS':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, status: action.payload.status } : t) };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.taskId
            ? { ...t, subtasks: [...t.subtasks, action.payload.subtask] }
            : t
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.taskId
            ? { ...t, comments: [...t.comments, action.payload.comment] }
            : t
        ),
      };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  members: Record<string, User>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'pyramid-app-state';

function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch { /* ignore */ }
  return defaultState;
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

import { api } from './api';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState, () => loadState());

  // Load from API on mount
  useEffect(() => {
    async function loadFromApi() {
      try {
        const [apiTasks, apiProjects] = await Promise.all([
          api.getTasks(),
          api.getProjects()
        ]);
        if (apiTasks.length > 0) {
          dispatch({ type: 'SET_STATE', payload: { ...state, tasks: apiTasks as Task[], projects: apiProjects as Project[] } });
        }
      } catch (err) {
        console.error('Failed to load from backend API', err);
      }
    }
    loadFromApi();
  }, []);

  const enhancedDispatch = React.useCallback((action: Action) => {
    dispatch(action); // Optimistic UI update

    // Background sync to backend
    setTimeout(async () => {
      try {
        if (action.type === 'ADD_TASK') {
          await api.createTask(action.payload);
        } else if (action.type === 'UPDATE_TASK') {
          await api.updateTask(action.payload.id, action.payload);
        } else if (action.type === 'DELETE_TASK') {
          await api.deleteTask(action.payload);
        } else if (action.type === 'UPDATE_TASK_STATUS') {
          await api.updateTask(action.payload.taskId, { status: action.payload.status });
        } else if (action.type === 'UPDATE_USER') {
          if (state.user.id) {
            await api.updateUser(state.user.id, action.payload);
          }
        }
      } catch (err) {
        console.error('API Sync Error', err);
      }
    }, 0);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.setAttribute('data-accent', state.accentColor);
  }, [state.theme, state.accentColor]);

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch as React.Dispatch<Action>, members: seedMembers }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { seedMembers };
