import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Image, Modal } from "react-bootstrap";
import MonstersDeck, { legendaryMonster, levelOneMonster, levelTwoMonster, levelThreeMonster } from "../classes/monsters";
import PageTitle from './PageTitle';
import monstersData from '../monsters.json';
import { shuffle } from '../util/generic';
import "../css/MonsterPicker.css";

interface MonsterCard {
    name_pl: string;
    level: number;
    front_name: string;
}

type Displayed =
    | { kind: 'card'; card: MonsterCard }
    | { kind: 'token'; token: levelOneMonster | levelTwoMonster | levelThreeMonster | legendaryMonster }
    | null;

const cardFrontImages: Record<string, string> = Object.fromEntries(
    monstersData.map(m => [m.front_name, require(`../img/monsters_full_cards/${m.front_name}.jpg`) as string])
);

const cardsByLevel: Record<number, MonsterCard[]> = {
    1: monstersData.filter(m => m.level === 1),
    2: monstersData.filter(m => m.level === 2),
    3: monstersData.filter(m => m.level === 3),
};

type CardDecks = { 1: MonsterCard[]; 2: MonsterCard[]; 3: MonsterCard[] };

const DRAW_ALL_DISTRIBUTION: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [1, 2, 3, 3],
    3: [1, 2, 2, 3, 3],
    4: [2, 2, 1, 3, 3],
    5: [1, 2, 2, 2, 3, 3],
};

function readWitcherPickerPlayerCount(): number {
    try {
        const raw = localStorage.getItem('witcherPicker_state');
        if (!raw) return 2;
        const parsed = JSON.parse(raw) as { numPlayers?: number };
        return Math.min(5, Math.max(1, parsed.numPlayers ?? 2));
    } catch { return 2; }
}

function makeCardDecks(): CardDecks {
    return {
        1: shuffle([...cardsByLevel[1]]),
        2: shuffle([...cardsByLevel[2]]),
        3: shuffle([...cardsByLevel[3]]),
    };
}

const EXPANSIONS_KEY = 'monsterPicker_expansions';

function loadExpansions(length: number): boolean[] {
    try {
        const raw = localStorage.getItem(EXPANSIONS_KEY);
        if (!raw) return new Array(length).fill(false);
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === length) return parsed;
        return new Array(length).fill(false);
    } catch { return new Array(length).fill(false); }
}

