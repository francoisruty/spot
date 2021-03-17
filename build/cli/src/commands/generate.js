"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const inquirer_1 = require("inquirer");
const path_1 = __importDefault(require("path"));
const json_schema_1 = require("../../../lib/src/generators/json-schema/json-schema");
const openapi2_1 = require("../../../lib/src/generators/openapi2/openapi2");
const openapi3_1 = require("../../../lib/src/generators/openapi3/openapi3");
const output_1 = require("../../../lib/src/io/output");
const parser_1 = require("../../../lib/src/parser");
class Generate extends command_1.Command {
    async run() {
        const { flags } = this.parse(Generate);
        const { contract: contractPath } = flags;
        let { language, generator, out: outDir } = flags;
        const contractFilename = path_1.default.basename(contractPath, ".ts");
        if (!generator) {
            generator = (await inquirer_1.prompt({
                name: "Generator",
                type: "list",
                choices: availableGenerators()
            })).Generator;
        }
        if (!availableGenerators().includes(generator)) {
            const generatorList = availableGenerators()
                .map(g => `- ${g}`)
                .join("\n");
            this.error(`No such generator ${generator}. Available generators:\n${generatorList}`, { exit: 1 });
        }
        if (!language) {
            language = (await inquirer_1.prompt({
                name: "Language",
                type: "list",
                choices: availableFormats(generator)
            })).Language;
        }
        if (!availableFormats(generator).includes(language)) {
            const formatsList = availableFormats(generator)
                .map(f => `- ${f}`)
                .join("\n");
            this.error(`Language ${language} is unsupported for the generator ${generator}. Supported languages:\n${formatsList}`, { exit: 1 });
        }
        if (!outDir) {
            outDir = (await inquirer_1.prompt({
                name: "Output destination",
                default: "."
            }))["Output destination"];
        }
        const generatorTransformer = generators[generator].transformer;
        const formatTransformer = generators[generator].formats[language].formatter;
        const formatExtension = generators[generator].formats[language].extension;
        const transformedContract = generatorTransformer(parser_1.parse(contractPath));
        const formattedContract = formatTransformer(transformedContract);
        output_1.outputFile(outDir, `${contractFilename}.${formatExtension}`, formattedContract);
    }
}
exports.default = Generate;
Generate.description = "Runs a generator on an API. Used to produce client libraries, server boilerplates and well-known API contract formats such as OpenAPI.";
Generate.examples = [
    `$ spot generate --contract api.ts --language yaml --generator openapi3 --out output/`
];
Generate.flags = {
    help: command_1.flags.help({ char: "h" }),
    contract: command_1.flags.string({
        required: true,
        char: "c",
        description: "Path to a TypeScript Contract definition"
    }),
    language: command_1.flags.string({
        char: "l",
        description: "Language to generate"
    }),
    generator: command_1.flags.string({
        char: "g",
        description: "Generator to run"
    }),
    out: command_1.flags.string({
        char: "o",
        description: "Directory in which to output generated files"
    })
};
function availableGenerators() {
    return Object.keys(generators).sort((a, b) => (a > b ? 1 : -1));
}
function availableFormats(generator) {
    return Object.keys(generators[generator].formats).sort((a, b) => a > b ? 1 : -1);
}
const jsonFormat = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: (obj) => JSON.stringify(obj, null, 2),
    extension: "json"
};
//const yamlFormat: Format = {
//  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  formatter: (obj: Record<string, any>) =>
//    YAML.safeDump(obj, { skipInvalid: true /* for undefined */ }),
//  extension: "yml"
//};
const generators = {
    raw: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformer: (contract) => {
            return contract;
        },
        formats: {
            json: jsonFormat
        }
    },
    "json-schema": {
        transformer: json_schema_1.generateJsonSchema,
        formats: {
            json: jsonFormat,
            //      yaml: yamlFormat
        }
    },
    openapi2: {
        transformer: openapi2_1.generateOpenAPI2,
        formats: {
            json: jsonFormat,
            //      yaml: yamlFormat
        }
    },
    openapi3: {
        transformer: openapi3_1.generateOpenAPI3,
        formats: {
            json: jsonFormat,
            //      yaml: yamlFormat
        }
    }
};
