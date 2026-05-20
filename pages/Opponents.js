"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
const generic_1 = require("../util/generic");
require("../css/Opponents.css");
const wild_hunt_monster_json_1 = __importDefault(require("../wild_hunt_monster.json"));
// ── Shield defaults by [numPlayers][difficulty] ────────────────────────────
const DEFAULT_SHIELDS = {
    1: { easy: 5, normal: 7, hard: 9, veryHard: 11 },
    2: { easy: 28, normal: 31, hard: 34, veryHard: 37 },
    3: { easy: 54, normal: 58, hard: 62, veryHard: 66 },
    4: { easy: 77, normal: 82, hard: 87, veryHard: 92 },
    5: { easy: 97, normal: 106, hard: 113, veryHard: 120 },
};
// ── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'wildHunt_opponents_state';
const knights = wild_hunt_monster_json_1.default;
const HOUND_REWARDS = {
    1: [
        'Weź dowolny żeton tropu.',
        'Weź na rękę 1 kartę z wierzchu swojej talii.',
    ],
    2: [
        'Podnieś swój poziom najsłabszego atrybutu o 1.',
        'Weź z puli odkrytych kart akcji dowolną kartę o koszcie 0 i odłóż ją na swój stos kart odrzuconych.',
    ],
    3: [
        'Podnieś swój poziom dowolnego atrybutu o 1.',
        'Weź z puli odkrytych kart akcji dowolną kartę o koszcie 1 i odłóż ją na swój stos kart odrzuconych.',
    ],
};
const GUIDE_TABLES = {
    1: [
        ['1', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I', 'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór poziomu I', 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar II', 'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór II', 'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III', 'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Potwór III', 'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'X', 'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji', 'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem', ''],
    ],
    2: [
        ['1', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I', 'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór I', 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I + potwór II', 'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar II', 'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Potwór III', 'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III + potwór III', 'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'X', 'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji', 'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem', ''],
    ],
    3: [
        ['1', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I', 'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór I', 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I + potwór II', 'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór II', 'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar II + potwór III', 'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III + potwór III', 'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'X', 'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji', 'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem', ''],
    ],
    4: [
        ['1', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I', 'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar II + potwór II', 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór II + potwór I', 'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar II + potwór III', 'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III + potwór III', 'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III', 'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Brak eksploracji', 'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem', ''],
    ],
    5: [
        ['1', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar I + potwór I', 'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar II + potwór II', 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Potwór II + potwór II', 'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I', 'Dobierz + kup kartę', 'Ogar II + potwór III', 'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III + potwór III', 'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II', 'Dobierz + kup kartę', 'Ogar III', 'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Brak eksploracji', 'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem', ''],
    ],
};
const TABLE_HEADERS = ['Runda', 'Ruch i akcje', 'Walka / eksploracja', 'Dobieranie i kupowanie', 'Pojawienie ogara / potwora', 'Ruch jeźdźca DG'];
const MAIN_CARDS = Array.from({ length: 20 }, (_, i) => `monster_trial_${String(i + 1).padStart(2, '0')}.jpg`);
const WILD_HUNT_TRACKS = [
    { title: 'Eredin, King Of The Hunt', src: require('../music/wild_hunt/Eredin, King Of The Hunt.mp3') },
    { title: 'Hail To Caranthir', src: require('../music/wild_hunt/Hail To Caranthir.mp3') },
    { title: 'On Thin Ice', src: require('../music/wild_hunt/On Thin Ice.mp3') },
    { title: 'The Hunt Is Coming', src: require('../music/wild_hunt/The Hunt Is Coming.mp3') },
    { title: 'Welcome, Imlerith', src: require('../music/wild_hunt/Welcome, Imlerith.mp3') },
];
// ── Default state ──────────────────────────────────────────────────────────
const DEFAULT_STATE = {
    numPlayers: 2,
    difficulty: 'normal',
    selectedKnightName: null,
    selectedCell: null,
    savedPlayerNames: null,
    houndShieldCount: 0,
    houndNote: '',
    drawnHoundRewards: [],
    knightHp: 20,
    knightShieldCount: DEFAULT_SHIELDS[2]['normal'],
    knightFightStarted: false,
    knightFightDeck: [],
    knightFightHp: 0,
    knightRevealedCards: [],
};
function readWitcherPickerState() {
    var _a, _b;
    try {
        return (_b = JSON.parse((_a = localStorage.getItem('witcherPicker_state')) !== null && _a !== void 0 ? _a : '{}')) !== null && _b !== void 0 ? _b : {};
    }
    catch (_c) {
        return {};
    }
}
function loadState() {
    var _a;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw)
            return Object.assign(Object.assign({}, DEFAULT_STATE), JSON.parse(raw));
    }
    catch (_b) { }
    const wp = readWitcherPickerState();
    const names = ((_a = wp.playerNames) !== null && _a !== void 0 ? _a : []).filter(n => n === null || n === void 0 ? void 0 : n.trim());
    return Object.assign(Object.assign({}, DEFAULT_STATE), { numPlayers: typeof wp.numPlayers === 'number' ? wp.numPlayers : DEFAULT_STATE.numPlayers, savedPlayerNames: names.length > 0 ? names : null });
}
function saveState(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
// ── Image preloads ─────────────────────────────────────────────────────────
const knightMiniImages = Object.fromEntries(knights.map(k => [k.name_pl, require(`../img/monsters/wildHunt/${k.name_pl.toLowerCase()}Mini.png`)]));
const knightFrontImages = Object.fromEntries(knights.map(k => [k.name_pl, require(`../img/wild_hunt/${k.front_name}.jpg`)]));
const knightBackImages = Object.fromEntries(knights.map(k => [k.name_pl, require(`../img/wild_hunt/${k.back_name}.jpg`)]));
const abilityImages = Object.fromEntries(knights.flatMap(k => k.abilities.map(a => [a, require(`../img/wild_hunt/${a}.jpg`)])));
const houndCardImages = Object.fromEntries([1, 2, 3, 4, 5].map(n => [n, require(`../img/wild_hunt/hound_card_player_${n}.jpg`)]));
const roundsImages = Object.fromEntries([1, 2, 3, 4, 5].map(n => [n, require(`../img/wild_hunt/rounds_player_${n}.jpg`)]));
const houndRewardIcons = {
    1: require('../img/wild_hunt/hound1.png'),
    2: require('../img/wild_hunt/hound2.png'),
    3: require('../img/wild_hunt/hound3.png'),
};
const preparationImg = require('../img/wild_hunt/preparation.jpg');
const frozenShieldImg = require('../img/wild_hunt/frozen_shield.png');
const deckBackImg = require('../img/monster_fight/back.jpg');
const mainCardImages = Object.fromEntries(MAIN_CARDS.map(f => [f, require(`../img/monster_fight/${f}`)]));
// ── Helpers ────────────────────────────────────────────────────────────────
function buildKnightDeck(knight) {
    const abilityKeys = knight.abilities.map(a => `ability:${a}`);
    const mainKeys = MAIN_CARDS.map(f => `main:${f}`);
    const selected16 = (0, generic_1.shuffle)([...mainKeys]).slice(0, 16);
    return (0, generic_1.shuffle)([...abilityKeys, ...selected16]);
}
function getCardImage(key) {
    if (key.startsWith('ability:'))
        return abilityImages[key.slice(8)];
    return mainCardImages[key.slice(5)];
}
// ── Component ─────────────────────────────────────────────────────────────
function Opponents({ t }) {
    var _a, _b, _c, _d;
    const [state, setState] = (0, react_1.useState)(loadState);
    const [enlargedImage, setEnlargedImage] = (0, react_1.useState)(null);
    // Player form state
    const [isEditingPlayers, setIsEditingPlayers] = (0, react_1.useState)(false);
    const [editPlayerNames, setEditPlayerNames] = (0, react_1.useState)([]);
    const [formErrors, setFormErrors] = (0, react_1.useState)([]);
    // Wild Hunt movement
    const [wildHuntResult, setWildHuntResult] = (0, react_1.useState)(null);
    const [wildHuntDrawKey, setWildHuntDrawKey] = (0, react_1.useState)(0);
    // Knight fight UI
    const [knightAttackResult, setKnightAttackResult] = (0, react_1.useState)(null);
    const [knightAttackKey, setKnightAttackKey] = (0, react_1.useState)(0);
    // Music
    const [musicPlaying, setMusicPlaying] = (0, react_1.useState)(false);
    const [currentTrackTitle, setCurrentTrackTitle] = (0, react_1.useState)(null);
    const audioRef = (0, react_1.useRef)(null);
    // Modals
    const [preparationOpen, setPreparationOpen] = (0, react_1.useState)(false);
    const [houndRulesOpen, setHoundRulesOpen] = (0, react_1.useState)(false);
    const [knightFightRulesOpen, setKnightFightRulesOpen] = (0, react_1.useState)(false);
    const [knightHelpOpen, setKnightHelpOpen] = (0, react_1.useState)(false);
    const [peekOpen, setPeekOpen] = (0, react_1.useState)(false);
    const [peekPhase, setPeekPhase] = (0, react_1.useState)('input');
    const [peekCount, setPeekCount] = (0, react_1.useState)(1);
    const [peekCards, setPeekCards] = (0, react_1.useState)([]);
    const [peekOriginalCount, setPeekOriginalCount] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => { saveState(state); }, [state]);
    (0, react_1.useEffect)(() => {
        if (!state.knightFightStarted) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setMusicPlaying(false);
            setCurrentTrackTitle(null);
            return;
        }
        let cancelled = false;
        function playNext(exclude, autoplay = false) {
            if (cancelled)
                return;
            const pool = WILD_HUNT_TRACKS.filter(t => t.title !== exclude || WILD_HUNT_TRACKS.length === 1);
            const track = (0, generic_1.shuffle)([...pool])[0];
            const audio = new Audio(track.src);
            audioRef.current = audio;
            setCurrentTrackTitle(track.title);
            audio.onended = () => playNext(track.title, true);
            if (autoplay)
                void audio.play().catch(() => { });
        }
        playNext();
        return () => { cancelled = true; if (audioRef.current) {
            audioRef.current.onended = null;
            audioRef.current.pause();
        } };
    }, [state.knightFightStarted]);
    function handleMusicToggle() {
        if (!audioRef.current)
            return;
        if (musicPlaying) {
            audioRef.current.pause();
        }
        else {
            void audioRef.current.play();
        }
        setMusicPlaying(m => !m);
    }
    const selectedKnight = (_a = knights.find(k => k.name_pl === state.selectedKnightName)) !== null && _a !== void 0 ? _a : null;
    function set(patch) {
        setState(s => (Object.assign(Object.assign({}, s), patch)));
    }
    // ── Player handlers ────────────────────────────────────────────────────
    function handleNumPlayersChange(n) {
        set({ numPlayers: n, selectedCell: null, knightShieldCount: DEFAULT_SHIELDS[n][state.difficulty] });
        if (isEditingPlayers) {
            setEditPlayerNames(prev => {
                const updated = [...prev];
                while (updated.length < n)
                    updated.push('');
                return updated.slice(0, n);
            });
        }
    }
    function handleStartEditPlayers() {
        var _a, _b;
        const wp = readWitcherPickerState();
        const base = (_a = state.savedPlayerNames) !== null && _a !== void 0 ? _a : ((_b = wp.playerNames) !== null && _b !== void 0 ? _b : []).filter(n => n === null || n === void 0 ? void 0 : n.trim());
        const n = state.numPlayers;
        const padded = [...base.slice(0, n)];
        while (padded.length < n)
            padded.push('');
        setEditPlayerNames(padded);
        setIsEditingPlayers(true);
        setFormErrors([]);
    }
    function handleSavePlayers() {
        const errors = [];
        editPlayerNames.forEach((name, i) => {
            if (!name.trim())
                errors.push(`Gracz ${i + 1}: brak nazwy`);
        });
        if (errors.length) {
            setFormErrors(errors);
            return;
        }
        set({ savedPlayerNames: editPlayerNames.map(n => n.trim()) });
        setIsEditingPlayers(false);
        setFormErrors([]);
        setWildHuntResult(null);
    }
    // ── Wild Hunt movement ─────────────────────────────────────────────────
    function handleWildHuntDraw() {
        var _a;
        if (!((_a = state.savedPlayerNames) === null || _a === void 0 ? void 0 : _a.length))
            return;
        const pool = [...state.savedPlayerNames, 'Gracz decyduje'];
        setWildHuntResult((0, generic_1.shuffle)([...pool])[0]);
        setWildHuntDrawKey(k => k + 1);
    }
    // ── Hound reward ───────────────────────────────────────────────────────
    function handleDrawHoundReward(level) {
        const options = HOUND_REWARDS[level];
        const drawnIndices = new Set(state.drawnHoundRewards.filter(r => r.level === level).map(r => r.index));
        const remaining = options
            .map((text, index) => ({ index, text }))
            .filter(r => !drawnIndices.has(r.index));
        if (remaining.length === 0)
            return;
        const picked = (0, generic_1.shuffle)([...remaining])[0];
        set({ drawnHoundRewards: [...state.drawnHoundRewards, { level, index: picked.index, text: picked.text }] });
    }
    // ── Knight fight handlers ──────────────────────────────────────────────
    function handleStartKnightFight() {
        if (!selectedKnight || state.knightHp <= 0)
            return;
        const deck = buildKnightDeck(selectedKnight);
        set({
            knightFightStarted: true,
            knightFightDeck: deck,
            knightFightHp: state.knightHp,
            knightRevealedCards: [],
        });
    }
    function handleDrawKnightCard() {
        if (state.knightFightDeck.length === 0)
            return;
        const [drawn, ...remaining] = state.knightFightDeck;
        set({
            knightFightDeck: remaining,
            knightFightHp: Math.max(0, state.knightFightHp - 1),
            knightRevealedCards: [...state.knightRevealedCards, drawn],
        });
    }
    function handleAddKnightCard() {
        const allMain = MAIN_CARDS.map(f => `main:${f}`);
        const used = new Set([...state.knightFightDeck, ...state.knightRevealedCards]);
        const available = allMain.filter(k => !used.has(k));
        if (available.length === 0)
            return;
        const picked = (0, generic_1.shuffle)([...available])[0];
        set({ knightFightDeck: [...state.knightFightDeck, picked] });
    }
    function handleKnightAttack() {
        const options = [t('opponents.monsterBite'), t('opponents.monsterCharge')];
        setKnightAttackResult((0, generic_1.shuffle)([...options])[0]);
        setKnightAttackKey(k => k + 1);
    }
    function handleEndKnightFight() {
        set({ knightFightStarted: false, knightFightDeck: [], knightFightHp: 0, knightRevealedCards: [] });
        setKnightAttackResult(null);
    }
    function handleOpenPeek() {
        setPeekPhase('input');
        setPeekCount(Math.min(3, state.knightFightDeck.length));
        setPeekOpen(true);
    }
    function handleConfirmPeek() {
        const count = Math.max(1, Math.min(peekCount, state.knightFightDeck.length));
        setPeekOriginalCount(count);
        setPeekCards(state.knightFightDeck.slice(0, count));
        setPeekPhase('arrange');
    }
    function handlePeekMove(idx, dir) {
        setPeekCards(cards => {
            const arr = [...cards];
            const swap = idx + dir;
            if (swap < 0 || swap >= arr.length)
                return arr;
            [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
            return arr;
        });
    }
    function handlePeekDelete(idx) {
        setPeekCards(cards => cards.filter((_, i) => i !== idx));
    }
    function handlePeekSave() {
        const removed = peekOriginalCount - peekCards.length;
        set({
            knightFightDeck: [...peekCards, ...state.knightFightDeck.slice(peekOriginalCount)],
            knightFightHp: Math.max(0, state.knightFightHp - removed),
        });
        setPeekOpen(false);
    }
    function handleReset() {
        var _a;
        const wp = readWitcherPickerState();
        const numPlayers = typeof wp.numPlayers === 'number' ? wp.numPlayers : state.numPlayers;
        const names = ((_a = wp.playerNames) !== null && _a !== void 0 ? _a : []).filter(n => n === null || n === void 0 ? void 0 : n.trim());
        setState(Object.assign(Object.assign({}, DEFAULT_STATE), { numPlayers, savedPlayerNames: names.length > 0 ? names : null }));
        localStorage.removeItem(STORAGE_KEY);
        setWildHuntResult(null);
        setKnightAttackResult(null);
        setIsEditingPlayers(false);
    }
    // ── Cell selection ─────────────────────────────────────────────────────
    function handleCellClick(rowIdx, colIdx) {
        const current = state.selectedCell;
        if (current && current[0] === rowIdx && current[1] === colIdx) {
            set({ selectedCell: null });
        }
        else {
            set({ selectedCell: [rowIdx, colIdx] });
        }
    }
    // ── Fight view ─────────────────────────────────────────────────────────
    if (state.knightFightStarted && selectedKnight) {
        const lastCard = (_b = state.knightRevealedCards[state.knightRevealedCards.length - 1]) !== null && _b !== void 0 ? _b : null;
        const deckEmpty = state.knightFightDeck.length === 0;
        return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "Opponents", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: "Walka z je\u017Ad\u017Acem Dzikiego Gonu" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 10, lg: 8, children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-3 d-flex justify-content-center align-items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: knightBackImages[selectedKnight.name_pl], style: { maxWidth: '300px', width: '100%', cursor: 'zoom-in' }, alt: selectedKnight.name_pl, rounded: true, onClick: () => setEnlargedImage(knightBackImages[selectedKnight.name_pl]) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", style: { flexShrink: 0 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "fw-semibold mb-1", children: ["Liczba tarcz: ", state.knightShieldCount] }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex align-items-center gap-2", children: [state.knightShieldCount > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: frozenShieldImg, style: { width: '256px' }, alt: "Tarcze" })), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-column align-items-center", style: { gap: '4px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", style: { width: '72px', fontSize: '1.2rem' }, onClick: () => set({ knightShieldCount: state.knightShieldCount + 1 }), children: "+" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", value: state.knightShieldCount, className: "text-center", style: { width: '72px', fontSize: '1.1rem' }, onChange: e => set({ knightShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", style: { width: '72px', fontSize: '1.2rem' }, onClick: () => set({ knightShieldCount: Math.max(0, state.knightShieldCount - 1) }), children: "\u2212" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-3 d-flex flex-wrap align-items-center justify-content-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "fs-4 fw-bold", children: ["HP: ", state.knightFightHp] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-info", size: "sm", onClick: () => setKnightHelpOpen(true), children: "Pomoc" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-danger", size: "sm", onClick: handleKnightAttack, children: "Atak potwora" })] }), knightAttackResult && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "dark", className: "text-center fs-5 fw-bold result-pop mb-3", children: knightAttackResult }, knightAttackKey)), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "justify-content-center mb-4 g-3 align-items-start", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-1 fw-semibold d-flex align-items-center justify-content-center gap-1 flex-wrap", children: ["Talia (", state.knightFightDeck.length, ")", (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: handleAddKnightCard, children: "Dodaj kart\u0119" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", disabled: deckEmpty, onClick: handleOpenPeek, children: "Podejrzyj" })] }), deckEmpty ? ((0, jsx_runtime_1.jsx)("div", { className: "text-muted fst-italic py-4", children: "Talia pusta" })) : ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: deckBackImg, style: { maxWidth: '200px', width: '100%', cursor: 'pointer' }, alt: "talia", rounded: true, onClick: handleDrawKnightCard }))] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 fw-semibold", children: "Ostatnia karta" }), lastCard ? ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: getCardImage(lastCard), style: { maxWidth: '200px', width: '100%', cursor: 'zoom-in' }, alt: "karta", rounded: true, onClick: () => setEnlargedImage(getCardImage(lastCard)) })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-muted fst-italic py-4", children: "\u2014" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex justify-content-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", disabled: state.knightRevealedCards.length === 0, onClick: () => {
                                            const last = state.knightRevealedCards[state.knightRevealedCards.length - 1];
                                            set({
                                                knightFightDeck: [last, ...state.knightFightDeck],
                                                knightFightHp: state.knightFightHp + 1,
                                                knightRevealedCards: state.knightRevealedCards.slice(0, -1),
                                            });
                                        }, children: "\u21A9 Cofnij" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "danger", onClick: handleEndKnightFight, children: "Koniec walki" })] })] }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: knightHelpOpen, onHide: () => setKnightHelpOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Zasady walki z je\u017Ad\u017Acem" }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Przygotowanie:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Zachowujesz r\u0119k\u0119." }), (0, jsx_runtime_1.jsx)("li", { children: "Tasujesz tali\u0119 + odrzucone." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Zasada kluczowa:" }), (0, jsx_runtime_1.jsx)("p", { children: "Najpierw schodz\u0105 tarcze, potem \u201E\u017Cycie\" (talia wytrzyma\u0142o\u015Bci)." }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Przebieg:" }), (0, jsx_runtime_1.jsxs)("ol", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Gracze stoj\u0105cy ju\u017C na polu je\u017Ad\u017Aca rozgrywaj\u0105 swoje tury walki." }), (0, jsx_runtime_1.jsxs)("li", { children: ["Wszyscy pozostali gracze:", (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "natychmiast przenosz\u0105 si\u0119 na pole je\u017Ad\u017Aca (ignoruj\u0105c normalny ruch)," }), (0, jsx_runtime_1.jsx)("li", { children: "nie wykonuj\u0105 \u017Cadnej tury walki w tej rundzie (po prostu do\u0142\u0105czaj\u0105)." })] })] }), (0, jsx_runtime_1.jsx)("li", { children: "Tura je\u017Ad\u017Aca." }), (0, jsx_runtime_1.jsx)("li", { children: "Tury wszystkich \u017Cyj\u0105cych graczy." })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted fst-italic", children: "\u2192 Powtarzasz kroki 3\u20134." }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Tura gracza:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Standardowa walka." }), (0, jsx_runtime_1.jsx)("li", { children: "Obra\u017Cenia \u2192 najpierw tarcze, potem talia je\u017Ad\u017Aca." }), (0, jsx_runtime_1.jsx)("li", { children: "Odrzucenie karty je\u017Ad\u017Aca \u2192 atak pasywny." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Tura je\u017Ad\u017Aca:" }), (0, jsx_runtime_1.jsx)("ul", { children: (0, jsx_runtime_1.jsxs)("li", { children: ["Odkrywasz kart\u0119:", (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "karta je\u017Ad\u017Aca \u2192 efekt dla wszystkich" }), (0, jsx_runtime_1.jsx)("li", { children: "zwyk\u0142a karta \u2192 ka\u017Cdy gracz rzuca \u017Cetonem szar\u017Cy/ugryzienia (jak monet\u0105) i rozpatruje efekt" })] })] }) }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Powalenie:" }), (0, jsx_runtime_1.jsx)("p", { children: "Brak kart + pusta talia \u2192 odpadasz z walki." }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Wynik:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Wygrana:" }), " talia je\u017Ad\u017Aca = 0 i kto\u015B \u017Cyje."] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Przegrana:" }), " wszyscy padn\u0105."] })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setKnightHelpOpen(false), children: "Zamknij" }) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: peekOpen, onHide: () => setPeekOpen(false), centered: true, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Podejrzyj tali\u0119" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { children: peekPhase === 'input' ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { onSubmit: e => { e.preventDefault(); handleConfirmPeek(); }, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: "Ile kart podejrze\u0107?" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", min: 1, max: state.knightFightDeck.length, value: peekCount, onChange: e => setPeekCount(Math.max(1, Math.min(Number(e.target.value), state.knightFightDeck.length))), autoFocus: true })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", type: "submit", className: "w-100", children: "Podejrzyj" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { style: { maxHeight: '60vh', overflowY: 'auto' }, children: peekCards.map((card, idx) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { className: "d-flex align-items-center gap-2 py-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-muted fw-bold", style: { minWidth: '1.5rem' }, children: [idx + 1, "."] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: getCardImage(card), height: 210, style: { objectFit: 'contain', cursor: 'zoom-in' }, rounded: true, onClick: () => setEnlargedImage(getCardImage(card)) }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-1", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-secondary", disabled: idx === 0, onClick: () => handlePeekMove(idx, -1), children: "\u2191" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-secondary", disabled: idx === peekCards.length - 1, onClick: () => handlePeekMove(idx, 1), children: "\u2193" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-danger", onClick: () => handlePeekDelete(idx), children: "\u2715" })] })] }, card))) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", className: "w-100 mt-3", onClick: handlePeekSave, children: "Zatwierd\u017A kolejno\u015B\u0107" })] })) })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedImage !== null, onHide: () => setEnlargedImage(null), centered: true, size: "lg", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: enlargedImage && (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: enlargedImage, style: { maxWidth: '100%', maxHeight: '90vh' }, onClick: () => setEnlargedImage(null) }) }) }), (0, jsx_runtime_1.jsxs)("div", { style: { position: 'fixed', bottom: '1.2rem', right: '1.2rem', zIndex: 1050, display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [currentTrackTitle && ((0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.72rem', color: '#aaa', fontStyle: 'italic', maxWidth: '160px', textAlign: 'right', lineHeight: 1.2 }, children: currentTrackTitle })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: musicPlaying ? 'warning' : 'outline-secondary', onClick: handleMusicToggle, style: { borderRadius: '50%', width: '48px', height: '48px', fontSize: '1.3rem', lineHeight: 1, padding: 0, flexShrink: 0 }, title: musicPlaying ? `Pauza – ${currentTrackTitle !== null && currentTrackTitle !== void 0 ? currentTrackTitle : ''}` : 'Odtwórz muzykę', children: "\uD83C\uDFB5" })] })] }));
    }
    // ── Setup / main view ──────────────────────────────────────────────────
    const guideRows = (_c = GUIDE_TABLES[state.numPlayers]) !== null && _c !== void 0 ? _c : GUIDE_TABLES[2];
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "Opponents", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('opponents.title') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 11, lg: 10, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Body, { children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "align-items-start g-3", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, sm: "auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "fw-semibold mb-1", style: { fontSize: '0.9rem' }, children: "Liczba graczy" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Select, { size: "sm", style: { width: 'auto' }, value: state.numPlayers, onChange: e => handleNumPlayersChange(Number(e.target.value)), children: [1, 2, 3, 4, 5].map(n => ((0, jsx_runtime_1.jsx)("option", { value: n, children: n }, n))) }), (0, jsx_runtime_1.jsx)("div", { className: "fw-semibold mb-1 mt-2", style: { fontSize: '0.9rem' }, children: "Poziom trudno\u015Bci" }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Select, { size: "sm", style: { width: 'auto' }, value: state.difficulty, onChange: e => {
                                                        const d = e.target.value;
                                                        set({ difficulty: d, knightShieldCount: DEFAULT_SHIELDS[state.numPlayers][d] });
                                                    }, children: [(0, jsx_runtime_1.jsx)("option", { value: "easy", children: "\u0141atwy" }), (0, jsx_runtime_1.jsx)("option", { value: "normal", children: "Normalny" }), (0, jsx_runtime_1.jsx)("option", { value: "hard", children: "Trudny" }), (0, jsx_runtime_1.jsx)("option", { value: "veryHard", children: "Bardzo trudny" })] })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, sm: true, children: [(0, jsx_runtime_1.jsx)("div", { className: "fw-semibold mb-1", style: { fontSize: '0.9rem' }, children: "Wyb\u00F3r je\u017Ad\u017Aca Dzikiego Gonu" }), (0, jsx_runtime_1.jsx)("div", { className: "d-flex flex-wrap gap-3", children: knights.map(k => {
                                                        const selected = state.selectedKnightName === k.name_pl;
                                                        return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => set({ selectedKnightName: selected ? null : k.name_pl }), style: {
                                                                cursor: 'pointer',
                                                                border: selected ? '3px solid #6c757d' : '3px solid transparent',
                                                                borderRadius: '8px',
                                                                padding: '6px',
                                                                textAlign: 'center',
                                                            }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: knightMiniImages[k.name_pl], height: 80, alt: k.name_pl, style: { display: 'block', margin: '0 auto 4px' } }), (0, jsx_runtime_1.jsx)("small", { className: "fw-semibold", children: k.name_pl })] }, k.name_pl));
                                                    }) })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setPreparationOpen(true), children: "\uD83D\uDCCB Instrukcja przygotowania" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Title, { as: "h5", children: ["Przebieg tur \u2014 ", state.numPlayers, " ", state.numPlayers === 1 ? 'gracz' : 'graczy'] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "g-3 align-items-start", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 12, md: 4, className: "text-center", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: roundsImages[state.numPlayers], style: { maxWidth: '100%', cursor: 'zoom-in' }, alt: `Rundy ${state.numPlayers} graczy`, rounded: true, onClick: () => setEnlargedImage(roundsImages[state.numPlayers]) }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 8, children: [(0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Table, { bordered: true, size: "sm", style: { fontSize: '0.8rem', minWidth: '500px' }, children: [(0, jsx_runtime_1.jsx)("thead", { className: "table-dark", children: (0, jsx_runtime_1.jsx)("tr", { children: TABLE_HEADERS.map((h, i) => ((0, jsx_runtime_1.jsx)("th", { children: h }, i))) }) }), (0, jsx_runtime_1.jsx)("tbody", { children: guideRows.map((row, rowIdx) => ((0, jsx_runtime_1.jsx)("tr", { children: row.map((cell, colIdx) => {
                                                                            var _a, _b;
                                                                            const isSelected = ((_a = state.selectedCell) === null || _a === void 0 ? void 0 : _a[0]) === rowIdx && ((_b = state.selectedCell) === null || _b === void 0 ? void 0 : _b[1]) === colIdx;
                                                                            return ((0, jsx_runtime_1.jsx)("td", { onClick: () => handleCellClick(rowIdx, colIdx), style: {
                                                                                    cursor: 'pointer',
                                                                                    backgroundColor: isSelected ? '#1a5276' : undefined,
                                                                                    color: isSelected ? '#aed6f1' : undefined,
                                                                                    boxShadow: isSelected ? 'inset 3px 0 0 #5dade2' : undefined,
                                                                                    fontWeight: isSelected ? '600' : undefined,
                                                                                    fontStyle: isSelected ? 'italic' : undefined,
                                                                                    userSelect: 'none',
                                                                                }, children: cell }, colIdx));
                                                                        }) }, rowIdx))) })] }) }), state.selectedCell && ((0, jsx_runtime_1.jsxs)("div", { className: "text-muted", style: { fontSize: '0.8rem' }, children: ["Zaznaczona runda: ", (0, jsx_runtime_1.jsx)("strong", { children: (_d = guideRows[state.selectedCell[0]]) === null || _d === void 0 ? void 0 : _d[0] }), ", kolumna: ", (0, jsx_runtime_1.jsx)("strong", { children: TABLE_HEADERS[state.selectedCell[1]] })] }))] })] })] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: "Ruch Dzikiego Gonu" }), (state.savedPlayerNames === null || isEditingPlayers) ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { children: [editPlayerNames.map((name, i) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-2", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Label, { style: { fontSize: '0.85rem' }, children: ["Gracz ", i + 1] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { size: "sm", type: "text", placeholder: `Gracz ${i + 1}`, value: name, onChange: e => setEditPlayerNames(prev => prev.map((n, j) => j === i ? e.target.value : n)), isInvalid: formErrors.some(err => err.includes(String(i + 1))) })] }, i))), formErrors.length > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "danger", className: "mt-1 py-1", style: { fontSize: '0.8rem' }, children: formErrors.map((e, i) => (0, jsx_runtime_1.jsx)("div", { children: e }, i)) })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 d-flex flex-wrap gap-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", size: "sm", onClick: handleSavePlayers, children: "Zapisz graczy" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => setEditPlayerNames(prev => [...prev, '']), children: "+ Dodaj gracza" }), editPlayerNames.length > 1 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => setEditPlayerNames(prev => prev.slice(0, -1)), children: "\u2212 Usu\u0144 ostatniego" })), isEditingPlayers && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => { setIsEditingPlayers(false); setFormErrors([]); }, children: "Anuluj" }))] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-wrap align-items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: handleWildHuntDraw, children: "Losuj ruch" }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted", style: { fontSize: '0.85rem' }, children: state.savedPlayerNames.join(', ') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: handleStartEditPlayers, children: "Edytuj" })] })), wildHuntResult && state.savedPlayerNames !== null && !isEditingPlayers && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "dark", className: "mt-2 fs-5 fw-bold result-pop mb-0", children: wildHuntResult }, wildHuntDrawKey))] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: "Ogary Dzikiego Gonu" }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "g-3 align-items-start", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 fw-semibold", style: { fontSize: '0.85rem' }, children: "Karta ogara" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: houndCardImages[state.numPlayers], style: { maxWidth: '50%', cursor: 'zoom-in' }, alt: `Ogar ${state.numPlayers} graczy`, rounded: true, onClick: () => setEnlargedImage(houndCardImages[state.numPlayers]) })] }), selectedKnight && ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 fw-semibold", style: { fontSize: '0.85rem' }, children: "Karta rycerza" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: knightFrontImages[selectedKnight.name_pl], style: { maxWidth: '50%', cursor: 'zoom-in' }, alt: selectedKnight.name_pl, rounded: true, onClick: () => setEnlargedImage(knightFrontImages[selectedKnight.name_pl]) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 d-flex align-items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: frozenShieldImg, height: 28, alt: "Tarcze oblodzone", style: { display: 'inline' } }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.InputGroup, { style: { maxWidth: '210px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => set({ houndShieldCount: Math.max(0, state.houndShieldCount - 1) }), children: "\u2212" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", min: 0, value: state.houndShieldCount, size: "sm", onChange: e => set({ houndShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) }), className: "text-center" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => set({ houndShieldCount: state.houndShieldCount + 1 }), children: "+" })] }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.8rem' }, className: "text-muted", children: "tarcze ogara" })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mt-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { style: { fontSize: '0.85rem' }, children: "Notatka (np. lokalizacja ogara)" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, value: state.houndNote, onChange: e => set({ houndNote: e.target.value }), placeholder: "Opcjonalny opis...", style: { resize: 'vertical', fontSize: '0.85rem' } })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: () => setHoundRulesOpen(true), children: "Zasady walki z ogarem" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "fw-semibold mb-2", style: { fontSize: '0.9rem' }, children: "Losowanie nagrody" }), (0, jsx_runtime_1.jsx)("div", { className: "d-flex flex-wrap gap-2 mb-2", children: [1, 2, 3].map(level => {
                                                    const drawnCount = state.drawnHoundRewards.filter(r => r.level === level).length;
                                                    const exhausted = drawnCount >= HOUND_REWARDS[level].length;
                                                    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Button, { variant: "outline-secondary", disabled: exhausted, onClick: () => handleDrawHoundReward(level), style: { padding: '4px 8px' }, title: exhausted ? 'Wszystkie nagrody wyczerpane' : `Nagroda ogar poziom ${level}`, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: houndRewardIcons[level], height: 144, alt: `Poziom ${level}` }), exhausted && (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '0.7rem' }, children: "Wyczerpane" })] }, level));
                                                }) }), state.drawnHoundRewards.length > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { variant: "flush", children: state.drawnHoundRewards.map((r, i) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { style: { fontSize: '0.85rem', padding: '4px 0' }, children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-muted me-2", children: ["Poz. ", r.level, ":"] }), r.text] }, i))) }))] })] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: "Walka z je\u017Ad\u017Acem" }), !selectedKnight ? ((0, jsx_runtime_1.jsx)("p", { className: "text-muted", children: "Wybierz je\u017Ad\u017Aca w sekcji powy\u017Cej." })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 d-flex justify-content-center align-items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: knightBackImages[selectedKnight.name_pl], style: { maxWidth: '220px', width: '100%', cursor: 'zoom-in' }, alt: selectedKnight.name_pl + ' back', rounded: true, onClick: () => setEnlargedImage(knightBackImages[selectedKnight.name_pl]) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", style: { flexShrink: 0 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "fw-semibold mb-1", children: ["Liczba tarcz: ", state.knightShieldCount] }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex align-items-center gap-2", children: [state.knightShieldCount > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: frozenShieldImg, style: { width: '256px' }, alt: "Tarcze" })), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-column align-items-center", style: { gap: '4px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", style: { width: '72px', fontSize: '1.2rem' }, onClick: () => set({ knightShieldCount: state.knightShieldCount + 1 }), children: "+" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", value: state.knightShieldCount, className: "text-center", style: { width: '72px', fontSize: '1.1rem' }, onChange: e => set({ knightShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", style: { width: '72px', fontSize: '1.2rem' }, onClick: () => set({ knightShieldCount: Math.max(0, state.knightShieldCount - 1) }), children: "\u2212" })] })] })] })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: "Punkty \u017Cycia" }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.InputGroup, { style: { maxWidth: '160px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => set({ knightHp: Math.max(0, state.knightHp - 1) }), children: "\u2212" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", value: state.knightHp, className: "text-center", onChange: e => set({ knightHp: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => set({ knightHp: state.knightHp + 1 }), children: "+" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", disabled: state.knightHp <= 0, onClick: handleStartKnightFight, children: "Rozpocznij walk\u0119" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setKnightFightRulesOpen(true), children: "Instrukcja walki" })] })] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-danger", onClick: handleReset, children: "Resetuj" }) })] }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: preparationOpen, onHide: () => setPreparationOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Przygotowanie" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: preparationImg, style: { maxWidth: '100%', cursor: 'zoom-in' }, onClick: () => { setPreparationOpen(false); setEnlargedImage(preparationImg); } }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setPreparationOpen(false), children: "Zamknij" }) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: knightFightRulesOpen, onHide: () => setKnightFightRulesOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Instrukcja walki z je\u017Ad\u017Acem" }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Przygotowanie" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Zachowaj karty na r\u0119ce." }), (0, jsx_runtime_1.jsx)("li", { children: "Potasuj tali\u0119 akcji + stos kart odrzuconych." }), (0, jsx_runtime_1.jsx)("li", { children: "Najpierw zbij tarcze je\u017Ad\u017Aca (1 obra\u017Cenie = 1 tarcza), potem trafienia id\u0105 w tali\u0119." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold mt-3", children: "Przebieg walki" }), (0, jsx_runtime_1.jsxs)("ol", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Gracze na tym samym obszarze walcz\u0105 (dowolna kolejno\u015B\u0107)." }), (0, jsx_runtime_1.jsx)("li", { children: "Pozostali gracze do\u0142\u0105czaj\u0105 do walki (bez swojej tury)." }), (0, jsx_runtime_1.jsx)("li", { children: "Tura je\u017Ad\u017Aca." }), (0, jsx_runtime_1.jsx)("li", { children: "Zn\u00F3w tury graczy (kt\u00F3rzy nie zostali powaleni)." }), (0, jsx_runtime_1.jsx)("li", { children: "Powtarzaj kroki 3\u20134 a\u017C do ko\u0144ca walki." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold mt-3", children: "Tura gracza" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Gracze ustalaj\u0105 kolejno\u015B\u0107." }), (0, jsx_runtime_1.jsx)("li", { children: "Ka\u017Cdy rozgrywa pe\u0142n\u0105 tur\u0119 jak w normalnej walce." }), (0, jsx_runtime_1.jsx)("li", { children: "Odrzucenie karty walki je\u017Ad\u017Aca = aktywacja jej ataku pasywnego." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold mt-3", children: "Tura je\u017Ad\u017Aca" }), (0, jsx_runtime_1.jsx)("p", { children: "Odkryj 1 kart\u0119 z jego talii wytrzyma\u0142o\u015Bci:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Karta Dzikiego Gonu" }), " \u2192 wszyscy wykonuj\u0105 efekt z karty."] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Zwyk\u0142a karta" }), " \u2192 ka\u017Cdy z graczy losuje czy gryzie czy szar\u017Cuje i rozpatrz efekt."] })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold mt-3", children: "Powalenie i koniec walki" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Brak kart + pusta talia = wied\u017Amin powalony (wypada z walki)." }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Przegrana:" }), " wszyscy wied\u017Amini powaleni."] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Wygrana:" }), " talia je\u017Ad\u017Aca si\u0119 sko\u0144czy i kto\u015B przetrwa."] })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setKnightFightRulesOpen(false), children: "Zamknij" }) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: houndRulesOpen, onHide: () => setHoundRulesOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Walka z ogarem \u2013 w pigu\u0142ce" }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Body, { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Kiedy:" }), " tylko w fazie I, je\u015Bli gracze s\u0105 na tym samym obszarze co ogar (to nie jest standardowa walka z potworem)."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Ile razy:" }), " ka\u017Cdy gracz mo\u017Ce walczy\u0107 z danym ogarem tylko raz na faz\u0119 I."] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold mt-3", children: "Przygotowanie:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Obni\u017Casz poziom tarczy o warto\u015B\u0107 z karty." }), (0, jsx_runtime_1.jsx)("li", { children: "Dobierasz wskazan\u0105 liczb\u0119 kart (wg poziomu ogara na karcie)." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Atak:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "Ka\u017Cdy gracz zagrywa 1 kombinacj\u0119 kart (min. 1 karta)." }), (0, jsx_runtime_1.jsxs)("li", { children: ["Symbole:", (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "obra\u017Cenia \u2192 zadaj\u0105 dmg ogarowi" }), (0, jsx_runtime_1.jsx)("li", { children: "tarcze \u2192 zwi\u0119kszaj\u0105 tarcz\u0119 (do limitu obrony)" }), (0, jsx_runtime_1.jsx)("li", { children: "inne \u2192 ignorujesz" })] })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Wynik:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Wi\u0119cej obra\u017Ce\u0144 ni\u017C HP ogara:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "nadmiar obra\u017Ce\u0144 zadaje tarcze Je\u017Ad\u017Acowi" }), (0, jsx_runtime_1.jsx)("li", { children: "losowy \u017Ceton nagrody dla wszystkich" }), (0, jsx_runtime_1.jsx)("li", { children: "ogar znika z planszy" })] })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "R\u00F3wno z HP:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "nagroda dla wszystkich" }), (0, jsx_runtime_1.jsx)("li", { children: "ogar znika" })] })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Mniej ni\u017C HP:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "odrzucasz r\u0119k\u0119" }), (0, jsx_runtime_1.jsx)("li", { children: "ogar zostaje na planszy" })] })] })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setHoundRulesOpen(false), children: "Zamknij" }) })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedImage !== null, onHide: () => setEnlargedImage(null), centered: true, size: "lg", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: enlargedImage && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: enlargedImage, style: { maxWidth: '100%', maxHeight: '90vh' }, onClick: () => setEnlargedImage(null) })) }) })] }));
}
exports.default = Opponents;
