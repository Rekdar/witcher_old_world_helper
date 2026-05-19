"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Sets children components to Display only the set breakpoints. This
 * enables opposite behavior of Bootstrap breakpoints that define a
 * value where the behavior starts and works for all larger sizes.
 * @param props
 * @returns
 */
const Display = (props) => {
    // TODO: allow passing in values to each breakpoint to allow choosing the display type, e.g. block, inline, etc
    const { xs, sm, md, lg, xl, children } = props, rest = __rest(props, ["xs", "sm", "md", "lg", "xl", "children"]);
    let className = 'd-none';
    if (xs)
        className += ' d-sm-none d-block ';
    if (sm)
        className += ' d-md-none d-sm-inline ';
    if (md)
        className += ' d-lg-none d-md-inline ';
    if (lg)
        className += ' d-xl-none d-lg-inline ';
    if (xl)
        className += ' d-xl-inline ';
    return ((0, jsx_runtime_1.jsx)("span", Object.assign({ className: className }, rest, { children: children })));
};
exports.Display = Display;
