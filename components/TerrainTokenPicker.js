"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Row_1 = __importDefault(require("react-bootstrap/Row"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const Button_1 = __importDefault(require("react-bootstrap/esm/Button"));
const Image_1 = __importDefault(require("react-bootstrap/Image"));
const react_bootstrap_1 = require("react-bootstrap");
const terrains_1 = __importStar(require("../classes/terrains"));
const react_1 = require("react");
const PageTitle_1 = __importDefault(require("./PageTitle"));
const TASKS_STORAGE_KEY = 'locationTokens_tasks';
const WITCHER_PICKER_KEY = 'witcherPicker_state';
const MARKER_IMAGES = {
    quest: require('../img/inventory/quest.png'),
    track: require('../img/inventory/track.png'),
};
function loadWitcherPlayerNames() {
    var _a;
    try {
        const raw = localStorage.getItem(WITCHER_PICKER_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return ((_a = parsed.playerNames) !== null && _a !== void 0 ? _a : []).filter(n => n.trim() !== '');
    }
    catch (_b) {
        return [];
    }
}
function loadTasks() {
    try {
        const raw = localStorage.getItem(TASKS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function saveTasks(tasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}
function TerrainTokenPicker({ HeaderText = "Draw a token", NumTokens = 1, t }) {
    const [skellige, setSkellige] = (0, react_1.useState)(false);
    const [localTerrainDeck, setLocalTerrainDeck] = (0, react_1.useState)(new terrains_1.default());
    const [displayedToken, setToken] = (0, react_1.useState)(new terrains_1.ForestToken());
    const [showForm, setShowForm] = (0, react_1.useState)(false);
    const [formName, setFormName] = (0, react_1.useState)('');
    const [formNote, setFormNote] = (0, react_1.useState)('');
    const [formErrors, setFormErrors] = (0, react_1.useState)([]);
    const [tasks, setTasks] = (0, react_1.useState)(loadTasks);
    const [formMarker, setFormMarker] = (0, react_1.useState)('quest');
    const [showManualForm, setShowManualForm] = (0, react_1.useState)(false);
    const [manualTokenKey, setManualTokenKey] = (0, react_1.useState)('');
    const [manualFormName, setManualFormName] = (0, react_1.useState)('');
    const [manualFormNote, setManualFormNote] = (0, react_1.useState)('');
    const [manualFormErrors, setManualFormErrors] = (0, react_1.useState)([]);
    const [manualFormMarker, setManualFormMarker] = (0, react_1.useState)('quest');
    const [enlargedImage, setEnlargedImage] = (0, react_1.useState)(null);
    const [enlargedImageIsMap, setEnlargedImageIsMap] = (0, react_1.useState)(false);
    const witcherPlayers = loadWitcherPlayerNames();
    if (NumTokens > 1) {
        print();
    }
    const handleSkellige = () => {
        setSkellige(!skellige);
        setLocalTerrainDeck(new terrains_1.default(!skellige));
    };
    const allTokens = skellige
        ? [...terrains_1.MountainTokensSkellige, ...terrains_1.ForestTokensSkellige, ...terrains_1.WaterTokensSkellige]
        : [...terrains_1.MountainTokens, ...terrains_1.ForestTokens, ...terrains_1.WaterTokens];
    const tokenDrawn = displayedToken.number !== -1;
    const handleSaveTask = () => {
        const errors = [];
        if (!formName.trim())
            errors.push(t('locationTokens.errorEmptyName'));
        if (!formNote.trim())
            errors.push(t('locationTokens.errorEmptyNote'));
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        const newTask = {
            id: Date.now().toString(),
            imgStr: displayedToken.imgStr,
            tokenName: displayedToken.name,
            playerName: formName.trim(),
            note: formNote.trim(),
            markerType: formMarker,
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        saveTasks(updated);
        setFormName('');
        setFormNote('');
        setFormErrors([]);
        setFormMarker('quest');
        setShowForm(false);
        setToken(new terrains_1.ForestToken());
    };
    const handleSaveManualTask = () => {
        const errors = [];
        if (!manualTokenKey)
            errors.push(t('locationTokens.errorNoToken'));
        if (!manualFormName.trim())
            errors.push(t('locationTokens.errorEmptyName'));
        if (!manualFormNote.trim())
            errors.push(t('locationTokens.errorEmptyNote'));
        if (errors.length > 0) {
            setManualFormErrors(errors);
            return;
        }
        const selectedToken = allTokens.find(tok => tok.imgStr === manualTokenKey);
        const newTask = {
            id: Date.now().toString(),
            imgStr: selectedToken.imgStr,
            tokenName: selectedToken.name,
            playerName: manualFormName.trim(),
            note: manualFormNote.trim(),
            markerType: manualFormMarker,
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        saveTasks(updated);
        setManualTokenKey('');
        setManualFormName('');
        setManualFormNote('');
        setManualFormErrors([]);
        setManualFormMarker('quest');
        setShowManualForm(false);
    };
    const handleDone = (id) => {
        const updated = tasks.filter(task => task.id !== id);
        setTasks(updated);
        saveTasks(updated);
    };
    const handleCancelForm = () => {
        setShowForm(false);
        setFormName('');
        setFormNote('');
        setFormErrors([]);
        setFormMarker('quest');
    };
    const handleCancelManualForm = () => {
        setShowManualForm(false);
        setManualTokenKey('');
        setManualFormName('');
        setManualFormNote('');
        setManualFormErrors([]);
        setManualFormMarker('quest');
    };
    return ((0, jsx_runtime_1.jsxs)(Container_1.default, { fluid: true, className: "mx-auto min-h-screen", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: HeaderText }), (0, jsx_runtime_1.jsxs)(Row_1.default, { className: 'p-2 mb-2 align-items-start justify-content-center', children: [(0, jsx_runtime_1.jsxs)(Col_1.default, { xs: 12, md: "auto", className: 'd-flex flex-column align-items-center', children: [(0, jsx_runtime_1.jsx)("div", { className: 'd-flex justify-content-center mb-2', children: displayedToken === null || displayedToken === void 0 ? void 0 : displayedToken.img() }), (0, jsx_runtime_1.jsxs)("div", { className: 'd-flex justify-content-center gap-1 mb-2', children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", size: "lg", className: 'px-1', onClick: () => setToken(localTerrainDeck.drawMountainToken()), children: t('locationTokens.mountain') }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "success", size: "lg", onClick: () => setToken(localTerrainDeck.drawForestToken()), children: t('locationTokens.forest') }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", size: "lg", className: 'px-3', onClick: () => setToken(localTerrainDeck.drawWaterToken()), children: t('locationTokens.water') })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Switch, { checked: skellige, onChange: () => handleSkellige(), id: t("exps.skellige"), label: t("exps.skellige") }), tokenDrawn && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-secondary", size: "sm", className: 'mt-2', onClick: () => setToken(new terrains_1.ForestToken()), children: t('locationTokens.clearSelection') }))] }), (() => {
                        const MAP_W = 1338;
                        const MAP_H = 1480;
                        const mapSrc = require('../img/tokens/reducedTerrainTokens/map.jpg');
                        const pos = tokenDrawn ? terrains_1.TOKEN_MAP_POSITIONS[displayedToken.imgStr] : undefined;
                        const leftPct = pos ? (pos.x / MAP_W) * 100 : 0;
                        const topPct = pos ? (pos.y / MAP_H) * 100 : 0;
                        // Quest markers: group by imgStr to horizontally offset duplicates
                        const positionCounts = {};
                        const questMarkers = tasks
                            .map(task => ({ task, pos: terrains_1.TOKEN_MAP_POSITIONS[task.imgStr] }))
                            .filter(({ pos: p }) => p !== undefined)
                            .map(({ task, pos: p }) => {
                            var _a;
                            const idx = (_a = positionCounts[task.imgStr]) !== null && _a !== void 0 ? _a : 0;
                            positionCounts[task.imgStr] = idx + 1;
                            return { task, p: p, idx };
                        });
                        return ((0, jsx_runtime_1.jsx)(Col_1.default, { xs: 12, md: 7, lg: 6, className: 'mt-3 mt-md-0', children: (0, jsx_runtime_1.jsxs)("div", { style: { position: 'relative', width: '100%' }, children: [(0, jsx_runtime_1.jsx)("img", { src: mapSrc, alt: "Token placement map", style: { width: '100%', display: 'block', cursor: 'zoom-in' }, onClick: () => { setEnlargedImageIsMap(true); setEnlargedImage(mapSrc); } }), questMarkers.map(({ task, p, idx }) => {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsx)("img", { src: MARKER_IMAGES[(_a = task.markerType) !== null && _a !== void 0 ? _a : 'quest'], alt: "quest", style: {
                                                position: 'absolute',
                                                left: `${(p.x / MAP_W) * 100 + idx * 3}%`,
                                                top: `${(p.y / MAP_H) * 100}%`,
                                                transform: 'translate(-50%, 0)',
                                                height: 'clamp(25px, 5.5%, 51px)',
                                                width: 'auto',
                                                pointerEvents: 'none',
                                            } }, task.id));
                                    }), pos && ((0, jsx_runtime_1.jsx)("div", { style: {
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
                                        } }))] }) }));
                    })()] }), (0, jsx_runtime_1.jsxs)(Row_1.default, { className: 'justify-content-center p-2', children: [tokenDrawn && !showForm && ((0, jsx_runtime_1.jsx)(Col_1.default, { xs: "auto", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-secondary", onClick: () => setShowForm(true), children: t('locationTokens.addAction') }) })), (0, jsx_runtime_1.jsx)(Col_1.default, { xs: "auto", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-secondary", onClick: () => setShowManualForm(prev => !prev), children: t('locationTokens.addManualAction') }) })] }), showForm && ((0, jsx_runtime_1.jsx)(Row_1.default, { className: 'justify-content-center p-2', children: (0, jsx_runtime_1.jsx)(Col_1.default, { xs: 12, md: 8, lg: 6, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.playerNameLabel') }) }), witcherPlayers.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Select, { value: formName, onChange: e => { setFormName(e.target.value); setFormErrors([]); }, isInvalid: formErrors.includes(t('locationTokens.errorEmptyName')), children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "\u2014" }), witcherPlayers.map(name => ((0, jsx_runtime_1.jsx)("option", { value: name, children: name }, name)))] })) : ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "text", value: formName, onChange: e => { setFormName(e.target.value); setFormErrors([]); }, isInvalid: formErrors.includes(t('locationTokens.errorEmptyName')) }))] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.noteLabel') }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, value: formNote, onChange: e => { setFormNote(e.target.value); setFormErrors([]); }, isInvalid: formErrors.includes(t('locationTokens.errorEmptyNote')) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.markerLabel') }) }), (0, jsx_runtime_1.jsx)("div", { className: 'd-flex gap-2', children: Object.keys(MARKER_IMAGES).map(mk => ((0, jsx_runtime_1.jsx)("img", { src: MARKER_IMAGES[mk], alt: mk, onClick: () => setFormMarker(mk), style: {
                                                width: 32, height: 32, cursor: 'pointer', objectFit: 'contain',
                                                outline: formMarker === mk ? '2px solid #0d6efd' : '2px solid transparent',
                                                borderRadius: 4,
                                            } }, mk))) })] }), formErrors.length > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "danger", className: 'mb-3', children: (0, jsx_runtime_1.jsx)("ul", { className: 'mb-0', children: formErrors.map((err, i) => (0, jsx_runtime_1.jsx)("li", { children: err }, i)) }) })), (0, jsx_runtime_1.jsxs)("div", { className: 'd-flex gap-2', children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: handleSaveTask, children: t('locationTokens.save') }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-secondary", onClick: handleCancelForm, children: t('locationTokens.cancel') })] })] }) }) })), showManualForm && ((0, jsx_runtime_1.jsx)(Row_1.default, { className: 'justify-content-center p-2', children: (0, jsx_runtime_1.jsx)(Col_1.default, { xs: 12, md: 8, lg: 6, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.selectTokenLabel') }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Select, { value: manualTokenKey, onChange: e => { setManualTokenKey(e.target.value); setManualFormErrors([]); }, isInvalid: manualFormErrors.includes(t('locationTokens.errorNoToken')), children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "\u2014" }), (0, jsx_runtime_1.jsx)("optgroup", { label: t('locationTokens.mountain'), children: (skellige ? terrains_1.MountainTokensSkellige : terrains_1.MountainTokens).map(tok => ((0, jsx_runtime_1.jsx)("option", { value: tok.imgStr, children: tok.name }, tok.imgStr))) }), (0, jsx_runtime_1.jsx)("optgroup", { label: t('locationTokens.forest'), children: (skellige ? terrains_1.ForestTokensSkellige : terrains_1.ForestTokens).map(tok => ((0, jsx_runtime_1.jsx)("option", { value: tok.imgStr, children: tok.name }, tok.imgStr))) }), (0, jsx_runtime_1.jsx)("optgroup", { label: t('locationTokens.water'), children: (skellige ? terrains_1.WaterTokensSkellige : terrains_1.WaterTokens).map(tok => ((0, jsx_runtime_1.jsx)("option", { value: tok.imgStr, children: tok.name }, tok.imgStr))) })] })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.playerNameLabel') }) }), witcherPlayers.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Select, { value: manualFormName, onChange: e => { setManualFormName(e.target.value); setManualFormErrors([]); }, isInvalid: manualFormErrors.includes(t('locationTokens.errorEmptyName')), children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "\u2014" }), witcherPlayers.map(name => ((0, jsx_runtime_1.jsx)("option", { value: name, children: name }, name)))] })) : ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "text", value: manualFormName, onChange: e => { setManualFormName(e.target.value); setManualFormErrors([]); }, isInvalid: manualFormErrors.includes(t('locationTokens.errorEmptyName')) }))] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.noteLabel') }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, value: manualFormNote, onChange: e => { setManualFormNote(e.target.value); setManualFormErrors([]); }, isInvalid: manualFormErrors.includes(t('locationTokens.errorEmptyNote')) })] }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: 'mb-3', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t('locationTokens.markerLabel') }) }), (0, jsx_runtime_1.jsx)("div", { className: 'd-flex gap-2', children: Object.keys(MARKER_IMAGES).map(mk => ((0, jsx_runtime_1.jsx)("img", { src: MARKER_IMAGES[mk], alt: mk, onClick: () => setManualFormMarker(mk), style: {
                                                width: 32, height: 32, cursor: 'pointer', objectFit: 'contain',
                                                outline: manualFormMarker === mk ? '2px solid #0d6efd' : '2px solid transparent',
                                                borderRadius: 4,
                                            } }, mk))) })] }), manualFormErrors.length > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "danger", className: 'mb-3', children: (0, jsx_runtime_1.jsx)("ul", { className: 'mb-0', children: manualFormErrors.map((err, i) => (0, jsx_runtime_1.jsx)("li", { children: err }, i)) }) })), (0, jsx_runtime_1.jsxs)("div", { className: 'd-flex gap-2', children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "secondary", onClick: handleSaveManualTask, children: t('locationTokens.save') }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-secondary", onClick: handleCancelManualForm, children: t('locationTokens.cancel') })] })] }) }) })), tasks.length > 0 && ((0, jsx_runtime_1.jsx)(Row_1.default, { className: 'p-2 mt-3', children: (0, jsx_runtime_1.jsxs)(Col_1.default, { children: [(0, jsx_runtime_1.jsx)("h5", { children: t('locationTokens.tasksTitle') }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Table, { striped: true, bordered: true, hover: true, responsive: true, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: t('locationTokens.tokenColumn') }), (0, jsx_runtime_1.jsx)("th", { children: t('locationTokens.playerNameLabel') }), (0, jsx_runtime_1.jsx)("th", { children: t('locationTokens.noteLabel') }), (0, jsx_runtime_1.jsx)("th", {})] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: tasks.map(task => {
                                        var _a, _b;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { className: 'text-center align-middle', children: (0, jsx_runtime_1.jsxs)("div", { className: 'd-flex align-items-center justify-content-center gap-1', children: [(0, jsx_runtime_1.jsx)(Image_1.default, { src: (0, terrains_1.getTokenImgSrc)(task.imgStr), width: 50, alt: task.tokenName, roundedCircle: true, style: { cursor: 'zoom-in' }, onClick: () => setEnlargedImage((0, terrains_1.getTokenImgSrc)(task.imgStr)) }), (0, jsx_runtime_1.jsx)("img", { src: MARKER_IMAGES[(_a = task.markerType) !== null && _a !== void 0 ? _a : 'quest'], alt: (_b = task.markerType) !== null && _b !== void 0 ? _b : 'quest', style: { width: 20, height: 20, objectFit: 'contain' } })] }) }), (0, jsx_runtime_1.jsx)("td", { className: 'align-middle', children: task.playerName }), (0, jsx_runtime_1.jsx)("td", { className: 'align-middle', children: task.note }), (0, jsx_runtime_1.jsx)("td", { className: 'text-center align-middle', children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline-success", size: "sm", onClick: () => handleDone(task.id), children: t('locationTokens.done') }) })] }, task.id));
                                    }) })] })] }) })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedImage !== null, onHide: () => { setEnlargedImage(null); setEnlargedImageIsMap(false); }, size: "lg", centered: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: 'text-center p-2', onClick: () => { setEnlargedImage(null); setEnlargedImageIsMap(false); }, style: { cursor: 'zoom-out' }, children: enlargedImage && ((0, jsx_runtime_1.jsx)(Image_1.default, { src: enlargedImage, fluid: true, roundedCircle: !enlargedImageIsMap, style: { maxHeight: '80vh' } })) }) })] }));
}
exports.default = TerrainTokenPicker;
