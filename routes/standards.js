/**
 * 检测标准路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  router.get('/', (req, res) => {
    try {
      let list = db.getAll('standards');
      const { category, status, keyword } = req.query;
      if (category) list = list.filter(s => s.category === category);
      if (status) list = list.filter(s => s.status === status);
      if (keyword) list = list.filter(s => s.name.includes(keyword) || s.code.includes(keyword));
      res.json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/:id', (req, res) => {
    const item = db.getById('standards', req.params.id);
    if (!item) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, data: item });
  });

  router.post('/', (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
      db.add('standards', item);
      res.json({ success: true, message: '标准创建成功', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const updated = db.update('standards', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, message: '标准更新成功', data: updated });
  });

  router.delete('/:id', (req, res) => {
    const deleted = db.delete('standards', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: '标准不存在' });
    res.json({ success: true, message: '标准删除成功' });
  });

  return router;
};
