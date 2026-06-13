import assert from 'assert';
import {
  getYearIndex,
  canNavigateYear,
  navigateYear,
  getAvailableYears,
  getYearCartridges,
  getMonthlyTrend,
  getCumulativeTrend,
  getTopExpensive,
  getPlatformDistribution,
  getYearStats,
} from '../src/utils/yearlyReview';

type TestCase = {
  name: string;
  run: () => void;
};

const tests: TestCase[] = [];
let passed = 0;
let failed = 0;

const test = (name: string, fn: () => void) => {
  tests.push({ name, run: fn });
};

const runTests = () => {
  console.log('\n=== 年度收藏回顾功能测试 ===\n');
  for (const t of tests) {
    try {
      t.run();
      console.log(`  ✅ ${t.name}`);
      passed++;
    } catch (e: any) {
      console.log(`  ❌ ${t.name}`);
      console.log(`     ${e.message}`);
      failed++;
    }
  }
  console.log(`\n=== 结果: ${passed} 通过, ${failed} 失败 ===\n`);
  process.exit(failed > 0 ? 1 : 0);
};

// ===== getYearIndex 测试 =====

test('getYearIndex - 正常年份返回正确索引', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(getYearIndex(years, 2026), 0);
  assert.strictEqual(getYearIndex(years, 2024), 1);
  assert.strictEqual(getYearIndex(years, 2023), 2);
});

test('getYearIndex - 不存在的年份返回 -1', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(getYearIndex(years, 2025), -1);
  assert.strictEqual(getYearIndex(years, 2020), -1);
  assert.strictEqual(getYearIndex(years, 0), -1);
});

test('getYearIndex - 空数组返回 -1', () => {
  assert.strictEqual(getYearIndex([], 2024), -1);
});

test('getYearIndex - 单元素数组', () => {
  assert.strictEqual(getYearIndex([2024], 2024), 0);
  assert.strictEqual(getYearIndex([2024], 2023), -1);
});

// ===== canNavigateYear 测试 =====

test('canNavigateYear - 中间年份两个方向都可导航', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(canNavigateYear(years, 2024, -1), true, '应该可以向前(更早)');
  assert.strictEqual(canNavigateYear(years, 2024, 1), true, '应该可以向后(更新)');
});

test('canNavigateYear - 最早年份不可向前导航', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(canNavigateYear(years, 2023, -1), false, '最早年份不能再向前');
  assert.strictEqual(canNavigateYear(years, 2023, 1), true, '最早年份可以向后');
});

test('canNavigateYear - 最新年份不可向后导航', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(canNavigateYear(years, 2026, 1), false, '最新年份不能再向后');
  assert.strictEqual(canNavigateYear(years, 2026, -1), true, '最新年份可以向前');
});

test('canNavigateYear - 单元素数组两个方向都不可导航', () => {
  const years = [2024];
  assert.strictEqual(canNavigateYear(years, 2024, -1), false);
  assert.strictEqual(canNavigateYear(years, 2024, 1), false);
});

test('canNavigateYear - 不存在的年份返回 false', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(canNavigateYear(years, 2025, -1), false);
  assert.strictEqual(canNavigateYear(years, 2025, 1), false);
});

test('canNavigateYear - 空数组返回 false', () => {
  assert.strictEqual(canNavigateYear([], 2024, -1), false);
  assert.strictEqual(canNavigateYear([], 2024, 1), false);
});

// ===== navigateYear 测试 =====

test('navigateYear - 从中间年份向前导航(更早)', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(navigateYear(years, 2024, -1), 2023);
});

test('navigateYear - 从中间年份向后导航(更新)', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(navigateYear(years, 2024, 1), 2026);
});

test('navigateYear - 最早年份向前导航返回 null', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(navigateYear(years, 2023, -1), null);
});

test('navigateYear - 最新年份向后导航返回 null', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(navigateYear(years, 2026, 1), null);
});

