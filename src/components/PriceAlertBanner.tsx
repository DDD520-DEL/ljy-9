import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { AlertTriangle, TrendingUp, TrendingDown, X, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { formatPrice } from '../utils/format';
import type { PriceAlert } from '../types';

const PriceAlertBanner = () => {
  const { priceAlerts, priceAlertSettings, fetchPriceAlerts, fetchPriceAlertSettings, updatePriceAlertSettings } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localThreshold, setLocalThreshold] = useState(20);

  useEffect(() => {
    fetchPriceAlerts();
    fetchPriceAlertSettings();
  }, []);

  useEffect(() => {
    if (priceAlertSettings) {
      setLocalThreshold(priceAlertSettings.threshold);
    }
  }, [priceAlertSettings]);

  useEffect(() => {
    if (priceAlerts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % priceAlerts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [priceAlerts.length]);

  if (isDismissed || priceAlerts.length === 0) {
    return null;
  }

  const currentAlert = priceAlerts[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + priceAlerts.length) % priceAlerts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % priceAlerts.length);
  };

  const handleSaveThreshold = async () => {
    await updatePriceAlertSettings({ threshold: localThreshold });
    await fetchPriceAlerts();
    setCurrentIndex(0);
    setShowSettings(false);
  };

  const renderAlertContent = (alert: PriceAlert) => {
    const isUp = alert.direction === 'UP';

    return (
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isUp ? 'bg-neon-green/20' : 'bg-neon-red/20'
          }`}
        >
          {isUp ? (
            <TrendingUp className="w-5 h-5 text-neon-green" />
          ) : (
            <TrendingDown className="w-5 h-5 text-neon-red" />
          )}
        </div>

        <img
          src={alert.coverImage}
          alt={alert.cartridgeTitle}
          className="w-10 h-10 rounded object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-pixel text-sm text-white">
              {alert.cartridgeTitle}
            </span>
            <span className="px-2 py-0.5 bg-card-border/50 rounded text-xs font-retro text-gray-300">
              {alert.cartridgePlatform}
            </span>
          </div>
          <p className="font-retro text-sm text-gray-300 mt-0.5">
            近{alert.days}天均价
            <span className={isUp ? 'text-neon-green' : 'text-neon-red'}>
              {' '}
              {isUp ? '上涨' : '下跌'}{' '}
              {Math.abs(alert.priceChangePercent).toFixed(1)}%
            </span>
            ，当前市场价约 <span className="text-neon-amber">{formatPrice(alert.currentPrice)}</span>
          </p>
        </div>

        <Link
          to={`/collection/${alert.cartridgeId}`}
          className="pixel-btn pixel-btn-primary text-xs flex-shrink-0"
        >
          查看详情
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-purple/10 border border-neon-purple/30 rounded-lg p-4 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.03)_25%,rgba(139,92,246,0.03)_50%,transparent_50%,transparent_75%,rgba(139,92,246,0.03)_75%)] bg-[length:20px_20px] animate-[shimmer_3s_linear_infinite]" />

        <div className="relative flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-neon-amber/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-neon-amber animate-pulse" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-pixel text-sm text-neon-amber">价格异动提醒</p>
              <span className="px-2 py-0.5 bg-neon-amber/20 rounded text-xs font-retro text-neon-amber">
                {priceAlerts.length} 条提醒
              </span>
            </div>

            <div className="relative">
              {priceAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  {renderAlertContent(alert)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {priceAlerts.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-lg bg-card/50 hover:bg-card flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {priceAlerts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-neon-purple w-4'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-lg bg-card/50 hover:bg-card flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 rounded-lg bg-card/50 hover:bg-card flex items-center justify-center text-gray-400 hover:text-neon-cyan transition-colors"
              title="设置阈值"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="w-8 h-8 rounded-lg bg-card/50 hover:bg-card flex items-center justify-center text-gray-400 hover:text-neon-red transition-colors"
              title="关闭提醒"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="card-pixel p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="font-pixel text-lg text-neon-cyan mb-4">价格提醒设置</h3>

            <div className="mb-6">
              <label className="font-retro text-gray-300 text-sm mb-2 block">
                价格波动阈值（%）
              </label>
              <p className="font-retro text-gray-500 text-xs mb-3">
                当近30天均价波动超过此值时触发提醒
              </p>
              <input
                type="range"
                min="1"
                max="100"
                value={localThreshold}
                onChange={(e) => setLocalThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-card-border rounded-lg appearance-none cursor-pointer accent-neon-purple"
              />
              <div className="flex justify-between mt-2">
                <span className="font-retro text-xs text-gray-500">1%</span>
                <span className="font-pixel text-neon-purple">{localThreshold}%</span>
                <span className="font-retro text-xs text-gray-500">100%</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setLocalThreshold(priceAlertSettings?.threshold || 20);
                  setShowSettings(false);
                }}
                className="pixel-btn pixel-btn-primary text-xs"
              >
                取消
              </button>
              <button
                onClick={handleSaveThreshold}
                className="pixel-btn pixel-btn-cyan text-xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceAlertBanner;
