import assert from 'assert';
import { sanitizeFilename } from '../src/utils/format';

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
  console.log('\n=== 文件名清理 sanitizeFilename 测试 ===\n');
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

test('正常文件名保持不变', () => {
  assert.strictEqual(sanitizeFilename('超级马里奥兄弟'), '超级马里奥兄弟');
  assert.strictEqual(sanitizeFilename('Zelda'), 'Zelda');
  assert.strictEqual(sanitizeFilename('Metroid Fusion'), 'Metroid Fusion');
});

test('单种 Windows 非法字符被替换 - 冒号', () => {
  const result = sanitizeFilename('超级马里奥:奥德赛');
  assert.ok(!result.includes(':'), `结果不应包含冒号: ${result}`);
  assert.strictEqual(result, '超级马里奥_奥德赛');
});

test('单种 Windows 非法字符被替换 - 星号', () => {
  const result = sanitizeFilename('最终幻想*重制版');
  assert.ok(!result.includes('*'), `结果不应包含星号: ${result}`);
});

test('单种 Windows 非法字符被替换 - 问号', () => {
  const result = sanitizeFilename('你是谁?');
  assert.ok(!result.includes('?'), `结果不应包含问号: ${result}`);
});

test('单种 Windows 非法字符被替换 - 双引号', () => {
  const result = sanitizeFilename('"经典"游戏合集');
  assert.ok(!result.includes('"'), `结果不应包含双引号: ${result}`);
});

test('单种 Windows 非法字符被替换 - 小于大于号', () => {
  const result = sanitizeFilename('排名<第1名>游戏');
  assert.ok(!result.includes('<'), `结果不应包含小于号: ${result}`);
  assert.ok(!result.includes('>'), `结果不应包含大于号: ${result}`);
});

test('单种 Windows 非法字符被替换 - 竖线', () => {
  const result = sanitizeFilename('动作|冒险|RPG');
  assert.ok(!result.includes('|'), `结果不应包含竖线: ${result}`);
});

test('单种 Windows 非法字符被替换 - 反斜杠', () => {
  const result = sanitizeFilename('FC\\经典\\马里奥');
  assert.ok(!result.includes('\\'), `结果不应包含反斜杠: ${result}`);
});

test('单种 Windows 非法字符被替换 - 正斜杠', () => {
  const result = sanitizeFilename('SFC/塞尔达/时之笛');
  assert.ok(!result.includes('/'), `结果不应包含正斜杠: ${result}`);
});

test('多种非法字符混合出现', () => {
  const result = sanitizeFilename('游戏:"最终<幻想>*VII?重\\制/版|终极');
  const illegalChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
  for (const c of illegalChars) {
    assert.ok(!result.includes(c), `结果不应包含 ${c}: ${result}`);
  }
});

test('连续非法字符合并为单个替换符', () => {
  const result = sanitizeFilename('A***B???C');
  assert.ok(!result.includes('__'), `连续替换符应被合并: ${result}`);
});

test('替换符可自定义', () => {
  const result = sanitizeFilename('超级:马里奥', '-');
  assert.strictEqual(result, '超级-马里奥');
});

test('控制字符被清理 - 换行符', () => {
  const result = sanitizeFilename('第一行\n第二行');
  assert.ok(!result.includes('\n'), `结果不应包含换行符: ${result}`);
});

test('控制字符被清理 - 制表符', () => {
  const result = sanitizeFilename('游戏\t名称');
  assert.ok(!result.includes('\t'), `结果不应包含制表符: ${result}`);
});

test('控制字符被清理 - 回车符', () => {
  const result = sanitizeFilename('游戏\r名称');
  assert.ok(!result.includes('\r'), `结果不应包含回车符: ${result}`);
});

test('前后空格被去除', () => {
  const result = sanitizeFilename('   超级马里奥   ');
  assert.strictEqual(result, '超级马里奥');
});

test('多余空白压缩为单个空格', () => {
  const result = sanitizeFilename('超级   马里奥   兄弟');
  assert.strictEqual(result, '超级 马里奥 兄弟');
});

test('末尾句点被去除', () => {
  assert.strictEqual(sanitizeFilename('马里奥.'), '马里奥');
  assert.strictEqual(sanitizeFilename('马里奥...'), '马里奥');
});

