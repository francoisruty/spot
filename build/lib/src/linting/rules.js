"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableRules = void 0;
const has_discriminator_1 = require("./rules/has-discriminator");
const has_request_payload_1 = require("./rules/has-request-payload");
const has_response_1 = require("./rules/has-response");
const has_response_payload_1 = require("./rules/has-response-payload");
const no_inline_objects_within_unions_1 = require("./rules/no-inline-objects-within-unions");
const no_nullable_arrays_1 = require("./rules/no-nullable-arrays");
const no_nullable_fields_within_request_bodies_1 = require("./rules/no-nullable-fields-within-request-bodies");
const no_omittable_fields_within_response_bodies_1 = require("./rules/no-omittable-fields-within-response-bodies");
exports.availableRules = {
    "has-discriminator": has_discriminator_1.hasDiscriminator,
    "has-request-payload": has_request_payload_1.hasRequestPayload,
    "has-response-payload": has_response_payload_1.hasResponsePayload,
    "has-response": has_response_1.hasResponse,
    "no-inline-objects-within-unions": no_inline_objects_within_unions_1.noInlineObjectsWithinUnions,
    "no-nullable-arrays": no_nullable_arrays_1.noNullableArrays,
    "no-nullable-fields-within-request-bodies": no_nullable_fields_within_request_bodies_1.noNullableFieldsWithinRequestBodies,
    "no-omittable-fields-within-response-bodies": no_omittable_fields_within_response_bodies_1.noOmittableFieldsWithinResponseBodies
};
