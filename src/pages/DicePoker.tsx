import { useState } from "react";
import { Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import PageTitle from "../components/PageTitle";

const pokerImg = require('../img/poker.png') as string;

export default function DicePoker({ t }): JSX.Element {
    const [enlarged, setEnlarged] = useState(false);

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
                        <p className="text-muted mb-2"><em>Kliknij obrazek, aby powiększyć</em></p>
                        <Image
                            src={pokerImg}
                            fluid
                            style={{ maxHeight: 340, cursor: 'zoom-in' }}
                            onClick={() => setEnlarged(true)}
                        />
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
                </Col>
            </Row>

            <Modal show={enlarged} onHide={() => setEnlarged(false)} centered size="xl">
                <Modal.Body className="p-1 text-center" style={{ background: '#111' }}>
                    <Image
                        src={pokerImg}
                        style={{ maxWidth: '100%', maxHeight: '90vh', cursor: 'zoom-out' }}
                        onClick={() => setEnlarged(false)}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}
