/**
 * 认证路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  router.post('/login', (req, res) => {
    try {
      const { username, password } = req.body;
      const users = db.getAll('users');
      const user = users.find(u => u.username === username);

      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }

      res.json({
        success: true,
        data: {
          token: 'demo-token-' + user.id,
          user: { id: user.id, username: user.username, name: user.name, roleName: user.roleName }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.get('/profile', (req, res) => {
    res.json({
      success: true,
      data: { id: '1', username: 'admin', name: '系统管理员', roleName: '超级管理员' }
    });
  });

  return router;
};
