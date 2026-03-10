"use client";

import { useState } from "react";
import CodeEditor from "@/components/validator/code-editor";
import ValidationResultDisplay from "@/components/validator/validation-result";

export default function ValidatorPage() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Declaration Validator</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CodeEditor value={inputText} onChange={setInputText} />
        <ValidationResultDisplay inputText={inputText} />
      </div>
    </div>
  );
}
