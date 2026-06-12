import { useEffect } from 'react';
import type { Cartridge } from '../types';
import { formatPrice, getConditionLabel, getConditionColor, getRegionLabel, formatDate } from '../utils/format';
import { X, Check, Minus, ArrowUpDown, TrendingUp } from 'lucide-react';

interface CartridgeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartridges: Cartridge[];
}

interface AttrRow {
  key: string;
  label: string;
  icon?: React.ReactNode;
  render: (c: Cartridge) => React.ReactNode;
  isNumeric?: boolean;
  isBoolean?: boolean;
  getValue?: (c: Cartridge) => string | number | boolean;
}

const CartridgeCompareModal = ({ isOpen, onClose, cartridges }: CartridgeCompareModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const areDifferent = (values: (string | number | boolean)[]) => {
    return new Set(values).size > 1;
  };

  const getBestIndex = (values: number[], higherIsBetter = true) => {
    if (values.length === 0) return -1;
    const target = higherIsBetter ? Math.max(...values) : Math.min(...values);
    return values.indexOf(target);
  };

  const attrRows: AttrRow[] = [
    {
      key: 'platform',
      label: '游戏平台',
      render: (c) => c.platform,
      getValue: (c) => c.platform,
    },
    {
      key: 'series',
      label: '所属系列',
      render: (c) => c.series || '—',
      getValue: (c) => c.series || '',
    },
    {
      key: 'publisher',
      label: '发行商',
      render: (c) => c.publisher || '—',
      getValue: (c) => c.publisher || '',
    },
    {
      key: 'releaseYear',
      label: '发行年份',
      icon: <TrendingUp className="w-4 h-4" />,
      render: (c) => c.releaseYear,
      getValue: (c) => c.releaseYear,
      isNumeric: true,
    },
    {
      key: 'region',
      label: '发行地区',
      render: (c) => getRegionLabel(c.region),
      getValue: (c) => c.region,
    },
    {
      key: 'condition',
      label: '品相评级',
      render: (c) => (
        <span className={getConditionColor(c.condition)}>
          {getConditionLabel(c.condition)}
        </span>
      ),
      getValue: (c) => c.condition,
    },
    {
      key: 'hasBox',
      label: '包装盒',
      isBoolean: true,
      render: (c) =>
        c.hasBox ? (
          <span className="text-neon-green flex items-center gap-1 justify-center">
            <Check className="w-4 h-4" /> 有
          </span>
        ) : (
          <span className="text-neon-red flex items-center gap-1 justify-center">
            <Minus className="w-4 h-4" /> 无
          </span>
        ),
      getValue: (c) => c.hasBox,
    },
    {
      key: 'hasManual',
      label: '说明书',
      isBoolean: true,
      render: (c) =>
        c.hasManual ? (
          <span className="text-neon-green flex items-center gap-1 justify-center">
            <Check className="w-4 h-4" /> 有
          </span>
        ) : (
          <span className="text-neon-red flex items-center gap-1 justify-center">
            <Minus className="w-4 h-4" /> 无
          </span>
        ),
      getValue: (c) => c.hasManual,
    },
    {
      key: 'hasCartridge',
      label: '卡带本体',
      isBoolean: true,
      render: (c) =>
        c.hasCartridge ? (
          <span className="text-neon-green flex items-center gap-1 justify-center">
            <Check className="w-4 h-4" /> 有
          </span>
        ) : (
          <span className="text-neon-red flex items-center gap-1 justify-center">
            <Minus className="w-4 h-4" /> 无
          </span>
        ),
      getValue: (c) => c.hasCartridge,
    },
    {
      key: 'purchasePrice',
      label: '购入价格',
      icon: <ArrowUpDown className="w-4 h-4" />,
      render: (c) => <span className="text-neon-amber font-pixel">{formatPrice(c.purchasePrice)}</span>,
      getValue: (c) => c.purchasePrice,
      isNumeric: true,
    },
    {
      key: 'purchaseDate',
      label: '购入日期',
      render: (c) => formatDate(c.purchaseDate),
      getValue: (c) => c.purchaseDate,
    },
  ];

  const numericValues = (key: string) =>
    cartridges.map((c) => {
      const row = attrRows.find((r) => r.key === key);
      return (row?.getValue?.(c) as number) ?? 0;
    });

  const generalValues = (key: string) =>
    cartridges.map((c) => {
      const row = attrRows.find((r) => r.key === key);
      return row?.getValue?.(c) ?? '';
    });

  const gridCols = cartridges.length;
  const colSpanClass =
    gridCols === 1
      ? 'grid-cols-2'
      : gridCols === 2
      ? 'grid-cols-3'
      : gridCols === 3
      ? 'grid-cols-4'
      : 'grid-cols-5';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="card-pixel rounded-lg w-full max-w-[1400px] my-8 animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b-4 border-card-border bg-inherit rounded-t-lg">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-6 h-6 text-neon-cyan" />
            <h2 className="font-pixel text-lg text-white neon-glow-cyan">卡带对比</h2>
            <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple font-retro text-sm rounded">
              {cartridges.length} 张
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-card-border transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className={`grid ${colSpanClass} gap-4 mb-2`}>
            <div className="p-3 font-pixel text-xs text-gray-500 flex items-center">
              属性
            </div>
            {cartridges.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-2 p-3 card-pixel rounded-lg border-2 border-card-border">
                <div className="w-full aspect-square rounded overflow-hidden bg-darker-navy">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-pixel text-sm text-white text-center line-clamp-2 w-full">
                  {c.title}
                </h3>
              </div>
            ))}
          </div>

          <div className={`grid ${colSpanClass} gap-4`}>
            <div className="p-3 font-pixel text-xs text-gray-500 border-b-2 border-card-border" />
            {cartridges.map((c) => (
              <div key={`hdr-${c.id}`} className="border-b-2 border-card-border" />
            ))}

            {attrRows.map((row) => {
              const gVals = generalValues(row.key);
              const nVals = numericValues(row.key);
              const isDiff = areDifferent(gVals);
              const bestIdx = row.isNumeric
                ? row.key === 'releaseYear'
                  ? getBestIndex(nVals, true)
                  : row.key === 'purchasePrice'
                  ? getBestIndex(nVals, false)
                  : getBestIndex(nVals, true)
                : -1;

              return (
                <>
                  <div
                    key={`lbl-${row.key}`}
                    className={`p-3 font-retro text-sm flex items-center gap-2 ${
                      isDiff ? 'bg-neon-cyan/5' : ''
                    } border-b border-card-border`}
                  >
                    {row.icon && <span className="text-neon-cyan">{row.icon}</span>}
                    <span className={isDiff ? 'text-neon-cyan' : 'text-gray-400'}>
                      {row.label}
                    </span>
                    {isDiff && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan rounded font-pixel">
                        差异
                      </span>
                    )}
                  </div>
                  {cartridges.map((c, idx) => {
                    const isBest = idx === bestIdx && isDiff;
                    return (
                      <div
                        key={`val-${row.key}-${c.id}`}
                        className={`p-3 font-retro text-sm flex items-center justify-center border-b border-card-border text-center ${
                          isDiff ? 'bg-neon-cyan/5' : ''
                        } ${isBest ? 'text-neon-green font-pixel' : 'text-gray-200'}`}
                      >
                        {row.render(c)}
                        {isBest && !row.isBoolean && (
                          <TrendingUp className="w-3 h-3 ml-1 text-neon-green shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })}

            <div
              key={`lbl-notes`}
              className="p-3 font-retro text-sm flex items-start gap-2 text-gray-400 border-b border-card-border"
            >
              <span>备注信息</span>
            </div>
            {cartridges.map((c) => (
              <div
                key={`val-notes-${c.id}`}
                className="p-3 font-retro text-sm text-gray-300 text-center border-b border-card-border max-h-32 overflow-y-auto"
              >
                {c.notes || '—'}
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 p-4 border-t-4 border-card-border bg-inherit rounded-b-lg">
          <button
            onClick={onClose}
            className="pixel-btn pixel-btn-cyan text-xs"
          >
            关闭对比
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartridgeCompareModal;
