import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { X, Download, Loader2 } from 'lucide-react';
import { formatPrice, getConditionLabel, getConditionColor, getRegionLabel, sanitizeFilename } from '../utils/format';
import type { Cartridge } from '../types';

interface ShareCardModalProps {
  cartridge: Cartridge;
  onClose: () => void;
}

const ShareCardModal = ({ cartridge, onClose }: ShareCardModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const conditionColorMap: Record<string, string> = {
    MINT: '#10b981',
    NEAR_MINT: '#06b6d4',
    VERY_GOOD: '#f59e0b',
    GOOD: '#f97316',
    FAIR: '#ea580c',
    POOR: '#ef4444',
  };

  const conditionColor = conditionColorMap[cartridge.condition] || '#9ca3af';
  const marketPrice = Math.round(cartridge.purchasePrice * 1.2);

  const handleSaveImage = async () => {
    if (!cardRef.current || isGenerating) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0e1a',
        logging: false,
      });

      const link = document.createElement('a');
      const safeTitle = sanitizeFilename(cartridge.title);
      link.download = `${safeTitle}_分享卡片.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成分享卡片失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-sm text-neon-cyan">分享收藏卡片</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div ref={cardRef} style={{ width: 380, padding: 24, background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)', border: '3px solid #374151', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899)' }} />

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 140, height: 140, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: '#0a0e1a' }}>
                <img
                  src={cartridge.coverImage}
                  alt={cartridge.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 13, color: '#fff', marginBottom: 8, lineHeight: 1.4, wordBreak: 'break-all' }}>
                  {cartridge.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ padding: '2px 8px', background: 'rgba(139,92,246,0.2)', color: '#8b5cf6', fontFamily: '"Press Start 2P", cursive', fontSize: 10, borderRadius: 4, border: '1px solid rgba(139,92,246,0.3)' }}>
                    {cartridge.platform}
                  </span>
                  <span style={{ padding: '2px 8px', background: 'rgba(139,92,246,0.2)', color: '#8b5cf6', fontFamily: '"Press Start 2P", cursive', fontSize: 10, borderRadius: 4, border: '1px solid rgba(139,92,246,0.3)' }}>
                    {getRegionLabel(cartridge.region)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: conditionColor, boxShadow: `0 0 8px ${conditionColor}` }} />
                  <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 10, color: conditionColor }}>
                    {getConditionLabel(cartridge.condition)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(5,7,13,0.6)', borderRadius: 8, border: '1px solid rgba(55,65,81,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#9ca3af', marginBottom: 2 }}>
                    市场参考价
                  </p>
                  <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 18, color: '#f59e0b', textShadow: '0 0 10px rgba(245,158,11,0.6)' }}>
                    {formatPrice(marketPrice)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#9ca3af', marginBottom: 2 }}>
                    购入价格
                  </p>
                  <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 14, color: '#06b6d4' }}>
                    {formatPrice(cartridge.purchasePrice)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#6b7280' }}>
                🎮 RetroVault
              </span>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#374151' }}>
                |
              </span>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#6b7280' }}>
                复古卡带收藏管理
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleSaveImage}
            disabled={isGenerating}
            className="pixel-btn pixel-btn-cyan text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                保存图片
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-primary text-xs"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCardModal;
