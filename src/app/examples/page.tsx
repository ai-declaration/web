"use client";

import { useState } from "react";
import ExampleBrowser from "@/components/examples/example-browser";
import ExamplePreview from "@/components/examples/example-preview";
import { EXAMPLES } from "@/lib/examples";

export default function ExamplesPage() {
  const [selected, setSelected] = useState("no-ai");
  const currentExample = EXAMPLES.find((e) => e.key === selected);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[400px]">
      <h1 className="text-2xl font-bold mb-4 shrink-0" id="examples-heading">Examples</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 flex-1">
        <aside className="lg:col-span-1 overflow-y-auto min-h-0">
          <ExampleBrowser examples={EXAMPLES} selected={selected} onSelect={setSelected} />
        </aside>
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          {currentExample && <ExamplePreview example={currentExample} />}
        </div>
      </div>
    </div>
  );
}
