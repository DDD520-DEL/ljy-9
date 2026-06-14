import { useState, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import PixelButton from '../components/PixelButton';
import {
  Heart,
  Plus,
  X,
  Trash2,
  Edit3,
  Save,
  Filter,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Star,
  Calendar,
  Search,
  Download,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '../utils/format';
import type { WishlistItem } from '../types';

const Wishlist = () => {
  const {
    wishlist,
    cartridges,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    clearWishlist,
    fetchWishlist,
    isInWishlist,
    exportWishlist,
    importWishlist,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingPriority, setEditingPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; imported: number; skipped: number; error?: string } | null>(null);

  const [newItem, setNewItem] = useState({
    cartridgeTitle: '',
    platform: '',
    coverImage: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    notes: '',
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const priorityColors: Record<string, string> = {
    HIGH: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
    MEDIUM: 'bg-neon-amber/20 text-neon-amber border-neon-amber/30',
    LOW: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  };

  const priorityLabels: Record<string, string> = {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低',
  };

  const getOwnCartridgesNotInWishlist = () => {
    return cartridges.filter(
      (c) => !isInWishlist(c.title, c.platform)
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.cartridgeTitle || !newItem.platform) return;

    addToWishlist({
      cartridgeTitle: newItem.cartridgeTitle,
      platform: newItem.platform,
      coverImage: newItem.coverImage || `https://picsum.photos/seed/${encodeURIComponent(newItem.cartridgeTitle)}/200/200`,
      priority: newItem.priority,
      notes: newItem.notes,
    });

    setShowAddModal(false);
    setNewItem({
      cartridgeTitle: '',
      platform: '',
      coverImage: '',
      priority: 'MEDIUM',
      notes: '',
    });
  };

  const handleAddFromCollection = (cartridge: any) => {
    addToWishlist({
      cartridgeTitle: cartridge.title,
      platform: cartridge.platform,
      cartridgeId: cartridge.id,
      coverImage: cartridge.coverImage,
      priority: 'MEDIUM',
    });
  };

  const handleStartEdit = (item: WishlistItem) => {
    setEditingId(item.id);
    setEditingNotes(item.notes || '');
    setEditingPriority(item.priority || 'MEDIUM');
  };

  const handleSaveEdit = (id: string) => {
    updateWishlistItem(id, {
      notes: editingNotes,
      priority: editingPriority,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNotes('');
    setEditingPriority('MEDIUM');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const result = importWishlist(text);
      setImportResult(result);
      setShowImportConfirm(false);
    };
    reader.onerror = () => {
      setImportResult({ success: false, imported: 0, skipped: 0, error: '文件读取失败' });
      setShowImportConfirm(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredWishlist = wishlist.filter((item) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !item.cartridgeTitle.toLowerCase().includes(query) &&
        !item.platform.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const priorityA = priorityOrder[a.priority || 'MEDIUM'];
    const priorityB = priorityOrder[b.priority || 'MEDIUM'];
    if (priorityA !== priorityB) return priorityA - priorityB;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const stats = {
    total: wishlist.length,
    highPriority: wishlist.filter((i) => i.priority === 'HIGH').length,
    withNotes: wishlist.filter((i) => i.notes && i.notes.trim()).length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-pixel text-2xl text-white mb-2 neon-glow-pink flex items-center gap-3">
            <Heart className="w-7 h-7 text-neon-pink fill-neon-pink" />
            我的愿望单
          </h1>
          <p className="font-retro text-gray-400 text-lg">
            记录所有想要收集的卡带，寻找心仪的宝藏
          </p>
        </div>
        <div className="flex items-center gap-3">
          {wishlist.length > 0 && (
            <PixelButton
              variant="cyan"
              onClick={exportWishlist}
            >
              <Download className="w-4 h-4 inline mr-2" />
              导出备份
            </PixelButton>
          )}
          <PixelButton
            variant="cyan"
            onClick={() => { setShowImportConfirm(true); setImportResult(null); }}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            导入恢复
          </PixelButton>
          {wishlist.length > 0 && (
            <PixelButton
              variant="danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              清空
            </PixelButton>
          )}
          <PixelButton variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 inline mr-2" />
            添加愿望
          </PixelButton>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-pixel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-neon-pink/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <p className="font-pixel text-2xl text-white">{stats.total}</p>
                <p className="font-retro text-sm text-gray-400">愿望总数</p>
              </div>
            </div>
          </div>
          <div className="card-pixel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-neon-amber/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-neon-amber" />
              </div>
              <div>
                <p className="font-pixel text-2xl text-white">{stats.highPriority}</p>
                <p className="font-retro text-sm text-gray-400">高优先级</p>
              </div>
            </div>
          </div>
          <div className="card-pixel p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <p className="font-pixel text-2xl text-white">{stats.withNotes}</p>
                <p className="font-retro text-sm text-gray-400">有备注</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-pixel p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索游戏名称或平台..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-darker-navy border-2 border-card-border rounded text-white font-retro text-sm focus:outline-none focus:border-neon-purple transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="font-retro text-sm text-gray-400">优先级:</span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 font-pixel text-xs border-2 rounded transition-all ${
                  priorityFilter === p
                    ? p === 'ALL'
                      ? 'bg-neon-purple/20 border-neon-purple text-neon-purple'
                      : priorityColors[p]
                    : 'border-card-border text-gray-400 hover:border-gray-600 hover:text-white'
                }`}
              >
                {p === 'ALL' ? '全部' : priorityLabels[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedWishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedWishlist.map((item) => (
            <div
              key={item.id}
              className={`card-pixel p-5 rounded-lg relative group hover:-translate-y-1 transition-all duration-300 ${
                item.priority === 'HIGH'
                  ? 'border-neon-pink/40 hover:border-neon-pink/70'
                  : item.priority === 'MEDIUM'
                  ? 'border-neon-amber/30 hover:border-neon-amber/60'
                  : 'border-neon-cyan/30 hover:border-neon-cyan/60'
              }`}
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-darker-navy flex-shrink-0">
                  <img
                    src={item.coverImage}
                    alt={item.cartridgeTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-pixel text-sm text-white truncate flex-1">
                      {item.cartridgeTitle}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-pixel rounded border ${
                        priorityColors[item.priority || 'MEDIUM']
                      }`}
                    >
                      {priorityLabels[item.priority || 'MEDIUM']}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-neon-purple/20 text-neon-purple text-[10px] font-pixel rounded">
                      {item.platform}
                    </span>
                    <span className="font-retro text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.addedAt)}
                    </span>
                  </div>

                  {editingId === item.id ? (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block font-pixel text-[10px] text-gray-400 mb-1">
                          优先级
                        </label>
                        <div className="flex gap-2">
                          {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setEditingPriority(p)}
                              className={`flex-1 py-1 text-[10px] font-pixel border-2 rounded transition-all ${
                                editingPriority === p
                                  ? priorityColors[p]
                                  : 'border-card-border text-gray-500 hover:border-gray-600'
                              }`}
                            >
                              {priorityLabels[p]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block font-pixel text-[10px] text-gray-400 mb-1">
                          备注
                        </label>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          rows={2}
                          placeholder="添加备注..."
                          className="w-full px-3 py-2 bg-darker-navy border-2 border-card-border rounded text-white font-retro text-xs focus:outline-none focus:border-neon-purple resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <PixelButton
                          variant="cyan"
                          size="sm"
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          <Save className="w-3 h-3 inline mr-1" />
                          保存
                        </PixelButton>
                        <PixelButton
                          variant="primary"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          取消
                        </PixelButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.notes && (
                        <p className="font-retro text-xs text-gray-400 mb-3 line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="flex items-center gap-1 px-2 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded text-neon-cyan hover:bg-neon-cyan/20 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span className="font-pixel text-[10px]">编辑</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="font-pixel text-[10px]">移除</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-pixel p-16 rounded-lg text-center">
          <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="font-pixel text-lg text-gray-400 mb-2">愿望单还是空的</h3>
          <p className="font-retro text-gray-500 mb-6">
            添加你想要但尚未拥有的卡带，在交换广场看到时会自动高亮提醒你
          </p>
          <PixelButton variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 inline mr-2" />
            添加第一个愿望
          </PixelButton>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-pixel p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-lg text-neon-pink flex items-center gap-2">
                <Heart className="w-5 h-5" />
                添加到愿望单
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {getOwnCartridgesNotInWishlist().length > 0 && (
              <div className="mb-6 p-4 bg-darker-navy rounded-lg border border-neon-cyan/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-neon-cyan" />
                  <span className="font-pixel text-xs text-neon-cyan">从藏品库快速添加</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {getOwnCartridgesNotInWishlist().slice(0, 9).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleAddFromCollection(c)}
                      className="p-2 bg-card-bg rounded border border-card-border hover:border-neon-cyan/50 transition-colors text-left group"
                    >
                      <div className="w-full aspect-square rounded overflow-hidden mb-2 bg-darker-navy">
                        <img
                          src={c.coverImage}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <p className="font-pixel text-[10px] text-white truncate">{c.title}</p>
                      <p className="font-retro text-[10px] text-gray-500">{c.platform}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-card-border pt-6">
              <p className="font-retro text-xs text-gray-400 mb-4">或者手动添加游戏信息：</p>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block font-pixel text-xs text-neon-purple mb-2">
                    游戏名称 *
                  </label>
                  <input
                    type="text"
                    value={newItem.cartridgeTitle}
                    onChange={(e) =>
                      setNewItem({ ...newItem, cartridgeTitle: e.target.value })
                    }
                    required
                    placeholder="例如：超级马里奥世界"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-pixel text-xs text-neon-purple mb-2">
                      平台 *
                    </label>
                    <input
                      type="text"
                      value={newItem.platform}
                      onChange={(e) =>
                        setNewItem({ ...newItem, platform: e.target.value })
                      }
                      required
                      placeholder="FC / SFC / GB"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-xs text-neon-purple mb-2">
                      优先级
                    </label>
                    <div className="flex gap-2 h-[42px]">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewItem({ ...newItem, priority: p })}
                          className={`flex-1 py-2 text-xs font-pixel border-2 rounded transition-all ${
                            newItem.priority === p
                              ? priorityColors[p]
                              : 'border-card-border text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {priorityLabels[p]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-pixel text-xs text-neon-purple mb-2">
                    封面图片URL（可选）
                  </label>
                  <input
                    type="url"
                    value={newItem.coverImage}
                    onChange={(e) =>
                      setNewItem({ ...newItem, coverImage: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block font-pixel text-xs text-neon-purple mb-2">
                    备注（可选）
                  </label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) =>
                      setNewItem({ ...newItem, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="期望品相、版本偏好、心理价位等..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <PixelButton
                    type="button"
                    variant="primary"
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </PixelButton>
                  <PixelButton type="submit" variant="cyan">
                    <Heart className="w-4 h-4 inline mr-1" />
                    加入愿望单
                  </PixelButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-pixel p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-pixel text-sm text-white">确认清空愿望单？</h3>
                <p className="font-retro text-xs text-gray-400">
                  此操作不可撤销，共 {wishlist.length} 个愿望将被删除
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <PixelButton
                variant="primary"
                onClick={() => setShowClearConfirm(false)}
              >
                取消
              </PixelButton>
              <PixelButton
                variant="danger"
                onClick={() => {
                  clearWishlist();
                  setShowClearConfirm(false);
                }}
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                确认清空
              </PixelButton>
            </div>
          </div>
        </div>
      )}

      {showImportConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-pixel p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h3 className="font-pixel text-sm text-white">导入愿望单备份</h3>
                <p className="font-retro text-xs text-gray-400">
                  选择之前导出的JSON文件恢复愿望单数据
                </p>
              </div>
            </div>
            <div className="p-4 bg-darker-navy rounded-lg border border-neon-cyan/20 mb-4">
              <p className="font-retro text-xs text-gray-400 mb-2">导入说明：</p>
              <ul className="font-retro text-xs text-gray-500 space-y-1">
                <li>· 仅支持本应用导出的JSON备份文件</li>
                <li>· 已存在的愿望（名称+平台相同）会自动跳过</li>
                <li>· 导入的数据会追加到当前愿望单，不会覆盖</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <PixelButton
                variant="primary"
                onClick={() => setShowImportConfirm(false)}
              >
                取消
              </PixelButton>
              <label className="pixel-btn pixel-btn-cyan cursor-pointer inline-flex items-center">
                <Upload className="w-4 h-4 inline mr-2" />
                选择文件
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {importResult && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card-pixel p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                importResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {importResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <h3 className="font-pixel text-sm text-white">
                  {importResult.success ? '导入完成' : '导入失败'}
                </h3>
                {importResult.error ? (
                  <p className="font-retro text-xs text-red-400">{importResult.error}</p>
                ) : (
                  <p className="font-retro text-xs text-gray-400">
                    成功导入 {importResult.imported} 项，跳过 {importResult.skipped} 项（已存在或格式无效）
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <PixelButton
                variant="cyan"
                onClick={() => setImportResult(null)}
              >
                确定
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
