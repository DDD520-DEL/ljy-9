import { Link } from 'react-router-dom';
import type { Cartridge } from '../types';
import { formatPrice, getConditionLabel, getConditionColor, getRegionLabel } from '../utils/format';
import { Package, BookOpen, Disc, Check, Heart } from 'lucide-react';
import { useStore } from '../stores/useStore';

interface CartridgeCardProps {
  cartridge: Cartridge;
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showWishlistButton?: boolean;
  highlightWishlist?: boolean;
}

const CartridgeCard = ({
  cartridge,
  isSelectMode = false,
  isSelected = false,
  onToggleSelect,
  showWishlistButton = true,
  highlightWishlist = false,
}: CartridgeCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useStore();
  const isCompleteInBox = cartridge.hasBox && cartridge.hasManual && cartridge.hasCartridge;
  const inWishlist = isInWishlist(cartridge.title, cartridge.platform);

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectMode && onToggleSelect) {
      e.preventDefault();
      onToggleSelect(cartridge.id);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      const itemId = getWishlistItemId(cartridge.title, cartridge.platform);
      if (itemId) {
        removeFromWishlist(itemId);
      }
    } else {
      addToWishlist({
        cartridgeTitle: cartridge.title,
        platform: cartridge.platform,
        cartridgeId: cartridge.id,
        coverImage: cartridge.coverImage,
        priority: 'MEDIUM',
      });
    }
  };

  const CardWrapper = isSelectMode ? 'div' : Link;
  const wishlistHighlightClass = highlightWishlist && inWishlist
    ? 'ring-4 ring-neon-pink ring-opacity-80 shadow-neon-pink border-neon-pink/50'
    : '';
  const wrapperProps = isSelectMode
    ? {
        onClick: handleClick,
        className: `card-pixel p-4 rounded-lg block group transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isSelected ? 'ring-4 ring-neon-cyan ring-opacity-70' : ''} ${wishlistHighlightClass}`,
      }
    : {
        to: `/collection/${cartridge.id}`,
        className: `card-pixel p-4 rounded-lg block group transition-all duration-300 hover:-translate-y-1 ${wishlistHighlightClass}`,
      };

  return (
    <CardWrapper {...(wrapperProps as any)}>
      <div className="relative aspect-square mb-4 overflow-hidden rounded bg-darker-navy">
        <img
          src={cartridge.coverImage}
          alt={cartridge.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-neon-purple/90 text-white text-xs font-pixel rounded">
            {cartridge.platform}
          </span>
        </div>
        {isSelectMode && (
          <div className={`absolute top-2 right-2 w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-neon-cyan border-neon-cyan' : 'bg-darker-navy/90 border-gray-400'}`}>
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        )}
        {!isSelectMode && showWishlistButton && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 w-7 h-7 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
              inWishlist
                ? 'bg-neon-pink border-neon-pink text-white'
                : 'bg-darker-navy/90 border-gray-400 text-gray-400 hover:border-neon-pink hover:text-neon-pink'
            }`}
            title={inWishlist ? '从愿望单移除' : '加入愿望单'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
          </button>
        )}
        {!isSelectMode && isCompleteInBox && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <span className="px-2 py-1 bg-neon-green/90 text-white text-xs font-pixel rounded flex items-center gap-1">
              <Package className="w-3 h-3" />
              箱说全
            </span>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <span className={`px-2 py-1 bg-darker-navy/90 text-xs font-pixel rounded ${getConditionColor(cartridge.condition)}`}>
            {getConditionLabel(cartridge.condition)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-pixel text-sm text-white truncate group-hover:text-neon-cyan transition-colors">
          {cartridge.title}
        </h3>

        <div className="flex items-center justify-between text-sm font-retro">
          <span className="text-gray-400">{cartridge.series}</span>
          <span className="text-gray-500">{cartridge.releaseYear}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-retro text-sm">{getRegionLabel(cartridge.region)}</span>
          <span className="text-neon-amber font-pixel text-sm">{formatPrice(cartridge.purchasePrice)}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-card-border">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Disc className={`w-3 h-3 ${cartridge.hasCartridge ? 'text-neon-green' : 'text-gray-600'}`} />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Package className={`w-3 h-3 ${cartridge.hasBox ? 'text-neon-green' : 'text-gray-600'}`} />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <BookOpen className={`w-3 h-3 ${cartridge.hasManual ? 'text-neon-green' : 'text-gray-600'}`} />
          </div>
        </div>

        {cartridge.tags && cartridge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {cartridge.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-neon-purple/15 text-neon-purple font-retro text-[10px] rounded border border-neon-purple/25 truncate max-w-full"
                title={tag}
              >
                #{tag}
              </span>
            ))}
            {cartridge.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-gray-500 font-retro text-[10px]">
                +{cartridge.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default CartridgeCard;
