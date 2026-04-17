/**
 * 报价计算路由 - JSON存储版本
 */
module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  router.post('/calculate', (req, res) => {
    try {
      const { items = [], ...coefficients } = req.body;

      const regionCoeff = coefficients.regionCoefficient || 1.0;
      const scaleCoeff = coefficients.scaleCoefficient || 1.0;
      const difficultyCoeff = coefficients.difficultyCoefficient || 1.0;
      const urgencyCoeff = coefficients.urgencyCoefficient || 1.0;
      const managementRate = coefficients.managementRate || 0.18;
      const profitRate = coefficients.profitRate || 0.12;

      let baseAmount = 0;
      items.forEach(item => {
        baseAmount += (item.workload || 0) * (item.unitPrice || 0);
      });

      const totalCoeff = regionCoeff * scaleCoeff * difficultyCoeff * urgencyCoeff;
      const adjustedAmount = baseAmount * totalCoeff;
      const managementFee = adjustedAmount * managementRate;
      const profitAmount = adjustedAmount * profitRate;
      const taxAmount = (adjustedAmount + managementFee + profitAmount) * 0.06;
      const totalAmount = adjustedAmount + managementFee + profitAmount + taxAmount;

      res.json({
        success: true,
        data: {
          baseAmount,
          adjustedAmount,
          managementFee,
          profitAmount,
          taxAmount,
          totalAmount,
          totalAmountChinese: toChineseNumber(totalAmount),
          items: items.map(item => ({
            ...item,
            amount: (item.workload || 0) * (item.unitPrice || 0)
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};

function toChineseNumber(num) {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  num = Math.round(num * 100) / 100;
  const parts = num.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] ? parts[1].padEnd(2, '0').substring(0, 2) : '00';

  let result = '';
  let unitIndex = 0;

  while (integerPart.length > 0) {
    const slice = integerPart.slice(-4);
    integerPart = integerPart.slice(0, -4);
    result = sliceToChinese(slice, unitIndex) + result;
    if (integerPart.length > 0) unitIndex++;
  }

  return result + '元' + digits[parseInt(decimalPart[0])] + digits[parseInt(decimalPart[1])] + '分';
}

function sliceToChinese(slice, unitIndex) {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  let result = '';
  for (let i = 0; i < slice.length; i++) {
    const digit = parseInt(slice[i]);
    if (digit !== 0) {
      result += digits[digit] + units[slice.length - 1 - i];
    } else if (result.slice(-1) !== '零') {
      result += '零';
    }
  }
  result = result.replace(/零+$/, '');
  if (result) result += ['元', '万', '亿', '兆'][unitIndex] || '';
  return result;
}
