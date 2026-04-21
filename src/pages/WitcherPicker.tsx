import { useState, useEffect } from "react";
import { Alert, Badge, Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import { shuffle } from "../util/generic";

interface PlayerResult {
    name: string;
    school: string;
    schoolKey: string;
    startsFirst: boolean;
}

interface WitcherPickerSavedState {
    numPlayers: number;
    playerNames: string[];
    results: PlayerResult[] | null;
    ciriEnabled: boolean;
    trackPositions: Record<string, number>;
}

const STORAGE_KEY = "witcherPicker_state";
const BASE_SCHOOL_KEYS = ["Wolf", "Bear", "Cat", "Viper", "Griffin", "Manticore"];

const schoolImages: Record<string, string> = {
    Wolf: require("../img/witcher_schools_back/witcherTrophyWolfBack.jpg"),
    Bear: require("../img/witcher_schools_back/witcherTrophyBearBack.jpg"),
    Cat: require("../img/witcher_schools_back/witcherTrophyCatBack.jpg"),
    Viper: require("../img/witcher_schools_back/witcherTrophyViperBack.jpg"),
    Griffin: require("../img/witcher_schools_back/witcherTrophyGriffinBack.jpg"),
    Manticore: require("../img/witcher_schools_back/witcherTrophyManticoreBack.jpg"),
    Ciri: require("../img/witcher_schools_back/witcherTrophyCiriBack.jpg"),
};

const torImg: string = require("../img/witcher_schools_back/tor.png");

const DEFAULT_STATE: WitcherPickerSavedState = {
    numPlayers: 2,
    playerNames: ["", ""],
    results: null,
    ciriEnabled: false,
    trackPositions: {},
};

function loadState(): WitcherPickerSavedState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved) as WitcherPickerSavedState;
    } catch {}
    return DEFAULT_STATE;
}

function saveState(state: WitcherPickerSavedState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
}

const TRACK_POSITIONS = 5;
const TRACK_HEIGHT = 480;
// Circle center positions as % from top of image (circle 5=top … circle 1=bottom)
const CIRCLE_TOPS_PCT = [20, 36, 52, 72, 88];

