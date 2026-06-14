import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import AccessoryCard from '../components/AccessoryCard';
import {
  Search,
  Plus,
  Grid,
  List,
  Filter,
  X,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import {
  getAccessoryCategoryLabel,
  getConditionLabel,
  formatPrice,
} from '../utils/format';
import type { AccessoryCategory } from '../types';

const Accessories = () => {
  const navigate = useNavigate();
  const {
    accessories,
    accessoryCategories,
    accessorySortBy,
    accessorySearch,
    accessoryFilters,
    isLoading,
    fetchAccessories,
    fetchAccessoryMetaData,
    setAccessorySortBy,
    setAccessorySearch,
    setAccessoryFilters,
  } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  const conditions = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'FAIR', 'POOR'];

  useEffect(() => {
    fetchAccessories();
    fetchAccessoryMetaData();
  }, [accessorySortBy, accessoryFilters, accessorySearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessorySearch(searchInput);
  };

  const toggleCategoryFilter = (category: AccessoryCategory) => {
    const current = accessoryFilters.category;
    const updated = current.includes(category)
      ? current.filter((v) => v !== category)
      : [...current, category];
    setAccessoryFilters({ category: updated });
  };

  const toggleConditionFilter = (condition: string) => {
    const current = accessoryFilters.condition;
    const updated = current.includes(condition)
      ? current.filter((v) => v !== condition)
      : [...current, condition];
    setAccessoryFilters({ condition: updated });
  };

  const clearAllFilters = () => {
    setAccessoryFilters({ category: [], condition: [] });
    setAccessorySearch('');
    setSearchInput('');
  };

  const sortOptions = [
    { value: 'date_desc', label: '添加时间（新到旧）' },
    { value: 'date_asc', label: '添加时间（旧到新）' },
    { value: 'price_desc', label: '价格（高到低）' },
    { value: 'price_asc', label: '价格（低到高）' },
    { value: 'name_asc', label: '名称（A-Z）' },
    { value: 'name_desc', label: '名称（Z-A）' },
  ];

  const totalValue = accessories.reduce((sum, a) => sum + a.purchasePrice * a.quantity, 0);

  const hasActiveFilters =
    accessoryFilters.category.length > 0 || accessoryFilters.condition.length > 0;

  return (
    <div className="flex">
      <div
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-darker-navy border-r-4 border-card-border z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b-2 border-card-border flex items-center justify-between lg:hidden">
          <span className="font-pixel text-sm text-neon-cyan">筛选</span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          <div className="flex items-center justify-between">
            <h3 className="font-pixel text-xs text-neon-purple flex items-center gap-2">
              <Filter className="w-4 h-4" />
              筛选器
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-neon-red hover:underline font-retro"
              >
                清除全部
              </button>
            )}
          </div>

          <div>
            <h4 className="font-retro text-lg text-gray-300 mb-2">类别</h4>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {accessoryCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={accessoryFilters.category.includes(category)}
                    onChange={() => toggleCategoryFilter(category)}
                    className="pixel-checkbox"
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors font-retro truncate">
                    {getAccessoryCategoryLabel(category)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-retro text-lg text-gray-300 mb-2">品相</h4>
            <div className="space-y-1">
              {conditions.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={accessoryFilters.condition.includes(condition)}
                    onChange={() => toggleConditionFilter(condition)}
                    className="pixel-checkbox"
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors font-retro">
                    {getConditionLabel(condition)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-pixel text-xl text-white neon-glow-purple">配件与周边</h1>
              <p className="font-retro text-gray-400 text-lg">
                共 {accessories.length} 件藏品 · 总价值 {formatPrice(totalValue)}
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

              <Link
                to="/accessories/add"
                className="pixel-btn pixel-btn-primary text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加配件
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
                    placeholder="搜索配件名称、系列、厂商、标签..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 font-retro text-lg"
                  />
                </div>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-gray-400" />
                  <select
                    value={accessorySortBy}
                    onChange={(e) => setAccessorySortBy(e.target.value)}
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
                    title="网格视图"
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
                    title="列表视图"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
            </div>
          ) : accessories.length > 0 ? (
            currentView === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {accessories.map((accessory) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {accessories.map((accessory) => (
                  <Link
                    key={accessory.id}
                    to={`/accessories/${accessory.id}`}
                    className="card-pixel p-4 rounded-lg flex items-center gap-4 group hover:border-neon-purple/50 transition-colors"
                  >
                    {accessory.coverImage ? (
                      <img
                        src={accessory.coverImage}
                        alt={accessory.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded bg-card-border flex items-center justify-center">
                        <X className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-pixel text-sm text-white group-hover:text-neon-cyan transition-colors">
                        {accessory.name}
                      </h3>
                      <p className="font-retro text-gray-400">
                        {getAccessoryCategoryLabel(accessory.category)}
                        {accessory.platform ? ` · ${accessory.platform}` : ''}
                        {accessory.manufacturer ? ` · ${accessory.manufacturer}` : ''}
                      </p>
                      {accessory.tags && accessory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {accessory.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-neon-purple/15 text-neon-purple font-retro text-[10px] rounded border border-neon-purple/25"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-sm text-neon-amber">
                        {formatPrice(accessory.purchasePrice)}
                      </p>
                      {accessory.quantity > 1 && (
                        <p className="font-retro text-xs text-gray-500">x{accessory.quantity}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <p className="font-retro text-gray-400 text-xl">暂无配件与周边</p>
              <Link to="/accessories/add" className="pixel-btn pixel-btn-primary text-xs">
                添加第一件配件</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accessories;
