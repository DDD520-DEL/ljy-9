export interface ParsedCSV {
  headers: string[];
  rows: Record<string, any>[];
}

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"';
        i += 2;
      } else if (char === '"') {
        inQuotes = false;
        i++;
      } else {
        current += char;
        i++;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
      } else if (char === ',') {
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
  }
  result.push(current);
  return result;
};

export const parseCSV = (csvText: string): ParsedCSV => {
  let text = csvText;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentLine += '""';
        i += 2;
      } else if (char === '"') {
        inQuotes = false;
        currentLine += '"';
        i++;
      } else {
        currentLine += char;
        i++;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        currentLine += '"';
        i++;
      } else if ((char === '\r' && nextChar === '\n') || char === '\n') {
        if (currentLine.trim() !== '') {
          lines.push(currentLine);
        }
        currentLine = '';
        i += (char === '\r' && nextChar === '\n') ? 2 : 1;
      } else {
        currentLine += char;
        i++;
      }
    }
  }
  if (currentLine.trim() !== '') {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, any>[] = [];

  const isDescriptionRow = (row: string[]): boolean => {
    if (row.length !== headers.length) return false;
    if (row.length < 2) return false;

    let hasRequiredMarkers = 0;
    let hasDescriptionPatterns = 0;
    const lowerHeaders = headers.map((h) => h.toLowerCase());

    const allHeadersEnglish = lowerHeaders.every(
      (h) => /^[a-z][a-z0-9]*$/i.test(h)
    );
    if (!allHeadersEnglish) return false;

    for (const cell of row) {
      if (cell.includes('*')) {
        hasRequiredMarkers++;
      }
      if (
        cell.includes('（') ||
        cell.includes('(') ||
        cell.includes('）') ||
        cell.includes(')')
      ) {
        hasDescriptionPatterns++;
      }
    }

    const markerRatio = hasRequiredMarkers / row.length;
    const descRatio = hasDescriptionPatterns / row.length;

    return (
      (hasRequiredMarkers >= 2 && descRatio > 0.2) ||
      (descRatio >= 0.5 && markerRatio > 0.1)
    );
  };

  for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
    const values = parseCSVLine(lines[lineIdx]);
    if (lineIdx === 1 && isDescriptionRow(values)) {
      continue;
    }
    const row: Record<string, any> = {};
    headers.forEach((header, idx) => {
      let value = values[idx] !== undefined ? values[idx].trim() : '';
      if (value.toLowerCase() === 'null') value = '';
      row[header] = value;
    });
    rows.push(row);
  }

  return { headers, rows };
};

const escapeCSV = (value: any): string => {
  const str = value === null || value === undefined ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const generateCartridgeCSVTemplate = (): string => {
  const headers = [
    'title',
    'platform',
    'series',
    'publisher',
    'releaseYear',
    'region',
    'condition',
    'hasBox',
    'hasManual',
    'hasCartridge',
    'purchasePrice',
    'purchaseDate',
    'notes',
    'coverImage',
  ];
  const headerLabels = [
    '游戏名称*',
    '平台*',
    '系列',
    '发行商',
    '发行年份',
    '区域版本(JPN/USA/EUR/CHN/OTHER)',
    '品相(MINT/NEAR_MINT/VERY_GOOD/GOOD/FAIR/POOR)',
    '有包装盒(true/false)',
    '有说明书(true/false)',
    '有卡带本体(true/false)',
    '购入价格(元)',
    '购入日期(YYYY-MM-DD)',
    '备注',
    '封面图片URL',
  ];
  const sampleRow = [
    '超级马里奥兄弟',
    'FC',
    '马里奥',
    '任天堂',
    '1985',
    'JPN',
    'VERY_GOOD',
    'true',
    'true',
    'true',
    '500',
    '2024-01-15',
    '初代经典作品，保存完好',
    '',
  ];

  return [
    headers.map(escapeCSV).join(','),
    headerLabels.map(escapeCSV).join(','),
    sampleRow.map(escapeCSV).join(','),
  ].join('\n');
};

export const downloadCSV = (content: string, filename: string) => {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