test('navigateYear - 不存在的年份返回 null', () => {
  const years = [2026, 2024, 2023];
  assert.strictEqual(navigateYear(years, 2025, -1), null);
  assert.strictEqual(navigateYear(years, 2025, 1), null);
});

test('navigateYear - 空数组返回 null', () => {
  assert.strictEqual(navigateYear([], 2024, -1), null);
  assert.strictEqual(navigateYear([], 2024, 1), null);
});

test('navigateYear - 单元素数组两个方向都返回 null', () => {
  const years = [2024];
  assert.strictEqual(navigateYear(years, 2024, -1), null);
  assert.strictEqual(navigateYear(years, 2024, 1), null);
});

test('navigateYear - 从最新到最早再到最新完整循环', () => {
  const years = [2026, 2024, 2023];
  let current = 2026;

  current = navigateYear(years, current, -1) || current;
  assert.strictEqual(current, 2024, '第一次向前到2024');

  current = navigateYear(years, current, -1) || current;
  assert.strictEqual(current, 2023, '第二次向前到2023');

  current = navigateYear(years, current, -1) || current;
  assert.strictEqual(current, 2023, '第三次向前失败，保持2023');

  current = navigateYear(years, current, 1) || current;
  assert.strictEqual(current, 2024, '第一次向后到2024');

  current = navigateYear(years, current, 1) || current;
  assert.strictEqual(current, 2026, '第二次向后到2026');

  current = navigateYear(years, current, 1) || current;
  assert.strictEqual(current, 2026, '第三次向后失败，保持2026');
});

// ===== getAvailableYears 测试 =====

test('getAvailableYears - 从购买日期提取年份', () => {
  const purchaseDates = ['2024-01-15', '2023-06-20', '2024-12-01'];
  const result = getAvailableYears(purchaseDates, [], false);
  assert.ok(result.includes(2024), '应该包含2024');
  assert.ok(result.includes(2023), '应该包含2023');
  assert.strictEqual(result.length, 2);
});

test('getAvailableYears - 从创建日期提取年份', () => {
  const purchaseDates: string[] = [];
  const createdAtDates = ['2024-01-15', '2023-06-20'];
  const result = getAvailableYears(purchaseDates, createdAtDates, false);
  assert.ok(result.includes(2024), '应该包含2024');
  assert.ok(result.includes(2023), '应该包含2023');
});

test('getAvailableYears - 合并购买日期和创建日期', () => {
  const purchaseDates = ['2024-01-15'];
  const createdAtDates = ['2023-06-20', '2025-01-01'];
  const result = getAvailableYears(purchaseDates, createdAtDates, false);
  assert.ok(result.includes(2024), '应该包含2024');
  assert.ok(result.includes(2023), '应该包含2023');
  assert.ok(result.includes(2025), '应该包含2025');
  assert.strictEqual(result.length, 3);
});

test('getAvailableYears - 默认包含当前年份', () => {
  const currentYear = new Date().getFullYear();
  const result = getAvailableYears([], [], true);
  assert.ok(result.includes(currentYear), '应该包含当前年份');
});

test('getAvailableYears - 不包含当前年份选项', () => {
  const currentYear = new Date().getFullYear();
  const result = getAvailableYears([], [], false);
  assert.strictEqual(result.length, 0, '空输入且不包含当前年时应该为空');
  assert.ok(!result.includes(currentYear), '不应该包含当前年份');
});

test('getAvailableYears - 结果按降序排列', () => {
  const purchaseDates = ['2023-01-01', '2026-01-01', '2024-01-01'];
  const result = getAvailableYears(purchaseDates, [], false);
  assert.strictEqual(result[0], 2026, '第一个应该是最大的年份');
  assert.strictEqual(result[1], 2024, '第二个应该是中间的年份');
  assert.strictEqual(result[2], 2023, '第三个应该是最小的年份');
});

test('getAvailableYears - 去重', () => {
  const purchaseDates = ['2024-01-01', '2024-06-01', '2024-12-01'];
  const result = getAvailableYears(purchaseDates, [], false);
  assert.strictEqual(result.length, 1, '相同年份应该去重');
});

