import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import Sidebar from '../components/Sidebar';
import CartridgeCard from '../components/CartridgeCard';
import { Filter, Grid, List, Plus, Search, SortAsc, FileText, Download, Loader2 } from 'lucide-react';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

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
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden pixel-btn pixel-btn-cyan text-xs flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>

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

              <Link
                to="/collection/add"
                className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加卡带
              </Link>
            </div>
          </div>

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
                  <CartridgeCard key={cartridge.id} cartridge={cartridge} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cartridges.map((cartridge) => (
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
                    <div className="flex-1">
                      <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors">
                        {cartridge.title}
                      </h3>
                      <p className="font-retro text-gray-400">
                        {cartridge.platform} · {cartridge.series} · {cartridge.releaseYear}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-sm text-neon-amber">
                        ¥{cartridge.purchasePrice.toLocaleString()}
                      </p>
                    </div>
                  </Link>
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
    </div>
  );
};

export default Collection;
