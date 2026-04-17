/**
 * 报价标准路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  router.get('/', (req, res) => {
    try {
      let list = db.getAll('priceStandards');
      const { type, category } = req.query;
      if (type) list = list.filter(p => p.type === type);
      if (category) list = list.filter(p => p.category === category);
      res.json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/coefficients', (req, res) => {
    try {
      const coefficients = db.getAll('coefficients');
      res.json({ success: true, data: coefficients });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/:id', (req, res) => {
    const item = db.getById('priceStandards', req.params.id);
    if (!item) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, data: item });
  });

  router.post('/', (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body };
      db.add('priceStandards', item);
      res.json({ success: true, message: '标准创建成功', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const updated = db.update('priceStandards', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, message: '标准更新成功', data: updated });
  });

  router.delete('/:id', (req, res) => {
    const deleted = db.delete('priceStandards', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, message: '标准删除成功' });
  });

  return router;
};
