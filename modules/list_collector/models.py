from dataclasses import dataclass, field
from typing import Optional


@dataclass
class TargetUser:
    """収集したターゲットユーザーの情報"""
    user_id: str
    username: str
    display_name: str
    bio: str = ""
    followers_count: int = 0
    following_count: int = 0
    tweet_count: int = 0
    location: str = ""
    website: str = ""
    recent_tweets: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)  # 分類タグ（業種など）
    source: str = ""  # 収集元（csv, search, follower_list など）

    def to_dict(self) -> dict:
        return {
            "user_id": self.user_id,
            "username": self.username,
            "display_name": self.display_name,
            "bio": self.bio,
            "followers_count": self.followers_count,
            "following_count": self.following_count,
            "tweet_count": self.tweet_count,
            "location": self.location,
            "website": self.website,
            "recent_tweets": self.recent_tweets,
            "tags": self.tags,
            "source": self.source,
        }
