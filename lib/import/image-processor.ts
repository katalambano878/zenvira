/**
 * Upload product images to local disk and build a map of filename -> public URL.
 */

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { compressImageBuffer } from '@/lib/image-compress';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

function publicBase() {
  const base =
    process.env.NEXT_PUBLIC_UPLOAD_BASE_URL ||
    `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '')}/uploads`;
  return base.replace(/\/+$/, '');
}

function getExt(name: string): string {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i).toLowerCase();
}

function safeStorageName(original: string): string {
  return original
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');
}

function contentTypeForExt(ext: string): string {
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

export interface UploadProgress {
  current: number;
  total: number;
  message: string;
}

export async function uploadProductImages(
  images: Map<string, Buffer>,
  referencedNames: Set<string>,
  prefix: string,
  onProgress?: (p: UploadProgress) => void
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();
  const toUpload = Array.from(referencedNames).filter((name) => images.has(name));
  const total = toUpload.length;
  let current = 0;

  const folder = prefix.replace(/[^a-z0-9/_-]/gi, '') || 'import';
  const absDir = path.join(uploadRoot(), folder);
  await mkdir(absDir, { recursive: true });

  for (const filename of toUpload) {
    const buf = images.get(filename)!;
    if (buf.length > MAX_FILE_SIZE_BYTES) {
      onProgress?.({
        current: ++current,
        total,
        message: `Skipped ${filename}: exceeds 10MB`,
      });
      continue;
    }
    const ext = getExt(filename);
    if (!ALLOWED_EXT.has(ext)) {
      onProgress?.({
        current: ++current,
        total,
        message: `Skipped ${filename}: unsupported format`,
      });
      continue;
    }

    try {
      const base = safeStorageName(filename);
      const contentType = contentTypeForExt(ext);
      const compressed = await compressImageBuffer(buf, contentType);
      const outBuf = Buffer.from(compressed.buffer);
      const outExt = compressed.contentType.includes('webp') ? '.webp' : ext;
      const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base.replace(ext, '')}${outExt}`;
      const relative = path.posix.join(folder, storedName);
      await writeFile(path.join(uploadRoot(), folder, storedName), outBuf);
      const publicUrl = `${publicBase()}/${relative}`;
      urlMap.set(filename.toLowerCase().trim(), publicUrl);
      urlMap.set(filename, publicUrl);
      current++;
      onProgress?.({
        current,
        total,
        message: `Uploaded ${filename}`,
      });
    } catch (err: unknown) {
      onProgress?.({
        current: ++current,
        total,
        message: `Failed ${filename}: ${err instanceof Error ? err.message : 'upload error'}`,
      });
    }
  }

  return urlMap;
}

export function collectReferencedImageNames(rows: { images?: string[]; variant_image?: string }[]): Set<string> {
  const set = new Set<string>();
  for (const row of rows) {
    for (const f of row.images ?? []) {
      if (f.trim()) set.add(f.toLowerCase().trim());
    }
    if (row.variant_image?.trim()) {
      set.add(row.variant_image.toLowerCase().trim());
    }
  }
  return set;
}
