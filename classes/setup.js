"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSteps = exports.playerSetup = exports.randomizeSkelligeBoatStartingLocations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_bootstrap_1 = require("react-bootstrap");
const terrains_1 = require("./terrains");
const generic_1 = require("../util/generic");
const coastalLocations = (0, terrains_1.getTerrainLocations)({ coastal: true });
/**
 * Gets all coastal TerrainLocations, shuffles them, and returns 3. For boat
 * placement in Setup.
 * @returns Three random TerrainLocations that are valid locations for boats.
 */
function randomizeSkelligeBoatStartingLocations() {
    const locs = (0, generic_1.shuffle)(coastalLocations).slice(0, 3);
    return locs.slice(0, 3);
}
exports.randomizeSkelligeBoatStartingLocations = randomizeSkelligeBoatStartingLocations;
/**
 * Generates a string composed of the expansion names in order to access the translation key in
 * locales/[lang]/translation.json
 * @param w Wild Hunt expansion boolean
 * @param m Mages expansion boolean
 * @param mT Monster Trail expansion boolean
 * @returns Constructed string composed of the expansions used for translation key
 */
function playerSetup(w, m, mT) {
    let name = "base";
    if (w)
        name = "wildHunt";
    if (m)
        name += "Mages";
    if (mT)
        name += "MonsterTrail";
    return "setupHelper.base.playerSetup." + name;
}
exports.playerSetup = playerSetup;
// TODO: update this to a functional component
function compileSteps(t, legendaryHunt = false, mages = false, monsterPack = false, monsterTrail = false, skellige = false, adventurePack = false, wildHunt = false, numPlayers = 1) {
    if (numPlayers < 1 || numPlayers > 5) {
        throw new Error(t('setupHelper.error'));
    }
    const finalSteps = [];
    let tempElem = {}, tempArr = [];
    finalSteps.push(t('setupHelper.base.1'));
    if (legendaryHunt)
        finalSteps.push(t('setupHelper.legendaryHunt.help'));
    if (wildHunt) {
        finalSteps.push((0, jsx_runtime_1.jsxs)("div", { children: [t('setupHelper.wildHunt.difficultyTitle'), (0, jsx_runtime_1.jsxs)(react_bootstrap_1.Table, { className: 'lh-base', style: { tableLayout: 'fixed' }, children: [(0, jsx_runtime_1.jsx)("thead", { style: { textAlign: 'center', verticalAlign: 'middle' }, children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: t('setupHelper.wildHunt.easy') }), (0, jsx_runtime_1.jsx)("th", { children: t('setupHelper.wildHunt.medium') }), (0, jsx_runtime_1.jsx)("th", { children: t('setupHelper.wildHunt.hard') }), (0, jsx_runtime_1.jsx)("th", { children: t('setupHelper.wildHunt.veryHard') })] }) }), (0, jsx_runtime_1.jsx)("tbody", { style: { textAlign: 'center', verticalAlign: 'middle' }, children: (0, jsx_runtime_1.jsx)("tr", { children: t(`setupHelper.wildHunt.difficultyValues.${numPlayers}`).map((text, index) => ((0, jsx_runtime_1.jsx)("td", { style: { whiteSpace: 'pre-wrap', borderBottom: 'none' }, children: text }, index))) }) })] })] }));
        finalSteps.push(t('setupHelper.wildHunt.manage'));
    }
    const locations = randomizeSkelligeBoatStartingLocations();
    if (skellige) {
        finalSteps.push((0, jsx_runtime_1.jsxs)("div", { children: [t('setupHelper.skellige.playmat.0'), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: t('setupHelper.skellige.playmat.1') }, 0), (0, jsx_runtime_1.jsxs)("li", { children: [t('setupHelper.skellige.playmat.2'), (0, jsx_runtime_1.jsx)("ul", { children: locations.map((loc, idx) => ((0, jsx_runtime_1.jsxs)("li", { children: [t(`locationTokens.${loc.name}`), ", ", loc.num] }, idx))) })] }, 1)] }), t('setupHelper.skellige.board.0'), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: t('setupHelper.skellige.board.1') }), (0, jsx_runtime_1.jsx)("li", { children: t('setupHelper.skellige.board.2') }), (0, jsx_runtime_1.jsx)("li", { children: t('setupHelper.skellige.board.3') }), (0, jsx_runtime_1.jsx)("li", { children: t('setupHelper.skellige.board.4') })] })] }));
    }
    // step
    finalSteps.push(t('setupHelper.base.actionCards'));
    // step
    if (mages)
        finalSteps.push(t('setupHelper.magesExp.actionCards'));
    // step
    finalSteps.push(t(`setupHelper.base.attrTrophies.${numPlayers}`));
    tempElem = {};
    // step
    if (monsterTrail)
        finalSteps.push(t('setupHelper.monsterTrail.mutagen'));
    // step
    finalSteps.push(t('setupHelper.base.potions'));
    // step
    if (monsterTrail)
        finalSteps.push(t('setupHelper.monsterTrail.bomb'));
    if (wildHunt) {
        finalSteps.push(t('setupHelper.wildHunt.createExplorationDeck', { num: numPlayers > 3 ? 3 : 4 }));
        finalSteps.push(t('setupHelper.wildHunt.decks'));
    }
    else {
        finalSteps.push(t('setupHelper.base.decks'));
        if (skellige)
            finalSteps.push(t('setupHelper.skellige.decks'));
        if (skellige && !wildHunt)
            finalSteps.push(t(`setupHelper.skellige.${monsterTrail ? 'dagonMT' : 'dagon'}`));
        if (monsterPack && skellige)
            finalSteps.push(t('setupHelper.skellige.siren'));
        tempElem = {};
    }
    // Adventure Pack and Wild Hunt are mutually exclusive
    let expansion = "base";
    if (adventurePack)
        expansion = "adventurePack";
    if (wildHunt)
        expansion = "wildHunt";
    finalSteps.push(t(`setupHelper.${expansion}.tokens`));
    finalSteps.push(t('setupHelper.base.locationTokens'));
    // create array of string list items to generate ordered list
    tempArr = [];
    tempArr.push(t('setupHelper.base.monsterSetup.0'));
    if (wildHunt) {
        tempArr.push(t('setupHelper.wildHunt.monsterSetup.0'));
        tempArr.push(t('setupHelper.wildHunt.monsterSetup.1'));
    }
    else {
        if (numPlayers > 3)
            tempArr.push(t('setupHelper.base.monsterSetup.1', { count: numPlayers - 3 }));
        tempArr.push(t(`setupHelper.base.monsterSetup.2.${numPlayers}`));
        tempArr.push(t('setupHelper.base.monsterSetup.3'));
        tempArr.push(t('setupHelper.base.monsterSetup.4'));
    }
    if (monsterTrail)
        tempArr.push(t('setupHelper.monsterTrail.lgCards'));
    tempElem = ((0, jsx_runtime_1.jsxs)("div", { children: [t('setupHelper.base.monsterSetup.5'), (0, jsx_runtime_1.jsx)("ol", { type: 'a', children: tempArr.map((text, id) => ((0, jsx_runtime_1.jsx)("li", { children: text }, id))) })] }));
    finalSteps.push(tempElem);
    tempElem = {}, tempArr = [];
    if (monsterTrail)
        finalSteps.push(t('setupHelper.monsterTrail.spFightCards'));
    wildHunt ? expansion = "wildHunt" : expansion = "base";
    finalSteps.push(t(`setupHelper.${expansion}.monsterFightDeck`));
    if (legendaryHunt)
        finalSteps.push(t('setupHelper.legendaryHunt.choose'));
    if (wildHunt)
        finalSteps.push(...t('setupHelper.wildHunt.enemies'));
    finalSteps.push(t('setupHelper.base.startingPlayer'));
    tempArr.push(t(playerSetup(wildHunt, mages, monsterTrail)));
    if (numPlayers > 1)
        tempArr.push(t('setupHelper.base.playerSetup.trophyCards', {
            context: mages ? "witchermagetrophy" : "witchertrophy",
            count: numPlayers - 1
        }));
    if (mages)
        tempArr.push(t('setupHelper.base.playerSetup.ifMage'));
    tempArr.push(t(`setupHelper.base.playerSetup.${mages ? 'markersMages' : 'markers'}`));
    if (numPlayers > 3)
        tempArr.push(t('setupHelper.base.playerSetup.raiseAttr'));
    if (!wildHunt)
        tempArr.push(t('setupHelper.base.playerSetup.token'));
    tempArr.push(t('setupHelper.base.playerSetup.cards'));
    tempArr.push(t('setupHelper.base.playerSetup.miniature'));
    if (wildHunt) {
        tempArr.push(t('setupHelper.base.playerSetup.drawWildHunt'));
    }
    else {
        tempArr.push((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('setupHelper.base.playerSetup.drawBaseHeader'), (0, jsx_runtime_1.jsx)("ul", { children: t(`setupHelper.base.playerSetup.drawBaseResources.${numPlayers}`).map((text, index) => ((0, jsx_runtime_1.jsx)("li", { children: text }, numPlayers + "-" + index))) })] }));
    }
    tempElem = ((0, jsx_runtime_1.jsxs)("div", { children: [t('setupHelper.base.playerSetup.title'), (0, jsx_runtime_1.jsx)("ol", { type: 'a', children: tempArr.map((text, id) => ((0, jsx_runtime_1.jsx)("li", { children: text }, id))) })] }));
    finalSteps.push(tempElem);
    tempElem = {}, tempArr = [];
    if (numPlayers > 1 && wildHunt)
        finalSteps.push(t('setupHelper.wildHunt.movementPool'));
    if (monsterTrail)
        finalSteps.push(t('setupHelper.monsterTrail.weaknessTokens'));
    if (legendaryHunt)
        finalSteps.push(t('setupHelper.legendaryHunt.movementDeck'));
    if (adventurePack)
        finalSteps.push(t('setupHelper.adventurePack.lostMount'));
    return finalSteps;
}
exports.compileSteps = compileSteps;
