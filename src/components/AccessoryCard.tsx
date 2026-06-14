import { Link } from 'react-router-dom';
import type { Accessory } from '../types';
import {
  formatPrice,
  getConditionLabel,
  getConditionColor,
  getAccessoryCategoryLabel,
  getAccessoryCategoryColor,
} from '../utils/format';
import { Check, Star, Shield, Package } from 'lucide-react';

interface AccessoryCardProps {
  accessory: Accessory;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const AccessoryCard = ({
  accessory,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
}: AccessoryCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isSelectMode && onToggleSelect) {
      e.preventDefault();
      onToggleSelect(accessory.id);
    }
  };

  const CardWrapper = isSelectMode ? 'div' : Link;
  const wrapperProps = isSelectMode
    ? {
        onClick: handleClick,
        className: `card-pixel p-4 rounded-lg block group transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isSelected ? 'ring-4 ring-neon-cyan ring-opacity-70' : ''}`,
      }
    : {
        to: `/accessories/${accessory.id}`,
        className: 'card-pixel p-4 rounded-lg block group transition-all duration-300 hover:-translate-y-1',
      };

  const categoryColorClass = getAccessoryCategoryColor(accessory.category);

  return (
    <CardWrapper {...(wrapperProps as any)}>
      <div className="relative aspect-square mb-4 overflow-hidden rounded bg-darker-navy">
        {accessory.coverImage ? (
          <img
            src={accessory.coverImage}
            alt={accessory.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-pixel rounded border ${categoryColorClass}`}>
            {getAccessoryCategoryLabel(accessory.category)}
          </span>
        </div>
        {isSelectMode && (
          <div
            className={`absolute top-2 right-2 w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
              isSelected ? 'bg-neon-cyan border-neon-cyan' : 'bg-darker-navy/90 border-gray-400'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        )}
        {accessory.isLimitedEdition && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <span className="px-2 py-1 bg-neon-pink/90 text-white text-xs font-pixel rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              限定
            </span>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <span className={`px-2 py-1 bg-darker-navy/90 text-xs font-pixel rounded ${getConditionColor(accessory.condition)}`}>
            {getConditionLabel(accessory.condition)}
          </span>
        </div>
        {accessory.quantity > 1 && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-neon-purple/90 text-white text-xs font-pixel rounded">
              x{accessory.quantity}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-pixel text-sm text-white truncate group-hover:text-neon-cyan transition-colors">
          {accessory.name}
        </h3>

        <div className="flex items-center justify-between text-sm font-retro">
          <span className="text-gray-400 truncate">{accessory.series || accessory.manufacturer || '—'}</span>
          {accessory.platform && <span className="text-gray-500">{accessory.platform}</span>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {accessory.isOfficial && (
              <span className="flex items-center gap-1 text-neon-green text-xs font-retro">
                <Shield className="w-3 h-3" />
                原装
              </span>
            )}
          </div>
          <span className="text-neon-amber font-pixel text-sm">{formatPrice(accessory.purchasePrice)}</span>
        </div>

        {accessory.editionNumber && (
          <div className="text-xs font-retro text-neon-pink">
            编号: {accessory.editionNumber}
          </div>
        )}

        {accessory.tags && accessory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-card-border">
            {accessory.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-neon-purple/15 text-neon-purple font-retro text-[10px] rounded border border-neon-purple/25 truncate max-w-full"
                title={tag}
              >
                #{tag}
              </span>
            ))}
            {accessory.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-gray-500 font-retro text-[10px]">
                +{accessory.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default AccessoryCard;
