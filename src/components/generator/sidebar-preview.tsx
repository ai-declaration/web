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

function highlightYaml(yaml: string): React.ReactNode[] {
  return yaml.split("\n").map((line, i) => {
    // empty line
    if (line.trim() === "") return <span key={i}>{"\n"}</span>;

    // comment
    if (line.trimStart().startsWith("#")) {
      return <span key={i} className="text-gray-400 dark:text-gray-500">{line}{"\n"}</span>;
    }

    // key: value  or  - key: value
    const kv = line.match(/^(\s*(?:- )?)([\w_][\w_.-]*)(:)([ ].*|$)/);
    if (kv) {
      const [, prefix, key, colon, rest] = kv;
      return (
        <span key={i}>
          <span className="text-muted-foreground">{prefix}</span>
          <span className="text-sky-600 dark:text-sky-400">{key}</span>
          <span className="text-muted-foreground">{colon}</span>
          {colorValue(rest)}
          {"\n"}
        </span>
      );
    }

    // bare list item: - value
    const li = line.match(/^(\s*- )(.*)/);
    if (li) {
      const [, dash, val] = li;
      return (
        <span key={i}>
          <span className="text-muted-foreground">{dash}</span>
          {colorValue(" " + val)}
          {"\n"}
        </span>
      );
    }

    // multiline string continuation (indented text after >- or |)
    return <span key={i} className="text-emerald-600 dark:text-emerald-400">{line}{"\n"}</span>;
  });
}

function colorValue(raw: string): React.ReactNode {
  const trimmed = raw.trimStart();
  const leadingSpace = raw.slice(0, raw.length - trimmed.length);

  if (trimmed === "" || trimmed === ">-" || trimmed === ">" || trimmed === "|") {
    return <span className="text-muted-foreground">{raw}</span>;
  }
  // quoted string
  if (/^["']/.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-emerald-600 dark:text-emerald-400">{trimmed}</span></>;
  }
  // boolean
  if (/^(true|false)$/i.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-amber-600 dark:text-amber-400">{trimmed}</span></>;
  }
  // number
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-amber-600 dark:text-amber-400">{trimmed}</span></>;
  }
  // url
  if (/^https?:\/\//.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-violet-600 dark:text-violet-400">{trimmed}</span></>;
  }

  return <span>{raw}</span>;
}

export default function SidebarPreview({ formData, issues, isValid }: SidebarPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const declaration = useMemo(() => buildAideclDeclaration(formData), [formData]);
  const yamlPreview = useMemo(() => toYaml(declaration), [declaration]);
  const highlighted = useMemo(() => highlightYaml(yamlPreview), [yamlPreview]);

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
    <div className="flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold">Preview</h2>
        <Badge className={`${statusColor} text-white`}>
          {status}
        </Badge>
      </div>

      {issues.length > 0 && (
        <div aria-live="polite" aria-atomic="false" className="mt-3 shrink-0">
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

      <div className="flex flex-wrap gap-2 mt-3 shrink-0">
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

      <pre className="mt-3 flex-1 min-h-0 overflow-auto rounded-md bg-muted p-4 text-[13px] leading-relaxed">
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}
