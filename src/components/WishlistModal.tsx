import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { X, Heart, Trash2, ArrowRight, MessageCircle, MapPin, Clock } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

interface WishlistModalProps {
  onSelectDestination?: (dest: any) => void;
  onSelectPackage?: (pkg: any) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  onSelectDestination,
  onSelectPackage,
}) => {
  const {
    isWishlistOpen,
    closeWishlist,
    savedDestinations,
    savedPackages,
    toggleDestinationWishlist,
    togglePackageWishlist,
    clearWishlist,
    totalSavedCount,
  } = useWishlist();

  if (!isWishlistOpen) return null;

  const handleShareToWhatsApp = () => {
    const destTitles = savedDestinations.map((d) => `• ${d.name} (${d.priceNote})`).join('\n');
    const pkgTitles = savedPackages.map((p) => `• ${p.title} (${p.startingPrice})`).join('\n');

    let text = `Hello My Kind of Travel team!\n\nI have saved these items to my shortlist on your website and would love to discuss a bespoke itinerary:\n\n`;
    if (destTitles) {
      text += `📍 *Saved Destinations:*\n${destTitles}\n\n`;
    }
    if (pkgTitles) {
      text += `📦 *Saved Packages:*\n${pkgTitles}\n\n`;
    }
    text += `Please get in touch with me with pricing, best travel dates, and tailored options. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encoded}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeWishlist}
    >
      <div
        className="w-full max-w-md h-full bg-[#FAF7F2] dark:bg-[#16100D] border-l border-[#E8DFD5] dark:border-white/10 shadow-2xl flex flex-col text-[#24130A] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DFD5] dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1C1410]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E37500]/10 text-[#E37500] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">My Saved Shortlist</h2>
              <span className="text-xs text-[#6F5B4E] dark:text-[#A7978A]">
                {totalSavedCount} item{totalSavedCount === 1 ? '' : 's'} saved
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalSavedCount > 0 && (
              <button
                onClick={clearWishlist}
                className="p-2 text-xs text-[#8C7667] hover:text-[#E37500] transition-colors flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={closeWishlist}
              className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {totalSavedCount === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#8C7667]">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-serif text-base font-bold">Your Shortlist is Empty</h3>
                <p className="text-xs text-[#6F5B4E] dark:text-[#A7978A] leading-relaxed">
                  Click the heart icon on any destination or package to save it here and compare before booking.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Destinations Section */}
              {savedDestinations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Destinations ({savedDestinations.length})
                  </h3>
                  <div className="space-y-2.5">
                    {savedDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#201712] border border-[#E8DFD5] dark:border-white/10 shadow-xs group"
                      >
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold truncate group-hover:text-[#E37500] transition-colors">
                            {dest.name}
                          </h4>
                          <span className="text-[11px] text-[#E37500] font-semibold block truncate">
                            {dest.priceNote}
                          </span>
                          <span className="text-[10px] text-[#6F5B4E] dark:text-[#A7978A] truncate block">
                            {dest.tag}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleDestinationWishlist(dest.id)}
                          className="p-2 text-[#8C7667] hover:text-[#E37500] transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages Section */}
              {savedPackages.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Curated Packages ({savedPackages.length})
                  </h3>
                  <div className="space-y-2.5">
                    {savedPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#201712] border border-[#E8DFD5] dark:border-white/10 shadow-xs group"
                      >
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold truncate group-hover:text-[#E37500] transition-colors">
                            {pkg.title}
                          </h4>
                          <span className="text-[11px] text-[#E37500] font-semibold block truncate">
                            {pkg.startingPrice} · {pkg.duration}
                          </span>
                          <span className="text-[10px] text-[#6F5B4E] dark:text-[#A7978A] truncate block">
                            {pkg.destination}
                          </span>
                        </div>
                        <button
                          onClick={() => togglePackageWishlist(pkg.id)}
                          className="p-2 text-[#8C7667] hover:text-[#E37500] transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {totalSavedCount > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#E8DFD5] dark:border-white/10 bg-white dark:bg-[#1C1410] space-y-3">
            <button
              onClick={handleShareToWhatsApp}
              className="w-full py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#E37500]/25 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss Shortlist on WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-[#6F5B4E] dark:text-[#A7978A]">
              Connects directly with your dedicated private concierge in India
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
