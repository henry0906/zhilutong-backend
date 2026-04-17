/**
 * 用户路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const { v4: uuidv4 } = require('uuid');

  router.get('/', (req, res) => {
    try {
      const list = db.getAll('users').map(u => ({ ...u, password: undefined }));
      res.json({ success: true, data: { list } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/:id', (req, res) => {
    const user = db.getById('users', req.params.id);
    if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  });

  router.post('/', (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
      db.add('users', item);
      res.json({ success: true, message: '用户创建成功', data: { ...item, password: undefined } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    const updated = db.update('users', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: '用户不存在' });
    res.json({ success: true, message: '用户更新成功', data: { ...updated, password: undefined } });
  });

  router.delete('/:id', (req, res) => {
    const deleted = db.delete('users', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: '用户不存在' });
    res.json({ success: true, message: '用户删除成功' });
  });

  return router;
};
