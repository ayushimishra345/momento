export type Personalisation = { recipient?: string; note?: string; memory?: string; style?: string; photoName?: string; photoDataUrl?: string };

export function validatePersonalisation(p: Personalisation) {
  if ((p.recipient?.length ?? 0) > 40) return "Recipient's name must be 40 characters or fewer.";
  if ((p.note?.length ?? 0) > 240) return "Gift note must be 240 characters or fewer.";
  if ((p.memory?.length ?? 0) > 300) return "Shared memory must be 300 characters or fewer.";
  if (!p.recipient?.trim() && !p.note?.trim() && !p.memory?.trim() && !p.photoDataUrl) return "Add a name, note, memory or photo to personalise this gift.";
  return undefined;
}

export function validatePhoto(file: { type: string; size: number }) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Please upload a JPG, PNG or WebP image.";
  if (file.size > 5 * 1024 * 1024) return "Image must be 5 MB or smaller.";
  return undefined;
}

// Save a small local thumbnail, not the full original file, to limit storage use.
export async function photoThumbnail(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to preview image");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.75);
  } finally { bitmap.close(); }
}