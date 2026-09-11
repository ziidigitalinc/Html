import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, X, AlertCircle } from 'lucide-react';
import { SAMPLE_SAAS_PAGE, SAMPLE_AGENCY_PAGE } from '../utils/sampleWebsites';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadHtml: (html: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onLoadHtml }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');
  const [rawHtmlText, setRawHtmlText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(html|htm|txt)$/i)) {
      setErrorMsg('Please upload a valid .html, .htm, or .txt file.');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content && content.trim()) {
        onLoadHtml(content);
        onClose();
      } else {
        setErrorMsg('The selected file appears to be empty.');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handlePasteSubmit = () => {
    if (!rawHtmlText.trim()) {
      setErrorMsg('Please paste some HTML code first.');
      return;
    }
    onLoadHtml(rawHtmlText);
    onClose();
  };

  const handleLoadSample = (sample: string) => {
    onLoadHtml(sample);
    onClose();
  };

  return (
    <div
      id="import-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="import-modal-container"
        className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/75">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Import or Drop HTML Webpage</h2>
              <p className="text-xs text-stone-500">
                Drop your HTML file to automatically split into editable sections.
              </p>
            </div>
          </div>
          <button
            id="close-import-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 pt-2 bg-stone-50/30 gap-4">
          <button
            id="tab-drop-file"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Drop or Upload File
          </button>
          <button
            id="tab-paste-html"
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste HTML Code
          </button>
          <button
            id="tab-sample-templates"
            onClick={() => setActiveTab('templates')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Ready-Made Templates
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div
              id="html-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
              }`}
            >
              <input
                ref={fileInputRef}
                id="html-file-input"
                type="file"
                accept=".html,.htm,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-800 mb-1">
                Drag and drop your HTML file here
              </p>
              <p className="text-xs text-stone-500 mb-4">
                Supports complete webpages or HTML section snippets (.html, .htm)
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors pointer-events-none"
              >
                Browse File from Computer
              </button>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="raw-html-textarea"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Paste Raw HTML Webpage Markup
                </label>
                <textarea
                  id="raw-html-textarea"
                  value={rawHtmlText}
                  onChange={(e) => setRawHtmlText(e.target.value)}
                  placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
                  rows={9}
                  className="w-full font-mono text-xs p-3 rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-stone-50 text-stone-800 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  id="submit-pasted-html-btn"
                  onClick={handlePasteSubmit}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Import & Parse Sections
                </button>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Template 1 */}
              <div
                id="template-saas-card"
                onClick={() => handleLoadSample(SAMPLE_SAAS_PAGE)}
                className="p-4 rounded-xl border border-stone-200 hover:border-indigo-400 bg-stone-50/50 hover:bg-white cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    SaaS Platform
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600 font-medium">
                    6 Sections
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  ApexFlow AI Platform
                </h3>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  Modern tech SaaS layout with sticky header, bold hero, client trust proof, 3-column feature grid, CTA banner, and multi-column footer.
                </p>
                <div className="flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  Load Template →
                </div>
              </div>

              {/* Template 2 */}
              <div
                id="template-agency-card"
                onClick={() => handleLoadSample(SAMPLE_AGENCY_PAGE)}
                className="p-4 rounded-xl border border-stone-200 hover:border-indigo-400 bg-stone-50/50 hover:bg-white cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Creative Agency
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600 font-medium">
                    6 Sections
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors">
                  Kroma Design Studio
                </h3>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  Editorial serif typography, bold hero banner, key metrics bar, selected case studies grid, consultation CTA, and minimalist footer.
                </p>
                <div className="flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                  Load Template →
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
