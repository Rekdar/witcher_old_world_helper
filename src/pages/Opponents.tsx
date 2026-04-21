import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import { shuffle } from "../util/generic";
import "../css/Opponents.css";

const WILD_HUNT_STORAGE_KEY = "opponents_wildHunt_players";

function loadWildHuntPlayers(): string[] | null {
    try {
        const raw = localStorage.getItem(WILD_HUNT_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as string[]) : null;
    } catch {
        return null;
    }
}

function saveWildHuntPlayers(players: string[]): void {
    localStorage.setItem(WILD_HUNT_STORAGE_KEY, JSON.stringify(players));
}

export default function Opponents({ t }): JSX.Element {
    const [savedPlayers, setSavedPlayers] = useState<string[] | null>(loadWildHuntPlayers);
    const [isEditing, setIsEditing] = useState(false);
    const [numPlayers, setNumPlayers] = useState(2);
    const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [wildHuntResult, setWildHuntResult] = useState<string | null>(null);
    const [wildHuntDrawKey, setWildHuntDrawKey] = useState(0);

    const handleNumPlayersChange = (n: number) => {
        setNumPlayers(n);
        setPlayerNames(prev => {
            const updated = [...prev];
            while (updated.length < n) updated.push("");
            return updated.slice(0, n);
        });
        setFormErrors([]);
    };

    const handleNameChange = (index: number, value: string) => {
        setPlayerNames(prev => prev.map((name, i) => i === index ? value : name));
        setFormErrors([]);
    };

    const handleSavePlayers = () => {
        const newErrors: string[] = [];
        playerNames.forEach((name, i) => {
            if (!name.trim()) {
                newErrors.push(t("opponents.errorEmptyName", { player: i + 1 }));
            }
        });
        if (newErrors.length > 0) {
            setFormErrors(newErrors);
            return;
        }
        const trimmed = playerNames.map(n => n.trim());
        saveWildHuntPlayers(trimmed);
        setSavedPlayers(trimmed);
        setIsEditing(false);
        setFormErrors([]);
        setWildHuntResult(null);
    };

    const handleEditPlayers = () => {
        if (savedPlayers) {
            setNumPlayers(savedPlayers.length);
            setPlayerNames([...savedPlayers]);
        }
        setIsEditing(true);
        setWildHuntResult(null);
        setFormErrors([]);
    };

    const handleWildHuntDraw = () => {
        if (!savedPlayers) return;
        const pool = [...savedPlayers, t("opponents.playerChooses")];
        setWildHuntResult(shuffle([...pool])[0]);
        setWildHuntDrawKey(k => k + 1);
    };

    return (
        <Container id="Opponents">
            <PageTitle HeaderText={t("opponents.title")} />

            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <div style={{ fontSize: "3rem" }}>⚔️</div>
                            <Card.Title as="h3">{t("opponents.wildHuntTitle")}</Card.Title>
                            <Card.Text className="text-muted">{t("opponents.wildHuntDesc")}</Card.Text>

                            {(savedPlayers === null || isEditing) && (
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>{t("opponents.numPlayersLabel")}</strong></Form.Label>
                                        <div className="d-flex gap-2 justify-content-center">
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
                                            <Form.Label>{t("opponents.playerNameLabel", { player: i + 1 })}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t("opponents.playerNamePlaceholder", { player: i + 1 })}
                                                value={name}
                                                onChange={e => handleNameChange(i, e.target.value)}
                                                isInvalid={formErrors.some(err => err.includes(String(i + 1)))}
                                            />
                                        </Form.Group>
                                    ))}

                                    {formErrors.length > 0 && (
                                        <Alert variant="danger" className="mt-2">
                                            <ul className="mb-0">
                                                {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                                            </ul>
                                        </Alert>
                                    )}

                                    <Button variant="secondary" size="lg" className="mt-3 w-100" onClick={handleSavePlayers}>
                                        {t("opponents.savePlayersBtn")}
                                    </Button>
                                </Form>
                            )}

                            {savedPlayers !== null && !isEditing && (
                                <>
                                    <p className="text-muted mb-2">
                                        <strong>{t("opponents.currentPlayers")}:</strong>{" "}
                                        {savedPlayers.join(", ")}
                                    </p>
                                    <Button variant="secondary" size="lg" className="w-100 mb-2" onClick={handleWildHuntDraw}>
                                        {t("opponents.wildHuntBtn")}
                                    </Button>
                                    {wildHuntResult && (
                                        <Alert key={wildHuntDrawKey} variant="dark" className="mt-3 fs-4 fw-bold result-pop">{wildHuntResult}</Alert>
                                    )}
                                    <Button variant="outline-secondary" className="mt-2 w-100" onClick={handleEditPlayers}>
                                        {t("opponents.resetPlayersBtn")}
                                    </Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
