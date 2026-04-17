/**
 * 导出路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  router.post('/quote/:id', (req, res) => {
    try {
      const quote = db.getById('quotes', req.params.id);
      if (!quote) {
        return res.status(404).json({ success: false, message: '报价单不存在' });
      }
      // 模拟导出
      res.json({
        success: true,
        message: '报价单导出成功',
        data: { downloadUrl: `/uploads/exports/quote-${quote.quoteNo}.pdf` }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
