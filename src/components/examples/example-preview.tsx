"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ExampleMeta } from "@/lib/examples";

interface ExamplePreviewProps {
  example: ExampleMeta;
}

export default function ExamplePreview({ example }: ExamplePreviewProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleDownload = () => {
    const blob = new Blob([example.yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aidecl-template.yaml";
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
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            Download
          </Button>
          <Button size="sm" onClick={handleLoadIntoGenerator}>
            Load into Generator
          </Button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed min-h-0">
        <code>{example.yaml}</code>
      </pre>
    </div>
  );
}
