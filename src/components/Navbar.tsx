import React from 'react';
import {
  Upload,
  Download,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  Layers,
  Code2,
  FileDown
} from 'lucide-react';
import { DeviceViewport } from '../types';

interface NavbarProps {
  documentTitle: string;
  viewport: DeviceViewport;
  onViewportChange: (vp: DeviceViewport) => void;
  isolateSection: boolean;
  onToggleIsolate: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenImport: () => void;
  onOpenWordPressModal: () => void;
  onDownloadHtml: () => void;
  onOpenCodeView: () => void;
  sectionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  documentTitle,
  viewport,
  onViewportChange,
  isolateSection,
  onToggleIsolate,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenImport,
  onOpenWordPressModal,
  onDownloadHtml,
  onOpenCodeView,
  sectionCount,
}) => {
  return (
    <header
      id="app-top-navbar"
      className="h-14 bg-white border-b border-stone-200 px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-2xs"
    >
      {/* Brand & Document Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-stone-900 leading-none block">
              SectionStudio
            </span>
            <span className="text-[10px] text-stone-400 font-medium">Visual HTML Designer</span>
          </div>
        </div>

        <div className="h-5 w-px bg-stone-200 mx-1 hidden sm:block" />

        <div className="hidden md:flex items-center gap-2 max-w-[200px] lg:max-w-xs truncate text-xs text-stone-600 bg-stone-100/80 px-2.5 py-1 rounded-md border border-stone-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate font-medium">{documentTitle || 'Untitled Page'}</span>
          <span className="text-stone-400 shrink-0">({sectionCount} sections)</span>
        </div>
      </div>

      {/* Center Viewport & View Mode Controls */}
      <div className="flex items-center gap-2">
        {/* Device Switcher */}
        <div
          id="viewport-switcher"
          className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-stone-600"
        >
          <button
            id="vp-desktop-btn"
            onClick={() => onViewportChange('desktop')}
            title="Desktop View (1280px)"
            className={`p-1.5 rounded-md transition-colors ${
              viewport === 'desktop'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            id="vp-tablet-btn"
            onClick={() => onViewportChange('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-md transition-colors ${
              viewport === 'tablet'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            id="vp-mobile-btn"
            onClick={() => onViewportChange('mobile')}
            title="Mobile View (375px)"
            className={`p-1.5 rounded-md transition-colors ${
              viewport === 'mobile'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode: All Sections vs Isolate */}
        <button
          id="toggle-isolate-btn"
          onClick={onToggleIsolate}
          title={isolateSection ? 'View all sections together' : 'Isolate active section'}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
            isolateSection
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{isolateSection ? 'Section Isolated' : 'All Sections'}</span>
        </button>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 border-l border-stone-200 pl-2">
          <button
            id="btn-undo"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-md transition-colors ${
              canUndo
                ? 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="btn-redo"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-md transition-colors ${
              canRedo
                ? 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          id="btn-import-html"
          onClick={onOpenImport}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden sm:inline">Drop / Import</span>
        </button>

        <button
          id="btn-inspect-code"
          onClick={onOpenCodeView}
          title="View Full Document Code"
          className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors hidden md:block"
        >
          <Code2 className="w-4 h-4" />
        </button>

        {/* Copy for WordPress Button */}
        <button
          id="btn-copy-wordpress"
          onClick={onOpenWordPressModal}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy for WordPress</span>
        </button>

        {/* Download Complete HTML Button */}
        <button
          id="btn-download-html"
          onClick={onDownloadHtml}
          title="Download complete assembled HTML file"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white transition-colors shadow-xs"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download HTML</span>
        </button>
      </div>
    </header>
  );
};
