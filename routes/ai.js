/**
 * AI路由 - 智谱AI调用
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  // 智谱AI调用
  router.post('/chat', async (req, res) => {
    try {
      const { messages, temperature = 0.7, max_tokens = 2000 } = req.body;

      // 获取AI配置
      const aiConfig = db.getAll('aiConfig') || {};
      const apiKey = aiConfig.api_key || '';
      const model = aiConfig.model || 'glm-4-flash';
      const apiEndpoint = aiConfig.api_endpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

      if (!apiKey) {
        return res.status(400).json({
          success: false,
          message: '请先配置AI API Key'
        });
      }

      // 调用智谱AI API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: max_tokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          success: false,
          message: `AI API调用失败: ${errorData.error?.message || response.statusText}`
        });
      }

      const data = await response.json();

      res.json({
        success: true,
        data: {
          content: data.choices?.[0]?.message?.content || '',
          usage: data.usage,
          model: data.model
        }
      });

    } catch (error) {
      console.error('AI调用错误:', error);
      res.status(500).json({
        success: false,
        message: `AI调用失败: ${error.message}`
      });
    }
  });

  // 文档解析 - 使用AI提取信息
  router.post('/parse-document', async (req, res) => {
    try {
      const { documentText, documentName } = req.body;

      // 获取AI配置
      const aiConfig = db.getAll('aiConfig') || {};
      const apiKey = aiConfig.api_key || '';
      const model = aiConfig.model || 'glm-4-flash';
      const apiEndpoint = aiConfig.api_endpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

      if (!apiKey) {
        return res.status(400).json({
          success: false,
          message: '请先配置AI API Key'
        });
      }

      // 构建提示词
      const systemPrompt = `你是一个专业的公路检测工程师。请从以下公路检测项目文档中提取关键信息，并以JSON格式返回。

需要提取的字段：
- projectName: 项目名称
- roadLevel: 公路等级（高速公路/一级公路/二级公路等）
- mileage: 主线里程（公里）
- rampMileage: 匝道里程（公里，可选）
- bridgeCount: 桥梁数量 {large: 大桥数量, medium: 中桥数量, small: 小桥数量}
- tunnelCount: 隧道数量
- tunnelLength: 隧道总长度（米，可选）
- inspectionPeriod: 检测周期（天）
- inspectionScope: 检测范围和内容

请直接返回JSON，不要添加任何解释。`;

      const userMessage = `文档名称: ${documentName || '未命名文档'}

文档内容:
${documentText || '无文档内容'}`;

      // 调用AI
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          success: false,
          message: `AI API调用失败: ${errorData.error?.message || response.statusText}`
        });
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || '';

      // 尝试解析JSON
      let parsedData;
      try {
        // 清理JSON字符串（移除可能的markdown代码块）
        let jsonStr = aiContent;
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.split('```json')[1].split('```')[0];
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.split('```')[1].split('```')[0];
        }
        jsonStr = jsonStr.trim();
        parsedData = JSON.parse(jsonStr);
      } catch (parseError) {
        // 解析失败，返回原始内容
        parsedData = {
          rawContent: aiContent,
          parsed: false
        };
      }

      res.json({
        success: true,
        data: parsedData
      });

    } catch (error) {
      console.error('文档解析错误:', error);
      res.status(500).json({
        success: false,
        message: `文档解析失败: ${error.message}`
      });
    }
  });

  // 报价计算建议 - 使用AI辅助计算
  router.post('/quote-suggest', async (req, res) => {
    try {
      const { projectInfo, detectedItems } = req.body;

      // 获取AI配置
      const aiConfig = db.getAll('aiConfig') || {};
      const apiKey = aiConfig.api_key || '';
      const model = aiConfig.model || 'glm-4-flash';
      const apiEndpoint = aiConfig.api_endpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

      if (!apiKey) {
        return res.status(400).json({
          success: false,
          message: '请先配置AI API Key'
        });
      }

      // 获取报价标准
      const priceStandards = db.getAll('priceStandards') || [];
      const standards = db.getAll('standards') || [];

      // 构建提示词
      const systemPrompt = `你是一个专业的公路检测报价工程师。根据以下项目信息和检测内容，帮我制定报价方案。

请根据以下价格标准（单位：元）：
${priceStandards.map(p => `- ${p.name}: ${p.unitPrice}${p.unit}`).join('\n')}

请返回JSON格式的报价建议，包含：
- suggestedItems: 建议的检测项目 [{name, unit, quantity, unitPrice, total}]
- totalAmount: 总价估算
- notes: 备注说明`;

      const userMessage = `项目信息：
- 项目名称: ${projectInfo?.projectName || '未知'}
- 公路等级: ${projectInfo?.roadLevel || '未知'}
- 里程: ${projectInfo?.mileage || 0}公里
- 桥梁: 大桥${projectInfo?.bridgeCount?.large || 0}座、中桥${projectInfo?.bridgeCount?.medium || 0}座、小桥${projectInfo?.bridgeCount?.small || 0}座
- 隧道: ${projectInfo?.tunnelCount || 0}座，共${projectInfo?.tunnelLength || 0}米
- 检测周期: ${projectInfo?.inspectionPeriod || 30}天

已选检测项目：
${detectedItems?.map(item => `- ${item.name}: ${item.quantity}${item.unit}`).join('\n') || '无'}`;

      // 调用AI
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.5,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          success: false,
          message: `AI API调用失败: ${errorData.error?.message || response.statusText}`
        });
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || '';

      // 尝试解析JSON
      let parsedData;
      try {
        let jsonStr = aiContent;
        if (jsonStr.includes('```json')) {
          jsonStr = jsonStr.split('```json')[1].split('```')[0];
        } else if (jsonStr.includes('```')) {
          jsonStr = jsonStr.split('```')[1].split('```')[0];
        }
        jsonStr = jsonStr.trim();
        parsedData = JSON.parse(jsonStr);
      } catch (parseError) {
        parsedData = {
          rawContent: aiContent,
          parsed: false
        };
      }

      res.json({
        success: true,
        data: parsedData
      });

    } catch (error) {
      console.error('报价建议错误:', error);
      res.status(500).json({
        success: false,
        message: `报价建议生成失败: ${error.message}`
      });
    }
  });

  return router;
};
