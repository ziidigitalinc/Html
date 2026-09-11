export type SectionType = 
  | 'header'
  | 'hero'
  | 'subhero'
  | 'center'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'prefooter'
  | 'footer'
  | 'custom';

export interface Section {
  id: string;
  name: string;
  type: SectionType;
  html: string;
  tagName: string;
  attributes: Record<string, string>;
  collapsed?: boolean;
}

export interface ParsedDocument {
  title: string;
  headHtml: string;
  globalStyles: string;
  sections: Section[];
  rawHtml: string;
  metaTags: string[];
  externalScripts: string[];
  externalStyleSheets: string[];
}

export interface BreadcrumbNode {
  tagName: string;
  id?: string;
  className?: string;
  selector: string;
  index: number;
}

export interface SelectedElementInfo {
  selector: string;
  elementId?: string;
  hoverId?: string;
  tagName: string;
  classList: string[];
  textContent: string;
  innerHTML?: string;
  sectionId: string;
  inlineStyles: Record<string, string>;
  hoverStyles?: Record<string, string>;
  attributes: Record<string, string>;
  breadcrumb: BreadcrumbNode[];
}

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export interface CopyOptions {
  mode: 'scoped' | 'inline' | 'clean';
  includeReset: boolean;
  addCommentHeaders: boolean;
  prefixClasses: boolean;
}
