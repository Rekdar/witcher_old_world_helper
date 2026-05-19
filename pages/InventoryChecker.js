"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
const inventory_1 = require("../classes/inventory");
const TitleWithUnderline_1 = __importDefault(require("../components/TitleWithUnderline"));
const CardPack_1 = __importDefault(require("../components/CardPack"));
function inventoryChecker({ t }) {
    const cardPacks = inventory_1.cards;
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "inventoryCheckerContainer", fluid: "lg", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('inventoryChecker.title') }), (0, jsx_runtime_1.jsx)(TitleWithUnderline_1.default, { HeaderText: t('inventoryChecker.cardSubtitle'), HeaderSize: 2 }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: "packRow", className: "mb-2 justify-content-center", children: cardPacks.map((pack) => ((0, jsx_runtime_1.jsx)(CardPack_1.default, { pack: pack, t: t }, pack.name))) }, "packRow")] }));
}
exports.default = inventoryChecker;
