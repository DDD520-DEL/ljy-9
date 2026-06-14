import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import {
  ArrowLeft,
  Tag,
  X,
  Plus,
  Shield,
  Star,
  Package,
  Hash,
} from 'lucide-react';
import type { Accessory, AccessoryCategory } from '../types';
import { getAccessoryCategoryLabel } from '../utils/format';

type AccessoryFormData = Omit<Accessory, 'id' | 'createdAt' | 'updatedAt'>;

const AddAccessory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const {
    addAccessory,
    updateAccessory,
    selectedAccessory,
    fetchAccessory,
    accessoryCategories,
    platforms,
    seriesList,
    fetchAccessoryMetaData,
  } = useStore();

  const [formData, setFormData] = useState<AccessoryFormData>({
    name: '',
    category: 'OTHER' as AccessoryCategory,
    platform: '',
    series: '',
    manufacturer: '',
    condition: 'VERY_GOOD',
    isOfficial: true,
    isLimitedEdition: false,
    editionNumber: '',
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    releaseYear: undefined,
    quantity: 1,
    coverImage: '',
    notes: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchAccessoryMetaData();
  }, []);

  useEffect(() => {
    if (editId) {
      fetchAccessory(editId);
    }
  }, [editId]);

  useEffect(() => {
    if (editId && selectedAccessory && selectedAccessory.id === editId) {
      setFormData({
        name: selectedAccessory.name,
        category: selectedAccessory.category,
        platform: selectedAccessory.platform || '',
        series: selectedAccessory.series || '',
        manufacturer: selectedAccessory.manufacturer || '',
        condition: selectedAccessory.condition,
        isOfficial: selectedAccessory.isOfficial,
        isLimitedEdition: selectedAccessory.isLimitedEdition,
        editionNumber: selectedAccessory.editionNumber || '',
        purchasePrice: selectedAccessory.purchasePrice,
        purchaseDate: selectedAccessory.purchaseDate,
        releaseYear: selectedAccessory.releaseYear,
        quantity: selectedAccessory.quantity,
        coverImage: selectedAccessory.coverImage,
        notes: selectedAccessory.notes,
        tags: selectedAccessory.tags || [],
      });
    }
  }, [selectedAccessory, editId]);

  const { getPresetTags } = useStore();
  const presetTags = getPresetTags();

  const addTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim();
    if (!tag) return;
    if (formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateAccessory(editId, formData);
    } else {
      await addAccessory(formData);
    }
    navigate('/accessories');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const conditions = [
    { value: 'MINT', label: '全新 (MINT)' },
    { value: 'NEAR_MINT', label: '近新 (Near Mint)' },
    { value: 'VERY_GOOD', label: '很好 (Very Good)' },
    { value: 'GOOD', label: '良好 (Good)' },
    { value: 'FAIR', label: '一般 (Fair)' },
    { value: 'POOR', label: '较差 (Poor)' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/accessories')}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-retro text-lg mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        返回配件库
      </button>

      <div className="card-pixel p-6 rounded-lg">
        <h1 className="font-pixel text-xl text-white mb-6 neon-glow-purple">
          {editId ? '编辑配件' : '添加配件与周边'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-pixel text-xs text-neon-cyan mb-2">
              名称 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="例如：FC 原装手柄"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                类别 *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {accessoryCategories.map((c) => (
                  <option key={c} value={c}>
                    {getAccessoryCategoryLabel(c)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                品相评级
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                {conditions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                关联平台
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="">无关联平台</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                关联系列
              </label>
              <select
                name="series"
                value={formData.series}
                onChange={handleChange}
              >
                <option value="">无关联系列</option>
                {seriesList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                制造商/发行商
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="例如：任天堂"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                购入价格 (元)
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                购入日期
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                发行年份
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    releaseYear: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                min="1970"
                max="2030"
                placeholder="可选"
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                数量
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="card-pixel p-4 rounded-lg">
            <h3 className="font-pixel text-xs text-neon-pink mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              属性标记
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border-3 transition-colors ${
                    formData.isOfficial
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  }`}
                >
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-retro text-sm text-white block">
                    官方正品
                  </span>
                  <span className="font-retro text-xs text-gray-500">
                    原厂出品，非第三方
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isOfficial"
                  checked={formData.isOfficial}
                  onChange={handleChange}
                  className="pixel-checkbox ml-auto"
                />
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border-3 transition-colors ${
                    formData.isLimitedEdition
                      ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  }`}
                >
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-retro text-sm text-white block">
                    限定/特典版
                  </span>
                  <span className="font-retro text-xs text-gray-500">
                    限量发行或特殊版本
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isLimitedEdition"
                  checked={formData.isLimitedEdition}
                  onChange={handleChange}
                  className="pixel-checkbox ml-auto"
                />
              </label>
            </div>
          </div>

          {formData.isLimitedEdition && (
            <div>
              <label className="block font-pixel text-xs text-neon-pink mb-2">
                限定编号 (可选)
              </label>
              <input
                type="text"
                name="editionNumber"
                value={formData.editionNumber}
                onChange={handleChange}
                placeholder="例如：0872/1500"
              />
            </div>
          )}

          <div>
            <label className="block font-pixel text-xs text-neon-cyan mb-2">
              封面图片 URL
            </label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="输入图片链接（可选）"
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-neon-cyan mb-2">
              备注
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="记录一些关于这件配件的故事..."
            />
          </div>

          <div className="card-pixel p-4 rounded-lg">
            <h3 className="font-pixel text-xs text-neon-purple mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              自定义标签
            </h3>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neon-purple/20 text-neon-purple font-retro text-sm rounded border border-neon-purple/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-neon-pink transition-colors ml-1"
                      title="移除标签"
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
                onClick={() => addTag()}
                className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-1 whitespace-nowrap"
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
                  .filter((t) => !formData.tags.includes(t))
                  .slice(0, 12)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 font-retro text-xs bg-darker-navy border border-card-border rounded text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <PixelButton
              variant="primary"
              type="button"
              onClick={() => navigate('/accessories')}
            >
              取消
            </PixelButton>
            <PixelButton variant="cyan" type="submit">
              {editId ? '保存修改' : '添加配件'}
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccessory;
