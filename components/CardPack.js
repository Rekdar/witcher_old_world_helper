"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
const CardDetails_1 = __importDefault(require("./CardDetails"));
function CardPack({ pack, t }) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: `${pack.name}TitleCardRow`, className: "ps-6 justify-content-center", xs: 1, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { xs: 11, md: 6, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card, { className: "mx-auto", style: { border: "none" }, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Header, { as: "h3", className: "text-center", children: pack.name }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { className: "mx-auto text-center", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { children: t("common.expansions") }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Text, { children: pack.expansions.map((exp, index) => ((index ? ', ' : '') + t(`inventoryChecker.${exp}`))) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { children: t("inventoryChecker.cardsInPack") + `: ${pack.cardsInPack}` })] })] }) }) }, pack.name), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: `${pack.name}ChildrenCardsRow`, className: "row-cols-md-2 row-cols-1 g-4 g-lg-6 mt-0 mb-4", children: pack.cards.map((card, index) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { className: "d-flex justify-content-center", children: (0, jsx_runtime_1.jsx)(CardDetails_1.default, { card: card }, index) }, index))) })] }));
}
exports.default = CardPack;
