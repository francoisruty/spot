"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const output_1 = require("../../../lib/src/io/output");
class Init extends command_1.Command {
    async run() {
        if (fs_extra_1.default.existsSync("api.ts")) {
            this.error(`There is already an API here!`);
        }
        output_1.outputFile(".", "api.ts", `import { api, body, endpoint, request, response, String } from "@airtasker/spot";

@api({ name: "my-api" })
class Api {}

@endpoint({
  method: "POST",
  path: "/users"
})
class CreateUser {
  @request
  request(
    @body body: CreateUserRequest
  ) {}

  @response({ status: 201 })
  successfulResponse(
    @body body: CreateUserResponse
  ) {}
}

interface CreateUserRequest {
  firstName: String;
  lastName: String;
}

interface CreateUserResponse {
  firstName: String;
  lastName: String;
  role: String;
}
`, false);
        output_1.outputFile(".", "tsconfig.json", JSON.stringify({
            compilerOptions: {
                target: "esnext",
                module: "esnext",
                moduleResolution: "node",
                experimentalDecorators: true
            }
        }, null, 2), false);
        output_1.outputFile(".", "package.json", JSON.stringify({}, null, 2), false);
        child_process_1.execSync(`yarn add @airtasker/spot`, {
            stdio: "inherit"
        });
    }
}
exports.default = Init;
Init.description = "Generates the boilerplate for an API.";
Init.examples = [
    `$ spot init
Generated the following files:
- api.ts
- tsconfig.json
- package.json
`
];
Init.flags = {
    help: command_1.flags.help({ char: "h" })
};
