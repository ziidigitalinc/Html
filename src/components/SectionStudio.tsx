import React from 'react';
import { Section, SelectedElementInfo } from '../types';
import {
  Layers,
  Palette,
  Maximize2,
  Sliders,
  Sparkles,
  ArrowDown,
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer
} from 'lucide-react';

interface SectionStudioProps {
  activeSection: Section;
  selectedElement: SelectedElementInfo;
  onUpdateStyle: (property: string, value: string) => void;
  onSelectElementByTag?: (tagName: string) => void;
}

const SECTION_BACKGROUNDS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Soft Slate Light', value: '#f8fafc' },
  { name: 'Warm Cream', value: '#fafaf9' },
  { name: 'Dark Slate Navy', value: '#0f172a' },
  { name: 'Royal Indigo Dark', value: '#1e1b4b' },
  { name: 'Deep Violet', value: '#2e1065' },
  { name: 'Royal Indigo Brand', value: '#4f46e5' },
];

const SECTION_GRADIENTS = [
  { name: 'Subtle Slate Glow', value: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' },
  { name: 'Soft Indigo Tint', value: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)' },
  { name: 'Hero Dark Canvas', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { name: 'Electric Brand CTA', value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
  { name: 'Sunset Glow', value: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)' },
];

export const SectionStudio: React.FC<SectionStudioProps> = ({
  activeSection,
  selectedElement,
  onUpdateStyle,
  onSelectElementByTag,
}) => {
  const styles = selectedElement.inlineStyles || {};

  return (
    <div className="space-y-4">
      {/* Section Header Card */}
      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900">{activeSection.name}</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">
              {activeSection.tagName || 'section'}
            </span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            Full section container styles and spacing
          </div>
        </div>
      </div>

      {/* Quick Jump to Child Elements in this section */}
      {onSelectElementByTag && (
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
            <MousePointer className="w-3 h-3 text-indigo-600" />
            <span>Jump to Section Elements:</span>
          </label>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold">
            <button
              onClick={() => onSelectElementByTag('h1, h2, h3')}
              className="py-1.5 px-2 bg-stone-50 hover:bg-indigo-50 border border-stone-200 hover:border-indigo-300 rounded flex items-center justify-center gap-1 text-stone-700 hover:text-indigo-600"
            >
              <Type className="w-3 h-3" />
              <span>Headings</span>
            </button>
            <button
              onClick={() => onSelectElementByTag('img, picture, svg')}
              className="py-1.5 px-2 bg-stone-50 hover:bg-indigo-50 border border-stone-200 hover:border-indigo-300 rounded flex items-center justify-center gap-1 text-stone-700 hover:text-indigo-600"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Media</span>
            </button>
            <button
              onClick={() => onSelectElementByTag('a, button')}
              className="py-1.5 px-2 bg-stone-50 hover:bg-indigo-50 border border-stone-200 hover:border-indigo-300 rounded flex items-center justify-center gap-1 text-stone-700 hover:text-indigo-600"
            >
              <Sparkles className="w-3 h-3" />
              <span>Buttons</span>
            </button>
          </div>
        </div>
      )}

      {/* Section Background Color */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
          Section Background Color
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SECTION_BACKGROUNDS.map((bg) => (
            <button
              key={bg.name}
              onClick={() => onUpdateStyle('background-color', bg.value)}
              title={bg.name}
              className="w-7 h-7 rounded border border-stone-300 shadow-2xs hover:scale-110 transition-transform"
              style={{ backgroundColor: bg.value }}
            />
          ))}
        </div>
      </div>

      {/* Section Gradient Backgrounds */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
          Curated Section Gradients
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {SECTION_GRADIENTS.map((g) => (
            <button
              key={g.name}
              onClick={() => {
                onUpdateStyle('background', g.value);
                onUpdateStyle('background-color', 'transparent');
              }}
              className="h-9 rounded-md border border-stone-200 flex items-center justify-between px-3 text-left hover:scale-[1.01] transition-transform shadow-2xs"
              style={{ background: g.value }}
            >
              <span className="text-[11px] font-bold text-stone-800 drop-shadow-xs">{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Spacing (Padding Top & Bottom) */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Vertical Spacing (Section Padding)
        </label>
        <div className="grid grid-cols-5 gap-1 text-[11px] font-semibold">
          {['40px', '60px', '80px', '100px', '140px'].map((pad) => (
            <button
              key={pad}
              onClick={() => {
                onUpdateStyle('padding-top', pad);
                onUpdateStyle('padding-bottom', pad);
              }}
              className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
            >
              {pad}
            </button>
          ))}
        </div>
      </div>

      {/* Container Max Width */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Container Max Width
        </label>
        <div className="grid grid-cols-5 gap-1 text-[11px] font-semibold">
          {[
            { label: '800px', val: '800px' },
            { label: '1024px', val: '1024px' },
            { label: '1200px', val: '1200px' },
            { label: '1440px', val: '1440px' },
            { label: 'Full', val: '100%' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onUpdateStyle('max-width', item.val)}
              className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Divider Borders */}
      <div>
        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
          Section Divider Borders
        </label>
        <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold">
          <button
            onClick={() => {
              onUpdateStyle('border-top', '1px solid #e2e8f0');
            }}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Top Border
          </button>
          <button
            onClick={() => {
              onUpdateStyle('border-bottom', '1px solid #e2e8f0');
            }}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Bottom Border
          </button>
          <button
            onClick={() => {
              onUpdateStyle('border-top', 'none');
              onUpdateStyle('border-bottom', 'none');
            }}
            className="py-1 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100"
          >
            Remove Borders
          </button>
        </div>
      </div>
    </div>
  );
};
