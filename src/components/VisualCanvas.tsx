import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Section, ParsedDocument, DeviceViewport, SelectedElementInfo, BreadcrumbNode } from '../types';
import { Monitor, Tablet, Smartphone, Maximize, ZoomIn, ZoomOut, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

interface VisualCanvasProps {
  doc: ParsedDocument;
  sections: Section[];
  activeSectionId: string;
  isolateSection: boolean;
  viewport: DeviceViewport;
  onSelectElement: (info: SelectedElementInfo | null) => void;
  onUpdateSectionHtml: (sectionId: string, newHtml: string) => void;
  selectedElement: SelectedElementInfo | null;
  contentRevision?: number;
  onSelectSection?: (id: string) => void;
  onActiveSectionChange?: (id: string) => void;
  previewHover?: boolean;
}

// Helper: generate path selector for element
const getSelectorPath = (el: Element): string => {
  if (el.id) return `#${el.id}`;
  const path: string[] = [];
  let current: Element | null = el;

  while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
    let sel = current.tagName.toLowerCase();
    if (current.id) {
      sel += `#${current.id}`;
      path.unshift(sel);
      break;
    } else {
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.tagName === current!.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          sel += `:nth-of-type(${index})`;
        }
      }
      path.unshift(sel);
    }
    current = current.parentElement;
  }
  return path.join(' > ');
};

// Helper: generate breadcrumbs
const getBreadcrumbs = (el: Element): BreadcrumbNode[] => {
  const trail: BreadcrumbNode[] = [];
  let curr: Element | null = el;
  let depth = 0;

  while (curr && curr.tagName !== 'BODY' && depth < 6) {
    trail.unshift({
      tagName: curr.tagName.toLowerCase(),
      id: curr.id || undefined,
      className: curr.className && typeof curr.className === 'string' ? curr.className.split(' ')[0] : undefined,
      selector: getSelectorPath(curr),
      index: depth++,
    });
    curr = curr.parentElement;
  }
  return trail;
};

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  doc,
  sections,
  activeSectionId,
  isolateSection,
  viewport,
  onSelectElement,
  onUpdateSectionHtml,
  selectedElement,
  contentRevision = 0,
  onSelectSection,
  onActiveSectionChange,
  previewHover = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const skipNextScrollRef = useRef<boolean>(false);
  const savedIframeScroll = useRef<{ top: number; left: number }>({ top: 0, left: 0 });

  // Structural key based on section IDs to avoid re-rendering iframe on style tweaks
  const sectionIdsKey = useMemo(() => sections.map((s) => s.id).join('-'), [sections]);

  // Compute the visible sections
  const visibleSections = useMemo(() => {
    if (isolateSection) {
      const active = sections.find((s) => s.id === activeSectionId);
      return active ? [active] : sections;
    }
    return sections;
  }, [sections, activeSectionId, isolateSection]);

  // Current active section object
  const currentActiveSec = useMemo(() => {
    return sections.find((s) => s.id === activeSectionId) || sections[0];
  }, [sections, activeSectionId]);

  // Active section index
  const activeIndex = useMemo(() => {
    return sections.findIndex((s) => s.id === activeSectionId);
  }, [sections, activeSectionId]);

  // Generate full HTML content to inject into iframe
  // Note: Only updates when doc changes, section structure changes (add/delete/reorder), isolate mode toggles, or revision bumps.
  // Crucial: Does NOT re-render on in-canvas element edits, preventing iframe reloads and scroll jumps!
  const iframeContent = useMemo(() => {
    const sectionsHtml = visibleSections
      .map((sec) => `<div class="__editor-section-wrapper" data-section-wrapper="${sec.id}">${sec.html}</div>`)
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title || 'Page Preview'}</title>
  ${doc.metaTags.join('\n')}
  ${doc.externalStyleSheets.join('\n')}
  <style>
${doc.globalStyles}

    /* Editor Canvas System Overlays */
    .__editor-hover-highlight {
      outline: 2px dashed #6366f1 !important;
      outline-offset: -1px !important;
      cursor: pointer !important;
    }
    .__editor-selected-highlight {
      outline: 2.5px solid #4f46e5 !important;
      outline-offset: -1px !important;
      position: relative !important;
    }
    .__editor-section-wrapper {
      position: relative !important;
      transition: outline 0.15s ease, box-shadow 0.15s ease;
    }
    .__editor-active-section {
      outline: 2.5px solid #4f46e5 !important;
      outline-offset: -2px !important;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.16), 0 8px 24px -4px rgba(79, 70, 229, 0.12) !important;
      position: relative !important;
      z-index: 10 !important;
    }
    .__editor-section-badge {
      position: absolute;
      top: 10px;
      left: 14px;
      background: #4f46e5;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 4px 10px;
      border-radius: 6px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      animation: __editorBadgeFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes __editorBadgeFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    /* Standard Animation Keyframes */
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.85; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-12px); }
      60% { transform: translateY(-6px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.25) contrast(1.1); }
      100% { filter: brightness(1); }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-4deg); }
      75% { transform: rotate(4deg); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      14% { transform: scale(1.1); }
      28% { transform: scale(1); }
      42% { transform: scale(1.15); }
      70% { transform: scale(1); }
    }
    [contenteditable="true"] {
      outline: 2px solid #10b981 !important;
      background-color: rgba(16, 185, 129, 0.05) !important;
    }
  </style>
  ${doc.headHtml}
