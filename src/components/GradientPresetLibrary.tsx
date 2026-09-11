import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  CircleDot,
  ArrowUpRight,
  Search,
  X,
  Copy,
  Check,
  RotateCw,
  Sliders,
  RefreshCw,
  Disc,
  Trash2,
  Filter,
} from 'lucide-react';
import {
  GradientPreset,
  GradientType,
  GradientStyleTag,
  GRADIENT_PRESET_LIBRARY,
  detectGradientType,
  extractLinearGradientAngle,
  updateLinearGradientAngle,
  updateRadialGradientPosition,
  updateConicGradientAngle,
  reverseGradientColorStops,
} from '../utils/styleHelpers';

interface GradientPresetLibraryProps {
  currentBackground?: string;
  onApplyGradient: (gradientCss: string) => void;
  onClearBackground?: () => void;
  compact?: boolean;
}

const TYPE_TABS: { id: 'all' | GradientType; label: string; icon: any }[] = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'linear', label: 'Linear', icon: ArrowUpRight },
  { id: 'radial', label: 'Radial', icon: CircleDot },
  { id: 'conic', label: 'Conic', icon: Disc },
];

const STYLE_TAGS: { id: GradientStyleTag; label: string }[] = [
  { id: 'all', label: 'All Styles' },
  { id: 'popular', label: 'Popular' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'dark', label: 'Dark & Cyber' },
  { id: 'soft', label: 'Soft & Pastel' },
  { id: 'warm', label: 'Warm Sunset' },
  { id: 'cool', label: 'Cool Ocean' },
  { id: 'luxury', label: 'Luxury Gold' },
  { id: 'neon', label: 'Neon Glow' },
];

const LINEAR_ANGLES = [
  { label: '0° ↑', angle: 0 },
  { label: '45° ↗', angle: 45 },
  { label: '90° →', angle: 90 },
  { label: '135° ↘', angle: 135 },
  { label: '180° ↓', angle: 180 },
  { label: '225° ↙', angle: 225 },
  { label: '270° ←', angle: 270 },
  { label: '315° ↖', angle: 315 },
];

const RADIAL_POSITIONS = [
  { label: 'Center', pos: 'center' },
  { label: 'Top', pos: 'top' },
  { label: 'Top-Left', pos: 'top left' },
  { label: 'Top-Right', pos: 'top right' },
  { label: 'Bottom', pos: 'bottom' },
  { label: 'Bottom-Left', pos: 'bottom left' },
];