export default function MonsterPicker({
    HeaderText = "Randomly draw a token",
    t
}: {
    HeaderText: string;
    t;
}) {
    const expansionsNames = ["legendaryHunt", "wildHunt", "monsterPack", "mountedEredin"];
    const [localMonsterDeck, setLocalMonsterDeck] = useState(new MonstersDeck());
    const [expansions, setExpansions] = useState(() => loadExpansions(expansionsNames.length));
    const [cardDecks, setCardDecks] = useState<CardDecks>(makeCardDecks);
    const [displayed, setDisplayed] = useState<Displayed>(null);
    const [enlargedCard, setEnlargedCard] = useState<string | null>(null);
    const [showDrawAllModal, setShowDrawAllModal] = useState(false);
    const [drawAllPlayerCount, setDrawAllPlayerCount] = useState(2);
    const [drawAllResults, setDrawAllResults] = useState<{ name_pl: string; level: number }[] | null>(null);

    // Card mode for I/II/III: no expansions OR only Wild Hunt checked
    const useCardMode = !expansions[0] && !expansions[2] && !expansions[3];

    const handleToggleExpansions = (position: number) => {
        let updatedExpansions = expansions.map((item, index) => index === position ? !item : item);
        if (position === 0 && !expansions[0] && expansions[1]) {
            updatedExpansions = updatedExpansions.map((item, index) => index === 1 ? !item : item);
        } else if (position === 1 && !expansions[1] && expansions[0]) {
            updatedExpansions = updatedExpansions.map((item, index) => index === 0 ? !item : item);
        }
        setExpansions(updatedExpansions);
        localStorage.setItem(EXPANSIONS_KEY, JSON.stringify(updatedExpansions));
    };

    useEffect(() => {
        setLocalMonsterDeck(new MonstersDeck(...expansions));
        setDisplayed(null);
        setCardDecks(makeCardDecks());
    }, [expansions]);

    function drawCard(level: 1 | 2 | 3) {
        setCardDecks(prev => {
            let deck = [...prev[level]];
            if (deck.length === 0) deck = shuffle([...cardsByLevel[level]]);
            const [card, ...rest] = deck;
            setDisplayed({ kind: 'card', card });
            return { ...prev, [level]: rest };
        });
    }

    function drawToken(draw: () => levelOneMonster | levelTwoMonster | levelThreeMonster | legendaryMonster) {
        setDisplayed({ kind: 'token', token: draw() });
    }

    function handleDrawAll() {
        const distribution = DRAW_ALL_DISTRIBUTION[drawAllPlayerCount];
        if (!distribution) return;

        const needed: Record<number, number> = {};
        for (const lvl of distribution) {
            needed[lvl] = (needed[lvl] ?? 0) + 1;
        }

        const picked: Record<number, MonsterCard[]> = {};
        for (const lvl of [1, 2, 3]) {
            if (!needed[lvl]) continue;
            const pool = shuffle([...cardsByLevel[lvl]]);
            picked[lvl] = pool.slice(0, needed[lvl]);
        }

        const levelIndex: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
        const results = distribution.map(lvl => {
            const card = picked[lvl]![levelIndex[lvl]!];
            levelIndex[lvl]!++;
            return { name_pl: card.name_pl, level: card.level };
        });

        setDrawAllResults(results);
    }

    return (
        <Container fluid className="mx-auto min-h-screen">
            <PageTitle HeaderText={HeaderText} />
            <Row id='tokensRow' className='py-2'>
                <Col className='justify-content-center'>
                    {displayed?.kind === 'card' && (
                        <div className="d-flex flex-column align-items-center gap-2">
                            <h4>{displayed.card.name_pl}</h4>
                            <Image
                                src={cardFrontImages[displayed.card.front_name]}
                                alt={displayed.card.name_pl}
                                style={{ maxHeight: 420, cursor: 'zoom-in' }}
                                fluid
                                rounded
                                onClick={() => setEnlargedCard(cardFrontImages[displayed.card.front_name])}
                            />
                        </div>
                    )}
                    {displayed?.kind === 'token' && displayed.token.tokenImg(t)}
                </Col>
            </Row>
            <Row id='MonsterButtons' className='justify-content-center px-1 py-2 mb-4'>
                <Col xs="auto" className='p-1'>
                    <Button variant="secondary" size="lg" style={{ width: 75 }}
                        onClick={() => useCardMode ? drawCard(1) : drawToken(() => localMonsterDeck.drawLevelOneMonster())}
                    >
                        I
                    </Button>
                </Col>
                <Col xs="auto" className='p-1'>
                    <Button variant="warning" size="lg" style={{ width: 75 }}
                        onClick={() => useCardMode ? drawCard(2) : drawToken(() => localMonsterDeck.drawLevelTwoMonster())}
                    >
                        II
                    </Button>
                </Col>
                <Col xs="auto" className='p-1'>
                    <Button variant="danger" size="lg" style={{ width: 75 }}
                        onClick={() => useCardMode ? drawCard(3) : drawToken(() => localMonsterDeck.drawLevelThreeMonster())}
                    >
                        III
                    </Button>
                </Col>
                {expansions[0] || expansions[1] ?
                    <Col xs="auto" className='p-1'>
                        <Button
                            size="lg"
                            variant="custom"
                            style={{
                                backgroundColor: "#960a0a",
                                color: "#ffffff",
                            }}
                            onClick={() => drawToken(() => localMonsterDeck.drawLegendaryMonster())}
                        >
                            {expansions[0] ? t("monsterPicker.legendary") : t("exps.wildHunt")}
                        </Button>
                    </Col>
                    : <></>}
                {expansions[1] && (
                    <Col xs="auto" className='p-1'>
                        <Button
                            size="lg"
                            variant="custom"
                            style={{
                                backgroundColor: "#960a0a",
                                color: "#ffffff",
                            }}
                            onClick={() => {
                                setDrawAllPlayerCount(readWitcherPickerPlayerCount());
                                setDrawAllResults(null);
                                setShowDrawAllModal(true);
                            }}
                        >
                            {t("monsterPicker.drawAll")}
                        </Button>
                    </Col>
                )}
            </Row>
            <Row id='expansionToggleRow' className='justify-content-center p-2'>
                {expansionsNames.map((name, index) => (
                    <Form.Switch
                        checked={expansions[index]}
                        onChange={() => handleToggleExpansions(index)}
                        id={t(`exps.${name}`)}
                        label={t(`exps.${name}`)}
                        key={name}
                    />
                ))}
            </Row>
            <Row className='justify-content-center p-2 m-4' id="ToggleTooltip">
                <Col className='mx-3' style={{ maxWidth: "550px" }}>
                    <strong className="fw-light text-center">{t("monsterPicker.toggle")}</strong>
                    <ul className='fw-lighter'>
                        <li>{t("exps.legendaryHunt") + ": " + t("monsters.legendaryHunt", { joinArrays: ', ' }) + " (" + t("monsterPicker.allLegendary") + ")"}</li>
                        <li>{t("exps.wildHunt")}: {t("monsters.Eredin")}, {t("monsters.Nithral")}, {t("monsters.Imlerith")}, {t("monsters.Caranthir")} ({t("monsterPicker.allLegendary")})</li>
                        <li>{t("exps.monsterPack")}: {t("monsters.Koshchey")} ({t("monsters.lvl3")}), {t("monsters.Kayran")} ({t("monsterPicker.legendary")}). {t("monsterPicker.sirenExplain")}.
                        </li>
                        <li>{t("exps.mountedEredin")}: {t("exps.mountedEredin")} ({t("monsters.lvl3")})</li>
                    </ul>
                </Col>
            </Row>

            <Modal show={enlargedCard !== null} onHide={() => setEnlargedCard(null)} size="lg" centered>
                <Modal.Body className='text-center p-2' onClick={() => setEnlargedCard(null)} style={{ cursor: 'zoom-out' }}>
                    {enlargedCard && <Image src={enlargedCard} fluid rounded style={{ maxHeight: '85vh' }} />}
                </Modal.Body>
            </Modal>

            <Modal show={showDrawAllModal} onHide={() => setShowDrawAllModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t("monsterPicker.drawAllModalTitle")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {drawAllResults === null ? (
                        <Form.Group className="mb-3">
                            <Form.Label>{t("monsterPicker.numPlayersLabel")}</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                max={5}
                                value={drawAllPlayerCount}
                                onChange={e => {
                                    const v = Math.min(5, Math.max(1, Number(e.target.value) || 1));
                                    setDrawAllPlayerCount(v);
                                }}
                            />
                        </Form.Group>
                    ) : (
                        <>
                            <h5>{t("monsterPicker.drawAllResultTitle")}</h5>
                            <ol>
                                {drawAllResults.map((m, i) => (
                                    <li key={i}>
                                        {m.name_pl} ({t("monsterPicker.level")}{m.level})
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {drawAllResults === null ? (
                        <>
                            <Button variant="secondary" onClick={() => setShowDrawAllModal(false)}>
                                {t("monsterPicker.drawAllCancel")}
                            </Button>
                            <Button
                                variant="custom"
                                style={{ backgroundColor: "#960a0a", color: "#ffffff" }}
                                onClick={handleDrawAll}
                            >
                                {t("monsterPicker.drawAllConfirm")}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="custom"
                                style={{ backgroundColor: "#960a0a", color: "#ffffff" }}
                                onClick={() => setDrawAllResults(null)}
                            >
                                {t("monsterPicker.drawAllAgain")}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowDrawAllModal(false)}>
                                {t("monsterPicker.drawAllClose")}
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
