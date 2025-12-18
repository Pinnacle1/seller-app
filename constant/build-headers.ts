
type RequestOptions = {
  headers?: Record<string, string>;
  auth?: boolean;
  token?: string | null;
};

export function buildHeaders(
  opts?: RequestOptions,
  includeContentType = true
): HeadersInit {
  const headers: Record<string, string> = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (opts?.headers) {
    Object.assign(headers, opts.headers);
  }

  if (opts?.auth) {
    const token =
      opts.token ??
      (typeof window !== "undefined"
        ? localStorage.getItem(localStorage.TOKEN)
        : "");

    if (token || token === "") {
      // Token exists → send it
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // No token → send empty Bearer token
      headers["Authorization"] = "Bearer null";
    }
  }

  return headers;
}
