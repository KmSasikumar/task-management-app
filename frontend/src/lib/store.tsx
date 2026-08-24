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

const seedTasks: Task[] = [];
const seedProjects: Project[] = [];

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
  | { type: 'LOGIN'; payload: User }
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
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: Status } }
  | { type: 'SET_API_DATA'; payload: { tasks: Task[]; projects: Project[] } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'LOGIN':
      return { ...state, isLoggedIn: true, user: action.payload };
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
    case 'SET_API_DATA':
      return { ...state, tasks: action.payload.tasks, projects: action.payload.projects };
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
        if (!state.isLoggedIn || !state.user.id) return;
        const [apiTasks, apiProjects] = await Promise.all([
          api.getTasks(),
          api.getProjects()
        ]);
        
        dispatch({ type: 'SET_API_DATA', payload: { tasks: apiTasks as Task[], projects: apiProjects as Project[] } });
        
      } catch (err) {
        console.error('Failed to load from backend API', err);
      }
    }
    loadFromApi();
  }, [state.isLoggedIn, state.user.id]);

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

  // Sync API user ID
  useEffect(() => {
    api.setUserId(state.user?.id || null);
  }, [state.user?.id]);

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
