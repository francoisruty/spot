"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.parseConfig = void 0;
const util_1 = require("../util");
const parser_helpers_1 = require("./parser-helpers");
function parseConfig(klass) {
    const decorator = klass.getDecoratorOrThrow("config");
    const decoratorConfig = parser_helpers_1.getDecoratorConfigOrThrow(decorator);
    const paramStratProp = parser_helpers_1.getObjLiteralPropOrThrow(decoratorConfig, "paramSerializationStrategy");
    const paramsStrat = defaultConfig();
    const paramStratLiteral = parser_helpers_1.getPropValueAsObjectOrThrow(paramStratProp);
    const queryStrategyProp = parser_helpers_1.getObjLiteralProp(paramStratLiteral, "query");
    if (queryStrategyProp) {
        const queryStratLiteral = parser_helpers_1.getPropValueAsObjectOrThrow(queryStrategyProp);
        const queryArrayStratProp = parser_helpers_1.getObjLiteralProp(queryStratLiteral, "array");
        if (queryArrayStratProp) {
            const queryArrayStratValue = parser_helpers_1.getPropValueAsStringOrThrow(queryArrayStratProp).getLiteralText();
            if (!parser_helpers_1.isQueryParamArrayStrategy(queryArrayStratValue)) {
                throw new Error(`expected a QueryParamArrayStrategy, got ${queryArrayStratValue}`);
            }
            paramsStrat.paramSerializationStrategy.query.array = queryArrayStratValue;
        }
    }
    return util_1.ok(paramsStrat);
}
exports.parseConfig = parseConfig;
function defaultConfig() {
    return {
        paramSerializationStrategy: {
            query: {
                array: "ampersand"
            }
        }
    };
}
exports.defaultConfig = defaultConfig;
