import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Image, InputGroup, Modal, Row } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
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
    currentHp: number | null;
    hasWeaknessTokens: boolean;
    selectedTokens: string[];
    // Fight fields
    fightStarted: boolean;
    fightDeck: string[];     // remaining cards ("main:filename" or "trail:filename")
    fightHp: number;
    revealedCards: string[]; // drawn cards, last = most recent
}

const STORAGE_KEY = 'monsterFight_state';

const DEFAULT_STATE: MonsterFightState = {
    selectedMonsterName: null,
    monsterTrail: false,
    currentHp: null,
    hasWeaknessTokens: false,
    selectedTokens: [],
    fightStarted: false,
    fightDeck: [],
    fightHp: 0,
    revealedCards: [],
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
        setState(DEFAULT_STATE);
        localStorage.removeItem(STORAGE_KEY);
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

    function handleEndFight() {
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

                        {/* HP */}
                        <div className="mb-3 fs-4 fw-bold text-center">
                            {t('monsterFight.fightHpLabel')}: {state.fightHp}
                        </div>

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
                                <div className="mb-1 fw-semibold">{t('monsterFight.deckLabel')} ({state.fightDeck.length})</div>
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

                        {/* End fight button */}
                        <div className="text-center mb-4">
                            <Button variant="danger" onClick={handleEndFight}>
                                {t('monsterFight.endFightBtn')}
                            </Button>
                        </div>

                    </Col>
                </Row>

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

                    {/* Monster card image + HP */}
                    {selectedMonster && (
                        <>
                            <div className="text-center mb-3">
                                <Image
                                    src={monsterCardImages[selectedMonster.name_pl + ':front']}
                                    fluid
                                    style={{ maxWidth: '300px', cursor: 'zoom-in' }}
                                    alt={selectedMonster.name_pl}
                                    rounded
                                    onClick={() => setEnlargedImage(monsterCardImages[selectedMonster.name_pl + ':front'])}
                                />
                            </div>

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
