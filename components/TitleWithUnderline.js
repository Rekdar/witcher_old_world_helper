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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
const HorizontalSpacer_1 = __importStar(require("./HorizontalSpacer"));
/**
 * Custom title class with a minimalist horizontal rule below that adjusts according to tag.
 * Supports h1 through h6. Contains a default margin above the header, regardless of HeaderSize, of 1.5rem.
 *
 * @param {string} [obj.HeaderText] - Text to display in header.
 * @param {boolean} [obj.HeaderUnderline] - (optional) Toggle for underline or not. Default: true
 * @param {number} [obj.HeaderSize] - (optional) Header size; corresponds to html tag, e.g. h1.
 *                                    Allowed values: [1, 2, 3, 4, 5, 6]. Default: 1.
 * @param {conditionalRender} [obj.ConditionalRender] - (optional) Sets HeaderUnderline to conditionally
 *                              render up until the chosen size. Allowed values: conditionalRender enum containing
 *                              [xs, sm, md, lg, xl, xxl]
 * @returns Row containing title with horizontal rule below, if enabled.
 */
function Title({ HeaderText, HeaderUnderline = true, HeaderSize = 1, ConditionalRender = HorizontalSpacer_1.conditionalRender.xs, }) {
    if (HeaderSize < 1)
        HeaderSize = 1;
    if (HeaderSize > 6)
        HeaderSize = 6;
    const Tag = `h${HeaderSize}`;
    return (
    // TODO: Assess if mt-4 is still the right size for smaller headers
    (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { className: 'py-2 mt-4 justify-content-center', id: `${HeaderText}TitleRow`, xs: 1, children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { className: 'mx-auto d-flex justify-content-center', id: `${HeaderText}TitleCol`, xs: 12, children: (0, jsx_runtime_1.jsx)(Tag, { className: 'text-center', children: HeaderText }) }), (0, jsx_runtime_1.jsx)(HorizontalSpacer_1.default, { HeaderUnderline: HeaderUnderline, ConditionalRender: ConditionalRender, Size: HeaderSize })] }));
}
exports.default = Title;
