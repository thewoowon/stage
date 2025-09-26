import { NextResponse } from "next/server";

// ✅ 썸네일 추출 함수
async function getThumbnail(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const html = await res.text();

    // Open Graph 이미지 메타태그 파싱
    const match = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/
    );

    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// ✅ API 핸들러
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { valid: false, thumbnail: null },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      return NextResponse.json({ valid: false, thumbnail: null });
    }

    const thumbnail = await getThumbnail(url);

    return NextResponse.json({
      valid: true,
      thumbnail,
    });
  } catch {
    return NextResponse.json({ valid: false, thumbnail: null });
  }
}
