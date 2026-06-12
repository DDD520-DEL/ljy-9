import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import { ArrowLeft, Package, BookOpen, Disc, Upload } from 'lucide-react';

const AddCartridge = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const { addCartridge, updateCartridge, selectedCartridge, fetchCartridge, platforms, seriesList, publishers } = useStore();

  const [formData, setFormData] = useState<{
    title: string;
    platform: string;
    series: string;
    publisher: string;
    releaseYear: number;
    region: 'JPN' | 'USA' | 'EUR' | 'CHN' | 'OTHER';
    condition: 'MINT' | 'NEAR_MINT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR';
    hasBox: boolean;
    hasManual: boolean;
    hasCartridge: boolean;
    purchasePrice: number;
    purchaseDate: string;
    notes: string;
    coverImage: string;
  }>({
    title: '',
    platform: '',
    series: '',
    publisher: '',
    releaseYear: 1990,
    region: 'JPN',
    condition: 'VERY_GOOD',
    hasBox: true,
    hasManual: true,
    hasCartridge: true,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
    coverImage: '',
  });

  useEffect(() => {
    if (editId) {
      fetchCartridge(editId);
    }
  }, [editId]);

  useEffect(() => {
    if (editId && selectedCartridge && selectedCartridge.id === editId) {
      setFormData({
        title: selectedCartridge.title,
        platform: selectedCartridge.platform,
        series: selectedCartridge.series,
        publisher: selectedCartridge.publisher,
        releaseYear: selectedCartridge.releaseYear,
        region: selectedCartridge.region,
        condition: selectedCartridge.condition,
        hasBox: selectedCartridge.hasBox,
        hasManual: selectedCartridge.hasManual,
        hasCartridge: selectedCartridge.hasCartridge,
        purchasePrice: selectedCartridge.purchasePrice,
        purchaseDate: selectedCartridge.purchaseDate,
        notes: selectedCartridge.notes,
        coverImage: selectedCartridge.coverImage,
      });
    }
  }, [selectedCartridge, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateCartridge(editId, formData);
    } else {
      await addCartridge(formData as any);
    }
    navigate('/collection');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const regions = [
    { value: 'JPN', label: '日版' },
    { value: 'USA', label: '美版' },
    { value: 'EUR', label: '欧版' },
    { value: 'CHN', label: '国行' },
    { value: 'OTHER', label: '其他' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate('/collection')}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors font-retro text-lg mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        返回藏品库
      </button>

      <div className="card-pixel p-6 rounded-lg">
        <h1 className="font-pixel text-xl text-white mb-6 neon-glow-purple">
          {editId ? '编辑卡带' : '添加卡带'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-pixel text-xs text-neon-cyan mb-2">
              游戏名称 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="例如：超级马里奥兄弟"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                平台 *
              </label>
              <select name="platform" value={formData.platform} onChange={handleChange} required>
                <option value="">选择平台</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="Other">其他</option>
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                系列
              </label>
              <select name="series" value={formData.series} onChange={handleChange}>
                <option value="">选择系列</option>
                {seriesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Other">其他</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                发行商
              </label>
              <select name="publisher" value={formData.publisher} onChange={handleChange}>
                <option value="">选择发行商</option>
                {publishers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="Other">其他</option>
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                发行年份
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                min="1970"
                max="2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                区域版本
              </label>
              <select name="region" value={formData.region} onChange={handleChange}>
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-neon-cyan mb-2">
                品相评级
              </label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                {conditions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-pixel p-4 rounded-lg">
            <h3 className="font-pixel text-xs text-neon-pink mb-4">收藏完整性</h3>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center border-3 transition-colors ${
                    formData.hasCartridge
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  }`}
                >
                  <Disc className="w-8 h-8" />
                </div>
                <span className="font-retro text-sm text-gray-400">卡带本体</span>
                <input
                  type="checkbox"
                  name="hasCartridge"
                  checked={formData.hasCartridge}
                  onChange={handleChange}
                  className="pixel-checkbox"
                />
              </label>
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center border-3 transition-colors ${
                    formData.hasBox
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  }`}
                >
                  <Package className="w-8 h-8" />
                </div>
                <span className="font-retro text-sm text-gray-400">包装盒</span>
                <input
                  type="checkbox"
                  name="hasBox"
                  checked={formData.hasBox}
                  onChange={handleChange}
                  className="pixel-checkbox"
                />
              </label>
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center border-3 transition-colors ${
                    formData.hasManual
                      ? 'bg-neon-green/20 border-neon-green text-neon-green'
                      : 'bg-gray-800 border-gray-700 text-gray-600'
                  }`}
                >
                  <BookOpen className="w-8 h-8" />
                </div>
                <span className="font-retro text-sm text-gray-400">说明书</span>
                <input
                  type="checkbox"
                  name="hasManual"
                  checked={formData.hasManual}
                  onChange={handleChange}
                  className="pixel-checkbox"
                />
              </label>
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
              placeholder="记录一些关于这张卡带的故事..."
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <PixelButton
              variant="primary"
              type="button"
              onClick={() => navigate('/collection')}
            >
              取消
            </PixelButton>
            <PixelButton variant="cyan" type="submit">
              {editId ? '保存修改' : '添加卡带'}
            </PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCartridge;
