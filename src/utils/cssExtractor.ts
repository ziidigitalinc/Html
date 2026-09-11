/**
 * CSS Extractor & Inliner for WordPress Page Builders (Elementor, Gutenberg, Divi)
 * Accurately extracts, scopes, and inlines styles for extracted sections.
 */

/**
 * Scopes a selector so that:
 * 1. Selectors targeting the root element become `#scopeId.class` or `#scopeId` (NO space)
 * 2. Selectors targeting descendant elements become `#scopeId selector` (with space)
 */
function scopeSelector(sel: string, scopeId: string, rootEl: HTMLElement): string {
  const trimmed = sel.trim();
  if (!trimmed) return trimmed;

  // If already scoped to this ID, keep it
  if (trimmed.includes(`#${scopeId}`)) return trimmed;

  // Clean pseudo-classes to check element matching
  const cleanSel = trimmed
    .replace(/::?(hover|active|focus|visited|focus-visible|focus-within|before|after|placeholder|first-child|last-child|nth-child\([^)]*\))/g, '')
    .trim();

  // Check if this selector matches the root element itself
  let matchesRoot = false;
  if (cleanSel) {
    try {
      if (rootEl.matches(cleanSel)) {
        matchesRoot = true;
      }
    } catch {
      // Invalid selector test
    }
  }

  if (matchesRoot) {
    // Target is the root element itself!
    // Example: "header" -> "header#scopeId" or "#scopeId"
    // Example: ".hero-section" -> "#scopeId.hero-section"
    // Example: ".hero-section:hover" -> "#scopeId.hero-section:hover"
    if (trimmed.startsWith('.')) {
      return `#${scopeId}${trimmed}`;
    } else if (/^[a-zA-Z0-9_-]+$/.test(cleanSel)) {
      // Tag selector like "header" or "section"
      return `${cleanSel}#${scopeId}${trimmed.slice(cleanSel.length)}`;
    } else {
      return `#${scopeId}${trimmed.startsWith('.') ? '' : ' '}${trimmed}`;
    }
  }

  // Check if first compound selector matches root element (e.g. "header .nav-link" where root is "header")
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    const firstPart = parts[0].replace(/::?[a-zA-Z0-9_-]+/g, '');
    try {
      if (rootEl.matches(firstPart)) {
        const remaining = parts.slice(1).join(' ');
        if (parts[0].startsWith('.')) {
          return `#${scopeId}${parts[0]} ${remaining}`;
        } else {
          return `#${scopeId} ${remaining}`;
        }
      }
    } catch {
      // ignore
    }
  }

  // Otherwise, selector targets a descendant inside the section
  return `#${scopeId} ${trimmed}`;
}

/**
 * Extracts all CSS rules matching a section from global stylesheets.
 */
