"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContract = void 0;
const errors_1 = require("../errors");
const locations_1 = require("../locations");
const types_1 = require("../types");
const util_1 = require("../util");
const config_parser_1 = require("./config-parser");
const endpoint_parser_1 = require("./endpoint-parser");
const parser_helpers_1 = require("./parser-helpers");
const security_header_parser_1 = require("./security-header-parser");
/**
 * Parse a root source file to return a contract.
 */
function parseContract(file) {
    const typeTable = new types_1.TypeTable();
    const lociTable = new locations_1.LociTable();
    const klass = parser_helpers_1.getClassWithDecoratorOrThrow(file, "api");
    const decorator = klass.getDecoratorOrThrow("api");
    const decoratorConfig = parser_helpers_1.getDecoratorConfigOrThrow(decorator);
    // Handle name
    const nameProp = parser_helpers_1.getObjLiteralPropOrThrow(decoratorConfig, "name");
    const nameLiteral = parser_helpers_1.getPropValueAsStringOrThrow(nameProp);
    const name = nameLiteral.getLiteralText().trim();
    if (name.length === 0) {
        return util_1.err(new errors_1.ParserError("api name cannot be empty", {
            file: nameLiteral.getSourceFile().getFilePath(),
            position: nameLiteral.getPos()
        }));
    }
    if (!/^[\w\s-]*$/.test(name)) {
        return util_1.err(new errors_1.ParserError("api name may only contain alphanumeric, space, underscore and hyphen characters", {
            file: nameLiteral.getSourceFile().getFilePath(),
            position: nameLiteral.getPos()
        }));
    }
    // Handle description
    const descriptionDoc = parser_helpers_1.getJsDoc(klass);
    const description = descriptionDoc === null || descriptionDoc === void 0 ? void 0 : descriptionDoc.getDescription().trim();
    // Handle Version
    const versionProp = parser_helpers_1.getObjLiteralProp(decoratorConfig, "version");
    const version = versionProp
        ? parser_helpers_1.getPropValueAsStringOrThrow(versionProp).getLiteralText().trim()
        : undefined;
    // Handle config
    const configResult = resolveConfig(klass);
    if (configResult.isErr())
        return configResult;
    const config = configResult.unwrap();
    // Handle security
    const securityHeaderProp = parser_helpers_1.getPropertyWithDecorator(klass, "securityHeader");
    const securityResult = securityHeaderProp &&
        security_header_parser_1.parseSecurityHeader(securityHeaderProp, typeTable, lociTable);
    if (securityResult && securityResult.isErr())
        return securityResult;
    const security = securityResult === null || securityResult === void 0 ? void 0 : securityResult.unwrap();
    // Add location data
    lociTable.addMorphNode(locations_1.LociTable.apiClassKey(), klass);
    lociTable.addMorphNode(locations_1.LociTable.apiDecoratorKey(), decorator);
    lociTable.addMorphNode(locations_1.LociTable.apiNameKey(), nameProp);
    if (descriptionDoc) {
        lociTable.addMorphNode(locations_1.LociTable.apiDescriptionKey(), descriptionDoc);
    }
    // Resolve all related files
    const projectFiles = parser_helpers_1.getSelfAndLocalDependencies(file);
    // Parse all endpoints
    const endpointClasses = projectFiles.reduce((acc, currentFile) => acc.concat(currentFile
        .getClasses()
        .filter(k => k.getDecorator("endpoint") !== undefined)), []);
    const endpointsResult = extractEndpoints(endpointClasses, typeTable, lociTable);
    if (endpointsResult.isErr())
        return endpointsResult;
    const endpoints = endpointsResult.unwrap();
    // Handle Types
    const types = typeTable.toArray();
    const contract = {
        name,
        description,
        types,
        config,
        security,
        endpoints,
        version
    };
    return util_1.ok({ contract, lociTable });
}
exports.parseContract = parseContract;
function resolveConfig(klass) {
    const hasConfigDecorator = klass.getDecorator("config") !== undefined;
    if (hasConfigDecorator) {
        return config_parser_1.parseConfig(klass);
    }
    else {
        return util_1.ok(config_parser_1.defaultConfig());
    }
}
function extractEndpoints(endpointClasses, typeTable, lociTable) {
    const endpointNames = endpointClasses.map(k => k.getNameOrThrow());
    const duplicateEndpointNames = [
        ...new Set(endpointNames.filter((name, index) => endpointNames.indexOf(name) !== index))
    ];
    if (duplicateEndpointNames.length !== 0) {
        const locations = duplicateEndpointNames.reduce((acc, name) => {
            const nameLocations = endpointClasses
                .filter(k => k.getNameOrThrow() === name)
                .map(k => {
                return {
                    file: k.getSourceFile().getFilePath(),
                    position: k.getPos()
                };
            });
            return acc.concat(nameLocations);
        }, []);
        return util_1.err(new errors_1.ParserError("endpoints must have unique names", ...locations));
    }
    const endpoints = [];
    for (const k of endpointClasses) {
        const endpointResult = endpoint_parser_1.parseEndpoint(k, typeTable, lociTable);
        if (endpointResult.isErr())
            return endpointResult;
        endpoints.push(endpointResult.unwrap());
    }
    return util_1.ok(endpoints);
}
