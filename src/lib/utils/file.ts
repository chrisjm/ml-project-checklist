export function safeFileName(name: string, fallback = 'project'): string {
	const base = name && name.trim().length > 0 ? name : fallback;
	return base.replace(/[^a-z0-9-_]+/gi, '_');
}

export function download(filename: string, text: string): void {
	const blob = new Blob([text], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
