"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildAideclDeclaration } from "@/lib/aidecl-builder";
import { toYaml, toJson } from "@/lib/yaml-utils";
import { YamlCode, findYamlKeyLines } from "@/lib/yaml-highlight";
import type { AideclDeclaration } from "@/lib/aidecl-types";

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface SidebarPreviewProps {
  formData: AideclDeclaration;
  issues: string[];
  isValid: boolean;
}

export default function SidebarPreview({ formData, issues, isValid }: SidebarPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [dlOpen, setDlOpen] = useState(false);
  const dlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dlOpen) return;
    const handler = (e: MouseEvent) => {
      if (dlRef.current && !dlRef.current.contains(e.target as Node)) setDlOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dlOpen]);

  const declaration = useMemo(() => buildAideclDeclaration(formData), [formData]);
  const yamlPreview = useMemo(() => toYaml(declaration), [declaration]);

  // Map issue strings to YAML keys so we can highlight the relevant lines
  const ISSUE_KEY_MAP: Record<string, string> = {
    "Project name is missing": "name",
    "Declared by is missing": "declared_by",
    "AI usage summary is missing": "summary",
    "No AI tools specified": "tools",
  };

  const issueLineMap = useMemo(() => {
    if (issues.length === 0) return new Map<string, number>();
    const keysToFind = issues.map((iss) => ISSUE_KEY_MAP[iss]).filter(Boolean);
    if (keysToFind.length === 0) return new Map<string, number>();
    return findYamlKeyLines(yamlPreview, keysToFind);
  }, [yamlPreview, issues]);

  const errorLines = useMemo(() => new Set(issueLineMap.values()), [issueLineMap]);

  function getIssueLine(issue: string): number | undefined {
    const key = ISSUE_KEY_MAP[issue];
    return key ? issueLineMap.get(key) : undefined;
  }

  const status = isValid ? "Valid" : issues.length > 2 ? "Incomplete" : "Draft";
  const statusColor = isValid ? "bg-success" : issues.length > 2 ? "bg-error" : "bg-warning";

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlPreview], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aidecl.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = toJson(declaration);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aidecl.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareLink = async () => {
    const encoded = btoa(yamlPreview);
    if (encoded.length > 4096) {
      alert("Content too large for shareable link (max 4KB encoded)");
      return;
    }
    const url = `${window.location.origin}/generator/?v=${encodeURIComponent(encoded)}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  return (
    <div className="flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Badge className={`${statusColor} text-white`}>
          {status}
        </Badge>
      </div>

      {issues.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="false"
          className={`mt-3 shrink-0 rounded-md border px-3 py-2.5 ${
            issues.length > 2
              ? "border-error/30 bg-error/5"
              : "border-warning/30 bg-warning/5"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg className={`h-4 w-4 shrink-0 ${issues.length > 2 ? "text-error" : "text-warning"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className={`text-xs font-semibold uppercase tracking-wide ${
              issues.length > 2 ? "text-error" : "text-warning"
            }`}>
              {issues.length > 2 ? "Missing required fields" : "Incomplete"}
            </span>
          </div>
          <ul className="space-y-1 text-sm">
            {issues.map((issue, i) => {
              const line = getIssueLine(issue);
              return (
                <li key={i} className="flex items-start gap-2 text-foreground/80">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    issues.length > 2 ? "bg-error/60" : "bg-warning/60"
                  }`} />
                  <span className="flex-1">{issue}</span>
                  {line != null && (
                    <span className="shrink-0 text-[10px] font-mono text-muted-foreground mt-0.5">
                      L{line}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isValid && <div className="flex flex-wrap gap-2 mt-3 shrink-0 justify-end">
        <div className="relative" ref={dlRef}>
          <Button size="sm" variant="outline" onClick={() => setDlOpen(o => !o)} title="Download declaration">
            <DownloadIcon />
            <span className="ml-1.5">Download</span>
            <span className="ml-1"><ChevronDownIcon /></span>
          </Button>
          {dlOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 rounded-md border border-border bg-popover shadow-md py-1 min-w-[120px]">
              <button
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                onClick={() => { handleDownloadYaml(); setDlOpen(false); }}
              >
                YAML
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                onClick={() => { handleDownloadJson(); setDlOpen(false); }}
              >
                JSON
              </button>
            </div>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={handleCopy} title="Copy YAML to clipboard">
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleShareLink} title="Copy shareable link">
          {linkCopied ? <CheckIcon /> : <ShareIcon />}
          <span className="ml-1.5">{linkCopied ? "Copied" : "Share"}</span>
        </Button>
      </div>}

      <pre className="mt-3 flex-1 min-h-0 overflow-auto rounded-md bg-muted p-4 text-[13px]">
        <code><YamlCode yaml={yamlPreview} errorLines={errorLines} /></code>
      </pre>
    </div>
  );
}
