import { Node } from "ts-morph";
/**
 * Loci table is a lookup table for syntax location data.
 */
export declare class LociTable {
    static apiClassKey(): string;
    static apiDecoratorKey(): string;
    static apiNameKey(): string;
    static apiDescriptionKey(): string;
    static endpointClassKey(endpointName: string): string;
    static endpointDecoratorKey(endpointName: string): string;
    static endpointMethodKey(endpointName: string): string;
    static endpointPathKey(endpointName: string): string;
    static endpointTagsKey(endpointName: string): string;
    static endpointTagKey(endpointName: string, tag: string): string;
    static endpointRequestKey(endpointName: string): string;
    static endpointDescriptionKey(endpointName: string): string;
    static typeKey(typeName: string): string;
    private locations;
    constructor(locations?: Map<string, Locus>);
    /**
     * Add a locus to the loci table. If the lookup key is already present, `add` will throw an error.
     *
     * @param key lookup key
     * @param locus target locus
     */
    add(key: string, locus: Locus): void;
    /**
     * Add a locus to the loci table by inferring from a ts-morph node. If the lookup key is already present, `addMorphNode` will throw an error.
     *
     * @param key lookup key
     * @param node ts-morph node
     */
    addMorphNode(key: string, node: Node): void;
    /**
     * Retrieve a locus by lookup key.
     *
     * @param key lookup key
     */
    get(key: string): Locus | undefined;
    /**
     * Retrieve a locus by lookup key or error.
     *
     * @param key lookup key
     */
    getOrError(key: string): Locus;
    /**
     * Check if an exsiting locus matches a ts-morph node.
     *
     * @param key lookup key
     * @param node ts-morph node
     */
    equalsMorphNode(key: string, node: Node): boolean;
}
/**
 * Locus represents a particular position in a file.
 */
export interface Locus {
    file: string;
    line: number;
    column: number;
}
