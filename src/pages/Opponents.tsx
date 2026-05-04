import { useState, useEffect, useRef } from 'react';
import {
    Alert, Button, Card, Col, Container, Form, Image,
    InputGroup, ListGroup, Modal, Row, Table
} from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
import { shuffle } from '../util/generic';
import '../css/Opponents.css';
import wildHuntData from '../wild_hunt_monster.json';

// ── Types ──────────────────────────────────────────────────────────────────

interface WildHuntKnight {
    name_pl: string;
    level: number;
    base_heal: number;
    front_name: string;
    back_name: string;
    abilities: string[];
}

interface DrawnReward {
    level: number;
    index: number;
    text: string;
}

type Difficulty = 'easy' | 'normal' | 'hard' | 'veryHard';

interface AppState {
    numPlayers: number;
    difficulty: Difficulty;
    selectedKnightName: string | null;
    selectedCell: [number, number] | null;
    savedPlayerNames: string[] | null;
    houndShieldCount: number;
    houndNote: string;
    drawnHoundRewards: DrawnReward[];
    knightHp: number;
    knightShieldCount: number;
    knightFightStarted: boolean;
    knightFightDeck: string[];
    knightFightHp: number;
    knightRevealedCards: string[];
}

// ── Shield defaults by [numPlayers][difficulty] ────────────────────────────

const DEFAULT_SHIELDS: Record<number, Record<Difficulty, number>> = {
    1: { easy: 5,  normal: 7,   hard: 9,   veryHard: 11  },
    2: { easy: 28, normal: 31,  hard: 34,  veryHard: 37  },
    3: { easy: 54, normal: 58,  hard: 62,  veryHard: 66  },
    4: { easy: 77, normal: 82,  hard: 87,  veryHard: 92  },
    5: { easy: 97, normal: 106, hard: 113, veryHard: 120 },
};

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'wildHunt_opponents_state';
const knights = wildHuntData as WildHuntKnight[];

const HOUND_REWARDS: Record<number, string[]> = {
    1: [
        'Weź dowolny żeton tropu.',
        'Weź na rękę 1 kartę z wierzchu swojej talii.',
    ],
    2: [
        'Weź z puli odkrytych kart akcji dowolną kartę o koszcie 1 i odłóż ją na swój stos kart odrzuconych.',
        'Weź z puli odkrytych kart akcji dowolną kartę o koszcie 0 i odłóż ją na swój stos kart odrzuconych.',
    ],
    3: [
        'Podnieś swój poziom dowolnego atrybutu o 1.',
        'Podnieś swój poziom najsłabszego atrybutu o 1.',
    ],
};

type GuideRow = [string, string, string, string, string, string];

