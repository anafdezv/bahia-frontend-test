type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export function readWithTtl<T>(key: string, ttlMs: number): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>;

    if (typeof parsed.timestamp !== "number" || !Object.hasOwn(parsed, "data")) {
      window.localStorage.removeItem(key);
      return null;
    }

    const isExpired = Date.now() - parsed.timestamp > ttlMs;

    if (isExpired) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function writeWithTimestamp<T>(key: string, data: T) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: CacheEntry<T> = {
    data,
    timestamp: Date.now()
  };

  try {
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures (quota/private mode/policy).
  }
}
