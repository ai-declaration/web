import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

let schemaPromise: Promise<object> | null = null;

async function getSchema(): Promise<object> {
  if (!schemaPromise) {
    schemaPromise = fetch("/schema.json").then((r) => r.json());
  }
  return schemaPromise;
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export async function validateAidecl(data: unknown): Promise<ValidationResult> {
  const schema = await getSchema();
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors: ValidationError[] = (validate.errors || []).map((err) => ({
    path: err.instancePath || "/",
    message: err.message || "Unknown validation error",
  }));

  return { valid: false, errors };
}
