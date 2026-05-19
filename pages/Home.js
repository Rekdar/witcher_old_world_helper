"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const react_bootstrap_1 = require("react-bootstrap");
const saveLoad_1 = require("../util/saveLoad");
function Home({ t }) {
    /*
        Breakpoints
        ============================
        X-Small		 None	<576px
        Small		 sm		≥576px
        Medium		 md		≥768px
        Large		 lg		≥992px
        Extra large	 xl		≥1200px
        XX large	xxl		≥1400px
    */
    const fileInputRef = (0, react_1.useRef)(null);
    const [confirmReset, setConfirmReset] = (0, react_1.useState)(false);
    function handleImport(e) {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        (0, saveLoad_1.importState)(file, () => { window.location.reload(); });
        e.target.value = '';
    }
    function handleReset() {
        (0, saveLoad_1.resetState)();
        setConfirmReset(false);
        window.location.reload();
    }
    return ((0, jsx_runtime_1.jsxs)(Container_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { className: "justify-content-center mb-3 px-3", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Col, { xs: "auto", className: "d-flex gap-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: saveLoad_1.exportState, children: t('home.saveState') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, children: t('home.loadState') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-danger", onClick: () => setConfirmReset(true), children: t('home.resetState') }), (0, jsx_runtime_1.jsx)("input", { ref: fileInputRef, type: "file", accept: ".json", style: { display: 'none' }, onChange: handleImport })] }) }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal, { show: confirmReset, onHide: () => setConfirmReset(false), centered: true, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Header, { closeButton: true, children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Title, { children: t('home.resetConfirmTitle') }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Modal.Body, { children: t('home.resetConfirmBody') }), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Modal.Footer, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "outline-secondary", onClick: () => setConfirmReset(false), children: t('home.resetConfirmCancel') }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "danger", onClick: handleReset, children: t('home.resetConfirmOk') })] })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { xs: 1, md: 2, lg: 3, className: "g-4 p-3", children: t("home.linkedPages").map((page) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card, { className: "h-100", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Img, { variant: "top", src: "" }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: "horizontalCardTextCol", className: "px-0 d-flex", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { id: "horizontalCardTextRow", className: "g-0 flex-grow-1 d-flex", xs: 1, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { children: page.name }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Text, { children: page.desc })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Button, { variant: "secondary", className: 'align-self-end pt-auto m-3 flex-shrink-1', href: page.link, children: page.btn })] }) })] }) }, page))) })] }));
}
exports.default = Home;
