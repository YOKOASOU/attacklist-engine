"""
3モジュールを統合するオーケストレーター

実行フロー:
  1. ListCollector  → アタックリスト収集
  2. MessageGenerator → DM生成・ブラッシュアップ
  3. DMSender        → 自動送信
"""

import json
import logging
from pathlib import Path
from typing import Optional

from modules.list_collector import ListCollector, TargetUser
from modules.message_generator import MessageGenerator, MessageTemplate
from modules.dm_sender import DMSender
from modules.message_generator.models import GeneratedMessage

logger = logging.getLogger(__name__)


def load_template(template_name: str, templates_path: str = "data/templates/sample_templates.json") -> MessageTemplate:
    """JSONファイルからテンプレートを読み込む"""
    with open(templates_path, encoding="utf-8") as f:
        templates_data = json.load(f)

    for t in templates_data:
        if t["name"] == template_name:
            return MessageTemplate(
                name=t["name"],
                purpose=t["purpose"],
                base_template=t["base_template"],
                tone=t.get("tone", "丁寧"),
                max_length=t.get("max_length", 280),
            )
    raise ValueError(f"テンプレートが見つかりません: {template_name}")


class DMOrchestrator:
    """3モジュール統合オーケストレーター"""

    def __init__(self):
        self.collector = ListCollector()
        self.generator = MessageGenerator()
        self.sender = DMSender()

    def run_from_csv(
        self,
        csv_path: str,
        template_name: str = "sales_proposal",
        min_quality_score: float = 0.7,
        do_brushup: bool = True,
        limit: Optional[int] = None,
    ) -> list[dict]:
        """
        CSVからリストを読み込み → DM生成 → 送信までを一括実行

        Args:
            csv_path: アタックリストのCSVパス
            template_name: 使用するテンプレート名
            min_quality_score: この値未満の品質スコアのDMはスキップ
            do_brushup: True=Claude APIでブラッシュアップを行う
            limit: 処理件数上限（None=全件）
        """
        # Step 1: リスト収集
        logger.info("=== Step 1: アタックリスト収集 ===")
        targets = self.collector.from_csv(csv_path)
        if limit:
            targets = targets[:limit]
        logger.info(f"{len(targets)} 件のターゲットを読み込みました")

        # Step 2: DM生成
        logger.info("=== Step 2: DM生成・ブラッシュアップ ===")
        template = load_template(template_name)
        generated_messages = []
        for target in targets:
            msg = self.generator.generate_and_brushup(
                target=target,
                template=template,
                do_brushup=do_brushup,
                do_scoring=True,
                min_score=min_quality_score,
            )
            generated_messages.append(msg)
            logger.info(
                f"  @{target.username}: スコア={msg.quality_score:.2f}, "
                f"承認={msg.is_approved}, {msg.char_count()}文字"
            )

        approved = [m for m in generated_messages if m.is_approved]
        logger.info(f"承認済みDM: {len(approved)}/{len(generated_messages)} 件")

        # Step 3: 送信
        logger.info("=== Step 3: DM自動送信 ===")
        results = self.sender.send_batch(
            messages=approved,
            min_quality_score=min_quality_score,
        )

        return [r.to_dict() for r in results]

    def run_from_keyword(
        self,
        keywords: list[str],
        template_name: str = "sales_proposal",
        min_followers: int = 100,
        max_results: int = 50,
        min_quality_score: float = 0.7,
        do_brushup: bool = True,
    ) -> list[dict]:
        """
        キーワード検索でリストを収集 → DM生成 → 送信

        Args:
            keywords: 検索キーワードリスト
            template_name: 使用するテンプレート名
            min_followers: 最小フォロワー数
            max_results: 最大収集件数
            min_quality_score: 品質スコア閾値
            do_brushup: ブラッシュアップを行うか
        """
        # Step 1: キーワード検索でリスト収集
        logger.info("=== Step 1: キーワード検索でリスト収集 ===")
        targets = self.collector.from_keyword_search(
            keywords=keywords,
            max_results=max_results,
            min_followers=min_followers,
        )
        logger.info(f"{len(targets)} 件のターゲットを収集しました")

        # Step 2 & 3: 生成・送信
        return self._generate_and_send(targets, template_name, min_quality_score, do_brushup)

    def preview_messages(
        self,
        csv_path: str,
        template_name: str = "sales_proposal",
        limit: int = 5,
        do_brushup: bool = True,
    ) -> list[GeneratedMessage]:
        """
        送信前のプレビュー（DRY RUN）

        実際には送信せずにDMの内容を確認できる。
        """
        targets = self.collector.from_csv(csv_path)[:limit]
        template = load_template(template_name)
        messages = []
        for target in targets:
            msg = self.generator.generate_and_brushup(
                target=target,
                template=template,
                do_brushup=do_brushup,
                do_scoring=True,
            )
            messages.append(msg)
        return messages

    def _generate_and_send(
        self,
        targets: list[TargetUser],
        template_name: str,
        min_quality_score: float,
        do_brushup: bool,
    ) -> list[dict]:
        template = load_template(template_name)
        generated_messages = []
        for target in targets:
            msg = self.generator.generate_and_brushup(
                target=target,
                template=template,
                do_brushup=do_brushup,
                do_scoring=True,
                min_score=min_quality_score,
            )
            generated_messages.append(msg)

        approved = [m for m in generated_messages if m.is_approved]
        results = self.sender.send_batch(messages=approved, min_quality_score=min_quality_score)
        return [r.to_dict() for r in results]
