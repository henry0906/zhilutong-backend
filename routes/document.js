/**
 * 文档处理路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../uploads/documents');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

  router.post('/upload', upload.single('document'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: '请上传文件' });
      }
      res.json({
        success: true,
        message: '文件上传成功',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          path: `/uploads/documents/${req.file.filename}`
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/parse', (req, res) => {
    // AI文档解析（演示返回模拟数据）
    res.json({
      success: true,
      data: {
        projectName: '高速公路检测项目',
        roadLevel: '高速公路',
        mileage: 50,
        bridgeCount: 5,
        tunnelCount: 1,
        tunnelLength: 2000,
        detectedItems: [
          { name: '路面弯沉检测', unit: '元/点', estimatedWorkload: 500 },
          { name: '路面平整度检测', unit: '元/公里', estimatedWorkload: 50 }
        ]
      }
    });
  });

  return router;
};
