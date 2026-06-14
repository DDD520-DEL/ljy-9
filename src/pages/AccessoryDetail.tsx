import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  Plus,
  X,
  Shield,
  Star,
  Package,
  Hash,
  AlertTriangle,
} from 'lucide-react';
import {
  formatPrice,
  formatDate,
  getConditionLabel,
  getConditionColor,
  getAccessoryCategoryLabel,
  getAccessoryCategoryColor,
} from '../utils/format';

const AccessoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedAccessory,
    fetchAccessory,
    updateAccessory,
    deleteAccessory,
    getPresetTags,
  } = useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const presetTags = getPresetTags();

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim();
    if (!tag || !id || !selectedAccessory) return;
    if (selectedAccessory.tags.includes(tag)) return;
    const newTags = [...selectedAccessory.tags, tag];
    updateAccessory(id, { tags: newTags });
    setTagInput('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!id || !selectedAccessory) return;
    const newTags = selectedAccessory.tags.filter((t) => t !== tagToRemove);
    await updateAccessory(id, { tags: newTags });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccessory(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (id) {
      const success = await deleteAccessory(id);
      if (success) {
        navigate('/accessories');
      }
    }
  };

  if (!selectedAccessory) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="h-64 flex items-center justify-center">
          <p className="font-retro text-gray-400 text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/accessories')}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-retro text-lg mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        返回配件库
      </button>

      <div className="card-pixel p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="aspect-square rounded-lg overflow-hidden bg-darker-navy border-2 border-card-border">
              {selectedAccessory.coverImage ? (
                <img
                  src={selectedAccessory.coverImage}
                  alt={selectedAccessory.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded font-pixel text-xs border ${getAccessoryCategoryColor(
                  selectedAccessory.category
                )}`}
              >
                {getAccessoryCategoryLabel(selectedAccessory.category)}
              </div>

              {selectedAccessory.isLimitedEdition && (
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded font-pixel text-xs bg-neon-pink/20 text-neon-pink border border-neon-pink/30 ml-2">
                  <Star className="w-3 h-3 fill-current" />
                  限定特典
                  {selectedAccessory.editionNumber && (
                    <span className="ml-1">({selectedAccessory.editionNumber})</span>
                  )}
                </div>
              )}

              {selectedAccessory.isOfficial && (
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded font-pixel text-xs bg-neon-green/20 text-neon-green border border-neon-green/30 ml-2">
                  <Shield className="w-3 h-3" />
                  官方正品
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-purple">
                  {selectedAccessory.name}
                </h1>
                <p className="font-retro text-gray-400 text-lg">
                  {selectedAccessory.platform || '多平台'}
                  {selectedAccessory.series ? ` · ${selectedAccessory.series}` : ''}
                  {selectedAccessory.manufacturer ? ` · ${selectedAccessory.manufacturer}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/accessories/add?id=${id}`)}
                  className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="pixel-btn pixel-btn-primary text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card-pixel p-4 rounded">
                <p className="font-retro text-gray-400 text-sm mb-1">购入价格</p>
                <p className="font-pixel text-lg text-neon-amber">
                  {formatPrice(selectedAccessory.purchasePrice)}
                </p>
              </div>
              <div className="card-pixel p-4 rounded">
                <p className="font-retro text-gray-400 text-sm mb-1">品相评级</p>
                <p className={`font-pixel text-lg ${getConditionColor(selectedAccessory.condition)}`}>
                  {getConditionLabel(selectedAccessory.condition)}
                </p>
              </div>
              <div className="card-pixel p-4 rounded">
                <p className="font-retro text-gray-400 text-sm mb-1 flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  数量
                </p>
                <p className="font-pixel text-lg text-neon-purple">
                  x{selectedAccessory.quantity}
                </p>
              </div>
              <div className="card-pixel p-4 rounded">
                <p className="font-retro text-gray-400 text-sm mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  购入日期
                </p>
                <p className="font-retro text-base text-white">
                  {formatDate(selectedAccessory.purchaseDate)}
                </p>
              </div>
              {selectedAccessory.releaseYear && (
                <div className="card-pixel p-4 rounded">
                  <p className="font-retro text-gray-400 text-sm mb-1">发行年份</p>
                  <p className="font-pixel text-lg text-white">
                    {selectedAccessory.releaseYear}
                  </p>
                </div>
              )}
            </div>

            {selectedAccessory.notes && (
              <div className="card-pixel p-4 rounded">
                <h3 className="font-pixel text-sm text-neon-cyan mb-3">备注</h3>
                <p className="font-retro text-gray-300 whitespace-pre-wrap">
                  {selectedAccessory.notes}
                </p>
              </div>
            )}

            <div className="card-pixel p-4 rounded">
              <h3 className="font-pixel text-sm text-neon-purple mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签管理
              </h3>

              {selectedAccessory.tags && selectedAccessory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedAccessory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-neon-purple/20 text-neon-purple font-retro text-sm rounded border border-neon-purple/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-neon-pink transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="输入标签后按回车添加..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              <div>
                <p className="font-retro text-sm text-gray-500 mb-2">
                  💡 推荐标签（点击添加）：
                </p>
                <div className="flex flex-wrap gap-2">
                  {presetTags
                    .filter((t) => !selectedAccessory.tags?.includes(t))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-2 py-1 font-retro text-xs bg-darker-navy border border-card-border rounded text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="card-pixel p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-neon-red/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-neon-red" />
              </div>
              <div>
                <h3 className="font-pixel text-base text-white">确认删除</h3>
                <p className="font-retro text-sm text-gray-400">此操作不可撤销</p>
              </div>
            </div>
            <p className="font-retro text-gray-300 mb-6">
              确定要删除「
              <span className="text-neon-pink">{selectedAccessory.name}</span>
              」吗？所有相关数据将被永久删除。
            </p>
            <div className="flex gap-3 justify-end">
              <PixelButton
                variant="primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
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

export default AccessoryDetail;
