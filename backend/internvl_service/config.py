import os
from pathlib import Path

class Config:
    """应用配置类"""
    
    # 服务器配置
    HOST = "0.0.0.0"
    PORT = 8008
    DEBUG = False
    
    # 模型配置
    MODEL_PATH = r"D:\gitimage\InternVL\checkpoints\internvl-chat-14b"
    
    # 日志配置
    LOG_LEVEL = "INFO"
    LOG_FILE = "logs/internvl.log"
    
    # CORS配置
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://192.168.3.8",
        "http://192.168.3.8:3000",
        "http://192.168.3.8:3001",
        "http://192.168.3.8:3002"
    ]
    
    @classmethod
    def validate_model_path(cls):
        """验证模型路径是否存在"""
        model_path = Path(cls.MODEL_PATH)
        if not model_path.exists():
            raise FileNotFoundError(f"模型路径不存在: {cls.MODEL_PATH}")
        return True

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    
class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False
    LOG_LEVEL = "WARNING"