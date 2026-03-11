"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExampleMeta } from "@/lib/examples";

interface ExampleBrowserProps {
  examples: ExampleMeta[];
  selected: string;
  onSelect: (key: string) => void;
}

export default function ExampleBrowser({ examples, selected, onSelect }: ExampleBrowserProps) {
  const current = examples.find((e) => e.key === selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reference Library</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <Badge
              key={ex.key}
              variant={ex.key === selected ? "default" : "outline"}
              className={`cursor-pointer ${
                ex.key === selected
                  ? "bg-accent text-white"
                  : "hover:bg-muted"
              }`}
              onClick={() => onSelect(ex.key)}
              data-example={ex.key}
            >
              {ex.label}
            </Badge>
          ))}
        </div>
        {current && (
          <>
            <p className="text-sm text-muted-foreground">{current.description}</p>
            <pre className="max-h-[500px] overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
              <code>{current.yaml}</code>
            </pre>
          </>
        )}
      </CardContent>
    </Card>
  );
}
