export const API_BASE = "/api";

type ErrorResponseBody = {
  code?: unknown;
  message?: unknown;
};

export class ApiError extends Error {
  status: number;
  code: string | null;

  constructor(status: number, message: string, code: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return typeof contentType === "string" && contentType.includes("application/json");
}

async function parseErrorBody(response: Response): Promise<{ code: string | null; message: string | null }> {
  if (!isJsonResponse(response)) {
    return { code: null, message: null };
  }

  try {
    const payload = (await response.json()) as ErrorResponseBody;
    const code = typeof payload.code === "string" && payload.code.trim().length > 0 ? payload.code : null;
    const message = typeof payload.message === "string" && payload.message.trim().length > 0 ? payload.message : null;

    return { code, message };
  } catch {
    return { code: null, message: null };
  }
}

async function ensureOk(response: Response) {
  if (response.ok) {
    return;
  }

  const { code, message } = await parseErrorBody(response);
  throw new ApiError(response.status, message ?? `Request failed (${response.status})`, code);
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}

type RequestOptions = {
  signal?: AbortSignal;
};

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    signal: options.signal
  });
  await ensureOk(response);

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody extends object>(
  path: string,
  body: TBody,
  options: RequestOptions = {}
): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal: options.signal
  });
  await ensureOk(response);

  return response.json() as Promise<TResponse>;
}
