/**
 * 智路通·AI报价大师 后端服务入口
 * 使用JSON文件存储，支持演示模式
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// 初始化数据存储
const { DataStore } = require('./dataStore');
const db = new DataStore();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件服务
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'standards'), { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, 'documents'), { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 导入路由（使用JSON存储）
const quoteRoutes = require('../routes/quote')(db);
const standardsRoutes = require('../routes/standards')(db);
const priceStandardsRoutes = require('../routes/priceStandards')(db);
const authRoutes = require('../routes/auth')(db);
const usersRoutes = require('../routes/users')(db);
const rolesRoutes = require('../routes/roles')(db);
const customersRoutes = require('../routes/customers')(db);
const projectsRoutes = require('../routes/projects')(db);
const contractsRoutes = require('../routes/contracts')(db);
const systemConfigRoutes = require('../routes/systemConfig')(db);
const documentRoutes = require('../routes/document')(db);
const exportRoutes = require('../routes/export')(db);
const pricingRoutes = require('../routes/pricing')(db);

// API路由
app.use('/api/quotes', quoteRoutes);
app.use('/api/standards', standardsRoutes);
app.use('/api/price-standards', priceStandardsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/system-config', systemConfigRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/pricing', pricingRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '智路通·AI报价大师 API',
    version: '1.0.0',
    mode: 'demo (JSON存储)',
    timestamp: new Date().toISOString()
  });
});

// 统计概览API
app.get('/api/statistics/overview', (req, res) => {
  try {
    const quotes = db.getAll('quotes');
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 按状态分组统计
    const monthStats = [];
    const statusMap = {};
    quotes.forEach(q => {
      if (new Date(q.createdAt) >= startOfMonth && q.status !== 'cancelled') {
        if (!statusMap[q.status]) {
          statusMap[q.status] = { status: q.status, count: 0, total: 0 };
        }
        statusMap[q.status].count++;
        statusMap[q.status].total += q.totalAmount || 0;
      }
    });
    Object.values(statusMap).forEach(s => monthStats.push(s));

    // 年度月度统计
    const yearStatsMap = {};
    quotes.forEach(q => {
      if (new Date(q.createdAt) >= startOfYear && q.status !== 'cancelled') {
        const month = q.createdAt.substring(0, 7);
        if (!yearStatsMap[month]) {
          yearStatsMap[month] = { month, count: 0, total: 0 };
        }
        yearStatsMap[month].count++;
        yearStatsMap[month].total += q.totalAmount || 0;
      }
    });
    const yearStats = Object.values(yearStatsMap).sort((a, b) => a.month.localeCompare(b.month));

    const totalQuotes = quotes.filter(q => q.status !== 'cancelled').length;
    const monthNewQuotes = quotes.filter(q => new Date(q.createdAt) >= startOfMonth).length;

    res.json({
      success: true,
      data: {
        monthStats,
        yearStats,
        totalQuotes,
        monthNewQuotes,
        summary: {
          totalAmount: monthStats.reduce((sum, s) => sum + s.total, 0),
          totalCount: monthStats.reduce((sum, s) => sum + s.count, 0)
        }
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大50MB）'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 智路通·AI报价大师 API 服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📚 API文档: http://localhost:${PORT}/api/health`);
  console.log(`💾 存储模式: JSON文件存储 (演示模式)`);
  console.log(`\n可用接口:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - GET  /api/statistics/overview`);
  console.log(`  - GET  /api/quotes`);
  console.log(`  - POST /api/quotes`);
  console.log(`  - GET  /api/standards`);
  console.log(`  - GET  /api/price-standards`);
  console.log(`  - GET  /api/price-standards/coefficients\n`);
});

module.exports = app;
