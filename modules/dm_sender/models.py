from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional


class SendStatus(Enum):
    PENDING = "pending"
    SENT = "sent"
    SKIPPED = "skipped"      # dry_run または品質スコア不足でスキップ
    FAILED = "failed"
    RATE_LIMITED = "rate_limited"


@dataclass
class DMResult:
    """DM送信結果"""
    target_username: str
    message: str
    status: SendStatus
    sent_at: Optional[datetime] = None
    dm_conversation_id: Optional[str] = None
    error_message: str = ""
    quality_score: float = 0.0
    is_dry_run: bool = False

    def to_dict(self) -> dict:
        return {
            "target_username": self.target_username,
            "message": self.message,
            "status": self.status.value,
            "sent_at": self.sent_at.isoformat() if self.sent_at else "",
            "dm_conversation_id": self.dm_conversation_id or "",
            "error_message": self.error_message,
            "quality_score": self.quality_score,
            "is_dry_run": self.is_dry_run,
        }
