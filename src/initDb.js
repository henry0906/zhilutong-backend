/**
 * 数据库初始化脚本
 * 创建所有表并初始化基础数据
 */
require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const { syncDatabase } = require('../models/index');
const seedData = require('./seedData');

async function initDatabase() {
  console.log('🚀 开始初始化数据库...\n');

  try {
    // 1. 测试数据库连接
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ 数据库连接失败，请检查配置');
      process.exit(1);
    }

    // 2. 同步数据库表结构
    console.log('📋 同步数据库表结构...');
    await syncDatabase(true); // force: true 会删除并重建表
    console.log('✅ 表结构同步完成\n');

    // 3. 初始化种子数据
    console.log('🌱 开始初始化种子数据...');
    await seedData();
    console.log('✅ 种子数据初始化完成\n');

    console.log('🎉 数据库初始化成功！');
    console.log('\n📌 后续操作：');
    console.log('   启动后端服务: npm start');
    console.log('   查看API文档: http://localhost:3001/api/health\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

initDatabase();
