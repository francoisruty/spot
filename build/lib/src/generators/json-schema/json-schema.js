"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJsonSchema = void 0;
const json_schema_type_util_1 = require("./json-schema-type-util");
function generateJsonSchema(contract) {
    return {
        $schema: "http://json-schema.org/draft-07/schema#",
        definitions: contract.types.reduce((acc, typeNode) => {
            acc[typeNode.name] = json_schema_type_util_1.typeToJsonSchemaType(typeNode.typeDef.type);
            return acc;
        }, {})
    };
}
exports.generateJsonSchema = generateJsonSchema;
