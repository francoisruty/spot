"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = exports.err = exports.ok = exports.isErr = exports.isOk = void 0;
function isOk(result) {
    return result.isOk();
}
exports.isOk = isOk;
function isErr(result) {
    return result.isErr();
}
exports.isErr = isErr;
function ok(value) {
    return new Ok(value);
}
exports.ok = ok;
function err(error) {
    return new Err(error);
}
exports.err = err;
function tryCatch(op) {
    try {
        return ok(op());
    }
    catch (e) {
        return err(e);
    }
}
exports.tryCatch = tryCatch;
class Ok {
    constructor(value) {
        this.value = value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return false;
    }
    unwrap() {
        return this.value;
    }
    /**
     * Used mostly with tests
     */
    unwrapOrThrow() {
        return this.value;
    }
    /**
     * Used mostly with tests
     */
    unwrapErrOrThrow() {
        throw new Error();
    }
}
class Err {
    constructor(value) {
        this.value = value;
    }
    isOk() {
        return false;
    }
    isErr() {
        return true;
    }
    unwrapErr() {
        return this.value;
    }
    /**
     * Used mostly with tests
     */
    unwrapOrThrow() {
        throw this.value;
    }
    /**
     * Used mostly with tests
     */
    unwrapErrOrThrow() {
        return this.value;
    }
}
