"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSecurityHeader = void 0;
const errors_1 = require("../errors");
const types_1 = require("../types");
const util_1 = require("../util");
const parser_helpers_1 = require("./parser-helpers");
const type_parser_1 = require("./type-parser");
function parseSecurityHeader(property, typeTable, lociTable) {
    var _a;
    property.getDecoratorOrThrow("securityHeader");
    if (property.hasQuestionToken()) {
        return util_1.err(new errors_1.OptionalNotAllowedError("@securityHeader property cannot be optional", {
            file: property.getSourceFile().getFilePath(),
            position: property.getQuestionTokenNodeOrThrow().getPos()
        }));
    }
    // Handle name
    const nameResult = extractName(property);
    if (nameResult.isErr())
        return nameResult;
    const name = nameResult.unwrap();
    // Handle description
    const description = (_a = parser_helpers_1.getJsDoc(property)) === null || _a === void 0 ? void 0 : _a.getDescription().trim();
    // Handle type
    const typeResult = extractType(property, typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    const type = typeResult.unwrap();
    return util_1.ok({ name, description, type });
}
exports.parseSecurityHeader = parseSecurityHeader;
function extractName(property) {
    const name = parser_helpers_1.getPropertyName(property);
    if (!/^[\w-]*$/.test(name)) {
        return util_1.err(new errors_1.ParserError("@securityHeader field name may only contain alphanumeric, underscore and hyphen characters", {
            file: property.getSourceFile().getFilePath(),
            position: property.getPos()
        }));
    }
    if (name.length === 0) {
        return util_1.err(new errors_1.ParserError("@securityHeader field name must not be empty", {
            file: property.getSourceFile().getFilePath(),
            position: property.getPos()
        }));
    }
    return util_1.ok(name);
}
function extractType(property, typeTable, lociTable) {
    const typeResult = type_parser_1.parseType(property.getTypeNodeOrThrow(), typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    const rootTypes = types_1.possibleRootTypes(typeResult.unwrap(), typeTable);
    if (rootTypes.some(types_1.isNotStringType)) {
        return util_1.err(new errors_1.ParserError("@securityHeader type may only be a string type", {
            file: property.getSourceFile().getFilePath(),
            position: property.getPos()
        }));
    }
    return typeResult;
}
