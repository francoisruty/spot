"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeNotAllowedError = exports.OptionalNotAllowedError = exports.ParserError = void 0;
class ParserError extends Error {
    constructor(message, ...locations) {
        super(message); // 'Error' breaks prototype chain here
        this.message = message;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.locations = locations;
    }
}
exports.ParserError = ParserError;
class OptionalNotAllowedError extends ParserError {
}
exports.OptionalNotAllowedError = OptionalNotAllowedError;
class TypeNotAllowedError extends ParserError {
}
exports.TypeNotAllowedError = TypeNotAllowedError;
