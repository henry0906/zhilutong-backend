/**
 * 项目路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  router.get('/', (req, res) => {
    try {
      let list = db.getAll('projects');
      const { status, roadLevel } = req.query;
      if (status) list = list.filter(p => p.status === status);
      if (roadLevel) list = list.filter(p => p.roadLevel === roadLevel);
      res.json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/:id', (req, res) => {
    const item = db.getById('projects', req.params.id);
    if (!item) return res.status(404).json({ success: false, message: '项目不存在' });
    res.json({ success: true, data: item });
  });

  router.post('/', (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
      db.add('projects', item);
      res.json({ success: true, message: '项目创建成功', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const updated = db.update('projects', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: '项目不存在' });
    res.json({ success: true, message: '项目更新成功', data: updated });
  });

  router.delete('/:id', (req, res) => {
    const deleted = db.delete('projects', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: '项目不存在' });
    res.json({ success: true, message: '项目删除成功' });
  });

  return router;
};
