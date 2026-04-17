# 智路通·AI报价大师 后端部署指南

## 部署方式选择

由于后端是Node.js应用，有以下几种部署方式：

### 方式一：Railway（推荐 - 最简单）

1. 注册 [Railway.app](https://railway.app)
2. 连接GitHub仓库或直接上传代码
3. 自动检测Node.js应用并部署
4. 免费额度足够演示使用

### 方式二：Render

1. 注册 [Render.com](https://render.com)
2. 创建 "Web Service"
3. 连接GitHub仓库
4. 设置构建命令: `npm install`
5. 设置启动命令: `npm start`

### 方式三：Vercel (使用Serverless Functions)

需要重构为Vercel Serverless Functions格式

---

## 快速开始（Railway）

```bash
# 1. 将 backend-deploy 目录上传到GitHub
cd backend-deploy
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. 在Railway中创建新项目
# - 选择 "Deploy from GitHub repo"
# - 选择上述仓库
# - Railway自动检测为Node.js应用

# 3. 配置环境变量（如需要）
# PORT=3001
```

---

## 本地测试

```bash
cd backend-deploy
npm install
npm start

# 测试API
curl http://localhost:3001/api/health
```

---

## API端点

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

---

## 数据存储

- 使用JSON文件存储（演示模式）
- 数据文件位置: `data/store.json`
- 数据持久化到文件系统

## 生产环境建议

如需生产使用，建议：
1. 升级为PostgreSQL数据库
2. 使用Redis缓存
3. 添加JWT认证
4. 配置HTTPS
