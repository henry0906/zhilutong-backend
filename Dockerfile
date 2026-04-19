# 智路通·AI报价大师 后端 Dockerfile
# 多阶段构建，优化镜像大小

# 第一阶段：构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 第二阶段：运行
FROM node:20-alpine
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 复制依赖
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 复制源代码
COPY src ./src
COPY routes ./routes
COPY uploads ./uploads

# 创建数据目录
RUN mkdir -p data && chown -R nodejs:nodejs /app

# 切换到非root用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# 启动命令
CMD ["node", "src/index.js"]
