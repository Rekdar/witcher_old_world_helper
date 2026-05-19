"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainTokenDeck = exports.WaterTokensSkellige = exports.ForestTokensSkellige = exports.MountainTokensSkellige = exports.WaterTokens = exports.ForestTokens = exports.MountainTokens = exports.WaterToken = exports.ForestToken = exports.MountainToken = exports.TOKEN_MAP_POSITIONS = exports.getTokenImgSrc = exports.getTerrainLocations = exports.terrainLocations = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Row_1 = __importDefault(require("react-bootstrap/Row"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const Image_1 = __importDefault(require("react-bootstrap/Image"));
const dataClasses_1 = require("./dataClasses");
const beheltNar = {
    name: "Behelt Nar",
    num: 0,
    type: "Any",
    coastal: false
};
const kaerSeren = {
    name: "Kaer Seren",
    num: 1,
    type: "Water",
    coastal: true
};
const hengfors = {
    name: "Hengfors",
    num: 2,
    type: "Water",
    coastal: false
};
const kaerMorhen = {
    name: "Kaer Morhen",
    num: 3,
    type: "Water",
    coastal: false
};
const banArd = {
    name: "Ban Ard",
    num: 4,
    type: "Water",
    coastal: false
};
const cidaris = {
    name: "Cidaris",
    num: 5,
    type: "Water",
    coastal: true
};
const novigrad = {
    name: "Novigrad",
    num: 6,
    type: "Water",
    coastal: true
};
const vizima = {
    name: "Vizima",
    num: 7,
    type: "Water",
    coastal: false
};
const vengerberg = {
    name: "Vengerberg",
    num: 8,
    type: "Water",
    coastal: false
};
const cintra = {
    name: "Cintra",
    num: 9,
    type: "Water",
    coastal: true
};
const haernCaduch = {
    name: "Haern Caduch",
    num: 10,
    type: "Water",
    coastal: false
};
const beauclair = {
    name: "Beauclair",
    num: 11,
    type: "Water",
    coastal: false
};
const glenmore = {
    name: "Glenmore",
    num: 12,
    type: "Water",
    coastal: true
};
const doldeth = {
    name: "Doldeth",
    num: 13,
    type: "Water",
    coastal: true
};
const locIchaer = {
    name: "Loc Ichaer",
    num: 14,
    type: "Water",
    coastal: false
};
const gorthurGvaed = {
    name: "Gorthur Gvaed",
    num: 15,
    type: "Water",
    coastal: false
};
const dhuwod = {
    name: "Dhuwod",
    num: 16,
    type: "Water",
    coastal: false
};
const stygga = {
    name: "Stygga",
    num: 17,
    type: "Water",
    coastal: false
};
const ardModron = {
    name: "Ard Modron",
    num: 18,
    type: "Water",
    coastal: false
};
const ardSkellig = {
    name: "Ard Skellig",
    num: 19,
    type: "Water",
    coastal: false
};
const isleOfMists = {
    name: "Isle of Mists",
    num: 20,
    type: "Water",
    coastal: false
};
const eyna = {
    name: "Eyna",
    num: 21,
    type: "Water",
    coastal: false
};
exports.terrainLocations = [
    beheltNar, kaerSeren, hengfors, kaerMorhen, banArd, cidaris, novigrad, vizima, vengerberg, cintra, haernCaduch,
    beauclair, glenmore, doldeth, locIchaer, gorthurGvaed, dhuwod, stygga, ardModron, ardSkellig, isleOfMists, eyna
];
/**
 * Fetches a list of terrainLocation objects and returns them.
 * @param reqAttrs Add the attribute(s) and value you wish to categorize your desired terrain locations by.
 *
 * TODO: Add support for equations for number, e.g. '> 15' or '5 < x < 20'
 */
