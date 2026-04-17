/**
 * 种子数据初始化
 * 创建基础检测标准、报价标准、用户等数据
 */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seedData() {
  try {
    const { Standard, InspectionItem, PriceStandard, User, Role, Customer, Project, Quote, QuoteItem } = require('../models/index');

    // 1. 创建角色
    console.log('👥 创建角色...');
    const roles = await Role.bulkCreate([
      { name: '超级管理员', code: 'super_admin', description: '系统最高权限', status: 'active' },
      { name: '管理员', code: 'admin', description: '管理所有数据', status: 'active' },
      { name: '报价员', code: 'quoter', description: '执行报价操作', status: 'active' },
      { name: '查看者', code: 'viewer', description: '仅查看数据', status: 'active' }
    ]);
    console.log(`   创建了 ${roles.length} 个角色`);

    // 2. 创建用户
    console.log('👤 创建用户...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminRole = roles.find(r => r.code === 'super_admin');
    const users = await User.bulkCreate([
      {
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        email: 'admin@zhilutong.com',
        phone: '13800138000',
        roleId: adminRole.id,
        status: 'active'
      },
      {
        username: 'quoter1',
        password: hashedPassword,
        name: '张报价',
        email: 'zhang@zhilutong.com',
        phone: '13800138001',
        roleId: roles.find(r => r.code === 'quoter').id,
        status: 'active'
      },
      {
        username: 'viewer1',
        password: hashedPassword,
        name: '李查看',
        email: 'li@zhilutong.com',
        phone: '13800138002',
        roleId: roles.find(r => r.code === 'viewer').id,
        status: 'active'
      }
    ]);
    console.log(`   创建了 ${users.length} 个用户 (默认密码: admin123)`);

    // 3. 检测标准
    console.log('📚 创建检测标准...');
    const standards = await Standard.bulkCreate([
      {
        code: 'JTG E61-2011',
        name: '公路技术状况评定标准',
        category: 'pavement',
        description: '规定了公路技术状况评定的指标体系、检测方法与评定标准',
        scope: '适用于各等级公路的技术状况评定',
        status: 'active',
        publishDate: '2011-12-15',
        implementDate: '2012-06-01',
        version: '1.0'
      },
      {
        code: 'JTG/T J21-2011',
        name: '公路桥梁承载能力检测评定规程',
        category: 'bridge',
        description: '规定了公路桥梁承载能力检测评定的基本原则、检测项目与评定方法',
        scope: '适用于公路桥梁的承载能力检测评定',
        status: 'active',
        publishDate: '2011-06-01',
        implementDate: '2011-10-01',
        version: '1.0'
      },
      {
        code: 'JTG F60-2009',
        name: '公路隧道施工技术规范',
        category: 'tunnel',
        description: '规定了公路隧道施工的技术要求和质量标准',
        scope: '适用于新建、改建公路隧道的施工',
        status: 'active',
        publishDate: '2009-08-01',
        implementDate: '2009-10-01',
        version: '1.0'
      },
      {
        code: 'JTG 3430-2020',
        name: '公路工程土集料试验规程',
        category: 'material',
        description: '规定了公路工程用土和集料的试验方法',
        scope: '适用于公路工程的土工试验和集料试验',
        status: 'active',
        publishDate: '2020-04-28',
        implementDate: '2020-08-01',
        version: '1.0'
      },
      {
        code: 'JTG 3450-2019',
        name: '公路路基路面现场测试规程',
        category: 'pavement',
        description: '规定了公路路基路面现场测试的试验方法',
        scope: '适用于公路路基路面现场测试',
        status: 'active',
        publishDate: '2019-12-01',
        implementDate: '2020-06-01',
        version: '1.0'
      },
      {
        code: 'JTG D81-2017',
        name: '公路交通安全设施设计规范',
        category: 'safety',
        description: '规定了公路交通安全设施的设计要求',
        scope: '适用于各等级公路交通安全设施设计',
        status: 'active',
        publishDate: '2017-11-17',
        implementDate: '2018-06-01',
        version: '1.0'
      },
      {
        code: 'JTG/T H21-2011',
        name: '公路桥梁养护质量评价标准',
        category: 'bridge',
        description: '规定了公路桥梁养护质量的评价方法',
        scope: '适用于公路桥梁的养护质量评价',
        status: 'active',
        publishDate: '2011-06-13',
        implementDate: '2011-10-01',
        version: '1.0'
      },
      {
        code: 'JTG H12-2015',
        name: '公路隧道养护技术规范',
        category: 'tunnel',
        description: '规定了公路隧道的养护技术要求',
        scope: '适用于公路隧道的日常养护',
        status: 'active',
        publishDate: '2015-02-13',
        implementDate: '2015-06-01',
        version: '1.0'
      }
    ]);
    console.log(`   创建了 ${standards.length} 条检测标准`);

    // 4. 检测项目
    console.log('🔬 创建检测项目...');
    const pavementStandard = standards.find(s => s.code === 'JTG E61-2011');
    const bridgeStandard = standards.find(s => s.code === 'JTG/T J21-2011');
    const tunnelStandard = standards.find(s => s.code === 'JTG F60-2009');
    const safetyStandard = standards.find(s => s.code === 'JTG D81-2017');

    const inspectionItems = await InspectionItem.bulkCreate([
      // 路面检测项目
      { standardId: pavementStandard.id, name: '路面弯沉检测(FWD)', code: 'E61-01', category: 'pavement', detectionFrequency: '20m/点', unit: '点', description: '使用FWD进行弯沉检测', equipment: 'FWD弯沉仪' },
      { standardId: pavementStandard.id, name: '路面平整度检测(IRI)', code: 'E61-02', category: 'pavement', detectionFrequency: '100m/段', unit: '段', description: '激光平整度仪检测', equipment: '激光平整度仪' },
      { standardId: pavementStandard.id, name: '路面破损调查', code: 'E61-03', category: 'pavement', detectionFrequency: '1次/公里', unit: '公里', description: '自动化或人工调查路面损坏', equipment: '病害采集车' },
      { standardId: pavementStandard.id, name: '抗滑系数检测', code: 'E61-04', category: 'pavement', detectionFrequency: '200m/点', unit: '点', description: '摆式仪或横向力系数车检测', equipment: '摩擦系数测试车' },
      { standardId: pavementStandard.id, name: '车辙深度检测', code: 'E61-05', category: 'pavement', detectionFrequency: '20m/点', unit: '点', description: '激光车辙仪检测', equipment: '激光车辙仪' },
      { standardId: pavementStandard.id, name: '路面纹理深度检测', code: 'E61-06', category: 'pavement', detectionFrequency: '100m/点', unit: '点', description: '铺砂法或激光纹理仪', equipment: '纹理深度仪' },
      // 桥梁检测项目
      { standardId: bridgeStandard.id, name: '特大桥定期检查', code: 'J21-01', category: 'bridge', detectionFrequency: '1次/座', unit: '座', description: '特大桥定期检查', equipment: '桥梁检测车' },
      { standardId: bridgeStandard.id, name: '大桥定期检查', code: 'J21-02', category: 'bridge', detectionFrequency: '1次/座', unit: '座', description: '大桥定期检查', equipment: '桥梁检测车' },
      { standardId: bridgeStandard.id, name: '中桥定期检查', code: 'J21-03', category: 'bridge', detectionFrequency: '1次/座', unit: '座', description: '中桥定期检查', equipment: '桥梁检测车' },
      { standardId: bridgeStandard.id, name: '小桥定期检查', code: 'J21-04', category: 'bridge', detectionFrequency: '1次/座', unit: '座', description: '小桥定期检查', equipment: '桥梁检测车' },
      { standardId: bridgeStandard.id, name: '桥梁荷载试验(静载)', code: 'J21-05', category: 'bridge', detectionFrequency: '抽检10%', unit: '座', description: '静载试验', equipment: '荷载试验设备' },
      { standardId: bridgeStandard.id, name: '桥梁荷载试验(动载)', code: 'J21-06', category: 'bridge', detectionFrequency: '抽检5%', unit: '座', description: '动载试验', equipment: '动载试验设备' },
      // 隧道检测项目
      { standardId: tunnelStandard.id, name: '特长隧道定期检查', code: 'F60-01', category: 'tunnel', detectionFrequency: '1次/座', unit: '座', description: '特长隧道定期检查', equipment: '隧道检测设备' },
      { standardId: tunnelStandard.id, name: '长隧道定期检查', code: 'F60-02', category: 'tunnel', detectionFrequency: '1次/座', unit: '座', description: '长隧道定期检查', equipment: '隧道检测设备' },
      { standardId: tunnelStandard.id, name: '中短隧道定期检查', code: 'F60-03', category: 'tunnel', detectionFrequency: '1次/座', unit: '座', description: '中短隧道定期检查', equipment: '隧道检测设备' },
      { standardId: tunnelStandard.id, name: '衬砌厚度检测', code: 'F60-04', category: 'tunnel', detectionFrequency: '5m/点', unit: '点', description: '地质雷达检测衬砌厚度', equipment: '地质雷达' },
      { standardId: tunnelStandard.id, name: '结构变形检测', code: 'F60-05', category: 'tunnel', detectionFrequency: '20m/点', unit: '点', description: '收敛计、全站仪检测变形', equipment: '全站仪' },
      { standardId: tunnelStandard.id, name: '渗漏水调查', code: 'F60-06', category: 'tunnel', detectionFrequency: '全段落', unit: '座', description: '隧道渗漏水情况调查', equipment: '无' },
      // 交通安全设施
      { standardId: safetyStandard.id, name: '标志标线检测', code: 'D81-01', category: 'safety', detectionFrequency: '2次/年', unit: '公里', description: '交通安全设施检测', equipment: '标线逆反射仪' },
      { standardId: safetyStandard.id, name: '护栏检测', code: 'D81-02', category: 'safety', detectionFrequency: '1次/年', unit: '公里', description: '护栏性能检测', equipment: '护栏检测仪' }
    ]);
    console.log(`   创建了 ${inspectionItems.length} 条检测项目`);

    // 5. 报价标准
    console.log('💰 创建报价标准...');
    const priceStandards = await PriceStandard.bulkCreate([
      // 人工费标准
      { code: 'LABOR-01', name: '检测高级工程师', type: 'labor', category: '人工费', unit: '元/工日', basePrice: 450, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'LABOR-02', name: '检测工程师', type: 'labor', category: '人工费', unit: '元/工日', basePrice: 350, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'LABOR-03', name: '检测技术员', type: 'labor', category: '人工费', unit: '元/工日', basePrice: 250, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'LABOR-04', name: '辅助工人', type: 'labor', category: '人工费', unit: '元/工日', basePrice: 180, effectiveDate: '2024-01-01', status: 'active' },
      // 设备台班费
      { code: 'EQUIP-01', name: 'FWD车载式弯沉仪', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 2800, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'EQUIP-02', name: '激光平整度仪', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 2200, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'EQUIP-03', name: '桥梁检测车', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 3500, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'EQUIP-04', name: '地质雷达', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 4000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'EQUIP-05', name: '激光车辙仪', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 1800, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'EQUIP-06', name: '隧道检测台车', type: 'equipment', category: '设备费', unit: '元/台班', basePrice: 5000, effectiveDate: '2024-01-01', status: 'active' },
      // 检测单价
      { code: 'PRICE-01', name: '路面弯沉检测', type: 'unit', category: '检测单价', unit: '元/点', basePrice: 45, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-02', name: '路面平整度检测', type: 'unit', category: '检测单价', unit: '元/公里', basePrice: 800, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-03', name: '路面破损调查', type: 'unit', category: '检测单价', unit: '元/公里', basePrice: 80, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-04', name: '抗滑系数检测', type: 'unit', category: '检测单价', unit: '元/点', basePrice: 35, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-05', name: '特大桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 15000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-06', name: '大桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 8000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-07', name: '中桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 5000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-08', name: '小桥定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 3000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-09', name: '桥梁荷载试验', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 45000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-10', name: '特长隧道定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 25000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-11', name: '长隧道定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 18000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-12', name: '中短隧道定期检查', type: 'unit', category: '检测单价', unit: '元/座', basePrice: 12000, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-13', name: '衬砌厚度检测', type: 'unit', category: '检测单价', unit: '元/点', basePrice: 60, effectiveDate: '2024-01-01', status: 'active' },
      { code: 'PRICE-14', name: '交通安全设施检测', type: 'unit', category: '检测单价', unit: '元/公里', basePrice: 200, effectiveDate: '2024-01-01', status: 'active' }
    ]);
    console.log(`   创建了 ${priceStandards.length} 条报价标准`);

    // 6. 示例客户
    console.log('🏢 创建示例客户...');
    const customers = await Customer.bulkCreate([
      { name: '广东省交通运输厅', type: 'government', contactPerson: '王主任', phone: '020-12345678', address: '广东省广州市越秀区', province: '广东省', city: '广州市', status: 'active' },
      { name: '浙江省公路与运输中心', type: 'government', contactPerson: '李处长', phone: '0571-87654321', address: '浙江省杭州市西湖区', province: '浙江省', city: '杭州市', status: 'active' },
      { name: '江苏省交通控股集团', type: 'enterprise', contactPerson: '张总', phone: '025-11223344', address: '江苏省南京市鼓楼区', province: '江苏省', city: '南京市', status: 'active' },
      { name: '四川省交通运输厅', type: 'government', contactPerson: '刘科长', phone: '028-99887766', address: '四川省成都市武侯区', province: '四川省', city: '成都市', status: 'active' }
    ]);
    console.log(`   创建了 ${customers.length} 个示例客户`);

    // 7. 示例项目
    console.log('🛣️ 创建示例项目...');
    const projects = await Project.bulkCreate([
      {
        name: 'G4京港澳高速广州段2024年检测项目',
        projectNo: 'PRJ-2024-001',
        customerId: customers[0].id,
        province: '广东省',
        city: '广州市',
        roadLevel: '高速公路',
        mainLineLength: 85.6,
        rampLength: 12.3,
        bridgeCount: 15,
        tunnelCount: 2,
        budget: 5800000,
        status: 'in_progress',
        startDate: '2024-03-01',
        endDate: '2024-06-30'
      },
      {
        name: 'S26诸永高速温州段定期检测',
        projectNo: 'PRJ-2024-002',
        customerId: customers[1].id,
        province: '浙江省',
        city: '温州市',
        roadLevel: '高速公路',
        mainLineLength: 62.4,
        rampLength: 8.5,
        bridgeCount: 22,
        tunnelCount: 5,
        budget: 4200000,
        status: 'contracted',
        startDate: '2024-04-01',
        endDate: '2024-08-31'
      },
      {
        name: 'G25长深高速江苏段技术状况评定',
        projectNo: 'PRJ-2024-003',
        customerId: customers[2].id,
        province: '江苏省',
        city: '南京市',
        roadLevel: '高速公路',
        mainLineLength: 128.5,
        rampLength: 18.2,
        bridgeCount: 35,
        tunnelCount: 3,
        budget: 8500000,
        status: 'pending',
        startDate: '2024-05-01',
        endDate: '2024-10-31'
      }
    ]);
    console.log(`   创建了 ${projects.length} 个示例项目`);

    // 8. 示例报价
    console.log('📋 创建示例报价...');
    const quote1 = await Quote.create({
      quoteNo: 'QT-2024-0001',
      projectId: projects[0].id,
      customerId: customers[0].id,
      projectName: projects[0].name,
      customerName: customers[0].name,
      roadLevel: '高速公路',
      pavementType: '沥青混凝土路面',
      mainLineLength: 85.6,
      rampLength: 12.3,
      bridgeLarge: 5,
      bridgeMedium: 7,
      bridgeSmall: 3,
      tunnelCount: 2,
      totalAmount: 285000,
      status: 'approved',
      validUntil: '2024-12-31',
      createdBy: users[1].id
    });

    // 报价明细
    await QuoteItem.bulkCreate([
      { quoteId: quote1.id, itemName: '路面弯沉检测', standardCode: 'E61-01', unit: '点', workload: 4800, unitPrice: 45, amount: 216000 },
      { quote1.id, itemName: '路面平整度检测', standardCode: 'E61-02', unit: '公里', workload: 85.6, unitPrice: 800, amount: 68480 },
      { quote1.id, itemName: '大桥定期检查', standardCode: 'J21-02', unit: '座', workload: 5, unitPrice: 8000, amount: 40000 },
      { quote1.id, itemName: '中桥定期检查', standardCode: 'J21-03', unit: '座', workload: 7, unitPrice: 5000, amount: 35000 },
      { quote1.id, itemName: '隧道定期检查', standardCode: 'F60-03', unit: '座', workload: 2, unitPrice: 12000, amount: 24000 }
    ].map(item => ({
      quoteId: quote1.id,
      itemName: item.itemName,
      standardCode: item.standardCode,
      unit: item.unit,
      workload: item.workload,
      unitPrice: item.unitPrice,
      amount: item.amount
    })));

    console.log(`   创建了 1 条示例报价`);

    console.log('\n✅ 种子数据创建完成！');
    console.log('\n📌 登录信息：');
    console.log('   用户名: admin | 密码: admin123');
    console.log('   用户名: quoter1 | 密码: admin123\n');

    return true;
  } catch (error) {
    console.error('❌ 种子数据创建失败:', error.message);
    throw error;
  }
}

module.exports = seedData;
