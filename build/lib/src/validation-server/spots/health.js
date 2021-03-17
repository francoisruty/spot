"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
const lib_1 = require("../../lib");
let HealthCheck = class HealthCheck {
    request() { }
    response() { }
};
__decorate([
    lib_1.request
], HealthCheck.prototype, "request", null);
__decorate([
    lib_1.response({ status: 200 })
], HealthCheck.prototype, "response", null);
HealthCheck = __decorate([
    lib_1.endpoint({
        method: "GET",
        path: "/health"
    })
], HealthCheck);
exports.HealthCheck = HealthCheck;
