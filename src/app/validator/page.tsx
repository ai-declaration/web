"use client";

import { useState } from "react";
import CodeEditor from "@/components/validator/code-editor";

export default function ValidatorPage() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Declaration Validator</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CodeEditor value={inputText} onChange={setInputText} />
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Awaiting input for analysis...</p>
        </div>
      </div>
    </div>
  );
}
