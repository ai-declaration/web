"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AideclTool } from "@/lib/aidecl-types";

interface ToolEntryProps {
  tool: AideclTool;
  index: number;
  onChange: (field: string, value: unknown) => void;
  onRemove: () => void;
}

export default function ToolEntry({ tool, index, onChange, onRemove }: ToolEntryProps) {
  return (
    <Card className="relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-muted-foreground hover:text-error text-sm"
        aria-label={`Remove ${tool.name || "tool"}`}
      >
        x
      </button>
      <CardContent className="space-y-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`tool-name-${index}`} className="text-xs">Name</Label>
            <Input
              id={`tool-name-${index}`}
              value={tool.name}
              onChange={(e) => onChange(`ai_usage.tools.${index}.name`, e.target.value)}
              placeholder="Tool name"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`tool-type-${index}`} className="text-xs">Type</Label>
            <Select
              value={tool.type || ""}
              onValueChange={(v) => onChange(`ai_usage.tools.${index}.type`, v)}
            >
              <SelectTrigger id={`tool-type-${index}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assistant">Assistant</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="model_runner">Model Runner</SelectItem>
                <SelectItem value="standalone">Standalone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`tool-hosting-${index}`} className="text-xs">Hosting</Label>
          <Select
            value={tool.hosting || ""}
            onValueChange={(v) => onChange(`ai_usage.tools.${index}.hosting`, v)}
          >
            <SelectTrigger id={`tool-hosting-${index}`}>
              <SelectValue placeholder="Select hosting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`tool-purpose-${index}`} className="text-xs">Purpose</Label>
          <Textarea
            id={`tool-purpose-${index}`}
            value={tool.purpose || ""}
            onChange={(e) => onChange(`ai_usage.tools.${index}.purpose`, e.target.value)}
            placeholder="What was this tool used for?"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
