import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Section,
  SectionType,
  ParsedDocument,
  DeviceViewport,
  SelectedElementInfo,
} from './types';
import { parseHtmlDocument, reconstructDocument } from './utils/htmlParser';
import { SAMPLE_SAAS_PAGE } from './utils/sampleWebsites';
import { buildWordPressBundle } from './utils/cssExtractor';

// Components
import { Navbar } from './components/Navbar';
import { SectionSidebar } from './components/SectionSidebar';
import { VisualCanvas } from './components/VisualCanvas';
import { InspectorPanel } from './components/InspectorPanel';
import { WordPressModal } from './components/WordPressModal';
import { ImportModal } from './components/ImportModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { Check, Info } from 'lucide-react';

export default function App() {
  // Parse initial default website
  const initialDoc = useMemo(() => parseHtmlDocument(SAMPLE_SAAS_PAGE), []);

  const [doc, setDoc] = useState<ParsedDocument>(initialDoc);
  const [sections, setSections] = useState<Section[]>(initialDoc.sections);
  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialDoc.sections[0]?.id || ''
  );
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(() => {
    const firstSec = initialDoc.sections[0];
    if (!firstSec) return null;
    return {
      selector: `[data-section-wrapper="${firstSec.id}"] > :first-child`,
      elementId: undefined,
      tagName: firstSec.tagName || 'section',
      classList: [],
      textContent: '',
      sectionId: firstSec.id,
      inlineStyles: {},
      attributes: {},
      breadcrumb: [{ tagName: firstSec.tagName || 'section', selector: `[data-section-wrapper="${firstSec.id}"] > :first-child`, index: 0 }],
    };
  });

  // View settings
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [isolateSection, setIsolateSection] = useState<boolean>(false);
  const [previewHover, setPreviewHover] = useState<boolean>(false);

  // Modals
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isWpModalOpen, setIsWpModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Section[][]>([initialDoc.sections]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [contentRevision, setContentRevision] = useState<number>(0);

  const pushHistory = useCallback(
    (newSections: Section[]) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newSections];
      });
      setHistoryIndex((prev) => prev + 1);
      setContentRevision((r) => r + 1);
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSections(prev);
      setContentRevision((r) => r + 1);
      showToast('Undone');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSections(next);
      setContentRevision((r) => r + 1);
      showToast('Redone');
    }
  };

  // Import new HTML
  const handleLoadNewHtml = (rawHtml: string) => {
    try {
      const parsed = parseHtmlDocument(rawHtml);
      setDoc(parsed);
      setSections(parsed.sections);
      const firstSec = parsed.sections[0];
      setActiveSectionId(firstSec?.id || '');
      if (firstSec) {
        setSelectedElement({
          selector: `[data-section-wrapper="${firstSec.id}"] > :first-child`,
          elementId: undefined,
          tagName: firstSec.tagName || 'section',
          classList: [],
          textContent: '',
          sectionId: firstSec.id,
          inlineStyles: {},
          attributes: {},
          breadcrumb: [{ tagName: firstSec.tagName || 'section', selector: `[data-section-wrapper="${firstSec.id}"] > :first-child`, index: 0 }],
        });
      } else {
        setSelectedElement(null);
      }
      setHistory([parsed.sections]);
      setHistoryIndex(0);
      setContentRevision((r) => r + 1);
      showToast(`Imported "${parsed.title}" with ${parsed.sections.length} sections!`);
    } catch (err) {
      console.error('Failed to parse document:', err);
      showToast('Error parsing HTML structure.');
    }
  };

  // Section HTML updated via Canvas direct editing or Inspector
  const handleUpdateSectionHtml = useCallback(
    (sectionId: string, newHtml: string) => {
      setSections((prev) => {
        const next = prev.map((s) => (s.id === sectionId ? { ...s, html: newHtml } : s));
        return next;
      });
    },
    []
  );

  // Navigate to section from sidebar (scrolls into view and selects section root)
  const handleNavigateToSection = (id: string) => {
    setActiveSectionId(id);
    window.postMessage({ type: 'NAVIGATE_TO_SECTION', sectionId: id }, '*');
    const sec = sections.find((s) => s.id === id);
    if (sec) {
      setSelectedElement({
        selector: `[data-section-wrapper="${sec.id}"] > :first-child`,
        elementId: undefined,
        tagName: sec.tagName || 'section',
        classList: [],
        textContent: '',
        sectionId: sec.id,
        inlineStyles: {},
        attributes: {},
        breadcrumb: [{ tagName: sec.tagName || 'section', selector: `[data-section-wrapper="${sec.id}"] > :first-child`, index: 0 }],
      });
    }
  };

  // Active section change originating from clicking inside the canvas (never scrolls, never overwrites element)
  const handleActiveSectionChangeFromCanvas = (id: string) => {
    setActiveSectionId(id);
  };

  // Select section root from Inspector ("Edit Section" button) without scrolling
  const handleSelectActiveSectionRoot = () => {
    const sec = sections.find((s) => s.id === activeSectionId);
    if (sec) {
      setSelectedElement({
        selector: `[data-section-wrapper="${sec.id}"] > :first-child`,
        elementId: undefined,
        tagName: sec.tagName || 'section',
        classList: [],
        textContent: '',
        sectionId: sec.id,
        inlineStyles: {},
        attributes: {},
        breadcrumb: [{ tagName: sec.tagName || 'section', selector: `[data-section-wrapper="${sec.id}"] > :first-child`, index: 0 }],
      });
      window.postMessage({ type: 'HIGHLIGHT_SECTION_ROOT', sectionId: sec.id }, '*');
    }
  };

  // Reorder sections
  const handleMoveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setSections(reordered);
    pushHistory(reordered);
    showToast(`Moved section ${fromIndex < toIndex ? 'down' : 'up'}`);
  };

  // Rename section
  const handleRenameSection = (id: string, newName: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, name: newName } : s));
    setSections(updated);
    pushHistory(updated);
    showToast('Section renamed');
  };

  // Delete section
  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      showToast('Must have at least one section');
      return;
    }
    const filtered = sections.filter((s) => s.id !== id);
    setSections(filtered);
    if (activeSectionId === id) {
      setActiveSectionId(filtered[0]?.id || '');
    }
    pushHistory(filtered);
    showToast('Section deleted');
  };

  // Duplicate section
  const handleDuplicateSection = (id: string) => {
    const target = sections.find((s) => s.id === id);
    if (!target) return;
    const newId = `sec-${Date.now()}`;
    // Replace section ID attribute inside HTML
    const newHtml = target.html.replace(
      /data-section-id="[^"]*"/,
      `data-section-id="${newId}"`
    );
    const newSec: Section = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      html: newHtml,
    };
    const index = sections.findIndex((s) => s.id === id);
    const updated = [...sections];
    updated.splice(index + 1, 0, newSec);
    setSections(updated);
    setActiveSectionId(newId);
    pushHistory(updated);
    showToast('Section duplicated');
  };

  // Add new section template
  const handleAddSection = (type: SectionType) => {
    const newId = `sec-${Date.now()}`;
    let name = 'Custom Section';
    let html = `<section data-section-id="${newId}" style="padding: 60px 24px; background-color: #ffffff; text-align: center;"><div style="max-width: 800px; margin: 0 auto;"><h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">New Section</h2><p style="color: #64748b; font-size: 16px;">Customize this block in the Visual Inspector.</p></div></section>`;

    if (type === 'hero') {
      name = 'Hero Section';
      html = `<section data-section-id="${newId}" style="padding: 90px 24px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); text-align: center;"><div style="max-width: 850px; margin: 0 auto;"><span style="display: inline-block; background-color: #e0e7ff; color: #4338ca; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px;">Welcome</span><h1 style="font-size: 50px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 20px;">Build Faster With Clean Sections</h1><p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Visually style and copy directly into your WordPress page builder.</p><a href="#" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block;">Get Started</a></div></section>`;
    } else if (type === 'features') {
      name = 'Features Grid';
      html = `<section data-section-id="${newId}" style="padding: 80px 24px; background-color: #ffffff; max-width: 1100px; margin: 0 auto;"><div style="text-align: center; margin-bottom: 48px;"><h2 style="font-size: 36px; font-weight: 800; color: #0f172a;">Core Capabilities</h2><p style="color: #64748b; font-size: 16px;">Everything configured for optimal performance.</p></div><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"><div style="padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;"><h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Feature One</h3><p style="color: #64748b; font-size: 14px;">High precision controls and zero latency visual styling.</p></div><div style="padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;"><h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Feature Two</h3><p style="color: #64748b; font-size: 14px;">One-click copy to Elementor and Gutenberg Custom HTML.</p></div></div></section>`;
    } else if (type === 'subhero') {
      name = 'Logos & Trust Proof';
      html = `<section data-section-id="${newId}" style="padding: 36px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; text-align: center;"><p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 18px;">Trusted by top companies</p><div style="display: flex; justify-content: center; gap: 36px; flex-wrap: wrap; color: #64748b; font-weight: 700;"><span style="font-size: 18px;">✦ ACME</span><span style="font-size: 18px;">✦ VELOX</span><span style="font-size: 18px;">✦ LUMEN</span></div></section>`;
    } else if (type === 'prefooter') {
      name = 'Call to Action';
      html = `<section data-section-id="${newId}" style="padding: 70px 24px; background: #4f46e5; color: #ffffff; text-align: center;"><div style="max-width: 750px; margin: 0 auto;"><h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">Ready to Elevate Your Website?</h2><p style="font-size: 18px; color: #e0e7ff; margin-bottom: 30px;">Start editing and exporting your custom sections today.</p><a href="#" style="background-color: #ffffff; color: #4338ca; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block;">Get Started Now</a></div></section>`;
    } else if (type === 'footer') {
      name = 'Footer';
      html = `<footer data-section-id="${newId}" style="padding: 40px 24px; background-color: #0f172a; color: #94a3b8; text-align: center; font-size: 14px;"><p>© 2026 Your Company. Built with HTML Section Studio.</p></footer>`;
    }

    const newSec: Section = {
      id: newId,
      name,
      type,
      html,
      tagName: 'section',
      attributes: {},
    };

    const updated = [...sections, newSec];
    setSections(updated);
    setActiveSectionId(newId);
    pushHistory(updated);
    showToast(`Added ${name}`);
  };

  // Quick Copy WordPress button on section card
  const handleQuickCopyWordPress = async (section: Section) => {
    try {
      const bundle = buildWordPressBundle(
        section.html,
        doc.globalStyles,
        section.name,
        'scoped',
        doc.externalStyleSheets
      );
      await navigator.clipboard.writeText(bundle);
      showToast(`Copied "${section.name}" for WordPress!`);
    } catch (e) {
      console.error(e);
      showToast('Could not copy to clipboard.');
    }
  };

  // Inspector element style update
  const handleUpdateElementStyle = (property: string, value: string) => {
    if (!selectedElement) return;
    const newStyles = { ...selectedElement.inlineStyles, [property]: value };
    setSelectedElement({
      ...selectedElement,
      inlineStyles: newStyles,
    });
  };

  // Inspector element hover style update
  const handleUpdateElementHoverStyle = (property: string, value: string) => {
    if (!selectedElement) return;
    const newHover = { ...(selectedElement.hoverStyles || {}) };
    if (value && value.trim() !== '') {
      newHover[property] = value;
    } else {
      delete newHover[property];
    }
    setSelectedElement({
      ...selectedElement,
      hoverStyles: newHover,
    });
  };

  // Inspector element attribute update
  const handleUpdateElementAttribute = (name: string, value: string) => {
    if (!selectedElement) return;
    const newAttrs = { ...selectedElement.attributes, [name]: value };
    setSelectedElement({
      ...selectedElement,
      attributes: newAttrs,
    });
  };

  // Inspector element text update
  const handleUpdateElementText = (text: string) => {
    if (!selectedElement) return;
    setSelectedElement({
      ...selectedElement,
      textContent: text,
      innerHTML: undefined,
    });
  };

  // Inspector element HTML update (for rich multi-color, multi-font, and multi-style spans)
  const handleUpdateElementHtml = (html: string) => {
    if (!selectedElement) return;
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const plainText = temp.textContent || '';
    setSelectedElement({
      ...selectedElement,
      innerHTML: html,
      textContent: plainText,
    });
  };

  // Change element tag (e.g. h2 -> h1, p -> h3, button -> a)
  const handleUpdateElementTag = (newTag: string) => {
    if (!selectedElement) return;
    window.postMessage({
      type: 'CHANGE_ELEMENT_TAG',
      selector: selectedElement.selector,
      newTag: newTag.toLowerCase(),
    }, '*');
    setSelectedElement({
      ...selectedElement,
      tagName: newTag.toLowerCase(),
    });
    showToast(`Changed tag to <${newTag.toUpperCase()}>`);
  };

  // Select child element inside active section by tag (e.g. headings, media, CTA buttons)
  const handleSelectElementByTag = (tag: string) => {
    window.postMessage({ type: 'SELECT_SECTION_BY_TAG', sectionId: activeSectionId, tag }, '*');
  };

  // Inspector delete element
  const handleDeleteElement = () => {
    if (!selectedElement) return;
    // We can simulate removal by hiding or setting display: none, or let the canvas handle it
    handleUpdateElementStyle('display', 'none');
    showToast(`Removed <${selectedElement.tagName}>`);
    setSelectedElement(null);
  };

  // Inspector duplicate element
  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    showToast(`Duplicate <${selectedElement.tagName}>`);
  };

  // Inspector select parent breadcrumb node
  const handleSelectParent = (selector: string) => {
    // Canvas selector selection can be triggered
  };

  // Full HTML assembly for export
  const fullHtmlContent = useMemo(() => {
    return reconstructDocument({
      ...doc,
      sections,
    });
  }, [doc, sections]);

  // Download complete HTML file
  const handleDownloadFullHtml = () => {
    const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (doc.title || 'webpage').toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.href = url;
    link.download = `${safeTitle}-redesigned.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded complete HTML file!');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-stone-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        documentTitle={doc.title}
        viewport={viewport}
        onViewportChange={setViewport}
        isolateSection={isolateSection}
        onToggleIsolate={() => setIsolateSection(!isolateSection)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenWordPressModal={() => setIsWpModalOpen(true)}
        onDownloadHtml={handleDownloadFullHtml}
        onOpenCodeView={() => setIsCodeModalOpen(true)}
        sectionCount={sections.length}
      />

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Section Navigator */}
        <SectionSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={handleNavigateToSection}
          onMoveSection={handleMoveSection}
          onRenameSection={handleRenameSection}
          onDeleteSection={handleDeleteSection}
          onDuplicateSection={handleDuplicateSection}
          onAddSection={handleAddSection}
          onQuickCopyWordPress={handleQuickCopyWordPress}
        />

        {/* Center: Live Interactive Visual Canvas */}
        <VisualCanvas
          doc={doc}
          sections={sections}
          activeSectionId={activeSectionId}
          isolateSection={isolateSection}
          viewport={viewport}
          onSelectElement={setSelectedElement}
          onUpdateSectionHtml={handleUpdateSectionHtml}
          selectedElement={selectedElement}
          contentRevision={contentRevision}
          onSelectSection={handleNavigateToSection}
          onActiveSectionChange={handleActiveSectionChangeFromCanvas}
          previewHover={previewHover}
        />

        {/* Right: Full Visual Design Inspector */}
        <InspectorPanel
          selectedElement={selectedElement}
          activeSection={sections.find((s) => s.id === activeSectionId)}
          onUpdateStyle={handleUpdateElementStyle}
          onUpdateHoverStyle={handleUpdateElementHoverStyle}
          onUpdateAttribute={handleUpdateElementAttribute}
          onUpdateText={handleUpdateElementText}
          onUpdateHtml={handleUpdateElementHtml}
          onChangeTag={handleUpdateElementTag}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onSelectParent={handleSelectParent}
          onSelectActiveSection={handleSelectActiveSectionRoot}
          onSelectElementByTag={handleSelectElementByTag}
          previewHover={previewHover}
          onTogglePreviewHover={() => setPreviewHover(!previewHover)}
        />
      </div>

      {/* WordPress & Page Builder Exporter Modal */}
      <WordPressModal
        isOpen={isWpModalOpen}
        onClose={() => setIsWpModalOpen(false)}
        sections={sections}
        activeSectionId={activeSectionId}
        globalStyles={doc.globalStyles}
        doc={doc}
      />

      {/* Import / Drop Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onLoadHtml={handleLoadNewHtml}
      />

      {/* Full Code Inspection Modal */}
      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        fullHtml={fullHtmlContent}
        onDownload={handleDownloadFullHtml}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-alert"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
