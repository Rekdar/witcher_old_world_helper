"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
function BasePage() {
    return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Container, { id: "basePageContainer", fluid: "lg", className: "p-6" }));
}
exports.default = BasePage;