export function extractStylesForSection(
  sectionHtml: string,
  globalCss: string,
  options: {
    scopeId?: string;
    includeMediaQueries?: boolean;
    includeKeyframes?: boolean;
    includeFontFaces?: boolean;
  } = {}
): {
  scopedCss: string;
  matchedRulesCount: number;
  scopeId: string;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sectionHtml, 'text/html');
  let rootEl = doc.body.firstElementChild as HTMLElement;

  if (!rootEl) {
    const wrap = parser.parseFromString(`<div>${sectionHtml}</div>`, 'text/html');
    rootEl = wrap.body.firstElementChild as HTMLElement;
  }

  if (!rootEl) {
    return { scopedCss: '', matchedRulesCount: 0, scopeId: '' };
  }

  // Ensure root element has an ID for clean CSS scoping
  let scopeId = options.scopeId || rootEl.id;
  if (!scopeId) {
    scopeId = `wp-sec-${Math.random().toString(36).substring(2, 8)}`;
    rootEl.id = scopeId;
  }

  const matchedRules: string[] = [];
  const rootVariables: string[] = [];
  const fontFaces: string[] = [];
  const keyframes: string[] = [];
  const mediaQueries: string[] = [];

  // Parse CSS rules using temporary style element
  const styleEl = document.createElement('style');
  styleEl.textContent = globalCss;
  document.head.appendChild(styleEl);

  let sheet: CSSStyleSheet | null = null;
  try {
    sheet = styleEl.sheet as CSSStyleSheet;
  } catch (e) {
    console.warn('Could not read stylesheet:', e);
  }

  if (sheet) {
    try {
      const rules = sheet.cssRules || sheet.rules;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        if (rule instanceof CSSFontFaceRule) {
          fontFaces.push(rule.cssText);
        } else if (rule instanceof CSSKeyframesRule) {
          keyframes.push(rule.cssText);
        } else if (rule instanceof CSSMediaRule) {
          // Check if any rule inside media query matches
          const innerMatched: string[] = [];
          for (let j = 0; j < rule.cssRules.length; j++) {
            const innerRule = rule.cssRules[j];
            if (innerRule instanceof CSSStyleRule) {
              const selectors = innerRule.selectorText.split(',').map((s) => s.trim());
              const matchedSelectors: string[] = [];

              for (const sel of selectors) {
                if (doesSelectorMatchSection(sel, rootEl)) {
                  matchedSelectors.push(scopeSelector(sel, scopeId, rootEl));
                }
              }

              if (matchedSelectors.length > 0) {
                innerMatched.push(`${matchedSelectors.join(', ')} ${getRuleBody(innerRule)}`);
              }
            }
          }

          if (innerMatched.length > 0) {
            mediaQueries.push(`@media ${rule.conditionText} {\n  ${innerMatched.join('\n  ')}\n}`);
          }
        } else if (rule instanceof CSSStyleRule) {
          const selText = rule.selectorText.trim();

          // Collect CSS custom properties (variables) from :root, html, or body
          if (selText === ':root' || selText === 'html' || selText === 'body') {
            const cssText = rule.style.cssText;
            if (cssText) {
              const declarations = cssText.split(';').map((d) => d.trim()).filter(Boolean);
              declarations.forEach((decl) => {
                if (decl.startsWith('--') || decl.startsWith('font-family')) {
                  rootVariables.push(`  ${decl};`);
                }
              });
            }
            continue;
          }

          const selectors = selText.split(',').map((s) => s.trim());
          const matchedSelectors: string[] = [];

          for (const sel of selectors) {
            if (doesSelectorMatchSection(sel, rootEl)) {
              matchedSelectors.push(scopeSelector(sel, scopeId, rootEl));
            }
          }

          if (matchedSelectors.length > 0) {
            matchedRules.push(`${matchedSelectors.join(', ')} ${getRuleBody(rule)}`);
          }
        }
      }
    } catch (e) {
      console.warn('Error extracting css rules:', e);
    }
  }

  // Clean up temporary style element
  if (styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
  }

  // Assemble scoped stylesheet
  const outputParts: string[] = [];

  // 1. Font Faces
  if (options.includeFontFaces !== false && fontFaces.length > 0) {
    outputParts.push(fontFaces.join('\n'));
  }

  // 2. Section Base Reset (guarantees Elementor theme box-sizing won't break layouts)
  outputParts.push(
    `/* Elementor & WordPress Reset for #${scopeId} */\n#${scopeId}, #${scopeId} *, #${scopeId} *::before, #${scopeId} *::after {\n  box-sizing: border-box;\n}`
  );

  // 3. CSS Variables & Inherited Properties on the section root
  if (rootVariables.length > 0) {
    outputParts.push(
      `/* Inherited CSS Variables */\n#${scopeId} {\n${rootVariables.join('\n')}\n}`
    );
  }

  // 4. Matched CSS Rules
  if (matchedRules.length > 0) {
    outputParts.push(matchedRules.join('\n\n'));
  }

  // 5. Keyframes
  if (options.includeKeyframes !== false && keyframes.length > 0) {
    outputParts.push(keyframes.join('\n\n'));
  }

  // 6. Media Queries
  if (options.includeMediaQueries !== false && mediaQueries.length > 0) {
    outputParts.push(mediaQueries.join('\n\n'));
  }

  return {
    scopedCss: outputParts.join('\n\n'),
    matchedRulesCount: matchedRules.length,
    scopeId,
  };
}

