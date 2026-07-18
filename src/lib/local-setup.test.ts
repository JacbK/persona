import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { isLocalSetupRequest } from "./local-setup";

describe("isLocalSetupRequest", () => {
  it("allows same-origin localhost requests outside production", () => {
    const request = new NextRequest("http://127.0.0.1:3000/api/read-config", {
      headers: { origin: "http://127.0.0.1:3000" },
    });
    expect(isLocalSetupRequest(request, "development")).toBe(true);
  });

  it("rejects remote hosts and cross-origin requests", () => {
    const remote = new NextRequest("https://portfolio.example/api/read-config");
    const crossOrigin = new NextRequest("http://127.0.0.1:3000/api/read-config", {
      headers: { origin: "https://evil.example" },
    });
    expect(isLocalSetupRequest(remote, "development")).toBe(false);
    expect(isLocalSetupRequest(crossOrigin, "development")).toBe(false);
  });

  it("rejects every request in production", () => {
    const request = new NextRequest("http://127.0.0.1:3000/api/read-config");
    expect(isLocalSetupRequest(request, "production")).toBe(false);
  });
});
