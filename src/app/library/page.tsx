"use client";

import { useState } from "react";
import ExampleBrowser from "@/components/library/example-browser";
import { EXAMPLES } from "@/lib/examples";

export default function LibraryPage() {
  const [selected, setSelected] = useState("minimal");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Example Library</h1>
      <ExampleBrowser examples={EXAMPLES} selected={selected} onSelect={setSelected} />
    </div>
  );
}
