export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  sections: ChecklistSection[];
}

export type Theme = 'light' | 'dark' | 'system';

export interface ProjectsState {
  version: number;
  projects: Record<string, Project>;
  theme: Theme;
}

export const STATE_VERSION = 1;

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
