/**
 * JSON数据存储 - 用于演示模式
 * 数据持久化到JSON文件，无需数据库
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 默认数据结构
const defaultData = {
  users: [
    { id: '1', username: 'admin', password: '$2a$10$...', name: '系统管理员', email: 'admin@zhilutong.com', roleName: '超级管理员', status: 'active', createdAt: new Date().toISOString() },
    { id: '2', username: 'quoter1', password: '$2a$10$...', name: '张报价', email: 'zhang@zhilutong.com', roleName: '报价员', status: 'active', createdAt: new Date().toISOString() },
    { id: '3', username: 'viewer', password: '$2a$10$...', name: '李查看', email: 'li@zhilutong.com', roleName: '查看者', status: 'active', createdAt: new Date().toISOString() }
  ],
  roles: [
    { id: '1', name: '超级管理员', code: 'super_admin', description: '系统最高权限', status: 'active', permissionCount: 15 },
    { id: '2', name: '管理员', code: 'admin', description: '管理所有数据', status: 'active', permissionCount: 12 },
    { id: '3', name: '报价员', code: 'quoter', description: '执行报价操作', status: 'active', permissionCount: 8 },
    { id: '4', name: '查看者', code: 'viewer', description: '仅查看数据', status: 'active', permissionCount: 3 }
  ],
  customers: [
    { id: '1', name: '广东省交通运输厅', type: 'government', contactPerson: '王主任', phone: '020-12345678', province: '广东省', city: '广州市', createdAt: new Date().toISOString() },
    { id: '2', name: '浙江省公路与运输中心', type: 'government', contactPerson: '李处长', phone: '0571-87654321', province: '浙江省', city: '杭州市', createdAt: new Date().toISOString() },
    { id: '3', name: '江苏省交通控股集团', type: 'enterprise', contactPerson: '张总', phone: '025-11223344', province: '江苏省', city: '南京市', createdAt: new Date().toISOString() },
    { id: '4', name: '四川省交通运输厅', type: 'government', contactPerson: '刘科长', phone: '028-99887766', province: '四川省', city: '成都市', createdAt: new Date().toISOString() }
  ],
  projects: [
    { id: '1', name: 'G4京港澳高速广州段2024年检测项目', projectNo: 'PRJ-2024-001', customerName: '广东省交通运输厅', roadLevel: '高速公路', status: 'in_progress', createdAt: new Date().toISOString() },
    { id: '2', name: 'S26诸永高速温州段定期检测', projectNo: 'PRJ-2024-002', customerName: '浙江省公路与运输中心', roadLevel: '高速公路', status: 'contracted', createdAt: new Date().toISOString() },
    { id: '3', name: 'G25长深高速江苏段技术状况评定', projectNo: 'PRJ-2024-003', customerName: '江苏省交通控股集团', roadLevel: '高速公路', status: 'pending', createdAt: new Date().toISOString() }
  ],
  standards: [
    { id: '1', code: 'JTG E61-2011', name: '公路技术状况评定标准', category: 'pavement', status: 'active' },
    { id: '2', code: 'JTG/T J21-2011', name: '公路桥梁承载能力检测评定规程', category: 'bridge', status: 'active' },
    { id: '3', code: 'JTG F60-2009', name: '公路隧道施工技术规范', category: 'tunnel', status: 'active' },
    { id: '4', code: 'JTG 3430-2020', name: '公路工程土集料试验规程', category: 'material', status: 'active' },
    { id: '5', code: 'JTG 3450-2019', name: '公路路基路面现场测试规程', category: 'pavement', status: 'active' },
    { id: '6', code: 'JTG D81-2017', name: '公路交通安全设施设计规范', category: 'safety', status: 'active' },
    { id: '7', code: 'JTG H30-2015', name: '公路养护安全作业规程', category: 'maintenance', status: 'active' },
    { id: '8', code: 'JTG/T H21-2011', name: '公路桥梁技术状况评定标准', category: 'bridge', status: 'active' }
  ],
  priceStandards: [
    { id: '1', code: 'LABOR-01', name: '检测高级工程师', type: 'labor', category: '人工费', unit: '元/工日', unitPrice: 450 },
    { id: '2', code: 'LABOR-02', name: '检测工程师', type: 'labor', category: '人工费', unit: '元/工日', unitPrice: 350 },
    { id: '3', code: 'LABOR-03', name: '技术员', type: 'labor', category: '人工费', unit: '元/工日', unitPrice: 250 },
    { id: '4', code: 'EQUIP-01', name: 'FWD车载式弯沉仪', type: 'equipment', category: '设备费', unit: '元/台班', unitPrice: 2800 },
    { id: '5', code: 'EQUIP-02', name: '路面病害检测车', type: 'equipment', category: '设备费', unit: '元/台班', unitPrice: 3500 },
    { id: '6', code: 'EQUIP-03', name: '桥梁检测车', type: 'equipment', category: '设备费', unit: '元/台班', unitPrice: 4500 },
    { id: '7', code: 'PRICE-01', name: '路面弯沉检测', type: 'unit', category: '检测单价', unit: '元/点', unitPrice: 45 },
    { id: '8', code: 'PRICE-02', name: '路面平整度检测', type: 'unit', category: '检测单价', unit: '元/公里', unitPrice: 800 },
    { id: '9', code: 'PRICE-03', name: '路面破损调查', type: 'unit', category: '检测单价', unit: '元/公里', unitPrice: 500 },
    { id: '10', code: 'PRICE-04', name: '车辙深度检测', type: 'unit', category: '检测单价', unit: '元/公里', unitPrice: 300 },
    { id: '11', code: 'PRICE-05', name: '抗滑性能检测', type: 'unit', category: '检测单价', unit: '元/点', unitPrice: 35 },
    { id: '12', code: 'PRICE-06', name: '大桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', unitPrice: 8000 },
    { id: '13', code: 'PRICE-07', name: '中桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', unitPrice: 5000 },
    { id: '14', code: 'PRICE-08', name: '小桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', unitPrice: 3000 },
    { id: '15', code: 'PRICE-09', name: '隧道定期检查', type: 'unit', category: '检测单价', unit: '元/座', unitPrice: 12000 },
    { id: '16', code: 'PRICE-10', name: '涵洞检查', type: 'unit', category: '检测单价', unit: '元/道', unitPrice: 800 },
    { id: '17', code: 'PRICE-11', name: '几何线形测量', type: 'unit', category: '检测单价', unit: '元/公里', unitPrice: 600 },
    { id: '18', code: 'PRICE-12', name: '桥梁承载能力评定', type: 'unit', category: '检测单价', unit: '元/座', unitPrice: 25000 },
    { id: '19', code: 'PRICE-13', name: '技术状况评定', type: 'unit', category: '检测单价', unit: '元/公里', unitPrice: 1500 },
    { id: '20', code: 'PRICE-14', name: '交通调查', type: 'unit', category: '检测单价', unit: '元/日', unitPrice: 2000 },
    { id: '21', code: 'PRICE-15', name: '路面取芯', type: 'unit', category: '检测单价', unit: '元/点', unitPrice: 500 },
    { id: '22', code: 'PRICE-16', name: '材料试验', type: 'unit', category: '检测单价', unit: '元/组', unitPrice: 800 },
    { id: '23', code: 'PRICE-17', name: '报告编制', type: 'unit', category: '检测单价', unit: '元/份', unitPrice: 5000 },
    { id: '24', code: 'PRICE-18', name: '现场安全维护', type: 'unit', category: '检测单价', unit: '元/日', unitPrice: 1500 }
  ],
  quotes: [
    {
      id: '1',
      quoteNo: 'QT-2024-0001',
      projectName: 'G4京港澳高速广州段2024年检测项目',
      customerName: '广东省交通运输厅',
      totalAmount: 285000,
      status: 'approved',
      createdAt: '2024-03-15T10:30:00Z',
      validUntil: '2024-12-31',
      profitRate: 12.5
    },
    {
      id: '2',
      quoteNo: 'QT-2024-0002',
      projectName: 'S26诸永高速温州段定期检测',
      customerName: '浙江省公路与运输中心',
      totalAmount: 168000,
      status: 'pending',
      createdAt: '2024-03-18T14:20:00Z',
      validUntil: '2024-12-31',
      profitRate: 10.8
    },
    {
      id: '3',
      quoteNo: 'QT-2024-0003',
      projectName: 'G25长深高速江苏段技术状况评定',
      customerName: '江苏省交通控股集团',
      totalAmount: 420000,
      status: 'signed',
      createdAt: '2024-03-10T09:15:00Z',
      validUntil: '2024-12-31',
      profitRate: 15.2
    },
    {
      id: '4',
      quoteNo: 'QT-2024-0004',
      projectName: '成都至雅安高速公路检测',
      customerName: '四川省交通运输厅',
      totalAmount: 356000,
      status: 'approved',
      createdAt: '2024-03-08T16:45:00Z',
      validUntil: '2024-12-31',
      profitRate: 11.5
    },
    {
      id: '5',
      quoteNo: 'QT-2024-0005',
      projectName: '杭州湾跨海大桥检测',
      customerName: '浙江省交通运输厅',
      totalAmount: 580000,
      status: 'pending',
      createdAt: '2024-03-20T11:00:00Z',
      validUntil: '2024-12-31',
      profitRate: 13.8
    }
  ],
  contracts: [
    { id: '1', contractNo: 'HT-2024-0001', name: 'G4京港澳高速检测合同', customerName: '广东省交通运输厅', amount: 285000, signDate: '2024-03-20', status: 'active' },
    { id: '2', contractNo: 'HT-2024-0002', name: 'G25长深高速评定合同', customerName: '江苏省交通控股集团', amount: 420000, signDate: '2024-03-15', status: 'active' }
  ],
  aiConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    api_endpoint: 'https://api.openai.com/v1/chat/completions',
    api_key: ''
  },
  coefficients: {
    regionCoefficients: [
      { region: '一类地区', coefficient: 1.1, description: '北京、上海、深圳' },
      { region: '二类地区', coefficient: 1.05, description: '省会城市' },
      { region: '三类地区', coefficient: 1.0, description: '其他城市' },
      { region: '四类地区', coefficient: 0.95, description: '偏远地区' }
    ],
    scaleCoefficients: [
      { scale: '大型项目(>100km)', coefficient: 0.9, description: '里程大于100公里' },
      { scale: '中型项目(50-100km)', coefficient: 1.0, description: '里程50-100公里' },
      { scale: '小型项目(<50km)', coefficient: 1.1, description: '里程小于50公里' }
    ],
    difficultyCoefficients: [
      { difficulty: '简单', coefficient: 0.95, description: '地形平坦、交通便利' },
      { difficulty: '一般', coefficient: 1.0, description: '常规地形' },
      { difficulty: '复杂', coefficient: 1.15, description: '山区、高海拔' },
      { difficulty: '极复杂', coefficient: 1.3, description: '特长隧道、深切峡谷' }
    ],
    urgencyCoefficients: [
      { urgency: '常规', coefficient: 1.0, description: '30天以上' },
      { urgency: '加急', coefficient: 1.2, description: '15-30天' },
      { urgency: '紧急', coefficient: 1.4, description: '7-15天' },
      { urgency: '特急', coefficient: 1.6, description: '7天以内' }
    ],
    rates: {
      management: 0.18,
      profit: 0.12,
      tax: 0.06
    }
  }
};

// 加载或初始化数据
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.log('初始化数据存储...');
  }
  return { ...defaultData };
}

// 保存数据
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 初始化数据存储
const store = loadData();

// 数据操作类
class DataStore {
  // 获取所有数据
  getAll(collection) {
    return store[collection] || [];
  }

  // 根据ID获取
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id);
  }

  // 添加
  add(collection, item) {
    if (!store[collection]) {
      store[collection] = [];
    }
    store[collection].push(item);
    saveData(store);
    return item;
  }

  // 更新
  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      store[collection] = items;
      saveData(store);
      return items[index];
    }
    return null;
  }

  // 删除
  delete(collection, id) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      store[collection] = items;
      saveData(store);
      return true;
    }
    return false;
  }

  // 查询（支持过滤）
  query(collection, filters = {}) {
    let items = this.getAll(collection);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        items = items.filter(item => item[key] === value);
      }
    });
    return items;
  }
}

module.exports = { DataStore, store };
