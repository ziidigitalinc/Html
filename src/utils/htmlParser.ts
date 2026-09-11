import { Section, SectionType, ParsedDocument } from '../types';

let sectionCounter = 1;

/**
 * Heuristics to classify section type based on tag, class, id, and content
 */
export function detectSectionType(
  el: Element,
  index: number,
  total: number,
  prevType?: SectionType
): { type: SectionType; name: string } {
  const tag = el.tagName.toLowerCase();
  const id = (el.id || '').toLowerCase();
  const className = (el.className || '').toString().toLowerCase();
  const text = (el.textContent || '').toLowerCase().slice(0, 300);
  const combined = `${tag} ${id} ${className} ${text}`;

  // Header / Navigation
  if (
    tag === 'header' ||
    tag === 'nav' ||
    id.includes('header') ||
    id.includes('nav') ||
    className.includes('header') ||
    className.includes('nav') ||
    className.includes('navbar') ||
    (index === 0 && (el.querySelector('nav') !== null || el.querySelector('ul') !== null))
  ) {
    return { type: 'header', name: 'Header / Navigation' };
  }

  // Footer
  if (
    tag === 'footer' ||
    id.includes('footer') ||
    className.includes('footer') ||
    index === total - 1 ||
    combined.includes('copyright') ||
    combined.includes('all rights reserved')
  ) {
    return { type: 'footer', name: 'Footer Section' };
  }

  // Hero Section
  if (
    id.includes('hero') ||
    className.includes('hero') ||
    id.includes('banner') ||
    className.includes('banner') ||
    id.includes('intro') ||
    className.includes('intro') ||
    (index <= 1 && (el.querySelector('h1') !== null || prevType === 'header'))
  ) {
    return { type: 'hero', name: 'Hero / Main Banner' };
  }

  // Sub-hero / Logos / Stats (right after hero or contains logos/stats)
  if (
    prevType === 'hero' &&
    (combined.includes('partner') ||
      combined.includes('logo') ||
      combined.includes('brand') ||
      combined.includes('trust') ||
      combined.includes('stat') ||
      combined.includes('number') ||
      el.querySelectorAll('img').length >= 3)
  ) {
    return { type: 'subhero', name: 'Sub-Hero / Logos & Proof' };
  }

  // Pre-Footer / CTA
  if (
    index === total - 2 ||
    id.includes('cta') ||
    className.includes('cta') ||
    combined.includes('call to action') ||
    combined.includes('subscribe') ||
    combined.includes('newsletter') ||
    combined.includes('get started') ||
    combined.includes('sign up now') ||
    combined.includes('ready to')
  ) {
    return { type: 'prefooter', name: 'Pre-Footer / Call to Action' };
  }

  // Testimonials
  if (
    combined.includes('testimonial') ||
    combined.includes('review') ||
    combined.includes('feedback') ||
    combined.includes('what our clients') ||
    combined.includes('stories')
  ) {
    return { type: 'testimonials', name: 'Testimonials & Reviews' };
  }

  // Pricing
  if (
    combined.includes('pricing') ||
    combined.includes('plan') ||
    combined.includes('tier') ||
    combined.includes('cost') ||
    combined.includes('per month')
  ) {
    return { type: 'pricing', name: 'Pricing & Plans' };
  }

  // Features / Center
  if (
    combined.includes('feature') ||
    combined.includes('service') ||
    combined.includes('benefit') ||
    combined.includes('solution') ||
    combined.includes('how it works') ||
    combined.includes('grid') ||
    combined.includes('content') ||
    el.querySelectorAll('.card, [class*="item"], [class*="card"], [class*="feature"]').length > 0
  ) {
    return { type: 'features', name: 'Center / Features & Content' };
  }

  // Default naming
  return {
    type: 'center',
    name: `Section ${index + 1} (${tag}${el.id ? '#' + el.id : ''})`,
  };
}

/**
 * Parses raw HTML string into structured sections and metadata
 */
