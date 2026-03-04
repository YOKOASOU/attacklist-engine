import logging
from .models import TargetUser

logger = logging.getLogger(__name__)


class UserFilter:
    """ターゲットユーザーのフィルタリング"""

    def apply(
        self,
        users: list[TargetUser],
        min_followers: int = 0,
        max_followers: int = 0,
        bio_keywords: list[str] = None,
        exclude_keywords: list[str] = None,
    ) -> list[TargetUser]:
        original_count = len(users)
        result = users

        if min_followers > 0:
            result = [u for u in result if u.followers_count >= min_followers]

        if max_followers > 0:
            result = [u for u in result if u.followers_count <= max_followers]

        if bio_keywords:
            keywords_lower = [kw.lower() for kw in bio_keywords]
            result = [
                u for u in result
                if any(kw in u.bio.lower() for kw in keywords_lower)
            ]

        if exclude_keywords:
            excludes_lower = [kw.lower() for kw in exclude_keywords]
            result = [
                u for u in result
                if not any(kw in u.bio.lower() for kw in excludes_lower)
            ]

        # 重複除去（username基準）
        seen = set()
        unique = []
        for u in result:
            if u.username not in seen:
                seen.add(u.username)
                unique.append(u)
        result = unique

        logger.info(f"フィルター適用: {original_count} → {len(result)} 件")
        return result