function getTerrainLocations(reqAttrs) {
    let retArray = [];
    retArray = exports.terrainLocations.filter((loc) => {
        return loc.num === reqAttrs.num || loc.type === reqAttrs.type || loc.coastal === reqAttrs.coastal;
    });
    return retArray;
}
exports.getTerrainLocations = getTerrainLocations;
class TerrainTokenClass {
    constructor() {
        this.name = "DefaultTokenName";
        this.imgStr = "";
    }
    img() {
        return ((0, jsx_runtime_1.jsx)(Container_1.default, { id: 'TokenContainer', className: 'px-4 py-2 m-2', children: (0, jsx_runtime_1.jsx)(Row_1.default, { className: "justify-content-center", children: (0, jsx_runtime_1.jsx)(Col_1.default, { xs: 'auto', children: (0, jsx_runtime_1.jsx)(Image_1.default, { id: `${this.name}IconImage`, src: require(`../img/tokens/reducedTerrainTokens/${this.imgStr}.png`), width: 150, alt: this.name, loading: 'lazy', roundedCircle: true }) }) }) }));
    }
}
class MountainToken extends TerrainTokenClass {
    constructor(number = -1, name = "DefaultMountainToken", img = "MountainBack") {
        super();
        this.name = name;
        this.number = number;
        this.type = "Mountain";
        this.imgStr = img;
    }
}
exports.MountainToken = MountainToken;
class ForestToken extends TerrainTokenClass {
    constructor(number = -1, name = "DefaultForestToken", img = "ForestBack") {
        super();
        this.name = name;
        this.number = number;
        this.type = "Forest";
        this.imgStr = img;
    }
}
exports.ForestToken = ForestToken;
class WaterToken extends TerrainTokenClass {
    constructor(number = -1, name = "DefaultWaterToken", img = "WaterBack") {
        super();
        this.name = name;
        this.number = number;
        this.type = "Water";
        this.imgStr = img;
    }
}
exports.WaterToken = WaterToken;
const MountainTokens = [
    new MountainToken(2, "Hengfors", "Mountain2Hengfors"),
    new MountainToken(3, "Kaer Morhen", "Mountain3KaerMorhen"),
    new MountainToken(9, "Cintra", "Mountain9Cintra"),
    new MountainToken(11, "Beauclair", "Mountain11Beauclair"),
    new MountainToken(13, "Doldeth", "Mountain13Doldeth"),
    new MountainToken(18, "Ard Modron", "Mountain18ArdModron"),
];
exports.MountainTokens = MountainTokens;
const MountainTokensSkellige = [
    new MountainToken(2, "Hengfors", "Mountain2Hengfors"),
    new MountainToken(3, "Kaer Morhen", "Mountain3KaerMorhen"),
    new MountainToken(9, "Cintra", "Mountain9Cintra"),
    new MountainToken(11, "Beauclair", "Mountain11Beauclair"),
    new MountainToken(13, "Doldeth", "Mountain13Doldeth"),
    new MountainToken(18, "Ard Modron", "Mountain18ArdModron"),
    new MountainToken(19, "Ard Skellig", "Mountain19ArdSkellig")
];
exports.MountainTokensSkellige = MountainTokensSkellige;
const ForestTokens = [
    new ForestToken(6, "Novigrad", "Forest6Novigrad"),
    new ForestToken(7, "Vizima", "Forest7Vizima"),
    new ForestToken(8, "Vengerberg", "Forest8Vengerberg"),
    new ForestToken(10, "Haern Caduch", "Forest10HaernCaduch"),
    new ForestToken(16, "Dhuwod", "Forest16Dhuwod"),
    new ForestToken(17, "Stygga", "Forest17Stygga"),
];
exports.ForestTokens = ForestTokens;
const ForestTokensSkellige = [
    new ForestToken(6, "Novigrad", "Forest6Novigrad"),
    new ForestToken(7, "Vizima", "Forest7Vizima"),
    new ForestToken(8, "Vengerberg", "Forest8Vengerberg"),
    new ForestToken(10, "Haern Caduch", "Forest10HaernCaduch"),
    new ForestToken(16, "Dhuwod", "Forest16Dhuwod"),
    new ForestToken(17, "Stygga", "Forest17Stygga"),
    new ForestToken(21, "Eyna", "Forest21Eyna")
];
exports.ForestTokensSkellige = ForestTokensSkellige;
const WaterTokens = [
    new WaterToken(1, "Kaer Seren", "Water1KaerSeren"),
    new WaterToken(4, "Ban Ard", "Water4BanArd"),
    new WaterToken(5, "Cidaris", "Water5Cidaris"),
    new WaterToken(12, "Glenmore", "Water12Glenmore"),
    new WaterToken(14, "Loc Ichaer", "Water14LocIchaer"),
    new WaterToken(15, "Gorthur Gvaed", "Water15GorthurGvaed"),
];
exports.WaterTokens = WaterTokens;
const WaterTokensSkellige = [
    new WaterToken(1, "Kaer Seren", "Water1KaerSeren"),
    new WaterToken(4, "Ban Ard", "Water4BanArd"),
    new WaterToken(5, "Cidaris", "Water5Cidaris"),
    new WaterToken(12, "Glenmore", "Water12Glenmore"),
    new WaterToken(14, "Loc Ichaer", "Water14LocIchaer"),
    new WaterToken(15, "Gorthur Gvaed", "Water15GorthurGvaed"),
    new WaterToken(20, "Isle of Mists", "Water20IsleOfMists")
];
exports.WaterTokensSkellige = WaterTokensSkellige;
function getTokenImgSrc(imgStr) {
    return require(`../img/tokens/reducedTerrainTokens/${imgStr}.png`);
}
exports.getTokenImgSrc = getTokenImgSrc;
exports.TOKEN_MAP_POSITIONS = {
    Forest10HaernCaduch: { x: 669, y: 824 },
    Forest16Dhuwod: { x: 534, y: 1385 },
    Forest17Stygga: { x: 960, y: 1350 },
    Forest6Novigrad: { x: 291, y: 399 },
    Forest7Vizima: { x: 647, y: 426 },
    Forest8Vengerberg: { x: 1166, y: 485 },
    Mountain11Beauclair: { x: 1107, y: 851 },
    Mountain13Doldeth: { x: 285, y: 1229 },
    Mountain18ArdModron: { x: 1300, y: 1385 },
    Mountain2Hengfors: { x: 711, y: 192 },
    Mountain3KaerMorhen: { x: 1217, y: 119 },
    Mountain9Cintra: { x: 171, y: 740 },
    Water12Glenmore: { x: 240, y: 995 },
    Water14LocIchaer: { x: 794, y: 1154 },
    Water15GorthurGvaed: { x: 1319, y: 1089 },
    Water1KaerSeren: { x: 174, y: 209 },
    Water4BanArd: { x: 1266, y: 278 },
    Water5Cidaris: { x: 101, y: 512 },
};
class TerrainTokenDeck {
    constructor(skellige = false) {
        this.skellige = skellige;
        if (skellige === true) {
            this.mountainDeck = new dataClasses_1.ReadonlyDeck(MountainTokensSkellige);
            this.forestDeck = new dataClasses_1.ReadonlyDeck(ForestTokensSkellige);
            this.waterDeck = new dataClasses_1.ReadonlyDeck(WaterTokensSkellige);
            this.allDeck = new dataClasses_1.ReadonlyDeck([...MountainTokensSkellige, ...ForestTokensSkellige, ...WaterTokensSkellige]);
        }
        else {
            this.mountainDeck = new dataClasses_1.ReadonlyDeck(MountainTokens);
            this.forestDeck = new dataClasses_1.ReadonlyDeck(ForestTokens);
            this.waterDeck = new dataClasses_1.ReadonlyDeck(WaterTokens);
            this.allDeck = new dataClasses_1.ReadonlyDeck([...MountainTokens, ...ForestTokens, ...WaterTokens]);
        }
        this.mountainDeck.shuffle();
        this.forestDeck.shuffle();
        this.waterDeck.shuffle();
    }
    drawMountainToken() {
        try {
            return this.mountainDeck.draw();
        }
        catch (error) {
            this.mountainDeck.repopulate();
        }
        return this.mountainDeck.draw();
    }
    drawForestToken() {
        try {
            return this.forestDeck.draw();
        }
        catch (error) {
            this.forestDeck.repopulate();
        }
        return this.forestDeck.draw();
    }
    drawWaterToken() {
        try {
            return this.waterDeck.draw();
        }
        catch (error) {
            this.waterDeck.repopulate();
        }
        return this.waterDeck.draw();
    }
    addTokenBackToDeck(token) {
        if (token.type === "Mountain" && token instanceof MountainToken) {
            this.mountainDeck.returnItem(token);
        }
        else if (token.type === "Forest" && token instanceof ForestToken) {
            this.forestDeck.returnItem(token);
        }
        else if (token.type === "Water" && token instanceof WaterToken) {
            this.waterDeck.returnItem(token);
        }
        else {
            throw new Error(`TerrainToken ${token}'s type ${token.type} is not a valid match.` +
                `Can only add "Mountain", "Forest", and "Water".`);
        }
    }
    refillDeck(type) {
        if (type === "Mountain") {
            this.mountainDeck.repopulate();
        }
        else if (type === "Forest") {
            this.forestDeck.repopulate();
        }
        else if (type === "Water") {
            this.waterDeck.repopulate();
        }
        else {
            throw new Error(`TerrainType ${type} is not a valid match. Can only add "Mountain", "Forest", and "Water".`);
        }
    }
    refillAllDecks() {
        this.refillDeck("Mountain");
        this.refillDeck("Forest");
        this.refillDeck("Water");
    }
}
exports.default = TerrainTokenDeck;
exports.TerrainTokenDeck = TerrainTokenDeck;
