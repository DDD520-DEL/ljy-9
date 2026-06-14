import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import PriceChart from '../components/PriceChart';
import PixelButton from '../components/PixelButton';
import {
  ArrowLeft,
  Package,
  BookOpen,
  Disc,
  Calendar,
  MapPin,
  Tag,
  Edit3,
  Trash2,
  TrendingUp,
  Plus,
  X,
  Hash,
} from 'lucide-react';
import {
  formatPrice,
  formatDate,
  getConditionLabel,
  getConditionColor,
  getRegionLabel,
} from '../utils/format';

const CartridgeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedCartridge,
    priceHistory,
    fetchCartridge,
    fetchPriceHistory,
    deleteCartridge,
    addTagToCartridge,
    removeTagFromCartridge,
    getPresetTags,
  } = useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const presetTags = getPresetTags();

  const handleAddTag = async (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim();
    if (!tag || !id) return;
    setIsAddingTag(true);
    const success = await addTagToCartridge(id, tag);
    if (success) {
      setTagInput('');
      await fetchCartridge(id);
    }
    setIsAddingTag(false);
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!id) return;
    setIsAddingTag(true);
    const success = await removeTagFromCartridge(id, tagToRemove);
    if (success) {
      await fetchCartridge(id);
    }
    setIsAddingTag(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    if (id) {
      fetchCartridge(id);
      fetchPriceHistory(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteCartridge(id);
      if (success) {
        navigate('/collection');
      }
    }
  };

  if (!selectedCartridge) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="h-64 flex items-center justify-center">
          <p className="font-retro text-gray-400 text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  const isCompleteInBox =
    selectedCartridge.hasBox && selectedCartridge.hasManual && selectedCartridge.hasCartridge;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        to="/collection"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-retro text-lg mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        返回藏品库
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="card-pixel p-4 rounded-lg">
            <img
              src={selectedCartridge.coverImage}
              alt={selectedCartridge.title}
              className="w-full aspect-square object-cover rounded mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple font-pixel text-xs rounded">
                  {selectedCartridge.platform}
                </span>
                {isCompleteInBox && (
                  <span className="px-3 py-1 bg-neon-green/20 text-neon-green font-pixel text-xs rounded flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    箱说全
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-cyan">
              {selectedCartridge.title}
            </h1>
            <p className="font-retro text-gray-400 text-xl">
              {selectedCartridge.series} · {selectedCartridge.publisher}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card-pixel p-4 rounded-lg">
              <p className="font-retro text-gray-400 mb-1">购入价格</p>
              <p className="font-pixel text-lg text-neon-amber">
                {formatPrice(selectedCartridge.purchasePrice)}
              </p>
            </div>
            <div className="card-pixel p-4 rounded-lg">
              <p className="font-retro text-gray-400 mb-1">品相评级</p>
              <p className={`font-pixel text-lg ${getConditionColor(selectedCartridge.condition)}`}>
                {getConditionLabel(selectedCartridge.condition)}
              </p>
            </div>
          </div>

          <div className="card-pixel p-5 rounded-lg">
            <h3 className="font-pixel text-sm text-neon-purple mb-4">基本信息</h3>
            <div className="grid grid-cols-2 gap-4 font-retro text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">发行年份：</span>
                <span className="text-white">{selectedCartridge.releaseYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">区域版本：</span>
                <span className="text-white">{getRegionLabel(selectedCartridge.region)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">发行商：</span>
                <span className="text-white">{selectedCartridge.publisher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400">系列：</span>
                <span className="text-white">{selectedCartridge.series}</span>
              </div>
            </div>
          </div>

          <div className="card-pixel p-5 rounded-lg">
            <h3 className="font-pixel text-sm text-neon-cyan mb-4">收藏完整性</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                    selectedCartridge.hasCartridge
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  <Disc className="w-8 h-8" />
                </div>
                <p className="font-retro text-sm text-gray-400">卡带本体</p>
              </div>
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                    selectedCartridge.hasBox
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  <Package className="w-8 h-8" />
                </div>
                <p className="font-retro text-sm text-gray-400">包装盒</p>
              </div>
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                    selectedCartridge.hasManual
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="font-retro text-sm text-gray-400">说明书</p>
              </div>
            </div>
          </div>

          <div className="card-pixel p-5 rounded-lg">
            <h3 className="font-pixel text-sm text-neon-purple mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              自定义标签
            </h3>

            {(selectedCartridge.tags && selectedCartridge.tags.length > 0) ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCartridge.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neon-purple/20 text-neon-purple font-retro rounded border border-neon-purple/30"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isAddingTag}
                      className="hover:text-neon-pink transition-colors ml-1 disabled:opacity-50"
                      title="移除标签"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-retro text-gray-500 text-lg mb-4">暂无标签，添加一些来更好地分类你的藏品吧！</p>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="输入标签后按回车添加..."
                disabled={isAddingTag}
                className="flex-1"
              />
              <button
                onClick={() => handleAddTag()}
                disabled={isAddingTag || !tagInput.trim()}
                className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>

            <div>
              <p className="font-retro text-sm text-gray-500 mb-2">💡 快捷添加：</p>
              <div className="flex flex-wrap gap-2">
                {presetTags
                  .filter((t) => !selectedCartridge.tags?.includes(t))
                  .slice(0, 10)
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      disabled={isAddingTag}
                      className="px-2 py-1 font-retro text-xs bg-darker-navy border border-card-border rounded text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors disabled:opacity-50"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {selectedCartridge.notes && (
            <div className="card-pixel p-5 rounded-lg">
              <h3 className="font-pixel text-sm text-neon-pink mb-3">备注</h3>
              <p className="font-retro text-gray-300 text-lg">{selectedCartridge.notes}</p>
            </div>
          )}

          <div className="flex gap-3">
            <PixelButton variant="cyan" onClick={() => navigate(`/collection/add?id=${id}`)}>
              <Edit3 className="w-4 h-4 inline mr-2" />
              编辑
            </PixelButton>
            <PixelButton
              variant="pink"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              删除
            </PixelButton>
          </div>
        </div>
      </div>

      <div className="card-pixel p-6 rounded-lg">
        <h2 className="font-pixel text-sm text-neon-cyan mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          价格走势
        </h2>
        {priceHistory.length > 0 ? (
          <PriceChart priceHistory={priceHistory} height={300} />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 font-retro">
            暂无价格数据
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card-pixel p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="font-pixel text-lg text-neon-red mb-4">确认删除</h3>
            <p className="font-retro text-gray-300 mb-6">
              确定要删除「{selectedCartridge.title}」吗？此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <PixelButton variant="primary" onClick={() => setShowDeleteConfirm(false)}>
                取消
              </PixelButton>
              <PixelButton variant="pink" onClick={handleDelete}>
                确认删除
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartridgeDetail;
