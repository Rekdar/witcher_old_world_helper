"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalRender = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
var conditionalRender;
(function (conditionalRender) {
    conditionalRender["xs"] = "";
    conditionalRender["sm"] = "d-sm-none";
    conditionalRender["md"] = "d-md-none";
    conditionalRender["lg"] = "d-lg-none";
    conditionalRender["xl"] = "d-xl-none";
    conditionalRender["xxl"] = "d-xxl-none";
})(conditionalRender || (exports.conditionalRender = conditionalRender = {}));
function HorizontalSpacer({ HeaderUnderline = true, ConditionalRender = conditionalRender.xs, Size = 1, }) {
    if (Size < 1)
        Size = 1;
    if (Size > 6)
        Size = 6;
    /**
     * Horizontal header padding, per side
     * h1 - 10%
     * h2 - 15%
     * h3 - 20%
     * h4 - 25%
     * h5 - 30%
     */
    const xPadding = ((Size + 1) * 5);
    const xPaddingStr = `${xPadding}vw`;
    const yPadding = Math.max(0, 4 - Size);
    const yPaddingStr = `my-${yPadding}`;
    return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: 'headerSpacer', className: yPaddingStr, style: { paddingLeft: xPaddingStr, paddingRight: xPaddingStr }, children: HeaderUnderline === true ?
            (0, jsx_runtime_1.jsx)("hr", { className: `my-0 ${ConditionalRender}` })
            : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }));
}
exports.default = HorizontalSpacer;
