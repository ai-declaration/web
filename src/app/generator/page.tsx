"use client";

import { useState } from "react";
import ProjectFields from "@/components/generator/project-fields";
import AiEngagement from "@/components/generator/ai-engagement";
import type { AideclDeclaration, AideclTool, FormErrors } from "@/lib/aidecl-types";

const initialState: AideclDeclaration = {
  schema_version: "1.0.0",
  content_type: "software",
  project: { name: "" },
  ai_usage: { used: false },
  signature: { declared_by: "", declaration_date: new Date().toISOString().split("T")[0] },
};

export default function GeneratorPage() {
  const [formData, setFormData] = useState<AideclDeclaration>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (path: string, value: unknown) => {
    setFormData((prev) => {
      const next = structuredClone(prev);

      if (path === "project.name") {
        next.project.name = value as string;
        if ((value as string).trim()) {
          setErrors((e) => { const n = { ...e }; delete n["project.name"]; return n; });
        }
      } else if (path === "project.repository") next.project.repository = (value as string) || undefined;
      else if (path === "project.version") next.project.version = (value as string) || undefined;
      else if (path === "project.license") next.project.license = (value as string) || undefined;
      else if (path === "content_type") next.content_type = value as string;
      else if (path === "ai_usage.used") next.ai_usage.used = value as boolean;
      else if (path === "ai_usage.summary") next.ai_usage.summary = value as string;
      else if (path === "ai_usage.level") next.ai_usage.level = value as AideclDeclaration["ai_usage"]["level"];
      else if (path.startsWith("ai_usage.scope.")) {
        const scopeKey = path.split(".").pop()!;
        next.ai_usage.scope = { ...next.ai_usage.scope, [scopeKey]: value };
      } else if (path === "ai_usage.addTool") {
        const tool = value as AideclTool;
        next.ai_usage.tools = [...(next.ai_usage.tools || []), tool];
      } else if (path === "ai_usage.removeTool") {
        const idx = value as number;
        next.ai_usage.tools = (next.ai_usage.tools || []).filter((_, i) => i !== idx);
      } else if (path.startsWith("ai_usage.code_proportion.")) {
        const propKey = path.split(".").pop()!;
        next.ai_usage.code_proportion = { ...next.ai_usage.code_proportion, [propKey]: value };
      }

      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h1 className="text-2xl font-bold">Declaration Generator</h1>
        <ProjectFields
          values={formData.project}
          contentType={formData.content_type || "software"}
          onChange={updateField}
          errors={errors}
        />
        <AiEngagement
          values={formData.ai_usage}
          onChange={updateField}
          errors={errors}
        />
      </div>
      <aside className="lg:col-span-1">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Preview will appear here...</p>
        </div>
      </aside>
    </div>
  );
}
