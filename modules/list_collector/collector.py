"""
アタックリスト収集モジュール

収集方法:
1. CSVファイルからのインポート（username列必須）
2. X APIキーワード検索によるユーザー収集
3. 特定アカウントのフォロワー/フォロー中からの収集
"""

import csv
import logging
from pathlib import Path
from typing import Optional

import pandas as pd
import tweepy

from config import settings
from .models import TargetUser
from .filters import UserFilter

logger = logging.getLogger(__name__)


class ListCollector:
    """アタックリスト収集クラス"""

    def __init__(self):
        self.client = self._init_x_client()
        self.filter = UserFilter()

    def _init_x_client(self) -> Optional[tweepy.Client]:
        if not settings.x_bearer_token:
            logger.warning("X Bearer Tokenが設定されていません。X API機能は無効です。")
            return None
        return tweepy.Client(
            bearer_token=settings.x_bearer_token,
            consumer_key=settings.x_api_key,
            consumer_secret=settings.x_api_secret,
            access_token=settings.x_access_token,
            access_token_secret=settings.x_access_token_secret,
            wait_on_rate_limit=True,
        )

    def from_csv(self, filepath: str, tag: str = "") -> list[TargetUser]:
        """
        CSVファイルからターゲットリストを読み込む。
        必須列: username
        任意列: user_id, display_name, bio, tags
        """
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"ファイルが見つかりません: {filepath}")

        df = pd.read_csv(filepath)
        if "username" not in df.columns:
            raise ValueError("CSVに 'username' 列が必要です")

        users = []
        for _, row in df.iterrows():
            username = str(row["username"]).strip().lstrip("@")
            if not username:
                continue

            tags = []
            if tag:
                tags.append(tag)
            if "tags" in row and pd.notna(row["tags"]):
                tags.extend([t.strip() for t in str(row["tags"]).split(",")])

            user = TargetUser(
                user_id=str(row.get("user_id", "")),
                username=username,
                display_name=str(row.get("display_name", username)),
                bio=str(row.get("bio", "")),
                tags=tags,
                source="csv",
            )
            users.append(user)

        logger.info(f"CSVから {len(users)} 件のユーザーを読み込みました: {filepath}")
        return users

    def from_keyword_search(
        self,
        keywords: list[str],
        max_results: int = 100,
        min_followers: int = 100,
        tag: str = "",
    ) -> list[TargetUser]:
        """
        キーワード検索でツイートしているユーザーを収集する。
        X API Basic以上が必要。
        """
        if not self.client:
            raise RuntimeError("X APIクライアントが初期化されていません")

        query = " OR ".join(f'"{kw}"' for kw in keywords)
        query += " -is:retweet lang:ja"

        users: dict[str, TargetUser] = {}
        try:
            response = tweepy.Paginator(
                self.client.search_recent_tweets,
                query=query,
                expansions=["author_id"],
                user_fields=["description", "public_metrics", "location", "url"],
                max_results=min(max_results * 2, 100),
            ).flatten(limit=max_results * 2)

            # tweepyのPaginatorでuser情報を取得する場合は別途取得
            tweet_response = self.client.search_recent_tweets(
                query=query,
                expansions=["author_id"],
                user_fields=["description", "public_metrics", "location", "url", "name"],
                max_results=min(max_results, 100),
            )

            if tweet_response.includes and "users" in tweet_response.includes:
                for u in tweet_response.includes["users"]:
                    metrics = u.public_metrics or {}
                    if metrics.get("followers_count", 0) < min_followers:
                        continue
                    if u.id not in users:
                        users[str(u.id)] = TargetUser(
                            user_id=str(u.id),
                            username=u.username,
                            display_name=u.name or u.username,
                            bio=u.description or "",
                            followers_count=metrics.get("followers_count", 0),
                            following_count=metrics.get("following_count", 0),
                            tweet_count=metrics.get("tweet_count", 0),
                            tags=[tag] if tag else [],
                            source="keyword_search",
                        )

        except tweepy.TweepyException as e:
            logger.error(f"X API検索エラー: {e}")

        result = list(users.values())[:max_results]
        logger.info(f"キーワード検索で {len(result)} 件のユーザーを収集しました")
        return result

    def from_follower_list(
        self,
        target_username: str,
        max_results: int = 200,
        collect_type: str = "followers",
        tag: str = "",
    ) -> list[TargetUser]:
        """
        指定アカウントのフォロワー or フォロー中からユーザーを収集する。
        collect_type: 'followers' または 'following'
        X API Basic以上が必要。
        """
        if not self.client:
            raise RuntimeError("X APIクライアントが初期化されていません")

        # ターゲットのuser_id取得
        try:
            user_response = self.client.get_user(
                username=target_username,
                user_fields=["id"],
            )
            if not user_response.data:
                raise ValueError(f"ユーザーが見つかりません: {target_username}")
            target_id = user_response.data.id
        except tweepy.TweepyException as e:
            logger.error(f"ユーザー取得エラー: {e}")
            return []

        users = []
        try:
            fetch_fn = (
                self.client.get_users_followers
                if collect_type == "followers"
                else self.client.get_users_following
            )
            response = fetch_fn(
                id=target_id,
                user_fields=["description", "public_metrics", "location", "name"],
                max_results=min(max_results, 1000),
            )
            if response.data:
                for u in response.data:
                    metrics = u.public_metrics or {}
                    users.append(
                        TargetUser(
                            user_id=str(u.id),
                            username=u.username,
                            display_name=u.name or u.username,
                            bio=u.description or "",
                            followers_count=metrics.get("followers_count", 0),
                            following_count=metrics.get("following_count", 0),
                            tweet_count=metrics.get("tweet_count", 0),
                            tags=[tag] if tag else [],
                            source=f"{collect_type}_of_{target_username}",
                        )
                    )
        except tweepy.TweepyException as e:
            logger.error(f"フォロワー取得エラー: {e}")

        result = users[:max_results]
        logger.info(f"{target_username}の{collect_type}から {len(result)} 件を収集しました")
        return result

    def apply_filters(
        self,
        users: list[TargetUser],
        min_followers: int = 0,
        max_followers: int = 0,
        bio_keywords: list[str] = None,
        exclude_keywords: list[str] = None,
    ) -> list[TargetUser]:
        """フィルタリングを適用してユーザーリストを絞り込む"""
        return self.filter.apply(
            users,
            min_followers=min_followers,
            max_followers=max_followers,
            bio_keywords=bio_keywords or [],
            exclude_keywords=exclude_keywords or [],
        )

    def save_to_csv(self, users: list[TargetUser], filepath: str) -> None:
        """収集したリストをCSVに保存"""
        path = Path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        rows = [u.to_dict() for u in users]
        df = pd.DataFrame(rows)
        df.to_csv(filepath, index=False, encoding="utf-8-sig")
        logger.info(f"{len(users)} 件のユーザーを保存しました: {filepath}")
