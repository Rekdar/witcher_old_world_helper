import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import Image from 'react-bootstrap/Image';
import { Alert, Form, Modal, Table } from 'react-bootstrap';
import TerrainTokenDeck, {
    MountainToken, ForestToken, WaterToken, getTokenImgSrc,
    MountainTokens, ForestTokens, WaterTokens,
    MountainTokensSkellige, ForestTokensSkellige, WaterTokensSkellige,
    TOKEN_MAP_POSITIONS
} from '../classes/terrains';
import { useState } from 'react';
import PageTitle from './PageTitle';

const TASKS_STORAGE_KEY = 'locationTokens_tasks';
const WITCHER_PICKER_KEY = 'witcherPicker_state';

function loadWitcherPlayerNames(): string[] {
    try {
        const raw = localStorage.getItem(WITCHER_PICKER_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as { playerNames?: string[] };
        return (parsed.playerNames ?? []).filter(n => n.trim() !== '');
    } catch {
        return [];
    }
}

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

    const [showManualForm, setShowManualForm] = useState(false);
    const [manualTokenKey, setManualTokenKey] = useState('');
    const [manualFormName, setManualFormName] = useState('');
    const [manualFormNote, setManualFormNote] = useState('');
    const [manualFormErrors, setManualFormErrors] = useState<string[]>([]);

    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [enlargedImageIsMap, setEnlargedImageIsMap] = useState(false);

    const witcherPlayers = loadWitcherPlayerNames();

    if (NumTokens > 1) {
        print();
    }

    const handleSkellige = () => {
        setSkellige(!skellige);
        setLocalTerrainDeck(new TerrainTokenDeck(!skellige));
    };

    const allTokens = skellige
        ? [...MountainTokensSkellige, ...ForestTokensSkellige, ...WaterTokensSkellige]
        : [...MountainTokens, ...ForestTokens, ...WaterTokens];

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
        setToken(new ForestToken());
    };

    const handleSaveManualTask = () => {
        const errors: string[] = [];
        if (!manualTokenKey) errors.push(t('locationTokens.errorNoToken'));
        if (!manualFormName.trim()) errors.push(t('locationTokens.errorEmptyName'));
        if (!manualFormNote.trim()) errors.push(t('locationTokens.errorEmptyNote'));
        if (errors.length > 0) {
            setManualFormErrors(errors);
            return;
        }
        const selectedToken = allTokens.find(tok => tok.imgStr === manualTokenKey)!;
        const newTask: TaskEntry = {
            id: Date.now().toString(),
            imgStr: selectedToken.imgStr,
            tokenName: selectedToken.name,
            playerName: manualFormName.trim(),
            note: manualFormNote.trim(),
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        saveTasks(updated);
        setManualTokenKey('');
        setManualFormName('');
        setManualFormNote('');
        setManualFormErrors([]);
        setShowManualForm(false);
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

    const handleCancelManualForm = () => {
        setShowManualForm(false);
        setManualTokenKey('');
        setManualFormName('');
        setManualFormNote('');
        setManualFormErrors([]);
    };

    return (
        <Container fluid className="mx-auto min-h-screen">
            <PageTitle HeaderText={HeaderText} />
            <Row className='p-2 mb-2 align-items-start justify-content-center'>
                <Col xs={12} md="auto" className='d-flex flex-column align-items-center'>
                    <div className='d-flex justify-content-center mb-2'>
                        {displayedToken?.img()}
                    </div>
                    <div className='d-flex justify-content-center gap-1 mb-2'>
                        <Button variant="secondary" size="lg" className='px-1'
                            onClick={() => setToken(localTerrainDeck.drawMountainToken())}
                        >
                            {t('locationTokens.mountain')}
                        </Button>
                        <Button variant="success" size="lg"
                            onClick={() => setToken(localTerrainDeck.drawForestToken())}
                        >
                            {t('locationTokens.forest')}
                        </Button>
                        <Button variant="primary" size="lg" className='px-3'
                            onClick={() => setToken(localTerrainDeck.drawWaterToken())}
                        >
                            {t('locationTokens.water')}
                        </Button>
                    </div>
                    <Form.Switch
                        checked={skellige}
                        onChange={() => handleSkellige()}
                        id={t("exps.skellige")}
                        label={t("exps.skellige")}
                    />
                    {tokenDrawn && (
                        <Button variant="outline-secondary" size="sm" className='mt-2'
                            onClick={() => setToken(new ForestToken())}
                        >
                            {t('locationTokens.clearSelection')}
                        </Button>
                    )}
                </Col>
                {(() => {
                    const MAP_W = 1338;
                    const MAP_H = 1480;
                    const mapSrc = require('../img/tokens/reducedTerrainTokens/map.jpg') as string;
                    const questSrc = require('../img/inventory/quest.png') as string;
                    const pos = tokenDrawn ? TOKEN_MAP_POSITIONS[displayedToken.imgStr] : undefined;
                    const leftPct = pos ? (pos.x / MAP_W) * 100 : 0;
                    const topPct  = pos ? (pos.y / MAP_H) * 100 : 0;

                    // Quest markers: group by imgStr to horizontally offset duplicates
                    const positionCounts: Record<string, number> = {};
                    const questMarkers = tasks
                        .map(task => ({ task, pos: TOKEN_MAP_POSITIONS[task.imgStr] }))
                        .filter(({ pos: p }) => p !== undefined)
                        .map(({ task, pos: p }) => {
                            const idx = positionCounts[task.imgStr] ?? 0;
                            positionCounts[task.imgStr] = idx + 1;
                            return { task, p: p!, idx };
                        });

                    return (
                        <Col xs={12} md={7} lg={6} className='mt-3 mt-md-0'>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <img
                                    src={mapSrc}
                                    alt="Token placement map"
                                    style={{ width: '100%', display: 'block', cursor: 'zoom-in' }}
                                    onClick={() => { setEnlargedImageIsMap(true); setEnlargedImage(mapSrc); }}
                                />
                                {questMarkers.map(({ task, p, idx }) => (
                                    <img
                                        key={task.id}
                                        src={questSrc}
                                        alt="quest"
                                        style={{
                                            position: 'absolute',
                                            left: `${(p.x / MAP_W) * 100 + idx * 3}%`,
                                            top: `${(p.y / MAP_H) * 100}%`,
                                            transform: 'translate(-50%, 0)',
                                            width: 'clamp(7px, 1.5%, 14px)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                ))}
                                {pos && (
                                    <div style={{
                                        position: 'absolute',
                                        left: `${leftPct}%`,
                                        top: `${topPct}%`,
                                        transform: 'translate(-50%, -50%)',
                                        width: 'clamp(42px, 9%, 84px)',
                                        height: 'clamp(42px, 9%, 84px)',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(220, 53, 69, 0.85)',
                                        border: '2px solid white',
                                        boxShadow: '0 0 6px rgba(0,0,0,0.7)',
                                        pointerEvents: 'none',
                                    }} />
                                )}
                            </div>
                        </Col>
                    );
                })()}
            </Row>

            <Row className='justify-content-center p-2'>
                {tokenDrawn && !showForm && (
                    <Col xs="auto">
                        <Button variant="outline-secondary" onClick={() => setShowForm(true)}>
                            {t('locationTokens.addAction')}
                        </Button>
                    </Col>
                )}
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => setShowManualForm(prev => !prev)}>
                        {t('locationTokens.addManualAction')}
                    </Button>
                </Col>
            </Row>

            {showForm && (
                <Row className='justify-content-center p-2'>
                    <Col xs={12} md={8} lg={6}>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.playerNameLabel')}</strong></Form.Label>
                                {witcherPlayers.length > 0 ? (
                                    <Form.Select
                                        value={formName}
                                        onChange={e => { setFormName(e.target.value); setFormErrors([]); }}
                                        isInvalid={formErrors.includes(t('locationTokens.errorEmptyName'))}
                                    >
                                        <option value="">—</option>
                                        {witcherPlayers.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        value={formName}
                                        onChange={e => { setFormName(e.target.value); setFormErrors([]); }}
                                        isInvalid={formErrors.includes(t('locationTokens.errorEmptyName'))}
                                    />
                                )}
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

            {showManualForm && (
                <Row className='justify-content-center p-2'>
                    <Col xs={12} md={8} lg={6}>
                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.selectTokenLabel')}</strong></Form.Label>
                                <Form.Select
                                    value={manualTokenKey}
                                    onChange={e => { setManualTokenKey(e.target.value); setManualFormErrors([]); }}
                                    isInvalid={manualFormErrors.includes(t('locationTokens.errorNoToken'))}
                                >
                                    <option value="">—</option>
                                    <optgroup label={t('locationTokens.mountain')}>
                                        {(skellige ? MountainTokensSkellige : MountainTokens).map(tok => (
                                            <option key={tok.imgStr} value={tok.imgStr}>{tok.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={t('locationTokens.forest')}>
                                        {(skellige ? ForestTokensSkellige : ForestTokens).map(tok => (
                                            <option key={tok.imgStr} value={tok.imgStr}>{tok.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={t('locationTokens.water')}>
                                        {(skellige ? WaterTokensSkellige : WaterTokens).map(tok => (
                                            <option key={tok.imgStr} value={tok.imgStr}>{tok.name}</option>
                                        ))}
                                    </optgroup>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.playerNameLabel')}</strong></Form.Label>
                                {witcherPlayers.length > 0 ? (
                                    <Form.Select
                                        value={manualFormName}
                                        onChange={e => { setManualFormName(e.target.value); setManualFormErrors([]); }}
                                        isInvalid={manualFormErrors.includes(t('locationTokens.errorEmptyName'))}
                                    >
                                        <option value="">—</option>
                                        {witcherPlayers.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        value={manualFormName}
                                        onChange={e => { setManualFormName(e.target.value); setManualFormErrors([]); }}
                                        isInvalid={manualFormErrors.includes(t('locationTokens.errorEmptyName'))}
                                    />
                                )}
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>{t('locationTokens.noteLabel')}</strong></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={manualFormNote}
                                    onChange={e => { setManualFormNote(e.target.value); setManualFormErrors([]); }}
                                    isInvalid={manualFormErrors.includes(t('locationTokens.errorEmptyNote'))}
                                />
                            </Form.Group>
                            {manualFormErrors.length > 0 && (
                                <Alert variant="danger" className='mb-3'>
                                    <ul className='mb-0'>
                                        {manualFormErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </Alert>
                            )}
                            <div className='d-flex gap-2'>
                                <Button variant="secondary" onClick={handleSaveManualTask}>
                                    {t('locationTokens.save')}
                                </Button>
                                <Button variant="outline-secondary" onClick={handleCancelManualForm}>
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
                                                style={{ cursor: 'zoom-in' }}
                                                onClick={() => setEnlargedImage(getTokenImgSrc(task.imgStr))}
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

            <Modal show={enlargedImage !== null} onHide={() => { setEnlargedImage(null); setEnlargedImageIsMap(false); }} size="lg" centered>
                <Modal.Body className='text-center p-2' onClick={() => { setEnlargedImage(null); setEnlargedImageIsMap(false); }} style={{ cursor: 'zoom-out' }}>
                    {enlargedImage && (
                        <Image src={enlargedImage} fluid roundedCircle={!enlargedImageIsMap} style={{ maxHeight: '80vh' }} />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}
