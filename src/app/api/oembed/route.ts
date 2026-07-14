import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Cache thumbnails for 24h — no quota issues
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl, { next: { revalidate: 86400 } });

    if (!res.ok) throw new Error("oEmbed failed");

    const data = await res.json();
    // YouTube oEmbed returns thumbnail_url at 480×360
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return NextResponse.json({
      title: data.title ?? null,
      thumbnailUrl,
      channel: data.author_name ?? null,
    });
  } catch {
    // Graceful fallback — client will show topic-colored placeholder
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
