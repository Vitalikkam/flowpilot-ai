// ── Leads ──────────────────────────────────────────────

export type LeadStatus = "pending" | "qualified" | "rejected" | "needs_review";
export type LeadPriority = "low" | "medium" | "high";
export type LeadSource = "website" | "email" | "form" | "api" | "other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority | null;
  created_at: string;
  updated_at: string;
}

export interface LeadListParams {
  status?: LeadStatus;
  priority?: LeadPriority;
  limit?: number;
  offset?: number;
}

// ── AI Analysis ────────────────────────────────────────

export type AICategory =
  | "web_development"
  | "automation"
  | "consulting"
  | "other";

export type AIUrgency = "low" | "medium" | "high";

export interface AIAnalysisPayload {
  summary: string;
  category: AICategory;
  budget_usd: number | null;
  urgency: AIUrgency;
}

export interface LeadAnalysis {
  id: string;
  lead_id: string;
  summary: string;
  category: string | null;
  budget_usd: number | null;
  urgency: string | null;
  model: string | null;
  created_at: string;
}

// ── Execution ──────────────────────────────────────────

export type ExecutionStatus = "running" | "success" | "failed";

export interface WorkflowExecution {
  id: string;
  lead_id: string | null;
  workflow_name: string;
  status: ExecutionStatus;
  stage: string | null;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface ExecutionListParams {
  status?: ExecutionStatus;
  lead_id?: string;
  workflow_name?: string;
  limit?: number;
  offset?: number;
}