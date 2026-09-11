import React, { useState, useMemo, useEffect } from 'react';
import { SelectedElementInfo, Section } from '../types';
import { HeaderStudio } from './HeaderStudio';
import { ImageStudio } from './ImageStudio';
import { SectionStudio } from './SectionStudio';
import { TransitionStudio } from './TransitionStudio';
import { GridStudio } from './GridStudio';
import { GradientPresetLibrary } from './GradientPresetLibrary';
import {
  Type,
  Palette,
  Square,
  Maximize2,
  Layout,
  Grid,
  Columns,
  Rows,
  LayoutGrid,
  Boxes,
  Sliders,
  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowUp,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Sun,
  Layers,
  Wand2,
  RefreshCw,
  RotateCw,
  Edit3,
  Pencil,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import {
  SHADOW_PRESETS,
  TEXT_SHADOW_PRESETS,
  GRADIENT_PRESETS,
  HOVER_LIFT_PRESETS,
  HOVER_SCALE_PRESETS,
  HOVER_SHADOW_PRESETS,
  TRANSITION_SPEED_PRESETS,
  parseBoxShadow,
  formatBoxShadow,
  parsePixelNumber,
  ParsedBoxShadow
} from '../utils/styleHelpers';

interface InspectorPanelProps {
  selectedElement: SelectedElementInfo | null;
  activeSection?: Section | null;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateHoverStyle?: (property: string, value: string) => void;
  onUpdateAttribute: (name: string, value: string) => void;
  onUpdateText: (text: string) => void;
  onUpdateHtml?: (html: string) => void;
  onChangeTag?: (newTag: string) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onSelectParent: (selector: string) => void;
  onSelectActiveSection?: () => void;
  onSelectElementByTag?: (tagName: string) => void;
  previewHover?: boolean;
  onTogglePreviewHover?: () => void;
}

const GOOGLE_FONTS = [
  'Plus Jakarta Sans',
  'Playfair Display',
  'Inter',
  'Outfit',
  'Lora',
  'Fira Code',
  'Poppins',
  'Montserrat',
  'Georgia',
  'system-ui',
];

const PRESET_COLORS = [
  '#0f172a', '#1e293b', '#475569', '#94a3b8', '#ffffff',
  '#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#fafaf9', '#f1f5f9'
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedElement,
  activeSection,
  onUpdateStyle,
  onUpdateHoverStyle,
  onUpdateAttribute,
  onUpdateText,
  onUpdateHtml,
  onChangeTag,
  onDeleteElement,
  onDuplicateElement,
  onSelectParent,
  onSelectActiveSection,
  onSelectElementByTag,
  previewHover = false,
  onTogglePreviewHover,
}) => {
  // Editing state mode: normal styling or hover styling
  const [activeStateTab, setActiveStateTab] = useState<'normal' | 'hover'>('normal');

  // Background tab: solid, gradient, or image
  const [bgTab, setBgTab] = useState<'solid' | 'gradient' | 'image'>('solid');

  // Shadow mode: presets or custom builder
  const [shadowMode, setShadowMode] = useState<'presets' | 'custom'>('presets');

  // Individual corner radii toggle
  const [isIndividualCorners, setIsIndividualCorners] = useState<boolean>(false);

  // Accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    headerStudio: true,
    imageStudio: true,
    sectionStudio: true,
    gridStudio: true,
    hoverStudio: true,
    transitions: true,
    shadows: true,
    gradientLibrary: true,
    typography: true,
    colors: true,
    shapes: true,
    spacing: true,
    layout: false,
    content: true,
    transforms: false,
  });

  const toggleSection = (secKey: string) => {
    setOpenSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  // Contextual element type detection
  const isHeader = selectedElement ? /^h[1-6]$/i.test(selectedElement.tagName) : false;
  const isText = selectedElement
    ? isHeader ||
      ['p', 'span', 'b', 'strong', 'em', 'i', 'li', 'blockquote', 'a', 'button', 'label'].includes(selectedElement.tagName.toLowerCase()) ||
      (Boolean(selectedElement.textContent && selectedElement.textContent.trim().length > 0) &&
       !['section', 'header', 'footer', 'body', 'html', 'main', 'nav'].includes(selectedElement.tagName.toLowerCase()))
    : false;
  const isImage = selectedElement ? selectedElement.tagName === 'img' : false;
  const isSection = selectedElement ? (
    selectedElement.tagName === 'section' ||
    selectedElement.tagName === 'header' ||
    selectedElement.tagName === 'footer' ||
    selectedElement.selector.endsWith('> :first-child') ||
    selectedElement.selector.includes('data-section-wrapper')
  ) : false;
  const isContainer = selectedElement ? (
    ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'ul', 'ol', 'form', 'body'].includes(selectedElement.tagName.toLowerCase()) ||
    selectedElement.inlineStyles?.['display'] === 'grid' ||
    selectedElement.inlineStyles?.['display'] === 'inline-grid' ||
    selectedElement.inlineStyles?.['display'] === 'flex'
  ) : false;
  const isGrid = selectedElement ? (
    selectedElement.inlineStyles?.['display'] === 'grid' ||
    selectedElement.inlineStyles?.['display'] === 'inline-grid'
  ) : false;

  // Auto-open contextual studio based on what was clicked
  useEffect(() => {
    if (!selectedElement) return;
    const isHead = /^h[1-6]$/i.test(selectedElement.tagName);
    const isTxt = isHead || ['p', 'span', 'b', 'strong'].includes(selectedElement.tagName);
    const isImg = selectedElement.tagName === 'img';
    const isSec = selectedElement.tagName === 'section' ||
                  selectedElement.tagName === 'header' ||
                  selectedElement.tagName === 'footer' ||
                  selectedElement.selector.endsWith('> :first-child') ||
                  selectedElement.selector.includes('data-section-wrapper');
    const isGrd = selectedElement.inlineStyles?.['display'] === 'grid' ||
                  selectedElement.inlineStyles?.['display'] === 'inline-grid';
    const isCont = ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'ul', 'ol', 'form'].includes(selectedElement.tagName.toLowerCase()) || isGrd;

    setOpenSections((prev) => ({
      ...prev,
      headerStudio: isHead || isTxt,
      imageStudio: isImg,
      sectionStudio: isSec,
      gridStudio: isGrd || isCont,
      typography: isHead || isTxt,
      hoverStudio: isHead || selectedElement.tagName === 'button' || selectedElement.tagName === 'a',
      colors: true,
      spacing: isSec,
      shapes: isImg || selectedElement.tagName === 'button' || selectedElement.tagName === 'a',
      shadows: true,
      gradientLibrary: true,
      content: !isHead && !isImg && !isSec,
    }));
  }, [selectedElement?.selector, selectedElement?.tagName]);

  if (!selectedElement) {
    return (
      <aside
        id="visual-inspector-empty"
        className="w-80 bg-white border-l border-stone-200 p-6 flex flex-col items-center justify-center text-center shrink-0 select-none z-20"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-2xs">
          <Sliders className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-stone-800 mb-1.5">Visual Redesign Inspector</h3>
        <p className="text-xs text-stone-500 leading-relaxed max-w-[240px] mb-5">
          Click any text, button, card, image or section directly in the canvas to redesign fonts, colors, shapes, drop shadows, and hover animations.
        </p>
        {activeSection && onSelectActiveSection && (
          <button
            id="inspect-active-section-btn"
            onClick={onSelectActiveSection}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Redesign &lt;{activeSection.tagName}&gt; {activeSection.name}</span>
          </button>
        )}
      </aside>
    );
  }

  const styles = selectedElement.inlineStyles || {};
  const hoverStyles = selectedElement.hoverStyles || {};

  // Dispatches style update depending on normal vs hover state tab
  const handleSmartStyleUpdate = (property: string, value: string) => {
    if (activeStateTab === 'hover' && onUpdateHoverStyle) {
      onUpdateHoverStyle(property, value);
    } else {
      onUpdateStyle(property, value);
    }
  };

  // Helper values for sliders
  const currentFontSize = parsePixelNumber(styles['font-size'], 16);
  const currentOpacity = styles['opacity'] ? parseFloat(styles['opacity']) * 100 : 100;
  const currentBorderRadius = parsePixelNumber(styles['border-radius'], 0);
  const currentBackdropBlur = parsePixelNumber(
    styles['backdrop-filter']?.replace('blur(', '').replace('px)', ''),
    0
  );

  // Parsed custom box shadow
  const activeBoxShadowString = activeStateTab === 'hover'
    ? (hoverStyles['box-shadow'] || styles['box-shadow'] || '')
    : (styles['box-shadow'] || '');

  const parsedCustomShadow = useMemo(() => {
    return parseBoxShadow(activeBoxShadowString);
  }, [activeBoxShadowString]);

  const updateCustomShadow = (updater: (prev: ParsedBoxShadow) => ParsedBoxShadow) => {
    const updated = updater(parsedCustomShadow);
    const formatted = formatBoxShadow(updated);
    handleSmartStyleUpdate('box-shadow', formatted);
  };

  // Hover transform helpers
  const currentHoverTransform = hoverStyles['transform'] || '';
  const currentHoverLift = HOVER_LIFT_PRESETS.find((p) => p.value !== 'none' && currentHoverTransform.includes(p.value))?.value || 'none';
  const currentHoverScale = HOVER_SCALE_PRESETS.find((p) => p.value !== 'none' && currentHoverTransform.includes(p.value))?.value || 'none';

  const updateHoverTransform = (newLift?: string, newScale?: string) => {
    const lift = newLift !== undefined ? newLift : currentHoverLift;
    const scale = newScale !== undefined ? newScale : currentHoverScale;

    const parts: string[] = [];
    if (lift && lift !== 'none') parts.push(lift);
    if (scale && scale !== 'none') parts.push(scale);

    const transformStr = parts.join(' ');
    if (onUpdateHoverStyle) {
      onUpdateHoverStyle('transform', transformStr);
      // Auto-ensure smooth transition is set
      if (!styles['transition']) {
        onUpdateStyle('transition', 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)');
      }
    }
  };

  const handleClearHoverStyles = () => {
    if (!onUpdateHoverStyle) return;
    ['background-color', 'background', 'color', 'border-color', 'border-width', 'box-shadow', 'transform', 'opacity'].forEach((prop) => {
      onUpdateHoverStyle(prop, '');
    });
  };

  return (
    <aside
      id="visual-inspector-panel"
      className="w-88 bg-white border-l border-stone-200 flex flex-col h-full shrink-0 select-none z-20 shadow-xs"
    >
      {/* 1. Header & Element Context */}
      <div className="p-3.5 border-b border-stone-200 bg-stone-50/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-mono text-[11px] font-bold uppercase tracking-wider">
              {selectedElement.tagName}
            </span>
            {selectedElement.elementId && (
              <span className="text-xs text-stone-500 font-mono truncate max-w-[90px]">
                #{selectedElement.elementId}
              </span>
            )}
            {selectedElement.classList.length > 0 && (
              <span className="text-[11px] text-stone-400 font-mono truncate max-w-[90px]">
                .{selectedElement.classList[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {selectedElement.breadcrumb.length > 1 && (
              <button
                onClick={() => {
                  const parent = selectedElement.breadcrumb[selectedElement.breadcrumb.length - 2];
                  if (parent) onSelectParent(parent.selector);
                }}
                className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title="Select Parent Container"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onDuplicateElement}
              className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
              title="Duplicate Element"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteElement}
              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-white rounded transition-colors"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section Context Badge with Quick Jump */}
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-stone-200/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-stone-600 truncate">
            <span className="font-semibold text-stone-400">Section:</span>
            <span className="font-bold text-stone-800 truncate max-w-[125px]">
              {activeSection?.name || 'Current Section'}
            </span>
          </div>
          {!isSection && onSelectActiveSection && (
            <button
              onClick={onSelectActiveSection}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1 shrink-0"
              title="Select and edit the full section container"
            >
              <Layers className="w-3 h-3" />
              <span>Edit Section</span>
            </button>
          )}
          {isSection && (
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded shrink-0">
              ⚡ Section Active
            </span>
          )}
        </div>

        {/* State Tab Switcher (Normal vs :hover) */}
        <div className="flex items-center justify-between gap-1 mt-2.5">
          <div className="grid grid-cols-2 p-0.5 bg-stone-200/80 rounded-lg flex-1">
            <button
              onClick={() => setActiveStateTab('normal')}
              className={`py-1 text-xs font-semibold rounded-md transition-all ${
                activeStateTab === 'normal'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Normal State
            </button>
            <button
              onClick={() => setActiveStateTab('hover')}
              className={`py-1 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeStateTab === 'hover'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>:hover State</span>
              {Object.keys(hoverStyles).length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>
          </div>

          {onTogglePreviewHover && (
            <button
              onClick={onTogglePreviewHover}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                previewHover
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs ring-2 ring-amber-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title={previewHover ? 'Click to turn off hover preview' : 'Click to preview hover state on canvas'}
            >
              {previewHover ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold">Preview</span>
            </button>
          )}
        </div>

        {activeStateTab === 'hover' && (
          <div className="mt-2 py-1.5 px-2.5 bg-indigo-50 border border-indigo-100 rounded-md text-[11px] text-indigo-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              Editing &lt;{selectedElement.tagName}&gt; hover effects
            </span>
            {Object.keys(hoverStyles).length > 0 && (
              <button
                onClick={handleClearHoverStyles}
                className="text-[10px] font-bold text-red-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Scrollable Style Controls */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100 text-xs">
        
        {/* ========================================================
            PRIMARY TEXT & CONTENT DIRECT EDITOR
           ======================================================== */}
        {isText && (
          <div className="p-4 bg-purple-50/40 border-b border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                <span>Text & Content</span>
                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-mono font-bold rounded">
                  &lt;{selectedElement.tagName.toUpperCase()}&gt;
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  window.postMessage({ type: 'START_INLINE_EDIT', selector: selectedElement.selector }, '*');
                }}
                className="text-[10px] font-semibold text-purple-700 bg-purple-100/80 hover:bg-purple-200 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors shadow-2xs"
                title="Type directly on the canvas"
              >
                <Pencil className="w-2.5 h-2.5" />
                <span>Type on Canvas</span>
              </button>
            </div>

            <textarea
              rows={isHeader ? 2 : 3}
              value={selectedElement.textContent}
              onChange={(e) => onUpdateText(e.target.value)}
              placeholder="Enter text or heading content..."
              className="w-full bg-white border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg p-2.5 text-xs text-stone-900 font-medium transition-all shadow-2xs resize-y"
            />

            {/* Tag Switcher for Headings / Paragraph / Span */}
            <div className="flex items-center justify-between gap-1 pt-1">
              <span className="text-[10px] font-semibold text-stone-500">HTML Tag:</span>
              <div className="flex items-center gap-1">
                {(['h1', 'h2', 'h3', 'h4', 'p', 'span'] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (onChangeTag) {
                        onChangeTag(tag);
                      } else {
                        window.postMessage({
                          type: 'CHANGE_ELEMENT_TAG',
                          selector: selectedElement.selector,
                          newTag: tag,
                        }, '*');
                      }
                    }}
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                      selectedElement.tagName.toLowerCase() === tag
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Text Formatting Toolbar */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-purple-100/70">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const isBold = styles['font-weight'] === '700' || styles['font-weight'] === '800' || styles['font-weight'] === 'bold';
                    handleSmartStyleUpdate('font-weight', isBold ? '400' : '700');
                  }}
                  className={`p-1.5 rounded border text-[11px] font-bold transition-all ${
                    styles['font-weight'] === '700' || styles['font-weight'] === '800' || styles['font-weight'] === 'bold'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isItalic = styles['font-style'] === 'italic';
                    handleSmartStyleUpdate('font-style', isItalic ? 'normal' : 'italic');
                  }}
                  className={`p-1.5 rounded border text-[11px] transition-all ${
                    styles['font-style'] === 'italic'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isUnderline = styles['text-decoration']?.includes('underline');
                    handleSmartStyleUpdate('text-decoration', isUnderline ? 'none' : 'underline');
                  }}
                  className={`p-1.5 rounded border text-[11px] transition-all ${
                    styles['text-decoration']?.includes('underline')
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                  title="Underline"
                >
                  <Underline className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Font Size Controls */}
              <div className="flex items-center gap-1 bg-white border border-stone-200 rounded px-1.5 py-0.5">
                <span className="text-[10px] text-stone-400 font-medium">Size:</span>
                <input
                  type="text"
                  value={styles['font-size'] || ''}
                  placeholder="32px"
                  onChange={(e) => handleSmartStyleUpdate('font-size', e.target.value)}
                  className="w-12 text-[11px] font-mono text-center outline-none bg-transparent"
                />
              </div>

              {/* Quick Color Picker */}
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={styles['color'] && styles['color'].startsWith('#') ? styles['color'] : '#0f172a'}
                  onChange={(e) => handleSmartStyleUpdate('color', e.target.value)}
                  className="w-6 h-6 rounded border border-stone-300 cursor-pointer p-0.5"
                  title="Text color"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            1. SECTION STUDIO (LAYOUT, BACKGROUND & SPACING)
           ======================================================== */}
        {activeSection && (isSection || openSections.sectionStudio) && (
          <div className="bg-indigo-50/20">
            <button
              onClick={() => toggleSection('sectionStudio')}
              className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Section Options & Layout</span>
                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">
                  {activeSection.name}
                </span>
              </span>
              {openSections.sectionStudio ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.sectionStudio && (
              <div className="px-4 pb-4">
                <SectionStudio
                  activeSection={activeSection}
                  selectedElement={selectedElement}
                  onUpdateStyle={handleSmartStyleUpdate}
                  onSelectElementByTag={onSelectElementByTag}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            2. HEADER & TEXT STUDIO (MULTI-COLOR, STYLES & FONTS)
           ======================================================== */}
        {(isHeader || isText) && (
          <div className="bg-purple-50/20">
            <button
              onClick={() => toggleSection('headerStudio')}
              className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Header & Text Styles Studio</span>
                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                  Multi-Color & Fonts
                </span>
              </span>
              {openSections.headerStudio ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.headerStudio && (
              <div className="px-4 pb-4">
                <HeaderStudio
                  selectedElement={selectedElement}
                  onUpdateStyle={handleSmartStyleUpdate}
                  onUpdateHtml={onUpdateHtml || ((html) => onUpdateText(html))}
                  onUpdateText={onUpdateText}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            3. IMAGE STUDIO (SRC, UNSPLASH, ASPECT RATIO & FILTERS)
           ======================================================== */}
        {isImage && (
          <div className="bg-sky-50/20">
            <button
              onClick={() => toggleSection('imageStudio')}
              className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Image Studio & Unsplash</span>
                <span className="px-1.5 py-0.2 bg-sky-100 text-sky-800 text-[10px] font-bold rounded">
                  Media
                </span>
              </span>
              {openSections.imageStudio ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.imageStudio && (
              <div className="px-4 pb-4">
                <ImageStudio
                  selectedElement={selectedElement}
                  onUpdateAttribute={onUpdateAttribute}
                  onUpdateStyle={handleSmartStyleUpdate}
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            4. CSS GRID LAYOUT CONTROLLER (CONTAINER ELEMENTS)
           ======================================================== */}
        {(isContainer || isGrid || openSections.gridStudio) && (
          <div id="inspector-section-grid" className="bg-indigo-50/15 border-t border-stone-200">
            <button
              onClick={() => toggleSection('gridStudio')}
              className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Grid className="w-3.5 h-3.5 text-indigo-600" />
                <span>CSS Grid Layout Controller</span>
                {isGrid && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-indigo-100 text-indigo-700 font-mono rounded font-bold">
                    Active Grid
                  </span>
                )}
                {!isGrid && isContainer && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-stone-100 text-stone-600 font-sans rounded">
                    Container
                  </span>
                )}
              </span>
              {openSections.gridStudio ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {openSections.gridStudio && (
              <div className="px-4 pb-4">
                <GridStudio
                  selectedElement={selectedElement}
                  onUpdateStyle={handleSmartStyleUpdate}
                />
              </div>
            )}
          </div>
        )}
        
        {/* ========================================================
            HOVER OPTIONS & ANIMATIONS (FEATURED STUDIO)
           ======================================================== */}
        <div className="bg-amber-50/25">
          <button
            onClick={() => toggleSection('hoverStudio')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hover Options & Movement</span>
              {Object.keys(hoverStyles).length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                  {Object.keys(hoverStyles).length} active
                </span>
              )}
            </span>
            {openSections.hoverStudio ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.hoverStudio && (
            <div className="px-4 pb-4 space-y-3.5">
              {/* Lift / Translate Y on Hover */}
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1.5">
                  Lift on Hover (3D Elevation)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {HOVER_LIFT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => updateHoverTransform(preset.value, undefined)}
                      className={`px-2 py-1.5 text-[11px] rounded border transition-all ${
                        currentHoverLift === preset.value
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale / Pop on Hover */}
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1.5">
                  Scale / Pop on Hover
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {HOVER_SCALE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => updateHoverTransform(undefined, preset.value)}
                      className={`px-2 py-1.5 text-[11px] rounded border transition-all ${
                        currentHoverScale === preset.value
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hover Drop Shadow */}
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1.5">
                  Shadow Elevation on Hover
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {HOVER_SHADOW_PRESETS.map((preset) => {
                    const isSelected = hoverStyles['box-shadow'] === preset.value || (!hoverStyles['box-shadow'] && preset.value === '');
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          if (onUpdateHoverStyle) {
                            onUpdateHoverStyle('box-shadow', preset.value);
                            if (!styles['transition']) onUpdateStyle('transition', 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)');
                          }
                        }}
                        className={`px-2 py-1.5 text-[10px] text-left rounded border transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hover Colors */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Hover Background
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={hoverStyles['background-color'] || '#4338ca'}
                      onChange={(e) => onUpdateHoverStyle && onUpdateHoverStyle('background-color', e.target.value)}
                      className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      placeholder="Same"
                      value={hoverStyles['background-color'] || ''}
                      onChange={(e) => onUpdateHoverStyle && onUpdateHoverStyle('background-color', e.target.value)}
                      className="flex-1 bg-white border border-stone-200 rounded px-1.5 py-1 text-[11px] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Hover Text Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={hoverStyles['color'] || '#ffffff'}
                      onChange={(e) => onUpdateHoverStyle && onUpdateHoverStyle('color', e.target.value)}
                      className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      placeholder="Same"
                      value={hoverStyles['color'] || ''}
                      onChange={(e) => onUpdateHoverStyle && onUpdateHoverStyle('color', e.target.value)}
                      className="flex-1 bg-white border border-stone-200 rounded px-1.5 py-1 text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Transition Speed & Easing */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-stone-600">
                    Transition Animation Timing
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSections((prev) => ({ ...prev, transitions: true }));
                      const el = document.getElementById('inspector-section-transitions');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Advanced Timing & Curve →
                  </button>
                </div>
                <select
                  value={styles['transition'] || 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'}
                  onChange={(e) => onUpdateStyle('transition', e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
                >
                  {TRANSITION_SPEED_PRESETS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            CSS TRANSITIONS & ANIMATIONS CONTROL PANEL
           ======================================================== */}
        <div id="inspector-section-transitions" className="border-t border-stone-200">
          <button
            onClick={() => toggleSection('transitions')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Animations & Transitions</span>
              {styles['transition'] && styles['transition'] !== 'none' && (
                <span className="px-1.5 py-0.5 text-[9px] bg-indigo-100 text-indigo-700 font-mono rounded">
                  {styles['transition'].split(' ')[1] || 'active'}
                </span>
              )}
            </span>
            {openSections.transitions ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.transitions && (
            <div className="px-4 pb-4">
              <TransitionStudio
                selectedElement={selectedElement}
                onUpdateStyle={onUpdateStyle}
                onUpdateHoverStyle={onUpdateHoverStyle}
                activeStateTab={activeStateTab}
              />
            </div>
          )}
        </div>

        {/* ========================================================
            DROP SHADOWS & GLOWS (SENIOR DESIGNER ENGINE)
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('shadows')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-indigo-600" />
              <span>Drop Shadows & Glows</span>
              {styles['box-shadow'] && styles['box-shadow'] !== 'none' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </span>
            {openSections.shadows ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.shadows && (
            <div className="px-4 pb-4 space-y-3">
              {/* Presets vs Custom Mode Switcher */}
              <div className="grid grid-cols-2 p-0.5 bg-stone-100 rounded border border-stone-200">
                <button
                  onClick={() => setShadowMode('presets')}
                  className={`py-1 text-[11px] font-semibold rounded ${
                    shadowMode === 'presets' ? 'bg-white shadow-2xs text-indigo-600' : 'text-stone-600'
                  }`}
                >
                  Curated Presets (12)
                </button>
                <button
                  onClick={() => setShadowMode('custom')}
                  className={`py-1 text-[11px] font-semibold rounded ${
                    shadowMode === 'custom' ? 'bg-white shadow-2xs text-indigo-600' : 'text-stone-600'
                  }`}
                >
                  Custom Builder
                </button>
              </div>

              {shadowMode === 'presets' ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {SHADOW_PRESETS.map((preset) => {
                    const isSelected = (activeStateTab === 'hover' ? hoverStyles['box-shadow'] : styles['box-shadow']) === preset.value;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleSmartStyleUpdate('box-shadow', preset.value)}
                        className={`p-2 rounded border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 font-bold'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="text-[11px] text-stone-800 font-semibold">{preset.name}</div>
                        <div className="text-[9px] text-stone-400 truncate mt-0.5">{preset.description}</div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Custom Shadow Builder */
                <div className="space-y-2.5 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {/* Real-time preview card */}
                  <div className="h-14 bg-white rounded-md flex items-center justify-center border border-stone-200 mb-2 overflow-hidden">
                    <div
                      className="px-4 py-1.5 bg-stone-50 rounded text-[11px] font-medium text-stone-700 transition-all"
                      style={{ boxShadow: formatBoxShadow(parsedCustomShadow) }}
                    >
                      Shadow Preview
                    </div>
                  </div>

                  {/* Inset Toggle */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-stone-600">Inset (Inner Shadow)</span>
                    <button
                      onClick={() => updateCustomShadow((prev) => ({ ...prev, inset: !prev.inset }))}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        parsedCustomShadow.inset
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {parsedCustomShadow.inset ? 'Inset ON' : 'Outset'}
                    </button>
                  </div>

                  {/* X Offset */}
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                      <span>Horizontal (X):</span>
                      <span>{parsedCustomShadow.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={parsedCustomShadow.offsetX}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateCustomShadow((prev) => ({ ...prev, offsetX: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Y Offset */}
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                      <span>Vertical (Y):</span>
                      <span>{parsedCustomShadow.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={parsedCustomShadow.offsetY}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateCustomShadow((prev) => ({ ...prev, offsetY: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Blur Radius */}
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                      <span>Blur Radius:</span>
                      <span>{parsedCustomShadow.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={parsedCustomShadow.blur}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateCustomShadow((prev) => ({ ...prev, blur: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Spread Radius */}
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                      <span>Spread Radius:</span>
                      <span>{parsedCustomShadow.spread}px</span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="40"
                      value={parsedCustomShadow.spread}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateCustomShadow((prev) => ({ ...prev, spread: val }));
                      }}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Shadow Color */}
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Shadow Color / Tone</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value="#000000"
                        onChange={(e) => {
                          const hex = e.target.value;
                          updateCustomShadow((prev) => ({
                            ...prev,
                            color: `${hex}33`,
                          }));
                        }}
                        className="w-6 h-6 rounded border border-stone-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={parsedCustomShadow.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCustomShadow((prev) => ({ ...prev, color: val }));
                        }}
                        className="flex-1 bg-white border border-stone-200 rounded px-2 py-0.5 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Text Shadow Options */}
              <div className="pt-2.5 border-t border-stone-100">
                <label className="block text-[11px] font-medium text-stone-600 mb-1.5">
                  Text Shadow (Headings & Typography)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {TEXT_SHADOW_PRESETS.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleSmartStyleUpdate('text-shadow', t.value)}
                      className={`px-2 py-1 text-[10px] rounded border truncate ${
                        styles['text-shadow'] === t.value
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            COLORS, GRADIENTS & GLASSMORPHISM
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('colors')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              Colors, Gradients & Blur
            </span>
            {openSections.colors ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.colors && (
            <div className="px-4 pb-4 space-y-3">
              {/* Background Sub-tabs: Solid | Gradient | Image */}
              <div className="grid grid-cols-3 p-0.5 bg-stone-100 rounded border border-stone-200 text-[11px]">
                <button
                  onClick={() => setBgTab('solid')}
                  className={`py-1 rounded font-semibold ${bgTab === 'solid' ? 'bg-white shadow-2xs text-indigo-600' : 'text-stone-600'}`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => setBgTab('gradient')}
                  className={`py-1 rounded font-semibold ${bgTab === 'gradient' ? 'bg-white shadow-2xs text-indigo-600' : 'text-stone-600'}`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setBgTab('image')}
                  className={`py-1 rounded font-semibold ${bgTab === 'image' ? 'bg-white shadow-2xs text-indigo-600' : 'text-stone-600'}`}
                >
                  Image
                </button>
              </div>

              {bgTab === 'solid' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-medium text-stone-500">Background Color</label>
                    <button
                      onClick={() => handleSmartStyleUpdate('background-color', 'transparent')}
                      className="text-[10px] text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles['background-color'] || '#ffffff'}
                      onChange={(e) => handleSmartStyleUpdate('background-color', e.target.value)}
                      className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={styles['background-color'] || ''}
                      placeholder="#ffffff or transparent"
                      onChange={(e) => handleSmartStyleUpdate('background-color', e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleSmartStyleUpdate('background-color', c)}
                        className="w-4 h-4 rounded-full border border-stone-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {bgTab === 'gradient' && (
                <div className="space-y-2">
                  <GradientPresetLibrary
                    currentBackground={styles['background'] || styles['background-image'] || ''}
                    onApplyGradient={(grad) => {
                      handleSmartStyleUpdate('background', grad);
                      handleSmartStyleUpdate('background-color', 'transparent');
                      handleSmartStyleUpdate('background-image', 'none');
                    }}
                    onClearBackground={() => {
                      handleSmartStyleUpdate('background', 'none');
                      handleSmartStyleUpdate('background-color', 'transparent');
                      handleSmartStyleUpdate('background-image', 'none');
                    }}
                  />
                </div>
              )}

              {bgTab === 'image' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-medium text-stone-500 block mb-1">Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={styles['background-image'] ? styles['background-image'].replace(/^url\(["']?/, '').replace(/["']?\)$/, '') : ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        handleSmartStyleUpdate('background-image', val ? `url('${val}')` : 'none');
                        if (val && !styles['background-size']) {
                          handleSmartStyleUpdate('background-size', 'cover');
                          handleSmartStyleUpdate('background-position', 'center');
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Size</label>
                      <select
                        value={styles['background-size'] || 'cover'}
                        onChange={(e) => handleSmartStyleUpdate('background-size', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1 text-xs"
                      >
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 block mb-0.5">Position</label>
                      <select
                        value={styles['background-position'] || 'center'}
                        onChange={(e) => handleSmartStyleUpdate('background-position', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1 text-xs"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Glassmorphism Backdrop Blur */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex justify-between text-[11px] font-medium text-stone-500 mb-1">
                  <span>Glassmorphism (Backdrop Blur)</span>
                  <span>{currentBackdropBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={currentBackdropBlur}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleSmartStyleUpdate('backdrop-filter', val > 0 ? `blur(${val}px)` : 'none');
                    handleSmartStyleUpdate('-webkit-backdrop-filter', val > 0 ? `blur(${val}px)` : 'none');
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Opacity */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex justify-between text-[11px] font-medium text-stone-500 mb-1">
                  <span>Opacity</span>
                  <span>{Math.round(currentOpacity)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentOpacity}
                  onChange={(e) => handleSmartStyleUpdate('opacity', (parseFloat(e.target.value) / 100).toString())}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            GRADIENT PRESET LIBRARY (MODERN CSS: LINEAR, RADIAL, CONIC)
           ======================================================== */}
        <div id="inspector-section-gradient-library" className="border-t border-stone-200">
          <button
            onClick={() => toggleSection('gradientLibrary')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Gradient Preset Library</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-indigo-50 text-indigo-700 font-mono rounded font-semibold">
                Linear · Radial · Conic
              </span>
            </span>
            {openSections.gradientLibrary ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.gradientLibrary && (
            <div className="px-4 pb-4">
              <GradientPresetLibrary
                currentBackground={styles['background'] || styles['background-image'] || ''}
                onApplyGradient={(grad) => {
                  handleSmartStyleUpdate('background', grad);
                  handleSmartStyleUpdate('background-color', 'transparent');
                  handleSmartStyleUpdate('background-image', 'none');
                }}
                onClearBackground={() => {
                  handleSmartStyleUpdate('background', 'none');
                  handleSmartStyleUpdate('background-color', 'transparent');
                  handleSmartStyleUpdate('background-image', 'none');
                }}
              />
            </div>
          )}
        </div>

        {/* ========================================================
            TYPOGRAPHY
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('typography')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              Typography & Fonts
            </span>
            {openSections.typography ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.typography && (
            <div className="px-4 pb-4 space-y-3">
              {/* Font Family */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Font Family
                </label>
                <select
                  value={styles['font-family']?.replace(/['"]/g, '') || 'Inter'}
                  onChange={(e) => handleSmartStyleUpdate('font-family', `'${e.target.value}', sans-serif`)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1.5 text-xs font-medium"
                >
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-stone-500 mb-1">
                    <span>Size</span>
                    <span>{currentFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={currentFontSize}
                    onChange={(e) => handleSmartStyleUpdate('font-size', `${e.target.value}px`)}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Weight</label>
                  <select
                    value={styles['font-weight'] || '400'}
                    onChange={(e) => handleSmartStyleUpdate('font-weight', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles['color'] || '#1e293b'}
                    onChange={(e) => handleSmartStyleUpdate('color', e.target.value)}
                    className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={styles['color'] || ''}
                    placeholder="#1e293b"
                    onChange={(e) => handleSmartStyleUpdate('color', e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Text Align */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Alignment
                </label>
                <div className="grid grid-cols-4 gap-1 bg-stone-100 p-0.5 rounded border border-stone-200">
                  <button
                    onClick={() => handleSmartStyleUpdate('text-align', 'left')}
                    className={`py-1 flex justify-center rounded ${styles['text-align'] === 'left' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-stone-600'}`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSmartStyleUpdate('text-align', 'center')}
                    className={`py-1 flex justify-center rounded ${styles['text-align'] === 'center' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-stone-600'}`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSmartStyleUpdate('text-align', 'right')}
                    className={`py-1 flex justify-center rounded ${styles['text-align'] === 'right' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-stone-600'}`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSmartStyleUpdate('text-align', 'justify')}
                    className={`py-1 flex justify-center rounded ${styles['text-align'] === 'justify' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-stone-600'}`}
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Line Height & Letter Spacing */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Line Height</label>
                  <input
                    type="text"
                    value={styles['line-height'] || ''}
                    placeholder="1.5 or 24px"
                    onChange={(e) => handleSmartStyleUpdate('line-height', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Letter Spacing</label>
                  <input
                    type="text"
                    value={styles['letter-spacing'] || ''}
                    placeholder="-0.5px or 1px"
                    onChange={(e) => handleSmartStyleUpdate('letter-spacing', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>

              {/* Text Transform & Decoration */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Transform</label>
                  <select
                    value={styles['text-transform'] || 'none'}
                    onChange={(e) => handleSmartStyleUpdate('text-transform', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="none">Normal</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Decoration</label>
                  <select
                    value={styles['text-decoration'] || 'none'}
                    onChange={(e) => handleSmartStyleUpdate('text-decoration', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="none">None</option>
                    <option value="underline">Underline</option>
                    <option value="line-through">Strikethrough</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SHAPES, BORDERS & RADII
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('shapes')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Square className="w-3.5 h-3.5 text-indigo-600" />
              Shapes, Borders & Radii
            </span>
            {openSections.shapes ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.shapes && (
            <div className="px-4 pb-4 space-y-3">
              {/* Corner Radius Controls */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-medium text-stone-500 mb-1">
                  <span>Corner Radius (Curvature)</span>
                  <button
                    onClick={() => setIsIndividualCorners(!isIndividualCorners)}
                    className="text-[10px] text-indigo-600 hover:underline font-bold"
                  >
                    {isIndividualCorners ? 'Unified Radius' : 'Individual 4 Corners'}
                  </button>
                </div>

                {!isIndividualCorners ? (
                  <>
                    <input
                      type="range"
                      min="0"
                      max="48"
                      value={currentBorderRadius}
                      onChange={(e) => handleSmartStyleUpdate('border-radius', `${e.target.value}px`)}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex gap-1 mt-1 text-[10px] text-stone-500">
                      <button onClick={() => handleSmartStyleUpdate('border-radius', '0px')} className="px-2 py-0.5 bg-stone-100 rounded">0</button>
                      <button onClick={() => handleSmartStyleUpdate('border-radius', '6px')} className="px-2 py-0.5 bg-stone-100 rounded">6px</button>
                      <button onClick={() => handleSmartStyleUpdate('border-radius', '12px')} className="px-2 py-0.5 bg-stone-100 rounded">12px</button>
                      <button onClick={() => handleSmartStyleUpdate('border-radius', '24px')} className="px-2 py-0.5 bg-stone-100 rounded">24px</button>
                      <button onClick={() => handleSmartStyleUpdate('border-radius', '9999px')} className="px-2 py-0.5 bg-stone-100 rounded">Pill</button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-4 gap-1 text-[11px]">
                    <div>
                      <span className="text-[10px] text-stone-400">TL</span>
                      <input
                        type="text"
                        placeholder="0px"
                        value={styles['border-top-left-radius'] || ''}
                        onChange={(e) => handleSmartStyleUpdate('border-top-left-radius', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400">TR</span>
                      <input
                        type="text"
                        placeholder="0px"
                        value={styles['border-top-right-radius'] || ''}
                        onChange={(e) => handleSmartStyleUpdate('border-top-right-radius', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400">BR</span>
                      <input
                        type="text"
                        placeholder="0px"
                        value={styles['border-bottom-right-radius'] || ''}
                        onChange={(e) => handleSmartStyleUpdate('border-bottom-right-radius', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400">BL</span>
                      <input
                        type="text"
                        placeholder="0px"
                        value={styles['border-bottom-left-radius'] || ''}
                        onChange={(e) => handleSmartStyleUpdate('border-bottom-left-radius', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Border Width & Style */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Width</label>
                  <select
                    value={styles['border-width'] || '0px'}
                    onChange={(e) => {
                      handleSmartStyleUpdate('border-width', e.target.value);
                      if (!styles['border-style']) handleSmartStyleUpdate('border-style', 'solid');
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="0px">None (0)</option>
                    <option value="1px">1px</option>
                    <option value="2px">2px</option>
                    <option value="3px">3px</option>
                    <option value="4px">4px</option>
                    <option value="6px">6px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Style</label>
                  <select
                    value={styles['border-style'] || 'solid'}
                    onChange={(e) => handleSmartStyleUpdate('border-style', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Border Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles['border-color'] || '#e2e8f0'}
                    onChange={(e) => handleSmartStyleUpdate('border-color', e.target.value)}
                    className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={styles['border-color'] || ''}
                    placeholder="#e2e8f0"
                    onChange={(e) => handleSmartStyleUpdate('border-color', e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            SPACING & SIZING (BOX MODEL)
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('spacing')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
              Spacing, Sizing & Box Model
            </span>
            {openSections.spacing ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.spacing && (
            <div className="px-4 pb-4 space-y-3">
              {/* Padding */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Padding (Inner Space)
                </label>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-stone-400">Top</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['padding-top'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('padding-top', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Right</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['padding-right'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('padding-right', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Bottom</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['padding-bottom'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('padding-bottom', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Left</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['padding-left'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('padding-left', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-stone-500">
                    Margin (Outer Space)
                  </label>
                  <button
                    onClick={() => {
                      handleSmartStyleUpdate('margin-left', 'auto');
                      handleSmartStyleUpdate('margin-right', 'auto');
                    }}
                    className="text-[10px] text-indigo-600 font-bold hover:underline"
                    title="Center block element horizontally"
                  >
                    Center Block (Margin Auto)
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-stone-400">Top</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['margin-top'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('margin-top', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Right</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['margin-right'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('margin-right', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Bottom</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['margin-bottom'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('margin-bottom', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Left</span>
                    <input
                      type="text"
                      placeholder="0px"
                      value={styles['margin-left'] || ''}
                      onChange={(e) => handleSmartStyleUpdate('margin-left', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-1.5 py-1"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Max Width</label>
                  <input
                    type="text"
                    value={styles['max-width'] || ''}
                    placeholder="1200px or 100%"
                    onChange={(e) => handleSmartStyleUpdate('max-width', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Min Height</label>
                  <input
                    type="text"
                    value={styles['min-height'] || ''}
                    placeholder="auto or 400px"
                    onChange={(e) => handleSmartStyleUpdate('min-height', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            FLEXBOX & GRID LAYOUT
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('layout')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layout className="w-3.5 h-3.5 text-indigo-600" />
              Flexbox & Grid Layout
            </span>
            {openSections.layout ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.layout && (
            <div className="px-4 pb-4 space-y-3">
              {/* Display */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Display</label>
                <select
                  value={styles['display'] || 'block'}
                  onChange={(e) => handleSmartStyleUpdate('display', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                >
                  <option value="block">Block</option>
                  <option value="flex">Flex</option>
                  <option value="inline-flex">Inline-Flex</option>
                  <option value="grid">Grid</option>
                  <option value="inline-block">Inline-Block</option>
                  <option value="inline">Inline</option>
                  <option value="none">None (Hidden)</option>
                </select>
              </div>

              {/* If Flex */}
              {(styles['display'] === 'flex' || styles['display'] === 'inline-flex') && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Direction</label>
                      <select
                        value={styles['flex-direction'] || 'row'}
                        onChange={(e) => handleSmartStyleUpdate('flex-direction', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="row">Row (Horizontal)</option>
                        <option value="column">Column (Vertical)</option>
                        <option value="row-reverse">Row Reverse</option>
                        <option value="column-reverse">Column Reverse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Justify</label>
                      <select
                        value={styles['justify-content'] || 'flex-start'}
                        onChange={(e) => handleSmartStyleUpdate('justify-content', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                        <option value="space-around">Space Around</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Align Items</label>
                      <select
                        value={styles['align-items'] || 'stretch'}
                        onChange={(e) => handleSmartStyleUpdate('align-items', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="stretch">Stretch</option>
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Gap</label>
                      <input
                        type="text"
                        value={styles['gap'] || ''}
                        placeholder="16px or 1.5rem"
                        onChange={(e) => handleSmartStyleUpdate('gap', e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* If Grid */}
              {(styles['display'] === 'grid' || styles['display'] === 'inline-grid') && (
                <div className="pt-2 border-t border-stone-200">
                  <GridStudio
                    selectedElement={selectedElement}
                    onUpdateStyle={handleSmartStyleUpdate}
                  />
                </div>
              )}

              {/* Quick switch to Grid if not currently grid */}
              {styles['display'] !== 'grid' && styles['display'] !== 'inline-grid' && (
                <div className="pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => handleSmartStyleUpdate('display', 'grid')}
                    className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-indigo-200"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Switch to CSS Grid Visual Controller</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            TRANSFORMS & FILTERS
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('transforms')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
              Transforms & CSS Filters
            </span>
            {openSections.transforms ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.transforms && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Transform</label>
                <input
                  type="text"
                  placeholder="scale(1.05) or rotate(2deg)"
                  value={styles['transform'] || ''}
                  onChange={(e) => handleSmartStyleUpdate('transform', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">CSS Filter (Grayscale / Blur / Brightness)</label>
                <input
                  type="text"
                  placeholder="grayscale(100%) or brightness(1.1)"
                  value={styles['filter'] || ''}
                  onChange={(e) => handleSmartStyleUpdate('filter', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            CONTENT, LINKS & ATTRIBUTES
           ======================================================== */}
        <div>
          <button
            onClick={() => toggleSection('content')}
            className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
              Content, Links & Attributes
            </span>
            {openSections.content ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openSections.content && (
            <div className="px-4 pb-4 space-y-3">
              {/* Text Edit */}
              {selectedElement.textContent !== undefined && (
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Text Content</label>
                  <textarea
                    rows={2}
                    value={selectedElement.textContent}
                    onChange={(e) => onUpdateText(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                    placeholder="Edit text content..."
                  />
                </div>
              )}

              {/* Link href if <a> */}
              {selectedElement.tagName === 'a' && (
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Destination URL (href)</label>
                  <input
                    type="text"
                    value={selectedElement.attributes['href'] || '#'}
                    onChange={(e) => onUpdateAttribute('href', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              )}

              {/* Image src if <img> */}
              {selectedElement.tagName === 'img' && (
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Image Source (src)</label>
                  <input
                    type="text"
                    value={selectedElement.attributes['src'] || ''}
                    onChange={(e) => onUpdateAttribute('src', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              )}

              {/* Element ID */}
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">HTML ID</label>
                <input
                  type="text"
                  value={selectedElement.attributes['id'] || ''}
                  placeholder="custom-id"
                  onChange={(e) => onUpdateAttribute('id', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};
