import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_BYTES,
  sanitizeMaterialName,
  validateMaterialUpload,
} from "./material-upload";

describe("sanitizeMaterialName", () => {
  it("removes directories and unsafe characters", () => {
    expect(sanitizeMaterialName("../My Resume (final).pdf")).toBe("My_Resume__final_.pdf");
  });

  it("rejects empty path names", () => {
    expect(() => sanitizeMaterialName("..")).toThrow("Invalid filename");
  });
});

describe("validateMaterialUpload", () => {
  it("accepts an allowed document", () => {
    const file = new File(["resume"], "resume.pdf", { type: "application/pdf" });
    expect(validateMaterialUpload(file, "documents")).toBe("resume.pdf");
  });

  it("rejects executable and SVG uploads", () => {
    const executable = new File(["bad"], "resume.js");
    const svg = new File(["<svg />"], "portrait.svg", { type: "image/svg+xml" });
    expect(() => validateMaterialUpload(executable, "documents")).toThrow();
    expect(() => validateMaterialUpload(svg, "images")).toThrow();
  });

  it("rejects oversized files", () => {
    const file = { name: "resume.pdf", size: MAX_UPLOAD_BYTES + 1 } as File;
    expect(() => validateMaterialUpload(file, "documents")).toThrow("10 MB");
  });
});
