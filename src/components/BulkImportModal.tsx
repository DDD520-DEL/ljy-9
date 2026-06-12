import React, { useState, useRef } from 'react';
import { useStore } from '../stores/useStore';
import PixelButton from './PixelButton';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  Check,
  AlertTriangle,
  XCircle,
  Loader2,
  FileUp,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { parseCSV, generateCartridgeCSVTemplate, downloadCSV } from '../utils/csv';
import type { Cartridge } from '../types';

interface PreviewValidItem {
  row: number;
  data: Omit<Cartridge, 'id' | 'createdAt' | 'updatedAt'>;
  original: Record<string, any>;
}

interface IssueItem {
  row: number;
  data: Record<string, any>;
  reason: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'preview' | 'result';

const BulkImportModal = ({ isOpen, onClose }: BulkImportModalProps) => {
  const { previewImport, bulkImport } = useStore();
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [previewData, setPreviewData] = useState<{
    valid: PreviewValidItem[];
    duplicates: IssueItem[];
    errors: IssueItem[];
  } | null>(null);
  const [importResult, setImportResult] = useState<{
    imported: Cartridge[];
    skipped: IssueItem[];
    errors: IssueItem[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'valid' | 'duplicates' | 'errors'>('valid');
  const [resultTab, setResultTab] = useState<'imported' | 'skipped' | 'errors'>('imported');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('upload');
    setFileName('');
    setParsedRows([]);
    setPreviewData(null);
    setImportResult(null);
    setIsProcessing(false);
    setActiveTab('valid');
    setResultTab('imported');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    resetState();
    onClose();
  };

  const handleDownloadTemplate = () => {
    const template = generateCartridgeCSVTemplate();
    downloadCSV(template, '卡带导入模板.csv');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const { rows } = parseCSV(text);
      setParsedRows(rows);
    } catch (error) {
      console.error('Failed to parse CSV:', error);
      alert('CSV文件解析失败，请检查文件格式');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
  };

  const handleNextToPreview = async () => {
    if (parsedRows.length === 0) {
      alert('请先选择有效的CSV文件');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await previewImport(parsedRows);
      if (result) {
        setPreviewData(result);
        if (result.valid.length > 0) {
          setActiveTab('valid');
        } else if (result.duplicates.length > 0) {
          setActiveTab('duplicates');
        } else {
          setActiveTab('errors');
        }
        setStep('preview');
      }
    } catch (error) {
      console.error('Preview failed:', error);
      alert('预览数据失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    try {
      const result = await bulkImport(parsedRows);
      if (result) {
        setImportResult(result);
        if (result.imported.length > 0) {
          setResultTab('imported');
        } else if (result.skipped.length > 0) {
          setResultTab('skipped');
        } else {
          setResultTab('errors');
        }
        setStep('result');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('导入失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    resetState();
  };

  if (!isOpen) return null;

  const headers = [
    { key: 'title', label: '游戏名称' },
    { key: 'platform', label: '平台' },
    { key: 'series', label: '系列' },
    { key: 'publisher', label: '发行商' },
    { key: 'releaseYear', label: '年份' },
    { key: 'region', label: '区域' },
    { key: 'condition', label: '品相' },
  ];

  const getConditionLabel = (cond: string) => {
    const map: Record<string, string> = {
      MINT: '全新',
      NEAR_MINT: '近新',
      VERY_GOOD: '很好',
      GOOD: '良好',
      FAIR: '一般',
      POOR: '较差',
    };
    return map[cond] || cond;
  };

  const getRegionLabel = (region: string) => {
    const map: Record<string, string> = {
      JPN: '日版',
      USA: '美版',
      EUR: '欧版',
      CHN: '国行',
      OTHER: '其他',
    };
    return map[region] || region;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-pixel rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-2 border-card-border">
          <div>
            <h2 className="font-pixel text-xl text-neon-cyan mb-1">批量导入卡带</h2>
            <p className="font-retro text-gray-400 text-sm">
              {step === 'upload' && '上传CSV文件开始批量导入'}
              {step === 'preview' && '预览数据，确认无误后导入'}
              {step === 'result' && '导入完成'}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-b border-card-border bg-darker-navy/30">
          {[{ id: 'upload', label: '上传文件', icon: FileUp }, { id: 'preview', label: '预览确认', icon: FileSpreadsheet }, { id: 'result', label: '导入结果', icon: Check }].map((s, idx, arr) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step === s.id
                      ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                      : arr.findIndex((x) => x.id === step) > idx
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  {arr.findIndex((x) => x.id === step) > idx ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`font-pixel text-xs ${
                    step === s.id ? 'text-neon-cyan' : arr.findIndex((x) => x.id === step) > idx ? 'text-neon-green' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && <ChevronRight className="w-5 h-5 text-gray-700" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  isProcessing
                    ? 'opacity-50 cursor-not-allowed'
                    : 'border-card-border hover:border-neon-cyan/50 hover:bg-darker-navy/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${fileName ? 'text-neon-green' : 'text-gray-600'}`} />
                {fileName ? (
                  <>
                    <p className="font-pixel text-sm text-neon-green mb-2">文件已选择</p>
                    <p className="font-retro text-gray-300 mb-2">{fileName}</p>
                    <p className="font-retro text-gray-500 text-sm">共解析到 {parsedRows.length} 条数据</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        setFileName('');
                        setParsedRows([]);
                      }}
                      className="mt-4 font-retro text-sm text-neon-pink hover:text-neon-pink/80"
                    >
                      重新选择文件
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-pixel text-sm text-gray-400 mb-2">点击选择CSV文件</p>
                    <p className="font-retro text-gray-600 text-sm">支持 .csv 格式，建议使用下方模板填写</p>
                  </>
                )}
              </div>

              <div className="card-pixel p-5 rounded-lg border-neon-purple/30">
                <h3 className="font-pixel text-xs text-neon-purple mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  下载导入模板
                </h3>
                <p className="font-retro text-gray-400 text-sm mb-4">
                  请先下载模板文件，按照格式填写后上传。模板中包含字段说明和示例数据。
                </p>
                <PixelButton variant="primary" onClick={handleDownloadTemplate}>
                  <Download className="w-4 h-4 inline mr-2" />
                  下载CSV模板
                </PixelButton>
              </div>

              <div className="card-pixel p-5 rounded-lg">
                <h3 className="font-pixel text-xs text-neon-cyan mb-4">字段说明</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-neon-pink min-w-[100px]">title *</span>
                    <span className="font-retro text-gray-400">游戏名称（必填）</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-neon-pink min-w-[100px]">platform *</span>
                    <span className="font-retro text-gray-400">平台（必填，如FC/SFC/GB）</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">series</span>
                    <span className="font-retro text-gray-400">系列名称</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">publisher</span>
                    <span className="font-retro text-gray-400">发行商</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">releaseYear</span>
                    <span className="font-retro text-gray-400">发行年份</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">region</span>
                    <span className="font-retro text-gray-400">区域：JPN/USA/EUR/CHN/OTHER</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">condition</span>
                    <span className="font-retro text-gray-400">品相：MINT~POOR</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-pixel text-xs text-gray-400 min-w-[100px]">hasBox等</span>
                    <span className="font-retro text-gray-400">布尔值：true/false</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && previewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-pixel p-4 rounded-lg border-neon-green/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-neon-green" />
                    <span className="font-pixel text-xs text-neon-green">可导入</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{previewData.valid.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条有效数据</p>
                </div>
                <div className="card-pixel p-4 rounded-lg border-neon-amber/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-neon-amber" />
                    <span className="font-pixel text-xs text-neon-amber">跳过</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{previewData.duplicates.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条重复数据</p>
                </div>
                <div className="card-pixel p-4 rounded-lg border-neon-pink/30">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-neon-pink" />
                    <span className="font-pixel text-xs text-neon-pink">错误</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{previewData.errors.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条数据错误</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('valid')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    activeTab === 'valid'
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  有效数据 ({previewData.valid.length})
                </button>
                <button
                  onClick={() => setActiveTab('duplicates')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    activeTab === 'duplicates'
                      ? 'bg-neon-amber/20 border-neon-amber text-neon-amber'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  重复跳过 ({previewData.duplicates.length})
                </button>
                <button
                  onClick={() => setActiveTab('errors')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    activeTab === 'errors'
                      ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  数据错误 ({previewData.errors.length})
                </button>
              </div>

              <div className="card-pixel rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  {activeTab === 'valid' && previewData.valid.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan whitespace-nowrap">行号</th>
                          {headers.map((h) => (
                            <th key={h.key} className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan whitespace-nowrap">
                              {h.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.valid.map((item, idx) => (
                          <tr key={idx} className="border-t border-card-border hover:bg-darker-navy/50">
                            <td className="px-4 py-3 font-pixel text-xs text-gray-500">{item.row}</td>
                            <td className="px-4 py-3 font-retro text-sm text-white">{item.data.title}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-purple">{item.data.platform}</td>
                            <td className="px-4 py-3 font-retro text-sm text-gray-400">{item.data.series || '-'}</td>
                            <td className="px-4 py-3 font-retro text-sm text-gray-400">{item.data.publisher || '-'}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-gray-400">{item.data.releaseYear}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-cyan">{getRegionLabel(item.data.region)}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-amber">{getConditionLabel(item.data.condition)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'duplicates' && previewData.duplicates.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">行号</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">游戏名称</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">平台</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">跳过原因</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.duplicates.map((item, idx) => (
                          <tr key={idx} className="border-t border-card-border">
                            <td className="px-4 py-3 font-pixel text-xs text-gray-500">{item.row}</td>
                            <td className="px-4 py-3 font-retro text-sm text-white">{item.data.title || '-'}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-purple">{item.data.platform || '-'}</td>
                            <td className="px-4 py-3 font-retro text-sm text-neon-amber">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.reason}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'errors' && previewData.errors.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">行号</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">原始数据</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">错误原因</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.errors.map((item, idx) => (
                          <tr key={idx} className="border-t border-card-border">
                            <td className="px-4 py-3 font-pixel text-xs text-gray-500 align-top">{item.row}</td>
                            <td className="px-4 py-3 font-retro text-xs text-gray-400 align-top max-w-xs">
                              <div className="truncate" title={JSON.stringify(item.data)}>
                                {Object.entries(item.data)
                                  .filter(([k, v]) => v)
                                  .map(([k, v]) => `${k}:${String(v).slice(0, 20)}`)
                                  .join(' | ')}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-retro text-sm text-neon-pink align-top">
                              <div className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.reason}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'valid' && previewData.valid.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无有效数据</p>
                    </div>
                  )}
                  {activeTab === 'duplicates' && previewData.duplicates.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无重复数据</p>
                    </div>
                  )}
                  {activeTab === 'errors' && previewData.errors.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无错误数据</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'result' && importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-pixel p-4 rounded-lg border-neon-green/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-neon-green" />
                    <span className="font-pixel text-xs text-neon-green">成功导入</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{importResult.imported.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条数据</p>
                </div>
                <div className="card-pixel p-4 rounded-lg border-neon-amber/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-neon-amber" />
                    <span className="font-pixel text-xs text-neon-amber">跳过</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{importResult.skipped.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条重复数据</p>
                </div>
                <div className="card-pixel p-4 rounded-lg border-neon-pink/30">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-neon-pink" />
                    <span className="font-pixel text-xs text-neon-pink">失败</span>
                  </div>
                  <p className="font-pixel text-2xl text-white">{importResult.errors.length}</p>
                  <p className="font-retro text-gray-500 text-xs">条错误数据</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setResultTab('imported')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    resultTab === 'imported'
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  已导入 ({importResult.imported.length})
                </button>
                <button
                  onClick={() => setResultTab('skipped')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    resultTab === 'skipped'
                      ? 'bg-neon-amber/20 border-neon-amber text-neon-amber'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  跳过 ({importResult.skipped.length})
                </button>
                <button
                  onClick={() => setResultTab('errors')}
                  className={`flex items-center gap-2 px-4 py-2 font-pixel text-xs border-2 transition-all ${
                    resultTab === 'errors'
                      ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                      : 'border-card-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  错误 ({importResult.errors.length})
                </button>
              </div>

              <div className="card-pixel rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  {resultTab === 'imported' && importResult.imported.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          {headers.map((h) => (
                            <th key={h.key} className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan whitespace-nowrap">
                              {h.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.imported.map((item) => (
                          <tr key={item.id} className="border-t border-card-border hover:bg-darker-navy/50">
                            <td className="px-4 py-3 font-retro text-sm text-white">{item.title}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-purple">{item.platform}</td>
                            <td className="px-4 py-3 font-retro text-sm text-gray-400">{item.series || '-'}</td>
                            <td className="px-4 py-3 font-retro text-sm text-gray-400">{item.publisher || '-'}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-gray-400">{item.releaseYear}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-cyan">{getRegionLabel(item.region)}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-amber">{getConditionLabel(item.condition)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {resultTab === 'skipped' && importResult.skipped.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">行号</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">游戏名称</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">平台</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">跳过原因</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.skipped.map((item, idx) => (
                          <tr key={idx} className="border-t border-card-border">
                            <td className="px-4 py-3 font-pixel text-xs text-gray-500">{item.row}</td>
                            <td className="px-4 py-3 font-retro text-sm text-white">{item.data.title || '-'}</td>
                            <td className="px-4 py-3 font-pixel text-xs text-neon-purple">{item.data.platform || '-'}</td>
                            <td className="px-4 py-3 font-retro text-sm text-neon-amber">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.reason}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {resultTab === 'errors' && importResult.errors.length > 0 && (
                    <table className="w-full">
                      <thead className="bg-darker-navy sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">行号</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">原始数据</th>
                          <th className="px-4 py-3 text-left font-pixel text-xs text-neon-cyan">错误原因</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.errors.map((item, idx) => (
                          <tr key={idx} className="border-t border-card-border">
                            <td className="px-4 py-3 font-pixel text-xs text-gray-500 align-top">{item.row}</td>
                            <td className="px-4 py-3 font-retro text-xs text-gray-400 align-top max-w-xs">
                              <div className="truncate" title={JSON.stringify(item.data)}>
                                {Object.entries(item.data)
                                  .filter(([k, v]) => v)
                                  .map(([k, v]) => `${k}:${String(v).slice(0, 20)}`)
                                  .join(' | ')}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-retro text-sm text-neon-pink align-top">
                              <div className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.reason}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {resultTab === 'imported' && importResult.imported.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无导入数据</p>
                    </div>
                  )}
                  {resultTab === 'skipped' && importResult.skipped.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无跳过数据</p>
                    </div>
                  )}
                  {resultTab === 'errors' && importResult.errors.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="font-retro text-gray-500">暂无错误数据</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-between p-6 border-t-2 border-card-border bg-darker-navy/30">
          {step === 'upload' && (
            <>
              <PixelButton variant="primary" onClick={handleClose} disabled={isProcessing}>
                取消
              </PixelButton>
              <PixelButton variant="cyan" onClick={handleNextToPreview} disabled={isProcessing || parsedRows.length === 0}>
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    下一步：预览
                    <ChevronRight className="w-4 h-4 inline ml-2" />
                  </>
                )}
              </PixelButton>
            </>
          )}
          {step === 'preview' && (
            <>
              <PixelButton variant="primary" onClick={() => setStep('upload')} disabled={isProcessing}>
                返回上传
              </PixelButton>
              <PixelButton
                variant="cyan"
                onClick={handleConfirmImport}
                disabled={isProcessing || !previewData || previewData.valid.length === 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 inline mr-2" />
                    确认导入 {previewData?.valid.length || 0} 条
                  </>
                )}
              </PixelButton>
            </>
          )}
          {step === 'result' && (
            <>
              <PixelButton variant="primary" onClick={handleStartOver} disabled={isProcessing}>
                <RefreshCw className="w-4 h-4 inline mr-2" />
                继续导入
              </PixelButton>
              <PixelButton variant="cyan" onClick={handleClose}>
                完成
              </PixelButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