test('getAvailableYears - 处理无效日期', () => {
  const purchaseDates = ['2024-01-01', 'invalid-date', '', null, undefined];
  const result = getAvailableYears(purchaseDates, [], false);
  assert.strictEqual(result.length, 1, '无效日期应该被忽略');
  assert.ok(result.includes(2024));
});

// ===== getYearCartridges 测试 =====

const mockCartridges = [
  { id: '1', purchaseDate: '2024-03-15', createdAt: '2024-03-15', platform: 'SFC', series: '马里奥', purchasePrice: 500 },
  { id: '2', purchaseDate: '2024-08-20', createdAt: '2024-08-20', platform: 'GB', series: '口袋妖怪', purchasePrice: 300 },
  { id: '3', purchaseDate: '2023-01-10', createdAt: '2023-01-10', platform: 'FC', series: '塞尔达', purchasePrice: 1000 },
  { id: '4', purchaseDate: '2023-12-25', createdAt: '2023-12-25', platform: 'SFC', series: '最终幻想', purchasePrice: 800 },
  { id: '5', createdAt: '2024-06-01', platform: 'SFC', series: '星之卡比', purchasePrice: 200 },
];

test('getYearCartridges - 正确筛选指定年份的卡带', () => {
  const result = getYearCartridges(mockCartridges, 2024);
  assert.strictEqual(result.length, 3, '2024年应该有3张卡带');
  assert.ok(result.every((c) => c.id !== '3' && c.id !== '4'), '不应该包含2023年的卡带');
});

test('getYearCartridges - 没有购买日期时使用创建日期', () => {
  const result = getYearCartridges(mockCartridges, 2024);
  const hasKirby = result.some((c) => c.id === '5');
  assert.ok(hasKirby, '没有purchaseDate但有createdAt的卡带应该被包含');
});

test('getYearCartridges - 无匹配年份返回空数组', () => {
  const result = getYearCartridges(mockCartridges, 2020);
  assert.strictEqual(result.length, 0);
  assert.deepStrictEqual(result, []);
});

test('getYearCartridges - 空数组返回空数组', () => {
  const result = getYearCartridges([], 2024);
  assert.strictEqual(result.length, 0);
});

// ===== getMonthlyTrend 测试 =====

test('getMonthlyTrend - 正确计算每月数据', () => {
  const yearCartridges = [
    { purchaseDate: '2024-01-15', purchasePrice: 100 },
    { purchaseDate: '2024-01-20', purchasePrice: 200 },
    { purchaseDate: '2024-06-10', purchasePrice: 300 },
    { purchaseDate: '2024-12-25', purchasePrice: 500 },
  ];
  const result = getMonthlyTrend(yearCartridges as any, 2024);
  assert.strictEqual(result.length, 12, '应该有12个月的数据');
  assert.strictEqual(result[0].新增数量, 2, '1月应该有2张');
  assert.strictEqual(result[0].累计支出, 300, '1月累计支出应该是300');
  assert.strictEqual(result[5].新增数量, 1, '6月应该有1张');
  assert.strictEqual(result[11].新增数量, 1, '12月应该有1张');
});

test('getMonthlyTrend - 空数组返回全零数据', () => {
  const result = getMonthlyTrend([], 2024);
  assert.strictEqual(result.length, 12);
  assert.ok(result.every((m) => m.新增数量 === 0), '所有月份数量都应为0');
  assert.ok(result.every((m) => m.累计支出 === 0), '所有月份支出都应为0');
});

test('getMonthlyTrend - 月份标签正确', () => {
  const result = getMonthlyTrend([], 2024);
  assert.strictEqual(result[0].month, '1月');
  assert.strictEqual(result[11].month, '12月');
});

// ===== getCumulativeTrend 测试 =====