function getRuleBody(rule: CSSStyleRule): string {
  const css = rule.style.cssText;
  if (!css) return '{}';
  const lines = css
    .split(';')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `  ${l};`);
  return `{\n${lines.join('\n')}\n}`;
}

function doesSelectorMatchSection(selectorText: string, rootEl: HTMLElement): boolean {
  const sel = selectorText.trim();
  if (!sel || sel === '*' || sel === 'html' || sel === 'body') return false;

  // Clean pseudo-elements and pseudo-classes to check element existence
  const cleanSel = sel
    .replace(/::?(hover|active|focus|visited|focus-visible|focus-within|before|after|placeholder|first-child|last-child|nth-child\([^)]*\))/g, '')
    .trim();

  if (!cleanSel) return false;

  try {
    if (rootEl.matches(cleanSel)) return true;
    if (rootEl.querySelector(cleanSel)) return true;

    // Check compound selectors where first part matches root
    const firstPart = cleanSel.split(/\s+/)[0];
    if (firstPart && rootEl.matches(firstPart)) {
      return true;
    }
  } catch {
    // Skip unsupported or malformed selector
  }

  return false;
}

/**
 * Converts matched CSS styles into inline style attributes for every element in the section.
 * This guarantees 100% theme immunity in Elementor and Gutenberg.
 */
