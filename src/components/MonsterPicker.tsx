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

function makeCardDecks(): CardDecks {
    return {
        1: shuffle([...cardsByLevel[1]]),
        2: shuffle([...cardsByLevel[2]]),
        3: shuffle([...cardsByLevel[3]]),
    };
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
    const [expansions, setExpansions] = useState(new Array(expansionsNames.length).fill(false));
    const [cardDecks, setCardDecks] = useState<CardDecks>(makeCardDecks);
    const [displayed, setDisplayed] = useState<Displayed>(null);
    const [enlargedCard, setEnlargedCard] = useState<string | null>(null);

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
        </Container>
    );
}
