import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { GenerateRequest, GeneratedVariant } from "@/lib/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { theme, target, purpose, tone, charCount, includeCta, persona } = body;

    if (!theme?.trim()) {
      return NextResponse.json(
        { error: "テーマは必須です" },
        { status: 400 }
      );
    }

    const ctaLine = includeCta
      ? `- CTA: 含める（読者に具体的な行動を促す一文を末尾に入れる）`
      : `- CTA: 含めない（ctaフィールドは空文字にする）`;

    const personaLine = persona
      ? `- ペルソナ情報: ${persona}`
      : "";

    const prompt = `あなたはX投稿のプロ編集者です。
以下の条件をもとに、反応が取りやすい日本語の短文投稿を3案作成してください。

## 条件
- テーマ: ${theme}
- ターゲット: ${target || "一般のXユーザー"}
- 目的: ${purpose || "情報発信・認知拡大"}
- 文体: ${tone || "カジュアル"}
- 文字数目安: ${charCount || 280}文字
${ctaLine}
${personaLine}

## 出力ルール
- 1案ずつ見出し付き
- 冒頭1行は強いフック（思わず止まる一文）
- 改行を活用して読みやすく
- 読みやすさ重視（一文を短く）
- 抽象論で終わらず具体性を入れる
- 日本のXユーザー向けの自然な言い回し
- 絵文字は控えめに（1〜2個まで）

## 出力形式
必ず以下のJSON配列形式のみで返してください。JSON以外のテキスト・コードブロック記号は含めないでください。

[
  {
    "title": "この案の見出し（10〜20文字の短いラベル）",
    "hook": "冒頭の1文。読者の手を止める強いフック。",
    "body": "本文。改行を含む読みやすい構成。${charCount || 280}文字以内。",
    "cta": "${includeCta ? "読者に取ってほしい具体的な行動を促す一文" : ""}",
    "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "ハッシュタグ3"]
  }
]

3案それぞれ切り口・アプローチを変えてください。`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

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
