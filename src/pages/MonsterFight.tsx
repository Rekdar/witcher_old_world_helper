import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
import monstersData from '../monsters.json';

interface Monster {
    name_pl: string;
    level: number;
    base_heal: number;
    front_name: string;
    back_name: string;
}

interface MonsterFightState {
    selectedMonsterName: string | null;
    monsterTrail: boolean;
    currentHp: number | null;
    hasWeaknessTokens: boolean;
    selectedTokens: string[];
}

const STORAGE_KEY = 'monsterFight_state';

const DEFAULT_STATE: MonsterFightState = {
    selectedMonsterName: null,
    monsterTrail: false,
    currentHp: null,
    hasWeaknessTokens: false,
    selectedTokens: [],
};

function loadState(): MonsterFightState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) as MonsterFightState : DEFAULT_STATE;
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

// Pre-load all images at module level (webpack-friendly)
const monsterCardImages: Record<string, string> = Object.fromEntries(
    monsters.map(m => [m.name_pl, require(`../img/monsters_full_cards/${m.front_name}.jpg`)])
);

const tokenImages: Record<string, string> = Object.fromEntries(
    SELECTABLE_TOKENS.map(token => [token, require(`../img/tokens/weaknessTokens/${token}.jpg`)])
);

const monsterTrailImg: string = require('../img/expansionHeaders/monsterTrail.png');

export default function MonsterFight({ t }): JSX.Element {
    const [state, setState] = useState<MonsterFightState>(loadState);

    const selectedMonster = monsters.find(m => m.name_pl === state.selectedMonsterName) ?? null;

    useEffect(() => {
        saveState(state);
    }, [state]);

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
                    ? s.selectedTokens.filter(t => t !== token)
                    : [...s.selectedTokens, token],
            };
        });
    }

    function handleReset() {
        setState(DEFAULT_STATE);
        localStorage.removeItem(STORAGE_KEY);
    }

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

                    {/* Monster card image + HP — visible after selecting a monster */}
                    {selectedMonster && (
                        <>
                            <div className="text-center mb-3">
                                <Image
                                    src={monsterCardImages[selectedMonster.name_pl]}
                                    fluid
                                    style={{ maxWidth: '300px' }}
                                    alt={selectedMonster.name_pl}
                                    rounded
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

                    {/* Token selection grid — visible when checkbox is checked */}
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
                            onClick={() => saveState(state)}
                        >
                            {t('monsterFight.startFightBtn')}
                        </Button>
                        <Button variant="outline-secondary" onClick={handleReset}>
                            {t('monsterFight.resetBtn')}
                        </Button>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}
