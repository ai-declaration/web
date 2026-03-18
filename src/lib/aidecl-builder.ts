import type { AideclDeclaration } from "./aidecl-types";

function stripEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "" || value === 0) continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = stripEmpty(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function buildAideclDeclaration(formData: AideclDeclaration): Record<string, unknown> {
  const result = stripEmpty({
    schema_version: formData.schema_version,
    content_type: formData.content_type,
    project: stripEmpty(formData.project as unknown as Record<string, unknown>),
    ai_usage: stripEmpty(formData.ai_usage as unknown as Record<string, unknown>),
    ...(formData.compliance ? { compliance: stripEmpty(formData.compliance as unknown as Record<string, unknown>) } : {}),
    ...(formData.governance ? { governance: stripEmpty(formData.governance as unknown as Record<string, unknown>) } : {}),
    signature: stripEmpty(formData.signature as unknown as Record<string, unknown>),
  });

  return result;
}
