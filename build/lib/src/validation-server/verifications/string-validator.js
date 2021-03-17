"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValidator = void 0;
const assert_never_1 = __importDefault(require("assert-never"));
const validator_1 = __importDefault(require("validator"));
const types_1 = require("../../types");
class StringValidator {
    constructor(typeTable) {
        this.messages = [];
        this.typeTable = typeTable;
    }
    static getErrorMessage(input, type) {
        switch (type.kind) {
            case types_1.TypeKind.NULL:
            case types_1.TypeKind.BOOLEAN:
            case types_1.TypeKind.STRING:
            case types_1.TypeKind.FLOAT:
            case types_1.TypeKind.DOUBLE:
            case types_1.TypeKind.INT32:
            case types_1.TypeKind.INT64:
            case types_1.TypeKind.DATE:
            case types_1.TypeKind.DATE_TIME:
            case types_1.TypeKind.INTERSECTION:
                return `"${input}" should be ${type.kind}`;
            case types_1.TypeKind.BOOLEAN_LITERAL:
            case types_1.TypeKind.STRING_LITERAL:
            case types_1.TypeKind.FLOAT_LITERAL:
            case types_1.TypeKind.INT_LITERAL:
                return `"${input}" should be ${type.value}`;
            case types_1.TypeKind.UNION:
                return `"${input}" should be a member of a union`;
            default:
                assert_never_1.default(type);
        }
    }
    run(input, type, isMandatory = true) {
        if (!input.value && !isMandatory)
            return true;
        switch (type.kind) {
            case types_1.TypeKind.NULL:
                return this.validateWithValidator(input, type, validator_1.default.isEmpty);
            case types_1.TypeKind.BOOLEAN:
                return this.validateWithValidator(input, type, (str) => ["true", "false"].includes(str.toLowerCase()));
            case types_1.TypeKind.BOOLEAN_LITERAL:
                return this.validateWithValidator(input, type, (str) => str.toLowerCase() === type.value.toString());
            case types_1.TypeKind.STRING:
                return this.validateWithValidator(input, type, (str) => typeof str === "string");
            case types_1.TypeKind.STRING_LITERAL:
                return this.validateWithValidator(input, type, (str) => typeof str === "string" && str === type.value);
            case types_1.TypeKind.FLOAT:
            case types_1.TypeKind.DOUBLE:
                return this.validateWithValidator(input, type, validator_1.default.isFloat);
            case types_1.TypeKind.FLOAT_LITERAL:
                return this.validateWithValidator(input, type, (str) => validator_1.default.isFloat(str) && Number(str) === type.value);
            case types_1.TypeKind.INT32:
            case types_1.TypeKind.INT64:
                return this.validateWithValidator(input, type, validator_1.default.isInt);
            case types_1.TypeKind.INT_LITERAL:
                return this.validateWithValidator(input, type, (str) => validator_1.default.isInt(str) && Number(str) === type.value);
            case types_1.TypeKind.DATE:
            case types_1.TypeKind.DATE_TIME:
                return this.validateWithValidator(input, type, validator_1.default.isISO8601);
            case types_1.TypeKind.OBJECT:
                return this.validateObject(input, type);
            case types_1.TypeKind.ARRAY:
                return this.validateArray(input, type);
            case types_1.TypeKind.INTERSECTION:
            case types_1.TypeKind.UNION:
                // eslint-disable-next-line no-case-declarations
                const anyValid = type.types.some(t => {
                    const unionStringValidator = new StringValidator(this.typeTable);
                    return unionStringValidator.run(input, t, isMandatory);
                });
                if (!anyValid) {
                    this.messages.push(StringValidator.getErrorMessage(input.name, type));
                }
                return anyValid;
            case types_1.TypeKind.REFERENCE:
                return this.run(input, types_1.dereferenceType(type, this.typeTable));
            default:
                assert_never_1.default(type);
        }
    }
    validateWithValidator(input, type, validatorFn) {
        const isValid = validatorFn(`${input.value}`);
        if (!isValid) {
            this.messages.push(StringValidator.getErrorMessage(input.name, type));
        }
        return isValid;
    }
    validateObject(input, type) {
        const validateProps = () => !type.properties
            .map(p => this.run({
            name: `.${input.name}.${p.name}`,
            value: `${input.value[p.name]}`
        }, p.type, !p.optional))
            .some(v => v === false);
        return input && typeof input === "object" && validateProps();
    }
    validateArray(input, type) {
        const validateItems = () => !input.value
            .map((v, index) => this.run({ name: `${input.name}[${index}]`, value: `${v}` }, type.elementType))
            .some(v => v === false);
        return Array.isArray(input.value) && validateItems();
    }
}
exports.StringValidator = StringValidator;
