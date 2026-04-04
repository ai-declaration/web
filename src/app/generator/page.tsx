"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  const { formData, updateField, resetForm, loadPreset, errors, issues, isValid } = useAideclForm();
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

  const isEmpty = !formData.project.name.trim() && !formData.signature?.declared_by?.trim();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Declaration Generator</h1>
          {!isEmpty && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
            >
              Clear form
            </button>
          )}
        </div>
        {isEmpty && (
          <div className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Not sure where to start? Browse the{" "}
            <Link href="/examples" className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80">
              example declarations
            </Link>{" "}
            for inspiration, or just fill in the fields below.
          </div>
        )}
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
      <aside className="lg:col-span-3">
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
