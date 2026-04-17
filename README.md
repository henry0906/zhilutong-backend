# 智路通·AI报价大师 - 后端服务

> 公路检测行业智能报价软件后端API服务

## 🚀 快速开始

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/您的用户名/zhilutong-backend.git
cd zhilutong-backend

# 安装依赖
npm install

# 启动服务
npm start

# 服务运行在 http://localhost:3001
```

### 一键部署到Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

1. 点击上方按钮
2. 连接GitHub仓库
3. 自动部署完成！

## 📡 API接口

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/statistics/overview | 统计概览 |
| GET | /api/quotes | 报价单列表 |
| POST | /api/quotes | 创建报价单 |
| GET | /api/standards | 检测标准库 |
| GET | /api/price-standards | 报价标准库 |
| GET | /api/price-standards/coefficients | 系数配置 |
| GET | /api/customers | 客户列表 |
| GET | /api/projects | 项目列表 |
| GET | /api/contracts | 合同列表 |
| POST | /api/pricing/calculate | 报价计算 |

## 🔧 技术栈

- **运行环境**: Node.js 18+
- **框架**: Express.js
- **数据存储**: JSON文件 (演示模式)
- **CORS**: 已配置，支持跨域访问

## 📁 项目结构

```
zhilutong-backend/
├── src/
│   ├── index.js        # 服务入口
│   ├── dataStore.js   # 数据存储
│   ├── initDb.js       # 数据库初始化
│   └── seedData.js    # 种子数据
├── .env                # 环境变量
├── package.json        # 依赖配置
└── README.md           # 项目说明
```

## 🌐 前端项目

配套前端：[智路通·AI报价大师 前端](https://github.com/您的用户名/zhilutong-frontend)

## 📄 许可证

MIT License
