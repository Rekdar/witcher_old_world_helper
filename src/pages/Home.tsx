import { useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { exportState, importState, resetState } from '../util/saveLoad';

export default function Home({ t }): JSX.Element {
    /*
        Breakpoints
        ============================
        X-Small		 None	<576px
        Small		 sm		≥576px
        Medium		 md		≥768px
        Large		 lg		≥992px
        Extra large	 xl		≥1200px
        XX large	xxl		≥1400px
    */

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [confirmReset, setConfirmReset] = useState(false);

    function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        importState(file, () => { window.location.reload(); });
        e.target.value = '';
    }

    function handleReset() {
        resetState();
        setConfirmReset(false);
        window.location.reload();
    }

    return (
        <Container className="p-6">
            <Row className="justify-content-center mb-3 px-3">
                <Col xs="auto" className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={exportState}>
                        {t('home.saveState')}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => fileInputRef.current?.click()}>
                        {t('home.loadState')}
                    </Button>
                    <Button variant="outline-danger" onClick={() => setConfirmReset(true)}>
                        {t('home.resetState')}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />
                </Col>
            </Row>

            <Modal show={confirmReset} onHide={() => setConfirmReset(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('home.resetConfirmTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('home.resetConfirmBody')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setConfirmReset(false)}>
                        {t('home.resetConfirmCancel')}
                    </Button>
                    <Button variant="danger" onClick={handleReset}>
                        {t('home.resetConfirmOk')}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row xs={1} md={2} lg={3} className="g-4 p-3">
                {t("home.linkedPages").map((page) => (
                    <Col key={page}>
                        <Card className="h-100">
                            <Card.Img variant="top" src="" />
                            <Col id="horizontalCardTextCol" className="px-0 d-flex">
                                <Row id="horizontalCardTextRow" className="g-0 flex-grow-1 d-flex" xs={1} >
                                    <Card.Body>
                                        <Card.Title>{page.name}</Card.Title>
                                        <Card.Text>{page.desc}</Card.Text>
                                    </Card.Body>
                                    <Button variant="secondary" className='align-self-end pt-auto m-3 flex-shrink-1'
                                        href={page.link}>
                                        {page.btn}
                                    </Button>
                                </Row>
                            </Col>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
