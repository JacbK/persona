import type { NextRequest } from "next/server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function isLocalSetupRequest(
  request: NextRequest,
  environment = process.env.NODE_ENV,
): boolean {
  if (environment === "production") return false;

  const requestUrl = new URL(request.url);
  if (!LOCAL_HOSTS.has(requestUrl.hostname)) return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    return (
      LOCAL_HOSTS.has(originUrl.hostname) &&
      originUrl.protocol === requestUrl.protocol &&
      originUrl.port === requestUrl.port
    );
  } catch {
    return false;
  }
}

export const LOCAL_ONLY_RESPONSE = {
  error: "This setup endpoint is only available from the local development server.",
};
