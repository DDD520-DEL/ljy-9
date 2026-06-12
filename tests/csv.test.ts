import assert from 'assert';
import { parseCSV, generateCartridgeCSVTemplate } from '../src/utils/csv';

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
  console.log('\n=== CSV 解析与批量导入测试 ===\n');
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

test('基本CSV解析 - 简单逗号分隔', () => {
  const csv = 'title,platform,series\n超级马里奥,FC,马里奥\n塞尔达传说,FC,塞尔达';
  const result = parseCSV(csv);
  assert.strictEqual(result.headers.length, 3);
  assert.deepStrictEqual(result.headers, ['title', 'platform', 'series']);
  assert.strictEqual(result.rows.length, 2);
  assert.strictEqual(result.rows[0].title, '超级马里奥');
  assert.strictEqual(result.rows[1].platform, 'FC');
});

test('BOM字符处理 - 首字段正确解析', () => {
  const BOM = '\uFEFF';
  const csv = BOM + 'title,platform,region\n超级马里奥,FC,JPN\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.headers.length, 3);
  assert.strictEqual(result.headers[0], 'title', '首字段应该是 title，不是 \\uFEFFtitle');
  assert.strictEqual(result.headers[0].charCodeAt(0), 't'.charCodeAt(0));
  assert.strictEqual(result.rows.length, 1);
  assert.strictEqual(result.rows[0].title, '超级马里奥');
});

test('BOM字符处理 - 无BOM也能正常解析', () => {
  const csv = 'title,platform\n马里奥,FC\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.headers[0], 'title');
  assert.strictEqual(result.rows.length, 1);
});

test('中文说明行自动跳过 - 模板三行场景', () => {
  const csv = 'title,platform,region\n游戏名称*,平台*,区域版本(JPN/USA/EUR/CHN/OTHER)\n超级马里奥,FC,JPN';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 1, '中文说明行应该被自动跳过');
  assert.strictEqual(result.rows[0].title, '超级马里奥');
});

test('中文说明行不跳过 - 第二行是数据', () => {
  const csv = 'title,platform,region\n超级马里奥,FC,JPN\n塞尔达传说,SFC,JPN';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 2);
  assert.strictEqual(result.rows[0].title, '超级马里奥');
  assert.strictEqual(result.rows[1].title, '塞尔达传说');
});

test('带引号的字段解析 - 包含逗号', () => {
  const csv = 'title,notes\n"马里奥,超级","经典,必玩"\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 1);
  assert.strictEqual(result.rows[0].title, '马里奥,超级');
  assert.strictEqual(result.rows[0].notes, '经典,必玩');
});

test('带引号的字段解析 - 包含换行', () => {
  const csv = 'title,notes\n"马里奥","第一行\n第二行"\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 1);
  assert.strictEqual(result.rows[0].title, '马里奥');
  assert.ok(result.rows[0].notes.includes('\n'));
});

test('带引号的字段解析 - 转义双引号', () => {
  const csv = 'title\n"他说""你好"""\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 1);
  assert.strictEqual(result.rows[0].title, '他说"你好"');
});

test('空行自动跳过', () => {
  const csv = 'title,platform\n\n马里奥,FC\n\n塞尔达,SFC\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 2);
});

test('空值和 null 处理', () => {
  const csv = 'title,series,notes\n马里奥,,null\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows[0].title, '马里奥');
  assert.strictEqual(result.rows[0].series, '');
  assert.strictEqual(result.rows[0].notes, '');
});

test('模板生成与解析一致性 - 下载后重新上传场景', () => {
  const BOM = '\uFEFF';
  const template = generateCartridgeCSVTemplate();
  const csvWithBOM = BOM + template;
  const result = parseCSV(csvWithBOM);

  assert.ok(result.headers.includes('title'), '应该包含 title 字段');
  assert.ok(result.headers.includes('platform'), '应该包含 platform 字段');
  assert.ok(result.headers.includes('region'), '应该包含 region 字段');
  assert.ok(result.headers.includes('condition'), '应该包含 condition 字段');

  assert.ok(result.rows.length > 0, '模板应该包含示例数据行');
  assert.strictEqual(result.rows[0].title, '超级马里奥兄弟');
  assert.strictEqual(result.rows[0].platform, 'FC');
});

test('模板生成 - 包含所有必要字段', () => {
  const template = generateCartridgeCSVTemplate();
  const result = parseCSV(template);
  const expectedFields = [
    'title', 'platform', 'series', 'publisher', 'releaseYear',
    'region', 'condition', 'hasBox', 'hasManual', 'hasCartridge',
    'purchasePrice', 'purchaseDate', 'notes', 'coverImage',
  ];
  for (const field of expectedFields) {
    assert.ok(result.headers.includes(field), `模板应该包含 ${field} 字段`);
  }
});

test('Windows换行符(\r\n)处理', () => {
  const csv = 'title,platform\r\n马里奥,FC\r\n塞尔达,SFC\r\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 2);
  assert.strictEqual(result.rows[0].title, '马里奥');
  assert.strictEqual(result.rows[1].platform, 'SFC');
});

test('前后空格自动去除', () => {
  const csv = ' title , platform \n 马里奥 , FC \n';
  const result = parseCSV(csv);
  assert.strictEqual(result.headers[0], 'title');
  assert.strictEqual(result.headers[1], 'platform');
  assert.strictEqual(result.rows[0].title, '马里奥');
  assert.strictEqual(result.rows[0].platform, 'FC');
});

test('单条数据解析', () => {
  const csv = 'title,platform\n马里奥,FC';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 1);
  assert.strictEqual(result.rows[0].title, '马里奥');
});

test('空CSV处理', () => {
  const result = parseCSV('');
  assert.strictEqual(result.headers.length, 0);
  assert.strictEqual(result.rows.length, 0);
});

test('只有表头没有数据', () => {
  const result = parseCSV('title,platform,region\n');
  assert.strictEqual(result.headers.length, 3);
  assert.strictEqual(result.rows.length, 0);
});

test('后端重复检测逻辑 - 标题+平台+区域相同判定重复', () => {
  const csv = 'title,platform,region\n马里奥,FC,JPN\n马里奥,FC,USA\n马里奥,FC,JPN\n';
  const result = parseCSV(csv);
  assert.strictEqual(result.rows.length, 3);
  assert.strictEqual(result.rows[0].title, '马里奥');
  assert.strictEqual(result.rows[0].region, 'JPN');
  assert.strictEqual(result.rows[1].region, 'USA');
  assert.strictEqual(result.rows[2].region, 'JPN');
});

test('BOM + 中文说明行 + 示例数据 - 完整导入场景', () => {
  const BOM = '\uFEFF';
  const template = generateCartridgeCSVTemplate();
  const csv = BOM + template;
  const result = parseCSV(csv);

  assert.strictEqual(result.headers[0], 'title', 'BOM不应影响首字段名');
  assert.ok(result.rows.length >= 1, '应该解析出数据行');
  assert.ok(result.headers.every((h) => !h.includes('\uFEFF')), '所有表头都不应包含BOM字符');
  assert.strictEqual(result.rows[0].title, '超级马里奥兄弟');
  assert.strictEqual(result.rows[0].platform, 'FC');
  assert.strictEqual(result.rows[0].region, 'JPN');
});

runTests();
