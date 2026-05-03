import { useState, useEffect, useRef } from 'react';
import { Alert, Button, Col, Container, Form, Image, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
import '../css/Opponents.css';
import monstersData from '../monsters.json';
import { shuffle } from '../util/generic';

interface Monster {
    name_pl: string;
    level: number;
    base_heal: number;
    front_name: string;
    back_name: string;
}

interface MonsterFightState {
    // Setup fields
    selectedMonsterName: string | null;
    monsterTrail: boolean;
    wildHunt: boolean;
    currentHp: number | null;
    hasWeaknessTokens: boolean;
    selectedTokens: string[];
    // Fight fields
    fightStarted: boolean;
    fightDeck: string[];     // remaining cards ("main:filename" or "trail:filename")
    fightHp: number;
    revealedCards: string[]; // drawn cards, last = most recent
    leshyDiceCount: number;
    note: string;
}

const STORAGE_KEY = 'monsterFight_state';

const DEFAULT_STATE: MonsterFightState = {
    selectedMonsterName: null,
    monsterTrail: false,
    wildHunt: false,
    currentHp: null,
    hasWeaknessTokens: false,
    selectedTokens: [],
    fightStarted: false,
    fightDeck: [],
    fightHp: 0,
    revealedCards: [],
    leshyDiceCount: 0,
    note: '',
};

function loadState(): MonsterFightState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) as MonsterFightState } : DEFAULT_STATE;
    } catch {
        return DEFAULT_STATE;
    }
}

function saveState(state: MonsterFightState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const monsters = monstersData as Monster[];

const byLevel = (level: number): Monster[] =>
    monsters
        .filter(m => m.level === level)
        .sort((a, b) => a.name_pl.localeCompare(b.name_pl, 'pl'));

const SELECTABLE_TOKENS: string[] = [
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Forest_${i + 1}`),
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Mountain_${i + 1}`),
    ...Array.from({ length: 6 }, (_, i) => `Weakness_Water_${i + 1}`),
];

// Card key prefixes
const MAIN_CARDS = Array.from({ length: 20 }, (_, i) =>
    `monster_trial_${String(i + 1).padStart(2, '0')}.jpg`
);
const TRAIL_CARDS = Array.from({ length: 4 }, (_, i) =>
    `monster_trial_${i + 1}.jpg`
);

// Pre-load all images at module level
const monsterCardImages: Record<string, string> = Object.fromEntries(
    monsters.map(m => [
        m.name_pl + ':front', require(`../img/monsters_full_cards/${m.front_name}.jpg`),
    ]).concat(
        monsters.map(m => [
            m.name_pl + ':back', require(`../img/monsters_full_cards/${m.back_name}.jpg`),
        ])
    )
);

const mainCardImages: Record<string, string> = Object.fromEntries(
    MAIN_CARDS.map(f => [f, require(`../img/monster_fight/${f}`)])
);
const trailCardImages: Record<string, string> = Object.fromEntries(
    TRAIL_CARDS.map(f => [f, require(`../img/monster_fight/monster_trial/${f}`)])
);

const tokenImages: Record<string, string> = Object.fromEntries(
    SELECTABLE_TOKENS.map(token => [token, require(`../img/tokens/weaknessTokens/${token}.jpg`)])
);

const monsterTrailImg: string = require('../img/expansionHeaders/monsterTrail.png');
const wildHuntExpImg: string = require('../img/expansionHeaders/wildHunt.png');
const deckBackImg: string = require('../img/monster_fight/back.jpg');

function getCardImage(key: string): string {
    if (key.startsWith('main:')) return mainCardImages[key.slice(5)];
    return trailCardImages[key.slice(6)]; // "trail:filename"
}

