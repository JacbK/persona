import { basename, extname } from "path";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = {
  documents: new Set([".pdf", ".txt", ".md", ".doc", ".docx"]),
  images: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]),
} as const;

export type MaterialFolder = keyof typeof ALLOWED_EXTENSIONS;

export function sanitizeMaterialName(name: string): string {
  const clean = basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  if (!clean || clean === "." || clean === "..") {
    throw new Error("Invalid filename");
  }
  return clean;
}

export function validateMaterialUpload(file: File, folder: MaterialFolder): string {
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Files must be between 1 byte and 10 MB");
  }

  const safeName = sanitizeMaterialName(file.name);
  const extension = extname(safeName).toLowerCase();
  if (!ALLOWED_EXTENSIONS[folder].has(extension)) {
    throw new Error(`Unsupported ${folder} file type`);
  }

  return safeName;
}
