"""
DM自動送信モジュール

X API v2 を使ってダイレクトメッセージを送信する。
- レート制限の遵守（設定可能な送信間隔）
- 1日の送信上限管理
- dry_runモード（実際には送信しないテスト実行）
- 送信ログの記録
"""

import csv
import logging
import time
from datetime import datetime, date
from pathlib import Path
from typing import Optional

import tweepy
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings
from modules.message_generator.models import GeneratedMessage
from .models import DMResult, SendStatus

logger = logging.getLogger(__name__)


class DMSender:
    """X API DM送信クラス"""

    def __init__(self, log_dir: str = "data/logs"):
        self.client = self._init_x_client()
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.sent_today = self._load_today_count()
        self.results: list[DMResult] = []

    def _init_x_client(self) -> Optional[tweepy.Client]:
        if not settings.x_access_token:
            logger.warning("X アクセストークンが設定されていません。DM送信は無効です。")
            return None
        return tweepy.Client(
            consumer_key=settings.x_api_key,
            consumer_secret=settings.x_api_secret,
            access_token=settings.x_access_token,
            access_token_secret=settings.x_access_token_secret,
            wait_on_rate_limit=True,
        )

    def _load_today_count(self) -> int:
        """今日の送信済み件数をログから読み込む"""
        log_file = self._get_today_log_path()
        if not log_file.exists():
            return 0
        try:
            with open(log_file, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                return sum(
                    1 for row in reader
                    if row.get("status") == SendStatus.SENT.value
                    and not row.get("is_dry_run", "True") == "True"
                )
        except Exception:
            return 0

    def _get_today_log_path(self) -> Path:
        return self.log_dir / f"send_log_{date.today().isoformat()}.csv"

    def _append_to_log(self, result: DMResult) -> None:
        log_file = self._get_today_log_path()
        write_header = not log_file.exists()
        with open(log_file, "a", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=result.to_dict().keys())
            if write_header:
                writer.writeheader()
            writer.writerow(result.to_dict())

    def _get_user_id(self, username: str) -> Optional[str]:
        """usernameからuser_idを取得"""
        if not self.client:
            return None
        try:
            response = self.client.get_user(username=username)
            if response.data:
                return str(response.data.id)
        except tweepy.TweepyException as e:
            logger.error(f"ユーザーID取得エラー (@{username}): {e}")
        return None

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=4, max=30),
    )
    def _send_dm_api(self, participant_id: str, message: str) -> Optional[str]:
        """X API v2 でDMを送信する（リトライ付き）"""
        response = self.client.create_direct_message(
            participant_id=participant_id,
            text=message,
        )
        if response.data:
            return str(response.data.get("dm_conversation_id", ""))
        return None

    def send(
        self,
        generated: GeneratedMessage,
        min_quality_score: float = 0.7,
    ) -> DMResult:
        """
        1件のDMを送信する。

        dry_runがTrueの場合は実際には送信しない。
        品質スコアがmin_quality_scoreを下回る場合はスキップ。
        """
        result = DMResult(
            target_username=generated.target_username,
            message=generated.message,
            status=SendStatus.PENDING,
            quality_score=generated.quality_score,
            is_dry_run=settings.dm_dry_run,
        )

        # 品質スコアチェック
        if generated.quality_score > 0 and generated.quality_score < min_quality_score:
            logger.warning(
                f"スキップ (@{generated.target_username}): "
                f"品質スコア {generated.quality_score:.2f} < {min_quality_score}"
            )
            result.status = SendStatus.SKIPPED
            result.error_message = f"品質スコア不足: {generated.quality_score:.2f}"
            self._append_to_log(result)
            return result

        # 1日の上限チェック
        if self.sent_today >= settings.dm_daily_limit:
            logger.warning(f"本日の送信上限 ({settings.dm_daily_limit}件) に達しました")
            result.status = SendStatus.RATE_LIMITED
            result.error_message = f"1日の上限 {settings.dm_daily_limit} 件に達しました"
            self._append_to_log(result)
            return result

        # dry_runモード
        if settings.dm_dry_run:
            logger.info(
                f"[DRY RUN] DM送信をシミュレート: @{generated.target_username}\n"
                f"  メッセージ ({len(generated.message)}文字):\n  {generated.message}"
            )
            result.status = SendStatus.SKIPPED
            result.error_message = "DRY RUN - 実際には送信されていません"
            result.sent_at = datetime.now()
            self._append_to_log(result)
            return result

        # 実際の送信
        if not self.client:
            result.status = SendStatus.FAILED
            result.error_message = "X APIクライアントが初期化されていません"
            self._append_to_log(result)
            return result

        user_id = _resolve_user_id(generated)
        if not user_id:
            user_id = self._get_user_id(generated.target_username)
        if not user_id:
            result.status = SendStatus.FAILED
            result.error_message = "ユーザーIDが取得できませんでした"
            self._append_to_log(result)
            return result

        try:
            conversation_id = self._send_dm_api(user_id, generated.message)
            result.status = SendStatus.SENT
            result.sent_at = datetime.now()
            result.dm_conversation_id = conversation_id
            self.sent_today += 1
            logger.info(f"DM送信完了: @{generated.target_username} ({self.sent_today}/{settings.dm_daily_limit})")
        except tweepy.TweepyException as e:
            result.status = SendStatus.FAILED
            result.error_message = str(e)
            logger.error(f"DM送信失敗 (@{generated.target_username}): {e}")

        self._append_to_log(result)
        return result

    def send_batch(
        self,
        messages: list[GeneratedMessage],
        min_quality_score: float = 0.7,
        interval_seconds: Optional[int] = None,
    ) -> list[DMResult]:
        """
        複数のDMをバッチ送信する。
        送信間隔を設けてレート制限に対応。
        """
        wait_time = interval_seconds or settings.dm_interval_seconds
        results = []

        for i, msg in enumerate(messages):
            result = self.send(msg, min_quality_score=min_quality_score)
            results.append(result)
            self.results.append(result)

            # 最後のメッセージ以外は待機
            if i < len(messages) - 1 and result.status in (SendStatus.SENT, SendStatus.SKIPPED):
                if result.status == SendStatus.SENT:
                    logger.info(f"次の送信まで {wait_time} 秒待機...")
                    time.sleep(wait_time)

            # 上限到達で停止
            if result.status == SendStatus.RATE_LIMITED:
                logger.warning("上限到達のため送信を停止します")
                break

        self._print_summary(results)
        return results

    def _print_summary(self, results: list[DMResult]) -> None:
        sent = sum(1 for r in results if r.status == SendStatus.SENT)
        skipped = sum(1 for r in results if r.status == SendStatus.SKIPPED)
        failed = sum(1 for r in results if r.status == SendStatus.FAILED)
        dry_run_count = sum(1 for r in results if r.is_dry_run and r.status == SendStatus.SKIPPED)
        logger.info(
            f"\n=== 送信サマリー ===\n"
            f"  送信成功: {sent}\n"
            f"  スキップ: {skipped} (うちDRY RUN: {dry_run_count})\n"
            f"  失敗: {failed}\n"
            f"  合計: {len(results)}"
        )


def _resolve_user_id(generated: GeneratedMessage) -> Optional[str]:
    """GeneratedMessageからuser_idを解決する（将来の拡張用）"""
    return None
