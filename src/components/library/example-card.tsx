"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ExampleMeta } from "@/lib/examples";

interface ExampleCardProps {
  example: ExampleMeta;
}

export default function ExampleCard({ example }: ExampleCardProps) {
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
    <div className="flex flex-wrap gap-2 pt-2">
      <Button size="sm" variant="outline" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy to Clipboard"}
      </Button>
      <Button size="sm" variant="outline" onClick={handleDownload}>
        Download Template
      </Button>
      <Button size="sm" onClick={handleLoadIntoGenerator}>
        Load into Generator
      </Button>
    </div>
  );
}
