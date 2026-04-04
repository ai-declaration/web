"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { YamlCode } from "@/lib/yaml-highlight";
import { toJson, parseYamlOrJson } from "@/lib/yaml-utils";
import type { ExampleMeta } from "@/lib/examples";

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

function ChevronDownIcon() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

interface ExamplePreviewProps {
  example: ExampleMeta;
}

export default function ExamplePreview({ example }: ExamplePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [dlOpen, setDlOpen] = useState(false);
  const dlRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!dlOpen) return;
    const handler = (e: MouseEvent) => {
      if (dlRef.current && !dlRef.current.contains(e.target as Node)) setDlOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dlOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleDownloadYaml = () => {
    const blob = new Blob([example.yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aidecl.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const { data } = parseYamlOrJson(example.yaml);
    const jsonStr = data ? toJson(data) : "{}";
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aidecl.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadIntoGenerator = () => {
    router.push(`/generator/?preset=${example.key}`);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-border bg-muted/30">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div>
          <h2 className="text-sm font-semibold">{example.label}</h2>
          <p className="text-xs text-muted-foreground">{example.description}</p>
        </div>
        <div className="flex gap-2">
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
          <Button size="sm" onClick={handleLoadIntoGenerator} title="Load into Generator">
            <span className="mr-1.5">Generator</span>
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-[13px] min-h-0">
        <code><YamlCode yaml={example.yaml} /></code>
      </pre>
    </div>
  );
}
