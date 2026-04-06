import { NextResponse } from "next/server";
import * as store from "@/lib/schedule-store";
import type { PlatformType } from "@/lib/types";

export async function GET() {
  const posts = await store.readAll();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { content, platform, scheduledAt } = body as {
    content?: string;
    platform?: PlatformType;
    scheduledAt?: string;
  };

  if (!content?.trim()) {
    return NextResponse.json({ error: "投稿内容は必須です" }, { status: 400 });
  }
  if (!scheduledAt) {
    return NextResponse.json({ error: "予約日時は必須です" }, { status: 400 });
  }

  const post = await store.create({
    content: content.trim(),
    platform: platform || "twitter",
    scheduledAt,
  });

  return NextResponse.json(post, { status: 201 });
}
