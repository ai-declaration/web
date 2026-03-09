"use client";

import { useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.size > 500_000) {
      onChange("# Error: File too large (max 500KB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onChange(text);
    };
    reader.readAsText(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Validator</CardTitle>
        <CardDescription>
          Paste or upload an aidecl.yaml or aidecl.json file to validate it against the schema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="flex items-center gap-3 rounded-md border-2 border-dashed border-border p-3 text-sm text-muted-foreground"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <span>Drop a file here or</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded bg-muted px-2 py-1 font-medium hover:bg-border"
          >
            Browse
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full min-h-[400px] resize-y rounded-md bg-muted p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Paste YAML or JSON content here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={500000}
          spellCheck={false}
        />
        <p className="text-right text-xs text-muted-foreground">
          {value.length.toLocaleString()} / 500,000 characters
        </p>
      </CardContent>
    </Card>
  );
}
