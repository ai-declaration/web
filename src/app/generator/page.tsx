"use client";

import { useState } from "react";
import ProjectFields from "@/components/generator/project-fields";
import AiEngagement from "@/components/generator/ai-engagement";
import ComplianceSection from "@/components/generator/compliance-section";
import Attestation from "@/components/generator/attestation";
import { useAideclForm } from "@/hooks/use-aidecl-form";

export default function GeneratorPage() {
  const { formData, updateField, errors } = useAideclForm();
  const [complianceMode, setComplianceMode] = useState("standard");

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
        <ComplianceSection
          compliance={formData.compliance || {}}
          governance={formData.governance || {}}
          mode={complianceMode}
          onModeChange={setComplianceMode}
          onChange={updateField}
        />
        <Attestation
          values={formData.signature}
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
