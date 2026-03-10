"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseYamlOrJson } from "@/lib/yaml-utils";
import { validateAidecl, type ValidationResult } from "@/lib/validator";

interface ValidationResultDisplayProps {
  inputText: string;
}

export default function ValidationResultDisplay({ inputText }: ValidationResultDisplayProps) {
  const [result, setResult] = useState<{
    status: "idle" | "valid" | "invalid" | "parse-error";
    format?: string;
    errors: { path: string; message: string }[];
    parseError?: string;
  }>({ status: "idle", errors: [] });

  useEffect(() => {
    if (!inputText.trim()) {
      setResult({ status: "idle", errors: [] });
      return;
    }

    const timer = setTimeout(async () => {
      const parsed = parseYamlOrJson(inputText);

      if (parsed.error) {
        let errorMsg = parsed.error;
        // Try to get line info from yaml parse errors
        try {
          const yaml = await import("js-yaml");
          yaml.load(inputText);
        } catch (e: unknown) {
          if (e && typeof e === "object" && "mark" in e) {
            const mark = (e as { mark: { line: number; column: number } }).mark;
            errorMsg = `Parse error at line ${mark.line + 1}, column ${mark.column + 1}`;
          }
        }
        setResult({ status: "parse-error", errors: [], parseError: errorMsg.slice(0, 500) });
        return;
      }

      const validation: ValidationResult = await validateAidecl(parsed.data);
      if (validation.valid) {
        setResult({ status: "valid", format: parsed.format, errors: [] });
      } else {
        setResult({ status: "invalid", format: parsed.format, errors: validation.errors });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputText]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div aria-live="polite">
          {result.status === "idle" && (
            <p className="text-sm text-muted-foreground">Awaiting input for analysis...</p>
          )}

          {result.status === "valid" && (
            <div className="space-y-2">
              <Badge className="bg-success text-white">Record is Valid</Badge>
              <p className="text-sm text-muted-foreground">
                Detected format: {result.format?.toUpperCase()}
              </p>
            </div>
          )}

          {result.status === "invalid" && (
            <div className="space-y-3">
              <Badge className="bg-error text-white">Validation Failed</Badge>
              <ul className="space-y-1.5">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-sm">
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{err.path}</code>
                    <span className="ml-2 text-muted-foreground">{err.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.status === "parse-error" && (
            <div className="space-y-2">
              <Badge className="bg-error text-white">Parse Error</Badge>
              <p className="text-sm text-muted-foreground">{result.parseError}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
