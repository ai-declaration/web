"use client";

import { useState } from "react";
import type { ExampleMeta } from "@/lib/examples";

interface ExampleBrowserProps {
  examples: ExampleMeta[];
  selected: string;
  onSelect: (key: string) => void;
}

function getCategories(examples: ExampleMeta[]) {
  const seen = new Set<string>();
  const cats: string[] = [];
  for (const ex of examples) {
    if (!seen.has(ex.category)) {
      seen.add(ex.category);
      cats.push(ex.category);
    }
  }
  return cats;
}

export default function ExampleBrowser({ examples, selected, onSelect }: ExampleBrowserProps) {
  const categories = getCategories(examples);
  const selectedExample = examples.find((e) => e.key === selected);
  const [activeCategory, setActiveCategory] = useState(
    selectedExample?.category ?? categories[0]
  );

  const filtered = examples.filter((e) => e.category === activeCategory);

  return (
    <nav aria-label="Example templates" className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
              cat === activeCategory
                ? "bg-accent text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div role="listbox" className="space-y-0.5">
        {filtered.map((ex) => (
          <button
            key={ex.key}
            role="option"
            aria-selected={ex.key === selected}
            onClick={() => onSelect(ex.key)}
            data-example={ex.key}
            className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
              ex.key === selected
                ? "bg-accent/15 border border-accent"
                : "hover:bg-muted"
            }`}
          >
            <span className={`text-sm font-medium block ${
              ex.key === selected ? "text-accent" : ""
            }`}>
              {ex.label}
            </span>
            <span className="text-xs block mt-0.5 text-muted-foreground">
              {ex.description}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
