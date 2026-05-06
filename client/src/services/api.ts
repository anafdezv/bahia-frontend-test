export const API_BASE = "/api";

type ErrorResponseBody = {
  message?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return typeof contentType === "string" && contentType.includes("application/json");
}

async function parseErrorMessage(response: Response) {
  if (!isJsonResponse(response)) {
    return null;
  }

  try {
    const payload = (await response.json()) as ErrorResponseBody;
    return typeof payload.message === "string" && payload.message.trim().length > 0 ? payload.message : null;
  } catch {
    return null;
  }
}

async function ensureOk(response: Response) {
  if (response.ok) {
    return;
  }

  const message = await parseErrorMessage(response);
  throw new ApiError(response.status, message ?? `Request failed (${response.status})`);
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  await ensureOk(response);

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody extends object>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  await ensureOk(response);

  return response.json() as Promise<TResponse>;
}
