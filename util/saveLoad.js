"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importState = exports.resetState = exports.exportState = exports.STATE_KEYS = void 0;
// All localStorage keys used across the app.
// Add new keys here whenever a new page stores persistent state.
exports.STATE_KEYS = [
    'monsterFight_state',
    'wildHunt_opponents_state',
    'witcherPicker_state',
    'locationTokens_tasks',
    'dicePoker_wildHuntMode',
];
function exportState() {
    const data = {};
    for (const key of exports.STATE_KEYS) {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
            try {
                data[key] = JSON.parse(raw);
            }
            catch (_a) {
                data[key] = raw;
            }
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
exports.exportState = exportState;
function resetState() {
    for (const key of exports.STATE_KEYS) {
        localStorage.removeItem(key);
    }
}
exports.resetState = resetState;
function importState(file, onDone) {
    const reader = new FileReader();
    reader.onload = (e) => {
        var _a;
        try {
            const data = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
            for (const key of exports.STATE_KEYS) {
                if (key in data) {
                    localStorage.setItem(key, JSON.stringify(data[key]));
                }
            }
        }
        catch (_b) {
            // invalid or unreadable file — leave existing state untouched
        }
        onDone();
    };
    reader.readAsText(file);
}
exports.importState = importState;
