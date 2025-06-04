


          
# AI Assistant App

这是一个多功能AI助手应用，集成了图像分析、文本处理和智能对话功能，采用前后端分离架构。

## ✨ 功能特性

- 🖼️ **智能图像分析**：基于InternVL模型的图像理解和分析
- 💬 **智能对话**：支持多轮对话和上下文理解
- 📝 **文本处理**：文本分析和处理功能
- 📊 **数据分析**：数据可视化和分析工具
- 🎨 **现代化UI**：基于Chakra UI的响应式界面
- 📱 **跨平台**：支持Web和移动端（Capacitor）

## 🏗️ 项目结构

```
ai-assistant-app/
├── frontend/                 # React 前端应用
│   ├── src/
│   │   ├── components/       # React 组件
│   │   ├── features/         # 功能模块
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理 (Zustand)
│   │   └── theme/           # 主题配置
│   └── package.json
├── backend/                  # Python 后端服务
│   ├── internvl_service/    # InternVL 图像分析服务
│   │   ├── app.py          # Flask 应用入口
│   │   ├── config.py       # 配置文件
│   │   ├── routes/         # API 路由
│   │   ├── utils/          # 工具函数
│   │   └── requirements.txt
│   ├── text_service/        # 文本处理服务
│   └── data_service/        # 数据分析服务
└── docs/                    # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Python >= 3.8
- pip >= 21.0

### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端服务将在 `http://localhost:3000` 启动

### 后端启动

```bash
# 进入后端服务目录
cd backend/internvl_service

# 安装Python依赖
pip install -r requirements.txt

# 启动Flask服务
python app.py
```

后端API服务将在 `http://localhost:5000` 启动

## 🛠️ 技术栈

### 前端技术

- **React 18** - 用户界面框架
- **Chakra UI** - 组件库和设计系统
- **Zustand** - 轻量级状态管理
- **React Query** - 数据获取和缓存
- **React Markdown** - Markdown渲染
- **Framer Motion** - 动画库
- **Capacitor** - 跨平台移动应用

### 后端技术

- **Flask** - Web框架
- **PyTorch** - 深度学习框架
- **Transformers** - 预训练模型库
- **InternVL** - 多模态视觉语言模型
- **Pillow** - 图像处理
- **NumPy** - 数值计算

## 📝 API 文档

### 图像分析接口

```http
POST /api/analyze-image
Content-Type: multipart/form-data

参数:
- image: 图像文件
- prompt: 分析提示词（可选）

响应:
{
  "result": "分析结果",
  "confidence": 0.95,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 文本处理接口

```http
POST /api/process-text
Content-Type: application/json

{
  "text": "待处理文本",
  "task": "summarize|translate|analyze"
}
```

## 🔧 开发指南

### 前端开发

```bash
# 运行测试
npm test

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 后端开发

```bash
# 安装开发依赖
pip install -r requirements-dev.txt

# 运行测试
python -m pytest

# 代码格式化
black .
```

## 📦 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 生产环境

1. 前端构建：`npm run build`
2. 部署到静态文件服务器（如Nginx）
3. 后端部署到云服务器
4. 配置反向代理和HTTPS

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- 项目维护者：[Azi]
- 邮箱：[chanzimail@gmail.com]
- 项目地址：[https://github.com/Azi9527/Al-Appp.git]

## 🙏 致谢

感谢以下开源项目：

- [InternVL](https://github.com/OpenGVLab/InternVL) - 多模态视觉语言模型
- [React](https://reactjs.org/) - 用户界面库
- [Chakra UI](https://chakra-ui.com/) - 组件库
- [Flask](https://flask.palletsprojects.com/) - Web框架
        