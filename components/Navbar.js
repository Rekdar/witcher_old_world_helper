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
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const Nav_1 = __importDefault(require("react-bootstrap/Nav"));
const Navbar_1 = __importDefault(require("react-bootstrap/Navbar"));
const NavDropdown_1 = __importDefault(require("react-bootstrap/NavDropdown"));
const logo192_png_1 = __importDefault(require("../../src/img/logo192.png"));
const useResize_1 = __importDefault(require("../util/useResize"));
const i18n_1 = __importStar(require("../i18n"));
require("../css/Navbar.css");
const titleLimits = {
    cs: 430,
    de: 410,
    en: 390,
    es: 999,
    fr: 510,
    it: 999,
    pl: 485,
};
function brandLimit(language) {
    return titleLimits[language];
}
function Navbar({ t, i18n }) {
    const displaySize = (0, useResize_1.default)();
    return ((0, jsx_runtime_1.jsx)(Navbar_1.default, { collapseOnSelect: true, id: 'Navbar', expand: "lg", bg: "dark", "data-bs-theme": "dark", sticky: "top", children: (0, jsx_runtime_1.jsxs)(Container_1.default, { className: "p-6", fluid: true, children: [(0, jsx_runtime_1.jsxs)(Navbar_1.default.Brand, { href: "#/", className: 'me-0', children: [(0, jsx_runtime_1.jsx)("img", { src: logo192_png_1.default, width: "30", height: "30", className: "d-inline-block align-top" }), " ", displaySize.width < brandLimit(i18n_1.default.language) ? t("navbar.titleShort") : t("navbar.titleLong")] }), (0, jsx_runtime_1.jsx)(Navbar_1.default.Toggle, { "aria-controls": "basic-navbar-nav" }), (0, jsx_runtime_1.jsx)(Navbar_1.default.Collapse, { id: "basic-navbar-nav", children: (0, jsx_runtime_1.jsxs)(Nav_1.default, { className: "ms-auto text-center", children: [(0, jsx_runtime_1.jsxs)(NavDropdown_1.default, { title: t("navbar.gameplayTools"), id: "collapsible-nav-dropdown", children: [(0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/setupHelper", children: t('navbar.setupHelper') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/locationTokens", children: t('navbar.locationTokens') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/monsterRoller", children: t('navbar.monsterRoller') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/lostMount", children: t('navbar.lostMount') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/witcherPicker", children: t('navbar.witcherPicker') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/opponents", children: t('navbar.opponents') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/monsterFight", children: t('navbar.monsterFight') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/dicePoker", children: t('navbar.dicePoker') }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Divider, {}), (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { href: "#/", children: t('navbar.browseAllTools') })] }), (0, jsx_runtime_1.jsx)(NavDropdown_1.default, { title: t("navbar.__flag"), id: "collapsible-nav-dropdown", children: Object.entries(i18n_1.myLangs).map(([code, val]) => (0, jsx_runtime_1.jsx)(NavDropdown_1.default.Item, { onClick: () => i18n.changeLanguage(code), children: val }, code)) })] }) })] }) }));
}
exports.default = Navbar;
