import React, { useState, useMemo, useEffect } from 'react';
import { Section, ParsedDocument } from '../types';
import { buildWordPressBundle, extractStylesForSection } from '../utils/cssExtractor';
import { Copy, Check, ExternalLink, Code2, Eye, Sparkles, X, Info, Download, Layers } from 'lucide-react';

interface WordPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  activeSectionId?: string;
  globalStyles: string;
  doc: ParsedDocument;
}

export const WordPressModal: React.FC<WordPressModalProps> = ({
  isOpen,
  onClose,
  sections,
  activeSectionId,
  globalStyles,
  doc,
}) => {
  const [selectedSecId, setSelectedSecId] = useState<string>(
    activeSectionId || (sections[0] ? sections[0].id : '')
  );
  const [copyMode, setCopyMode] = useState<'scoped' | 'inline' | 'clean'>('scoped');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [viewTab, setViewTab] = useState<'code' | 'preview'>('code');

  // Synchronize modal selected section with the active section when modal is opened
  useEffect(() => {
    if (activeSectionId && isOpen) {
      setSelectedSecId(activeSectionId);
    }
  }, [activeSectionId, isOpen]);

  const activeSec = useMemo(() => {
    return sections.find((s) => s.id === selectedSecId) || sections[0];
  }, [sections, selectedSecId]);

  const generatedBundle = useMemo(() => {
    if (!activeSec) return '';
    return buildWordPressBundle(
      activeSec.html,
      globalStyles,
      activeSec.name,
      copyMode,
      doc.externalStyleSheets
    );
  }, [activeSec, globalStyles, copyMode, doc.externalStyleSheets]);

  const styleStats = useMemo(() => {
    if (!activeSec) return { matchedRulesCount: 0 };
    return extractStylesForSection(activeSec.html, globalStyles);
  }, [activeSec, globalStyles]);

  if (!isOpen || !activeSec) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedBundle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadSection = () => {
    const blob = new Blob([generatedBundle], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (activeSec.name || 'section').toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.href = url;
    link.download = `${safeName}-with-styles.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  return (
    <div
      id="wordpress-export-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="wordpress-export-modal"
        className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              WP
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                Export Section for WordPress & Elementor
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Styles Included
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Self-contained HTML + CSS ready to paste into Elementor HTML widget or Gutenberg block.
              </p>
            </div>
          </div>
          <button
            id="close-wp-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="px-6 py-3 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Section Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="wp-section-select" className="text-xs font-semibold text-stone-600">
              Section:
            </label>
            <select
              id="wp-section-select"
              value={activeSec.id}
              onChange={(e) => setSelectedSecId(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              id="mode-scoped-btn"
              onClick={() => setCopyMode('scoped')}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                copyMode === 'scoped'
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Scoped &lt;style&gt; + HTML
            </button>
            <button
              id="mode-inline-btn"
              onClick={() => setCopyMode('inline')}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                copyMode === 'inline'
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inlined CSS (Immune to Themes)
            </button>
            <button
              id="mode-clean-btn"
              onClick={() => setCopyMode('clean')}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                copyMode === 'clean'
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              HTML Only
            </button>
          </div>

          {/* Code vs Live Preview Tab */}
          <div className="flex items-center gap-1">
            <button
              id="tab-code-btn"
              onClick={() => setViewTab('code')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewTab === 'code'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
            <button
              id="tab-preview-btn"
              onClick={() => setViewTab('preview')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewTab === 'preview'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Elementor Preview
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6 bg-stone-900/5">
          {viewTab === 'code' ? (
            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2 px-1">
                <span>
                  {copyMode === 'scoped' &&
                    `Includes ${styleStats.matchedRulesCount} matched CSS rules, CSS variables, and layout resets.`}
                  {copyMode === 'inline' &&
                    'All styles inlined directly into style="" attributes. Prevents WordPress themes from breaking layout.'}
                  {copyMode === 'clean' && 'Pure clean HTML tags without styling block.'}
                </span>
                <span className="font-mono text-stone-400">
                  {generatedBundle.length.toLocaleString()} characters
                </span>
              </div>
              <div className="flex-1 bg-stone-900 rounded-lg p-4 font-mono text-xs text-stone-200 overflow-auto border border-stone-800 shadow-inner">
                <pre className="leading-relaxed whitespace-pre-wrap">{generatedBundle}</pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col bg-white rounded-lg border border-stone-300 shadow-xs overflow-hidden">
              {/* Mock WordPress Post Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center justify-between text-xs text-stone-600">
                <span className="font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Elementor / WordPress Sandbox Preview
                </span>
                <span className="text-stone-400">Exact layout that will appear when pasted</span>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-stone-50">
                <iframe
                  title="WordPress Preview Sandbox"
                  srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{margin:0;padding:20px;background:#ffffff;font-family:system-ui,-apple-system,sans-serif;}</style></head><body>${generatedBundle}</body></html>`}
                  className="w-full h-full min-h-[350px] border border-stone-200 rounded-md bg-white shadow-xs"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions and Quick Guide */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Elementor instructions:</strong> In Elementor, drag the{' '}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-mono font-semibold">HTML</code>{' '}
              widget onto your page and paste. All styles and layout are preserved!
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="download-section-btn"
              onClick={handleDownloadSection}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Downloaded HTML!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Download .html</span>
                </>
              )}
            </button>

            <button
              id="copy-wp-code-btn"
              onClick={handleCopy}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied HTML + CSS!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy HTML + CSS for Elementor</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
