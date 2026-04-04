"use client";

import { useState } from "react";
import type { ExampleMeta } from "@/lib/examples";
import { getUniqueTags, groupByLevel } from "@/lib/examples";

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

const TAG_COLORS = [
  "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
  "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
];

const TAG_COLORS_ACTIVE = [
  "bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-900/50 dark:text-sky-200 dark:border-sky-500",
  "bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-500",
  "bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-500",
  "bg-violet-100 text-violet-800 border-violet-400 dark:bg-violet-900/50 dark:text-violet-200 dark:border-violet-500",
  "bg-rose-100 text-rose-800 border-rose-400 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-500",
  "bg-teal-100 text-teal-800 border-teal-400 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-500",
  "bg-orange-100 text-orange-800 border-orange-400 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-500",
  "bg-indigo-100 text-indigo-800 border-indigo-400 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-500",
];

function tagColorIndex(tag: string): number {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) | 0;
  return Math.abs(h) % TAG_COLORS.length;
}

const LEVEL_DOT_COLORS: Record<string, string> = {
  none: "bg-gray-400",
  minimal: "bg-emerald-500",
  moderate: "bg-amber-500",
  significant: "bg-orange-500",
  extensive: "bg-rose-500",
};

export default function ExampleBrowser({ examples, selected, onSelect }: ExampleBrowserProps) {
  const categories = getCategories(examples);
  const selectedExample = examples.find((e) => e.key === selected);
  const [activeCategory, setActiveCategory] = useState(
    selectedExample?.category ?? categories[0]
  );
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const categoryExamples = examples.filter((e) => e.category === activeCategory);
  const availableTags = getUniqueTags(categoryExamples);

  const filtered = activeTags.length === 0
    ? categoryExamples
    : categoryExamples.filter((e) =>
        activeTags.every((t) => e.tags.includes(t))
      );

  const levelGroups = groupByLevel(filtered);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveTags([]);
  };

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <nav aria-label="Example templates" className="space-y-4">
      {/* Category pills */}
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Category
        </span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                cat === activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tag pills */}
      {availableTags.length > 0 && (
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </span>
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="text-[10px] text-muted-foreground hover:text-foreground underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {availableTags.map((tag) => {
              const idx = tagColorIndex(tag);
              const isActive = activeTags.includes(tag);
              const colorClass = isActive ? TAG_COLORS_ACTIVE[idx] : TAG_COLORS[idx];
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${colorClass}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <hr className="border-border" />

      {/* Level sub-groups */}
      <div className="space-y-3">
        {levelGroups.map((group) => (
          <div key={group.level} className="rounded-md border border-border p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`inline-block w-2 h-2 rounded-full ${LEVEL_DOT_COLORS[group.level] ?? "bg-gray-400"}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
              <span className="text-[10px] text-muted-foreground/60 ml-auto">
                {group.items.length}
              </span>
            </div>
            <div role="listbox" className="space-y-0.5">
              {group.items.map((ex) => (
                <button
                  key={ex.key}
                  role="option"
                  aria-selected={ex.key === selected}
                  onClick={() => onSelect(ex.key)}
                  data-example={ex.key}
                  className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                    ex.key === selected
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className={`text-sm font-medium block ${
                    ex.key === selected ? "text-foreground" : ""
                  }`}>
                    {ex.label}
                  </span>
                  <span className="text-xs block mt-0.5 text-muted-foreground">
                    {ex.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {levelGroups.length === 0 && (
          <p className="text-xs text-muted-foreground px-1 py-4">
            No examples match the selected tags.
          </p>
        )}
      </div>
    </nav>
  );
}
