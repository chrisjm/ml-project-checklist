import type { ProjectsState } from '$lib/types';

const STORAGE_KEY = 'mlpchecklist:v1';

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadState(): ProjectsState | null {
	if (!isBrowser()) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as ProjectsState;
	} catch (e) {
		console.error('Failed to load state from localStorage', e);
		return null;
	}
}

export function saveState(state: ProjectsState): void {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save state to localStorage', e);
	}
}

export function clearState(): void {
	if (!isBrowser()) return;
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (e) {
		console.error('Failed to clear state from localStorage', e);
	}
}
