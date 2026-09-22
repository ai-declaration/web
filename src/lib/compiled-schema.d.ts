// Types for the generated validator. The .js it describes is built by
// scripts/build-validator.mjs and is not checked in.
import type { ErrorObject } from "ajv";

declare const validate: {
  (data: unknown): boolean;
  errors?: ErrorObject[] | null;
};

export default validate;
