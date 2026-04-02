"use client";

import { useState } from "react";
import ExampleBrowser from "@/components/examples/example-browser";
import ExampleCard from "@/components/examples/example-card";
import { EXAMPLES } from "@/lib/examples";

export default function LibraryPage() {
  const [selected, setSelected] = useState("minimal");
  const currentExample = EXAMPLES.find((e) => e.key === selected);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" id="examples-heading">Examples</h1>
      <ExampleBrowser examples={EXAMPLES} selected={selected} onSelect={setSelected} />
      {currentExample && <ExampleCard example={currentExample} />}
    </div>
  );
}
