import { useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import PageTitle from "../components/PageTitle";
import { shuffle } from "../util/generic";

interface PlayerResult {
    name: string;
    school: string;
    startsFirst: boolean;
}

export default function WitcherPicker({ t }) {
    const [numPlayers, setNumPlayers] = useState<number>(2);
    const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
    const [results, setResults] = useState<PlayerResult[] | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const schools: string[] = t("witcherPicker.schools", { returnObjects: true });

    const handleNumPlayersChange = (n: number) => {
        setNumPlayers(n);
        setPlayerNames(prev => {
            const updated = [...prev];
            while (updated.length < n) updated.push("");
            return updated.slice(0, n);
        });
        setResults(null);
        setErrors([]);
    };

    const handleNameChange = (index: number, value: string) => {
        setPlayerNames(prev => prev.map((name, i) => i === index ? value : name));
        setErrors([]);
    };

    const handleSubmit = () => {
        const newErrors: string[] = [];
        playerNames.forEach((name, i) => {
            if (!name.trim()) {
                newErrors.push(t("witcherPicker.errorEmptyName", { player: i + 1 }));
            }
        });
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        const shuffledSchools = shuffle([...schools]).slice(0, numPlayers);
        const startingIndex = Math.floor(Math.random() * numPlayers);

        const newResults: PlayerResult[] = playerNames.map((name, i) => ({
            name: name.trim(),
            school: shuffledSchools[i],
            startsFirst: i === startingIndex,
        }));

        setResults(newResults);
        setErrors([]);
    };

    const handleReset = () => {
        setResults(null);
        setErrors([]);
    };

    return (
        <Container id="WitcherPicker">
            <PageTitle HeaderText={t("witcherPicker.title")} />

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
                                    className="d-flex justify-content-between align-items-center"
                                    variant={result.startsFirst ? "warning" : undefined}
                                >
                                    <div>
                                        <strong>{result.name}</strong>
                                        <span className="text-muted ms-2">— {result.school}</span>
                                    </div>
                                    {result.startsFirst && (
                                        <Badge bg="dark">
                                            {t("witcherPicker.startsFirst")}
                                        </Badge>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Button
                            variant="outline-secondary"
                            className="mt-3 w-100"
                            onClick={handleReset}
                        >
                            {t("witcherPicker.resetButton")}
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
