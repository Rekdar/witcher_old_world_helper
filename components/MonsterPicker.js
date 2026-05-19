"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const monsters_1 = __importDefault(require("../classes/monsters"));
const PageTitle_1 = __importDefault(require("./PageTitle"));
const monsters_json_1 = __importDefault(require("../monsters.json"));
const generic_1 = require("../util/generic");
require("../css/MonsterPicker.css");
const cardFrontImages = Object.fromEntries(monsters_json_1.default.map(m => [m.front_name, require(`../img/monsters_full_cards/${m.front_name}.jpg`)]));
const cardsByLevel = {
    1: monsters_json_1.default.filter(m => m.level === 1),
    2: monsters_json_1.default.filter(m => m.level === 2),
    3: monsters_json_1.default.filter(m => m.level === 3),
};
const DRAW_ALL_DISTRIBUTION = {
    1: [1, 2, 3],
    2: [1, 2, 3, 3],
    3: [1, 2, 2, 3, 3],
    4: [2, 2, 1, 3, 3],
    5: [1, 2, 2, 2, 3, 3],
};
function readWitcherPickerPlayerCount() {
    var _a;
    try {
        const raw = localStorage.getItem('witcherPicker_state');
        if (!raw)
            return 2;
        const parsed = JSON.parse(raw);
        return Math.min(5, Math.max(1, (_a = parsed.numPlayers) !== null && _a !== void 0 ? _a : 2));
    }
    catch (_b) {
        return 2;
    }
}
function makeCardDecks() {
    return {
        1: (0, generic_1.shuffle)([...cardsByLevel[1]]),
        2: (0, generic_1.shuffle)([...cardsByLevel[2]]),
        3: (0, generic_1.shuffle)([...cardsByLevel[3]]),
    };
}
const EXPANSIONS_KEY = 'monsterPicker_expansions';
function loadExpansions(length) {
    try {
        const raw = localStorage.getItem(EXPANSIONS_KEY);
        if (!raw)
            return new Array(length).fill(false);
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === length)
            return parsed;
        return new Array(length).fill(false);
    }
    catch (_a) {
        return new Array(length).fill(false);
    }
}
function MonsterPicker({ HeaderText = "Randomly draw a token", t }) {
    const expansionsNames = ["legendaryHunt", "wildHunt", "monsterPack", "mountedEredin"];
    const [localMonsterDeck, setLocalMonsterDeck] = (0, react_1.useState)(new monsters_1.default());
    const [expansions, setExpansions] = (0, react_1.useState)(() => loadExpansions(expansionsNames.length));
    const [cardDecks, setCardDecks] = (0, react_1.useState)(makeCardDecks);
    const [displayed, setDisplayed] = (0, react_1.useState)(null);
    const [enlargedCard, setEnlargedCard] = (0, react_1.useState)(null);
    const [showDrawAllModal, setShowDrawAllModal] = (0, react_1.useState)(false);
    const [drawAllPlayerCount, setDrawAllPlayerCount] = (0, react_1.useState)(2);
    const [drawAllResults, setDrawAllResults] = (0, react_1.useState)(null);
    // Card mode for I/II/III: no expansions OR only Wild Hunt checked
    const useCardMode = !expansions[0] && !expansions[2] && !expansions[3];
    const handleToggleExpansions = (position) => {
        let updatedExpansions = expansions.map((item, index) => index === position ? !item : item);
        if (position === 0 && !expansions[0] && expansions[1]) {
            updatedExpansions = updatedExpansions.map((item, index) => index === 1 ? !item : item);
        }
        else if (position === 1 && !expansions[1] && expansions[0]) {
            updatedExpansions = updatedExpansions.map((item, index) => index === 0 ? !item : item);
        }
        setExpansions(updatedExpansions);
        localStorage.setItem(EXPANSIONS_KEY, JSON.stringify(updatedExpansions));
    };
    (0, react_1.useEffect)(() => {
        setLocalMonsterDeck(new monsters_1.default(...expansions));
        setDisplayed(null);
        setCardDecks(makeCardDecks());
    }, [expansions]);
    function drawCard(level) {
        setCardDecks(prev => {
            let deck = [...prev[level]];
            if (deck.length === 0)
                deck = (0, generic_1.shuffle)([...cardsByLevel[level]]);
            const [card, ...rest] = deck;
            setDisplayed({ kind: 'card', card });
            return Object.assign(Object.assign({}, prev), { [level]: rest });
        });
    }
    function drawToken(draw) {
        setDisplayed({ kind: 'token', token: draw() });
    }
    function handleDrawAll() {
        var _a;
        const distribution = DRAW_ALL_DISTRIBUTION[drawAllPlayerCount];
        if (!distribution)
            return;
        const needed = {};
        for (const lvl of distribution) {
            needed[lvl] = ((_a = needed[lvl]) !== null && _a !== void 0 ? _a : 0) + 1;
        }
        const picked = {};
        for (const lvl of [1, 2, 3]) {
            if (!needed[lvl])
                continue;
            const pool = (0, generic_1.shuffle)([...cardsByLevel[lvl]]);
            picked[lvl] = pool.slice(0, needed[lvl]);
        }
        const levelIndex = { 1: 0, 2: 0, 3: 0 };
        const results = distribution.map(lvl => {
            const card = picked[lvl][levelIndex[lvl]];
            levelIndex[lvl]++;
            return { name_pl: card.name_pl, level: card.level };
        });
        setDrawAllResults(results);
    }
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { fluid: true, className: "mx-auto min-h-screen", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: HeaderText }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: 'tokensRow', className: 'py-2', children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { className: 'justify-content-center', children: [(displayed === null || displayed === void 0 ? void 0 : displayed.kind) === 'card' && ((0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-column align-items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { children: displayed.card.name_pl }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: cardFrontImages[displayed.card.front_name], alt: displayed.card.name_pl, style: { maxHeight: 420, cursor: 'zoom-in' }, fluid: true, rounded: true, onClick: () => setEnlargedCard(cardFrontImages[displayed.card.front_name]) })] })), (displayed === null || displayed === void 0 ? void 0 : displayed.kind) === 'token' && displayed.token.tokenImg(t)] }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { id: 'MonsterButtons', className: 'justify-content-center px-1 py-2 mb-4', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: "auto", className: 'p-1', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", size: "lg", style: { width: 75 }, onClick: () => useCardMode ? drawCard(1) : drawToken(() => localMonsterDeck.drawLevelOneMonster()), children: "I" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: "auto", className: 'p-1', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "warning", size: "lg", style: { width: 75 }, onClick: () => useCardMode ? drawCard(2) : drawToken(() => localMonsterDeck.drawLevelTwoMonster()), children: "II" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: "auto", className: 'p-1', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "danger", size: "lg", style: { width: 75 }, onClick: () => useCardMode ? drawCard(3) : drawToken(() => localMonsterDeck.drawLevelThreeMonster()), children: "III" }) }), expansions[0] || expansions[1] ?
                        (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: "auto", className: 'p-1', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "lg", variant: "custom", style: {
                                    backgroundColor: "#960a0a",
                                    color: "#ffffff",
                                }, onClick: () => drawToken(() => localMonsterDeck.drawLegendaryMonster()), children: expansions[0] ? t("monsterPicker.legendary") : t("exps.wildHunt") }) })
                        : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), expansions[1] && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: "auto", className: 'p-1', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { size: "lg", variant: "custom", style: {
                                backgroundColor: "#960a0a",
                                color: "#ffffff",
                            }, onClick: () => {
                                setDrawAllPlayerCount(readWitcherPickerPlayerCount());
                                setDrawAllResults(null);
                                setShowDrawAllModal(true);
                            }, children: t("monsterPicker.drawAll") }) }))] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: 'expansionToggleRow', className: 'justify-content-center p-2', children: expansionsNames.map((name, index) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Switch, { checked: expansions[index], onChange: () => handleToggleExpansions(index), id: t(`exps.${name}`), label: t(`exps.${name}`) }, name))) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: 'justify-content-center p-2 m-4', id: "ToggleTooltip", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { className: 'mx-3', style: { maxWidth: "550px" }, children: [(0, jsx_runtime_1.jsx)("strong", { className: "fw-light text-center", children: t("monsterPicker.toggle") }), (0, jsx_runtime_1.jsxs)("ul", { className: 'fw-lighter', children: [(0, jsx_runtime_1.jsx)("li", { children: t("exps.legendaryHunt") + ": " + t("monsters.legendaryHunt", { joinArrays: ', ' }) + " (" + t("monsterPicker.allLegendary") + ")" }), (0, jsx_runtime_1.jsxs)("li", { children: [t("exps.wildHunt"), ": ", t("monsters.Eredin"), ", ", t("monsters.Nithral"), ", ", t("monsters.Imlerith"), ", ", t("monsters.Caranthir"), " (", t("monsterPicker.allLegendary"), ")"] }), (0, jsx_runtime_1.jsxs)("li", { children: [t("exps.monsterPack"), ": ", t("monsters.Koshchey"), " (", t("monsters.lvl3"), "), ", t("monsters.Kayran"), " (", t("monsterPicker.legendary"), "). ", t("monsterPicker.sirenExplain"), "."] }), (0, jsx_runtime_1.jsxs)("li", { children: [t("exps.mountedEredin"), ": ", t("exps.mountedEredin"), " (", t("monsters.lvl3"), ")"] })] })] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlargedCard !== null, onHide: () => setEnlargedCard(null), size: "lg", centered: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: 'text-center p-2', onClick: () => setEnlargedCard(null), style: { cursor: 'zoom-out' }, children: enlargedCard && (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: enlargedCard, fluid: true, rounded: true, style: { maxHeight: '85vh' } }) }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: showDrawAllModal, onHide: () => setShowDrawAllModal(false), centered: true, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: t("monsterPicker.drawAllModalTitle") }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { children: drawAllResults === null ? ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Form.Group, { className: "mb-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Label, { children: t("monsterPicker.numPlayersLabel") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Control, { type: "number", min: 1, max: 5, value: drawAllPlayerCount, onChange: e => {
                                        const v = Math.min(5, Math.max(1, Number(e.target.value) || 1));
                                        setDrawAllPlayerCount(v);
                                    } })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h5", { children: t("monsterPicker.drawAllResultTitle") }), (0, jsx_runtime_1.jsx)("ol", { children: drawAllResults.map((m, i) => ((0, jsx_runtime_1.jsxs)("li", { children: [m.name_pl, " (", t("monsterPicker.level"), m.level, ")"] }, i))) })] })) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Footer, { children: drawAllResults === null ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setShowDrawAllModal(false), children: t("monsterPicker.drawAllCancel") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "custom", style: { backgroundColor: "#960a0a", color: "#ffffff" }, onClick: handleDrawAll, children: t("monsterPicker.drawAllConfirm") })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "custom", style: { backgroundColor: "#960a0a", color: "#ffffff" }, onClick: () => setDrawAllResults(null), children: t("monsterPicker.drawAllAgain") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: () => setShowDrawAllModal(false), children: t("monsterPicker.drawAllClose") })] })) })] })] }));
}
exports.default = MonsterPicker;