export function inlineCssIntoSectionHtml(
  sectionHtml: string,
  globalCss: string,
  externalStyleSheets: string[] = []
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sectionHtml, 'text/html');
  const rootEl = (doc.body.firstElementChild as HTMLElement) || doc.body;

  if (!rootEl) return sectionHtml;

  // Parse CSS rules into DOM style sheet
  const styleEl = document.createElement('style');
  styleEl.textContent = globalCss;
  document.head.appendChild(styleEl);

  const responsiveRules: string[] = [];

  try {
    const sheet = styleEl.sheet as CSSStyleSheet;
    if (sheet) {
      const rules = sheet.cssRules || sheet.rules;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        if (rule instanceof CSSMediaRule) {
          responsiveRules.push(rule.cssText);
        } else if (rule instanceof CSSStyleRule) {
          const selectors = rule.selectorText.split(',').map((s) => s.trim());
          for (const sel of selectors) {
            // Keep hover states and pseudo-classes in responsiveRules
            if (sel.includes(':hover') || sel.includes(':focus') || sel.includes('::before') || sel.includes('::after')) {
              responsiveRules.push(`${sel} { ${rule.style.cssText} }`);
              continue;
            }

            try {
              const matchedEls: HTMLElement[] = [];
              if (rootEl.matches(sel)) matchedEls.push(rootEl);
              matchedEls.push(...Array.from(rootEl.querySelectorAll(sel) as NodeListOf<HTMLElement>));

              matchedEls.forEach((el) => {
                const existing = el.getAttribute('style') || '';
                const declarations = rule.style.cssText;
                if (declarations) {
                  // Prepend rule styles so explicit existing inline styles win
                  el.setAttribute('style', `${declarations}; ${existing}`);
                }
              });
            } catch {
              // Ignore invalid selector
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error inlining css:', e);
  } finally {
    if (styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
  }

  // Ensure root element has box-sizing
  const rootStyle = rootEl.getAttribute('style') || '';
  if (!rootStyle.includes('box-sizing')) {
    rootEl.setAttribute('style', `box-sizing: border-box; ${rootStyle}`);
  }

  // Include external fonts/stylesheets if provided
  const fontLinks = externalStyleSheets.filter((l) => l.includes('font') || l.includes('css')).join('\n');

  let result = rootEl.outerHTML;
  if (responsiveRules.length > 0) {
    result = `<style>\n${responsiveRules.join('\n')}\n</style>\n${result}`;
  }
  if (fontLinks) {
    result = `${fontLinks}\n${result}`;
  }

  return result;
}

/**
 * Builds the complete, ready-to-paste bundle for WordPress Page Builders (Elementor / Gutenberg / Divi)
 */
export function buildWordPressBundle(
  sectionHtml: string,
  globalCss: string,
  sectionName: string,
  mode: 'scoped' | 'inline' | 'clean' = 'scoped',
  externalStyleSheets: string[] = []
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sectionHtml, 'text/html');
  const rootEl = doc.body.firstElementChild as HTMLElement;

  if (!rootEl) return sectionHtml;

  // Ensure root element has an ID
  let sectionId = rootEl.id;
  if (!sectionId) {
    sectionId = `wp-sec-${Math.random().toString(36).substring(2, 8)}`;
    rootEl.id = sectionId;
  }

  // Gather font links
  const fontLinks = externalStyleSheets
    .filter((l) => l.includes('http') || l.includes('font') || l.includes('css'))
    .join('\n');

  // Extract custom hover rules from data-editor-hover-styles attributes
  const hoverElements = Array.from(rootEl.querySelectorAll('[data-editor-hover-styles]'));
  if (rootEl.hasAttribute('data-editor-hover-styles')) {
    hoverElements.unshift(rootEl);
  }

  const customHoverCssRules: string[] = [];
  hoverElements.forEach((el) => {
    try {
      const raw = el.getAttribute('data-editor-hover-styles');
      if (!raw) return;
      const hoverData: Record<string, string> = JSON.parse(raw);
      const hoverId = el.getAttribute('data-editor-hover-id') || el.id;
      if (hoverId && Object.keys(hoverData).length > 0) {
        const decls = Object.entries(hoverData)
          .map(([prop, val]) => `  ${prop}: ${val} !important;`)
          .join('\n');
        customHoverCssRules.push(
          `#${sectionId} [data-editor-hover-id="${hoverId}"]:hover,\n#${sectionId} #${hoverId}:hover {\n${decls}\n}`
        );
      }
    } catch {
      // ignore
    }
  });

  const customHoverBlock = customHoverCssRules.length > 0
    ? `\n/* Custom Designer Hover Effects */\n${customHoverCssRules.join('\n\n')}\n`
    : '';

  if (mode === 'clean') {
    return `<!-- WordPress Section: ${sectionName} -->\n${rootEl.outerHTML}`;
  }

  if (mode === 'inline') {
    const inlined = inlineCssIntoSectionHtml(rootEl.outerHTML, globalCss, externalStyleSheets);
    const hoverStyleTag = customHoverBlock ? `<style>\n${customHoverBlock.trim()}\n</style>\n` : '';
    return `<!-- ==========================================
     WordPress / Elementor HTML Block: ${sectionName}
     Mode: Inlined CSS Attributes (Theme-Immune)
     ========================================== -->
${hoverStyleTag}${inlined}`;
  }

  // Scoped CSS mode
  const { scopedCss } = extractStylesForSection(rootEl.outerHTML, globalCss, {
    scopeId: sectionId,
    includeFontFaces: true,
    includeKeyframes: true,
    includeMediaQueries: true,
  });

  const fullCss = `${scopedCss.trim()}${customHoverBlock ? '\n\n' + customHoverBlock.trim() : ''}`;
  const fontHeader = fontLinks ? `\n<!-- External Fonts & Icons -->\n${fontLinks}\n` : '';

  return `<!-- ==========================================
     WordPress / Elementor Custom HTML Block
     Section: ${sectionName}
     Self-contained with Scoped CSS & Resets
     ========================================== -->${fontHeader}
<style>
${fullCss.trim()}
</style>

${rootEl.outerHTML}`;
}