const GUIDE_TABLES: Record<number, GuideRow[]> = {
    1: [
        ['1', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I',                              'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór poziomu I',                    'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II',                             'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór II',                           'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III',                            'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Potwór III',                          'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'X',                                   'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji',    'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem',      ''],
    ],
    2: [
        ['1', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I',                              'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór I',                            'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I + potwór II',                  'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II',                             'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Potwór III',                          'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III + potwór III',               'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'X',                                   'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji',    'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem',      ''],
    ],
    3: [
        ['1', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I',                              'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór I',                            'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I + potwór II',                  'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór II',                           'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar II + potwór III',                'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III + potwór III',               'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'X',                                   'Porusz jeźdźcem DG'],
        ['8', 'Ruch + akcja', 'Brak eksploracji',    'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem',      ''],
    ],
    4: [
        ['1', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I',                              'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II + potwór II',                 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór II + potwór I',                'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II + potwór III',                'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III + potwór III',               'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III',                            'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem',      ''],
    ],
    5: [
        ['1', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar I + potwór I',                   'Porusz jeźdźcem DG'],
        ['2', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II + potwór II',                 'Porusz jeźdźcem DG'],
        ['3', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Potwór II + potwór II',               'Porusz jeźdźcem DG'],
        ['4', 'Ruch + akcja', 'Eksploracja I',       'Dobierz + kup kartę', 'Ogar II + potwór III',                'Porusz jeźdźcem DG'],
        ['5', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III + potwór III',               'Porusz jeźdźcem DG'],
        ['6', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Ogar III',                            'Porusz jeźdźcem DG'],
        ['7', 'Ruch + akcja', 'Eksploracja II',      'Dobierz + kup kartę', 'Przygotowanie walki z jeźdźcem',      ''],
    ],
};

const TABLE_HEADERS = ['Runda', 'Ruch i akcje', 'Walka / eksploracja', 'Dobieranie i kupowanie', 'Pojawienie ogara / potwora', 'Ruch jeźdźca DG'];

const MAIN_CARDS = Array.from({ length: 20 }, (_, i) =>
    `monster_trial_${String(i + 1).padStart(2, '0')}.jpg`
);

const WILD_HUNT_TRACKS = [
    { title: 'Eredin, King Of The Hunt', src: require('../music/wild_hunt/Eredin, King Of The Hunt.mp3') as string },
    { title: 'Hail To Caranthir',        src: require('../music/wild_hunt/Hail To Caranthir.mp3') as string },
    { title: 'On Thin Ice',              src: require('../music/wild_hunt/On Thin Ice.mp3') as string },
    { title: 'The Hunt Is Coming',       src: require('../music/wild_hunt/The Hunt Is Coming.mp3') as string },
    { title: 'Welcome, Imlerith',        src: require('../music/wild_hunt/Welcome, Imlerith.mp3') as string },
];

// ── Default state ──────────────────────────────────────────────────────────

const DEFAULT_STATE: AppState = {
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

function readWitcherPickerState(): { numPlayers?: number; playerNames?: string[] } {
    try { return JSON.parse(localStorage.getItem('witcherPicker_state') ?? '{}') ?? {}; }
    catch { return {}; }
}

function loadState(): AppState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) as Partial<AppState> };
    } catch {}
    const wp = readWitcherPickerState();
    const names = (wp.playerNames ?? []).filter(n => n?.trim());
    return {
        ...DEFAULT_STATE,
        numPlayers: typeof wp.numPlayers === 'number' ? wp.numPlayers : DEFAULT_STATE.numPlayers,
        savedPlayerNames: names.length > 0 ? names : null,
    };
}

function saveState(s: AppState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ── Image preloads ─────────────────────────────────────────────────────────

const knightMiniImages: Record<string, string> = Object.fromEntries(
    knights.map(k => [k.name_pl, require(`../img/monsters/wildHunt/${k.name_pl.toLowerCase()}Mini.png`)])
);
const knightFrontImages: Record<string, string> = Object.fromEntries(
    knights.map(k => [k.name_pl, require(`../img/wild_hunt/${k.front_name}.jpg`)])
);
const knightBackImages: Record<string, string> = Object.fromEntries(
    knights.map(k => [k.name_pl, require(`../img/wild_hunt/${k.back_name}.jpg`)])
);
const abilityImages: Record<string, string> = Object.fromEntries(
    knights.flatMap(k => k.abilities.map(a => [a, require(`../img/wild_hunt/${a}.jpg`)]))
);
const houndCardImages: Record<number, string> = Object.fromEntries(
    [1, 2, 3, 4, 5].map(n => [n, require(`../img/wild_hunt/hound_card_player_${n}.jpg`)])
);
const roundsImages: Record<number, string> = Object.fromEntries(
    [1, 2, 3, 4, 5].map(n => [n, require(`../img/wild_hunt/rounds_player_${n}.jpg`)])
);
const houndRewardIcons: Record<number, string> = {
    1: require('../img/wild_hunt/hound1.png'),
    2: require('../img/wild_hunt/hound2.png'),
    3: require('../img/wild_hunt/hound3.png'),
};
const preparationImg: string = require('../img/wild_hunt/preparation.jpg');
const frozenShieldImg: string = require('../img/wild_hunt/frozen_shield.png');
const deckBackImg: string = require('../img/monster_fight/back.jpg');
const mainCardImages: Record<string, string> = Object.fromEntries(
    MAIN_CARDS.map(f => [f, require(`../img/monster_fight/${f}`)])
);

// ── Helpers ────────────────────────────────────────────────────────────────

function buildKnightDeck(knight: WildHuntKnight): string[] {
    const abilityKeys = knight.abilities.map(a => `ability:${a}`);
    const mainKeys = MAIN_CARDS.map(f => `main:${f}`);
    const selected16 = shuffle([...mainKeys]).slice(0, 16);
    return shuffle([...abilityKeys, ...selected16]);
}

function getCardImage(key: string): string {
    if (key.startsWith('ability:')) return abilityImages[key.slice(8)];
    return mainCardImages[key.slice(5)];
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Opponents({ t }): JSX.Element {
    const [state, setState] = useState<AppState>(loadState);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

    // Player form state
    const [isEditingPlayers, setIsEditingPlayers] = useState(false);
    const [editPlayerNames, setEditPlayerNames] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<string[]>([]);

    // Wild Hunt movement
    const [wildHuntResult, setWildHuntResult] = useState<string | null>(null);
    const [wildHuntDrawKey, setWildHuntDrawKey] = useState(0);

    // Knight fight UI
    const [knightAttackResult, setKnightAttackResult] = useState<string | null>(null);
    const [knightAttackKey, setKnightAttackKey] = useState(0);

    // Music
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Modals
    const [preparationOpen, setPreparationOpen] = useState(false);
    const [houndRulesOpen, setHoundRulesOpen] = useState(false);
    const [knightFightRulesOpen, setKnightFightRulesOpen] = useState(false);
    const [knightHelpOpen, setKnightHelpOpen] = useState(false);
    const [peekOpen, setPeekOpen] = useState(false);
    const [peekPhase, setPeekPhase] = useState<'input' | 'arrange'>('input');
    const [peekCount, setPeekCount] = useState(1);
    const [peekCards, setPeekCards] = useState<string[]>([]);
    const [peekOriginalCount, setPeekOriginalCount] = useState(0);

    useEffect(() => { saveState(state); }, [state]);

    useEffect(() => {
        if (!state.knightFightStarted) {
            if (audioRef.current) { audioRef.current.pause(); }
            setMusicPlaying(false);
            setCurrentTrackTitle(null);
            return;
        }
        let cancelled = false;

        function playNext(exclude?: string, autoplay = false) {
            if (cancelled) return;
            const pool = WILD_HUNT_TRACKS.filter(t => t.title !== exclude || WILD_HUNT_TRACKS.length === 1);
            const track = shuffle([...pool])[0];
            const audio = new Audio(track.src);
            audioRef.current = audio;
            setCurrentTrackTitle(track.title);
            audio.onended = () => playNext(track.title, true);
            if (autoplay) void audio.play().catch(() => {});
        }

        playNext();
        return () => { cancelled = true; if (audioRef.current) { audioRef.current.onended = null; audioRef.current.pause(); } };
    }, [state.knightFightStarted]);

    function handleMusicToggle() {
        if (!audioRef.current) return;
        if (musicPlaying) {
            audioRef.current.pause();
        } else {
            void audioRef.current.play();
        }
        setMusicPlaying(m => !m);
    }

    const selectedKnight = knights.find(k => k.name_pl === state.selectedKnightName) ?? null;

    function set(patch: Partial<AppState>) {
        setState(s => ({ ...s, ...patch }));
    }

    // ── Player handlers ────────────────────────────────────────────────────

    function handleNumPlayersChange(n: number) {
        set({ numPlayers: n, selectedCell: null, knightShieldCount: DEFAULT_SHIELDS[n][state.difficulty] });
        if (isEditingPlayers) {
            setEditPlayerNames(prev => {
                const updated = [...prev];
                while (updated.length < n) updated.push('');
                return updated.slice(0, n);
            });
        }
    }

    function handleStartEditPlayers() {
        const wp = readWitcherPickerState();
        const base = state.savedPlayerNames ??
            (wp.playerNames ?? []).filter(n => n?.trim());
        const n = state.numPlayers;
        const padded = [...base.slice(0, n)];
        while (padded.length < n) padded.push('');
        setEditPlayerNames(padded);
        setIsEditingPlayers(true);
        setFormErrors([]);
    }

    function handleSavePlayers() {
        const errors: string[] = [];
        editPlayerNames.forEach((name, i) => {
            if (!name.trim()) errors.push(`Gracz ${i + 1}: brak nazwy`);
        });
        if (errors.length) { setFormErrors(errors); return; }
        set({ savedPlayerNames: editPlayerNames.map(n => n.trim()) });
        setIsEditingPlayers(false);
        setFormErrors([]);
        setWildHuntResult(null);
    }

    // ── Wild Hunt movement ─────────────────────────────────────────────────

    function handleWildHuntDraw() {
        if (!state.savedPlayerNames?.length) return;
        const pool = [...state.savedPlayerNames, 'Gracz decyduje'];
        setWildHuntResult(shuffle([...pool])[0]);
        setWildHuntDrawKey(k => k + 1);
    }

    // ── Hound reward ───────────────────────────────────────────────────────

    function handleDrawHoundReward(level: number) {
        const options = HOUND_REWARDS[level];
        const drawnIndices = new Set(
            state.drawnHoundRewards.filter(r => r.level === level).map(r => r.index)
        );
        const remaining = options
            .map((text, index) => ({ index, text }))
            .filter(r => !drawnIndices.has(r.index));
        if (remaining.length === 0) return;
        const picked = shuffle([...remaining])[0];
        set({ drawnHoundRewards: [...state.drawnHoundRewards, { level, index: picked.index, text: picked.text }] });
    }

    // ── Knight fight handlers ──────────────────────────────────────────────

    function handleStartKnightFight() {
        if (!selectedKnight || state.knightHp <= 0) return;
        const deck = buildKnightDeck(selectedKnight);
        set({
            knightFightStarted: true,
            knightFightDeck: deck,
            knightFightHp: state.knightHp,
            knightRevealedCards: [],
        });
    }

    function handleDrawKnightCard() {
        if (state.knightFightDeck.length === 0) return;
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
        if (available.length === 0) return;
        const picked = shuffle([...available])[0];
        set({ knightFightDeck: [...state.knightFightDeck, picked] });
    }

    function handleKnightAttack() {
        const options = [t('opponents.monsterBite'), t('opponents.monsterCharge')];
        setKnightAttackResult(shuffle([...options])[0]);
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

    function handlePeekMove(idx: number, dir: -1 | 1) {
        setPeekCards(cards => {
            const arr = [...cards];
            const swap = idx + dir;
            if (swap < 0 || swap >= arr.length) return arr;
            [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
            return arr;
        });
    }

    function handlePeekDelete(idx: number) {
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
        const wp = readWitcherPickerState();
        const numPlayers = typeof wp.numPlayers === 'number' ? wp.numPlayers : state.numPlayers;
        const names = (wp.playerNames ?? []).filter(n => n?.trim());
        setState({
            ...DEFAULT_STATE,
            numPlayers,
            savedPlayerNames: names.length > 0 ? names : null,
        });
        localStorage.removeItem(STORAGE_KEY);
        setWildHuntResult(null);
        setKnightAttackResult(null);
        setIsEditingPlayers(false);
    }

    // ── Cell selection ─────────────────────────────────────────────────────

    function handleCellClick(rowIdx: number, colIdx: number) {
        const current = state.selectedCell;
        if (current && current[0] === rowIdx && current[1] === colIdx) {
            set({ selectedCell: null });
        } else {
            set({ selectedCell: [rowIdx, colIdx] });
        }
    }

    // ── Fight view ─────────────────────────────────────────────────────────

    if (state.knightFightStarted && selectedKnight) {
        const lastCard = state.knightRevealedCards[state.knightRevealedCards.length - 1] ?? null;
        const deckEmpty = state.knightFightDeck.length === 0;

        return (
            <Container id="Opponents">
                <PageTitle HeaderText="Walka z jeźdźcem Dzikiego Gonu" />
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>

                        <div className="text-center mb-3 d-flex justify-content-center align-items-center gap-3">
                            <Image
                                src={knightBackImages[selectedKnight.name_pl]}
                                style={{ maxWidth: '300px', width: '100%', cursor: 'zoom-in' }}
                                alt={selectedKnight.name_pl}
                                rounded
                                onClick={() => setEnlargedImage(knightBackImages[selectedKnight.name_pl])}
                            />
                            <div className="text-center" style={{ flexShrink: 0 }}>
                                <div className="fw-semibold mb-1">Liczba tarcz: {state.knightShieldCount}</div>
                                <div className="d-flex align-items-center gap-2">
                                    {state.knightShieldCount > 0 && (
                                        <Image src={frozenShieldImg} style={{ width: '256px' }} alt="Tarcze" />
                                    )}
                                    <div className="d-flex flex-column align-items-center" style={{ gap: '4px' }}>
                                        <Button variant="outline-secondary" style={{ width: '72px', fontSize: '1.2rem' }}
                                            onClick={() => set({ knightShieldCount: state.knightShieldCount + 1 })}>+</Button>
                                        <Form.Control
                                            type="number" value={state.knightShieldCount} className="text-center"
                                            style={{ width: '72px', fontSize: '1.1rem' }}
                                            onChange={e => set({ knightShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) })}
                                        />
                                        <Button variant="outline-secondary" style={{ width: '72px', fontSize: '1.2rem' }}
                                            onClick={() => set({ knightShieldCount: Math.max(0, state.knightShieldCount - 1) })}>−</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 d-flex flex-wrap align-items-center justify-content-center gap-3">
                            <span className="fs-4 fw-bold">HP: {state.knightFightHp}</span>
                            <Button variant="outline-info" size="sm" onClick={() => setKnightHelpOpen(true)}>
                                Pomoc
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={handleKnightAttack}>
                                Atak potwora
                            </Button>
                        </div>

                        {knightAttackResult && (
                            <Alert key={knightAttackKey} variant="dark" className="text-center fs-5 fw-bold result-pop mb-3">
                                {knightAttackResult}
                            </Alert>
                        )}

                        <Row className="justify-content-center mb-4 g-3 align-items-start">
                            <Col xs={6} className="text-center">
                                <div className="mb-1 fw-semibold d-flex align-items-center justify-content-center gap-1 flex-wrap">
                                    Talia ({state.knightFightDeck.length})
                                    <Button variant="outline-secondary" size="sm" onClick={handleAddKnightCard}>Dodaj kartę</Button>
                                    <Button variant="outline-secondary" size="sm" disabled={deckEmpty} onClick={handleOpenPeek}>Podejrzyj</Button>
                                </div>
                                {deckEmpty ? (
                                    <div className="text-muted fst-italic py-4">Talia pusta</div>
                                ) : (
                                    <Image
                                        src={deckBackImg}
                                        style={{ maxWidth: '200px', width: '100%', cursor: 'pointer' }}
                                        alt="talia" rounded
                                        onClick={handleDrawKnightCard}
                                    />
                                )}
                            </Col>
                            <Col xs={6} className="text-center">
                                <div className="mb-1 fw-semibold">Ostatnia karta</div>
                                {lastCard ? (
                                    <Image
                                        src={getCardImage(lastCard)}
                                        style={{ maxWidth: '200px', width: '100%', cursor: 'zoom-in' }}
                                        alt="karta" rounded
                                        onClick={() => setEnlargedImage(getCardImage(lastCard))}
                                    />
                                ) : (
                                    <div className="text-muted fst-italic py-4">—</div>
                                )}
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-center gap-2 mb-4">
                            <Button
                                variant="outline-secondary"
                                disabled={state.knightRevealedCards.length === 0}
                                onClick={() => {
                                    const last = state.knightRevealedCards[state.knightRevealedCards.length - 1];
                                    set({
                                        knightFightDeck: [last, ...state.knightFightDeck],
                                        knightFightHp: state.knightFightHp + 1,
                                        knightRevealedCards: state.knightRevealedCards.slice(0, -1),
                                    });
                                }}
                            >
                                ↩ Cofnij
                            </Button>
                            <Button variant="danger" onClick={handleEndKnightFight}>
                                Koniec walki
                            </Button>
                        </div>

                    </Col>
                </Row>

                {/* Knight help modal */}
                <Modal show={knightHelpOpen} onHide={() => setKnightHelpOpen(false)} centered size="lg">
                    <Modal.Header closeButton><Modal.Title>Zasady walki z jeźdźcem</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p className="fw-bold">Przygotowanie:</p>
                        <ul>
                            <li>Zachowujesz rękę.</li>
                            <li>Tasujesz talię + odrzucone.</li>
                        </ul>
                        <p className="fw-bold">Zasada kluczowa:</p>
                        <p>Najpierw schodzą tarcze, potem „życie" (talia wytrzymałości).</p>
                        <p className="fw-bold">Przebieg:</p>
                        <ol>
                            <li>Gracze stojący już na polu jeźdźca rozgrywają swoje tury walki.</li>
                            <li>
                                Wszyscy pozostali gracze:
                                <ul>
                                    <li>natychmiast przenoszą się na pole jeźdźca (ignorując normalny ruch),</li>
                                    <li>nie wykonują żadnej tury walki w tej rundzie (po prostu dołączają).</li>
                                </ul>
                            </li>
                            <li>Tura jeźdźca.</li>
                            <li>Tury wszystkich żyjących graczy.</li>
                        </ol>
                        <p className="text-muted fst-italic">→ Powtarzasz kroki 3–4.</p>
                        <p className="fw-bold">Tura gracza:</p>
                        <ul>
                            <li>Standardowa walka.</li>
                            <li>Obrażenia → najpierw tarcze, potem talia jeźdźca.</li>
                            <li>Odrzucenie karty jeźdźca → atak pasywny.</li>
                        </ul>
                        <p className="fw-bold">Tura jeźdźca:</p>
                        <ul>
                            <li>Odkrywasz kartę:
                                <ul>
                                    <li>karta jeźdźca → efekt dla wszystkich</li>
                                    <li>zwykła karta → każdy gracz rzuca żetonem szarży/ugryzienia (jak monetą) i rozpatruje efekt</li>
                                </ul>
                            </li>
                        </ul>
                        <p className="fw-bold">Powalenie:</p>
                        <p>Brak kart + pusta talia → odpadasz z walki.</p>
                        <p className="fw-bold">Wynik:</p>
                        <ul>
                            <li><strong>Wygrana:</strong> talia jeźdźca = 0 i ktoś żyje.</li>
                            <li><strong>Przegrana:</strong> wszyscy padną.</li>
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setKnightHelpOpen(false)}>Zamknij</Button>
                    </Modal.Footer>
                </Modal>

                {/* Peek modal */}
                <Modal show={peekOpen} onHide={() => setPeekOpen(false)} centered>
                    <Modal.Header closeButton><Modal.Title>Podejrzyj talię</Modal.Title></Modal.Header>
                    <Modal.Body>
                        {peekPhase === 'input' ? (
                            <Form onSubmit={e => { e.preventDefault(); handleConfirmPeek(); }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ile kart podejrzeć?</Form.Label>
                                    <Form.Control
                                        type="number" min={1} max={state.knightFightDeck.length}
                                        value={peekCount}
                                        onChange={e => setPeekCount(Math.max(1, Math.min(Number(e.target.value), state.knightFightDeck.length)))}
                                        autoFocus
                                    />
                                </Form.Group>
                                <Button variant="secondary" type="submit" className="w-100">Podejrzyj</Button>
                            </Form>
                        ) : (
                            <>
                                <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    {peekCards.map((card, idx) => (
                                        <ListGroup.Item key={card} className="d-flex align-items-center gap-2 py-2">
                                            <span className="text-muted fw-bold" style={{ minWidth: '1.5rem' }}>{idx + 1}.</span>
                                            <Image src={getCardImage(card)} height={210} style={{ objectFit: 'contain', cursor: 'zoom-in' }} rounded onClick={() => setEnlargedImage(getCardImage(card))} />
                                            <div className="d-flex gap-1">
                                                <Button size="sm" variant="outline-secondary" disabled={idx === 0} onClick={() => handlePeekMove(idx, -1)}>↑</Button>
                                                <Button size="sm" variant="outline-secondary" disabled={idx === peekCards.length - 1} onClick={() => handlePeekMove(idx, 1)}>↓</Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handlePeekDelete(idx)}>✕</Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Button variant="secondary" className="w-100 mt-3" onClick={handlePeekSave}>Zatwierdź kolejność</Button>
                            </>
                        )}
                    </Modal.Body>
                </Modal>

                {/* Enlarge modal */}
                <Modal show={enlargedImage !== null} onHide={() => setEnlargedImage(null)} centered size="lg">
                    <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                        {enlargedImage && <Image src={enlargedImage} style={{ maxWidth: '100%', maxHeight: '90vh' }} onClick={() => setEnlargedImage(null)} />}
                    </Modal.Body>
                </Modal>

                {/* Music toggle */}
                <div style={{ position: 'fixed', bottom: '1.2rem', right: '1.2rem', zIndex: 1050, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {currentTrackTitle && (
                        <span style={{ fontSize: '0.72rem', color: '#aaa', fontStyle: 'italic', maxWidth: '160px', textAlign: 'right', lineHeight: 1.2 }}>
                            {currentTrackTitle}
                        </span>
                    )}
                    <Button
                        variant={musicPlaying ? 'warning' : 'outline-secondary'}
                        onClick={handleMusicToggle}
                        style={{ borderRadius: '50%', width: '48px', height: '48px', fontSize: '1.3rem', lineHeight: 1, padding: 0, flexShrink: 0 }}
                        title={musicPlaying ? `Pauza – ${currentTrackTitle ?? ''}` : 'Odtwórz muzykę'}
                    >
                        🎵
                    </Button>
                </div>
            </Container>
        );
    }

    // ── Setup / main view ──────────────────────────────────────────────────

    const guideRows = GUIDE_TABLES[state.numPlayers] ?? GUIDE_TABLES[2];

    return (
        <Container id="Opponents">
            <PageTitle HeaderText={t('opponents.title')} />
            <Row className="justify-content-center">
                <Col xs={12} md={11} lg={10}>

                    {/* ── Section 1+2: Player count + Knight selector ── */}
                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="align-items-start g-3">
                                <Col xs={12} sm="auto">
                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>Liczba graczy</div>
                                    <Form.Select
                                        size="sm"
                                        style={{ width: 'auto' }}
                                        value={state.numPlayers}
                                        onChange={e => handleNumPlayersChange(Number(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </Form.Select>
                                    <div className="fw-semibold mb-1 mt-2" style={{ fontSize: '0.9rem' }}>Poziom trudności</div>
                                    <Form.Select
                                        size="sm"
                                        style={{ width: 'auto' }}
                                        value={state.difficulty}
                                        onChange={e => {
                                            const d = e.target.value as Difficulty;
                                            set({ difficulty: d, knightShieldCount: DEFAULT_SHIELDS[state.numPlayers][d] });
                                        }}
                                    >
                                        <option value="easy">Łatwy</option>
                                        <option value="normal">Normalny</option>
                                        <option value="hard">Trudny</option>
                                        <option value="veryHard">Bardzo trudny</option>
                                    </Form.Select>
                                </Col>
                                <Col xs={12} sm>
                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>Wybór jeźdźca Dzikiego Gonu</div>
                                    <div className="d-flex flex-wrap gap-3">
                                        {knights.map(k => {
                                            const selected = state.selectedKnightName === k.name_pl;
                                            return (
                                                <div
                                                    key={k.name_pl}
                                                    onClick={() => set({ selectedKnightName: selected ? null : k.name_pl })}
                                                    style={{
                                                        cursor: 'pointer',
                                                        border: selected ? '3px solid #6c757d' : '3px solid transparent',
                                                        borderRadius: '8px',
                                                        padding: '6px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Image
                                                        src={knightMiniImages[k.name_pl]}
                                                        height={80}
                                                        alt={k.name_pl}
                                                        style={{ display: 'block', margin: '0 auto 4px' }}
                                                    />
                                                    <small className="fw-semibold">{k.name_pl}</small>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* ── Section 3: Preparation ───────────────────────── */}
                    <div className="mb-3">
                        <Button variant="secondary" onClick={() => setPreparationOpen(true)}>
                            📋 Instrukcja przygotowania
                        </Button>
                    </div>

                    {/* ── Section 4: Round guide table ─────────────────── */}
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title as="h5">Przebieg tur — {state.numPlayers} {state.numPlayers === 1 ? 'gracz' : 'graczy'}</Card.Title>
                            <Row className="g-3 align-items-start">
                                <Col xs={12} md={4} className="text-center">
                                    <Image
                                        src={roundsImages[state.numPlayers]}
                                        style={{ maxWidth: '100%', cursor: 'zoom-in' }}
                                        alt={`Rundy ${state.numPlayers} graczy`}
                                        rounded
                                        onClick={() => setEnlargedImage(roundsImages[state.numPlayers])}
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <Table bordered size="sm" style={{ fontSize: '0.8rem', minWidth: '500px' }}>
                                            <thead className="table-dark">
                                                <tr>
                                                    {TABLE_HEADERS.map((h, i) => (
                                                        <th key={i}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {guideRows.map((row, rowIdx) => (
                                                    <tr key={rowIdx}>
                                                        {row.map((cell, colIdx) => {
                                                            const isSelected = state.selectedCell?.[0] === rowIdx && state.selectedCell?.[1] === colIdx;
                                                            return (
                                                                <td
                                                                    key={colIdx}
                                                                    onClick={() => handleCellClick(rowIdx, colIdx)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        backgroundColor: isSelected ? '#ffc107' : undefined,
                                                                        fontWeight: isSelected ? 'bold' : undefined,
                                                                        userSelect: 'none',
                                                                    }}
                                                                >
                                                                    {cell}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    {state.selectedCell && (
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                            Zaznaczona runda: <strong>{guideRows[state.selectedCell[0]]?.[0]}</strong>,
                                            kolumna: <strong>{TABLE_HEADERS[state.selectedCell[1]]}</strong>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* ── Section 5: Wild Hunt movement ────────────────── */}
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title as="h5">Ruch Dzikiego Gonu</Card.Title>

                            {(state.savedPlayerNames === null || isEditingPlayers) ? (
                                <Form>
                                    {editPlayerNames.map((name, i) => (
                                        <Form.Group className="mb-2" key={i}>
                                            <Form.Label style={{ fontSize: '0.85rem' }}>Gracz {i + 1}</Form.Label>
                                            <Form.Control
                                                size="sm"
                                                type="text"
                                                placeholder={`Gracz ${i + 1}`}
                                                value={name}
                                                onChange={e => setEditPlayerNames(prev => prev.map((n, j) => j === i ? e.target.value : n))}
                                                isInvalid={formErrors.some(err => err.includes(String(i + 1)))}
                                            />
                                        </Form.Group>
                                    ))}
                                    {formErrors.length > 0 && (
                                        <Alert variant="danger" className="mt-1 py-1" style={{ fontSize: '0.8rem' }}>
                                            {formErrors.map((e, i) => <div key={i}>{e}</div>)}
                                        </Alert>
                                    )}
                                    <div className="mt-2 d-flex flex-wrap gap-2">
                                        <Button variant="secondary" size="sm" onClick={handleSavePlayers}>
                                            Zapisz graczy
                                        </Button>
                                        <Button variant="outline-secondary" size="sm"
                                            onClick={() => setEditPlayerNames(prev => [...prev, ''])}>
                                            + Dodaj gracza
                                        </Button>
                                        {editPlayerNames.length > 1 && (
                                            <Button variant="outline-secondary" size="sm"
                                                onClick={() => setEditPlayerNames(prev => prev.slice(0, -1))}>
                                                − Usuń ostatniego
                                            </Button>
                                        )}
                                        {isEditingPlayers && (
                                            <Button variant="outline-secondary" size="sm"
                                                onClick={() => { setIsEditingPlayers(false); setFormErrors([]); }}>
                                                Anuluj
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            ) : (
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <Button variant="secondary" onClick={handleWildHuntDraw}>
                                        Losuj ruch
                                    </Button>
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {state.savedPlayerNames.join(', ')}
                                    </span>
                                    <Button variant="outline-secondary" size="sm" onClick={handleStartEditPlayers}>
                                        Edytuj
                                    </Button>
                                </div>
                            )}

                            {wildHuntResult && state.savedPlayerNames !== null && !isEditingPlayers && (
                                <Alert key={wildHuntDrawKey} variant="dark" className="mt-2 fs-5 fw-bold result-pop mb-0">
                                    {wildHuntResult}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    {/* ── Section 6-7: Hounds ──────────────────────────── */}
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title as="h5">Ogary Dzikiego Gonu</Card.Title>
                            <Row className="g-3 align-items-start">
                                <Col xs={6} className="text-center">
                                    <div className="mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Karta ogara</div>
                                    <Image
                                        src={houndCardImages[state.numPlayers]}
                                        style={{ maxWidth: '50%', cursor: 'zoom-in' }}
                                        alt={`Ogar ${state.numPlayers} graczy`}
                                        rounded
                                        onClick={() => setEnlargedImage(houndCardImages[state.numPlayers])}
                                    />
                                </Col>
                                {selectedKnight && (
                                    <Col xs={6} className="text-center">
                                        <div className="mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Karta rycerza</div>
                                        <Image
                                            src={knightFrontImages[selectedKnight.name_pl]}
                                            style={{ maxWidth: '50%', cursor: 'zoom-in' }}
                                            alt={selectedKnight.name_pl}
                                            rounded
                                            onClick={() => setEnlargedImage(knightFrontImages[selectedKnight.name_pl])}
                                        />
                                    </Col>
                                )}
                            </Row>

                            {/* Shield count */}
                            <div className="mt-3 d-flex align-items-center gap-2">
                                <Image src={frozenShieldImg} height={28} alt="Tarcze oblodzone" style={{ display: 'inline' }} />
                                <InputGroup style={{ maxWidth: '210px' }}>
                                    <Button variant="outline-secondary" size="sm"
                                        onClick={() => set({ houndShieldCount: Math.max(0, state.houndShieldCount - 1) })}>−</Button>
                                    <Form.Control
                                        type="number" min={0} value={state.houndShieldCount} size="sm"
                                        onChange={e => set({ houndShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) })}
                                        className="text-center"
                                    />
                                    <Button variant="outline-secondary" size="sm"
                                        onClick={() => set({ houndShieldCount: state.houndShieldCount + 1 })}>+</Button>
                                </InputGroup>
                                <span style={{ fontSize: '0.8rem' }} className="text-muted">tarcze ogara</span>
                            </div>

                            {/* Note */}
                            <Form.Group className="mt-2">
                                <Form.Label style={{ fontSize: '0.85rem' }}>Notatka (np. lokalizacja ogara)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={state.houndNote}
                                    onChange={e => set({ houndNote: e.target.value })}
                                    placeholder="Opcjonalny opis..."
                                    style={{ resize: 'vertical', fontSize: '0.85rem' }}
                                />
                            </Form.Group>

                            {/* Rules button */}
                            <div className="mt-2">
                                <Button variant="outline-secondary" size="sm" onClick={() => setHoundRulesOpen(true)}>
                                    Zasady walki z ogarem
                                </Button>
                            </div>

                            {/* Hound rewards */}
                            <div className="mt-3">
                                <div className="fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>Losowanie nagrody</div>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    {[1, 2, 3].map(level => {
                                        const drawnCount = state.drawnHoundRewards.filter(r => r.level === level).length;
                                        const exhausted = drawnCount >= HOUND_REWARDS[level].length;
                                        return (
                                            <Button
                                                key={level}
                                                variant="outline-secondary"
                                                disabled={exhausted}
                                                onClick={() => handleDrawHoundReward(level)}
                                                style={{ padding: '4px 8px' }}
                                                title={exhausted ? 'Wszystkie nagrody wyczerpane' : `Nagroda ogar poziom ${level}`}
                                            >
                                                <Image src={houndRewardIcons[level]} height={144} alt={`Poziom ${level}`} />
                                                {exhausted && <div style={{ fontSize: '0.7rem' }}>Wyczerpane</div>}
                                            </Button>
                                        );
                                    })}
                                </div>
                                {state.drawnHoundRewards.length > 0 && (
                                    <ListGroup variant="flush">
                                        {state.drawnHoundRewards.map((r, i) => (
                                            <ListGroup.Item key={i} style={{ fontSize: '0.85rem', padding: '4px 0' }}>
                                                <span className="text-muted me-2">Poz. {r.level}:</span>{r.text}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* ── Section 8: Knight fight setup ────────────────── */}
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title as="h5">Walka z jeźdźcem</Card.Title>

                            {!selectedKnight ? (
                                <p className="text-muted">Wybierz jeźdźca w sekcji powyżej.</p>
                            ) : (
                                <>
                                    <div className="mb-3 d-flex justify-content-center align-items-center gap-3">
                                        <Image
                                            src={knightBackImages[selectedKnight.name_pl]}
                                            style={{ maxWidth: '220px', width: '100%', cursor: 'zoom-in' }}
                                            alt={selectedKnight.name_pl + ' back'}
                                            rounded
                                            onClick={() => setEnlargedImage(knightBackImages[selectedKnight.name_pl])}
                                        />
                                        <div className="text-center" style={{ flexShrink: 0 }}>
                                            <div className="fw-semibold mb-1">Liczba tarcz: {state.knightShieldCount}</div>
                                            <div className="d-flex align-items-center gap-2">
                                                {state.knightShieldCount > 0 && (
                                                    <Image src={frozenShieldImg} style={{ width: '256px' }} alt="Tarcze" />
                                                )}
                                                <div className="d-flex flex-column align-items-center" style={{ gap: '4px' }}>
                                                    <Button variant="outline-secondary" style={{ width: '72px', fontSize: '1.2rem' }}
                                                        onClick={() => set({ knightShieldCount: state.knightShieldCount + 1 })}>+</Button>
                                                    <Form.Control
                                                        type="number" value={state.knightShieldCount} className="text-center"
                                                        style={{ width: '72px', fontSize: '1.1rem' }}
                                                        onChange={e => set({ knightShieldCount: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) })}
                                                    />
                                                    <Button variant="outline-secondary" style={{ width: '72px', fontSize: '1.2rem' }}
                                                        onClick={() => set({ knightShieldCount: Math.max(0, state.knightShieldCount - 1) })}>−</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* HP */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Punkty życia</Form.Label>
                                        <InputGroup style={{ maxWidth: '160px' }}>
                                            <Button variant="outline-secondary"
                                                onClick={() => set({ knightHp: Math.max(0, state.knightHp - 1) })}>−</Button>
                                            <Form.Control
                                                type="number" value={state.knightHp} className="text-center"
                                                onChange={e => set({ knightHp: Math.max(0, isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)) })}
                                            />
                                            <Button variant="outline-secondary"
                                                onClick={() => set({ knightHp: state.knightHp + 1 })}>+</Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <div className="d-flex gap-2 flex-wrap">
                                        <Button
                                            variant="secondary"
                                            disabled={state.knightHp <= 0}
                                            onClick={handleStartKnightFight}
                                        >
                                            Rozpocznij walkę
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setKnightFightRulesOpen(true)}
                                        >
                                            Instrukcja walki
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    {/* ── Reset ────────────────────────────────────────── */}
                    <div className="mb-4">
                        <Button variant="outline-danger" onClick={handleReset}>
                            Resetuj
                        </Button>
                    </div>

                </Col>
            </Row>

            {/* Preparation modal */}
            <Modal show={preparationOpen} onHide={() => setPreparationOpen(false)} centered size="lg">
                <Modal.Header closeButton><Modal.Title>Przygotowanie</Modal.Title></Modal.Header>
                <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                    <Image
                        src={preparationImg}
                        style={{ maxWidth: '100%', cursor: 'zoom-in' }}
                        onClick={() => { setPreparationOpen(false); setEnlargedImage(preparationImg); }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPreparationOpen(false)}>Zamknij</Button>
                </Modal.Footer>
            </Modal>

            {/* Knight fight rules modal */}
            <Modal show={knightFightRulesOpen} onHide={() => setKnightFightRulesOpen(false)} centered size="lg">
                <Modal.Header closeButton><Modal.Title>Instrukcja walki z jeźdźcem</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p className="fw-bold">Przygotowanie</p>
                    <ul>
                        <li>Zachowaj karty na ręce.</li>
                        <li>Potasuj talię akcji + stos kart odrzuconych.</li>
                        <li>Najpierw zbij tarcze jeźdźca (1 obrażenie = 1 tarcza), potem trafienia idą w talię.</li>
                    </ul>

                    <p className="fw-bold mt-3">Przebieg walki</p>
                    <ol>
                        <li>Gracze na tym samym obszarze walczą (dowolna kolejność).</li>
                        <li>Pozostali gracze dołączają do walki (bez swojej tury).</li>
                        <li>Tura jeźdźca.</li>
                        <li>Znów tury graczy (którzy nie zostali powaleni).</li>
                        <li>Powtarzaj kroki 3–4 aż do końca walki.</li>
                    </ol>

                    <p className="fw-bold mt-3">Tura gracza</p>
                    <ul>
                        <li>Gracze ustalają kolejność.</li>
                        <li>Każdy rozgrywa pełną turę jak w normalnej walce.</li>
                        <li>Odrzucenie karty walki jeźdźca = aktywacja jej ataku pasywnego.</li>
                    </ul>

                    <p className="fw-bold mt-3">Tura jeźdźca</p>
                    <p>Odkryj 1 kartę z jego talii wytrzymałości:</p>
                    <ul>
                        <li><strong>Karta Dzikiego Gonu</strong> → wszyscy wykonują efekt z karty.</li>
                        <li><strong>Zwykła karta</strong> → każdy z graczy losuje czy gryzie czy szarżuje i rozpatrz efekt.</li>
                    </ul>

                    <p className="fw-bold mt-3">Powalenie i koniec walki</p>
                    <ul>
                        <li>Brak kart + pusta talia = wiedźmin powalony (wypada z walki).</li>
                        <li><strong>Przegrana:</strong> wszyscy wiedźmini powaleni.</li>
                        <li><strong>Wygrana:</strong> talia jeźdźca się skończy i ktoś przetrwa.</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setKnightFightRulesOpen(false)}>Zamknij</Button>
                </Modal.Footer>
            </Modal>

            {/* Hound rules modal */}
            <Modal show={houndRulesOpen} onHide={() => setHoundRulesOpen(false)} centered size="lg">
                <Modal.Header closeButton><Modal.Title>Walka z ogarem – w pigułce</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p><strong>Kiedy:</strong> tylko w fazie I, jeśli gracze są na tym samym obszarze co ogar (to nie jest standardowa walka z potworem).</p>
                    <p><strong>Ile razy:</strong> każdy gracz może walczyć z danym ogarem tylko raz na fazę I.</p>
                    <p className="fw-bold mt-3">Przygotowanie:</p>
                    <ul>
                        <li>Obniżasz poziom tarczy o wartość z karty.</li>
                        <li>Dobierasz wskazaną liczbę kart (wg poziomu ogara na karcie).</li>
                    </ul>
                    <p className="fw-bold">Atak:</p>
                    <ul>
                        <li>Każdy gracz zagrywa 1 kombinację kart (min. 1 karta).</li>
                        <li>Symbole:
                            <ul>
                                <li>obrażenia → zadają dmg ogarowi</li>
                                <li>tarcze → zwiększają tarczę (do limitu obrony)</li>
                                <li>inne → ignorujesz</li>
                            </ul>
                        </li>
                    </ul>
                    <p className="fw-bold">Wynik:</p>
                    <ul>
                        <li><strong>Więcej obrażeń niż HP ogara:</strong>
                            <ul>
                                <li>nadmiar obrażeń zadaje tarcze Jeźdźcowi</li>
                                <li>losowy żeton nagrody dla wszystkich</li>
                                <li>ogar znika z planszy</li>
                            </ul>
                        </li>
                        <li><strong>Równo z HP:</strong>
                            <ul>
                                <li>nagroda dla wszystkich</li>
                                <li>ogar znika</li>
                            </ul>
                        </li>
                        <li><strong>Mniej niż HP:</strong>
                            <ul>
                                <li>odrzucasz rękę</li>
                                <li>ogar zostaje na planszy</li>
                            </ul>
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setHoundRulesOpen(false)}>Zamknij</Button>
                </Modal.Footer>
            </Modal>

            {/* Enlarge modal */}
            <Modal show={enlargedImage !== null} onHide={() => setEnlargedImage(null)} centered size="lg">
                <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                    {enlargedImage && (
                        <Image src={enlargedImage} style={{ maxWidth: '100%', maxHeight: '90vh' }} onClick={() => setEnlargedImage(null)} />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}
