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
  const { selectedCartridge, priceHistory, fetchCartridge, fetchPriceHistory, deleteCartridge } =
    useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
