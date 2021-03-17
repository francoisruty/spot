"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
const lib_1 = require("../../lib");
let Validate = class Validate {
    request(body) { }
    response(body) { }
    unprocessableEntityError(body) { }
    internalServerError(body) { }
};
__decorate([
    lib_1.request,
    __param(0, lib_1.body)
], Validate.prototype, "request", null);
__decorate([
    lib_1.response({ status: 200 }),
    __param(0, lib_1.body)
], Validate.prototype, "response", null);
__decorate([
    lib_1.response({ status: 422 }),
    __param(0, lib_1.body)
], Validate.prototype, "unprocessableEntityError", null);
__decorate([
    lib_1.response({ status: 500 }),
    __param(0, lib_1.body)
], Validate.prototype, "internalServerError", null);
Validate = __decorate([
    lib_1.endpoint({
        method: "POST",
        path: "/validate"
    })
], Validate);
exports.Validate = Validate;