export function parseHtmlDocument(rawHtml: string): ParsedDocument {
  const parser = new DOMParser();
  // Ensure we have a valid html structure
  let processedHtml = rawHtml.trim();
  if (!processedHtml.toLowerCase().includes('<html')) {
    processedHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Webpage</title></head><body>${processedHtml}</body></html>`;
  }

  const doc = parser.parseFromString(processedHtml, 'text/html');

  const title = doc.title || 'Redesigned Webpage';

  // Extract meta tags
  const metaTags: string[] = [];
  doc.querySelectorAll('head meta').forEach((meta) => {
    metaTags.push(meta.outerHTML);
  });

  // Extract external styles & scripts
  const externalStyleSheets: string[] = [];
  doc.querySelectorAll('head link[rel="stylesheet"], head link[href*="font"]').forEach((link) => {
    externalStyleSheets.push(link.outerHTML);
  });

  const externalScripts: string[] = [];
  doc.querySelectorAll('script[src]').forEach((script) => {
    externalScripts.push(script.outerHTML);
  });

  // Extract inline <style> contents
  let globalStyles = '';
  doc.querySelectorAll('style').forEach((styleEl) => {
    globalStyles += styleEl.textContent + '\n';
  });

  // Get Head HTML (excluding styles which we manage)
  const headClone = doc.head ? (doc.head.cloneNode(true) as HTMLHeadElement) : null;
  if (headClone) {
    headClone.querySelectorAll('style').forEach((s) => s.remove());
  }
  const headHtml = headClone ? headClone.innerHTML : '';

  // Extract candidates for sections from <body>
  const body = doc.body;
  const sectionCandidates: HTMLElement[] = [];

  // Determine top-level blocks
  // Check if body has a single wrapper (e.g. #app, .wrapper, or main)
  let container: HTMLElement = body;
  const bodyChildren = Array.from(body.children).filter(
    (el) => !['script', 'style', 'noscript', 'template'].includes(el.tagName.toLowerCase())
  ) as HTMLElement[];

  if (bodyChildren.length === 1 && ['div', 'main'].includes(bodyChildren[0].tagName.toLowerCase())) {
    // If the single child has multiple section-like children, dig into it
    const innerChildren = Array.from(bodyChildren[0].children).filter(
      (el) => !['script', 'style', 'noscript', 'template'].includes(el.tagName.toLowerCase())
    ) as HTMLElement[];
    if (innerChildren.length >= 2) {
      container = bodyChildren[0];
    }
  }

  const directChildren = Array.from(container.children).filter(
    (el) => !['script', 'style', 'noscript', 'template'].includes(el.tagName.toLowerCase())
  ) as HTMLElement[];

  // If there's a `<main>` alongside `<header>` and `<footer>`, expand `<main>` children!
  directChildren.forEach((child) => {
    const tag = child.tagName.toLowerCase();
    if (tag === 'main') {
      const mainChildren = Array.from(child.children).filter(
        (el) => !['script', 'style', 'noscript', 'template'].includes(el.tagName.toLowerCase())
      ) as HTMLElement[];
      if (mainChildren.length > 0) {
        sectionCandidates.push(...mainChildren);
      } else {
        sectionCandidates.push(child);
      }
    } else {
      sectionCandidates.push(child);
    }
  });

  // If sectionCandidates is empty, treat the whole body content as one section
  if (sectionCandidates.length === 0) {
    const fallbackSection = document.createElement('div');
    fallbackSection.innerHTML = body.innerHTML;
    sectionCandidates.push(fallbackSection);
  }

  // Build Section objects
  const sections: Section[] = [];
  let prevType: SectionType | undefined;

  sectionCandidates.forEach((el, index) => {
    const id = `sec-${sectionCounter++}`;
    el.setAttribute('data-section-id', id);

    const { type, name } = detectSectionType(el, index, sectionCandidates.length, prevType);
    prevType = type;

    // Capture attributes
    const attributes: Record<string, string> = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attributes[attr.name] = attr.value;
    }

    sections.push({
      id,
      name,
      type,
      html: el.outerHTML,
      tagName: el.tagName.toLowerCase(),
      attributes,
      collapsed: false,
    });
  });

  return {
    title,
    headHtml,
    globalStyles,
    sections,
    rawHtml,
    metaTags,
    externalScripts,
    externalStyleSheets,
  };
}

/**
 * Reconstructs a full standalone HTML document from the sections and metadata
 */
export function reconstructDocument(
  doc: ParsedDocument,
  options?: { includeEditorScripts?: boolean }
): string {
  const sectionsHtml = doc.sections.map((s) => s.html).join('\n\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(doc.title)}</title>
  ${doc.metaTags.join('\n  ')}
  ${doc.externalStyleSheets.join('\n  ')}
  <style>
${doc.globalStyles.trim()}
  </style>
  ${doc.headHtml.trim()}
</head>
<body>
  ${sectionsHtml}
  ${doc.externalScripts.join('\n  ')}
</body>
</html>`;
}

/**
 * Formats HTML string with indentations
 */
export function formatHtml(html: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  // Remove whitespace between tags
  const clean = html.replace(/>\s+</g, '><').trim();

  // Tokens
  const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      formatted += `${tab.repeat(indent)}${token}\n`;
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.endsWith('/>')) {
      const match = token.match(/<([a-zA-Z0-9\-]+)/);
      const tag = match ? match[1].toLowerCase() : '';
      
      if (voidTags.has(tag)) {
        formatted += `${tab.repeat(indent)}${token}\n`;
      } else {
        formatted += `${tab.repeat(indent)}${token}\n`;
        indent++;
      }
    } else if (token.startsWith('<!') || token.endsWith('/>')) {
      formatted += `${tab.repeat(indent)}${token}\n`;
    } else {
      // Text content
      formatted += `${tab.repeat(indent)}${token}\n`;
    }
  }

  return formatted.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
