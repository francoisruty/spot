"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJSDocExamples = void 0;
const types_1 = require("../types");
const util_1 = require("../util");
const errors_1 = require("../errors");
function extractJSDocExamples(jsDoc, type) {
    // return early if there is no jsDoc available
    if (!jsDoc) {
        return;
    }
    const rawExamples = jsDoc
        .getTags()
        .filter(tag => tag.getTagName() === "example")
        .map(example => example.getComment());
    const parentJsDocNode = jsDoc.getParent();
    if (rawExamples && rawExamples.indexOf(undefined) !== -1) {
        return util_1.err(new errors_1.ParserError("example must not be empty", {
            file: parentJsDocNode.getSourceFile().getFilePath(),
            position: parentJsDocNode.getPos()
        }));
    }
    if (rawExamples && rawExamples.length > 0) {
        const examples = [];
        let exampleError;
        rawExamples.every(example => {
            var _a, _b;
            const exampleName = (_a = example === null || example === void 0 ? void 0 : example.split("\n")[0]) === null || _a === void 0 ? void 0 : _a.trim();
            const exampleValue = (_b = example === null || example === void 0 ? void 0 : example.split("\n")[1]) === null || _b === void 0 ? void 0 : _b.trim();
            if (!exampleName || !exampleValue) {
                exampleError = util_1.err(new errors_1.ParserError("malformed example", {
                    file: parentJsDocNode.getSourceFile().getFilePath(),
                    position: parentJsDocNode.getPos()
                }));
                return false;
            }
            else {
                if (examples.some(ex => ex.name === exampleName)) {
                    exampleError = util_1.err(new errors_1.ParserError("duplicate example name", {
                        file: parentJsDocNode.getSourceFile().getFilePath(),
                        position: parentJsDocNode.getPos()
                    }));
                    return false;
                }
                if (type.kind === types_1.TypeKind.STRING &&
                    (!exampleValue.startsWith('"') || !exampleValue.endsWith('"'))) {
                    exampleError = util_1.err(new errors_1.ParserError("string examples must be quoted", {
                        file: parentJsDocNode.getSourceFile().getFilePath(),
                        position: parentJsDocNode.getPos()
                    }));
                    return false;
                }
                try {
                    const parsedValue = JSON.parse(exampleValue);
                    examples.push({ name: exampleName, value: parsedValue });
                }
                catch (e) {
                    exampleError = util_1.err(new errors_1.ParserError("could not parse example", {
                        file: parentJsDocNode.getSourceFile().getFilePath(),
                        position: parentJsDocNode.getPos()
                    }));
                    return false;
                }
                return true;
            }
        });
        if (exampleError) {
            return exampleError;
        }
        const typeOf = (value) => {
            if (/^-?\d+$/.test(value)) {
                return "number";
            }
            if (typeof value === "boolean") {
                return "boolean";
            }
            return "string";
        };
        const typeOfExamples = examples.map(ex => {
            return typeOf(ex.value);
        });
        const spotTypesToJSTypesMap = new Map();
        spotTypesToJSTypesMap.set(types_1.TypeKind.INT32, "number");
        spotTypesToJSTypesMap.set(types_1.TypeKind.INT64, "number");
        spotTypesToJSTypesMap.set(types_1.TypeKind.FLOAT, "number");
        spotTypesToJSTypesMap.set(types_1.TypeKind.DOUBLE, "number");
        const typeSpecified = spotTypesToJSTypesMap.get(type.kind) || type.kind;
        if (typeOfExamples.some(typeOfExample => typeOfExample !== typeSpecified)) {
            return util_1.err(new errors_1.ParserError("type of example must match type of param", {
                file: parentJsDocNode.getSourceFile().getFilePath(),
                position: parentJsDocNode.getPos()
            }));
        }
        return util_1.ok(examples);
    }
    return;
}
exports.extractJSDocExamples = extractJSDocExamples;
