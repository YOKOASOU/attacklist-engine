from dataclasses import dataclass, field
from typing import Optional


@dataclass
class MessageTemplate:
    """送付文テンプレート"""
    name: str
    purpose: str           # 目的（例: 営業提案、コラボ打診、イベント招待）
    base_template: str     # ベーステンプレート（{username}などのプレースホルダー付き）
    tone: str = "丁寧"     # 文体（丁寧/フレンドリー/ビジネス）
    max_length: int = 280  # X DMの文字数上限


@dataclass
class GeneratedMessage:
    """生成された送付文"""
    target_username: str
    target_display_name: str
    message: str
    template_name: str
    quality_score: float = 0.0   # 0.0〜1.0
    is_approved: bool = False
    generation_notes: str = ""

    def char_count(self) -> int:
        return len(self.message)

    def is_within_limit(self, limit: int = 280) -> bool:
        return self.char_count() <= limit