function buildDeck(level: number, monsterTrail: boolean, hp: number): string[] {
    const mainKeys = MAIN_CARDS.map(f => `main:${f}`);
    if (!monsterTrail) {
        return shuffle([...mainKeys]).slice(0, hp);
    }
    const trailKeys = TRAIL_CARDS.map(f => `trail:${f}`);
    const n = level <= 2 ? 12 : 16;
    const selectedMain = shuffle([...mainKeys]).slice(0, n);
    const pool = shuffle([...trailKeys, ...selectedMain]);
    return pool.slice(0, hp);
}

export default function MonsterFight({ t }): JSX.Element {
    const [state, setState] = useState<MonsterFightState>(loadState);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [monsterAttackResult, setMonsterAttackResult] = useState<string | null>(null);
    const [monsterAttackKey, setMonsterAttackKey] = useState(0);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [trollModalOpen, setTrollModalOpen] = useState(false);
    const [trollSelectedCard, setTrollSelectedCard] = useState<string | null>(null);
    const [peekOpen, setPeekOpen] = useState(false);
    const [peekCount, setPeekCount] = useState(1);
    const [peekPhase, setPeekPhase] = useState<'input' | 'arrange'>('input');
    const [peekCards, setPeekCards] = useState<string[]>([]);
    const [peekOriginalCount, setPeekOriginalCount] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(require('../music/combat_music.mp3'));
        audio.loop = true;
        audioRef.current = audio;
        return () => { audio.pause(); };
    }, []);

    function handleMusicToggle() {
        if (!audioRef.current) return;
        if (musicPlaying) {
            audioRef.current.pause();
        } else {
            void audioRef.current.play();
        }
        setMusicPlaying(m => !m);
    }

    const selectedMonster = monsters.find(m => m.name_pl === state.selectedMonsterName) ?? null;

    useEffect(() => {
        saveState(state);
    }, [state]);

    // ── Setup handlers ──────────────────────────────────────────────────────

    function handleLevelSelect(level: number, name: string) {
        if (!name) {
            if (selectedMonster?.level === level) {
                setState(s => ({ ...s, selectedMonsterName: null, currentHp: null }));
            }
            return;
        }
        const monster = monsters.find(m => m.name_pl === name);
        setState(s => ({
            ...s,
            selectedMonsterName: name,
            currentHp: monster?.base_heal ?? null,
        }));
    }

    function handleHpChange(delta: number) {
        setState(s => ({
            ...s,
            currentHp: Math.max(0, (s.currentHp ?? 0) + delta),
        }));
    }

    function handleTokenToggle(token: string) {
        setState(s => {
            const already = s.selectedTokens.includes(token);
            if (!already && s.selectedTokens.length >= 6) return s;
            return {
                ...s,
                selectedTokens: already
                    ? s.selectedTokens.filter(tk => tk !== token)
                    : [...s.selectedTokens, token],
            };
        });
    }

    function handleStartFight() {
        if (!selectedMonster || state.currentHp === null || state.currentHp <= 0) return;
        const deck = buildDeck(selectedMonster.level, state.monsterTrail, state.currentHp);
        setState(s => ({
            ...s,
            fightStarted: true,
            fightDeck: deck,
            fightHp: s.currentHp ?? 0,
            revealedCards: [],
        }));
    }

    function handleReset() {
        setState(prev => ({ ...DEFAULT_STATE, note: prev.note }));
    }

    // ── Fight handlers ───────────────────────────────────────────────────────

    function handleDrawCard() {
        if (state.fightDeck.length === 0) return;
        const [drawn, ...remaining] = state.fightDeck;
        setState(s => ({
            ...s,
            fightDeck: remaining,
            fightHp: Math.max(0, s.fightHp - 1),
            revealedCards: [...s.revealedCards, drawn],
        }));
    }

    function handleAddCard() {
        const allMain = MAIN_CARDS.map(f => `main:${f}`);
        const used = new Set([...state.fightDeck, ...state.revealedCards]);
        const available = allMain.filter(k => !used.has(k));
        if (available.length === 0) return;
        const picked = shuffle([...available])[0];
        setState(s => ({ ...s, fightDeck: [...s.fightDeck, picked] }));
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

    function handlePeekRemove(idx: number) {
        setPeekCards(cards => cards.filter((_, i) => i !== idx));
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

    function handlePeekSave() {
        const removed = peekOriginalCount - peekCards.length;
        setState(s => ({
            ...s,
            fightDeck: [...peekCards, ...s.fightDeck.slice(peekOriginalCount)],
            fightHp: Math.max(0, s.fightHp - removed),
        }));
        setPeekOpen(false);
    }

    function handleMonsterAttack() {
        const options = [t('opponents.monsterBite'), t('opponents.monsterCharge')];
        setMonsterAttackResult(shuffle([...options])[0]);
        setMonsterAttackKey(k => k + 1);
    }

    function handleLeshyDiceChange(delta: number) {
        setState(s => ({ ...s, leshyDiceCount: Math.max(0, s.leshyDiceCount + delta) }));
    }

    function handleLeshyDiceInput(value: number) {
        setState(s => ({ ...s, leshyDiceCount: Math.max(0, isNaN(value) ? 0 : value) }));
    }

    function handleTrollAbilityConfirm() {
        if (!trollSelectedCard) return;
        setState(s => ({
            ...s,
            fightDeck: [trollSelectedCard, ...s.fightDeck],
            fightHp: s.fightHp + 1,
            revealedCards: s.revealedCards.filter(c => c !== trollSelectedCard),
        }));
        setTrollSelectedCard(null);
        setTrollModalOpen(false);
    }

    function handleEndFight() {
        audioRef.current?.pause();
        setMusicPlaying(false);
        setState(DEFAULT_STATE);
        localStorage.removeItem(STORAGE_KEY);
    }

    // ── Fight view ───────────────────────────────────────────────────────────

    if (state.fightStarted && selectedMonster) {
        const lastCard = state.revealedCards[state.revealedCards.length - 1] ?? null;
        const deckEmpty = state.fightDeck.length === 0;

        return (
            <Container id="MonsterFight">
                <PageTitle HeaderText={t('monsterFight.title')} />
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>

                        {/* Monster images (25% larger than setup: 375px) */}
                        <Row className="justify-content-center mb-3 g-3">
                            <Col xs={6} className="text-center">
                                <Image
                                    src={monsterCardImages[selectedMonster.name_pl + ':front']}
                                    style={{ maxWidth: '375px', width: '100%', cursor: 'zoom-in' }}
                                    alt={selectedMonster.name_pl}
                                    rounded
                                    onClick={() => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':front'])}
                                />
                            </Col>
                            <Col xs={6} className="text-center">
                                <Image
                                    src={monsterCardImages[selectedMonster.name_pl + ':back']}
                                    style={{ maxWidth: '375px', width: '100%', cursor: 'zoom-in' }}
                                    alt={selectedMonster.name_pl + ' back'}
                                    rounded
                                    onClick={() => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':back'])}
                                />
                            </Col>
                        </Row>

                        {/* HP + Monster Attack */}
                        <div className="mb-3 text-center d-flex align-items-center justify-content-center gap-3">
                            <span className="fs-4 fw-bold">{t('monsterFight.fightHpLabel')}: {state.fightHp}</span>
                            <Button variant="outline-danger" size="sm" onClick={handleMonsterAttack}>
                                {t('opponents.monsterAttackTitle')}
                            </Button>
                        </div>
                        {monsterAttackResult && (
                            <Alert key={monsterAttackKey} variant="dark" className="text-center fs-5 fw-bold result-pop mb-3">
                                {monsterAttackResult}
                            </Alert>
                        )}

                        {/* Leszy dice count */}
                        {selectedMonster.name_pl === 'Leszy' && (
                            <div className="mb-3 d-flex align-items-center justify-content-center gap-3">
                                <span className="fw-semibold">Liczba kości:</span>
                                <InputGroup style={{ width: '140px' }}>
                                    <Button variant="outline-secondary" onClick={() => handleLeshyDiceChange(-1)}>−</Button>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        value={state.leshyDiceCount}
                                        onChange={e => handleLeshyDiceInput(Number(e.target.value))}
                                        className="text-center"
                                    />
                                    <Button variant="outline-secondary" onClick={() => handleLeshyDiceChange(1)}>+</Button>
                                </InputGroup>
                            </div>
                        )}

                        {/* Weakness tokens */}
                        {state.selectedTokens.length > 0 && (
                            <div className="mb-3 text-center">
                                <div className="mb-1 fw-semibold">{t('monsterFight.weaknessTokensLabel')}</div>
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                    {state.selectedTokens.map(token => (
                                        <Image
                                            key={token}
                                            src={tokenImages[token]}
                                            width={60}
                                            height={60}
                                            alt={token}
                                            style={{ borderRadius: '6px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deck + revealed card */}
                        <Row className="justify-content-center mb-4 g-3 align-items-start">
                            <Col xs={6} className="text-center">
                                <div className="mb-1 fw-semibold d-flex align-items-center justify-content-center gap-2">
                                    {t('monsterFight.deckLabel')} ({state.fightDeck.length})
                                    <Button variant="outline-secondary" size="sm" onClick={handleAddCard}>
                                        {t('monsterFight.addCardBtn')}
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" disabled={state.fightDeck.length === 0} onClick={handleOpenPeek}>
                                        {t('monsterFight.peekDeckBtn')}
                                    </Button>
                                </div>
                                {deckEmpty ? (
                                    <div className="text-muted fst-italic py-4">{t('monsterFight.deckEmptyLabel')}</div>
                                ) : (
                                    <Image
                                        src={deckBackImg}
                                        style={{ maxWidth: '200px', width: '100%', cursor: 'pointer' }}
                                        alt="deck"
                                        rounded
                                        onClick={handleDrawCard}
                                    />
                                )}
                            </Col>
                            <Col xs={6} className="text-center">
                                <div className="mb-1 fw-semibold">{t('monsterFight.currentCardLabel')}</div>
                                {lastCard ? (
                                    <Image
                                        src={getCardImage(lastCard)}
                                        style={{ maxWidth: '200px', width: '100%', cursor: 'zoom-in' }}
                                        alt="revealed card"
                                        rounded
                                        onClick={() => setEnlargedImage(getCardImage(lastCard))}
                                    />
                                ) : (
                                    <div className="text-muted fst-italic py-4">—</div>
                                )}
                            </Col>
                        </Row>

                        {/* Wild Hunt reminder */}
                        {state.wildHunt && (
                            <div className="text-center mb-3 px-2 py-2 border border-secondary rounded" style={{ background: 'rgba(108,117,125,0.1)' }}>
                                <span className="fw-semibold">
                                    Jeśli potwór zostaje pokonany albo odpędzony, jeździec Dzikiego Gonu traci tyle tarcz, ile wynosi poziom tego potwora.
                                </span>
                            </div>
                        )}

                        {/* End fight button */}
                        <div className="text-center mb-4 d-flex justify-content-center gap-2 flex-wrap">
                            {selectedMonster.name_pl === 'Troll' && (
                                <Button
                                    variant="outline-warning"
                                    disabled={state.revealedCards.length === 0}
                                    onClick={() => { setTrollSelectedCard(null); setTrollModalOpen(true); }}
                                >
                                    Zdolność specjalna
                                </Button>
                            )}
                            <Button
                                variant="outline-secondary"
                                disabled={state.revealedCards.length === 0}
                                onClick={() => {
                                    const last = state.revealedCards[state.revealedCards.length - 1];
                                    setState(s => ({
                                        ...s,
                                        fightDeck: [last, ...s.fightDeck],
                                        fightHp: s.fightHp + 1,
                                        revealedCards: s.revealedCards.slice(0, -1),
                                    }));
                                }}
                            >
                                ↩ Cofnij
                            </Button>
                            <Button variant="outline-secondary" onClick={handleEndFight}>
                                {t('monsterFight.endFightBtn')}
                            </Button>
                            <Button variant="danger" onClick={() => setResultModalOpen(true)}>
                                Wynik walki
                            </Button>
                        </div>

                    </Col>
                </Row>

                {/* Fight result modal */}
                <Modal show={resultModalOpen} onHide={() => setResultModalOpen(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Wynik walki</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="fw-bold">Po każdej walce, bez względu na wynik:</p>
                        <ul>
                            <li>tasuje się karty walki potwora i tworzy nową talię,</li>
                            <li>tasuje się talię wytrzymałości, rękę i stos kart odrzuconych, tworząc nową talię akcji,</li>
                            <li>wiedźmin wraca do normalnego poziomu tarczy obrony.</li>
                        </ul>
                        <hr />
                        <p className="fw-bold">1. Pokonanie potwora</p>
                        <ul>
                            <li>bierze kartę potwora i 2 złota,</li>
                            <li>zyskuje +1 reputacji i doznaje zmęczenia,</li>
                            <li>wkłada kartę potwora pod swoją planszetkę jako trofeum,</li>
                            <li>po walce odkłada stary żeton potwora, a na planszy pojawia się nowy żeton poziomu +1,</li>
                            <li>odrzuć żeton tropu oraz zadania tropienia tego potwora.</li>
                        </ul>
                        <p className="fw-bold">2. Odpędzenie potwora</p>
                        <p className="text-muted fst-italic" style={{ fontSize: '0.9em' }}>Jeśli wiedźmin zostanie powalony, a w talii wytrzymałości potwora zostało mniej niż 2 kart:</p>
                        <ul>
                            <li>bierze 2 złota,</li>
                            <li>usuwa potwora z gry,</li>
                            <li>bierze 1 kartę akcji o koszcie 0 na swój stos kart odrzuconych,</li>
                            <li>na planszy pojawia się nowy potwór tego samego poziomu.</li>
                        </ul>
                        <p className="fw-bold">3. Klęska wiedźmina</p>
                        <p className="text-muted fst-italic" style={{ fontSize: '0.9em' }}>Jeśli wiedźmin zostanie powalony, a potwór ma jeszcze 2 lub więcej kart wytrzymałości:</p>
                        <ul>
                            <li>bierze 1 żeton tropu z terenu, na którym stoi potwór,</li>
                            <li>bierze 1 kartę akcji o koszcie 0 na stos kart odrzuconych,</li>
                            <li>w tej turze dobiera o 1 kartę mniej w fazie III.</li>
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setResultModalOpen(false)}>Zamknij</Button>
                    </Modal.Footer>
                </Modal>

                {/* Peek deck modal */}
                <Modal show={peekOpen} onHide={() => setPeekOpen(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{t('monsterFight.peekDeckTitle')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {peekPhase === 'input' ? (
                            <Form onSubmit={e => { e.preventDefault(); handleConfirmPeek(); }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('monsterFight.peekCountLabel')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        max={state.fightDeck.length}
                                        value={peekCount}
                                        onChange={e => setPeekCount(Math.max(1, Math.min(Number(e.target.value), state.fightDeck.length)))}
                                        autoFocus
                                    />
                                </Form.Group>
                                <Button variant="secondary" type="submit" className="w-100">
                                    {t('monsterFight.peekConfirmBtn')}
                                </Button>
                            </Form>
                        ) : (
                            <>
                                <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    {peekCards.map((card, idx) => (
                                        <ListGroup.Item key={card} className="d-flex align-items-center gap-2 py-2">
                                            <span className="text-muted fw-bold" style={{ minWidth: '1.5rem' }}>{idx + 1}.</span>
                                            <Image src={getCardImage(card)} height={70} style={{ objectFit: 'contain', cursor: 'zoom-in' }} rounded onClick={() => setEnlargedImage(getCardImage(card))} />
                                            <div className="ms-auto d-flex gap-1">
                                                <Button size="sm" variant="outline-secondary" disabled={idx === 0} onClick={() => handlePeekMove(idx, -1)}>↑</Button>
                                                <Button size="sm" variant="outline-secondary" disabled={idx === peekCards.length - 1} onClick={() => handlePeekMove(idx, 1)}>↓</Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handlePeekRemove(idx)}>✕</Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Button variant="secondary" className="w-100 mt-3" onClick={handlePeekSave}>
                                    {t('monsterFight.peekReturnBtn')}
                                </Button>
                            </>
                        )}
                    </Modal.Body>
                </Modal>

                {/* Troll special ability modal */}
                <Modal show={trollModalOpen} onHide={() => setTrollModalOpen(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Zdolność specjalna Trolla</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted mb-3">Wybierz 1 kartę z odrzuconych — zostanie umieszczona na wierzchu talii potwora.</p>
                        {state.revealedCards.length === 0 ? (
                            <p className="text-muted fst-italic">Brak odrzuconych kart.</p>
                        ) : (
                            <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {state.revealedCards.map((card, idx) => (
                                    <ListGroup.Item
                                        key={card + idx}
                                        action
                                        active={trollSelectedCard === card}
                                        onClick={() => setTrollSelectedCard(card)}
                                        className="d-flex align-items-center gap-3 py-2"
                                    >
                                        <Image
                                            src={getCardImage(card)}
                                            height={70}
                                            style={{ objectFit: 'contain', cursor: 'zoom-in' }}
                                            rounded
                                            onClick={e => { e.stopPropagation(); setEnlargedImage(getCardImage(card)); }}
                                        />
                                        <span className="text-muted" style={{ fontSize: '0.85em' }}>Karta {idx + 1}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setTrollModalOpen(false)}>Anuluj</Button>
                        <Button variant="secondary" disabled={!trollSelectedCard} onClick={handleTrollAbilityConfirm}>
                            Połóż na wierzchu talii
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Enlarge modal */}
                <Modal show={enlargedImage !== null} onHide={() => setEnlargedImage(null)} centered size="lg">
                    <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                        {enlargedImage && (
                            <Image
                                src={enlargedImage}
                                style={{ maxWidth: '100%', maxHeight: '90vh' }}
                                onClick={() => setEnlargedImage(null)}
                            />
                        )}
                    </Modal.Body>
                </Modal>

                {/* Music toggle button */}
                <Button
                    variant={musicPlaying ? 'warning' : 'outline-secondary'}
                    onClick={handleMusicToggle}
                    style={{
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
                    }}
                    title={musicPlaying ? 'Pauza' : 'Odtwórz muzykę'}
                >
                    🎵
                </Button>
            </Container>
        );
    }

    // ── Setup view ───────────────────────────────────────────────────────────

    return (
        <Container id="MonsterFight">
            <PageTitle HeaderText={t('monsterFight.title')} />
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>

                    {/* Monster selects by level */}
                    {([1, 2, 3] as const).map(level => (
                        <Form.Group key={level} className="mb-3">
                            <Form.Label>{t(`monsterFight.level${level}Label` as const)}</Form.Label>
                            <Form.Select
                                value={selectedMonster?.level === level ? (state.selectedMonsterName ?? '') : ''}
                                onChange={e => handleLevelSelect(level, e.target.value)}
                            >
                                <option value="">{t('monsterFight.selectPlaceholder')}</option>
                                {byLevel(level).map(m => (
                                    <option key={m.name_pl} value={m.name_pl}>{m.name_pl}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    ))}

                    {/* Monster Trail expansion checkbox */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            id="monsterTrailCheck"
                            checked={state.monsterTrail}
                            onChange={e => setState(s => ({ ...s, monsterTrail: e.target.checked }))}
                            label={
                                <span className="d-inline-flex align-items-center gap-2">
                                    {t('monsterFight.monsterTrailLabel')}
                                    <Image src={monsterTrailImg} width={120} />
                                </span>
                            }
                        />
                    </Form.Group>

                    {/* Wild Hunt expansion checkbox */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            id="wildHuntCheck"
                            checked={state.wildHunt}
                            onChange={e => setState(s => ({ ...s, wildHunt: e.target.checked }))}
                            label={
                                <span className="d-inline-flex align-items-center gap-2">
                                    Dodatek
                                    <Image src={wildHuntExpImg} width={120} />
                                </span>
                            }
                        />
                    </Form.Group>

                    {/* Note */}
                    <Form.Group className="mb-3">
                        <Form.Label>{t('monsterFight.noteLabel')}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={state.note}
                            onChange={e => setState(s => ({ ...s, note: e.target.value }))}
                        />
                    </Form.Group>

                    {/* Monster card image + HP */}
                    {selectedMonster && (
                        <>
                            <Row className="justify-content-center mb-3 g-2">
                                <Col xs={6} className="text-center">
                                    <Image
                                        src={monsterCardImages[selectedMonster.name_pl + ':front']}
                                        fluid
                                        style={{ maxWidth: '300px', cursor: 'zoom-in' }}
                                        alt={selectedMonster.name_pl}
                                        rounded
                                        onClick={() => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':front'])}
                                    />
                                </Col>
                                <Col xs={6} className="text-center">
                                    <Image
                                        src={monsterCardImages[selectedMonster.name_pl + ':back']}
                                        fluid
                                        style={{ maxWidth: '300px', cursor: 'zoom-in' }}
                                        alt={selectedMonster.name_pl + ' back'}
                                        rounded
                                        onClick={() => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':back'])}
                                    />
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>{t('monsterFight.hpLabel')}</Form.Label>
                                <InputGroup style={{ maxWidth: '160px' }}>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => handleHpChange(-1)}
                                    >
                                        −
                                    </Button>
                                    <Form.Control
                                        type="number"
                                        readOnly
                                        value={state.currentHp ?? 0}
                                        className="text-center"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => handleHpChange(1)}
                                    >
                                        +
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </>
                    )}

                    {/* Weakness tokens checkbox */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            id="weaknessCheck"
                            checked={state.hasWeaknessTokens}
                            onChange={e => setState(s => ({ ...s, hasWeaknessTokens: e.target.checked }))}
                            label={t('monsterFight.weaknessTokensCheckbox')}
                        />
                    </Form.Group>

                    {/* Token selection grid */}
                    {state.hasWeaknessTokens && (
                        <Form.Group className="mb-3">
                            <Form.Label>{t('monsterFight.weaknessTokensTitle')}</Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {SELECTABLE_TOKENS.map(token => {
                                    const selected = state.selectedTokens.includes(token);
                                    const disabled = !selected && state.selectedTokens.length >= 6;
                                    return (
                                        <Image
                                            key={token}
                                            src={tokenImages[token]}
                                            width={80}
                                            height={80}
                                            alt={token}
                                            style={{
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                border: selected ? '3px solid #198754' : '3px solid transparent',
                                                borderRadius: '8px',
                                                opacity: disabled ? 0.4 : 1,
                                                objectFit: 'cover',
                                            }}
                                            onClick={() => !disabled && handleTokenToggle(token)}
                                        />
                                    );
                                })}
                            </div>
                        </Form.Group>
                    )}

                    {/* Action buttons */}
                    <div className="d-flex gap-2 mt-4 mb-4">
                        <Button
                            variant="secondary"
                            disabled={!selectedMonster || !state.currentHp}
                            onClick={handleStartFight}
                        >
                            {t('monsterFight.startFightBtn')}
                        </Button>
                        <Button variant="outline-secondary" onClick={handleReset}>
                            {t('monsterFight.resetBtn')}
                        </Button>
                    </div>

                </Col>
            </Row>

            {/* Enlarge modal (setup view) */}
            <Modal show={enlargedImage !== null} onHide={() => setEnlargedImage(null)} centered size="lg">
                <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                    {enlargedImage && (
                        <Image
                            src={enlargedImage}
                            style={{ maxWidth: '100%', maxHeight: '90vh' }}
                            onClick={() => setEnlargedImage(null)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}
