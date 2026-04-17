/**
 * 报价相关路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  // 生成报价单号
  const generateQuoteNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `QT-${year}${month}${day}-${random}`;
  };

  // 获取报价单列表
  router.get('/', (req, res) => {
    try {
      const { page = 1, pageSize = 10, status, customerName } = req.query;
      let list = db.getAll('quotes');

      // 过滤
      if (status) list = list.filter(q => q.status === status);
      if (customerName) list = list.filter(q => q.customerName.includes(customerName));

      // 分页
      const total = list.length;
      const offset = (parseInt(page) - 1) * parseInt(pageSize);
      const pagedList = list.slice(offset, offset + parseInt(pageSize));

      res.json({
        success: true,
        data: {
          list: pagedList,
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(total / parseInt(pageSize))
        }
      });
    } catch (error) {
      console.error('获取报价单列表失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 获取单个报价单
  router.get('/:id', (req, res) => {
    try {
      const quote = db.getById('quotes', req.params.id);
      if (!quote) {
        return res.status(404).json({ success: false, message: '报价单不存在' });
      }
      res.json({ success: true, data: quote });
    } catch (error) {
      console.error('获取报价单详情失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 创建报价单
  router.post('/', (req, res) => {
    try {
      const id = uuidv4();
      const quote = {
        id,
        quoteNo: generateQuoteNo(),
        ...req.body,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      db.add('quotes', quote);
      res.json({ success: true, message: '报价单创建成功', data: quote });
    } catch (error) {
      console.error('创建报价单失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 更新报价单
  router.put('/:id', (req, res) => {
    try {
      const updated = db.update('quotes', req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: '报价单不存在' });
      }
      res.json({ success: true, message: '报价单更新成功', data: updated });
    } catch (error) {
      console.error('更新报价单失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 删除报价单
  router.delete('/:id', (req, res) => {
    try {
      const deleted = db.delete('quotes', req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: '报价单不存在' });
      }
      res.json({ success: true, message: '报价单删除成功' });
    } catch (error) {
      console.error('删除报价单失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 更新报价单状态
  router.patch('/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.update('quotes', req.params.id, { status });
      if (!updated) {
        return res.status(404).json({ success: false, message: '报价单不存在' });
      }
      res.json({ success: true, message: '状态更新成功', data: updated });
    } catch (error) {
      console.error('更新状态失败:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
