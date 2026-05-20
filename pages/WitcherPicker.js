"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
const generic_1 = require("../util/generic");
const STORAGE_KEY = "witcherPicker_state";
const BASE_SCHOOL_KEYS = ["Wolf", "Bear", "Cat", "Viper", "Griffin", "Manticore"];
const MAGES = [
    { key: "Mage_00a0ea", color: "#00a0ea", namePL: "Mag - Niebieski" },
    { key: "Mage_00bfb7", color: "#00bfb7", namePL: "Mag - Turkusowy" },
    { key: "Mage_131720", color: "#131720", namePL: "Mag - Czarny" },
    { key: "Mage_830255", color: "#830255", namePL: "Mag - Bordowy" },
    { key: "Mage_a963bc", color: "#a963bc", namePL: "Mag - Fioletowy" },
];
const schoolImages = {
    Wolf: require("../img/witcher_schools_back/witcherTrophyWolfBack.jpg"),
    Bear: require("../img/witcher_schools_back/witcherTrophyBearBack.jpg"),
    Cat: require("../img/witcher_schools_back/witcherTrophyCatBack.jpg"),
    Viper: require("../img/witcher_schools_back/witcherTrophyViperBack.jpg"),
    Griffin: require("../img/witcher_schools_back/witcherTrophyGriffinBack.jpg"),
    Manticore: require("../img/witcher_schools_back/witcherTrophyManticoreBack.jpg"),
    Ciri: require("../img/witcher_schools_back/witcherTrophyCiriBack.jpg"),
    Mage_00a0ea: require("../img/witcher_schools_back/hex_00a0ea.png"),
    Mage_00bfb7: require("../img/witcher_schools_back/hex_00bfb7.png"),
    Mage_131720: require("../img/witcher_schools_back/hex_131720.png"),
    Mage_830255: require("../img/witcher_schools_back/hex_830255.png"),
    Mage_a963bc: require("../img/witcher_schools_back/hex_a963bc.png"),
};
const schoolBorderColor = Object.fromEntries(MAGES.map(m => [m.key, m.color]));
function schoolImgStyle(schoolKey, size) {
    const border = schoolBorderColor[schoolKey];
    return Object.assign({ width: size, height: size, borderRadius: 4, objectFit: "cover" }, (border ? { border: `3px solid ${border}` } : {}));
}
const torImg = require("../img/witcher_schools_back/tor.png");
const DEFAULT_STATE = {
    numPlayers: 2,
    playerNames: ["", ""],
    results: null,
    ciriEnabled: false,
    magowiEnabled: false,
    trackPositions: {},
};
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved)
            return JSON.parse(saved);
    }
    catch (_a) { }
    return DEFAULT_STATE;
}
function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    catch (_a) { }
}
const TRACK_POSITIONS = 5;
const TRACK_HEIGHT = 480;
// Circle center positions as % from top of image (circle 5=top … circle 1=bottom)
const CIRCLE_TOPS_PCT = [20, 36, 52, 72, 88];
function WitcherPicker({ t }) {
    const [appState, setAppState] = (0, react_1.useState)(loadState);
    const [errors, setErrors] = (0, react_1.useState)([]);
    const { numPlayers, playerNames, results, ciriEnabled, magowiEnabled, trackPositions } = appState;
    const schools = t("witcherPicker.schools", { returnObjects: true });
    const schoolOptions = [
        ...BASE_SCHOOL_KEYS.map((key, i) => ({ key, name: schools[i] })),
        ...(ciriEnabled ? [{ key: "Ciri", name: t("witcherPicker.ciri") }] : []),
        ...(magowiEnabled ? MAGES.map(m => ({ key: m.key, name: m.namePL })) : []),
    ];
    (0, react_1.useEffect)(() => {
        saveState(appState);
    }, [appState]);
    const handleNumPlayersChange = (n) => {
        setAppState(prev => (Object.assign(Object.assign({}, prev), { numPlayers: n, playerNames: prev.playerNames.slice(0, n).concat(Array(Math.max(0, n - prev.playerNames.length)).fill("")), results: null })));
        setErrors([]);
    };
    const handleNameChange = (index, value) => {
        setAppState(prev => (Object.assign(Object.assign({}, prev), { playerNames: prev.playerNames.map((name, i) => i === index ? value : name) })));
        setErrors([]);
    };
    const handleCiriChange = (enabled) => {
        setAppState(prev => (Object.assign(Object.assign({}, prev), { ciriEnabled: enabled })));
    };
    const handleMagowiChange = (enabled) => {
        setAppState(prev => (Object.assign(Object.assign({}, prev), { magowiEnabled: enabled })));
    };
    const handleSubmit = () => {
        const newErrors = [];
        playerNames.forEach((name, i) => {
            if (!name.trim())
                newErrors.push(t("witcherPicker.errorEmptyName", { player: i + 1 }));
        });
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
        const shuffled = (0, generic_1.shuffle)([...schoolOptions]);
        const picked = shuffled.slice(0, numPlayers);
        const startingIndex = Math.floor(Math.random() * numPlayers);
        const newResults = playerNames.map((name, i) => ({
            name: name.trim(),
            school: picked[i].name,
            schoolKey: picked[i].key,
            startsFirst: i === startingIndex,
        }));
        const initPositions = {};
        newResults.forEach(r => { initPositions[r.name] = 0; });
        setAppState(prev => (Object.assign(Object.assign({}, prev), { results: newResults, trackPositions: initPositions })));
        setErrors([]);
    };
    const handleSchoolChange = (playerIndex, schoolKey) => {
        const opt = schoolOptions.find(o => o.key === schoolKey);
        if (!opt || !results)
            return;
        setAppState(prev => (Object.assign(Object.assign({}, prev), { results: prev.results
                ? prev.results.map((r, i) => i === playerIndex ? Object.assign(Object.assign({}, r), { school: opt.name, schoolKey: opt.key }) : r)
                : null })));
    };
    const handleRollAgain = () => {
        setAppState(prev => (Object.assign(Object.assign({}, prev), { results: null, trackPositions: {} })));
        setErrors([]);
    };
    const handleFullReset = () => {
        setAppState(DEFAULT_STATE);
        setErrors([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        }
        catch (_a) { }
    };
    const moveUp = (name) => {
        setAppState(prev => {
            var _a;
            const cur = (_a = prev.trackPositions[name]) !== null && _a !== void 0 ? _a : 0;
            if (cur >= TRACK_POSITIONS - 1)
                return prev;
            return Object.assign(Object.assign({}, prev), { trackPositions: Object.assign(Object.assign({}, prev.trackPositions), { [name]: cur + 1 }) });
        });
    };
    const moveDown = (name) => {
        setAppState(prev => {
            var _a;
            const cur = (_a = prev.trackPositions[name]) !== null && _a !== void 0 ? _a : 0;
            if (cur <= 0)
                return prev;
            return Object.assign(Object.assign({}, prev), { trackPositions: Object.assign(Object.assign({}, prev.trackPositions), { [name]: cur - 1 }) });
        });
    };
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "WitcherPicker", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t("witcherPicker.title") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-4", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 12, md: 8, lg: 6, children: (0, jsx_runtime_1.jsxs)("div", { style: { position: "relative", height: TRACK_HEIGHT, display: "inline-flex" }, children: [(0, jsx_runtime_1.jsx)("img", { src: torImg, alt: "Victory Track", style: { height: TRACK_HEIGHT, width: "auto" } }), (0, jsx_runtime_1.jsx)("div", { style: { position: "absolute", top: 0, left: "100%", height: TRACK_HEIGHT, paddingLeft: 8 }, children: Array.from({ length: TRACK_POSITIONS }, (_, i) => TRACK_POSITIONS - 1 - i).map((posIndex, displayIndex) => {
                                    const topPct = CIRCLE_TOPS_PCT[displayIndex];
                                    const activeResults = results !== null && results !== void 0 ? results : [];
                                    const playersHere = activeResults.filter(r => { var _a; return ((_a = trackPositions[r.name]) !== null && _a !== void 0 ? _a : 0) === posIndex; });
                                    return ((0, jsx_runtime_1.jsx)("div", { style: {
                                            position: "absolute",
                                            top: `${topPct}%`,
                                            left: 8,
                                            transform: "translateY(-50%)",
                                            display: "flex",
                                            gap: 4,
                                        }, children: playersHere.map(r => ((0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-column align-items-center", style: { gap: 0 }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "link", size: "sm", style: { padding: "0 2px", lineHeight: 1, fontSize: "0.75rem" }, disabled: posIndex >= TRACK_POSITIONS - 1, onClick: () => moveUp(r.name), children: "\u25B2" }), (0, jsx_runtime_1.jsx)("img", { src: schoolImages[r.schoolKey], alt: r.school, title: r.name, style: schoolImgStyle(r.schoolKey, 36) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                        fontSize: "0.55rem",
                                                        maxWidth: 40,
                                                        textAlign: "center",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }, children: r.name }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "link", size: "sm", style: { padding: "0 2px", lineHeight: 1, fontSize: "0.75rem" }, disabled: posIndex <= 0, onClick: () => moveDown(r.name), children: "\u25BC" })] }, r.name))) }, posIndex));
                                }) })] }) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-4", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 12, md: 8, lg: 6, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form, { children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: (0, jsx_runtime_1.jsx)("strong", { children: t("witcherPicker.numPlayersLabel") }) }), (0, jsx_runtime_1.jsx)("div", { className: "d-flex gap-2", children: [2, 3, 4, 5].map(n => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: numPlayers === n ? "secondary" : "outline-secondary", onClick: () => handleNumPlayersChange(n), style: { width: 48 }, children: n }, n))) })] }), playerNames.map((name, i) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t("witcherPicker.playerNameLabel", { player: i + 1 }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "text", placeholder: t("witcherPicker.playerNamePlaceholder", { player: i + 1 }), value: name, onChange: e => handleNameChange(i, e.target.value), isInvalid: errors.some(err => err.includes(String(i + 1))) })] }, i))), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { className: "mt-3", type: "checkbox", id: "ciri-checkbox", label: t("witcherPicker.ciriLabel"), checked: ciriEnabled, onChange: e => handleCiriChange(e.target.checked) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { className: "mt-2", type: "checkbox", id: "magowie-checkbox", label: t("witcherPicker.magowiLabel"), checked: magowiEnabled, onChange: e => handleMagowiChange(e.target.checked) }), errors.length > 0 && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Alert, { variant: "danger", className: "mt-2", children: (0, jsx_runtime_1.jsx)("ul", { className: "mb-0", children: errors.map((err, i) => (0, jsx_runtime_1.jsx)("li", { children: err }, i)) }) })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", size: "lg", className: "mt-3 w-100", onClick: handleSubmit, children: t("witcherPicker.rollButton") })] }) }) }), results && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-4", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 8, lg: 6, children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-center mb-3", children: t("witcherPicker.resultsTitle") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { children: results.map((result, i) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { variant: result.startsFirst ? "warning" : undefined, children: [(0, jsx_runtime_1.jsxs)("div", { className: "d-flex justify-content-between align-items-center mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "d-flex align-items-center gap-2", children: [(0, jsx_runtime_1.jsx)("img", { src: schoolImages[result.schoolKey], alt: result.school, style: schoolImgStyle(result.schoolKey, 44) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: result.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted small", children: result.school })] })] }), result.startsFirst && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Badge, { bg: "dark", children: t("witcherPicker.startsFirst") }))] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Select, { size: "sm", value: result.schoolKey, onChange: e => handleSchoolChange(i, e.target.value), children: schoolOptions.map(opt => ((0, jsx_runtime_1.jsx)("option", { value: opt.key, children: opt.name }, opt.key))) })] }, i))) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", className: "mt-3 w-100", onClick: handleRollAgain, children: t("witcherPicker.resetButton") })] }) })), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-4", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 12, md: 8, lg: 6, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "danger", className: "w-100", onClick: handleFullReset, children: t("witcherPicker.fullResetButton") }) }) })] }));
}
exports.default = WitcherPicker;
