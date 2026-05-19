"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const react_bootstrap_1 = require("react-bootstrap");
require("../css/CardDetails.css");
function CardImages({ images }) {
    if (images.length === 1) {
        return (0, jsx_runtime_1.jsx)("img", { className: "d-block w-100", src: images[0], alt: images[0].substring(images[0].lastIndexOf('/') + 1) });
    }
    else {
        return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Carousel, { fade: true, children: images.map((img) => ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Carousel.Item, { children: (0, jsx_runtime_1.jsx)("img", { className: "d-block w-100", src: img, alt: img.substring(img.lastIndexOf('/') + 1) }) }, img))) }));
    }
}
function CardDetails({ card }) {
    const { t } = (0, react_i18next_1.useTranslation)('translation', { keyPrefix: 'inventoryChecker' });
    return ((0, jsx_runtime_1.jsx)(react_bootstrap_1.Card, { className: "h-100", style: { maxWidth: "540px" }, children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { id: "horizontalCardRow", className: "g-0 flex-grow-1 overflow-hidden rounded-2", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: "horizontalCardImgCol", className: "px-0 d-flex align-items-center bg-black", children: (0, jsx_runtime_1.jsx)(CardImages, { images: card.exampleImages }) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Col, { id: "horizontalCardTextCol", className: "px-0 d-flex", children: (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Row, { id: "horizontalCardTextRow", className: "g-0 flex-grow-1 d-flex", xs: 1, children: [(0, jsx_runtime_1.jsxs)(react_bootstrap_1.Card.Body, { className: "p-2 p-sm-3", children: [(0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Title, { as: "h5", children: t(card.type) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Text, { children: t(card.expansion) }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.Card.Text, { children: (0, jsx_runtime_1.jsx)("small", { className: "text-body-secondary", children: card.note ? t(`notes.${card.note}`) : '' }) })] }), (0, jsx_runtime_1.jsx)(react_bootstrap_1.ListGroup, { className: "list-group-flush align-self-end flex-grow-1 d-flex pt-auto", children: ["card.numInPack", "card.numSoFar", "card.numTotal"].map((val) => ((0, jsx_runtime_1.jsxs)(react_bootstrap_1.ListGroup.Item, { className: "list-group-item px-2 px-sm-3 py-1 py-sm-2", children: [t(val), ": ", eval(val)] }, val))) })] }) })] }) }));
}
exports.default = CardDetails;
