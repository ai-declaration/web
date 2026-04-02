"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ProjectFields from "@/components/generator/project-fields";
import AiEngagement from "@/components/generator/ai-engagement";
import ComplianceSection from "@/components/generator/compliance-section";
import Attestation from "@/components/generator/attestation";
import SidebarPreview from "@/components/generator/sidebar-preview";
import { useAideclForm } from "@/hooks/use-aidecl-form";
import { EXAMPLES } from "@/lib/examples";
import { parseYamlOrJson } from "@/lib/yaml-utils";
import type { AideclDeclaration } from "@/lib/aidecl-types";

function GeneratorContent() {
  const { formData, updateField, loadPreset, errors, issues, isValid } = useAideclForm();
  const [complianceMode, setComplianceMode] = useState("standard");
  const searchParams = useSearchParams();
  const appliedPreset = useRef<string | null>(null);

  useEffect(() => {
    const preset = searchParams.get("preset");
    if (preset && preset !== appliedPreset.current) {
      const example = EXAMPLES.find((e) => e.key === preset);
      if (example) {
        const { data } = parseYamlOrJson(example.yaml);
        if (data) {
          loadPreset(data as AideclDeclaration);
          appliedPreset.current = preset;
        }
      }
    }
  }, [searchParams, loadPreset]);

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
          values={formData.signature ?? { declared_by: "", declaration_date: "" }}
          onChange={updateField}
          errors={errors}
        />
      </div>
      <aside className="lg:col-span-1">
        <SidebarPreview formData={formData} issues={issues} isValid={isValid} />
      </aside>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense>
      <GeneratorContent />
    </Suspense>
  );
}
