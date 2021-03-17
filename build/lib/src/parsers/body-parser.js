"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const errors_1 = require("../errors");
const util_1 = require("../util");
const type_parser_1 = require("./type-parser");
function parseBody(parameter, typeTable, lociTable) {
    // TODO: retrieve JsDoc as body description https://github.com/dsherret/ts-morph/issues/753
    parameter.getDecoratorOrThrow("body");
    if (parameter.hasQuestionToken()) {
        return util_1.err(new errors_1.OptionalNotAllowedError("@body parameter cannot be optional", {
            file: parameter.getSourceFile().getFilePath(),
            position: parameter.getQuestionTokenNodeOrThrow().getPos()
        }));
    }
    const typeResult = type_parser_1.parseType(parameter.getTypeNodeOrThrow(), typeTable, lociTable);
    if (typeResult.isErr())
        return typeResult;
    // TODO: add loci information
    return util_1.ok({ type: typeResult.unwrap() });
}
exports.parseBody = parseBody;
