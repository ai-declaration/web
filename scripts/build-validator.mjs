// Precompiles public/schema.json into a standalone validator module.
// Ajv normally builds its validators with `new Function` at runtime, which the
// site's Content-Security-Policy blocks. Generating the code up front keeps the
// policy free of 'unsafe-eval'.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { _ } from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import standaloneCode from "ajv/dist/standalone/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = resolve(root, "public/schema.json");
const outPath = resolve(root, "src/lib/compiled-schema.js");

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  code: {
    source: true,
    // The generated module pulls format validators from ajv-formats rather than
    // inlining them, so the bundler resolves this like any other import.
    formats: _`require("ajv-formats/dist/formats").fullFormats`,
  },
});
addFormats(ajv);

const validate = ajv.compile(schema);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, standaloneCode(ajv, validate));

console.log(`validator written to ${outPath.replace(root + "/", "")}`);
