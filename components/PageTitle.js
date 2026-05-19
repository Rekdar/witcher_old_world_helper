"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const HorizontalSpacer_1 = require("./HorizontalSpacer");
const TitleWithUnderline_1 = __importDefault(require("./TitleWithUnderline"));
const BASE_TITLE = "The Witcher: Old World Helper";
function PageTitle({ HeaderText = "Page Title", HeaderUnderline = true, ConditionalRender = HorizontalSpacer_1.conditionalRender.xs, }) {
    (0, react_1.useEffect)(() => {
        document.title = `${HeaderText} | ${BASE_TITLE}`;
        return () => { document.title = BASE_TITLE; };
    }, [HeaderText]);
    return ((0, jsx_runtime_1.jsx)(TitleWithUnderline_1.default, { HeaderText: HeaderText, HeaderUnderline: HeaderUnderline, ConditionalRender: ConditionalRender, HeaderSize: 1 }));
}
exports.default = PageTitle;
