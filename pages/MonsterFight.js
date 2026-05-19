"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
require("../css/Opponents.css");
const monsters_json_1 = __importDefault(require("../monsters.json"));
const generic_1 = require("../util/generic");
const STORAGE_KEY = 'monsterFight_state';
const DEFAULT_STATE = {
    selectedMonsterName: null,
    monsterTrail: true,
    wildHunt: false,
    currentHp: null,
    hasWeaknessTokens: true,
    selectedTokens: [],
    fightStarted: false,
    fightDeck: [],
    fightHp: 0,
    revealedCards: [],
    leshyDiceCount: 0,
    note: '',
};
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? Object.assign(Object.assign({}, DEFAULT_STATE), JSON.parse(raw)) : DEFAULT_STATE;
    }
    catch (_a) {
        return DEFAULT_STATE;
    }
}
function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
const monsters = monsters_json_1.default;
const byLevel = (level) => monsters
    .filter(m => m.level === level)
    .sort((a, b) => a.name_pl.localeCompare(b.name_pl, 'pl'));
const SELECTABLE_TOKENS = [
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Forest_${i + 1}`),
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Mountain_${i + 1}`),
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Water_${i + 1}`),
];
// Card key prefixes
const MAIN_CARDS = Array.from({ length: 20 }, (_, i) => `monster_trial_${String(i + 1).padStart(2, '0')}.jpg`);
const TRAIL_CARDS = Array.from({ length: 4 }, (_, i) => `monster_trial_${i + 1}.jpg`);
// Pre-load all images at module level
const monsterCardImages = Object.fromEntries(monsters.map(m => [
    m.name_pl + ':front', require(`../img/monsters_full_cards/${m.front_name}.jpg`),
]).concat(monsters.map(m => [
    m.name_pl + ':back', require(`../img/monsters_full_cards/${m.back_name}.jpg`),
])));
const mainCardImages = Object.fromEntries(MAIN_CARDS.map(f => [f, require(`../img/monster_fight/${f}`)]));
const trailCardImages = Object.fromEntries(TRAIL_CARDS.map(f => [f, require(`../img/monster_fight/monster_trial/${f}`)]));
const tokenImages = Object.fromEntries(SELECTABLE_TOKENS.map(token => [token, require(`../img/tokens/weaknessTokens/${token}.jpg`)]));
const monsterTrailImg = require('../img/expansionHeaders/monsterTrail.png');
const wildHuntExpImg = require('../img/expansionHeaders/wildHunt.png');
const deckBackImg = require('../img/monster_fight/back.jpg');
function getCardImage(key) {
    if (key.startsWith('main:'))
        return mainCardImages[key.slice(5)];
    return trailCardImages[key.slice(6)]; // "trail:filename"
}
function buildDeck(level, monsterTrail, hp) {
    const mainKeys = MAIN_CARDS.map(f => `main:${f}`);
    if (!monsterTrail) {
        return (0, generic_1.shuffle)([...mainKeys]).slice(0, hp);
    }
    const trailKeys = TRAIL_CARDS.map(f => `trail:${f}`);
    const n = Math.max(level <= 2 ? 12 : 16, hp - TRAIL_CARDS.length);
    const selectedMain = (0, generic_1.shuffle)([...mainKeys]).slice(0, n);
    const pool = (0, generic_1.shuffle)([...trailKeys, ...selectedMain]);
    return pool.slice(0, hp);
}
function MonsterFight({ t }) {
    var _a, _b, _c;
    const [state, setState] = (0, react_1.useState)(loadState);
    const [enlargedImage, setEnlargedImage] = (0, react_1.useState)(null);
    const [monsterAttackResult, setMonsterAttackResult] = (0, react_1.useState)(null);
    const [monsterAttackKey, setMonsterAttackKey] = (0, react_1.useState)(0);
    const [musicPlaying, setMusicPlaying] = (0, react_1.useState)(false);
    const [resultModalOpen, setResultModalOpen] = (0, react_1.useState)(false);
    const [wildHuntEndLevel, setWildHuntEndLevel] = (0, react_1.useState)(null);
    const [trollModalOpen, setTrollModalOpen] = (0, react_1.useState)(false);
    const [trollSelectedCard, setTrollSelectedCard] = (0, react_1.useState)(null);
    const [peekOpen, setPeekOpen] = (0, react_1.useState)(false);
    const [peekCount, setPeekCount] = (0, react_1.useState)(1);
    const [peekPhase, setPeekPhase] = (0, react_1.useState)('input');
    const [peekCards, setPeekCards] = (0, react_1.useState)([]);
    const [peekOriginalCount, setPeekOriginalCount] = (0, react_1.useState)(0);
    const audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const audio = new Audio(require('../music/combat_music.mp3'));
        audio.loop = true;
        audioRef.current = audio;
        return () => { audio.pause(); };
    }, []);
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
    const selectedMonster = (_a = monsters.find(m => m.name_pl === state.selectedMonsterName)) !== null && _a !== void 0 ? _a : null;
    (0, react_1.useEffect)(() => {
        saveState(state);
    }, [state]);
    // ── Setup handlers ──────────────────────────────────────────────────────
    function handleLevelSelect(level, name) {
        if (!name) {
            if ((selectedMonster === null || selectedMonster === void 0 ? void 0 : selectedMonster.level) === level) {
                setState(s => (Object.assign(Object.assign({}, s), { selectedMonsterName: null, currentHp: null })));
            }
            return;
        }
        const monster = monsters.find(m => m.name_pl === name);
        setState(s => {
            var _a;
            return (Object.assign(Object.assign({}, s), { selectedMonsterName: name, currentHp: (_a = monster === null || monster === void 0 ? void 0 : monster.base_heal) !== null && _a !== void 0 ? _a : null }));
        });
    }
    function handleHpChange(delta) {
        setState(s => {
            var _a;
            return (Object.assign(Object.assign({}, s), { currentHp: Math.max(0, ((_a = s.currentHp) !== null && _a !== void 0 ? _a : 0) + delta) }));
        });
    }
    function handleTokenToggle(token) {
        setState(s => {
            const already = s.selectedTokens.includes(token);
            if (!already && s.selectedTokens.length >= 6)
                return s;
            return Object.assign(Object.assign({}, s), { selectedTokens: already
                    ? s.selectedTokens.filter(tk => tk !== token)
                    : [...s.selectedTokens, token] });
        });
    }
    function handleStartFight() {
        if (!selectedMonster || state.currentHp === null || state.currentHp <= 0)
            return;
        const deck = buildDeck(selectedMonster.level, state.monsterTrail, state.currentHp);
        setState(s => {
            var _a;
            return (Object.assign(Object.assign({}, s), { fightStarted: true, fightDeck: deck, fightHp: (_a = s.currentHp) !== null && _a !== void 0 ? _a : 0, revealedCards: [] }));
        });
    }
    function handleReset() {
        setState(prev => (Object.assign(Object.assign({}, DEFAULT_STATE), { note: prev.note, wildHunt: prev.wildHunt })));
    }
    // ── Fight handlers ───────────────────────────────────────────────────────
    function handleDrawCard() {
        if (state.fightDeck.length === 0)
            return;
        const [drawn, ...remaining] = state.fightDeck;
        setState(s => (Object.assign(Object.assign({}, s), { fightDeck: remaining, fightHp: Math.max(0, s.fightHp - 1), revealedCards: [...s.revealedCards, drawn] })));
    }
    function handleAddCard() {
        const allMain = MAIN_CARDS.map(f => `main:${f}`);
        const used = new Set([...state.fightDeck, ...state.revealedCards]);
        const available = allMain.filter(k => !used.has(k));
        if (available.length === 0)
            return;
        const picked = (0, generic_1.shuffle)([...available])[0];
        setState(s => (Object.assign(Object.assign({}, s), { fightDeck: [...s.fightDeck, picked] })));
    }
    function handleOpenPeek() {
        setPeekPhase('input');
        setPeekCount(Math.min(3, state.fightDeck.length));
        setPeekOpen(true);
    }
    function handleConfirmPeek() {
        const count = Math.max(1, Math.min(peekCount, state.fightDeck.length));
        setPeekOriginalCount(count);
        setPeekCards(state.fightDeck.slice(0, count));
        setPeekPhase('arrange');
    }
    function handlePeekRemove(idx) {
        setPeekCards(cards => cards.filter((_, i) => i !== idx));
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
    function handlePeekSave() {
        const removed = peekOriginalCount - peekCards.length;
        setState(s => (Object.assign(Object.assign({}, s), { fightDeck: [...peekCards, ...s.fightDeck.slice(peekOriginalCount)], fightHp: Math.max(0, s.fightHp - removed) })));
        setPeekOpen(false);
    }
    function handleMonsterAttack() {
        const options = [t('opponents.monsterBite'), t('opponents.monsterCharge')];
        setMonsterAttackResult((0, generic_1.shuffle)([...options])[0]);
        setMonsterAttackKey(k => k + 1);
    }
    function handleLeshyDiceChange(delta) {
        setState(s => (Object.assign(Object.assign({}, s), { leshyDiceCount: Math.max(0, s.leshyDiceCount + delta) })));
    }
    function handleLeshyDiceInput(value) {
        setState(s => (Object.assign(Object.assign({}, s), { leshyDiceCount: Math.max(0, isNaN(value) ? 0 : value) })));
    }
    function handleTrollAbilityConfirm() {
        if (!trollSelectedCard)
            return;
        setState(s => (Object.assign(Object.assign({}, s), { fightDeck: [trollSelectedCard, ...s.fightDeck], fightHp: s.fightHp + 1, revealedCards: s.revealedCards.filter(c => c !== trollSelectedCard) })));
        setTrollSelectedCard(null);
        setTrollModalOpen(false);
    }
    function handleEndFight() {
        var _a;
        (_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.pause();
        setMusicPlaying(false);
        if (state.wildHunt && selectedMonster) {
            setWildHuntEndLevel(selectedMonster.level);
        }
        setState(prev => (Object.assign(Object.assign({}, DEFAULT_STATE), { note: prev.note, wildHunt: prev.wildHunt })));
        localStorage.removeItem(STORAGE_KEY);
    }
    // ── Fight view ───────────────────────────────────────────────────────────
    if (state.fightStarted && selectedMonster) {
        const lastCard = (_b = state.revealedCards[state.revealedCards.length - 1]) !== null && _b !== void 0 ? _b : null;
        const deckEmpty = state.fightDeck.length === 0;
        return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "MonsterFight", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('monsterFight.title') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 10, lg: 8, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "justify-content-center mb-3 g-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: monsterCardImages[selectedMonster.name_pl + ':front'], style: { maxWidth: '375px', width: '100%', cursor: 'zoom-in' }, alt: selectedMonster.name_pl, rounded: true, onClick: () => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':front']) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: monsterCardImages[selectedMonster.name_pl + ':back'], style: { maxWidth: '375px', width: '100%', cursor: 'zoom-in' }, alt: selectedMonster.name_pl + ' back', rounded: true, onClick: () => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':back']) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-3 text-center d-flex align-items-center justify-content-center gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "fs-4 fw-bold", children: [t('monsterFight.fightHpLabel'), ": ", state.fightHp] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-danger", size: "sm", onClick: handleMonsterAttack, children: t('opponents.monsterAttackTitle') })] }), monsterAttackResult && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "dark", className: "text-center fs-5 fw-bold result-pop mb-3", children: monsterAttackResult }, monsterAttackKey)), selectedMonster.name_pl === 'Leszy' && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 d-flex align-items-center justify-content-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "fw-semibold", children: "Liczba ko\u015Bci:" }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.InputGroup, { style: { width: '140px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => handleLeshyDiceChange(-1), children: "\u2212" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", min: 0, value: state.leshyDiceCount, onChange: e => handleLeshyDiceInput(Number(e.target.value)), className: "text-center" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => handleLeshyDiceChange(1), children: "+" })] })] })), state.selectedTokens.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 fw-semibold", children: t('monsterFight.weaknessTokensLabel') }), (0, jsx_runtime_1.jsx)("div", { className: "d-flex flex-wrap justify-content-center gap-2", children: state.selectedTokens.map(token => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: tokenImages[token], width: 60, height: 60, alt: token, style: { borderRadius: '6px', objectFit: 'cover' } }, token))) })] })), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "justify-content-center mb-4 g-3 align-items-start", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-1 fw-semibold d-flex align-items-center justify-content-center gap-2", children: [t('monsterFight.deckLabel'), " (", state.fightDeck.length, ")", (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", onClick: handleAddCard, children: t('monsterFight.addCardBtn') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", size: "sm", disabled: state.fightDeck.length === 0, onClick: handleOpenPeek, children: t('monsterFight.peekDeckBtn') })] }), deckEmpty ? ((0, jsx_runtime_1.jsx)("div", { className: "text-muted fst-italic py-4", children: t('monsterFight.deckEmptyLabel') })) : ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: deckBackImg, style: { maxWidth: '200px', width: '100%', cursor: 'pointer' }, alt: "deck", rounded: true, onClick: handleDrawCard }))] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 fw-semibold", children: t('monsterFight.currentCardLabel') }), lastCard ? ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: getCardImage(lastCard), style: { maxWidth: '200px', width: '100%', cursor: 'zoom-in' }, alt: "revealed card", rounded: true, onClick: () => setEnlargedImage(getCardImage(lastCard)) })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-muted fst-italic py-4", children: "\u2014" }))] })] }), state.wildHunt && ((0, jsx_runtime_1.jsx)("div", { className: "text-center mb-3 px-2 py-2 border border-secondary rounded", style: { background: 'rgba(108,117,125,0.1)' }, children: (0, jsx_runtime_1.jsx)("span", { className: "fw-semibold", children: "Je\u015Bli potw\u00F3r zostaje pokonany albo odp\u0119dzony, je\u017Adziec Dzikiego Gonu traci tyle tarcz, ile wynosi poziom tego potwora." }) })), (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-4 d-flex justify-content-center gap-2 flex-wrap", children: [selectedMonster.name_pl === 'Troll' && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-warning", disabled: state.revealedCards.length === 0, onClick: () => { setTrollSelectedCard(null); setTrollModalOpen(true); }, children: "Zdolno\u015B\u0107 specjalna" })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", disabled: state.revealedCards.length === 0, onClick: () => {
                                            const last = state.revealedCards[state.revealedCards.length - 1];
                                            setState(s => (Object.assign(Object.assign({}, s), { fightDeck: [last, ...s.fightDeck], fightHp: s.fightHp + 1, revealedCards: s.revealedCards.slice(0, -1) })));
                                        }, children: "\u21A9 Cofnij" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: handleEndFight, children: t('monsterFight.endFightBtn') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "danger", onClick: () => setResultModalOpen(true), children: "Wynik walki" })] })] }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: resultModalOpen, onHide: () => setResultModalOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Wynik walki" }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "Po ka\u017Cdej walce, bez wzgl\u0119du na wynik:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "tasuje si\u0119 karty walki potwora i tworzy now\u0105 tali\u0119," }), (0, jsx_runtime_1.jsx)("li", { children: "tasuje si\u0119 tali\u0119 wytrzyma\u0142o\u015Bci, r\u0119k\u0119 i stos kart odrzuconych, tworz\u0105c now\u0105 tali\u0119 akcji," }), (0, jsx_runtime_1.jsx)("li", { children: "wied\u017Amin wraca do normalnego poziomu tarczy obrony." })] }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "1. Pokonanie potwora" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "bierze kart\u0119 potwora i 2 z\u0142ota," }), (0, jsx_runtime_1.jsx)("li", { children: "zyskuje +1 reputacji i doznaje zm\u0119czenia," }), (0, jsx_runtime_1.jsx)("li", { children: "wk\u0142ada kart\u0119 potwora pod swoj\u0105 planszetk\u0119 jako trofeum," }), (0, jsx_runtime_1.jsx)("li", { children: "po walce odk\u0142ada stary \u017Ceton potwora, a na planszy pojawia si\u0119 nowy \u017Ceton poziomu +1," }), (0, jsx_runtime_1.jsx)("li", { children: "odrzu\u0107 \u017Ceton tropu oraz zadania tropienia tego potwora." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "2. Odp\u0119dzenie potwora" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted fst-italic", style: { fontSize: '0.9em' }, children: "Je\u015Bli wied\u017Amin zostanie powalony, a w talii wytrzyma\u0142o\u015Bci potwora zosta\u0142o mniej ni\u017C 2 kart:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "bierze 2 z\u0142ota," }), (0, jsx_runtime_1.jsx)("li", { children: "usuwa potwora z gry," }), (0, jsx_runtime_1.jsx)("li", { children: "bierze 1 kart\u0119 akcji o koszcie 0 na sw\u00F3j stos kart odrzuconych," }), (0, jsx_runtime_1.jsx)("li", { children: "na planszy pojawia si\u0119 nowy potw\u00F3r tego samego poziomu." })] }), (0, jsx_runtime_1.jsx)("p", { className: "fw-bold", children: "3. Kl\u0119ska wied\u017Amina" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted fst-italic", style: { fontSize: '0.9em' }, children: "Je\u015Bli wied\u017Amin zostanie powalony, a potw\u00F3r ma jeszcze 2 lub wi\u0119cej kart wytrzyma\u0142o\u015Bci:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: "bierze 1 \u017Ceton tropu z terenu, na kt\u00F3rym stoi potw\u00F3r," }), (0, jsx_runtime_1.jsx)("li", { children: "bierze 1 kart\u0119 akcji o koszcie 0 na stos kart odrzuconych," }), (0, jsx_runtime_1.jsx)("li", { children: "w tej turze dobiera o 1 kart\u0119 mniej w fazie III." })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setResultModalOpen(false), children: "Zamknij" }) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: peekOpen, onHide: () => setPeekOpen(false), centered: true, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: t('monsterFight.peekDeckTitle') }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { children: peekPhase === 'input' ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { onSubmit: e => { e.preventDefault(); handleConfirmPeek(); }, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t('monsterFight.peekCountLabel') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", min: 1, max: state.fightDeck.length, value: peekCount, onChange: e => setPeekCount(Math.max(1, Math.min(Number(e.target.value), state.fightDeck.length))), autoFocus: true })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", type: "submit", className: "w-100", children: t('monsterFight.peekConfirmBtn') })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { style: { maxHeight: '60vh', overflowY: 'auto' }, children: peekCards.map((card, idx) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { className: "d-flex align-items-center gap-2 py-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-muted fw-bold", style: { minWidth: '1.5rem' }, children: [idx + 1, "."] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: getCardImage(card), height: 210, style: { objectFit: 'contain', cursor: 'zoom-in' }, rounded: true, onClick: () => setEnlargedImage(getCardImage(card)) }), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-1", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-secondary", disabled: idx === 0, onClick: () => handlePeekMove(idx, -1), children: "\u2191" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-secondary", disabled: idx === peekCards.length - 1, onClick: () => handlePeekMove(idx, 1), children: "\u2193" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "sm", variant: "outline-danger", onClick: () => handlePeekRemove(idx), children: "\u2715" })] })] }, card))) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", className: "w-100 mt-3", onClick: handlePeekSave, children: t('monsterFight.peekReturnBtn') })] })) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: trollModalOpen, onHide: () => setTrollModalOpen(false), centered: true, size: "lg", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Zdolno\u015B\u0107 specjalna Trolla" }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Body, { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-muted mb-3", children: "Wybierz 1 kart\u0119 z odrzuconych \u2014 zostanie umieszczona na wierzchu talii potwora." }), state.revealedCards.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-muted fst-italic", children: "Brak odrzuconych kart." })) : ((0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { style: { maxHeight: '60vh', overflowY: 'auto' }, children: state.revealedCards.map((card, idx) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { action: true, active: trollSelectedCard === card, onClick: () => setTrollSelectedCard(card), className: "d-flex align-items-center gap-3 py-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: getCardImage(card), height: 70, style: { objectFit: 'contain', cursor: 'zoom-in' }, rounded: true, onClick: e => { e.stopPropagation(); setEnlargedImage(getCardImage(card)); } }), (0, jsx_runtime_1.jsxs)("span", { className: "text-muted", style: { fontSize: '0.85em' }, children: ["Karta ", idx + 1] })] }, card + idx))) }))] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setTrollModalOpen(false), children: "Anuluj" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", disabled: !trollSelectedCard, onClick: handleTrollAbilityConfirm, children: "Po\u0142\u00F3\u017C na wierzchu talii" })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedImage !== null, onHide: () => setEnlargedImage(null), centered: true, size: "lg", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: enlargedImage && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: enlargedImage, style: { maxWidth: '100%', maxHeight: '90vh' }, onClick: () => setEnlargedImage(null) })) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: musicPlaying ? 'warning' : 'outline-secondary', onClick: handleMusicToggle, style: {
                        position: 'fixed',
                        bottom: '1.2rem',
                        right: '1.2rem',
                        zIndex: 1050,
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        fontSize: '1.3rem',
                        lineHeight: 1,
                        padding: 0,
                    }, title: musicPlaying ? 'Pauza' : 'Odtwórz muzykę', children: "\uD83C\uDFB5" })] }));
    }
    // ── Setup view ───────────────────────────────────────────────────────────
    // Wild Hunt end-fight reminder — rendered here so it survives the fight→setup transition
    const wildHuntEndModal = ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: wildHuntEndLevel !== null, onHide: () => setWildHuntEndLevel(null), centered: true, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: "Dodatek Dziki Gon" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { children: (0, jsx_runtime_1.jsxs)("p", { className: "mb-0", children: ["Je\u017Celi potw\u00F3r zosta\u0142 pokonany, odejmij ", (0, jsx_runtime_1.jsx)("strong", { children: wildHuntEndLevel }), " tarcz Rycerzowi Dzikiego Gonu."] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setWildHuntEndLevel(null), children: "OK" }) })] }));
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "MonsterFight", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('monsterFight.title') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 8, lg: 6, children: [[1, 2, 3].map(level => {
                            var _a;
                            return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t(`monsterFight.level${level}Label`) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Select, { value: (selectedMonster === null || selectedMonster === void 0 ? void 0 : selectedMonster.level) === level ? ((_a = state.selectedMonsterName) !== null && _a !== void 0 ? _a : '') : '', onChange: e => handleLevelSelect(level, e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: t('monsterFight.selectPlaceholder') }), byLevel(level).map(m => ((0, jsx_runtime_1.jsx)("option", { value: m.name_pl, children: m.name_pl }, m.name_pl)))] })] }, level));
                        }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Group, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { id: "monsterTrailCheck", checked: state.monsterTrail, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { monsterTrail: e.target.checked }))), label: (0, jsx_runtime_1.jsxs)("span", { className: "d-inline-flex align-items-center gap-2", children: [t('monsterFight.monsterTrailLabel'), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: monsterTrailImg, width: 120 })] }) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Group, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { id: "wildHuntCheck", checked: state.wildHunt, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { wildHunt: e.target.checked }))), label: (0, jsx_runtime_1.jsxs)("span", { className: "d-inline-flex align-items-center gap-2", children: ["Dodatek", (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: wildHuntExpImg, width: 120 })] }) }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t('monsterFight.noteLabel') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, value: state.note, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { note: e.target.value }))) })] }), selectedMonster && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "justify-content-center mb-3 g-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: monsterCardImages[selectedMonster.name_pl + ':front'], fluid: true, style: { maxWidth: '300px', cursor: 'zoom-in' }, alt: selectedMonster.name_pl, rounded: true, onClick: () => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':front']) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 6, className: "text-center", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: monsterCardImages[selectedMonster.name_pl + ':back'], fluid: true, style: { maxWidth: '300px', cursor: 'zoom-in' }, alt: selectedMonster.name_pl + ' back', rounded: true, onClick: () => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':back']) }) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t('monsterFight.hpLabel') }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.InputGroup, { style: { maxWidth: '160px' }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => handleHpChange(-1), children: "\u2212" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", readOnly: true, value: (_c = state.currentHp) !== null && _c !== void 0 ? _c : 0, className: "text-center" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => handleHpChange(1), children: "+" })] })] })] })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Group, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { id: "weaknessCheck", checked: state.hasWeaknessTokens, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { hasWeaknessTokens: e.target.checked }))), label: t('monsterFight.weaknessTokensCheckbox') }) }), state.hasWeaknessTokens && ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t('monsterFight.weaknessTokensTitle') }), (0, jsx_runtime_1.jsx)("div", { className: "d-flex flex-column gap-2", children: ['Forest', 'Mountain', 'Water'].map(terrain => ((0, jsx_runtime_1.jsx)("div", { className: "d-flex gap-2", children: Array.from({ length: 6 }, (_, i) => `Weakness_${terrain}_${i + 1}`).map(token => {
                                            const selected = state.selectedTokens.includes(token);
                                            const disabled = !selected && state.selectedTokens.length >= 6;
                                            return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: tokenImages[token], width: 80, height: 80, alt: token, style: {
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                    border: selected ? '3px solid #198754' : '3px solid transparent',
                                                    borderRadius: '8px',
                                                    opacity: disabled ? 0.4 : 1,
                                                    objectFit: 'cover',
                                                }, onClick: () => !disabled && handleTokenToggle(token) }, token));
                                        }) }, terrain))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-2 mt-4 mb-4", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", disabled: !selectedMonster || !state.currentHp, onClick: handleStartFight, children: t('monsterFight.startFightBtn') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: handleReset, children: t('monsterFight.resetBtn') })] })] }) }), wildHuntEndModal, (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedImage !== null, onHide: () => setEnlargedImage(null), centered: true, size: "lg", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: enlargedImage && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: enlargedImage, style: { maxWidth: '100%', maxHeight: '90vh' }, onClick: () => setEnlargedImage(null) })) }) })] }));
}
exports.default = MonsterFight;
