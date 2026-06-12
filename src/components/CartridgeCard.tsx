import { Link } from 'react-router-dom';
import type { Cartridge } from '../types';
import { formatPrice, getConditionLabel, getConditionColor, getRegionLabel } from '../utils/format';
import { Package, BookOpen, Disc } from 'lucide-react';

interface CartridgeCardProps {
  cartridge: Cartridge;
}

const CartridgeCard = ({ cartridge }: CartridgeCardProps) => {
  const isCompleteInBox = cartridge.hasBox && cartridge.hasManual && cartridge.hasCartridge;

  return (
    <Link
      to={`/collection/${cartridge.id}`}
      className="card-pixel p-4 rounded-lg block group transition-all duration-300 hover:-translate-y-1"
    >
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
        {isCompleteInBox && (
          <div className="absolute top-2 right-2">
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
      </div>
    </Link>
  );
};

export default CartridgeCard;
