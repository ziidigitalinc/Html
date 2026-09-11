import React, { useState, useEffect } from 'react';
import {
  Section,
  SectionType
} from '../types';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Plus,
  Edit2,
  Check,
  Eye,
  Sliders,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';

interface SectionSidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  onMoveSection: (fromIndex: number, toIndex: number) => void;
  onRenameSection: (id: string, newName: string) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onAddSection: (type: SectionType) => void;
  onQuickCopyWordPress: (section: Section) => void;
}

const SECTION_TYPE_COLORS: Record<SectionType, { bg: string; text: string; border: string }> = {
  header: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  hero: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  subhero: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  center: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  features: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  testimonials: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  pricing: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  prefooter: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  footer: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
  custom: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const SectionSidebar: React.FC<SectionSidebarProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  onMoveSection,
  onRenameSection,
  onDeleteSection,
  onDuplicateSection,
  onAddSection,
  onQuickCopyWordPress,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const startEditing = (sec: Section) => {
    setEditingId(sec.id);
    setEditNameText(sec.name);
  };

  const saveEditing = (id: string) => {
    if (editNameText.trim()) {
      onRenameSection(id, editNameText.trim());
    }
    setEditingId(null);
  };

  const handleCopyClick = (e: React.MouseEvent, sec: Section) => {
    e.stopPropagation();
    onQuickCopyWordPress(sec);
    setCopiedId(sec.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Keep sidebar list scrolled to active section when selected from canvas or inspector
  useEffect(() => {
    if (activeSectionId) {
      const list = document.getElementById('sidebar-sections-list');
      const activeEl = document.getElementById(`sidebar-sec-${activeSectionId}`);
      if (list && activeEl) {
        const top = activeEl.offsetTop - list.offsetTop;
        list.scrollTo({ top: Math.max(0, top - 20), behavior: 'smooth' });
      }
    }
  }, [activeSectionId]);

  return (
    <aside
      id="sections-sidebar"
      className="w-72 bg-white border-r border-stone-200 flex flex-col shrink-0 select-none z-20"
    >
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-600" />
          <h2 className="text-xs font-bold text-stone-800 tracking-wide uppercase">
            Page Sections ({sections.length})
          </h2>
        </div>

        <div className="relative">
          <button
            id="add-section-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>

          {/* Add Section Dropdown Menu */}
          {showAddMenu && (
            <div
              id="add-section-dropdown"
              className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-lg shadow-xl border border-stone-200 p-1.5 z-50 text-xs animate-in fade-in zoom-in-95"
            >
              <div className="px-2 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Insert Section Block
              </div>
              <button
                onClick={() => {
                  onAddSection('hero');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Hero / Banner
              </button>
              <button
                onClick={() => {
                  onAddSection('features');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Features Grid
              </button>
              <button
                onClick={() => {
                  onAddSection('subhero');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Logos / Social Proof
              </button>
              <button
                onClick={() => {
                  onAddSection('prefooter');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Call to Action
              </button>
              <button
                onClick={() => {
                  onAddSection('footer');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-stone-500"></span>
                Footer
              </button>
              <button
                onClick={() => {
                  onAddSection('custom');
                  setShowAddMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-stone-100 text-stone-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                Blank Custom Container
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {sections.map((sec, idx) => {
          const isActive = sec.id === activeSectionId;
          const colorMeta = SECTION_TYPE_COLORS[sec.type] || SECTION_TYPE_COLORS.custom;

          return (
            <div
              key={sec.id}
              id={`sidebar-sec-${sec.id}`}
              onClick={() => onSelectSection(sec.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500/30 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                {/* Section badge */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${colorMeta.bg} ${colorMeta.text} ${colorMeta.border}`}
                  >
                    {sec.type}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    &lt;{sec.tagName}&gt;
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-1.5 py-0.2 rounded shadow-2xs">
                      <Eye className="w-2.5 h-2.5" />
                      Selected
                    </span>
                  )}
                </div>

                {/* Reorder Arrows */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(idx, idx - 1);
                    }}
                    title="Move Up"
                    className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === sections.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSection(idx, idx + 1);
                    }}
                    title="Move Down"
                    className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title / Rename */}
              {editingId === sec.id ? (
                <div className="flex items-center gap-1 my-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editNameText}
                    onChange={(e) => setEditNameText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing(sec.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 text-xs px-2 py-1 rounded border border-indigo-400 bg-white focus:outline-hidden"
                  />
                  <button
                    onClick={() => saveEditing(sec.id)}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-indigo-950' : 'text-stone-800'
                    }`}
                  >
                    {sec.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(sec);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-stone-700 transition-opacity"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Action Bar on Section Card */}
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <button
                  id={`quick-copy-wp-${sec.id}`}
                  onClick={(e) => handleCopyClick(e, sec)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    copiedId === sec.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 hover:bg-indigo-100 hover:text-indigo-700 text-stone-700'
                  }`}
                  title="Copy HTML + CSS for WordPress / Elementor"
                >
                  {copiedId === sec.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied WP!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy WP Code
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSection(sec.id);
                    }}
                    className="p-1 hover:bg-stone-200 rounded text-stone-500"
                    title="Duplicate section"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(sec.id);
                    }}
                    className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded"
                    title="Delete section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/75 text-stone-500 text-[11px] flex items-center justify-between">
        <span>Click to redesign section</span>
        <span className="font-mono text-stone-400">Total: {sections.length}</span>
      </div>
    </aside>
  );
};
