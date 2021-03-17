"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LociTable = void 0;
/**
 * Loci table is a lookup table for syntax location data.
 */
class LociTable {
    constructor(locations = new Map()) {
        this.locations = locations;
    }
    static apiClassKey() {
        return "api_class";
    }
    static apiDecoratorKey() {
        return "api_decorator";
    }
    static apiNameKey() {
        return "api_name";
    }
    static apiDescriptionKey() {
        return "api_description";
    }
    static endpointClassKey(endpointName) {
        return `endpoint_<${endpointName}>_class`;
    }
    static endpointDecoratorKey(endpointName) {
        return `endpoint_<${endpointName}>_decorator`;
    }
    static endpointMethodKey(endpointName) {
        return `endpoint_<${endpointName}>_method`;
    }
    static endpointPathKey(endpointName) {
        return `endpoint_<${endpointName}>_path`;
    }
    static endpointTagsKey(endpointName) {
        return `endpoint_<${endpointName}>_tags`;
    }
    static endpointTagKey(endpointName, tag) {
        return `endpoint_<${endpointName}>_tag_<${tag}>`;
    }
    static endpointRequestKey(endpointName) {
        return `endpoint_<${endpointName}>_request`;
    }
    static endpointDescriptionKey(endpointName) {
        return `endpoint_<${endpointName}>_description`;
    }
    static typeKey(typeName) {
        return `type_<${typeName}>`;
    }
    /**
     * Add a locus to the loci table. If the lookup key is already present, `add` will throw an error.
     *
     * @param key lookup key
     * @param locus target locus
     */
    add(key, locus) {
        if (this.locations.has(key)) {
            throw new Error(`Key already present in type table: ${key}`);
        }
        this.locations.set(key, locus);
    }
    /**
     * Add a locus to the loci table by inferring from a ts-morph node. If the lookup key is already present, `addMorphNode` will throw an error.
     *
     * @param key lookup key
     * @param node ts-morph node
     */
    addMorphNode(key, node) {
        this.add(key, {
            file: node.getSourceFile().getFilePath(),
            line: node.getStartLineNumber(),
            column: node.getStartLinePos()
        });
    }
    /**
     * Retrieve a locus by lookup key.
     *
     * @param key lookup key
     */
    get(key) {
        return this.locations.get(key);
    }
    /**
     * Retrieve a locus by lookup key or error.
     *
     * @param key lookup key
     */
    getOrError(key) {
        const location = this.get(key);
        if (location === undefined) {
            throw new Error(`Key not present in location table: ${key}`);
        }
        return location;
    }
    /**
     * Check if an exsiting locus matches a ts-morph node.
     *
     * @param key lookup key
     * @param node ts-morph node
     */
    equalsMorphNode(key, node) {
        const existingLocus = this.getOrError(key);
        if (existingLocus.file !== node.getSourceFile().getFilePath() ||
            existingLocus.line !== node.getStartLineNumber() ||
            existingLocus.column !== node.getStartLinePos()) {
            return false;
        }
        return true;
    }
}
exports.LociTable = LociTable;