</head>
<body>
  ${sectionsHtml}
</body>
</html>`;
  }, [
    doc.title,
    doc.rawHtml,
    doc.globalStyles,
    doc.headHtml,
    doc.metaTags,
    doc.externalStyleSheets,
    sectionIdsKey,
    isolateSection,
    isolateSection ? activeSectionId : null,
    contentRevision,
  ]);

  // Handle messages from iframe (fallback)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'ELEMENT_SELECTED') {
        const payload: SelectedElementInfo = event.data.payload;
        onSelectElement(payload);
        if (payload.sectionId && onActiveSectionChange) {
          onActiveSectionChange(payload.sectionId);
        }
      } else if (event.data.type === 'SECTION_HTML_UPDATED') {
        const { sectionId, newHtml } = event.data.payload;
        if (sectionId && newHtml) {
          onUpdateSectionHtml(sectionId, newHtml);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectElement, onUpdateSectionHtml, onActiveSectionChange]);

  // Sync active section highlight without scrolling the iframe window
  useEffect(() => {
    if (!activeSectionId || !iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    // Clear previous active section highlights and badges
    iframeDoc.querySelectorAll('.__editor-active-section').forEach((el) => {
      el.classList.remove('__editor-active-section');
    });
    iframeDoc.querySelectorAll('.__editor-section-badge').forEach((el) => {
      el.remove();
    });

    // Find the wrapper for this section and highlight it
    const wrapper = iframeDoc.querySelector(`[data-section-wrapper="${activeSectionId}"]`) as HTMLElement;
    if (wrapper) {
      wrapper.classList.add('__editor-active-section');

      // Create and attach floating section badge
      const activeSec = sections.find((s) => s.id === activeSectionId);
      const badge = iframeDoc.createElement('div');
      badge.className = '__editor-section-badge';
      badge.innerHTML = `<span>⚡ ${activeSec?.name || 'Selected Section'}</span>`;
      wrapper.appendChild(badge);
    }
  }, [activeSectionId, sections]);

  // Attach interactive script to iframe once loaded
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

    const iframeDoc = iframe.contentDocument;

    // Restore scroll position if iframe reloaded (e.g. from file import or structural change)
    if (savedIframeScroll.current.top > 0) {
      if (iframeDoc.documentElement) {
        iframeDoc.documentElement.scrollTop = savedIframeScroll.current.top;
      }
      if (iframeDoc.body) {
        iframeDoc.body.scrollTop = savedIframeScroll.current.top;
      }
    }

    // Continuously preserve scroll position
    const handleScroll = () => {
      const top = iframeDoc.documentElement?.scrollTop || iframeDoc.body?.scrollTop || 0;
      const left = iframeDoc.documentElement?.scrollLeft || iframeDoc.body?.scrollLeft || 0;
      savedIframeScroll.current = { top, left };
    };
    iframeDoc.removeEventListener('scroll', handleScroll);
    iframeDoc.addEventListener('scroll', handleScroll, { passive: true });

    // Prevent duplicate event listener attachments to the same document
    if ((iframeDoc as unknown as { __editorListenersAttached?: boolean }).__editorListenersAttached) {
      return;
    }
    (iframeDoc as unknown as { __editorListenersAttached?: boolean }).__editorListenersAttached = true;

    // Hover effect
    let currentHovered: Element | null = null;
    iframeDoc.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (!target || target === iframeDoc.body || target.classList.contains('__editor-section-wrapper')) {
        return;
      }

      if (currentHovered && currentHovered !== target) {
        currentHovered.classList.remove('__editor-hover-highlight');
      }
      target.classList.add('__editor-hover-highlight');
      currentHovered = target;
    });

    iframeDoc.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (target) target.classList.remove('__editor-hover-highlight');
    });

    // Intercept form submit inside iframe to prevent page reloads
    iframeDoc.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);

    // Click handler for selection in capture phase to completely intercept links and prevent any jump
    const handleDocClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      if (!target || target === iframeDoc.body || target === iframeDoc.documentElement) return;

      // If user is currently editing text inside a contenteditable element, allow typing, cursor clicking, and selecting!
      if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
        return;
      }

      // Prevent link navigation (e.g. href="#features") or button form submits
      e.preventDefault();
      e.stopPropagation();

      // If user clicked wrapper or badge, target the section root element
      if (target.classList.contains('__editor-section-wrapper')) {
        const first = target.firstElementChild as HTMLElement;
        if (first) target = first;
      } else if (target.classList.contains('__editor-section-badge') || target.closest('.__editor-section-badge')) {
        const wrap = target.closest('[data-section-wrapper]') as HTMLElement;
        if (wrap && wrap.firstElementChild) target = wrap.firstElementChild as HTMLElement;
      }

      // Find enclosing section wrapper
      const wrapper = (target.closest('[data-section-wrapper]') || target) as HTMLElement;
      const sectionId = wrapper.getAttribute('data-section-wrapper') || '';

      // Update active section highlight and badge immediately inside iframe WITHOUT scrolling
      iframeDoc.querySelectorAll('.__editor-active-section').forEach((el) => {
        el.classList.remove('__editor-active-section');
      });
      iframeDoc.querySelectorAll('.__editor-section-badge').forEach((el) => {
        el.remove();
      });

      if (wrapper && wrapper.hasAttribute('data-section-wrapper')) {
        wrapper.classList.add('__editor-active-section');
        const activeSec = sections.find((s) => s.id === sectionId);
        const badge = iframeDoc.createElement('div');
        badge.className = '__editor-section-badge';
        badge.innerHTML = `<span>⚡ ${activeSec?.name || 'Selected Section'}</span>`;
        wrapper.appendChild(badge);
      }

      // Clear previous element highlight and active marker and add to current target
      iframeDoc.querySelectorAll('.__editor-selected-highlight').forEach((el) => {
        el.classList.remove('__editor-selected-highlight');
      });
      iframeDoc.querySelectorAll('[data-editor-active-el]').forEach((el) => {
        el.removeAttribute('data-editor-active-el');
      });

      target.classList.add('__editor-selected-highlight');
      target.setAttribute('data-editor-active-el', 'true');

      // Extract inline and computed styles
      const inlineStyles: Record<string, string> = {};
      const computed = iframe.contentWindow!.getComputedStyle(target);

      const propsToCheck = [
        'font-family', 'font-size', 'font-weight', 'font-style', 'color', 'text-align',
        'line-height', 'letter-spacing', 'text-transform', 'text-decoration',
        'background-color', 'background', 'background-image', 'background-size', 'background-position',
        'backdrop-filter',
        'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
        'border-width', 'border-style', 'border-color', 'border-top', 'border-bottom',
        'box-shadow', 'text-shadow',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'width', 'max-width', 'height', 'min-height',
        'aspect-ratio', 'object-fit', 'object-position',
        'flex-direction', 'justify-content', 'align-items', 'gap',
        'transform', 'filter', 'transition',
        'opacity', 'display'
      ];

      propsToCheck.forEach((prop) => {
        const val = target.style.getPropertyValue(prop) || computed.getPropertyValue(prop);
        if (val) inlineStyles[prop] = val;
      });

      // Extract attributes
      const attributes: Record<string, string> = {};
      for (let i = 0; i < target.attributes.length; i++) {
        const attr = target.attributes[i];
        attributes[attr.name] = attr.value;
      }

      // Extract hover styles and hoverId if previously attached
      const hoverId = target.getAttribute('data-editor-hover-id') || target.id || undefined;
      let hoverStyles: Record<string, string> = {};
      const rawHover = target.getAttribute('data-editor-hover-styles');
      if (rawHover) {
        try {
          hoverStyles = JSON.parse(rawHover);
        } catch {
          // ignore parsing errors
        }
      }

      const info: SelectedElementInfo = {
        selector: getSelectorPath(target),
        elementId: target.id || undefined,
        hoverId,
        tagName: target.tagName.toLowerCase(),
        classList: Array.from(target.classList).filter(
          (c) => !c.startsWith('__editor-')
        ),
        textContent: target.textContent || '',
        innerHTML: target.innerHTML,
        sectionId,
        inlineStyles,
        hoverStyles,
        attributes,
        breadcrumb: getBreadcrumbs(target),
      };

      // Direct synchronous update to inspector without scrolling
      onSelectElement(info);

      // Notify parent of active section change without triggering section navigation scroll
      if (sectionId && onActiveSectionChange) {
        onActiveSectionChange(sectionId);
      }
    };

    iframeDoc.addEventListener('click', handleDocClick, true);

    // Robust inline text editor directly on canvas
    const startInlineEditing = (targetEl: HTMLElement) => {
      if (!targetEl || targetEl === iframeDoc.body || targetEl === iframeDoc.documentElement) return;
      if (targetEl.classList.contains('__editor-section-wrapper') || targetEl.classList.contains('__editor-section-badge')) return;

      // Find the most suitable text element (current element or closest text-bearing element)
      const textEl = (targetEl.closest('h1, h2, h3, h4, h5, h6, p, a, button, span, li, blockquote, label, em, strong, b') || targetEl) as HTMLElement;
      if (!textEl || textEl === iframeDoc.body) return;

      // Temporarily remove highlight box so user has clean view of the characters while typing
      textEl.classList.remove('__editor-selected-highlight', '__editor-hover-highlight');
      textEl.contentEditable = 'true';
      textEl.style.outline = '2px solid #8b5cf6';
      textEl.style.outlineOffset = '3px';
      textEl.style.borderRadius = '4px';
      textEl.setAttribute('data-editor-active-el', 'true');

      // Focus iframe window and element
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
      }
      textEl.focus();

      // Place caret at end of text
      try {
        const selection = iframe.contentWindow?.getSelection();
        const range = iframeDoc.createRange();
        range.selectNodeContents(textEl);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch {
        // fallback
      }

      let isFinished = false;
      const finishEditing = () => {
        if (isFinished) return;
        isFinished = true;

        textEl.contentEditable = 'false';
        textEl.style.outline = '';
        textEl.style.outlineOffset = '';
        textEl.style.borderRadius = '';
        textEl.classList.add('__editor-selected-highlight');
        textEl.removeEventListener('blur', finishEditing);
        textEl.removeEventListener('keydown', handleKeyDown);

        const secWrapper = textEl.closest('[data-section-wrapper]') as HTMLElement;
        if (secWrapper) {
          const sectionId = secWrapper.getAttribute('data-section-wrapper') || '';
          const sectionRoot = secWrapper.firstElementChild as HTMLElement;
          if (sectionRoot && sectionId) {
            const clone = sectionRoot.cloneNode(true) as HTMLElement;
            clone.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
            clone.removeAttribute('data-editor-active-el');
            clone.removeAttribute('contenteditable');
            clone.querySelectorAll('.__editor-selected-highlight, .__editor-hover-highlight, .__editor-active-section').forEach((c) => {
              c.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
            });
            clone.querySelectorAll('[data-editor-active-el], [contenteditable]').forEach((c) => {
              c.removeAttribute('data-editor-active-el');
              c.removeAttribute('contenteditable');
            });
            clone.querySelectorAll('.__editor-section-badge').forEach((b) => b.remove());
            onUpdateSectionHtml(sectionId, clone.outerHTML);
          }

          // Directly sync to inspector state
          const comp = iframe.contentWindow?.getComputedStyle(textEl);
          const inlineStyles: Record<string, string> = {};
          if (comp) {
            ['font-family', 'font-size', 'font-weight', 'color', 'background-color'].forEach((p) => {
              const val = textEl.style.getPropertyValue(p) || comp.getPropertyValue(p);
              if (val) inlineStyles[p] = val;
            });
          }

          onSelectElement({
            selector: getSelectorPath(textEl),
            elementId: textEl.id || undefined,
            tagName: textEl.tagName.toLowerCase(),
            classList: Array.from(textEl.classList).filter((c) => !c.startsWith('__editor-')),
            textContent: textEl.textContent || '',
            innerHTML: textEl.innerHTML,
            sectionId,
            inlineStyles,
            attributes: {},
            breadcrumb: getBreadcrumbs(textEl),
          });
        }
      };

      const handleKeyDown = (ke: KeyboardEvent) => {
        if (ke.key === 'Escape') {
          ke.preventDefault();
          textEl.blur();
        } else if (ke.key === 'Enter' && /^h[1-6]$/i.test(textEl.tagName) && !ke.shiftKey) {
          // Commit heading edits on Enter
          ke.preventDefault();
          textEl.blur();
        }
      };

      textEl.addEventListener('blur', finishEditing);
      textEl.addEventListener('keydown', handleKeyDown);
    };

    // Double-click to edit text inline on canvas
    iframeDoc.addEventListener('dblclick', (e) => {
      const target = e.target as HTMLElement;
      if (!target || target === iframeDoc.body || target === iframeDoc.documentElement) return;
      if (target.classList.contains('__editor-section-wrapper') || target.classList.contains('__editor-section-badge')) return;

      e.preventDefault();
      e.stopPropagation();

      startInlineEditing(target);
    });

    // Apply active section highlight on initial load
    if (activeSectionId) {
      const wrapper = iframeDoc.querySelector(`[data-section-wrapper="${activeSectionId}"]`) as HTMLElement;
      if (wrapper) {
        wrapper.classList.add('__editor-active-section');
        const activeSec = sections.find((s) => s.id === activeSectionId);
        const badge = iframeDoc.createElement('div');
        badge.className = '__editor-section-badge';
        badge.innerHTML = `<span>⚡ ${activeSec?.name || 'Selected Section'}</span>`;
        wrapper.appendChild(badge);
      }
    }
  }, [sections, activeSectionId, onSelectElement, onActiveSectionChange, onUpdateSectionHtml]);

  // Ensure event listeners are attached even if onLoad does not fire
  useEffect(() => {
    const attach = () => {
      if (iframeRef.current?.contentDocument?.body) {
        handleIframeLoad();
      }
    };
    attach();
    const t1 = setTimeout(attach, 100);
    return () => {
      clearTimeout(t1);
    };
  }, [handleIframeLoad, iframeContent]);

  // Listen for navigation and selection requests from sidebar or inspector
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (!iframeRef.current?.contentDocument) return;
      const iframeDoc = iframeRef.current.contentDocument;

      // Navigate from sidebar: smoothly scrolls to section and highlights section root
      if (e.data?.type === 'NAVIGATE_TO_SECTION') {
        const secId = e.data.sectionId;
        const wrapper = iframeDoc.querySelector(`[data-section-wrapper="${secId}"]`) as HTMLElement;
        if (wrapper) {
          wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
          iframeDoc.querySelectorAll('.__editor-active-section').forEach((el) => el.classList.remove('__editor-active-section'));
          iframeDoc.querySelectorAll('.__editor-section-badge').forEach((el) => el.remove());
          wrapper.classList.add('__editor-active-section');
          const activeSec = sections.find((s) => s.id === secId);
          const badge = iframeDoc.createElement('div');
          badge.className = '__editor-section-badge';
          badge.innerHTML = `<span>⚡ ${activeSec?.name || 'Selected Section'}</span>`;
          wrapper.appendChild(badge);

          const sectionRoot = (wrapper.firstElementChild as HTMLElement) || wrapper;
          if (sectionRoot) {
            iframeDoc.querySelectorAll('.__editor-selected-highlight').forEach((el) => el.classList.remove('__editor-selected-highlight'));
            sectionRoot.classList.add('__editor-selected-highlight');
          }
        }
      } else if (e.data?.type === 'HIGHLIGHT_SECTION_ROOT') {
        // Highlight section root without scrolling
        const secId = e.data.sectionId || activeSectionId;
        const wrapper = iframeDoc.querySelector(`[data-section-wrapper="${secId}"]`) as HTMLElement;
        if (wrapper) {
          const sectionRoot = (wrapper.firstElementChild as HTMLElement) || wrapper;
          if (sectionRoot) {
            iframeDoc.querySelectorAll('.__editor-selected-highlight').forEach((el) => el.classList.remove('__editor-selected-highlight'));
            sectionRoot.classList.add('__editor-selected-highlight');
          }
        }
      } else if (e.data?.type === 'SELECT_SECTION_BY_TAG') {
        const secId = e.data.sectionId || activeSectionId;
        const wrapper = iframeDoc.querySelector(`[data-section-wrapper="${secId}"]`);
        if (wrapper) {
          const match = wrapper.querySelector(e.data.tag) as HTMLElement;
          if (match) {
            iframeDoc.querySelectorAll('.__editor-selected-highlight').forEach((el) => el.classList.remove('__editor-selected-highlight'));
            match.classList.add('__editor-selected-highlight');
            // Extract and select element without native click scroll
            const comp = iframeRef.current?.contentWindow?.getComputedStyle(match);
            const inlineStyles: Record<string, string> = {};
            if (comp) {
              const props = ['font-family', 'font-size', 'font-weight', 'color', 'background-color', 'border-color'];
              props.forEach((p) => {
                const val = match.style.getPropertyValue(p) || comp.getPropertyValue(p);
                if (val) inlineStyles[p] = val;
              });
            }
            onSelectElement({
              selector: `${wrapper.tagName.toLowerCase()}[data-section-wrapper="${secId}"] ${e.data.tag}`,
              elementId: match.id || undefined,
              tagName: match.tagName.toLowerCase(),
              classList: Array.from(match.classList).filter((c) => !c.startsWith('__editor-')),
              textContent: match.textContent || '',
              innerHTML: match.innerHTML,
              sectionId: secId,
              inlineStyles,
              attributes: {},
              breadcrumb: [{ tagName: match.tagName.toLowerCase(), selector: '', index: 0 }],
            });
          }
        }
      } else if (e.data?.type === 'START_INLINE_EDIT') {
        const selector = e.data.selector || (selectedElement ? selectedElement.selector : '');
        let target: HTMLElement | null = null;
        if (selector) {
          target = (iframeDoc.querySelector('[data-editor-active-el="true"]') || iframeDoc.querySelector(selector)) as HTMLElement;
        }
        if (target) {
          target.contentEditable = 'true';
          target.style.outline = '2px solid #8b5cf6';
          target.style.outlineOffset = '3px';
          target.style.borderRadius = '4px';
          target.setAttribute('data-editor-active-el', 'true');
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.focus();
          }
          target.focus();
          try {
            const selection = iframeRef.current?.contentWindow?.getSelection();
            const range = iframeDoc.createRange();
            range.selectNodeContents(target);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          } catch {
            // fallback
          }

          const finishEditing = () => {
            target!.contentEditable = 'false';
            target!.style.outline = '';
            target!.style.outlineOffset = '';
            target!.style.borderRadius = '';
            target!.removeEventListener('blur', finishEditing);

            const secWrapper = target!.closest('[data-section-wrapper]') as HTMLElement;
            if (secWrapper) {
              const sectionId = secWrapper.getAttribute('data-section-wrapper') || '';
              const sectionRoot = secWrapper.firstElementChild as HTMLElement;
              if (sectionRoot && sectionId) {
                const clone = sectionRoot.cloneNode(true) as HTMLElement;
                clone.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
                clone.removeAttribute('data-editor-active-el');
                clone.removeAttribute('contenteditable');
                clone.querySelectorAll('.__editor-selected-highlight, .__editor-hover-highlight, .__editor-active-section').forEach((c) => {
                  c.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
                });
                clone.querySelectorAll('[data-editor-active-el], [contenteditable]').forEach((c) => {
                  c.removeAttribute('data-editor-active-el');
                  c.removeAttribute('contenteditable');
                });
                clone.querySelectorAll('.__editor-section-badge').forEach((b) => b.remove());
                onUpdateSectionHtml(sectionId, clone.outerHTML);
              }

              onSelectElement({
                ...selectedElement!,
                textContent: target!.textContent || '',
                innerHTML: target!.innerHTML,
              });
            }
          };
          target.addEventListener('blur', finishEditing);
        }
      } else if (e.data?.type === 'CHANGE_ELEMENT_TAG') {
        const newTagName = (e.data.newTag || 'h2').toLowerCase();
        const selector = e.data.selector || (selectedElement ? selectedElement.selector : '');
        const target = (iframeDoc.querySelector('[data-editor-active-el="true"]') || (selector ? iframeDoc.querySelector(selector) : null)) as HTMLElement;
        if (target && target.parentElement && target.tagName.toLowerCase() !== newTagName) {
          const newEl = iframeDoc.createElement(newTagName);
          Array.from(target.attributes).forEach((attr) => {
            newEl.setAttribute(attr.name, attr.value);
          });
          newEl.innerHTML = target.innerHTML;
          newEl.setAttribute('data-editor-active-el', 'true');
          newEl.classList.add('__editor-selected-highlight');
          target.parentElement.replaceChild(newEl, target);

          const secWrapper = newEl.closest('[data-section-wrapper]') as HTMLElement;
          if (secWrapper) {
            const sectionId = secWrapper.getAttribute('data-section-wrapper') || '';
            const sectionRoot = secWrapper.firstElementChild as HTMLElement;
            if (sectionRoot && sectionId) {
              const clone = sectionRoot.cloneNode(true) as HTMLElement;
              clone.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
              clone.removeAttribute('data-editor-active-el');
              clone.removeAttribute('contenteditable');
              clone.querySelectorAll('.__editor-selected-highlight, .__editor-hover-highlight, .__editor-active-section').forEach((c) => {
                c.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
              });
              clone.querySelectorAll('[data-editor-active-el], [contenteditable]').forEach((c) => {
                c.removeAttribute('data-editor-active-el');
                c.removeAttribute('contenteditable');
              });
              clone.querySelectorAll('.__editor-section-badge').forEach((b) => b.remove());
              onUpdateSectionHtml(sectionId, clone.outerHTML);
            }
          }

          onSelectElement({
            selector: getSelectorPath(newEl),
            elementId: newEl.id || undefined,
            tagName: newTagName,
            classList: Array.from(newEl.classList).filter((c: string) => !c.startsWith('__editor-')),
            textContent: newEl.textContent || '',
            innerHTML: newEl.innerHTML,
            sectionId: selectedElement?.sectionId || '',
            inlineStyles: selectedElement?.inlineStyles || {},
            attributes: selectedElement?.attributes || {},
            breadcrumb: getBreadcrumbs(newEl),
          });
        }
      } else if (e.data?.type === 'TEST_ELEMENT_TRANSITION') {
        const selector = e.data.selector || (selectedElement ? selectedElement.selector : '');
        const target = (iframeDoc.querySelector('[data-editor-active-el="true"]') || (selector ? iframeDoc.querySelector(selector) : null)) as HTMLElement;
        if (target) {
          const originalTransform = target.style.transform;
          const originalBoxShadow = target.style.boxShadow;
          
          target.style.transform = originalTransform
            ? `${originalTransform} translateY(-8px) scale(1.03)`
            : 'translateY(-8px) scale(1.03)';
          target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)';

          setTimeout(() => {
            target.style.transform = originalTransform;
            target.style.boxShadow = originalBoxShadow;
          }, 650);
        }
      }
    };

    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [activeSectionId, sections, onSelectElement, selectedElement]);

  // Update DOM directly when styles or text are modified via Inspector for 0-latency live editing
  useEffect(() => {
    if (!selectedElement || !iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    try {
      const el = (iframeDoc.querySelector('[data-editor-active-el="true"]') ||
                  iframeDoc.querySelector(selectedElement.selector)) as HTMLElement;
      if (!el) return;

      // Ensure highlight is on
      if (!el.classList.contains('__editor-selected-highlight')) {
        iframeDoc.querySelectorAll('.__editor-selected-highlight').forEach((c) => {
          c.classList.remove('__editor-selected-highlight');
        });
        el.classList.add('__editor-selected-highlight');
      }

      let hasActualChange = false;

      // Re-apply styles
      Object.entries(selectedElement.inlineStyles).forEach(([prop, val]) => {
        if (typeof val === 'string' && el.style.getPropertyValue(prop) !== val) {
          el.style.setProperty(prop, val);
          hasActualChange = true;
        }
      });

      // Re-apply attributes
      Object.entries(selectedElement.attributes).forEach(([attr, val]) => {
        if (attr !== 'style' && !attr.startsWith('data-editor') && typeof val === 'string') {
          if (el.getAttribute(attr) !== val) {
            el.setAttribute(attr, val);
            hasActualChange = true;
          }
        }
      });

      // Update HTML or text content
      if (selectedElement.innerHTML !== undefined) {
        if (el.innerHTML !== selectedElement.innerHTML) {
          el.innerHTML = selectedElement.innerHTML;
          hasActualChange = true;
        }
      } else if (selectedElement.textContent !== undefined) {
        if (el.textContent !== selectedElement.textContent) {
          el.textContent = selectedElement.textContent;
          hasActualChange = true;
        }
      }

      // Sync hover styles
      if (selectedElement.hoverStyles) {
        let hoverId = el.getAttribute('data-editor-hover-id') || selectedElement.hoverId || el.id;
        const hasHoverProps = Object.keys(selectedElement.hoverStyles).length > 0;

        if (!hoverId && hasHoverProps) {
          hoverId = `wp-hvr-${Math.random().toString(36).substring(2, 8)}`;
          el.setAttribute('data-editor-hover-id', hoverId);
          hasActualChange = true;
        }

        const currentHoverRaw = el.getAttribute('data-editor-hover-styles') || '';
        const newHoverRaw = hasHoverProps ? JSON.stringify(selectedElement.hoverStyles) : '';

        if (currentHoverRaw !== newHoverRaw) {
          if (newHoverRaw) {
            el.setAttribute('data-editor-hover-styles', newHoverRaw);
            if (!el.style.transition) {
              el.style.transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';
            }
          } else {
            el.removeAttribute('data-editor-hover-styles');
          }
          hasActualChange = true;
        }
      }

      // Update or create iframe-wide hover rules style tag
      let hoverStyleEl = iframeDoc.getElementById('__editor-live-hover-rules') as HTMLStyleElement;
      if (!hoverStyleEl) {
        hoverStyleEl = iframeDoc.createElement('style');
        hoverStyleEl.id = '__editor-live-hover-rules';
        iframeDoc.head.appendChild(hoverStyleEl);
      }

      // Re-scan all elements with data-editor-hover-styles and generate active hover rules
      const allHoverElements = iframeDoc.querySelectorAll('[data-editor-hover-styles]');
      const liveHoverCss: string[] = [];
      allHoverElements.forEach((hEl) => {
        try {
          const raw = hEl.getAttribute('data-editor-hover-styles');
          if (!raw) return;
          const hStyles: Record<string, string> = JSON.parse(raw);
          const hId = hEl.getAttribute('data-editor-hover-id') || hEl.id;
          if (hId && Object.keys(hStyles).length > 0) {
            const decls = Object.entries(hStyles)
              .map(([p, v]) => `  ${p}: ${v} !important;`)
              .join('\n');
            liveHoverCss.push(
              `[data-editor-hover-id="${hId}"]:hover, #${hId}:hover {\n${decls}\n}`
            );

            // If previewHover is active and this is the selected element, apply directly!
            if (previewHover && hEl === el) {
              liveHoverCss.push(
                `[data-editor-hover-id="${hId}"], #${hId} {\n${decls}\n}`
              );
            }
          }
        } catch {
          // ignore
        }
      });
      hoverStyleEl.textContent = liveHoverCss.join('\n\n');

      // ONLY sync section HTML back to parent state if there WERE actual modifications!
      // NEVER sync on initial element selection to avoid unnecessary state churn
      if (hasActualChange) {
        const secWrapper = el.closest('[data-section-wrapper]') as HTMLElement;
        if (secWrapper) {
          const sectionId = secWrapper.getAttribute('data-section-wrapper');
          const sectionRoot = secWrapper.firstElementChild as HTMLElement;
          if (sectionRoot && sectionId) {
            const clone = sectionRoot.cloneNode(true) as HTMLElement;
            clone.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
            clone.removeAttribute('data-editor-active-el');
            clone.removeAttribute('contenteditable');
            clone.querySelectorAll('.__editor-selected-highlight, .__editor-hover-highlight, .__editor-active-section').forEach((c) => {
              c.classList.remove('__editor-selected-highlight', '__editor-hover-highlight', '__editor-active-section');
            });
            clone.querySelectorAll('[data-editor-active-el], [contenteditable]').forEach((c) => {
              c.removeAttribute('data-editor-active-el');
              c.removeAttribute('contenteditable');
            });
            clone.querySelectorAll('.__editor-section-badge').forEach((b) => b.remove());
            onUpdateSectionHtml(sectionId, clone.outerHTML);
          }
        }
      }
    } catch (e) {
      console.warn('Could not sync selected element DOM:', e);
    }
  }, [selectedElement, onUpdateSectionHtml, previewHover]);

  // Viewport widths
  const viewportWidth = useMemo(() => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1240px]';
    }
  }, [viewport]);

  // Section stepping helper
  const handleStepSection = (direction: 'prev' | 'next') => {
    if (sections.length === 0) return;
    let nextIdx = activeIndex + (direction === 'next' ? 1 : -1);
    if (nextIdx < 0) nextIdx = sections.length - 1;
    if (nextIdx >= sections.length) nextIdx = 0;
    if (onSelectSection && sections[nextIdx]) {
      onSelectSection(sections[nextIdx].id);
    }
  };

  return (
    <div
      id="visual-canvas-workspace"
      className="flex-1 bg-stone-100 flex flex-col overflow-hidden relative"
    >
      {/* Canvas Top Bar */}
      <div className="h-9 px-4 border-b border-stone-200/80 bg-white/70 backdrop-blur-xs flex items-center justify-between text-xs text-stone-600 shrink-0 select-none">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-[11px] text-stone-400">Mode:</span>
          <span className="font-semibold text-stone-800">
            {isolateSection ? 'Single Section Isolation' : 'Full Page Stack'}
          </span>
          {isolateSection && (
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
              Isolated
            </span>
          )}
          <div className="h-3.5 w-px bg-stone-200 mx-1 hidden sm:block" />

          {/* Active section label & quick navigation */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400">Selected:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded text-[11px] max-w-[180px] truncate">
              {currentActiveSec?.name || 'None'}
            </span>
            <div className="flex items-center gap-0.5 ml-0.5">
              <button
                onClick={() => handleStepSection('prev')}
                title="Jump to previous section"
                className="p-0.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStepSection('next')}
                title="Jump to next section"
                className="p-0.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          id="preview-viewport-frame"
          className={`${viewportWidth} bg-white rounded-lg shadow-lg border border-stone-200/90 transition-all duration-200 overflow-hidden min-h-[600px]`}
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            ref={iframeRef}
            id="interactive-preview-iframe"
            title="Visual Design Sandbox"
            srcDoc={iframeContent}
            onLoad={handleIframeLoad}
            className="w-full h-full min-h-[850px] border-0 block"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};
