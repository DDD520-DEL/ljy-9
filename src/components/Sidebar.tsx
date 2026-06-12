import { useStore } from '../stores/useStore';
import { getConditionLabel } from '../utils/format';
import { X, Filter } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { filters, setFilters, platforms, seriesList, publishers } = useStore();

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const current = filters[category] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ [category]: updated });
  };

  const clearAllFilters = () => {
    setFilters({
      platform: [],
      series: [],
      publisher: [],
      condition: [],
      search: '',
    });
  };

  const conditions = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];

  const hasActiveFilters =
    filters.platform.length > 0 ||
    filters.series.length > 0 ||
    filters.publisher.length > 0 ||
    filters.condition.length > 0;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-darker-navy border-r-4 border-card-border z-50 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b-2 border-card-border flex items-center justify-between lg:hidden">
          <span className="font-pixel text-sm text-neon-cyan">筛选</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
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
            <h4 className="font-retro text-lg text-gray-300 mb-2">平台</h4>
            <div className="space-y-1">
              {platforms.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.platform.includes(platform)}
                    onChange={() => toggleFilter('platform', platform)}
                    className="pixel-checkbox"
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors font-retro">
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-retro text-lg text-gray-300 mb-2">系列</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {seriesList.map((series) => (
                <label
                  key={series}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.series.includes(series)}
                    onChange={() => toggleFilter('series', series)}
                    className="pixel-checkbox"
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors font-retro truncate">
                    {series}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-retro text-lg text-gray-300 mb-2">发行商</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {publishers.map((publisher) => (
                <label
                  key={publisher}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.publisher.includes(publisher)}
                    onChange={() => toggleFilter('publisher', publisher)}
                    className="pixel-checkbox"
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors font-retro truncate">
                    {publisher}
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
                    checked={filters.condition.includes(condition)}
                    onChange={() => toggleFilter('condition', condition)}
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
      </aside>
    </>
  );
};

export default Sidebar;
