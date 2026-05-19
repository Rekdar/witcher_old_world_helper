"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
const pokerImg = require('../img/poker.png');
const pokerWildHuntImg = require('../img/wild_hunt/poker_wild_hunt.png');
const wildHuntHeaderImg = require('../img/expansionHeaders/wildHunt.png');
const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
function initialDiceState() {
    return { dice: [0, 0, 0, 0, 0], selected: [false, false, false, false, false], phase: 'initial' };
}
function rollFive() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}
function evaluateHand(dice) {
    const counts = {};
    for (const d of dice)
        counts[d] = (counts[d] || 0) + 1;
    const vals = Object.values(counts).sort((a, b) => b - a);
    const sorted = [...dice].sort((a, b) => a - b);
    const isStraight = (arr, target) => arr.every((v, i) => v === target[i]);
    if (vals[0] === 5)
        return 'Poker';
    if (vals[0] === 4)
        return 'Kareta';
    if (vals[0] === 3 && vals[1] === 2)
        return 'Full';
    if (isStraight(sorted, [1, 2, 3, 4, 5]))
        return 'Mały strit';
    if (isStraight(sorted, [2, 3, 4, 5, 6]))
        return 'Duży strit';
    if (vals[0] === 3)
        return 'Trójka';
    if (vals[0] === 2 && vals[1] === 2)
        return 'Dwie pary';
    if (vals[0] === 2)
        return 'Para';
    return 'Wysoka karta';
}
function DiceSection({ label, state, onRoll, onToggle, onReroll, onMove }) {
    const { dice, selected, phase } = state;
    const canReroll = phase === 'rolled' && selected.some(Boolean);
    const hand = phase !== 'initial' ? evaluateHand(dice) : null;
    return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: label }), phase === 'initial' && ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: onRoll, children: "Rzu\u0107 ko\u015B\u0107mi" })), phase !== 'initial' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "d-flex gap-3 flex-wrap mb-3", children: dice.map((val, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "d-flex flex-column align-items-center", style: { gap: '4px' }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onMove(i, -1), disabled: i === 0, style: { fontSize: '0.8rem', padding: '1px 6px', lineHeight: 1.4, border: '1px solid #ccc', borderRadius: '4px', background: '#f8f9fa', cursor: i === 0 ? 'default' : 'pointer' }, title: "Przesu\u0144 w lewo", children: "\u25C0" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onMove(i, 1), disabled: i === dice.length - 1, style: { fontSize: '0.8rem', padding: '1px 6px', lineHeight: 1.4, border: '1px solid #ccc', borderRadius: '4px', background: '#f8f9fa', cursor: i === dice.length - 1 ? 'default' : 'pointer' }, title: "Przesu\u0144 w prawo", children: "\u25B6" })] }), (0, jsx_runtime_1.jsx)("div", { onClick: phase === 'rolled' ? () => onToggle(i) : undefined, style: {
                                            fontSize: '8.4rem',
                                            lineHeight: 1,
                                            cursor: phase === 'rolled' ? 'pointer' : 'default',
                                            border: selected[i] ? '4px solid #dc3545' : '4px solid transparent',
                                            borderRadius: '10px',
                                            padding: '4px 6px',
                                            background: selected[i] ? '#fff5f5' : 'transparent',
                                            userSelect: 'none',
                                        }, title: phase === 'rolled' ? (selected[i] ? 'Odznacz' : 'Zaznacz do przerzutu') : undefined, children: DICE_FACES[val] })] }, i))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "fw-semibold", children: "Uk\u0142ad: " }), (0, jsx_runtime_1.jsx)("span", { className: "text-primary fs-5", children: hand })] }), phase === 'rolled' && ((0, jsx_runtime_1.jsxs)("div", { className: "d-flex gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", onClick: onRoll, children: "Rzu\u0107 ko\u015B\u0107mi" }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Button, { variant: "danger", onClick: onReroll, disabled: !canReroll, children: ["Przerzu\u0107 zaznaczone (", selected.filter(Boolean).length, ")"] })] })), phase === 'rerolled' && ((0, jsx_runtime_1.jsx)("p", { className: "text-muted mb-0", children: (0, jsx_runtime_1.jsx)("em", { children: "Przerzut wykonany." }) }))] }))] }) }));
}
function DicePoker({ t }) {
    const [enlarged, setEnlarged] = (0, react_1.useState)(false);
    const [wildHuntMode, setWildHuntMode] = (0, react_1.useState)(() => {
        try {
            return JSON.parse(localStorage.getItem('dicePoker_wildHuntMode') || 'false');
        }
        catch (_a) {
            return false;
        }
    });
    const [musicPlaying, setMusicPlaying] = (0, react_1.useState)(false);
    const audioRef = (0, react_1.useRef)(null);
    const [whiteDice, setWhiteDice] = (0, react_1.useState)(initialDiceState);
    const [blackDice, setBlackDice] = (0, react_1.useState)(initialDiceState);
    (0, react_1.useEffect)(() => {
        const audio = new Audio(require('../music/poker.mp3'));
        audio.loop = true;
        audioRef.current = audio;
        return () => { audio.pause(); };
    }, []);
    function makeHandlers(setState) {
        return {
            onRoll: () => setState({ dice: rollFive(), selected: [false, false, false, false, false], phase: 'rolled' }),
            onToggle: (i) => setState(prev => {
                const selected = [...prev.selected];
                selected[i] = !selected[i];
                return Object.assign(Object.assign({}, prev), { selected });
            }),
            onReroll: () => setState(prev => {
                const dice = prev.dice.map((v, i) => prev.selected[i] ? Math.floor(Math.random() * 6) + 1 : v);
                return { dice, selected: [false, false, false, false, false], phase: 'rerolled' };
            }),
            onMove: (i, dir) => setState(prev => {
                const j = i + dir;
                if (j < 0 || j >= prev.dice.length)
                    return prev;
                const dice = [...prev.dice];
                const selected = [...prev.selected];
                [dice[i], dice[j]] = [dice[j], dice[i]];
                [selected[i], selected[j]] = [selected[j], selected[i]];
                return Object.assign(Object.assign({}, prev), { dice, selected });
            }),
        };
    }
    const whiteHandlers = makeHandlers(setWhiteDice);
    const blackHandlers = makeHandlers(setBlackDice);
    function handleMusicToggle() {
        if (!audioRef.current)
            return;
        if (musicPlaying) {
            audioRef.current.pause();
        }
        else {
            void audioRef.current.play();
        }
        setMusicPlaying(m => !m);
    }
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "DicePoker", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t("dicePoker.title") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-4", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: 12, md: 10, lg: 8, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "mb-4", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: "Zasady gry" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted mb-2", children: "Gracz wybiera wied\u017Amina na tym samym obszarze. Wybrany wied\u017Amin nie mo\u017Ce odm\u00F3wi\u0107. Oboje musz\u0105 mie\u0107 minimum 1 \u017Ceton z\u0142ota." }), (0, jsx_runtime_1.jsxs)("ol", { className: "mb-0", children: [(0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: "Ka\u017Cdy gracz wk\u0142ada 1 \u017Ceton z\u0142ota do wsp\u00F3lnej puli. Bank dok\u0142ada 1 \u017Ceton \u2014 \u0142\u0105cznie 3 \u017Cetony." }), (0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: "Ka\u017Cdy gracz bierze zestaw 5 ko\u015Bci i rzucaj\u0105 jednocze\u015Bnie." }), (0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: "Nieaktywny gracz mo\u017Ce raz przerzuci\u0107 wybrane ko\u015Bci." }), (0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: "Aktywny gracz te\u017C mo\u017Ce raz przerzuci\u0107 wybrane ko\u015Bci." }), (0, jsx_runtime_1.jsx)("li", { className: "mb-1", children: "Gracze por\u00F3wnuj\u0105 uk\u0142ady \u2014 wygrywa lepszy uk\u0142ad. Przy tym samym uk\u0142adzie wygrywa ten z wy\u017Cszymi warto\u015Bciami (por. obja\u015Bnienia poni\u017Cej). Przy identycznych wynikach wygrywa aktywny gracz." })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-4", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Form.Check, { type: "switch", id: "wildHuntPokerSwitch", className: "d-inline-flex align-items-center gap-2 mb-3", checked: wildHuntMode, onChange: e => { setWildHuntMode(e.target.checked); localStorage.setItem('dicePoker_wildHuntMode', JSON.stringify(e.target.checked)); }, label: (0, jsx_runtime_1.jsxs)("span", { className: "d-inline-flex align-items-center gap-2", children: ["Dodatek", (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: wildHuntHeaderImg, height: 28, alt: "Dziki Gon" })] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-muted mb-2", children: (0, jsx_runtime_1.jsx)("em", { children: "Kliknij obrazek, aby powi\u0119kszy\u0107" }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: wildHuntMode ? pokerWildHuntImg : pokerImg, fluid: true, style: { maxHeight: 340, cursor: 'zoom-in' }, onClick: () => setEnlarged(true) })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: "Obja\u015Bnienia" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Przerzut." }), " Gracz wybiera dowoln\u0105 liczb\u0119 swoich ko\u015Bci i nimi rzuca. Musi przyj\u0105\u0107 nowe warto\u015Bci."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Aktywny gracz." }), " Gracz, kt\u00F3ry zainicjowa\u0142 akcj\u0119 (aktualnie rozgrywa swoj\u0105 tur\u0119)."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Dwie pary." }), " Por\u00F3wnuje si\u0119 najpierw wy\u017Csz\u0105 par\u0119, potem ni\u017Csz\u0105. Np. para 6 + para 1 wygrywa z par\u0105 5 + par\u0105 4, bo 6 > 5."] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Strit." }), " Liczy si\u0119 najwy\u017Csza ko\u015B\u0107 w uk\u0142adzie. 2-3-4-5-6 wygrywa z 1-2-3-4-5, bo najwy\u017Csza ko\u015B\u0107 to 6 vs 5."] }), (0, jsx_runtime_1.jsxs)("p", { className: "mb-0", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Full." }), " Najpierw por\u00F3wnuje si\u0119 3 jednakowe ko\u015Bci, a je\u015Bli remis si\u0119 utrzymuje \u2014 2 pozosta\u0142e jednakowe ko\u015Bci."] })] }) }), (0, jsx_runtime_1.jsx)("hr", { className: "my-4" }), (0, jsx_runtime_1.jsx)("h5", { className: "mb-3", children: "Rzut ko\u015B\u0107mi" }), (0, jsx_runtime_1.jsx)(DiceSection, Object.assign({ label: "Bia\u0142e ko\u015Bci", state: whiteDice }, whiteHandlers)), (0, jsx_runtime_1.jsx)(DiceSection, Object.assign({ label: "Czarne ko\u015Bci", state: blackDice }, blackHandlers)), (0, jsx_runtime_1.jsx)("div", { className: "text-center mt-2", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => {
                                    setWhiteDice(initialDiceState());
                                    setBlackDice(initialDiceState());
                                }, children: "Reset rzut\u00F3w" }) })] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal, { show: enlarged, onHide: () => setEnlarged(false), centered: true, size: "xl", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { className: "p-1 text-center", style: { background: '#111' }, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: wildHuntMode ? pokerWildHuntImg : pokerImg, style: { maxWidth: '100%', maxHeight: '90vh', cursor: 'zoom-out' }, onClick: () => setEnlarged(false) }) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: musicPlaying ? 'warning' : 'outline-secondary', onClick: handleMusicToggle, style: {
                    position: 'fixed',
                    bottom: '1.2rem',
                    right: '1.2rem',
                    zIndex: 1050,
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    fontSize: '1.3rem',
                    lineHeight: 1,
                    padding: 0,
                }, title: musicPlaying ? 'Pauza' : 'Odtwórz muzykę', children: "\uD83C\uDFB5" })] }));
}
exports.default = DicePoker;
