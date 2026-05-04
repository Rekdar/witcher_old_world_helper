// All localStorage keys used across the app.
// Add new keys here whenever a new page stores persistent state.
export const STATE_KEYS = [
    'monsterFight_state',
    'wildHunt_opponents_state',
    'witcherPicker_state',
    'locationTokens_tasks',
] as const;

export function exportState(): void {
    const data: Record<string, unknown> = {};
    for (const key of STATE_KEYS) {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
            try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
        }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'witcher-old-world-state.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function resetState(): void {
    for (const key of STATE_KEYS) {
        localStorage.removeItem(key);
    }
}

export function importState(file: File, onDone: () => void): void {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            for (const key of STATE_KEYS) {
                if (key in data) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            }
        } catch {
            // invalid or unreadable file — leave existing state untouched
        }
        onDone();
    };
    reader.readAsText(file);
}
