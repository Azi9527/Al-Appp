@echo off
echo 启动 InternVL 服务...
echo.

REM 检查Python环境
python --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Python环境
    pause
    exit /b 1
)

REM 安装依赖
echo 检查并安装依赖...
pip install -r requirements.txt

REM 创建日志目录
if not exist "logs" mkdir logs

REM 启动服务
echo 启动Flask服务...
python app.py

pause