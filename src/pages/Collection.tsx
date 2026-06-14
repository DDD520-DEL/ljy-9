import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import Sidebar from '../components/Sidebar';
import CartridgeCard from '../components/CartridgeCard';
import BulkImportModal from '../components/BulkImportModal';
import CartridgeCompareModal from '../components/CartridgeCompareModal';
import { Filter, Grid, List, Plus, Search, SortAsc, FileText, Download, Loader2, UploadCloud, ArrowUpDown, X, CheckSquare, Check } from 'lucide-react';
import { generateReportData } from '../utils/report';
import { exportReportPDF } from '../utils/pdfExport';

const Collection = () => {
  const {
    cartridges,
    filters,
    sortBy,
    currentView,
    isLoading,
    fetchCartridges,
    setFilters,
    setSortBy,
    setCurrentView,
  } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleExportReport = async () => {
    if (isExporting || cartridges.length === 0) return;
    
    setIsExporting(true);
    try {
      const reportData = generateReportData(cartridges);
      await exportReportPDF(reportData);
    } catch (error) {
      console.error('导出报告失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchCartridges();
  }, [filters, sortBy]);

  useEffect(() => {
    if (!isCompareMode) {
      setSelectedIds(new Set());
    }
  }, [isCompareMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 4) {
          next.add(id);
        }
      }
      return next;
    });
  };

  const selectAllVisible = () => {
    const ids = cartridges.slice(0, 4).map((c) => c.id);
    setSelectedIds(new Set(ids));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const exitCompareMode = () => {
    setIsCompareMode(false);
    setSelectedIds(new Set());
  };

  const selectedCartridges = cartridges.filter((c) => selectedIds.has(c.id));

  const sortOptions = [
    { value: 'date_desc', label: '添加时间（新到旧）' },
    { value: 'date_asc', label: '添加时间（旧到新）' },
    { value: 'price_desc', label: '价格（高到低）' },
    { value: 'price_asc', label: '价格（低到高）' },
    { value: 'year_desc', label: '发行年份（新到旧）' },
    { value: 'year_asc', label: '发行年份（旧到新）' },
  ];

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-6 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-pixel text-xl text-white neon-glow-purple">藏品库</h1>
              <p className="font-retro text-gray-400 text-lg">
                共 {cartridges.length} 张卡带
                {isCompareMode && selectedIds.size > 0 && (
                  <span className="ml-2 text-neon-cyan">
                    · 已选 {selectedIds.size}/4
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden pixel-btn pixel-btn-cyan text-xs flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>

              {!isCompareMode ? (
                <button
                  onClick={() => setIsCompareMode(true)}
                  disabled={cartridges.length < 2}
                  className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  对比模式
                </button>
              ) : (
                <>
                  <button
                    onClick={selectAllVisible}
                    disabled={cartridges.length === 0}
                    className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckSquare className="w-4 h-4" />
                    全选前4
                  </button>
                  <button
                    onClick={clearSelection}
                    disabled={selectedIds.size === 0}
                    className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    清空选择
                  </button>
                  <button
                    onClick={() => setShowCompareModal(true)}
                    disabled={selectedIds.size < 2}
                    className="pixel-btn pixel-btn-pink text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    开始对比 ({selectedIds.size})
                  </button>
                  <button
                    onClick={exitCompareMode}
                    className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
                  >
                    退出对比
                  </button>
                </>
              )}

              {!isCompareMode && (
                <>
                  <button
                    onClick={handleExportReport}
                    disabled={isExporting || cartridges.length === 0}
                    className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <Download className="w-4 h-4" />
                        导出报告
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowBulkImport(true)}
                    className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 whitespace-nowrap"
                  >
                    <UploadCloud className="w-4 h-4" />
                    批量导入
                  </button>

                  <Link
                    to="/collection/add"
                    className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加卡带
                  </Link>
                </>
              )}
            </div>
          </div>

          {isCompareMode && (
            <div className="card-pixel p-4 rounded-lg mb-6 border-neon-cyan/50">
              <p className="font-retro text-neon-cyan text-sm">
                💡 对比模式：点击卡片进行选择，最多选择 4 张卡带进行对比。选中的卡片会高亮显示。
              </p>
            </div>
          )}

          <div className="card-pixel p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="搜索游戏名称、系列、发行商..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 font-retro text-lg"
                  />
                </div>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="font-retro text-lg"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center border-2 border-card-border rounded">
                  <button
                    onClick={() => setCurrentView('grid')}
                    className={`p-2 ${
                      currentView === 'grid'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`p-2 ${
                      currentView === 'list'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="font-retro text-gray-400 text-xl">加载中...</p>
            </div>
          ) : cartridges.length > 0 ? (
            currentView === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {cartridges.map((cartridge) => (
                  <CartridgeCard
                    key={cartridge.id}
                    cartridge={cartridge}
                    isSelectMode={isCompareMode}
                    isSelected={selectedIds.has(cartridge.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cartridges.map((cartridge) => (
                  isCompareMode ? (
                    <div
                      key={cartridge.id}
                      onClick={() => toggleSelect(cartridge.id)}
                      className={`card-pixel p-4 rounded-lg flex items-center gap-4 group cursor-pointer transition-colors ${
                        selectedIds.has(cartridge.id)
                          ? 'ring-4 ring-neon-cyan ring-opacity-70 border-neon-cyan/50'
                          : 'hover:border-neon-purple/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedIds.has(cartridge.id)
                          ? 'bg-neon-cyan border-neon-cyan'
                          : 'border-gray-400'
                      }`}>
                        {selectedIds.has(cartridge.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <img
                        src={cartridge.coverImage}
                        alt={cartridge.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors">
                          {cartridge.title}
                        </h3>
                        <p className="font-retro text-gray-400">
                          {cartridge.platform} · {cartridge.series} · {cartridge.releaseYear}
                        </p>
                        {cartridge.tags && cartridge.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cartridge.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-neon-purple/15 text-neon-purple font-retro text-[10px] rounded border border-neon-purple/25"
                              >
                                #{tag}
                              </span>
                            ))}
                            {cartridge.tags.length > 4 && (
                              <span className="px-1.5 py-0.5 text-gray-500 font-retro text-[10px]">
                                +{cartridge.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-pixel text-sm text-neon-amber">
                          ¥{cartridge.purchasePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={cartridge.id}
                      to={`/collection/${cartridge.id}`}
                      className="card-pixel p-4 rounded-lg flex items-center gap-4 group hover:border-neon-purple/50 transition-colors"
                    >
                      <img
                        src={cartridge.coverImage}
                        alt={cartridge.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors">
                          {cartridge.title}
                        </h3>
                        <p className="font-retro text-gray-400">
                          {cartridge.platform} · {cartridge.series} · {cartridge.releaseYear}
                        </p>
                        {cartridge.tags && cartridge.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cartridge.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 bg-neon-purple/15 text-neon-purple font-retro text-[10px] rounded border border-neon-purple/25"
                              >
                                #{tag}
                              </span>
                            ))}
                            {cartridge.tags.length > 4 && (
                              <span className="px-1.5 py-0.5 text-gray-500 font-retro text-[10px]">
                                +{cartridge.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-pixel text-sm text-neon-amber">
                          ¥{cartridge.purchasePrice.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <p className="font-retro text-gray-400 text-xl">暂无符合条件的卡带</p>
              <Link
                to="/collection/add"
                className="pixel-btn pixel-btn-primary text-xs"
              >
                添加第一张卡带
              </Link>
            </div>
          )}
        </div>
      </div>
      <BulkImportModal isOpen={showBulkImport} onClose={() => setShowBulkImport(false)} />
      <CartridgeCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        cartridges={selectedCartridges}
      />
    </div>
  );
};

export default Collection;
