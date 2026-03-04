from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # X API
    x_api_key: str = Field("", alias="X_API_KEY")
    x_api_secret: str = Field("", alias="X_API_SECRET")
    x_access_token: str = Field("", alias="X_ACCESS_TOKEN")
    x_access_token_secret: str = Field("", alias="X_ACCESS_TOKEN_SECRET")
    x_bearer_token: str = Field("", alias="X_BEARER_TOKEN")

    # Anthropic
    anthropic_api_key: str = Field("", alias="ANTHROPIC_API_KEY")

    # 送信設定
    dm_interval_seconds: int = Field(60, alias="DM_INTERVAL_SECONDS")
    dm_daily_limit: int = Field(50, alias="DM_DAILY_LIMIT")
    dm_dry_run: bool = Field(True, alias="DM_DRY_RUN")

    # ログ
    log_level: str = Field("INFO", alias="LOG_LEVEL")
    log_file: str = Field("data/logs/dm_system.log", alias="LOG_FILE")

    model_config = {"env_file": ".env", "populate_by_name": True}


settings = Settings()
