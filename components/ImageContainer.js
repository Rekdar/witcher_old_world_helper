"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_image_magnifiers_1 = require("@vanyapr/react-image-magnifiers");
function ImageContainer({ src, name, style }) {
    return ((0, jsx_runtime_1.jsx)(react_image_magnifiers_1.SideBySideMagnifier, { id: `${name}IconImage`, imageSrc: src, imageAlt: name, mouseActivation: react_image_magnifiers_1.MOUSE_ACTIVATION.CLICK, touchActivation: react_image_magnifiers_1.TOUCH_ACTIVATION.TAP, alwaysInPlace: true, transitionSpeed: 0.1, style: style }));
}
exports.default = ImageContainer;
