from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SkyPulse Analytics API"
    app_version: str = "1.0.0"
    debug: bool = True

    pinot_controller_url: str = "http://192.168.3.84:9000"
    pinot_broker_url: str = "http://192.168.3.84:8099"

    jwt_secret: str = "skypulse-jwt-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    redis_url: str = "redis://localhost:6379/0"
    database_url: str = "sqlite:///./skypulse.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
