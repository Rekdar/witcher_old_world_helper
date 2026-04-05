import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import Image from 'react-bootstrap/Image';
import { Alert, Form, Table } from 'react-bootstrap';
import TerrainTokenDeck, { MountainToken, ForestToken, WaterToken, getTokenImgSrc } from '../classes/terrains';
import { useState } from 'react';
import PageTitle from './PageTitle';

const TASKS_STORAGE_KEY = 'locationTokens_tasks';

interface TaskEntry {
    id: string;
    imgStr: string;
    tokenName: string;
    playerName: string;
    note: string;
}

function loadTasks(): TaskEntry[] {
    try {
        const raw = localStorage.getItem(TASKS_STORAGE_KEY);
        return raw ? JSON.parse(raw) as TaskEntry[] : [];
    } catch {
        return [];
    }
}

function saveTasks(tasks: TaskEntry[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

export default function TerrainTokenPicker({
    HeaderText = "Draw a token",
    NumTokens = 1,
    t
}: {
    HeaderText?: string;
    NumTokens?: number;
    t;
}) {
    const [skellige, setSkellige] = useState(false);
    const [localTerrainDeck, setLocalTerrainDeck] = useState(new TerrainTokenDeck());
    const [displayedToken, setToken] = useState<MountainToken | ForestToken | WaterToken>(new ForestToken());
    const [showForm, setShowForm] = useState(false);
    const [formName, setFormName] = useState('');
    const [formNote, setFormNote] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [tasks, setTasks] = useState<TaskEntry[]>(loadTasks);

    if (NumTokens > 1) {
        print();
    }

    const handleSkellige = () => {
        setSkellige(!skellige);
        setLocalTerrainDeck(new TerrainTokenDeck(!skellige));
    };

    const tokenDrawn = displayedToken.number !== -1;

    const handleSaveTask = () => {
        const errors: string[] = [];
        if (!formName.trim()) errors.push(t('locationTokens.errorEmptyName'));
        if (!formNote.trim()) errors.push(t('locationTokens.errorEmptyNote'));
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        const newTask: TaskEntry = {
            id: Date.now().toString(),
            imgStr: displayedToken.imgStr,
            tokenName: displayedToken.name,
            playerName: formName.trim(),
            note: formNote.trim(),
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        saveTasks(updated);
        setFormName('');
        setFormNote('');
        setFormErrors([]);
        setShowForm(false);
    };

    const handleDone = (id: string) => {
        const updated = tasks.filter(task => task.id !== id);
        setTasks(updated);
        saveTasks(updated);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setFormName('');
        setFormNote('');
        setFormErrors([]);
    };

    return (
        <Container fluid className="mx-auto min-h-screen">
            <PageTitle HeaderText={HeaderText} />
            <Row id='tokensRow' className='p-2 mb-2'>
                <Col className='d-flex justify-content-center'>
                    {displayedToken?.img()}
                </Col>
            </Row>
            <Row id='TerrainTokenButtons' className='justify-content-center p-2 mb-2'>
                <Col xs="auto" className='p-1'>
                    <Button variant="secondary" size="lg" className='px-1'
                        onClick={() => setToken(localTerrainDeck.drawMountainToken())}
                    >
                        {t('locationTokens.mountain')}
                    </Button>
                </Col>
                <Col xs="auto" className='p-1'>
                    <Button variant="success" size="lg"
                        onClick={() => setToken(localTerrainDeck.drawForestToken())}
                    >
                        {t('locationTokens.forest')}
                    </Button>
                </Col>
                <Col xs="auto" className='p-1'>
                    <Button variant="primary" size="lg" className='px-3'
                        onClick={() => setToken(localTerrainDeck.drawWaterToken())}
                    >
                        {t('locationTokens.water')}
                    </Button>
                </Col>
            </Row>
            <Row id='skelligeToggleRow' className='justify-content-center p-2'>
                <Form.Switch
                    checked={skellige}
                    onChange={() => handleSkellige()}
                    id={t("exps.skellige")}
                    label={t("exps.skellige")}
                />
            </Row>

            {tokenDrawn && !showForm && (
                <Row className='justify-content-center p-2'>
                    <Col xs="auto">
                        <Button variant="outline-secondary" onClick={() => setShowForm(true)}>
                            {t('locationTokens.addAction')}
                        </Button>
                    </Col>
                </Row>
            )}

            {showForm && (
                <Row className='justify-content-center p-2'>
                    <Col xs={12} md={8} lg={6}>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.playerNameLabel')}</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formName}
                                    onChange={e => { setFormName(e.target.value); setFormErrors([]); }}
                                    isInvalid={formErrors.includes(t('locationTokens.errorEmptyName'))}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.noteLabel')}</strong></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={formNote}
                                    onChange={e => { setFormNote(e.target.value); setFormErrors([]); }}
                                    isInvalid={formErrors.includes(t('locationTokens.errorEmptyNote'))}
                                />
                            </Form.Group>
                            {formErrors.length > 0 && (
                                <Alert variant="danger" className='mb-3'>
                                    <ul className='mb-0'>
                                        {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </Alert>
                            )}
                            <div className='d-flex gap-2'>
                                <Button variant="secondary" onClick={handleSaveTask}>
                                    {t('locationTokens.save')}
                                </Button>
                                <Button variant="outline-secondary" onClick={handleCancelForm}>
                                    {t('locationTokens.cancel')}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            )}

            {tasks.length > 0 && (
                <Row className='p-2 mt-3'>
                    <Col>
                        <h5>{t('locationTokens.tasksTitle')}</h5>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>{t('locationTokens.tokenColumn')}</th>
                                    <th>{t('locationTokens.playerNameLabel')}</th>
                                    <th>{t('locationTokens.noteLabel')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id}>
                                        <td className='text-center align-middle'>
                                            <Image
                                                src={getTokenImgSrc(task.imgStr)}
                                                width={50}
                                                alt={task.tokenName}
                                                roundedCircle
                                            />
                                        </td>
                                        <td className='align-middle'>{task.playerName}</td>
                                        <td className='align-middle'>{task.note}</td>
                                        <td className='text-center align-middle'>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => handleDone(task.id)}
                                            >
                                                {t('locationTokens.done')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
