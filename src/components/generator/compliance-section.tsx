"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AideclCompliance, AideclGovernance } from "@/lib/aidecl-types";

interface ComplianceSectionProps {
  compliance: AideclCompliance;
  governance: AideclGovernance;
  mode: string;
  onModeChange: (mode: string) => void;
  onChange: (field: string, value: string) => void;
}

const MODE_DESCRIPTIONS: Record<string, string> = {
  standard: "Basic declaration without specific regulatory alignment.",
  eu: "Aligned with EU AI Act requirements including risk classification.",
  us: "Aligned with US NIST AI Risk Management Framework.",
  uk: "Aligned with UK Pro-Innovation AI regulation approach.",
  global: "Covers EU, US, and UK frameworks for international projects.",
};

export default function ComplianceSection({ compliance, governance, mode, onModeChange, onChange }: ComplianceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [prevMode, setPrevMode] = useState(mode);

  useEffect(() => {
    if (mode !== prevMode && mode !== "standard" && sectionRef.current) {
      const firstInput = sectionRef.current.querySelector("input, textarea, select");
      if (firstInput instanceof HTMLElement) firstInput.focus();
    }
    setPrevMode(mode);
  }, [mode, prevMode]);

  const showNist = mode === "us" || mode === "global";
  const showUk = mode === "uk" || mode === "global";
  const showEu = mode === "eu" || mode === "global";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Alignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="compliance-mode">Compliance Mode</Label>
          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger id="compliance-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="eu">EU AI Act</SelectItem>
              <SelectItem value="us">USA NIST</SelectItem>
              <SelectItem value="uk">UK Pro-Innovation</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">{MODE_DESCRIPTIONS[mode]}</p>
        </div>

        <div ref={sectionRef} className="space-y-4">
          {showNist && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <h3 className="text-sm font-semibold">NIST AI RMF</h3>
              <div className="space-y-2">
                <Label htmlFor="risk-mapping">Risk Mapping</Label>
                <Textarea
                  id="risk-mapping"
                  placeholder="Describe risk categories and mappings..."
                  value={compliance.risk_mapping || ""}
                  onChange={(e) => onChange("compliance.risk_mapping", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mitigation-plan">Mitigation Plan</Label>
                <Textarea
                  id="mitigation-plan"
                  placeholder="Describe risk mitigation measures..."
                  value={compliance.mitigation_plan || ""}
                  onChange={(e) => onChange("compliance.mitigation_plan", e.target.value)}
                />
              </div>
            </div>
          )}

          {showUk && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <h3 className="text-sm font-semibold">UK Pro-Innovation</h3>
              <div className="space-y-2">
                <Label htmlFor="decision-logic">Decision Logic</Label>
                <Textarea
                  id="decision-logic"
                  placeholder="Describe AI decision-making logic..."
                  value={compliance.decision_logic || ""}
                  onChange={(e) => onChange("compliance.decision_logic", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="public-summary">Public Summary</Label>
                <Textarea
                  id="public-summary"
                  placeholder="Provide a plain-language summary..."
                  value={compliance.public_summary || ""}
                  onChange={(e) => onChange("compliance.public_summary", e.target.value)}
                />
              </div>
            </div>
          )}

          {showEu && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <h3 className="text-sm font-semibold">EU AI Act</h3>
              <div className="space-y-2">
                <Label htmlFor="risk-class">Risk Classification</Label>
                <Select
                  value={compliance.risk_classification || ""}
                  onValueChange={(v) => onChange("compliance.risk_classification", v)}
                >
                  <SelectTrigger id="risk-class">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unclassified">Unclassified</SelectItem>
                    <SelectItem value="gpai">GPAI</SelectItem>
                    <SelectItem value="high_risk">High Risk</SelectItem>
                    <SelectItem value="prohibited">Prohibited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-file-url">Technical File URL</Label>
                <Input
                  id="tech-file-url"
                  placeholder="https://..."
                  value={compliance.technical_file_url || ""}
                  onChange={(e) => onChange("compliance.technical_file_url", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <details className="rounded-md border border-border">
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium">Governance</summary>
          <div className="space-y-3 px-3 pb-3">
            <div className="space-y-2">
              <Label htmlFor="resp-officer">Responsible Officer</Label>
              <Input
                id="resp-officer"
                value={governance.responsible_officer || ""}
                onChange={(e) => onChange("governance.responsible_officer", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-policy">Organizational Policy URL</Label>
              <Input
                id="org-policy"
                placeholder="https://..."
                value={governance.organizational_policy_url || ""}
                onChange={(e) => onChange("governance.organizational_policy_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethics-status">Ethics Review Status</Label>
              <Input
                id="ethics-status"
                placeholder="pending, approved, etc."
                value={governance.ethics_review_status || ""}
                onChange={(e) => onChange("governance.ethics_review_status", e.target.value)}
              />
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
