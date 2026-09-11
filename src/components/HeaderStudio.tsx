import React, { useState, useMemo } from 'react';
import { SelectedElementInfo } from '../types';
import {
  Type,
  Palette,
  Sparkles,
  Sliders,
  RotateCcw,
  Check,
  Zap,
  Tag,
  Underline as UnderlineIcon,
  Italic as ItalicIcon,
  Bold as BoldIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Pencil,
  Edit3
} from 'lucide-react';

interface HeaderStudioProps {
  selectedElement: SelectedElementInfo;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateHtml: (html: string) => void;
  onUpdateText: (text: string) => void;
}

const FONTS = [
  { name: 'Plus Jakarta Sans', category: 'Modern Sans', family: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Playfair Display', category: 'Luxury Serif', family: "'Playfair Display', serif" },
  { name: 'Outfit', category: 'Geometric Sans', family: "'Outfit', sans-serif" },
  { name: 'Lora', category: 'Editorial Serif', family: "'Lora', serif" },
  { name: 'Fira Code', category: 'Tech Monospace', family: "'Fira Code', monospace" },
  { name: 'Poppins', category: 'Soft Modern Sans', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', category: 'Display Sans', family: "'Montserrat', sans-serif" },
  { name: 'Georgia', category: 'Classic Serif', family: "Georgia, serif" },
  { name: 'Inter', category: 'Clean Neutral', family: "'Inter', sans-serif" },
];

const COLOR_PALETTE = [
  { name: 'Dark Slate', value: '#0f172a' },
  { name: 'Deep Navy', value: '#1e293b' },
  { name: 'Royal Indigo', value: '#4f46e5' },
  { name: 'Electric Violet', value: '#7c3aed' },
  { name: 'Sunset Orange', value: '#f97316' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Rose Red', value: '#e11d48' },
  { name: 'Amber Gold', value: '#f59e0b' },
  { name: 'Ocean Cyan', value: '#06b6d4' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Slate Gray', value: '#64748b' },
];

const GRADIENT_PRESETS = [
  { name: 'Royal Indigo', style: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
  { name: 'Sunset Coral', style: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { name: 'Emerald Glow', style: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
  { name: 'Ocean Wave', style: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)' },
  { name: 'Midnight Purple', style: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
  { name: 'Golden Luxury', style: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' },
];

export const HeaderStudio: React.FC<HeaderStudioProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateHtml,
  onUpdateText,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'words' | 'gradient' | 'html'>('presets');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // Current HTML or fallback to textContent
  const rawHtml = selectedElement.innerHTML !== undefined ? selectedElement.innerHTML : selectedElement.textContent;
  const currentText = selectedElement.textContent || '';

  // Parse words from HTML or plain text
  const words = useMemo(() => {
    // If HTML contains spans, extract tokens
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;

    // If it has child nodes like spans
    if (temp.children.length > 0) {
      const nodes: Array<{ text: string; isSpan: boolean; style: string; element?: HTMLElement }> = [];
      temp.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = (node.textContent || '').split(/(\s+)/);
          parts.forEach((p) => {
            if (p.trim()) {
              nodes.push({ text: p, isSpan: false, style: '' });
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          nodes.push({
            text: el.textContent || '',
            isSpan: true,
            style: el.getAttribute('style') || '',
            element: el,
          });
        }
      });
      return nodes;
    }

    // Otherwise simple words from plain text
    return currentText
      .split(/\s+/)
      .filter((w) => w.trim().length > 0)
      .map((w) => ({ text: w, isSpan: false, style: '' }));
  }, [rawHtml, currentText]);

  // Apply curated multi-color & multi-font preset
  const applyPreset = (presetType: string) => {
    const cleanText = currentText.trim();
    if (!cleanText) return;
    const tokens = cleanText.split(/\s+/);
    if (tokens.length === 0) return;

    let generatedHtml = '';

    if (presetType === 'modern-serif-accent') {
      // Modern sans with the 2nd or 3rd key word in Playfair Display italic serif accent
      const accentIdx = Math.min(1, tokens.length - 1);
      generatedHtml = tokens
        .map((w, idx) => {
          if (idx === accentIdx) {
            return `<span style="font-family: 'Playfair Display', serif; font-style: italic; color: #4f46e5; font-weight: 700;">${w}</span>`;
          }
          return w;
        })
        .join(' ');
      onUpdateStyle('font-family', "'Plus Jakarta Sans', sans-serif");
    } else if (presetType === 'gradient-last-words') {
      // First words in slate, last 1-2 words in vibrant gradient text
      const splitAt = Math.max(1, tokens.length - 2);
      const firstPart = tokens.slice(0, splitAt).join(' ');
      const lastPart = tokens.slice(splitAt).join(' ');
      generatedHtml = `${firstPart} <span style="background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; display: inline-block;">${lastPart}</span>`;
    } else if (presetType === 'two-tone-slate-indigo') {
      // 50% Slate / 50% Royal Indigo
      const mid = Math.ceil(tokens.length / 2);
      const firstPart = tokens.slice(0, mid).join(' ');
      const lastPart = tokens.slice(mid).join(' ');
      generatedHtml = `<span style="color: #0f172a;">${firstPart}</span> <span style="color: #4f46e5;">${lastPart}</span>`;
    } else if (presetType === 'sunset-coral-gradient') {
      // Last words in warm Sunset Coral gradient
      const splitAt = Math.max(1, tokens.length - 2);
      const firstPart = tokens.slice(0, splitAt).join(' ');
      const lastPart = tokens.slice(splitAt).join(' ');
      generatedHtml = `${firstPart} <span style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; display: inline-block;">${lastPart}</span>`;
    } else if (presetType === 'emerald-glow-keyword') {
      // Key word in vibrant emerald with subtle glow
      const accentIdx = Math.max(0, tokens.length - 1);
      generatedHtml = tokens
        .map((w, idx) => {
          if (idx === accentIdx) {
            return `<span style="color: #10b981; font-weight: 800; text-shadow: 0 0 20px rgba(16, 185, 129, 0.35);">${w}</span>`;
          }
          return w;
        })
        .join(' ');
    } else if (presetType === 'badge-pill-accent') {
      // Encase first or last word in a modern pill badge
      const accentIdx = Math.min(0, tokens.length - 1);
      generatedHtml = tokens
        .map((w, idx) => {
          if (idx === accentIdx) {
            return `<span style="background-color: #e0e7ff; color: #4338ca; padding: 4px 14px; border-radius: 9999px; font-size: 0.85em; display: inline-block; vertical-align: middle; margin-right: 8px;">${w}</span>`;
          }
          return w;
        })
        .join(' ');
    } else if (presetType === 'stylish-underline') {
      // Underline the last 2 words with high contrast indigo stroke
      const splitAt = Math.max(1, tokens.length - 2);
      const firstPart = tokens.slice(0, splitAt).join(' ');
      const lastPart = tokens.slice(splitAt).join(' ');
      generatedHtml = `${firstPart} <span style="text-decoration: underline; text-decoration-color: #4f46e5; text-decoration-thickness: 4px; text-underline-offset: 8px;">${lastPart}</span>`;
    } else if (presetType === 'full-gradient') {
      // Full title gradient
      onUpdateStyle('background', 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)');
      onUpdateStyle('-webkit-background-clip', 'text');
      onUpdateStyle('-webkit-text-fill-color', 'transparent');
      onUpdateStyle('display', 'inline-block');
      return;
    }

    if (generatedHtml) {
      onUpdateHtml(generatedHtml);
    }
  };

  // Update specific word with custom styling
  const handleUpdateWordStyle = (wordIdx: number, updates: { color?: string; font?: string; italic?: boolean; bold?: boolean; underline?: boolean; gradient?: string; badge?: boolean; clear?: boolean }) => {
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;

    // Convert to word spans if not already
    let currentTokens = words.map((w, i) => {
      return {
        text: w.text,
        style: w.style || '',
      };
    });

    if (updates.clear) {
      currentTokens[wordIdx].style = '';
    } else {
      const existing = currentTokens[wordIdx].style;
      const parseStyle = (s: string) => {
        const res: Record<string, string> = {};
        s.split(';').forEach((part) => {
          const [k, v] = part.split(':');
          if (k && v) res[k.trim()] = v.trim();
        });
        return res;
      };

      const styleObj = parseStyle(existing);

      if (updates.color) {
        styleObj['color'] = updates.color;
        delete styleObj['background'];
        delete styleObj['-webkit-background-clip'];
        delete styleObj['-webkit-text-fill-color'];
      }
      if (updates.font) {
        styleObj['font-family'] = updates.font;
      }
      if (updates.italic !== undefined) {
        if (updates.italic) styleObj['font-style'] = 'italic';
        else delete styleObj['font-style'];
      }
      if (updates.bold !== undefined) {
        if (updates.bold) styleObj['font-weight'] = '800';
        else delete styleObj['font-weight'];
      }
      if (updates.underline !== undefined) {
        if (updates.underline) {
          styleObj['text-decoration'] = 'underline';
          styleObj['text-underline-offset'] = '6px';
        } else {
          delete styleObj['text-decoration'];
          delete styleObj['text-underline-offset'];
        }
      }
      if (updates.gradient) {
        styleObj['background'] = updates.gradient;
        styleObj['-webkit-background-clip'] = 'text';
        styleObj['-webkit-text-fill-color'] = 'transparent';
        styleObj['display'] = 'inline-block';
        delete styleObj['color'];
      }
      if (updates.badge !== undefined) {
        if (updates.badge) {
          styleObj['background-color'] = '#e0e7ff';
          styleObj['color'] = '#4338ca';
          styleObj['padding'] = '3px 12px';
          styleObj['border-radius'] = '9999px';
          styleObj['display'] = 'inline-block';
        } else {
          delete styleObj['background-color'];
          delete styleObj['padding'];
          delete styleObj['border-radius'];
        }
      }

      const newStyleStr = Object.entries(styleObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
      currentTokens[wordIdx].style = newStyleStr;
    }

    // Reassemble HTML
    const newHtml = currentTokens
      .map((t) => {
        if (t.style) {
          return `<span style="${t.style}">${t.text}</span>`;
        }
        return t.text;
      })
      .join(' ');

    onUpdateHtml(newHtml);
  };

  // Reset entire header to plain unformatted text
  const handleResetToPlain = () => {
    onUpdateStyle('background', '');
    onUpdateStyle('-webkit-background-clip', '');
    onUpdateStyle('-webkit-text-fill-color', '');
    onUpdateStyle('display', 'block');
    onUpdateText(currentText);
  };

  return (
    <div className="space-y-4">
      {/* Primary Heading Text Editor Card */}
      <div className="p-3 bg-white border border-purple-200/90 rounded-xl shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Heading Text Content</span>
          </label>
          <button
            type="button"
            onClick={() => {
              window.postMessage({ type: 'START_INLINE_EDIT', selector: selectedElement.selector }, '*');
            }}
            className="text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
            title="Type directly on canvas"
          >
            <Pencil className="w-2.5 h-2.5" />
            <span>Type on Canvas</span>
          </button>
        </div>
        <textarea
          rows={2}
          value={currentText}
          onChange={(e) => onUpdateText(e.target.value)}
          placeholder="Edit heading text..."
          className="w-full bg-stone-50 border border-stone-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 font-medium transition-all resize-y"
        />
      </div>

      {/* Header studio navigation tabs */}
      <div className="grid grid-cols-4 p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab('presets')}
          className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'presets' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('words')}
          className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'words' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Type className="w-3 h-3 text-indigo-600" />
          <span>Word Styling</span>
        </button>
        <button
          onClick={() => setActiveTab('gradient')}
          className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'gradient' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Palette className="w-3 h-3 text-indigo-600" />
          <span>Gradient</span>
        </button>
        <button
          onClick={() => setActiveTab('html')}
          className={`py-1.5 rounded flex items-center justify-center gap-1 transition-all ${
            activeTab === 'html' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Code className="w-3 h-3 text-indigo-600" />
          <span>HTML</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: CURATED MULTI-COLOR & MULTI-FONT PRESETS
         ======================================================== */}
      {activeTab === 'presets' && (
        <div className="space-y-2.5">
          <div className="text-[11px] text-stone-500 font-medium">
            One-click designer multi-color & multi-font combinations:
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {/* Preset 1 */}
            <button
              onClick={() => applyPreset('modern-serif-accent')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Modern Sans + Serif Italic Accent</span>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Dual Font</span>
              </div>
              <div className="text-xs font-medium text-stone-700">
                Headline with <span className="font-serif italic font-bold text-indigo-600">Playfair Italic</span> keyword
              </div>
            </button>

            {/* Preset 2 */}
            <button
              onClick={() => applyPreset('gradient-last-words')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Gradient Pop on Final Words</span>
                <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">Multi Color</span>
              </div>
              <div className="text-xs font-semibold text-stone-700">
                Transform with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold">Next-Gen Speed</span>
              </div>
            </button>

            {/* Preset 3 */}
            <button
              onClick={() => applyPreset('two-tone-slate-indigo')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Two-Tone Split (50% Slate / 50% Indigo)</span>
                <span className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-bold">Classic SaaS</span>
              </div>
              <div className="text-xs font-bold">
                <span className="text-slate-900">Build Faster.</span> <span className="text-indigo-600">Ship Smarter.</span>
              </div>
            </button>

            {/* Preset 4 */}
            <button
              onClick={() => applyPreset('sunset-coral-gradient')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Sunset Coral Warm Gradient</span>
                <span className="text-[9px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-bold">Warm Glow</span>
              </div>
              <div className="text-xs font-semibold text-stone-700">
                Designed for <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent font-extrabold">High Conversion</span>
              </div>
            </button>

            {/* Preset 5 */}
            <button
              onClick={() => applyPreset('emerald-glow-keyword')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Emerald Glow Pop</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Vibrant Pop</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                Guaranteed <span className="text-emerald-500 underline decoration-emerald-300">100% Performance</span>
              </div>
            </button>

            {/* Preset 6 */}
            <button
              onClick={() => applyPreset('badge-pill-accent')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">Badge Pill Tag Highlight</span>
                <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">Tag Style</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] mr-1">NEW</span> Revolutionary Platform
              </div>
            </button>

            {/* Preset 7 */}
            <button
              onClick={() => applyPreset('stylish-underline')}
              className="p-2.5 rounded-lg border border-stone-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-stone-800 group-hover:text-indigo-600">High-Contrast Offset Underline</span>
                <span className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-bold">Underline</span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                Crafted for <span className="underline decoration-indigo-600 decoration-2 underline-offset-4">WordPress & Elementor</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INTERACTIVE WORD-BY-WORD DECORATOR
         ======================================================== */}
      {activeTab === 'words' && (
        <div className="space-y-3">
          <div className="text-[11px] text-stone-500">
            Click any word to change its <b>Color</b>, <b>Font</b>, <b>Italic</b> or <b>Gradient</b>:
          </div>

          {/* Interactive word ribbon */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap gap-1.5 items-center">
            {words.map((w, idx) => {
              const isSelected = selectedWordIndex === idx;
              const hasCustomStyle = w.isSpan || w.style.length > 0;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedWordIndex(isSelected ? null : idx)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-300'
                      : hasCustomStyle
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span>{w.text}</span>
                  {hasCustomStyle && !isSelected && (
                    <span className="ml-1 text-[9px] opacity-75">✦</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Word customizer panel if word selected */}
          {selectedWordIndex !== null && words[selectedWordIndex] && (
            <div className="p-3 bg-white rounded-lg border border-indigo-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-800">
                  Editing Word: <span className="text-indigo-600">"{words[selectedWordIndex].text}"</span>
                </span>
                <button
                  onClick={() => handleUpdateWordStyle(selectedWordIndex, { clear: true })}
                  className="text-[10px] text-stone-400 hover:text-red-600 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Word
                </button>
              </div>

              {/* Word Color Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                  Word Color
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleUpdateWordStyle(selectedWordIndex, { color: c.value })}
                      title={c.name}
                      className="w-6 h-6 rounded border border-stone-300 shadow-2xs hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Word Font Family */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Word Font Family
                </label>
                <select
                  onChange={(e) => handleUpdateWordStyle(selectedWordIndex, { font: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                >
                  <option value="">Inherit Heading Font</option>
                  {FONTS.map((f) => (
                    <option key={f.name} value={f.family}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Word Styles (Italic, Bold, Underline, Badge) */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                  Style Modifiers
                </label>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => handleUpdateWordStyle(selectedWordIndex, { italic: true })}
                    className="py-1 px-1.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-1 text-[11px] font-serif italic"
                    title="Italicize this word"
                  >
                    <ItalicIcon className="w-3 h-3" />
                    Italic
                  </button>
                  <button
                    onClick={() => handleUpdateWordStyle(selectedWordIndex, { bold: true })}
                    className="py-1 px-1.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-1 text-[11px] font-bold"
                    title="Make this word bold"
                  >
                    <BoldIcon className="w-3 h-3" />
                    Bold
                  </button>
                  <button
                    onClick={() => handleUpdateWordStyle(selectedWordIndex, { underline: true })}
                    className="py-1 px-1.5 rounded border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-1 text-[11px] underline"
                    title="Underline this word"
                  >
                    <UnderlineIcon className="w-3 h-3" />
                    Line
                  </button>
                  <button
                    onClick={() => handleUpdateWordStyle(selectedWordIndex, { badge: true })}
                    className="py-1 px-1.5 rounded border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-700"
                    title="Encase in pill badge"
                  >
                    <Tag className="w-3 h-3" />
                    Pill
                  </button>
                </div>
              </div>

              {/* Word Gradient Text */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Word Gradient Fill
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => handleUpdateWordStyle(selectedWordIndex, { gradient: g.style })}
                      className="py-1 px-1 text-[10px] font-bold text-white rounded shadow-2xs truncate"
                      style={{ background: g.style }}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: FULL HEADING GRADIENT ENGINE
         ======================================================== */}
      {activeTab === 'gradient' && (
        <div className="space-y-3">
          <div className="text-[11px] text-stone-500">
            Apply vibrant gradient text across the entire heading:
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {GRADIENT_PRESETS.map((g) => (
              <button
                key={g.name}
                onClick={() => {
                  onUpdateStyle('background', g.style);
                  onUpdateStyle('-webkit-background-clip', 'text');
                  onUpdateStyle('-webkit-text-fill-color', 'transparent');
                  onUpdateStyle('display', 'inline-block');
                }}
                className="h-12 rounded-lg border border-stone-200 flex flex-col justify-end p-2 text-left transition-transform hover:scale-[1.02] shadow-2xs"
                style={{ background: g.style }}
              >
                <span className="text-[11px] font-bold text-white drop-shadow-xs">{g.name}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                onUpdateStyle('background', '');
                onUpdateStyle('-webkit-background-clip', '');
                onUpdateStyle('-webkit-text-fill-color', '');
              }}
              className="w-full py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded"
            >
              Remove Gradient Text
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: DIRECT HTML & PLAIN TEXT
         ======================================================== */}
      {activeTab === 'html' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Direct HTML Markup (with spans):</span>
            <button
              onClick={handleResetToPlain}
              className="text-[10px] text-indigo-600 font-bold hover:underline"
            >
              Strip All Spans
            </button>
          </div>
          <textarea
            rows={3}
            value={rawHtml}
            onChange={(e) => onUpdateHtml(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
            placeholder="Edit raw heading HTML with spans..."
          />
        </div>
      )}
    </div>
  );
};
