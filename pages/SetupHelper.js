"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const setup_1 = require("../classes/setup");
const legendaryHunt_png_1 = __importDefault(require("../img/expansionHeaders/legendaryHunt.png"));
const mages_png_1 = __importDefault(require("../img/expansionHeaders/mages.png"));
const monsterPack_png_1 = __importDefault(require("../img/expansionHeaders/monsterPack.png"));
const monsterTrail_png_1 = __importDefault(require("../img/expansionHeaders/monsterTrail.png"));
const skellige_png_1 = __importDefault(require("../img/expansionHeaders/skellige.png"));
const adventurePack_png_1 = __importDefault(require("../img/expansionHeaders/adventurePack.png"));
const wildHunt_png_1 = __importDefault(require("../img/expansionHeaders/wildHunt.png"));
require("../css/SetupHelper.css");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
const generic_1 = require("../util/generic");
const PageSeparator_1 = __importDefault(require("../components/PageSeparator"));
const HorizontalSpacer_1 = require("../components/HorizontalSpacer");
const expansions = ["Legendary Hunt", "Mages", "Monster Pack", "Monster Trail", "Skellige", "Adventure Pack", "Wild Hunt"];
const expansionsImages = [legendaryHunt_png_1.default, mages_png_1.default, monsterPack_png_1.default, monsterTrail_png_1.default, skellige_png_1.default, adventurePack_png_1.default, wildHunt_png_1.default];
/**
 * TODO: Revamp logic following react docs: "Choosing the State Structure" and related articles
 * https://react.dev/learn/updating-arrays-in-state
 * https://react.dev/learn/choosing-the-state-structure
 */
function SetupHelper({ t }) {
    const [players, setPlayers] = (0, react_1.useState)(1);
    const [expansionsState, setExpansionsState] = (0, react_1.useState)(new Array(expansions.length).fill(false));
    const [steps, setSteps] = (0, react_1.useState)((0, setup_1.compileSteps)(t));
    const [stepsKeys, setStepsKeys] = (0, react_1.useState)(steps);
    const handleSelect = (eventKey) => setStepsKeys(eventKey);
    const handleExpansionOnChange = (position) => {
        let updatedExpansionsState = expansionsState.map((item, index) => index === position ? !item : item);
        // if Wild Hunt is toggled
        if (position === 6) {
            // Legendary Hunt
            if (updatedExpansionsState[0])
                updatedExpansionsState = updatedExpansionsState.map((item, index) => index === 0 ? !item : item);
            // Monster Pack
            if (updatedExpansionsState[2])
                updatedExpansionsState = updatedExpansionsState.map((item, index) => index === 2 ? !item : item);
            // Adventure Pack
            if (updatedExpansionsState[5])
                updatedExpansionsState = updatedExpansionsState.map((item, index) => index === 5 ? !item : item);
        }
        setExpansionsState(updatedExpansionsState);
    };
    (0, react_1.useEffect)(() => {
        const tempArr = [...expansionsState, players];
        setSteps((0, setup_1.compileSteps)(t, ...tempArr));
    }, [players, expansionsState, t]);
    (0, react_1.useEffect)(() => {
        setStepsKeys((0, generic_1.lenToStrArr)(steps));
    }, [steps]);
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('setupHelper.title'), ConditionalRender: HorizontalSpacer_1.conditionalRender.lg }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: "gap-2 mb-4 pb-4", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { id: "setupConfiguration", lg: "4", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: 'justify-content-center', lg: 1, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { id: "playersCol", children: [(0, jsx_runtime_1.jsx)("h4", { className: 'text-center mb-3', children: t('common.players') }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3 pl-1 text-center", children: [1, 2, 3, 4, 5].map((num) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.FormCheck, { defaultChecked: num === 1, inline: true, type: "radio", name: "group1", id: `${num}Player`, label: num, onChange: () => { setPlayers(num); }, className: 'align-items-center ' + (num === 5 ? 'mr-0 !important' : ''), style: { textAlign: 'center' } }, num))) }, "inlinePlayers")] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: 'justify-content-center mb-3', lg: 1, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { id: "expansionsCol", children: [(0, jsx_runtime_1.jsx)("h4", { className: 'text-center mb-3', children: t('common.expansions') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "text-center justify-content-center", xl: 1, children: expansions.map((exp, index) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { className: "d-flex justify-content-center " + (index === 6 ? '' : 'mb-2'), xs: "auto", children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.FormCheck, { name: "group2", id: exp, checked: expansionsState[index], label: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { src: expansionsImages[index], width: 150 }), onChange: () => handleExpansionOnChange(index), className: 'd-flex align-items-center', disabled: expansionsState[6] && ["Legendary Hunt", "Monster Pack", "Adventure Pack"].includes(exp) }, exp) }, index))) }, "inlineExpansions")] }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: 'justify-content-center mt-4', lg: 1, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: "collapseButtonsCol", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: 'text-center justify-content-center', xs: "auto", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { id: "collapseAllButton", variant: "outline-secondary", onClick: () => { setStepsKeys([]); }, children: t('setupHelper.collapse') }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { id: "expandAllButton", variant: "outline-secondary", onClick: () => { setStepsKeys((0, generic_1.lenToStrArr)(steps)); }, children: t('setupHelper.expand') }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(PageSeparator_1.default, {}), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: "setupInstructions", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Stack, { gap: 3, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Accordion, { alwaysOpen: true, flush: true, activeKey: stepsKeys, onSelect: handleSelect, children: steps.map((body, index) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Accordion.Item, { eventKey: `${index}`, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Accordion.Header, { children: [t('common.Step'), " ", index + 1] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Accordion.Body, { className: 'lh-lg', children: body })] }, index))) }), (0, jsx_runtime_1.jsxs)("p", { className: "fw-lighter", children: ["Credit to ", (0, jsx_runtime_1.jsx)("a", { href: 'https://boardgamegeek.com/user/pkitty', children: "pkitty" }), " from BoardGameGeek Forums for their work on ", (0, jsx_runtime_1.jsx)("a", { href: 'https://boardgamegeek.com/filepage/254182/witcher-old-world-setup-summary-combined', children: "Witcher: Old World - Setup Summary (combined)" }), " which provided the foundation for this page."] })] }) })] })] }));
}
exports.default = SetupHelper;
