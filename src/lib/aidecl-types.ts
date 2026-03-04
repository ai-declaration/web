export interface AideclProject {
  name: string;
  repository?: string;
  version?: string;
  license?: string;
}

export interface AideclTool {
  name: string;
  type?: "assistant" | "agent" | "model_runner" | "standalone";
  version?: string;
  hosting?: "cloud" | "local" | "hybrid";
  purpose?: string;
}

export interface AideclScope {
  code_generation?: boolean;
  code_completion?: boolean;
  code_review?: boolean;
  documentation?: boolean;
  testing?: boolean;
  debugging?: boolean;
  infrastructure?: boolean;
  refactoring?: boolean;
}

export interface AideclCodeProportion {
  ai_generated_percent?: number;
  ai_assisted_percent?: number;
  human_only_percent?: number;
  method?: "self_reported" | "tool_measured" | "audit_estimated";
}

export interface AideclGovernance {
  responsible_officer?: string;
  organizational_policy_url?: string;
  ethics_review_status?: string;
}

export interface AideclCompliance {
  framework?: string;
  risk_classification?: string;
  risk_mapping?: string;
  mitigation_plan?: string;
  decision_logic?: string;
  public_summary?: string;
  technical_file_url?: string;
}

export interface AideclSignature {
  declared_by: string;
  declaration_date: string;
  reviewed_by?: string;
  review_date?: string;
}

export interface AideclAiUsage {
  used: boolean;
  summary?: string;
  level?: "none" | "minimal" | "moderate" | "significant" | "extensive";
  tools?: AideclTool[];
  scope?: AideclScope;
  code_proportion?: AideclCodeProportion;
}

export interface AideclDeclaration {
  schema_version: string;
  content_type?: string;
  project: AideclProject;
  ai_usage: AideclAiUsage;
  compliance?: AideclCompliance;
  governance?: AideclGovernance;
  signature: AideclSignature;
}

export type FormErrors = Record<string, string>;
