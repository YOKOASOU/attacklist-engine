import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { GenerateRequest, GeneratedVariant } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    const { theme, target, purpose, tone, charCount, includeCta, platform } = body;

    if (!theme?.trim()) {
      return NextResponse.json(
        { error: "テーマは必須です" },
        { status: 400 }
      );
    }

    const platformLabel = {
      twitter: "X (Twitter)",
      instagram: "Instagram",
      threads: "Threads",
    }[platform] ?? platform;

    const prompt = `あなたはSNS投稿のプロライターです。以下の条件でSNS投稿を3パターン生成してください。

## 条件
- テーマ: ${theme}
- ターゲット: ${target || "一般"}
- 目的: ${purpose || "情報発信"}
- トーン: ${tone || "カジュアル"}
- プラットフォーム: ${platformLabel}
- 目安文字数: ${charCount || 280}文字
- CTA（行動喚起）: ${includeCta ? "含める" : "含めない"}

## 出力形式
必ず以下のJSON配列形式で返してください。JSON以外のテキストは含めないでください。

[
  {
    "title": "投稿のタイトル案（10〜20文字）",
    "hook": "冒頭の1文で読者の注意を引くフック",
    "body": "本文（${charCount || 280}文字以内）",
    "cta": "${includeCta ? "読者に取ってほしい行動を促す文" : ""}",
    "hashtags": ["関連ハッシュタグ1", "関連ハッシュタグ2", "関連ハッシュタグ3"]
  }
]

3パターン分を配列で返してください。各パターンはアプローチや切り口を変えてください。`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // JSONを抽出（コードブロックに包まれている場合も対応）
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIの応答からJSONを解析できませんでした", raw: text },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      title: string;
      hook: string;
      body: string;
      cta: string;
      hashtags: string[];
    }>;

    const variants: GeneratedVariant[] = parsed.map((item, i) => ({
      id: `gen-${Date.now()}-${i}`,
      title: item.title,
      hook: item.hook,
      body: item.body,
      cta: item.cta || "",
      hashtags: item.hashtags || [],
    }));

    return NextResponse.json({ variants });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("authentication") || message.includes("api_key")) {
      return NextResponse.json(
        { error: "APIキーが設定されていないか無効です。.env.local の ANTHROPIC_API_KEY を確認してください。" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
