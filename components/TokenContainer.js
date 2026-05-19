"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
function TokenContainer({ t, src, name, tName }) {
    return ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.Container, { id: 'TokenContainer', className: 'mx-auto px-4 py-2', children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: 'TokenContainerImageRow', className: 'justify-content-center', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: 'TokenContainerImageCol', xs: 'auto', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Image, { id: `${name}IconImage`, src: src, height: 150, alt: name, loading: 'lazy' }) }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Row, { id: 'TokenContainerTitleRow', className: 'justify-content-center', children: (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: 'TokenContainerTitleCol', className: 'py-2 mt-2', children: (0, jsx_runtime_1.jsx)("h2", { id: 'TokenContainerTitle', className: "text-center", style: { height: "calc(1.325rem + .9vw)" }, children: name ? t(tName) : "" }) }) })] }));
}
exports.default = TokenContainer;
