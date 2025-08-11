import { writable } from 'svelte/store';
import type { ProjectsState, Project } from '$lib/types';
import { STATE_VERSION, newId } from '$lib/types';
import { loadState, saveState } from '$lib/storage/local';
import { createDefaultSections } from '$lib/data/template';

function nowISO() {
  return new Date().toISOString();
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function createProjectsStore() {
  const initial: ProjectsState = loadState() ?? { version: STATE_VERSION, projects: {} };
  const { subscribe, update, set } = writable<ProjectsState>(initial);

  const persist = debounce((state: ProjectsState) => saveState(state), 150);

  // persist on changes
  subscribe((state) => {
    // update updatedAt for projects could be done per mutation; keep persist only here
    persist(state);
  });

  return {
    subscribe,
    set,
    // CRUD
    createProject(name: string): string {
      const id = newId();
      const createdAt = nowISO();
      const project: Project = {
        id,
        name: name.trim() || 'Untitled Project',
        createdAt,
        updatedAt: createdAt,
        sections: createDefaultSections()
      };
      update((s) => {
        s = structuredClone(s);
        s.projects[id] = project;
        return s;
      });
      return id;
    },
    duplicateProject(id: string): string {
      let newIdValue = '';
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[id];
        if (!p) return s;
        const id2 = newId();
        const now = nowISO();
        const copy: Project = {
          ...structuredClone(p),
          id: id2,
          name: `${p.name} (Copy)`,
          createdAt: now,
          updatedAt: now
        };
        s.projects[id2] = copy;
        newIdValue = id2;
        return s;
      });
      return newIdValue;
    },
    deleteProject(id: string) {
      update((s) => {
        s = structuredClone(s);
        delete s.projects[id];
        return s;
      });
    },
    renameProject(id: string, name: string) {
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[id];
        if (p) {
          p.name = name.trim() || p.name;
          p.updatedAt = nowISO();
        }
        return s;
      });
    },
    exportProject(id: string): string {
      let p: Project | undefined;
      const unsub = subscribe((s) => {
        p = s.projects[id];
      });
      unsub();
      if (!p) throw new Error('Project not found');
      return JSON.stringify({ version: STATE_VERSION, project: p }, null, 2);
    },
    importProject(json: string): string {
      let data: unknown;
      try {
        data = JSON.parse(json);
      } catch {
        throw new Error('Invalid JSON');
      }
      const maybe: any = data as any;
      const src = maybe?.project ?? maybe;
      if (!src || typeof src !== 'object') throw new Error('Invalid project payload');
      const name = typeof src.name === 'string' ? src.name : 'Imported Project';
      const sections = Array.isArray(src.sections) ? src.sections : [];
      const id = newId();
      const now = nowISO();
      const project: Project = {
        id,
        name,
        createdAt: now,
        updatedAt: now,
        sections
      };
      update((s) => {
        s = structuredClone(s);
        s.projects[id] = project;
        return s;
      });
      return id;
    },
    toggleItem(projectId: string, sectionId: string, itemId: string) {
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[projectId];
        if (!p) return s;
        const sec = p.sections.find((x) => x.id === sectionId);
        if (!sec) return s;
        const it = sec.items.find((x) => x.id === itemId);
        if (it) {
          it.checked = !it.checked;
          p.updatedAt = nowISO();
        }
        return s;
      });
    },
    addItem(projectId: string, sectionId: string, text: string) {
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[projectId];
        const sec = p?.sections.find((x) => x.id === sectionId);
        if (sec) {
          sec.items.push({ id: newId(), text: text.trim(), checked: false });
          p!.updatedAt = nowISO();
        }
        return s;
      });
    },
    removeItem(projectId: string, sectionId: string, itemId: string) {
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[projectId];
        const sec = p?.sections.find((x) => x.id === sectionId);
        if (sec) {
          sec.items = sec.items.filter((x) => x.id !== itemId);
          p!.updatedAt = nowISO();
        }
        return s;
      });
    },
    updateNotes(projectId: string, sectionId: string, notes: string) {
      update((s) => {
        s = structuredClone(s);
        const p = s.projects[projectId];
        const sec = p?.sections.find((x) => x.id === sectionId);
        if (sec) {
          sec.notes = notes;
          p!.updatedAt = nowISO();
        }
        return s;
      });
    }
  };
}

export const projects = createProjectsStore();
