"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
const PageTitle_1 = __importDefault(require("../components/PageTitle"));
function CommunityLinks({ t }) {
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: "CommunityLinksBaseContainer", children: [(0, jsx_runtime_1.jsx)(PageTitle_1.default, { HeaderText: t('communityLinks.title') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { xs: 1, md: 2, lg: 4, className: "g-4 p-2", children: t("communityLinks.links").map((_, idx) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card, { className: "min-h-1000", children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { className: "min-h-1000", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { children: _.title }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Subtitle, { className: "mb-2 text-muted", children: _.subtitle }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Text, { children: _.desc })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Footer, { children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Link, { href: _.link, children: _.title }) })] }) }, idx))) })] }));
}
exports.default = CommunityLinks;
