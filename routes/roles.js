/**
 * 角色路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  router.get('/', (req, res) => {
    try {
      const list = db.getAll('roles');
      res.json({ success: true, data: list });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/:id', (req, res) => {
    const item = db.getById('roles', req.params.id);
    if (!item) return res.status(404).json({ success: false, message: '角色不存在' });
    res.json({ success: true, data: item });
  });

  router.post('/', (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body };
      db.add('roles', item);
      res.json({ success: true, message: '角色创建成功', data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const updated = db.update('roles', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: '角色不存在' });
    res.json({ success: true, message: '角色更新成功', data: updated });
  });

  router.delete('/:id', (req, res) => {
    const deleted = db.delete('roles', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: '角色不存在' });
    res.json({ success: true, message: '角色删除成功' });
  });

  return router;
};
