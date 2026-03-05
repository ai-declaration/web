"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AideclAiUsage, AideclScope, FormErrors } from "@/lib/aidecl-types";

interface AiEngagementProps {
  values: AideclAiUsage;
  onChange: (field: string, value: unknown) => void;
  errors: FormErrors;
}

const QUICK_ADD_TOOLS = [
  { name: "GitHub Copilot", type: "assistant" as const, hosting: "cloud" as const },
  { name: "Claude", type: "assistant" as const, hosting: "cloud" as const },
  { name: "Ollama", type: "model_runner" as const, hosting: "local" as const },
  { name: "Cursor", type: "assistant" as const, hosting: "cloud" as const },
];

const SCOPE_OPTIONS: { key: keyof AideclScope; label: string }[] = [
  { key: "code_generation", label: "Code Generation" },
  { key: "code_completion", label: "Code Completion" },
  { key: "code_review", label: "Code Review" },
  { key: "documentation", label: "Documentation" },
  { key: "testing", label: "Testing" },
  { key: "debugging", label: "Debugging" },
  { key: "infrastructure", label: "Infrastructure" },
  { key: "refactoring", label: "Refactoring" },
];

export default function AiEngagement({ values, onChange, errors }: AiEngagementProps) {
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);
  const [wasJustToggled, setWasJustToggled] = useState(false);

  useEffect(() => {
    if (wasJustToggled && values.used && firstFieldRef.current) {
      firstFieldRef.current.focus();
      setWasJustToggled(false);
    }
  }, [wasJustToggled, values.used]);

  const handleToggle = (checked: boolean) => {
    onChange("ai_usage.used", checked);
    if (checked) setWasJustToggled(true);
  };

  const proportionSum = (values.code_proportion?.ai_generated_percent || 0)
    + (values.code_proportion?.ai_assisted_percent || 0)
    + (values.code_proportion?.human_only_percent || 0);

  const showSumWarning = values.code_proportion
    && (values.code_proportion.ai_generated_percent !== undefined
      || values.code_proportion.ai_assisted_percent !== undefined
      || values.code_proportion.human_only_percent !== undefined)
    && proportionSum > 0
    && proportionSum !== 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Engagement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="ai-used"
            checked={values.used}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="ai-used" className="font-medium">
            AI coding assistants were used in this project
          </Label>
        </div>

        {values.used && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="ai-summary">Usage Summary *</Label>
              <Textarea
                ref={firstFieldRef}
                id="ai-summary"
                placeholder="Describe how AI tools were used..."
                value={values.summary || ""}
                onChange={(e) => onChange("ai_usage.summary", e.target.value)}
                aria-invalid={!!errors["ai_usage.summary"]}
                aria-describedby={errors["ai_usage.summary"] ? "error-ai-summary" : undefined}
              />
              {errors["ai_usage.summary"] && (
                <p id="error-ai-summary" role="alert" className="text-sm text-error">
                  {errors["ai_usage.summary"]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-level">AI Involvement Level</Label>
              <Select
                value={values.level || ""}
                onValueChange={(v) => onChange("ai_usage.level", v)}
              >
                <SelectTrigger id="ai-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="significant">Significant</SelectItem>
                  <SelectItem value="extensive">Extensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scope of AI Use</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SCOPE_OPTIONS.map((opt) => (
                  <div key={opt.key} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`scope-${opt.key}`}
                      checked={!!values.scope?.[opt.key]}
                      onCheckedChange={(checked) => onChange(`ai_usage.scope.${opt.key}`, checked)}
                    />
                    <Label htmlFor={`scope-${opt.key}`} className="text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tools &amp; Infrastructure</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_ADD_TOOLS.map((tool) => (
                  <Badge
                    key={tool.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent hover:text-white"
                    onClick={() => onChange("ai_usage.addTool", tool)}
                  >
                    + {tool.name}
                  </Badge>
                ))}
              </div>
              {values.tools && values.tools.length > 0 && (
                <div className="mt-2 space-y-1">
                  {values.tools.map((tool, i) => (
                    <div key={i} className="flex items-center justify-between rounded border border-border px-3 py-1.5 text-sm">
                      <span>{tool.name} ({tool.type})</span>
                      <button
                        onClick={() => onChange("ai_usage.removeTool", i)}
                        className="text-muted-foreground hover:text-error"
                        aria-label={`Remove ${tool.name}`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Artifact Composition</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="pct-generated" className="text-xs">AI-Generated %</Label>
                  <Input
                    id="pct-generated"
                    type="number"
                    min={0}
                    max={100}
                    value={values.code_proportion?.ai_generated_percent ?? ""}
                    onChange={(e) => onChange("ai_usage.code_proportion.ai_generated_percent", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pct-assisted" className="text-xs">AI-Assisted %</Label>
                  <Input
                    id="pct-assisted"
                    type="number"
                    min={0}
                    max={100}
                    value={values.code_proportion?.ai_assisted_percent ?? ""}
                    onChange={(e) => onChange("ai_usage.code_proportion.ai_assisted_percent", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pct-human" className="text-xs">Human-Only %</Label>
                  <Input
                    id="pct-human"
                    type="number"
                    min={0}
                    max={100}
                    value={values.code_proportion?.human_only_percent ?? ""}
                    onChange={(e) => onChange("ai_usage.code_proportion.human_only_percent", Number(e.target.value))}
                  />
                </div>
              </div>
              {showSumWarning && (
                <p className="text-sm text-warning">
                  AI-Generated + AI-Assisted + Human-Only should sum to 100% (currently {proportionSum}%)
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