export const GradientPresetLibrary: React.FC<GradientPresetLibraryProps> = ({
  currentBackground = '',
  onApplyGradient,
  onClearBackground,
  compact = false,
}) => {
  const [activeType, setActiveType] = useState<'all' | GradientType>('all');
  const [activeTag, setActiveTag] = useState<GradientStyleTag>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTuner, setShowTuner] = useState(false);
  const [customInput, setCustomInput] = useState('');

  // Detect current active gradient in selected element
  const detectedType = useMemo(() => detectGradientType(currentBackground), [currentBackground]);
  const currentLinearAngle = useMemo(
    () => (detectedType === 'linear' ? extractLinearGradientAngle(currentBackground) : 135),
    [detectedType, currentBackground]
  );

  // Filter presets
  const filteredPresets = useMemo(() => {
    return GRADIENT_PRESET_LIBRARY.filter((preset) => {
      // Type filter
      if (activeType !== 'all' && preset.type !== activeType) {
        return false;
      }
      // Tag filter
      if (activeTag !== 'all' && preset.tag !== activeTag) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = preset.name.toLowerCase().includes(q);
        const matchesDesc = preset.description.toLowerCase().includes(q);
        const matchesType = preset.type.toLowerCase().includes(q);
        const matchesTag = preset.tag.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesType && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [activeType, activeTag, searchQuery]);

  // Counts per type
  const counts = useMemo(() => {
    return {
      all: GRADIENT_PRESET_LIBRARY.length,
      linear: GRADIENT_PRESET_LIBRARY.filter((p) => p.type === 'linear').length,
      radial: GRADIENT_PRESET_LIBRARY.filter((p) => p.type === 'radial').length,
      conic: GRADIENT_PRESET_LIBRARY.filter((p) => p.type === 'conic').length,
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleAngleChange = (newAngle: number) => {
    const updated = updateLinearGradientAngle(currentBackground, newAngle);
    onApplyGradient(updated);
  };

  const handleRadialPosChange = (newPos: string) => {
    const updated = updateRadialGradientPosition(currentBackground, newPos);
    onApplyGradient(updated);
  };

  const handleConicAngleChange = (fromDeg: number) => {
    const updated = updateConicGradientAngle(currentBackground, fromDeg);
    onApplyGradient(updated);
  };

  const handleReverse = () => {
    const reversed = reverseGradientColorStops(currentBackground);
    onApplyGradient(reversed);
  };

  return (
    <div className="space-y-3" id="gradient-preset-library">
      {/* Active Gradient Bar & Quick Actions */}
      <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md border border-stone-300 shadow-2xs flex-shrink-0"
              style={{ background: currentBackground || '#e2e8f0' }}
              title={currentBackground || 'No gradient applied'}
            />
            <div>
              <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
                <span>Active Background</span>
                {detectedType && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono rounded font-semibold uppercase ${
                      detectedType === 'linear'
                        ? 'bg-indigo-100 text-indigo-700'
                        : detectedType === 'radial'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {detectedType}
                  </span>
                )}
              </div>
              <div className="text-[9px] text-stone-500 font-mono truncate max-w-[200px]" title={currentBackground}>
                {currentBackground ? currentBackground : 'Solid or transparent'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {currentBackground && (
              <>
                <button
                  type="button"
                  onClick={() => setShowTuner(!showTuner)}
                  className={`p-1.5 text-xs rounded border transition-colors ${
                    showTuner
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                  title="Toggle Angle & Position Tuner"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentBackground, 'active-css')}
                  className="p-1.5 text-xs rounded border bg-white text-stone-700 border-stone-200 hover:bg-stone-100 transition-colors"
                  title="Copy Active CSS"
                >
                  {copiedId === 'active-css' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {onClearBackground && (
                  <button
                    type="button"
                    onClick={onClearBackground}
                    className="p-1.5 text-xs rounded border bg-white text-red-600 border-red-200 hover:bg-red-50 transition-colors"
                    title="Remove Gradient / Reset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Live Fine-Tuner Drawer */}
        {(showTuner || detectedType) && currentBackground && (
          <div className="pt-2 border-t border-stone-200 space-y-2">
            {/* Linear controls */}
            {detectedType === 'linear' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                    Linear Angle: {currentLinearAngle}°
                  </span>
                  <button
                    type="button"
                    onClick={handleReverse}
                    className="flex items-center gap-1 text-[9px] text-indigo-600 font-semibold hover:underline"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Flip Stops
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {LINEAR_ANGLES.map((a) => (
                    <button
                      key={a.angle}
                      type="button"
                      onClick={() => handleAngleChange(a.angle)}
                      className={`py-1 text-[10px] font-mono rounded border transition-colors ${
                        Math.abs(currentLinearAngle - a.angle) < 5
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={currentLinearAngle}
                  onChange={(e) => handleAngleChange(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5"
                />
              </div>
            )}

            {/* Radial controls */}
            {detectedType === 'radial' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <CircleDot className="w-3 h-3 text-sky-600" />
                    Radial Center Focal Point
                  </span>
                  <button
                    type="button"
                    onClick={handleReverse}
                    className="flex items-center gap-1 text-[9px] text-sky-600 font-semibold hover:underline"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Flip Stops
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {RADIAL_POSITIONS.map((r) => (
                    <button
                      key={r.pos}
                      type="button"
                      onClick={() => handleRadialPosChange(r.pos)}
                      className="py-1 px-1.5 text-[9px] font-medium bg-white text-stone-700 border border-stone-200 rounded hover:bg-stone-50"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conic controls */}
            {detectedType === 'conic' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <Disc className="w-3 h-3 text-amber-600" />
                    Conic Rotation Angle
                  </span>
                  <button
                    type="button"
                    onClick={handleReverse}
                    className="flex items-center gap-1 text-[9px] text-amber-600 font-semibold hover:underline"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Flip Stops
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => handleConicAngleChange(deg)}
                      className="py-1 text-[10px] font-mono bg-white text-stone-700 border border-stone-200 rounded hover:bg-stone-50"
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary Type Tabs: All | Linear | Radial | Conic */}
      <div className="grid grid-cols-4 p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold">
        {TYPE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;
          const count = counts[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id)}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-white shadow-xs text-indigo-700 font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="truncate">{tab.label}</span>
              <span className="text-[9px] opacity-60 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Tag Chips */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gradients (e.g., sunset, radar, dark, gold)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-md pl-8 pr-7 py-1 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Style Tag Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          {STYLE_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setActiveTag(tag.id)}
              className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors border ${
                activeTag === tag.id
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gradient Presets Grid */}
      {filteredPresets.length === 0 ? (
        <div className="py-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
          <Sparkles className="w-6 h-6 text-stone-300 mx-auto mb-1.5" />
          <div className="text-xs font-semibold text-stone-600">No gradients found</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Try resetting search or filter tags</div>
          <button
            type="button"
            onClick={() => {
              setActiveType('all');
              setActiveTag('all');
              setSearchQuery('');
            }}
            className="mt-2 text-[11px] text-indigo-600 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
          {filteredPresets.map((preset) => {
            const isApplied = currentBackground === preset.value;
            const typeBadgeStyle =
              preset.type === 'linear'
                ? 'bg-indigo-100/90 text-indigo-800'
                : preset.type === 'radial'
                ? 'bg-sky-100/90 text-sky-800'
                : 'bg-amber-100/90 text-amber-900';

            return (
              <div
                key={preset.id}
                className={`group relative rounded-lg border text-left transition-all duration-150 overflow-hidden flex flex-col bg-white ${
                  isApplied
                    ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                {/* Visual Gradient Swatch Card */}
                <button
                  type="button"
                  onClick={() => onApplyGradient(preset.value)}
                  className="w-full h-16 relative overflow-hidden transition-transform duration-200 group-hover:opacity-95 focus:outline-hidden"
                  style={{ background: preset.value }}
                  title={`Click to apply ${preset.name}`}
                >
                  {/* Type Badge on Top Left */}
                  <span
                    className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold rounded shadow-2xs backdrop-blur-xs ${typeBadgeStyle}`}
                  >
                    {preset.type}
                  </span>

                  {/* Active Indicator Checkmark */}
                  {isApplied && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}

                  {/* Tag on Bottom Right */}
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 bg-black/40 text-white/90 text-[8px] rounded font-medium backdrop-blur-xs">
                    {preset.tag}
                  </span>
                </button>

                {/* Info & Action Footer */}
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-stone-800 truncate" title={preset.name}>
                        {preset.name}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(preset.value, preset.id);
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
                        title="Copy CSS gradient string"
                      >
                        {copiedId === preset.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="text-[9px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                      {preset.description}
                    </div>
                  </div>

                  {/* Color stop preview dots + One-Click Apply */}
                  <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {preset.stopsPreview.map((c, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyGradient(preset.value)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors ${
                        isApplied
                          ? 'bg-indigo-600 text-white'
                          : 'bg-stone-100 hover:bg-indigo-50 text-stone-700 hover:text-indigo-700'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Custom CSS Gradient Input Bar */}
      <div className="pt-2 border-t border-stone-200">
        <label className="text-[10px] font-semibold text-stone-600 block mb-1">
          Custom CSS Gradient Expression
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="linear-gradient(...), radial-gradient(...), or conic-gradient(...)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-mono text-stone-800 focus:bg-white focus:outline-indigo-500"
          />
          <button
            type="button"
            disabled={!customInput.trim()}
            onClick={() => {
              if (customInput.trim()) {
                onApplyGradient(customInput.trim());
                setCustomInput('');
              }
            }}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
