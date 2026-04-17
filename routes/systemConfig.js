/**
 * 系统配置路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  router.get('/ai', (req, res) => {
    try {
      const aiConfig = db.getAll('aiConfig');
      res.json({ success: true, data: aiConfig });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/ai', (req, res) => {
    try {
      // 更新 aiConfig
      const store = require('../src/dataStore').store;
      Object.assign(store.aiConfig, req.body);
      require('../src/dataStore').saveData ?
        require('../src/dataStore').saveData(store) : null;
      res.json({ success: true, message: 'AI配置更新成功', data: store.aiConfig });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
