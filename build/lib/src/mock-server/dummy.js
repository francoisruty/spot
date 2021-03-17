"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateData = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const randomstring_1 = require("randomstring");
const types_1 = require("../types");
/**
 * Generates dummy data based on a type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateData(types, type) {
    var _a;
    switch (type.kind) {
        case types_1.TypeKind.NULL:
            return null;
        case types_1.TypeKind.BOOLEAN:
            return randomBoolean();
        case types_1.TypeKind.BOOLEAN_LITERAL:
            return type.value;
        case types_1.TypeKind.STRING:
            return randomstring_1.generate();
        case types_1.TypeKind.STRING_LITERAL:
            return type.value;
        case types_1.TypeKind.FLOAT:
        case types_1.TypeKind.DOUBLE:
            return randomDouble(100);
        case types_1.TypeKind.INT32:
            return randomInteger(100);
        case types_1.TypeKind.INT64:
            return Math.pow(2, 50) + randomInteger(10000);
        case types_1.TypeKind.DATE:
        case types_1.TypeKind.DATE_TIME:
            return new Date().toISOString();
        case types_1.TypeKind.INT_LITERAL:
        case types_1.TypeKind.FLOAT_LITERAL:
            return type.value;
        case types_1.TypeKind.OBJECT:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return type.properties.reduce((acc, property) => {
                if (randomBoolean() || !property.optional) {
                    acc[property.name] = generateData(types, property.type);
                }
                return acc;
            }, {});
        case types_1.TypeKind.ARRAY: {
            const size = randomInteger(10);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const array = [];
            for (let i = 0; i < size; i++) {
                array.push(generateData(types, type.elementType));
            }
            return array;
        }
        case types_1.TypeKind.INTERSECTION:
            return type.types.map(type => generateData(types, type));
        case types_1.TypeKind.UNION:
            return generateData(types, type.types[randomInteger(type.types.length - 1)]);
        case types_1.TypeKind.REFERENCE: {
            const referencedType = (_a = types.get(type.name)) === null || _a === void 0 ? void 0 : _a.type;
            if (!referencedType) {
                throw new Error(`Missing referenced type: ${type.name}`);
            }
            return generateData(types, referencedType);
        }
        default:
            throw assert_never_1.default(type);
    }
}
exports.generateData = generateData;
function randomBoolean() {
    return Math.random() > 0.5;
}
function randomInteger(max) {
    return Math.round(randomDouble(max));
}
function randomDouble(max) {
    return Math.random() * max;
}
