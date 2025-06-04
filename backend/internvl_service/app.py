from flask import Flask
from flask_cors import CORS
from routes.health import health_bp
from routes.chat import chat_bp
from config import Config  # 确保导入Config
import logging
import os

# 创建Flask应用
app = Flask(__name__)
app.config.from_object(Config)

# 配置CORS
CORS(app, origins=[
    'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002',
    'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002',
    'http://192.168.3.8', 'http://192.168.3.8:3000', 'http://192.168.3.8:3001', 'http://192.168.3.8:3002'
])

# 配置日志 - 修复中文乱码
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log', encoding='utf-8'),  # 添加utf-8编码
        logging.StreamHandler()
    ]
)

# 注册蓝图
app.register_blueprint(health_bp)
app.register_blueprint(chat_bp)

if __name__ == '__main__':
    # 确保日志目录存在
    os.makedirs('logs', exist_ok=True)
    # 使用config中的端口配置
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)