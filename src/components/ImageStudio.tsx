import React from 'react';
import { SelectedElementInfo } from '../types';
import {
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Sliders,
  RotateCcw,
  Layers,
  Crop,
  Sun
} from 'lucide-react';

interface ImageStudioProps {
  selectedElement: SelectedElementInfo;
  onUpdateAttribute: (name: string, value: string) => void;
  onUpdateStyle: (property: string, value: string) => void;
}

const UNSPLASH_PRESETS = [
  {
    name: 'Modern SaaS App UI',
    category: 'Dashboard',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Creative Collaborative Team',
    category: 'People',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Abstract 3D Fluid Gradient',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimalist Workspace Setup',
    category: 'Workspace',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Architectural Geometric Lines',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Modern User Avatar Profile',
    category: 'Avatar',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
];

export const ImageStudio: React.FC<ImageStudioProps> = ({
  selectedElement,
  onUpdateAttribute,
  onUpdateStyle,
}) => {
  const currentSrc = selectedElement.attributes['src'] || '';
  const currentAlt = selectedElement.attributes['alt'] || '';
  const styles = selectedElement.inlineStyles || {};

  return (
    <div className="space-y-4">
      {/* Live image preview card */}
      <div className="relative rounded-lg border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center min-h-[110px] max-h-[140px]">
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={currentAlt || 'Preview'}
            className="w-full h-full object-cover max-h-[140px]"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="text-stone-400 flex flex-col items-center gap-1">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-[11px]">No Image Source</span>
          </div>
        )}
      </div>

      {/* Image Source URL */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Image Source URL (src)
        </label>
        <input
          type="text"
          value={currentSrc}
          placeholder="https://images.unsplash.com/..."
          onChange={(e) => onUpdateAttribute('src', e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5 text-xs font-mono"
        />
      </div>

      {/* Alt Text (SEO & Accessibility) */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Alt Description (SEO & Accessibility)
        </label>
        <input
          type="text"
          value={currentAlt}
          placeholder="e.g. Modern analytics dashboard preview"
          onChange={(e) => onUpdateAttribute('alt', e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
        />
      </div>

      {/* Curated Unsplash Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Curated Stock Presets (Unsplash)</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {UNSPLASH_PRESETS.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                onUpdateAttribute('src', item.url);
                onUpdateAttribute('alt', item.name);
              }}
              className="relative rounded-md overflow-hidden border border-stone-200 hover:border-indigo-500 transition-all group h-14 bg-stone-100"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                <span className="text-[9px] font-bold text-white leading-tight">{item.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio & Object Fit */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-4 gap-1">
            {['auto', '16/9', '4/3', '1/1'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => onUpdateStyle('aspect-ratio', ratio)}
                className={`py-1 text-[10px] font-semibold rounded border ${
                  styles['aspect-ratio'] === ratio
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {ratio === 'auto' ? 'Auto' : ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Object Fit
          </label>
          <select
            value={styles['object-fit'] || 'cover'}
            onChange={(e) => onUpdateStyle('object-fit', e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
          >
            <option value="cover">Cover (Fill & Crop)</option>
            <option value="contain">Contain (Fit Whole)</option>
            <option value="fill">Stretch to Fill</option>
            <option value="none">Original Scale</option>
          </select>
        </div>
      </div>

      {/* Border Radius Presets for Images */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Image Corner Curvature
        </label>
        <div className="grid grid-cols-5 gap-1 text-[10px] font-semibold">
          <button
            onClick={() => onUpdateStyle('border-radius', '0px')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Sharp
          </button>
          <button
            onClick={() => onUpdateStyle('border-radius', '8px')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            8px
          </button>
          <button
            onClick={() => onUpdateStyle('border-radius', '16px')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            16px
          </button>
          <button
            onClick={() => onUpdateStyle('border-radius', '24px')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            24px
          </button>
          <button
            onClick={() => onUpdateStyle('border-radius', '9999px')}
            className="py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100"
          >
            Circle
          </button>
        </div>
      </div>

      {/* CSS Image Filters */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1 flex items-center justify-between">
          <span>Image Filters</span>
          {styles['filter'] && (
            <button
              onClick={() => onUpdateStyle('filter', 'none')}
              className="text-[10px] text-indigo-600 hover:underline font-bold"
            >
              Reset Filter
            </button>
          )}
        </label>
        <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold">
          <button
            onClick={() => onUpdateStyle('filter', 'grayscale(100%)')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            B&W
          </button>
          <button
            onClick={() => onUpdateStyle('filter', 'contrast(125%) saturate(120%)')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Vibrant
          </button>
          <button
            onClick={() => onUpdateStyle('filter', 'sepia(80%)')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Vintage
          </button>
          <button
            onClick={() => onUpdateStyle('filter', 'blur(3px)')}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Blur
          </button>
        </div>
      </div>
    </div>
  );
};
