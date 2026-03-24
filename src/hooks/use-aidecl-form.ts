"use client";

import { useReducer, useEffect, useCallback, useMemo } from "react";
import type { AideclDeclaration, AideclTool, FormErrors } from "@/lib/aidecl-types";

type Action =
  | { type: "SET_FIELD"; path: string; value: unknown }
  | { type: "ADD_TOOL"; tool: AideclTool }
  | { type: "REMOVE_TOOL"; index: number }
  | { type: "RESET_FORM" }
  | { type: "LOAD_PRESET"; data: AideclDeclaration };

const initialState: AideclDeclaration = {
  schema_version: "1.0.0",
  content_type: "software",
  project: { name: "" },
  ai_usage: { used: false },
  signature: { declared_by: "", declaration_date: new Date().toISOString().split("T")[0] },
};

function reducer(state: AideclDeclaration, action: Action): AideclDeclaration {
  const next = structuredClone(state);

  switch (action.type) {
    case "SET_FIELD": {
      const { path, value } = action;
      if (path === "project.name") next.project.name = value as string;
      else if (path === "project.repository") next.project.repository = (value as string) || undefined;
      else if (path === "project.version") next.project.version = (value as string) || undefined;
      else if (path === "project.license") next.project.license = (value as string) || undefined;
      else if (path === "content_type") next.content_type = value as string;
      else if (path === "ai_usage.used") next.ai_usage.used = value as boolean;
      else if (path === "ai_usage.summary") next.ai_usage.summary = value as string;
      else if (path === "ai_usage.level") next.ai_usage.level = value as AideclDeclaration["ai_usage"]["level"];
      else if (path.startsWith("ai_usage.scope.")) {
        const key = path.split(".").pop()!;
        next.ai_usage.scope = { ...next.ai_usage.scope, [key]: value };
      } else if (path.match(/^ai_usage\.tools\.\d+\./)) {
        const parts = path.split(".");
        const idx = parseInt(parts[2]);
        const field = parts[3];
        if (next.ai_usage.tools && next.ai_usage.tools[idx]) {
          (next.ai_usage.tools[idx] as unknown as Record<string, unknown>)[field] = value;
        }
      } else if (path.startsWith("ai_usage.code_proportion.")) {
        const key = path.split(".").pop()!;
        next.ai_usage.code_proportion = { ...next.ai_usage.code_proportion, [key]: value };
      } else if (path.startsWith("compliance.")) {
        const key = path.replace("compliance.", "");
        next.compliance = { ...next.compliance, [key]: value as string };
      } else if (path.startsWith("governance.")) {
        const key = path.replace("governance.", "");
        next.governance = { ...next.governance, [key]: value as string };
      } else if (path === "signature.declared_by") next.signature.declared_by = value as string;
      else if (path === "signature.declaration_date") next.signature.declaration_date = value as string;
      else if (path === "signature.reviewed_by") next.signature.reviewed_by = (value as string) || undefined;
      else if (path === "signature.review_date") next.signature.review_date = (value as string) || undefined;
      return next;
    }
    case "ADD_TOOL":
      next.ai_usage.tools = [...(next.ai_usage.tools || []), action.tool];
      return next;
    case "REMOVE_TOOL":
      next.ai_usage.tools = (next.ai_usage.tools || []).filter((_, i) => i !== action.index);
      return next;
    case "RESET_FORM":
      return structuredClone(initialState);
    case "LOAD_PRESET":
      return structuredClone(action.data);
    default:
      return state;
  }
}

const STORAGE_KEY = "aidecl-form-draft";

export function useAideclForm() {
  const [formData, dispatch] = useReducer(reducer, initialState, () => {
    if (typeof window === "undefined") return initialState;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AideclDeclaration;
        return parsed;
      }
    } catch { /* ignore */ }
    return initialState;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch { /* quota exceeded */ }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData]);

  const updateField = useCallback((path: string, value: unknown) => {
    if (path === "ai_usage.addTool") {
      dispatch({ type: "ADD_TOOL", tool: value as AideclTool });
    } else if (path === "ai_usage.removeTool") {
      dispatch({ type: "REMOVE_TOOL", index: value as number });
    } else {
      dispatch({ type: "SET_FIELD", path, value });
    }
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadPreset = useCallback((data: AideclDeclaration) => {
    dispatch({ type: "LOAD_PRESET", data });
  }, []);

  const errors: FormErrors = useMemo(() => {
    const e: FormErrors = {};
    if (!formData.project.name.trim()) e["project.name"] = "Project name is required";
    if (!formData.signature.declared_by.trim()) e["signature.declared_by"] = "Declared by is required";
    if (formData.ai_usage.used && !formData.ai_usage.summary?.trim()) {
      e["ai_usage.summary"] = "Usage summary is required when AI is used";
    }
    return e;
  }, [formData]);

  const issues: string[] = useMemo(() => {
    const list: string[] = [];
    if (!formData.project.name.trim()) list.push("Project name is missing");
    if (!formData.signature.declared_by.trim()) list.push("Declared by is missing");
    if (formData.ai_usage.used && !formData.ai_usage.summary?.trim()) list.push("AI usage summary is missing");
    if (formData.ai_usage.used && (!formData.ai_usage.tools || formData.ai_usage.tools.length === 0)) {
      list.push("No AI tools specified");
    }
    return list;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  return { formData, updateField, resetForm, loadPreset, errors, issues, isValid };
}
