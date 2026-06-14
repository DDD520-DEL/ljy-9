import * as XLSX from 'xlsx';
import type { Cartridge } from '../types';
import { getConditionLabel, getRegionLabel, sanitizeFilename } from './format';

const yesNo = (value: boolean): string => (value ? '是' : '否');

const formatTags = (tags: string[] | undefined): string => {
  if (!tags || tags.length === 0) return '';
  return tags.join(', ');
};

export interface ExcelColumn {
  key: string;
  label: string;
  width?: number;
}

const defaultColumns: ExcelColumn[] = [
  { key: 'title', label: '游戏名称', width: 30 },
  { key: 'platform', label: '平台', width: 12 },
  { key: 'series', label: '系列', width: 15 },
  { key: 'publisher', label: '发行商', width: 15 },
  { key: 'releaseYear', label: '发行年份', width: 12 },
  { key: 'region', label: '区域版本', width: 12 },
  { key: 'condition', label: '品相', width: 10 },
  { key: 'hasBox', label: '包装盒', width: 10 },
  { key: 'hasManual', label: '说明书', width: 10 },
  { key: 'hasCartridge', label: '卡带本体', width: 12 },
  { key: 'purchasePrice', label: '购入价格(元)', width: 15 },
  { key: 'purchaseDate', label: '购入日期', width: 15 },
  { key: 'tags', label: '标签', width: 25 },
  { key: 'notes', label: '备注', width: 40 },
  { key: 'createdAt', label: '添加时间', width: 20 },
];

const transformCartridgeForExport = (
  cartridge: Cartridge,
  columns: ExcelColumn[]
): Record<string, any> => {
  const row: Record<string, any> = {};

  columns.forEach((col) => {
    switch (col.key) {
      case 'title':
        row[col.label] = cartridge.title || '';
        break;
      case 'platform':
        row[col.label] = cartridge.platform || '';
        break;
      case 'series':
        row[col.label] = cartridge.series || '';
        break;
      case 'publisher':
        row[col.label] = cartridge.publisher || '';
        break;
      case 'releaseYear':
        row[col.label] = cartridge.releaseYear || '';
        break;
      case 'region':
        row[col.label] = getRegionLabel(cartridge.region);
        break;
      case 'condition':
        row[col.label] = getConditionLabel(cartridge.condition);
        break;
      case 'hasBox':
        row[col.label] = yesNo(cartridge.hasBox);
        break;
      case 'hasManual':
        row[col.label] = yesNo(cartridge.hasManual);
        break;
      case 'hasCartridge':
        row[col.label] = yesNo(cartridge.hasCartridge);
        break;
      case 'purchasePrice':
        row[col.label] = cartridge.purchasePrice || 0;
        break;
      case 'purchaseDate':
        row[col.label] = cartridge.purchaseDate || '';
        break;
      case 'tags':
        row[col.label] = formatTags(cartridge.tags);
        break;
      case 'notes':
        row[col.label] = cartridge.notes || '';
        break;
      case 'createdAt':
        row[col.label] = cartridge.createdAt
          ? new Date(cartridge.createdAt).toLocaleDateString('zh-CN')
          : '';
        break;
      default:
        row[col.label] = (cartridge as any)[col.key] || '';
    }
  });

  return row;
};

export const exportCartridgesToExcel = (
  cartridges: Cartridge[],
  filename?: string,
  customColumns?: ExcelColumn[]
): void => {
  if (cartridges.length === 0) {
    throw new Error('没有可导出的数据');
  }

  const columns = customColumns || defaultColumns;
  const data = cartridges.map((c) => transformCartridgeForExport(c, columns));

  const ws = XLSX.utils.json_to_sheet(data);

  ws['!cols'] = columns.map((col) => ({
    wch: col.width || 15,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '收藏清单');

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const exportFilename = sanitizeFilename(
    filename || `收藏清单_${dateStr}`,
    '_',
    '收藏清单'
  );

  XLSX.writeFile(wb, `${exportFilename}.xlsx`);
};
