"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildAideclDeclaration } from "@/lib/aidecl-builder";
import { toYaml, toJson } from "@/lib/yaml-utils";
import type { AideclDeclaration } from "@/lib/aidecl-types";

interface SidebarPreviewProps {
  formData: AideclDeclaration;
  issues: string[];
  isValid: boolean;
}

export default function SidebarPreview({ formData, issues, isValid }: SidebarPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const declaration = useMemo(() => buildAideclDeclaration(formData), [formData]);
  const yamlPreview = useMemo(() => toYaml(declaration), [declaration]);

  const status = isValid ? "Ready" : issues.length > 2 ? "Incomplete" : "Draft";
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
    <div className="space-y-4 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Badge className={`${statusColor} text-white`}>
          {status}
        </Badge>
      </div>

      {issues.length > 0 && (
        <div aria-live="polite" aria-atomic="false">
          <ul className="space-y-1 text-sm text-muted-foreground">
            {issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-warning">!</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={handleDownloadYaml} title="Download as aidecl.yaml">
          YAML
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadJson} title="Download as aidecl.json">
          JSON
        </Button>
        <Button size="sm" variant="outline" onClick={handleCopy} title="Copy YAML to clipboard">
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleShareLink} title="Copy shareable link">
          {linkCopied ? "Link Copied!" : "Share"}
        </Button>
      </div>

      <pre className="max-h-[500px] overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
        <code>{yamlPreview}</code>
      </pre>
    </div>
  );
}
