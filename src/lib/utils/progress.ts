import type { Project } from '$lib/types';

export type Totals = { done: number; total: number };

export function computeTotals(project?: Project | null): Totals {
	if (!project) return { done: 0, total: 0 };
	return project.sections.reduce(
		(acc, sec) => {
			acc.total += sec.items.length;
			acc.done += sec.items.filter((i) => i.checked).length;
			return acc;
		},
		{ done: 0, total: 0 }
	);
}

export function valueFromTotals(t: Totals): number {
	return t.total === 0 ? 0 : t.done / t.total;
}

export function labelFromTotals(t: Totals): string {
	return `${t.done}/${t.total} completed`;
}
