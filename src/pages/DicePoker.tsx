import { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import PageTitle from "../components/PageTitle";

const pokerImg = require('../img/poker.png') as string;
const pokerWildHuntImg = require('../img/wild_hunt/poker_wild_hunt.png') as string;
const wildHuntHeaderImg = require('../img/expansionHeaders/wildHunt.png') as string;

const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

interface DiceState {
    dice: number[];
    selected: boolean[];
    phase: 'initial' | 'rolled' | 'rerolled';
}

function initialDiceState(): DiceState {
    return { dice: [0, 0, 0, 0, 0], selected: [false, false, false, false, false], phase: 'initial' };
}

function rollFive(): number[] {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

function evaluateHand(dice: number[]): string {
    const counts: Record<number, number> = {};
    for (const d of dice) counts[d] = (counts[d] || 0) + 1;
    const vals = Object.values(counts).sort((a, b) => b - a);
    const sorted = [...dice].sort((a, b) => a - b);
    const isStraight = (arr: number[], target: number[]) =>
        arr.every((v, i) => v === target[i]);
    if (vals[0] === 5) return 'Poker';
    if (vals[0] === 4) return 'Kareta';
    if (vals[0] === 3 && vals[1] === 2) return 'Full';
    if (isStraight(sorted, [1, 2, 3, 4, 5])) return 'Mały strit';
    if (isStraight(sorted, [2, 3, 4, 5, 6])) return 'Duży strit';
    if (vals[0] === 3) return 'Trójka';
    if (vals[0] === 2 && vals[1] === 2) return 'Dwie pary';
    if (vals[0] === 2) return 'Para';
    return 'Wysoka karta';
}

interface DiceSectionProps {
    label: string;
    state: DiceState;
    onRoll: () => void;
    onToggle: (i: number) => void;
    onReroll: () => void;
    onMove: (i: number, dir: -1 | 1) => void;
}

function DiceSection({ label, state, onRoll, onToggle, onReroll, onMove }: DiceSectionProps) {
    const { dice, selected, phase } = state;
    const canReroll = phase === 'rolled' && selected.some(Boolean);
    const hand = phase !== 'initial' ? evaluateHand(dice) : null;
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title as="h5">{label}</Card.Title>
                {phase === 'initial' && (
                    <Button variant="secondary" onClick={onRoll}>Rzuć kośćmi</Button>
                )}
                {phase !== 'initial' && (
                    <>
                        <div className="d-flex gap-3 flex-wrap mb-3">
                            {dice.map((val, i) => (
                                <div key={i} className="d-flex flex-column align-items-center" style={{ gap: '4px' }}>
                                    <div className="d-flex gap-1">
                                        <button
                                            onClick={() => onMove(i, -1)}
                                            disabled={i === 0}
                                            style={{ fontSize: '0.8rem', padding: '1px 6px', lineHeight: 1.4, border: '1px solid #ccc', borderRadius: '4px', background: '#f8f9fa', cursor: i === 0 ? 'default' : 'pointer' }}
                                            title="Przesuń w lewo"
                                        >◀</button>
                                        <button
                                            onClick={() => onMove(i, 1)}
                                            disabled={i === dice.length - 1}
                                            style={{ fontSize: '0.8rem', padding: '1px 6px', lineHeight: 1.4, border: '1px solid #ccc', borderRadius: '4px', background: '#f8f9fa', cursor: i === dice.length - 1 ? 'default' : 'pointer' }}
                                            title="Przesuń w prawo"
                                        >▶</button>
                                    </div>
                                    <div
                                        onClick={phase === 'rolled' ? () => onToggle(i) : undefined}
                                        style={{
                                            fontSize: '8.4rem',
                                            lineHeight: 1,
                                            cursor: phase === 'rolled' ? 'pointer' : 'default',
                                            border: selected[i] ? '4px solid #dc3545' : '4px solid transparent',
                                            borderRadius: '10px',
                                            padding: '4px 6px',
                                            background: selected[i] ? '#fff5f5' : 'transparent',
                                            userSelect: 'none',
                                        }}
                                        title={phase === 'rolled' ? (selected[i] ? 'Odznacz' : 'Zaznacz do przerzutu') : undefined}
                                    >
                                        {DICE_FACES[val]}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-3">
                            <span className="fw-semibold">Układ: </span>
                            <span className="text-primary fs-5">{hand}</span>
                        </div>
                        {phase === 'rolled' && (
                            <div className="d-flex gap-2 flex-wrap">
                                <Button variant="secondary" onClick={onRoll}>Rzuć kośćmi</Button>
                                <Button variant="danger" onClick={onReroll} disabled={!canReroll}>
                                    Przerzuć zaznaczone ({selected.filter(Boolean).length})
                                </Button>
                            </div>
                        )}
                        {phase === 'rerolled' && (
                            <p className="text-muted mb-0"><em>Przerzut wykonany.</em></p>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

export default function DicePoker({ t }): JSX.Element {
    const [enlarged, setEnlarged] = useState(false);
    const [wildHuntMode, setWildHuntMode] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [whiteDice, setWhiteDice] = useState<DiceState>(initialDiceState);
    const [blackDice, setBlackDice] = useState<DiceState>(initialDiceState);

    useEffect(() => {
        const audio = new Audio(require('../music/poker.mp3'));
        audio.loop = true;
        audioRef.current = audio;
        return () => { audio.pause(); };
    }, []);

    function makeHandlers(setState: React.Dispatch<React.SetStateAction<DiceState>>) {
        return {
            onRoll: () => setState({ dice: rollFive(), selected: [false, false, false, false, false], phase: 'rolled' }),
            onToggle: (i: number) => setState(prev => {
                const selected = [...prev.selected];
                selected[i] = !selected[i];
                return { ...prev, selected };
            }),
            onReroll: () => setState(prev => {
                const dice = prev.dice.map((v, i) => prev.selected[i] ? Math.floor(Math.random() * 6) + 1 : v);
                return { dice, selected: [false, false, false, false, false], phase: 'rerolled' };
            }),
            onMove: (i: number, dir: -1 | 1) => setState(prev => {
                const j = i + dir;
                if (j < 0 || j >= prev.dice.length) return prev;
                const dice = [...prev.dice];
                const selected = [...prev.selected];
                [dice[i], dice[j]] = [dice[j], dice[i]];
                [selected[i], selected[j]] = [selected[j], selected[i]];
                return { ...prev, dice, selected };
            }),
        };
    }

    const whiteHandlers = makeHandlers(setWhiteDice);
    const blackHandlers = makeHandlers(setBlackDice);

    function handleMusicToggle() {
        if (!audioRef.current) return;
        if (musicPlaying) {
            audioRef.current.pause();
        } else {
            void audioRef.current.play();
        }
        setMusicPlaying(m => !m);
    }

    return (
        <Container id="DicePoker">
            <PageTitle HeaderText={t("dicePoker.title")} />

            <Row className="justify-content-center mb-4">
                <Col xs={12} md={10} lg={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title as="h5">Zasady gry</Card.Title>
                            <p className="text-muted mb-2">
                                Gracz wybiera wiedźmina na tym samym obszarze. Wybrany wiedźmin nie może odmówić.
                                Oboje muszą mieć minimum 1 żeton złota.
                            </p>
                            <ol className="mb-0">
                                <li className="mb-1">Każdy gracz wkłada 1 żeton złota do wspólnej puli. Bank dokłada 1 żeton — łącznie 3 żetony.</li>
                                <li className="mb-1">Każdy gracz bierze zestaw 5 kości i rzucają jednocześnie.</li>
                                <li className="mb-1">Nieaktywny gracz może raz przerzucić wybrane kości.</li>
                                <li className="mb-1">Aktywny gracz też może raz przerzucić wybrane kości.</li>
                                <li className="mb-1">
                                    Gracze porównują układy — wygrywa lepszy układ. Przy tym samym układzie wygrywa ten
                                    z wyższymi wartościami (por. objaśnienia poniżej). Przy identycznych wynikach wygrywa aktywny gracz.
                                </li>
                            </ol>
                        </Card.Body>
                    </Card>

                    <div className="text-center mb-4">
                        <Form.Check
                            type="switch"
                            id="wildHuntPokerSwitch"
                            className="d-inline-flex align-items-center gap-2 mb-3"
                            checked={wildHuntMode}
                            onChange={e => setWildHuntMode(e.target.checked)}
                            label={
                                <span className="d-inline-flex align-items-center gap-2">
                                    Dodatek
                                    <Image src={wildHuntHeaderImg} height={28} alt="Dziki Gon" />
                                </span>
                            }
                        />
                        <div>
                            <p className="text-muted mb-2"><em>Kliknij obrazek, aby powiększyć</em></p>
                            <Image
                                src={wildHuntMode ? pokerWildHuntImg : pokerImg}
                                fluid
                                style={{ maxHeight: 340, cursor: 'zoom-in' }}
                                onClick={() => setEnlarged(true)}
                            />
                        </div>
                    </div>

                    <Card>
                        <Card.Body>
                            <Card.Title as="h5">Objaśnienia</Card.Title>

                            <p><strong>Przerzut.</strong> Gracz wybiera dowolną liczbę swoich kości i nimi rzuca. Musi przyjąć nowe wartości.</p>

                            <p><strong>Aktywny gracz.</strong> Gracz, który zainicjował akcję (aktualnie rozgrywa swoją turę).</p>

                            <p>
                                <strong>Dwie pary.</strong> Porównuje się najpierw wyższą parę, potem niższą.
                                Np. para 6 + para 1 wygrywa z parą 5 + parą 4, bo 6 &gt; 5.
                            </p>

                            <p>
                                <strong>Strit.</strong> Liczy się najwyższa kość w układzie.
                                2-3-4-5-6 wygrywa z 1-2-3-4-5, bo najwyższa kość to 6 vs 5.
                            </p>

                            <p className="mb-0">
                                <strong>Full.</strong> Najpierw porównuje się 3 jednakowe kości, a jeśli remis się utrzymuje —
                                2 pozostałe jednakowe kości.
                            </p>
                        </Card.Body>
                    </Card>
                    <hr className="my-4" />

                    <h5 className="mb-3">Rzut kośćmi</h5>
                    <DiceSection
                        label="Białe kości"
                        state={whiteDice}
                        {...whiteHandlers}
                    />
                    <DiceSection
                        label="Czarne kości"
                        state={blackDice}
                        {...blackHandlers}
                    />
                    <div className="text-center mt-2">
                        <Button variant="outline-secondary" onClick={() => {
                            setWhiteDice(initialDiceState());
                            setBlackDice(initialDiceState());
                        }}>
                            Reset rzutów
                        </Button>
                    </div>
                </Col>
            </Row>

            <Modal show={enlarged} onHide={() => setEnlarged(false)} centered size="xl">
                <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                    <Image
                        src={wildHuntMode ? pokerWildHuntImg : pokerImg}
                        style={{ maxWidth: '100%', maxHeight: '90vh', cursor: 'zoom-out' }}
                        onClick={() => setEnlarged(false)}
                    />
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