test('getCumulativeTrend - 正确计算累计数量', () => {
  const monthlyTrend = [
    { month: '1月', 新增数量: 2, 累计支出: 300 },
    { month: '2月', 新增数量: 1, 累计支出: 100 },
    { month: '3月', 新增数量: 3, 累计支出: 500 },
  ];
  const result = getCumulativeTrend(monthlyTrend);
  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].累计数量, 2, '1月累计应该是2');
  assert.strictEqual(result[1].累计数量, 3, '2月累计应该是3');
  assert.strictEqual(result[2].累计数量, 6, '3月累计应该是6');
});

test('getCumulativeTrend - 空数组返回空数组', () => {
  const result = getCumulativeTrend([]);
  assert.strictEqual(result.length, 0);
});

test('getCumulativeTrend - 全零数据返回全零累计', () => {
  const monthlyTrend = [
    { month: '1月', 新增数量: 0, 累计支出: 0 },
    { month: '2月', 新增数量: 0, 累计支出: 0 },
  ];
  const result = getCumulativeTrend(monthlyTrend);
  assert.strictEqual(result[0].累计数量, 0);
  assert.strictEqual(result[1].累计数量, 0);
});

// ===== getTopExpensive 测试 =====

test('getTopExpensive - 按价格降序排列', () => {
  const cartridges = [
    { purchasePrice: 300 },
    { purchasePrice: 1000 },
    { purchasePrice: 500 },
    { purchasePrice: 200 },
  ];
  const result = getTopExpensive(cartridges as any, 3);
  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].purchasePrice, 1000, '第一个应该是最贵的');
  assert.strictEqual(result[1].purchasePrice, 500, '第二个应该是第二贵的');
  assert.strictEqual(result[2].purchasePrice, 300, '第三个应该是第三贵的');
});

test('getTopExpensive - 默认返回前5个', () => {
  const cartridges = Array.from({ length: 10 }, (_, i) => ({ purchasePrice: i * 100 }));
  const result = getTopExpensive(cartridges as any);
  assert.strictEqual(result.length, 5);
});

test('getTopExpensive - 数量不足时返回全部', () => {
  const cartridges = [{ purchasePrice: 100 }, { purchasePrice: 200 }];
  const result = getTopExpensive(cartridges as any, 5);
  assert.strictEqual(result.length, 2);
});

test('getTopExpensive - 空数组返回空数组', () => {
  const result = getTopExpensive([], 5);
  assert.strictEqual(result.length, 0);
});

test('getTopExpensive - 不修改原数组', () => {
  const cartridges = [
    { purchasePrice: 300 },
    { purchasePrice: 1000 },
    { purchasePrice: 500 },
  ];
  const originalOrder = cartridges.map((c) => c.purchasePrice);
  getTopExpensive(cartridges as any, 3);
  assert.deepStrictEqual(
    cartridges.map((c) => c.purchasePrice),
    originalOrder,
    '原数组顺序不应该被改变'
  );
});

// ===== getPlatformDistribution 测试 =====

test('getPlatformDistribution - 正确计算各平台数量', () => {
  const cartridges = [
    { platform: 'SFC' },
    { platform: 'FC' },
    { platform: 'SFC' },
    { platform: 'GB' },
    { platform: 'SFC' },
    { platform: 'FC' },
  ];
  const result = getPlatformDistribution(cartridges as any);
  const sfc = result.find((r) => r.name === 'SFC');
  const fc = result.find((r) => r.name === 'FC');
  const gb = result.find((r) => r.name === 'GB');
  assert.strictEqual(sfc?.value, 3);
  assert.strictEqual(fc?.value, 2);
  assert.strictEqual(gb?.value, 1);
});

test('getPlatformDistribution - 按数量降序排列', () => {
  const cartridges = [
    { platform: 'SFC' },
    { platform: 'FC' },
    { platform: 'SFC' },
    { platform: 'GB' },
    { platform: 'SFC' },
  ];
  const result = getPlatformDistribution(cartridges as any);
  assert.strictEqual(result[0].name, 'SFC', 'SFC数量最多应该排第一');
  assert.strictEqual(result[result.length - 1].name, 'GB', 'GB数量最少应该排最后');
});

