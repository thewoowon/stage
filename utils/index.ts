export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function isValidUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getThumbnail(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const match = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function getLinkPreview(url: string) {
  const valid = await isValidUrl(url);
  if (!valid) {
    return { valid: false, thumbnail: null };
  }

  const thumbnail = await getThumbnail(url);
  return { valid: true, thumbnail };
}