test('Windows 保留名称被安全处理 - CON', () => {
  const result = sanitizeFilename('CON');
  assert.notStrictEqual(result, 'CON', 'CON 是 Windows 保留名称，应被处理');
  assert.ok(result.length > 0, '处理后的结果不应为空');
});

test('Windows 保留名称被安全处理 - NUL', () => {
  const result = sanitizeFilename('NUL');
  assert.notStrictEqual(result, 'NUL', 'NUL 是 Windows 保留名称，应被处理');
});

test('Windows 保留名称被安全处理 - COM1', () => {
  const result = sanitizeFilename('COM1');
  assert.notStrictEqual(result, 'COM1', 'COM1 是 Windows 保留名称，应被处理');
});

test('Windows 保留名称被安全处理 - LPT1', () => {
  const result = sanitizeFilename('LPT1');
  assert.notStrictEqual(result, 'LPT1', 'LPT1 是 Windows 保留名称，应被处理');
});

test('Windows 保留名称大小写不敏感 - con', () => {
  const result = sanitizeFilename('con');
  assert.notStrictEqual(result.toLowerCase(), 'con', 'con (小写) 是 Windows 保留名称');
});

test('空字符串返回默认 fallback', () => {
  assert.strictEqual(sanitizeFilename(''), 'unnamed');
});

test('null 或 undefined 输入处理', () => {
  assert.strictEqual(sanitizeFilename(null as any), 'unnamed');
  assert.strictEqual(sanitizeFilename(undefined as any), 'unnamed');
});

test('全部为非法字符时返回 fallback', () => {
  const result = sanitizeFilename('://*?"<>|\\');
  assert.strictEqual(result, 'unnamed');
});

test('自定义 fallback 参数', () => {
  assert.strictEqual(sanitizeFilename('', '_', 'default_name'), 'default_name');
});

test('文件名长度超过限制时被截断', () => {
  const longName = 'A'.repeat(500);
  const result = sanitizeFilename(longName);
  assert.ok(result.length <= 200, `结果长度应不超过 200，实际: ${result.length}`);
});

test('真实场景 - 含特殊字符的常见游戏名', () => {
  const testCases: [string, string][] = [
    ['最终幻想VII:重制版', '最终幻想VII_重制版'],
    ['侠盗猎车手:罪恶都市', '侠盗猎车手_罪恶都市'],
    ['塞尔达传说:时之笛', '塞尔达传说_时之笛'],
    ['反恐精英:全球攻势', '反恐精英_全球攻势'],
  ];
  for (const [input, expected] of testCases) {
    assert.strictEqual(sanitizeFilename(input), expected, `输入: ${input}`);
  }
});

test('真实场景 - 分享卡片文件名生成', () => {
  const title = '超级马里奥:奥德赛*特别版?';
  const safeTitle = sanitizeFilename(title);
  const filename = `${safeTitle}_分享卡片.png`;
  const illegalChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
  for (const c of illegalChars) {
    assert.ok(!filename.includes(c), `文件名不应包含 ${c}: ${filename}`);
  }
  assert.ok(filename.endsWith('_分享卡片.png'), '文件名应有正确后缀');
});

test('日文/中文/英文混合文件名', () => {
  const result = sanitizeFilename('マリオ:中国版 English Ver.');
  assert.ok(!result.includes(':'));
  assert.ok(result.includes('マリオ'));
  assert.ok(result.includes('中国版'));
  assert.ok(result.includes('English Ver'));
});

test('emoji 字符保留', () => {
  const result = sanitizeFilename('🎮 游戏:合集');
  assert.ok(result.includes('🎮'));
  assert.ok(!result.includes(':'));
});

test('组合复杂场景 - 保留名 + 非法字符 + 空格 + 末尾句点', () => {
  const result = sanitizeFilename('   CON: test? name..   ');
  const illegalChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
  for (const c of illegalChars) {
    assert.ok(!result.includes(c), `结果不应包含 ${c}: ${result}`);
  }
  assert.ok(!result.startsWith(' '), '不应以空格开头');
  assert.ok(!result.endsWith(' '), '不应以空格结尾');
  assert.ok(!result.endsWith('.'), '不应以句点结尾');
  assert.ok(result.includes('test'), '应保留合法的 test 字样');
  assert.ok(result.includes('name'), '应保留合法的 name 字样');
});

runTests();
