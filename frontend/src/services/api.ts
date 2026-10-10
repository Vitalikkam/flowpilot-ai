import type {
  ExecutionListParams,
  Lead,
  LeadListParams,
  WorkflowExecution,
} from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body as T;
}

function toQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  );
  return `?${search.toString()}`;
}

// ── Health ─────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  database: string;
}

export const api = {
  // ── Leads ────────────────────────────────────────────
  listLeads(params: LeadListParams = {}): Promise<Lead[]> {
    return request<Lead[]>(`/api/leads${toQuery(params)}`);
  },

  getLead(id: string): Promise<Lead> {
    return request<Lead>(`/api/leads/${id}`);
  },

  updateLead(
    id: string,
    payload: { status?: string; priority?: string },
  ): Promise<Lead> {
    return request<Lead>(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // ── Executions ───────────────────────────────────────
  listExecutions(
    params: ExecutionListParams = {},
  ): Promise<WorkflowExecution[]> {
    return request<WorkflowExecution[]>(`/api/executions${toQuery(params)}`);
  },

  getExecution(id: string): Promise<WorkflowExecution> {
    return request<WorkflowExecution>(`/api/executions/${id}`);
  },

  // ── Health ───────────────────────────────────────────
  health(): Promise<HealthResponse> {
    return request<HealthResponse>(`/health`);
  },
};

export { ApiError };