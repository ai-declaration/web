export interface ExampleMeta {
  key: string;
  label: string;
  description: string;
  yaml: string;
}

export const EXAMPLES: ExampleMeta[] = [
  {
    key: "minimal",
    label: "Minimal CLI",
    description: "A simple CLI tool with no AI usage",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: log-rotator
  repository: https://github.com/acme/log-rotator
  version: "2.1.0"
  license: MIT
ai_usage:
  used: false
signature:
  declared_by: Jane Smith
  declaration_date: "2026-01-15"
`,
  },
  {
    key: "web",
    label: "Web App",
    description: "React dashboard with Copilot for tests",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: sales-dashboard
  repository: https://github.com/acme/sales-dashboard
  version: "3.0.0"
  license: Apache-2.0
ai_usage:
  used: true
  summary: GitHub Copilot was used for writing unit tests and some React component boilerplate.
  level: moderate
  tools:
    - name: GitHub Copilot
      type: assistant
      version: "1.x"
      hosting: cloud
      purpose: Test generation and component scaffolding
  scope:
    code_generation: true
    testing: true
    documentation: false
  code_proportion:
    ai_generated_percent: 15
    ai_assisted_percent: 25
    human_only_percent: 60
    method: self_reported
signature:
  declared_by: Alex Chen
  declaration_date: "2026-02-20"
`,
  },
  {
    key: "research",
    label: "Research",
    description: "Genome analysis with local Ollama",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: genome-analyzer
  repository: https://gitlab.com/biolab/genome-analyzer
  version: "0.4.0"
  license: GPL-3.0
ai_usage:
  used: true
  summary: Ollama (local CodeLlama) was used for writing parsing utilities and documentation strings.
  level: minimal
  tools:
    - name: Ollama
      type: model_runner
      version: "0.5.x"
      hosting: local
      purpose: Code completion for parsing routines
  scope:
    code_completion: true
    documentation: true
signature:
  declared_by: Dr. Maria Lopez
  declaration_date: "2026-03-01"
`,
  },
  {
    key: "highrisk",
    label: "High-Risk AI",
    description: "Medical scan analysis with EU AI Act classification",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: radiology-assist
  version: "1.2.0"
  license: proprietary
ai_usage:
  used: true
  summary: AI model used for preliminary scan analysis. All outputs reviewed by qualified radiologist.
  level: extensive
  tools:
    - name: RadiologyNet
      type: standalone
      version: "2.0"
      hosting: local
      purpose: Preliminary scan classification
compliance:
  framework: eu_ai_act
  risk_classification: high_risk
  technical_file_url: https://example.com/technical-file
governance:
  responsible_officer: Dr. Hans Mueller
  ethics_review_status: approved
signature:
  declared_by: Dr. Hans Mueller
  declaration_date: "2026-01-10"
  reviewed_by: Ethics Board
  review_date: "2026-01-08"
`,
  },
  {
    key: "no-ai",
    label: "No AI",
    description: "Explicit declaration that no AI was used",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: auth-service
  repository: https://github.com/acme/auth-service
  version: "4.0.0"
  license: MIT
ai_usage:
  used: false
signature:
  declared_by: Bob Williams
  declaration_date: "2026-02-28"
`,
  },
  {
    key: "late-stage",
    label: "Late-Stage",
    description: "AI used only in late development stages",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: payment-gateway
  repository: https://github.com/acme/payment-gw
  version: "2.5.0"
  license: MIT
ai_usage:
  used: true
  summary: Claude was brought in late to help with integration tests and documentation after core development was complete.
  level: minimal
  tools:
    - name: Claude
      type: assistant
      hosting: cloud
      purpose: Integration test scaffolding and README updates
  scope:
    testing: true
    documentation: true
  code_proportion:
    ai_generated_percent: 5
    ai_assisted_percent: 10
    human_only_percent: 85
    method: self_reported
signature:
  declared_by: Sarah Kim
  declaration_date: "2026-03-05"
`,
  },
  {
    key: "comprehensive",
    label: "Comprehensive",
    description: "Full-featured declaration with all sections",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: smart-scheduler
  repository: https://github.com/acme/smart-scheduler
  version: "1.0.0"
  license: Apache-2.0
ai_usage:
  used: true
  summary: Multiple AI tools used across the full development lifecycle for code generation, testing, documentation, and code review.
  level: significant
  tools:
    - name: GitHub Copilot
      type: assistant
      version: "1.x"
      hosting: cloud
      purpose: Code completion and generation
    - name: Claude
      type: assistant
      hosting: cloud
      purpose: Architecture review and documentation
    - name: Ollama
      type: model_runner
      version: "0.5.x"
      hosting: local
      purpose: Local code review
  scope:
    code_generation: true
    code_completion: true
    code_review: true
    documentation: true
    testing: true
    debugging: false
    infrastructure: true
    refactoring: true
  code_proportion:
    ai_generated_percent: 30
    ai_assisted_percent: 40
    human_only_percent: 30
    method: self_reported
compliance:
  framework: standard
governance:
  responsible_officer: Tech Lead
  organizational_policy_url: https://acme.com/ai-policy
  ethics_review_status: approved
signature:
  declared_by: Jamie Rivera
  declaration_date: "2026-03-10"
  reviewed_by: Tech Lead
  review_date: "2026-03-09"
`,
  },
  {
    key: "enterprise",
    label: "Enterprise",
    description: "Enterprise-level with governance and DPIA",
    yaml: `schema_version: "1.0.0"
content_type: software
project:
  name: customer-insights-platform
  repository: https://gitlab.com/bigcorp/insights
  version: "5.2.0"
  license: proprietary
ai_usage:
  used: true
  summary: AI used for data pipeline code generation and automated testing. All AI-generated code undergoes mandatory human review before merge.
  level: moderate
  tools:
    - name: Cursor
      type: assistant
      hosting: cloud
      purpose: Code generation for data pipelines
  scope:
    code_generation: true
    testing: true
    infrastructure: true
  code_proportion:
    ai_generated_percent: 20
    ai_assisted_percent: 30
    human_only_percent: 50
    method: tool_measured
compliance:
  framework: eu_ai_act
  risk_classification: gpai
  risk_mapping: Data processing pipeline classified under GPAI provisions
  mitigation_plan: Mandatory code review, quarterly audit, data lineage tracking
governance:
  responsible_officer: VP Engineering
  organizational_policy_url: https://bigcorp.com/policies/ai-usage
  ethics_review_status: approved
signature:
  declared_by: Michael Torres
  declaration_date: "2026-02-15"
  reviewed_by: CISO Office
  review_date: "2026-02-14"
`,
  },
];
