import yaml from "js-yaml";

export function toYaml(data: unknown): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

export function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function parseYamlOrJson(text: string): { data: unknown; format: string; error: string | null } {
  if (text.length > 500_000) {
    return { data: null, format: "unknown", error: "Input too large (max 500KB)" };
  }

  try {
    const data = yaml.load(text);
    if (typeof data === "object" && data !== null) {
      return { data, format: "yaml", error: null };
    }
  } catch { /* try JSON next */ }

  try {
    const data = JSON.parse(text);
    return { data, format: "json", error: null };
  } catch { /* neither worked */ }

  return { data: null, format: "unknown", error: "Could not parse as YAML or JSON" };
}
