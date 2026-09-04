/**
 * Client-side image shrink for logo uploads. Keeps files tiny (~10-30KB) so
 * storage and bandwidth stay negligible on the free tier.
 */
export async function shrinkImage(
  file: File,
  max = 256,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  // PNG keeps transparency for logos that need it.
  const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encode failed"))),
      type,
      0.9,
    );
  });
}

export function extFor(blob: Blob): string {
  return blob.type === "image/jpeg" ? "jpg" : "png";
}