export default function WitcherPicker({ t }) {
    const [appState, setAppState] = useState<WitcherPickerSavedState>(loadState);
    const [errors, setErrors] = useState<string[]>([]);

    const { numPlayers, playerNames, results, ciriEnabled, trackPositions } = appState;

    const schools: string[] = t("witcherPicker.schools", { returnObjects: true });
    const schoolOptions = [
        ...BASE_SCHOOL_KEYS.map((key, i) => ({ key, name: schools[i] })),
        ...(ciriEnabled ? [{ key: "Ciri", name: t("witcherPicker.ciri") }] : []),
    ];

    useEffect(() => {
        saveState(appState);
    }, [appState]);

    const handleNumPlayersChange = (n: number) => {
        setAppState(prev => ({
            ...prev,
            numPlayers: n,
            playerNames: prev.playerNames.slice(0, n).concat(
                Array(Math.max(0, n - prev.playerNames.length)).fill("")
            ),
            results: null,
        }));
        setErrors([]);
    };

    const handleNameChange = (index: number, value: string) => {
        setAppState(prev => ({
            ...prev,
            playerNames: prev.playerNames.map((name, i) => i === index ? value : name),
        }));
        setErrors([]);
    };

    const handleCiriChange = (enabled: boolean) => {
        setAppState(prev => ({ ...prev, ciriEnabled: enabled }));
    };

    const handleSubmit = () => {
        const newErrors: string[] = [];
        playerNames.forEach((name, i) => {
            if (!name.trim()) newErrors.push(t("witcherPicker.errorEmptyName", { player: i + 1 }));
        });
        if (newErrors.length > 0) { setErrors(newErrors); return; }

        const shuffled = shuffle([...schoolOptions]);
        const picked = shuffled.slice(0, numPlayers);
        const startingIndex = Math.floor(Math.random() * numPlayers);

        const newResults: PlayerResult[] = playerNames.map((name, i) => ({
            name: name.trim(),
            school: picked[i].name,
            schoolKey: picked[i].key,
            startsFirst: i === startingIndex,
        }));

        const initPositions: Record<string, number> = {};
        newResults.forEach(r => { initPositions[r.name] = 0; });

        setAppState(prev => ({ ...prev, results: newResults, trackPositions: initPositions }));
        setErrors([]);
    };

    const handleSchoolChange = (playerIndex: number, schoolKey: string) => {
        const opt = schoolOptions.find(o => o.key === schoolKey);
        if (!opt || !results) return;
        setAppState(prev => ({
            ...prev,
            results: prev.results
                ? prev.results.map((r, i) =>
                    i === playerIndex ? { ...r, school: opt.name, schoolKey: opt.key } : r
                )
                : null,
        }));
    };

    const handleRollAgain = () => {
        setAppState(prev => ({ ...prev, results: null, trackPositions: {} }));
        setErrors([]);
    };

    const handleFullReset = () => {
        setAppState(DEFAULT_STATE);
        setErrors([]);
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    };

    const moveUp = (name: string) => {
        setAppState(prev => {
            const cur = prev.trackPositions[name] ?? 0;
            if (cur >= TRACK_POSITIONS - 1) return prev;
            return { ...prev, trackPositions: { ...prev.trackPositions, [name]: cur + 1 } };
        });
    };

    const moveDown = (name: string) => {
        setAppState(prev => {
            const cur = prev.trackPositions[name] ?? 0;
            if (cur <= 0) return prev;
            return { ...prev, trackPositions: { ...prev.trackPositions, [name]: cur - 1 } };
        });
    };

    return (
        <Container id="WitcherPicker">
            <PageTitle HeaderText={t("witcherPicker.title")} />

            {/* Victory Track — always visible at the top */}
            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6}>
                    <div style={{ position: "relative", height: TRACK_HEIGHT, display: "inline-flex" }}>
                        <img
                            src={torImg}
                            alt="Victory Track"
                            style={{ height: TRACK_HEIGHT, width: "auto" }}
                        />
                        {/* Icons positioned absolutely at circle centers */}
                        <div style={{ position: "absolute", top: 0, left: "100%", height: TRACK_HEIGHT, paddingLeft: 8 }}>
                            {Array.from({ length: TRACK_POSITIONS }, (_, i) => TRACK_POSITIONS - 1 - i).map((posIndex, displayIndex) => {
                                const topPct = CIRCLE_TOPS_PCT[displayIndex];
                                const activeResults = results ?? [];
                                const playersHere = activeResults.filter(r => (trackPositions[r.name] ?? 0) === posIndex);
                                return (
                                    <div
                                        key={posIndex}
                                        style={{
                                            position: "absolute",
                                            top: `${topPct}%`,
                                            left: 8,
                                            transform: "translateY(-50%)",
                                            display: "flex",
                                            gap: 4,
                                        }}
                                    >
                                        {playersHere.map(r => (
                                            <div
                                                key={r.name}
                                                className="d-flex flex-column align-items-center"
                                                style={{ gap: 0 }}
                                            >
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    style={{ padding: "0 2px", lineHeight: 1, fontSize: "0.75rem" }}
                                                    disabled={posIndex >= TRACK_POSITIONS - 1}
                                                    onClick={() => moveUp(r.name)}
                                                >▲</Button>
                                                <img
                                                    src={schoolImages[r.schoolKey]}
                                                    alt={r.school}
                                                    title={r.name}
                                                    style={{ width: 36, height: 36, borderRadius: 4, objectFit: "cover" }}
                                                />
                                                <div style={{
                                                    fontSize: "0.55rem",
                                                    maxWidth: 40,
                                                    textAlign: "center",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    {r.name}
                                                </div>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    style={{ padding: "0 2px", lineHeight: 1, fontSize: "0.75rem" }}
                                                    disabled={posIndex <= 0}
                                                    onClick={() => moveDown(r.name)}
                                                >▼</Button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><strong>{t("witcherPicker.numPlayersLabel")}</strong></Form.Label>
                            <div className="d-flex gap-2">
                                {[2, 3, 4, 5].map(n => (
                                    <Button
                                        key={n}
                                        variant={numPlayers === n ? "secondary" : "outline-secondary"}
                                        onClick={() => handleNumPlayersChange(n)}
                                        style={{ width: 48 }}
                                    >
                                        {n}
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>

                        {playerNames.map((name, i) => (
                            <Form.Group className="mb-2" key={i}>
                                <Form.Label>{t("witcherPicker.playerNameLabel", { player: i + 1 })}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t("witcherPicker.playerNamePlaceholder", { player: i + 1 })}
                                    value={name}
                                    onChange={e => handleNameChange(i, e.target.value)}
                                    isInvalid={errors.some(err => err.includes(String(i + 1)))}
                                />
                            </Form.Group>
                        ))}

                        <Form.Check
                            className="mt-3"
                            type="checkbox"
                            id="ciri-checkbox"
                            label={t("witcherPicker.ciriLabel")}
                            checked={ciriEnabled}
                            onChange={e => handleCiriChange(e.target.checked)}
                        />

                        {errors.length > 0 && (
                            <Alert variant="danger" className="mt-2">
                                <ul className="mb-0">
                                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </Alert>
                        )}

                        <Button
                            variant="secondary"
                            size="lg"
                            className="mt-3 w-100"
                            onClick={handleSubmit}
                        >
                            {t("witcherPicker.rollButton")}
                        </Button>
                    </Form>
                </Col>
            </Row>

            {results && (
                <Row className="justify-content-center mb-4">
                    <Col xs={12} md={8} lg={6}>
                        <h4 className="text-center mb-3">{t("witcherPicker.resultsTitle")}</h4>
                        <ListGroup>
                            {results.map((result, i) => (
                                <ListGroup.Item
                                    key={i}
                                    variant={result.startsFirst ? "warning" : undefined}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={schoolImages[result.schoolKey]}
                                                alt={result.school}
                                                style={{ width: 44, height: 44, borderRadius: 4, objectFit: "cover" }}
                                            />
                                            <div>
                                                <strong>{result.name}</strong>
                                                <div className="text-muted small">{result.school}</div>
                                            </div>
                                        </div>
                                        {result.startsFirst && (
                                            <Badge bg="dark">{t("witcherPicker.startsFirst")}</Badge>
                                        )}
                                    </div>
                                    <Form.Select
                                        size="sm"
                                        value={result.schoolKey}
                                        onChange={e => handleSchoolChange(i, e.target.value)}
                                    >
                                        {schoolOptions.map(opt => (
                                            <option key={opt.key} value={opt.key}>{opt.name}</option>
                                        ))}
                                    </Form.Select>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Button
                            variant="outline-secondary"
                            className="mt-3 w-100"
                            onClick={handleRollAgain}
                        >
                            {t("witcherPicker.resetButton")}
                        </Button>
                    </Col>
                </Row>
            )}

            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6}>
                    <Button variant="danger" className="w-100" onClick={handleFullReset}>
                        {t("witcherPicker.fullResetButton")}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