test('getPlatformDistribution - 空数组返回空数组', () => {
  const result = getPlatformDistribution([]);
  assert.strictEqual(result.length, 0);
});

// ===== getYearStats 测试 =====

test('getYearStats - 正确计算年度统计', () => {
  const cartridges = [
    { platform: 'SFC', series: '马里奥', purchasePrice: 500 },
    { platform: 'GB', series: '口袋妖怪', purchasePrice: 300 },
    { platform: 'SFC', series: '塞尔达', purchasePrice: 800 },
  ];
  const result = getYearStats(cartridges as any);
  assert.strictEqual(result.totalCount, 3, '总数量应该是3');
  assert.strictEqual(result.totalSpent, 1600, '总支出应该是1600');
  assert.strictEqual(result.avgPrice, 1600 / 3, '平均价格应该是总支出/数量');
  assert.strictEqual(result.uniquePlatforms, 2, '平台数应该是2');
  assert.strictEqual(result.uniqueSeries, 3, '系列数应该是3');
});

test('getYearStats - 空数组返回零值统计', () => {
  const result = getYearStats([]);
  assert.strictEqual(result.totalCount, 0);
  assert.strictEqual(result.totalSpent, 0);
  assert.strictEqual(result.avgPrice, 0);
  assert.strictEqual(result.uniquePlatforms, 0);
  assert.strictEqual(result.uniqueSeries, 0);
});

test('getYearStats - 未设置价格视为0', () => {
  const cartridges = [
    { platform: 'SFC', series: '马里奥' },
    { platform: 'GB', series: '口袋妖怪' },
  ];
  const result = getYearStats(cartridges as any);
  assert.strictEqual(result.totalSpent, 0);
  assert.strictEqual(result.avgPrice, 0);
});

// ===== 边界场景集成测试 =====

test('集成测试 - 只有一个数据点的场景', () => {
  const singleCartridge = [
    { id: '1', purchaseDate: '2024-06-15', platform: 'SFC', series: '马里奥', purchasePrice: 500 },
  ];

  const years = getAvailableYears(
    singleCartridge.map((c) => c.purchaseDate),
    [],
    false
  );
  assert.strictEqual(years.length, 1);
  assert.strictEqual(years[0], 2024);

  assert.strictEqual(canNavigateYear(years, 2024, -1), false, '单年份不能向前');
  assert.strictEqual(canNavigateYear(years, 2024, 1), false, '单年份不能向后');

  const yearData = getYearCartridges(singleCartridge, 2024);
  assert.strictEqual(yearData.length, 1);

  const stats = getYearStats(yearData);
  assert.strictEqual(stats.totalCount, 1);
  assert.strictEqual(stats.totalSpent, 500);
  assert.strictEqual(stats.avgPrice, 500);
});

test('集成测试 - 跨年数据正确分组', () => {
  const cartridges = [
    { id: '1', purchaseDate: '2023-12-31', platform: 'FC', series: 'A', purchasePrice: 100 },
    { id: '2', purchaseDate: '2024-01-01', platform: 'SFC', series: 'B', purchasePrice: 200 },
  ];

  const year2023 = getYearCartridges(cartridges, 2023);
  const year2024 = getYearCartridges(cartridges, 2024);

  assert.strictEqual(year2023.length, 1, '2023年应该有1张');
  assert.strictEqual(year2023[0].id, '1');
  assert.strictEqual(year2024.length, 1, '2024年应该有1张');
  assert.strictEqual(year2024[0].id, '2');
});

test('集成测试 - 最贵TOP5在数据不足时正确处理', () => {
  const cartridges = [
    { purchasePrice: 300, title: 'A' },
    { purchasePrice: 100, title: 'B' },
  ];
  const top5 = getTopExpensive(cartridges as any, 5);
  assert.strictEqual(top5.length, 2, '只有2条数据时TOP5应该返回2条');
  assert.strictEqual(top5[0].title, 'A', '应该按价格降序排列');
});

runTests();
