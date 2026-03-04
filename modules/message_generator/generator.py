"""
送付文生成・ブラッシュアップモジュール

Claude APIを使用して:
1. ターゲットのプロフィール情報を分析
2. パーソナライズされたDMを生成
3. 効果的な表現へのブラッシュアップ
4. 品質スコアリング
"""

import logging
from typing import Optional

import anthropic

from config import settings
from modules.list_collector.models import TargetUser
from .models import GeneratedMessage, MessageTemplate

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """あなたはプロのビジネスコミュニケーションの専門家です。
X（旧Twitter）のダイレクトメッセージとして送る文章を作成します。

以下の原則に従ってください:
- 相手のプロフィールや活動に基づいてパーソナライズする
- 自然で親しみやすい文体を使う（スパムに見えない）
- 価値提供を明確にする
- 具体的な行動を促すCTAを含める
- 280文字以内に収める
- 相手の名前を適切に使う
- 相手の投稿内容や専門分野に触れて共感を示す"""


GENERATION_PROMPT_TEMPLATE = """以下のターゲット情報を基に、ダイレクトメッセージを作成してください。

【ターゲット情報】
- ユーザー名: @{username}
- 表示名: {display_name}
- プロフィール: {bio}
- フォロワー数: {followers_count}
- 最近のツイート: {recent_tweets}

【送付目的】
{purpose}

【文体】
{tone}

【ベーステンプレート（参考）】
{base_template}

【要件】
- 280文字以内
- 冒頭で相手に呼びかける（例: 「{display_name}さん、」）
- 相手のプロフィールへの具体的な言及を1箇所入れる
- 自然な流れでCTAを含める

送付文のみを出力してください（説明文は不要）。"""


BRUSHUP_PROMPT_TEMPLATE = """以下のDMを、より効果的に改善してください。

【現在のDM】
{current_message}

【ターゲット情報】
- 表示名: {display_name}
- プロフィール: {bio}

【改善の観点】
1. 開封率・返信率を高める書き出し
2. スパムに見えないパーソナライズ感
3. 読みやすさとテンポ
4. 明確なベネフィット提示
5. 280文字以内の制約

改善されたDM本文のみを出力してください。"""


SCORING_PROMPT_TEMPLATE = """以下のDMを0.0〜1.0でスコアリングしてください。

【評価するDM】
{message}

【評価基準】
- パーソナライズ度（0.0〜0.25）: ターゲットの特徴が反映されているか
- 自然さ（0.0〜0.25）: スパムに見えないか、自然な文章か
- 価値提示（0.0〜0.25）: 相手へのベネフィットが明確か
- CTA明確さ（0.0〜0.25）: 次のアクションが明確か

JSON形式で返してください:
{{"score": 0.85, "breakdown": {{"personalization": 0.20, "naturalness": 0.22, "value": 0.23, "cta": 0.20}}, "feedback": "改善点の簡単なコメント"}}"""


class MessageGenerator:
    """Claude APIを使ったDM生成・ブラッシュアップクラス"""

    def __init__(self):
        if not settings.anthropic_api_key:
            raise RuntimeError("ANTHROPIC_API_KEY が設定されていません")
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-sonnet-4-6"

    def generate(
        self,
        target: TargetUser,
        template: MessageTemplate,
    ) -> GeneratedMessage:
        """ターゲット情報を基にDMを生成する"""
        recent_tweets_str = (
            "\n".join(f"- {t}" for t in target.recent_tweets[:3])
            if target.recent_tweets
            else "（取得なし）"
        )

        prompt = GENERATION_PROMPT_TEMPLATE.format(
            username=target.username,
            display_name=target.display_name,
            bio=target.bio or "（プロフィールなし）",
            followers_count=target.followers_count,
            recent_tweets=recent_tweets_str,
            purpose=template.purpose,
            tone=template.tone,
            base_template=template.base_template,
        )

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=500,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            message_text = response.content[0].text.strip()
        except anthropic.APIError as e:
            logger.error(f"Claude API エラー: {e}")
            # フォールバック: テンプレートをそのまま使用
            message_text = template.base_template.format(
                username=target.username,
                display_name=target.display_name,
            )

        generated = GeneratedMessage(
            target_username=target.username,
            target_display_name=target.display_name,
            message=message_text,
            template_name=template.name,
        )

        # 文字数超過の場合は自動トリミング
        if not generated.is_within_limit(template.max_length):
            generated = self._trim_to_limit(generated, template.max_length)

        return generated

    def brushup(self, generated: GeneratedMessage, target: TargetUser) -> GeneratedMessage:
        """生成したDMをさらにブラッシュアップする"""
        prompt = BRUSHUP_PROMPT_TEMPLATE.format(
            current_message=generated.message,
            display_name=target.display_name,
            bio=target.bio or "（プロフィールなし）",
        )

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=500,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            improved_text = response.content[0].text.strip()
            generated.message = improved_text
            generated.generation_notes += " [brushed_up]"
        except anthropic.APIError as e:
            logger.error(f"ブラッシュアップ中にエラー: {e}")

        return generated

    def score(self, generated: GeneratedMessage) -> GeneratedMessage:
        """DMの品質スコアを算出する"""
        import json

        prompt = SCORING_PROMPT_TEMPLATE.format(message=generated.message)

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}],
            )
            result_text = response.content[0].text.strip()

            # JSONを抽出
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()

            result = json.loads(result_text)
            generated.quality_score = float(result.get("score", 0.5))
            feedback = result.get("feedback", "")
            if feedback:
                generated.generation_notes += f" | スコア: {generated.quality_score:.2f} | {feedback}"
        except (anthropic.APIError, json.JSONDecodeError, KeyError) as e:
            logger.error(f"スコアリングエラー: {e}")
            generated.quality_score = 0.5

        return generated

    def generate_and_brushup(
        self,
        target: TargetUser,
        template: MessageTemplate,
        do_brushup: bool = True,
        do_scoring: bool = True,
        min_score: float = 0.7,
    ) -> GeneratedMessage:
        """生成・ブラッシュアップ・スコアリングをワンストップで実行"""
        logger.info(f"DM生成中: @{target.username}")
        generated = self.generate(target, template)

        if do_brushup:
            generated = self.brushup(generated, target)

        if do_scoring:
            generated = self.score(generated)
            generated.is_approved = generated.quality_score >= min_score
        else:
            generated.is_approved = True

        return generated

    def _trim_to_limit(self, generated: GeneratedMessage, limit: int) -> GeneratedMessage:
        """文字数制限に合わせてDMをトリミング"""
        if len(generated.message) <= limit:
            return generated

        # 最後の句読点で切る
        text = generated.message[:limit]
        for punct in ["。", "！", ".", "!"]:
            last_idx = text.rfind(punct)
            if last_idx > limit * 0.7:
                generated.message = text[: last_idx + 1]
                return generated

        generated.message = text[:limit - 1] + "…"
        return generated
