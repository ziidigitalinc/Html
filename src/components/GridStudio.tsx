import React, { useState, useMemo } from 'react';
import { SelectedElementInfo } from '../types';
import {
  Grid,
  Columns,
  Rows,
  Maximize2,
  Sliders,
  Sparkles,
  Link,
  Unlink,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  MoveHorizontal,
  MoveVertical,
  Boxes,
  LayoutGrid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  ParsedGridConfig,
  parseGridConfig,
  formatGridColumns,
  formatGridRows,
  GRID_LAYOUT_PRESETS,
  GAP_PRESETS,
  GridPreset
} from '../utils/styleHelpers';

interface GridStudioProps {
  selectedElement: SelectedElementInfo;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateStyles?: (styles: Record<string, string>) => void;
}

export const GridStudio: React.FC<GridStudioProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateStyles,
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'alignment' | 'presets' | 'item'>('layout');
  const [copied, setCopied] = useState<boolean>(false);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);

  const styles = selectedElement.inlineStyles || {};
  const isGrid = styles['display'] === 'grid' || styles['display'] === 'inline-grid';

  // Parse current grid configuration
  const gridConfig = useMemo(() => {
    return parseGridConfig(styles);
  }, [
    styles['grid-template-columns'],
    styles['grid-template-rows'],
    styles['gap'],
    styles['row-gap'],
    styles['column-gap'],
    styles['justify-items'],
    styles['align-items'],
    styles['justify-content'],
    styles['align-content'],
    styles['grid-auto-flow'],
    styles['grid-auto-rows'],
  ]);

  // Helper to commit grid updates
  const updateGrid = (updater: (prev: ParsedGridConfig) => ParsedGridConfig) => {
    const updated = updater(gridConfig);
    const updates: Record<string, string> = {
      display: styles['display'] === 'inline-grid' ? 'inline-grid' : 'grid',
      'grid-template-columns': formatGridColumns(updated),
    };

    if (updated.rowMode === 'auto') {
      updates['grid-template-rows'] = 'none';
      if (updated.autoRowHeight && updated.autoRowHeight !== 'auto') {
        updates['grid-auto-rows'] = updated.autoRowHeight;
      }
    } else {
      updates['grid-template-rows'] = formatGridRows(updated);
    }

    if (updated.gapLinked) {
      updates['gap'] = `${updated.gapPx}px`;
      updates['row-gap'] = '';
      updates['column-gap'] = '';
    } else {
      updates['row-gap'] = `${updated.rowGapPx}px`;
      updates['column-gap'] = `${updated.colGapPx}px`;
      updates['gap'] = '';
    }

    updates['justify-items'] = updated.justifyItems;
    updates['align-items'] = updated.alignItems;
    updates['justify-content'] = updated.justifyContent;
    updates['align-content'] = updated.alignContent;

    if (onUpdateStyles) {
      onUpdateStyles(updates);
    } else {
      Object.entries(updates).forEach(([prop, val]) => {
        if (val) onUpdateStyle(prop, val);
      });
    }
  };

  // Turn CSS Grid ON
  const handleEnableGrid = () => {
    const updates: Record<string, string> = {
      display: 'grid',
      'grid-template-columns': 'repeat(3, minmax(0, 1fr))',
      gap: '20px',
      'align-items': 'stretch',
    };
    if (onUpdateStyles) {
      onUpdateStyles(updates);
    } else {
      Object.entries(updates).forEach(([prop, val]) => onUpdateStyle(prop, val));
    }
  };

  // Turn CSS Grid OFF (revert to block)
  const handleDisableGrid = () => {
    onUpdateStyle('display', 'block');
  };

  // Apply a preset
  const handleApplyPreset = (preset: GridPreset) => {
    const updates: Record<string, string> = {
      display: 'grid',
      'grid-template-columns': preset.columns,
      gap: preset.gap,
      'align-items': preset.alignItems || 'stretch',
      'justify-items': preset.justifyItems || 'stretch',
    };
    if (preset.rows) {
      updates['grid-template-rows'] = preset.rows;
    }

    if (onUpdateStyles) {
      onUpdateStyles(updates);
    } else {
      Object.entries(updates).forEach(([k, v]) => onUpdateStyle(k, v));
    }
  };

  // Copy CSS string
  const handleCopyCSS = () => {
    const cssLines = [
      `display: ${styles['display'] || 'grid'};`,
      `grid-template-columns: ${formatGridColumns(gridConfig)};`,
      gridConfig.rowMode !== 'auto' ? `grid-template-rows: ${formatGridRows(gridConfig)};` : null,
      gridConfig.gapLinked ? `gap: ${gridConfig.gapPx}px;` : `row-gap: ${gridConfig.rowGapPx}px;\ncolumn-gap: ${gridConfig.colGapPx}px;`,
      gridConfig.justifyItems !== 'stretch' ? `justify-items: ${gridConfig.justifyItems};` : null,
      gridConfig.alignItems !== 'stretch' ? `align-items: ${gridConfig.alignItems};` : null,
      gridConfig.justifyContent !== 'start' ? `justify-content: ${gridConfig.justifyContent};` : null,
      gridConfig.alignContent !== 'start' ? `align-content: ${gridConfig.alignContent};` : null,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(cssLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Calculate simulated preview items count
  const previewItemCount = useMemo(() => {
    if (gridConfig.columnMode === 'auto-fit' || gridConfig.columnMode === 'auto-fill') {
      return 6;
    }
    const cols = Math.max(1, gridConfig.columns);
    const rows = gridConfig.rowMode === 'equal' ? Math.max(1, gridConfig.rows) : 2;
    return Math.min(12, cols * rows);
  }, [gridConfig.columns, gridConfig.rowMode, gridConfig.rows, gridConfig.columnMode]);

  return (
    <div id="css-grid-studio-controller" className="space-y-4">
      {/* Activate Grid Banner if element is currently not display: grid */}
      {!isGrid && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">CSS Grid Layout Inactive</div>
              <div className="text-[10px] text-stone-500">
                Element is currently <code className="font-mono text-indigo-700 bg-indigo-100/70 px-1 py-0.5 rounded">{styles['display'] || 'block'}</code>. Convert to CSS Grid for visual 2D controls.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEnableGrid}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Enable CSS Grid on Container</span>
          </button>
        </div>
      )}

      {/* Grid Header & Quick Status */}
      {isGrid && (
        <div className="flex items-center justify-between p-2 bg-indigo-50/60 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-bold text-stone-900">CSS Grid Active</span>
            <span className="text-[10px] font-mono text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
              {gridConfig.columnMode === 'auto-fit' ? 'Auto-Fit' : `${gridConfig.columns} Cols`} · {gridConfig.gapLinked ? `${gridConfig.gapPx}px` : `${gridConfig.rowGapPx}×${gridConfig.colGapPx}px`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDisableGrid}
            className="text-[10px] text-stone-500 hover:text-rose-600 font-semibold transition-colors"
          >
            Disable Grid
          </button>
        </div>
      )}

      {/* ========================================================
          VISUAL INTERACTIVE MINI-GRID PREVIEW WIREFRAME
         ======================================================== */}
      <div className="p-3 bg-gradient-to-b from-stone-50 to-stone-100/70 rounded-xl border border-stone-200/80 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-800 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
            <span>Visual Grid Wireframe</span>
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            {gridConfig.columns} Cols · {gridConfig.gapLinked ? `${gridConfig.gapPx}px gap` : `${gridConfig.rowGapPx}r / ${gridConfig.colGapPx}c`}
          </span>
        </div>

        {/* Live Mini Grid Sandbox */}
        <div
          className="p-3 bg-white rounded-lg border border-stone-200/90 shadow-inner min-h-[96px] flex items-center justify-center overflow-hidden transition-all"
        >
          <div
            className="w-full transition-all"
            style={{
              display: 'grid',
              gridTemplateColumns:
                gridConfig.columnMode === 'auto-fit'
                  ? `repeat(auto-fit, minmax(${Math.max(40, Math.round(gridConfig.autoFitMinPx / 4))}px, 1fr))`
                  : gridConfig.columnMode === 'auto-fill'
                  ? `repeat(auto-fill, minmax(${Math.max(40, Math.round(gridConfig.autoFitMinPx / 4))}px, 1fr))`
                  : `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
              gap: gridConfig.gapLinked
                ? `${Math.max(4, Math.round(gridConfig.gapPx / 2.5))}px`
                : `${Math.max(4, Math.round(gridConfig.rowGapPx / 2.5))}px ${Math.max(4, Math.round(gridConfig.colGapPx / 2.5))}px`,
              justifyItems: gridConfig.justifyItems,
              alignItems: gridConfig.alignItems,
            }}
          >
            {Array.from({ length: previewItemCount }).map((_, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCellIndex(i)}
                onMouseLeave={() => setHoveredCellIndex(null)}
                className={`h-9 rounded border flex items-center justify-center text-[10px] font-mono font-bold transition-all select-none cursor-default ${
                  hoveredCellIndex === i
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.03]'
                    : 'bg-indigo-50/70 border-indigo-200/90 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Helper Subtext */}
        <div className="flex items-center justify-between text-[10px] text-stone-500">
          <span>Alignment: <strong className="text-stone-700">{gridConfig.alignItems}</strong> · Flow: <strong className="text-stone-700">{gridConfig.autoFlow}</strong></span>
          <button
            type="button"
            onClick={handleCopyCSS}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="grid grid-cols-4 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'layout'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Columns className="w-3 h-3 text-indigo-600" />
          <span>Grid Tracks</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alignment')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'alignment'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Boxes className="w-3 h-3 text-amber-500" />
          <span>Align</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'presets'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>Presets</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('item')}
          className={`py-1.5 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'item'
              ? 'bg-white text-indigo-700 shadow-2xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Maximize2 className="w-3 h-3 text-emerald-600" />
          <span>Child Span</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: COLUMNS, ROWS, AND GAPS
         ======================================================== */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          
          {/* SECTION 1: COLUMNS */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Columns className="w-3.5 h-3.5 text-indigo-600" />
                <span>Columns (Count & Sizing)</span>
              </label>
              <div className="flex items-center gap-1.5">
                {gridConfig.columnMode === 'equal' && (
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {gridConfig.columns} {gridConfig.columns === 1 ? 'Col' : 'Cols'}
                  </span>
                )}
                {gridConfig.columnMode === 'auto-fit' && (
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                    Auto-Fit ({gridConfig.autoFitMinPx}px)
                  </span>
                )}
              </div>
            </div>

            {/* Column Sizing Strategy Selector */}
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-stone-200/70 rounded-lg text-[11px] font-semibold text-stone-700">
              <button
                type="button"
                onClick={() => updateGrid((prev) => ({ ...prev, columnMode: 'equal' }))}
                className={`py-1 rounded text-center transition-all ${
                  gridConfig.columnMode === 'equal' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-stone-900'
                }`}
              >
                Fixed Count
              </button>
              <button
                type="button"
                onClick={() => updateGrid((prev) => ({ ...prev, columnMode: 'auto-fit' }))}
                className={`py-1 rounded text-center transition-all ${
                  gridConfig.columnMode === 'auto-fit' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-stone-900'
                }`}
              >
                Auto-Fit (Cards)
              </button>
              <button
                type="button"
                onClick={() => updateGrid((prev) => ({ ...prev, columnMode: 'custom' }))}
                className={`py-1 rounded text-center transition-all ${
                  gridConfig.columnMode === 'custom' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-stone-900'
                }`}
              >
                Custom Track
              </button>
            </div>

            {/* If Equal Columns: Slider & Quick Chips */}
            {gridConfig.columnMode === 'equal' && (
              <div className="space-y-2 pt-1">
                {/* Column Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>1 Column</span>
                    <span>12 Columns</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={gridConfig.columns}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 1;
                      updateGrid((prev) => ({ ...prev, columns: val }));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Quick Column Count Buttons */}
                <div className="flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 6, 12].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateGrid((prev) => ({ ...prev, columns: count }))}
                      className={`flex-1 py-1 text-[11px] font-bold rounded border transition-colors ${
                        gridConfig.columns === count
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* If Auto-Fit Columns: Min-width Slider */}
            {gridConfig.columnMode === 'auto-fit' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[11px] text-stone-600">
                  <span>Minimum Card Width:</span>
                  <span className="font-mono font-bold text-indigo-600">{gridConfig.autoFitMinPx}px</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="420"
                  step="10"
                  value={gridConfig.autoFitMinPx}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateGrid((prev) => ({ ...prev, autoFitMinPx: val }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  {[180, 240, 280, 320, 380].map((px) => (
                    <button
                      key={px}
                      type="button"
                      onClick={() => updateGrid((prev) => ({ ...prev, autoFitMinPx: px }))}
                      className={`px-2 py-0.5 rounded border ${
                        gridConfig.autoFitMinPx === px
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {px}px
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-stone-400">
                  Generates <code className="font-mono text-stone-700">repeat(auto-fit, minmax({gridConfig.autoFitMinPx}px, 1fr))</code>
                </div>
              </div>
            )}

            {/* If Custom Track List */}
            {gridConfig.columnMode === 'custom' && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={gridConfig.customColumns}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateGrid((prev) => ({ ...prev, customColumns: val }));
                  }}
                  placeholder="e.g. 260px 1fr or 1fr 2fr or 200px auto"
                  className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-stone-800 shadow-2xs"
                />
                <div className="flex flex-wrap gap-1">
                  {['260px 1fr', '1fr 320px', '1fr 2fr', '200px 1fr 200px', '1fr 1fr 1fr'].map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => updateGrid((prev) => ({ ...prev, customColumns: tpl }))}
                      className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 rounded text-[10px] font-mono text-stone-600"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ROWS */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Rows className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rows & Vertical Tracks</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateGrid((prev) => ({ ...prev, rowMode: prev.rowMode === 'auto' ? 'equal' : 'auto' }))}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                    gridConfig.rowMode === 'auto'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  }`}
                >
                  {gridConfig.rowMode === 'auto' ? 'Auto-Flow (Dynamic)' : `Fixed: ${gridConfig.rows} Rows`}
                </button>
              </div>
            </div>

            {gridConfig.rowMode === 'equal' ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>1 Row</span>
                  <span>6 Rows</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={gridConfig.rows}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    updateGrid((prev) => ({ ...prev, rows: val }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5, 6].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateGrid((prev) => ({ ...prev, rows: r }))}
                      className={`flex-1 py-0.5 text-[11px] font-bold rounded border ${
                        gridConfig.rows === r
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">Auto Row Sizing:</span>
                  <select
                    value={styles['grid-auto-rows'] || 'auto'}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateStyle('grid-auto-rows', val);
                    }}
                    className="bg-white border border-stone-200 rounded px-2 py-0.5 text-xs text-stone-800 font-medium"
                  >
                    <option value="auto">auto (Natural height)</option>
                    <option value="minmax(120px, auto)">min 120px</option>
                    <option value="minmax(180px, auto)">min 180px</option>
                    <option value="minmax(240px, auto)">min 240px</option>
                    <option value="1fr">1fr (Equal share)</option>
                    <option value="min-content">min-content</option>
                    <option value="max-content">max-content</option>
                  </select>
                </div>
                <div className="text-[10px] text-stone-400">
                  New rows generate automatically as items wrap without fixing row quantity.
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: GAPS */}
          <div className="space-y-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Grid Gap (Spacing Between Cells)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  updateGrid((prev) => ({
                    ...prev,
                    gapLinked: !prev.gapLinked,
                    rowGapPx: prev.gapPx,
                    colGapPx: prev.gapPx,
                  }));
                }}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                  gridConfig.gapLinked
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}
                title={gridConfig.gapLinked ? 'Click to set Row & Column gaps independently' : 'Click to link Row & Column gaps'}
              >
                {gridConfig.gapLinked ? (
                  <>
                    <Link className="w-3 h-3" />
                    <span>Linked</span>
                  </>
                ) : (
                  <>
                    <Unlink className="w-3 h-3" />
                    <span>Split (R / C)</span>
                  </>
                )}
              </button>
            </div>

            {gridConfig.gapLinked ? (
              /* Single Linked Gap Slider */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-600">Uniform Gap</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="80"
                      step="2"
                      value={gridConfig.gapPx}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        updateGrid((prev) => ({ ...prev, gapPx: val, rowGapPx: val, colGapPx: val }));
                      }}
                      className="w-14 bg-white border border-stone-200 rounded px-1.5 py-0.5 text-xs font-mono text-right font-bold text-indigo-600"
                    />
                    <span className="text-xs font-mono text-stone-500">px</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="64"
                  step="2"
                  value={gridConfig.gapPx}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateGrid((prev) => ({ ...prev, gapPx: val, rowGapPx: val, colGapPx: val }));
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                {/* Quick Gap Chips */}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {GAP_PRESETS.map((gp) => (
                    <button
                      key={gp.value}
                      type="button"
                      onClick={() => updateGrid((prev) => ({ ...prev, gapPx: gp.value, rowGapPx: gp.value, colGapPx: gp.value }))}
                      className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors ${
                        gridConfig.gapPx === gp.value
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {gp.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Unlinked Column & Row Gap Sliders */
              <div className="space-y-3 pt-1">
                {/* Column Gap */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-600 flex items-center gap-1">
                      <MoveHorizontal className="w-3 h-3 text-indigo-600" />
                      <span>Column Gap (Horizontal)</span>
                    </span>
                    <span className="font-mono font-bold text-indigo-600">{gridConfig.colGapPx}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="2"
                    value={gridConfig.colGapPx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateGrid((prev) => ({ ...prev, colGapPx: val }));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Row Gap */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-600 flex items-center gap-1">
                      <MoveVertical className="w-3 h-3 text-indigo-600" />
                      <span>Row Gap (Vertical)</span>
                    </span>
                    <span className="font-mono font-bold text-indigo-600">{gridConfig.rowGapPx}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="2"
                    value={gridConfig.rowGapPx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateGrid((prev) => ({ ...prev, rowGapPx: val }));
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ALIGNMENT & CELL DISTRIBUTION
         ======================================================== */}
      {activeTab === 'alignment' && (
        <div className="space-y-4">
          
          {/* Justify Items (Horizontal In-Cell Alignment) */}
          <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                Justify Items (Horizontal in Cell)
              </label>
              <span className="text-[10px] font-mono text-stone-400">justify-items</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'stretch', label: 'Stretch', icon: AlignJustify, desc: 'Full cell width' },
                { id: 'start', label: 'Start', icon: AlignLeft, desc: 'Left edge' },
                { id: 'center', label: 'Center', icon: AlignCenter, desc: 'Center' },
                { id: 'end', label: 'End', icon: AlignRight, desc: 'Right edge' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = gridConfig.justifyItems === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateGrid((prev) => ({ ...prev, justifyItems: item.id as any }))}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] leading-none">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Align Items (Vertical In-Cell Alignment) */}
          <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                Align Items (Vertical in Cell)
              </label>
              <span className="text-[10px] font-mono text-stone-400">align-items</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'stretch', label: 'Stretch', desc: 'Equal cell height' },
                { id: 'start', label: 'Top / Start', desc: 'Align top' },
                { id: 'center', label: 'Middle', desc: 'Vertical center' },
                { id: 'end', label: 'Bottom / End', desc: 'Align bottom' },
              ].map((item) => {
                const isSelected = gridConfig.alignItems === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateGrid((prev) => ({ ...prev, alignItems: item.id as any }))}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-[11px] leading-tight font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Justify Content (Track Distribution) */}
          <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                Justify Content (Track Spread)
              </label>
              <span className="text-[10px] font-mono text-stone-400">justify-content</span>
            </div>
            <select
              value={gridConfig.justifyContent}
              onChange={(e) => updateGrid((prev) => ({ ...prev, justifyContent: e.target.value as any }))}
              className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium"
            >
              <option value="start">Start (Packed at left)</option>
              <option value="center">Center (Horizontally centered)</option>
              <option value="end">End (Packed at right)</option>
              <option value="space-between">Space-Between (Edges flush)</option>
              <option value="space-around">Space-Around (Equal gutters)</option>
              <option value="space-evenly">Space-Evenly (Even spaces everywhere)</option>
            </select>
          </div>

          {/* Grid Auto Flow */}
          <div className="space-y-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                Auto-Flow Order
              </label>
              <span className="text-[10px] font-mono text-stone-400">grid-auto-flow</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'row', label: 'Row (Horizontal first)', desc: 'Left-to-right filling' },
                { id: 'column', label: 'Column (Vertical first)', desc: 'Top-to-bottom filling' },
                { id: 'row dense', label: 'Row Dense (Pack gaps)', desc: 'Fills earlier empty holes' },
                { id: 'column dense', label: 'Col Dense (Pack gaps)', desc: 'Fills column gaps' },
              ].map((flow) => {
                const isSelected = gridConfig.autoFlow === flow.id;
                return (
                  <button
                    key={flow.id}
                    type="button"
                    onClick={() => {
                      updateGrid((prev) => ({ ...prev, autoFlow: flow.id as any }));
                      onUpdateStyle('grid-auto-flow', flow.id);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600 font-bold'
                        : 'bg-white border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className={`text-[11px] ${isSelected ? 'text-indigo-900' : 'text-stone-800'}`}>
                      {flow.label}
                    </div>
                    <div className="text-[9px] text-stone-400 truncate">{flow.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: CURATED 1-CLICK GRID PRESETS
         ======================================================== */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <div className="text-xs text-stone-500 leading-relaxed mb-1">
            Choose from battle-tested CSS Grid architectural templates. Clicking applies columns, gaps, and alignments instantly.
          </div>

          <div className="space-y-1.5">
            {GRID_LAYOUT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="w-full p-2.5 bg-white hover:bg-stone-50 rounded-xl border border-stone-200 text-left transition-all hover:border-indigo-300 shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {preset.name}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-1.5">
                  {preset.description}
                </p>
                <div className="text-[10px] font-mono text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-100 truncate">
                  columns: {preset.columns}; gap: {preset.gap};
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: CHILD ITEM SPAN & PLACEMENT CONTROLS
         ======================================================== */}
      {activeTab === 'item' && (
        <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div>
            <div className="text-xs font-bold text-stone-800 mb-0.5">Child Element Grid Placement</div>
            <div className="text-[10px] text-stone-500 leading-relaxed">
              If this element is sitting inside a CSS Grid, control how many columns and rows it spans.
            </div>
          </div>

          {/* Column Span */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700">Column Span (grid-column)</span>
              <span className="font-mono text-indigo-600 font-bold">{styles['grid-column'] || 'span 1'}</span>
            </div>
            <div className="flex items-center gap-1">
              {['span 1', 'span 2', 'span 3', 'span 4', '1 / -1'].map((span) => {
                const isSelected = styles['grid-column'] === span || (!styles['grid-column'] && span === 'span 1');
                return (
                  <button
                    key={span}
                    type="button"
                    onClick={() => onUpdateStyle('grid-column', span)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {span === '1 / -1' ? 'All (Full)' : span.replace('span ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row Span */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-700">Row Span (grid-row)</span>
              <span className="font-mono text-indigo-600 font-bold">{styles['grid-row'] || 'span 1'}</span>
            </div>
            <div className="flex items-center gap-1">
              {['span 1', 'span 2', 'span 3', 'span 4'].map((span) => {
                const isSelected = styles['grid-row'] === span || (!styles['grid-row'] && span === 'span 1');
                return (
                  <button
                    key={span}
                    type="button"
                    onClick={() => onUpdateStyle('grid-row', span)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {span.replace('span ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Self Alignment */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Justify Self</label>
              <select
                value={styles['justify-self'] || 'auto'}
                onChange={(e) => onUpdateStyle('justify-self', e.target.value)}
                className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
              >
                <option value="auto">auto</option>
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Align Self</label>
              <select
                value={styles['align-self'] || 'auto'}
                onChange={(e) => onUpdateStyle('align-self', e.target.value)}
                className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs"
              >
                <option value="auto">auto</option>
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="center">center</option>
                <option value="end">end</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Compiled CSS Output Box */}
      <div className="pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-stone-700">Active CSS Grid Declaration</span>
          <button
            type="button"
            onClick={handleCopyCSS}
            className="text-[10px] text-stone-600 hover:text-indigo-600 flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition-colors"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-2 bg-stone-900 text-indigo-300 font-mono text-[11px] rounded-lg border border-stone-800 select-all space-y-0.5 leading-relaxed">
          <div>display: {styles['display'] || 'grid'};</div>
          <div>grid-template-columns: {formatGridColumns(gridConfig)};</div>
          {gridConfig.rowMode !== 'auto' && (
            <div>grid-template-rows: {formatGridRows(gridConfig)};</div>
          )}
          <div>gap: {gridConfig.gapLinked ? `${gridConfig.gapPx}px;` : `${gridConfig.rowGapPx}px ${gridConfig.colGapPx}px;`}</div>
          {gridConfig.alignItems !== 'stretch' && (
            <div>align-items: {gridConfig.alignItems};</div>
          )}
          {gridConfig.justifyItems !== 'stretch' && (
            <div>justify-items: {gridConfig.justifyItems};</div>
          )}
        </div>
      </div>
    </div>
  );
};
