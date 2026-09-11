/**
 * Style Helpers & Presets for Visual Inspector
 * Provides parsers and preset generators for shadows, gradients, transforms, and hover transitions.
 */

export interface ParsedBoxShadow {
  inset: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export type ShadowCategory = 'all' | 'subtle' | 'soft' | 'crisp' | 'glowing' | 'elevation' | 'inset';

export interface BoxShadowPreset {
  id: string;
  name: string;
  category: 'subtle' | 'soft' | 'crisp' | 'glowing' | 'elevation' | 'inset';
  value: string;
  description: string;
  tag?: string;
  glowColor?: string;
}

export const BOX_SHADOW_LIBRARY: BoxShadowPreset[] = [
  // SUBTLE SHADOWS
  {
    id: 'subtle-card',
    name: 'Subtle Card',
    category: 'subtle',
    value: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    description: 'Clean baseline card lift for modern web applications',
    tag: 'Popular',
  },
  {
    id: 'subtle-whisper',
    name: 'Micro Whisper',
    category: 'subtle',
    value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    description: 'Barely-there boundary grounding without visual clutter',
    tag: 'Minimal',
  },
  {
    id: 'subtle-apple',
    name: 'Apple Border Rim',
    category: 'subtle',
    value: '0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.08)',
    description: 'Signature macOS/iOS hairline rim + delicate ground',
    tag: 'Apple',
  },
  {
    id: 'subtle-feather',
    name: 'Feather Lift',
    category: 'subtle',
    value: '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
    description: 'Ultra-light featherweight depth for dense UI interfaces',
    tag: 'Subtle',
  },

  // SOFT SHADOWS
  {
    id: 'soft-ambient-float',
    name: 'Soft Ambient Float',
    category: 'soft',
    value: '0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    description: 'Diffuse luxury product card with gentle light dissipation',
    tag: 'Soft',
  },
  {
    id: 'soft-silky-diffusion',
    name: 'Silky Multi-Layer',
    category: 'soft',
    value: '0 2px 4px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.04), 0 16px 24px rgba(0, 0, 0, 0.04)',
    description: 'Stripe-grade smooth multi-octave layered shadow stack',
    tag: 'Stripe',
  },
  {
    id: 'soft-cloud',
    name: 'Cloud Levitation',
    category: 'soft',
    value: '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 15px rgba(0, 0, 0, 0.03)',
    description: 'Dreamy atmospheric floating card with wide spread',
    tag: 'Float',
  },
  {
    id: 'soft-warm-neutral',
    name: 'Warm Cozy Diffusion',
    category: 'soft',
    value: '0 12px 24px -4px rgba(60, 50, 40, 0.09), 0 4px 8px -2px rgba(60, 50, 40, 0.05)',
    description: 'Organic warm-gray shadow tone for editorial layouts',
    tag: 'Warm',
  },
  {
    id: 'soft-deep-drift',
    name: 'Deep Soft Drift',
    category: 'soft',
    value: '0 25px 50px -12px rgba(0, 0, 0, 0.16)',
    description: 'Wide expansive backdrop shadow with smooth falloff',
    tag: 'Diffuse',
  },

  // CRISP SHADOWS
  {
    id: 'crisp-neo-brutalist',
    name: 'Neo-Brutalist 4px',
    category: 'crisp',
    value: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
    description: 'High-impact sharp retro pop cutout with pure black 2D edge',
    tag: 'Crisp',
  },
  {
    id: 'crisp-indigo-offset',
    name: 'Indigo Offset 5px',
    category: 'crisp',
    value: '5px 5px 0px 0px rgba(79, 70, 229, 1)',
    description: 'Playful solid graphic offset in primary indigo accent',
    tag: 'Crisp',
    glowColor: '#4f46e5',
  },
  {
    id: 'crisp-retro-2px',
    name: 'Sharp Retro 2px',
    category: 'crisp',
    value: '2px 2px 0px 0px rgba(0, 0, 0, 0.85)',
    description: 'Technical sticker/badge outline with zero blur',
    tag: 'Sharp',
  },
  {
    id: 'crisp-tactile-key',
    name: 'Tactile 3D Key',
    category: 'crisp',
    value: '0 4px 0px 0px rgba(0, 0, 0, 0.25), 0 6px 10px rgba(0, 0, 0, 0.1)',
    description: 'Durable physical keyboard key bevel and press shelf',
    tag: 'Tactile',
  },
  {
    id: 'crisp-double-edge',
    name: 'Double Outline Crisp',
    category: 'crisp',
    value: '0 0 0 1px #000000, 4px 4px 0 0 #000000',
    description: 'Modern brutalist duo: 1px border ring + 4px solid drop',
    tag: 'Brutalist',
  },

  // GLOWING SHADOWS
  {
    id: 'glow-indigo-neon',
    name: 'Neon Indigo Glow',
    category: 'glowing',
    value: '0 0 25px -3px rgba(79, 70, 229, 0.65), 0 8px 20px -6px rgba(79, 70, 229, 0.45)',
    description: 'Vibrant primary indigo radiance with high luminosity',
    tag: 'Glowing',
    glowColor: '#4f46e5',
  },
  {
    id: 'glow-cyber-emerald',
    name: 'Cyber Emerald',
    category: 'glowing',
    value: '0 0 25px -3px rgba(16, 185, 129, 0.65), 0 8px 20px -6px rgba(16, 185, 129, 0.45)',
    description: 'High-tech green bio-glow for success or active states',
    tag: 'Glowing',
    glowColor: '#10b981',
  },
  {
    id: 'glow-amber-flame',
    name: 'Amber Candle Flame',
    category: 'glowing',
    value: '0 0 30px -4px rgba(245, 158, 11, 0.65), 0 8px 18px -4px rgba(245, 158, 11, 0.45)',
    description: 'Warm golden halo creating cozy illumination',
    tag: 'Glowing',
    glowColor: '#f59e0b',
  },
  {
    id: 'glow-rose-sunset',
    name: 'Sunset Crimson Rose',
    category: 'glowing',
    value: '0 0 25px -2px rgba(244, 63, 94, 0.65), 0 10px 20px -4px rgba(244, 63, 94, 0.45)',
    description: 'Punchy vibrant red/pink aura with bold contrast',
    tag: 'Glowing',
    glowColor: '#f43f5e',
  },
  {
    id: 'glow-electric-cyan',
    name: 'Electric Cyan Pulse',
    category: 'glowing',
    value: '0 0 25px 0px rgba(6, 182, 212, 0.65), 0 10px 20px -5px rgba(6, 182, 212, 0.45)',
    description: 'Futuristic neon aqua aura for interactive badges',
    tag: 'Glowing',
    glowColor: '#06b6d4',
  },
  {
    id: 'glow-violet-aura',
    name: 'Violet Luxury Aura',
    category: 'glowing',
    value: '0 15px 35px -5px rgba(168, 85, 247, 0.5), 0 0 15px rgba(168, 85, 247, 0.3)',
    description: 'Mystic purple spotlight for featured tiers and hero cards',
    tag: 'Glowing',
    glowColor: '#a855f7',
  },

  // ELEVATION HIERARCHY
  {
    id: 'elevation-1',
    name: 'Elevation 1 (Surface)',
    category: 'elevation',
    value: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    description: 'Level 1: Subtle resting plane above background canvas',
    tag: 'Layer 1',
  },
  {
    id: 'elevation-2',
    name: 'Elevation 2 (Card / Button)',
    category: 'elevation',
    value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    description: 'Level 2: Standard interactive cards, tiles, and active buttons',
    tag: 'Layer 2',
  },
  {
    id: 'elevation-3',
    name: 'Elevation 3 (Dropdown)',
    category: 'elevation',
    value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    description: 'Level 3: Floating dropdown menus, tooltips, and popovers',
    tag: 'Layer 3',
  },
  {
    id: 'elevation-4',
    name: 'Elevation 4 (Modal Dialog)',
    category: 'elevation',
    value: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    description: 'Level 4: High-focus dialog sheets, drawers, and lightbox frames',
    tag: 'Layer 4',
  },
  {
    id: 'elevation-5',
    name: 'Elevation 5 (Floating Stage)',
    category: 'elevation',
    value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    description: 'Level 5: Peak z-index floating action stage and banners',
    tag: 'Layer 5',
  },

  // INSET & PRESSED
  {
    id: 'inset-well',
    name: 'Recessed Well (Inset)',
    category: 'inset',
    value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.12)',
    description: 'Sunken text input well or recessed toggle container',
    tag: 'Inset',
  },
  {
    id: 'inset-deep',
    name: 'Deep Sunken Container',
    category: 'inset',
    value: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.22)',
    description: 'Pressed pushbutton or deeply indented slot tray',
    tag: 'Inset',
  },
  {
    id: 'inset-rim-glow',
    name: 'Inner Rim Illumination',
    category: 'inset',
    value: 'inset 0 0 12px 0 rgba(79, 70, 229, 0.25)',
    description: 'Soft internal perimeter lighting for focus containers',
    tag: 'Inset',
    glowColor: '#4f46e5',
  },
];

export const SHADOW_PRESETS: { name: string; value: string; description: string }[] = [
  {
    name: 'None',
    value: 'none',
    description: 'No drop shadow',
  },
  ...BOX_SHADOW_LIBRARY.map((b) => ({
    name: b.name,
    value: b.value,
    description: b.description,
  })),
];

export const TEXT_SHADOW_PRESETS: { name: string; value: string }[] = [
  { name: 'None', value: 'none' },
  { name: 'Subtle', value: '0 1px 2px rgba(0, 0, 0, 0.2)' },
  { name: '3D Pop', value: '0 2px 4px rgba(0, 0, 0, 0.35)' },
  { name: 'Glow White', value: '0 0 10px rgba(255, 255, 255, 0.8)' },
  { name: 'Glow Indigo', value: '0 0 14px rgba(79, 70, 229, 0.7)' },
  { name: 'Dark Contrast', value: '0 4px 8px rgba(0, 0, 0, 0.6)' },
];

export type GradientType = 'linear' | 'radial' | 'conic';
export type GradientStyleTag = 'all' | 'popular' | 'vibrant' | 'dark' | 'soft' | 'warm' | 'cool' | 'luxury' | 'neon';

export interface GradientPreset {
  id: string;
  name: string;
  type: GradientType;
  tag: 'popular' | 'vibrant' | 'dark' | 'soft' | 'warm' | 'cool' | 'luxury' | 'neon';
  value: string;
  description: string;
  stopsPreview: string[];
}

export const GRADIENT_PRESET_LIBRARY: GradientPreset[] = [
  // ==========================================
  // LINEAR GRADIENTS
  // ==========================================
  {
    id: 'linear-hyper-nova',
    name: 'Hyper Nova',
    type: 'linear',
    tag: 'popular',
    value: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    description: 'High-energy 3-stop indigo-purple-pink signature modern aesthetic',
    stopsPreview: ['#6366f1', '#a855f7', '#ec4899'],
  },
  {
    id: 'linear-sunset-coral',
    name: 'Sunset Coral',
    type: 'linear',
    tag: 'warm',
    value: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #facc15 100%)',
    description: 'Warm, high-spirited radiance inspired by golden hour sunsets',
    stopsPreview: ['#f43f5e', '#fb923c', '#facc15'],
  },
  {
    id: 'linear-oceanic-depth',
    name: 'Oceanic Depth',
    type: 'linear',
    tag: 'cool',
    value: 'linear-gradient(135deg, #0284c7 0%, #0d9488 50%, #10b981 100%)',
    description: 'Deep azure into lush emerald teal for refreshing, trustworthy UI',
    stopsPreview: ['#0284c7', '#0d9488', '#10b981'],
  },
  {
    id: 'linear-midnight-obsidian',
    name: 'Midnight Obsidian',
    type: 'linear',
    tag: 'dark',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    description: 'Ultra-dark slate and deep violet tone for luxurious nocturnal backdrops',
    stopsPreview: ['#0f172a', '#1e1b4b', '#311042'],
  },
  {
    id: 'linear-royal-indigo',
    name: 'Royal Indigo',
    type: 'linear',
    tag: 'popular',
    value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    description: 'Classic SaaS hero gradient with rich indigo and violet saturation',
    stopsPreview: ['#4f46e5', '#7c3aed'],
  },
  {
    id: 'linear-clean-white-frost',
    name: 'Clean White Frost',
    type: 'linear',
    tag: 'soft',
    value: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
    description: 'Crisp, feather-light off-white wash for elevated light-theme sections',
    stopsPreview: ['#ffffff', '#f1f5f9', '#e2e8f0'],
  },
  {
    id: 'linear-cyberpunk-lime',
    name: 'Cyberpunk Lime',
    type: 'linear',
    tag: 'neon',
    value: 'linear-gradient(135deg, #10b981 0%, #84cc16 50%, #eab308 100%)',
    description: 'Electric neon green into vibrant chartreuse with maximum contrast',
    stopsPreview: ['#10b981', '#84cc16', '#eab308'],
  },
  {
    id: 'linear-rose-gold',
    name: 'Rose Gold Elegance',
    type: 'linear',
    tag: 'luxury',
    value: 'linear-gradient(135deg, #fce7f3 0%, #f472b6 50%, #fb7185 100%)',
    description: 'Prestige rose blush and metallic coral for boutique card accents',
    stopsPreview: ['#fce7f3', '#f472b6', '#fb7185'],
  },
  {
    id: 'linear-aurora-borealis',
    name: 'Aurora Borealis',
    type: 'linear',
    tag: 'cool',
    value: 'linear-gradient(135deg, #059669 0%, #06b6d4 50%, #6366f1 100%)',
    description: 'Northern lights transition from emerald green through cyan into indigo',
    stopsPreview: ['#059669', '#06b6d4', '#6366f1'],
  },
  {
    id: 'linear-deep-space-nebula',
    name: 'Deep Space Nebula',
    type: 'linear',
    tag: 'dark',
    value: 'linear-gradient(135deg, #18181b 0%, #2e1065 50%, #3b0764 100%)',
    description: 'Galactic dark purple with subtle interstellar highlight',
    stopsPreview: ['#18181b', '#2e1065', '#3b0764'],
  },
  {
    id: 'linear-champagne-gold',
    name: 'Champagne Gold',
    type: 'linear',
    tag: 'luxury',
    value: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 35%, #d97706 70%, #92400e 100%)',
    description: 'Lustrous warm champagne and burnished bronze for VIP tiers',
    stopsPreview: ['#fffbeb', '#fef3c7', '#d97706'],
  },
  {
    id: 'linear-peach-sorbet',
    name: 'Peach Sorbet',
    type: 'linear',
    tag: 'soft',
    value: 'linear-gradient(135deg, #fed7aa 0%, #fda4af 50%, #f43f5e 100%)',
    description: 'Delicate pastel apricot blending into soft strawberry pink',
    stopsPreview: ['#fed7aa', '#fda4af', '#f43f5e'],
  },

  // ==========================================
  // RADIAL GRADIENTS
  // ==========================================
  {
    id: 'radial-ambient-spotlight',
    name: 'Ambient Spotlight',
    type: 'radial',
    tag: 'popular',
    value: 'radial-gradient(circle at center, #6366f1 0%, #1e1b4b 100%)',
    description: 'Centric focal spotlight casting deep nocturnal indigo outwards',
    stopsPreview: ['#6366f1', '#1e1b4b'],
  },
  {
    id: 'radial-top-aurora-beam',
    name: 'Top Aurora Beam',
    type: 'radial',
    tag: 'cool',
    value: 'radial-gradient(ellipse at top, #38bdf8 0%, #0f172a 75%)',
    description: 'Elliptical downlight from the top header edge into dark slate',
    stopsPreview: ['#38bdf8', '#0f172a'],
  },
  {
    id: 'radial-neon-halo',
    name: 'Vibrant Neon Halo',
    type: 'radial',
    tag: 'neon',
    value: 'radial-gradient(circle at 50% 50%, #ec4899 0%, #8b5cf6 50%, #1e1b4b 100%)',
    description: 'Intense magenta-purple core glowing inside dark surrounding space',
    stopsPreview: ['#ec4899', '#8b5cf6', '#1e1b4b'],
  },
  {
    id: 'radial-emerald-pearl',
    name: 'Emerald Pearl',
    type: 'radial',
    tag: 'cool',
    value: 'radial-gradient(circle at 30% 30%, #34d399 0%, #065f46 60%, #022c22 100%)',
    description: 'Offset light sphere creating volumetric spherical 3D luster',
    stopsPreview: ['#34d399', '#065f46', '#022c22'],
  },
  {
    id: 'radial-sunburst-flare',
    name: 'Sunburst Flare',
    type: 'radial',
    tag: 'warm',
    value: 'radial-gradient(circle at top right, #fde047 0%, #ea580c 50%, #7c2d12 100%)',
    description: 'Corner solar flare bursting from top-right with golden heat',
    stopsPreview: ['#fde047', '#ea580c', '#7c2d12'],
  },
  {
    id: 'radial-studio-soft-vignette',
    name: 'Studio Soft Vignette',
    type: 'radial',
    tag: 'soft',
    value: 'radial-gradient(circle at center, #ffffff 40%, #cbd5e1 100%)',
    description: 'Clean photography studio keylight with subtle edge vignette',
    stopsPreview: ['#ffffff', '#cbd5e1'],
  },
  {
    id: 'radial-cosmic-iris',
    name: 'Cosmic Iris',
    type: 'radial',
    tag: 'dark',
    value: 'radial-gradient(ellipse at bottom left, #818cf8 0%, #312e81 60%, #0f172a 100%)',
    description: 'Atmospheric corner illumination for hero cards and display panels',
    stopsPreview: ['#818cf8', '#312e81', '#0f172a'],
  },
  {
    id: 'radial-warm-candle-halo',
    name: 'Warm Candle Halo',
    type: 'radial',
    tag: 'warm',
    value: 'radial-gradient(circle at center, #fef08a 0%, #f97316 45%, #451a03 100%)',
    description: 'Cozy focal illumination mimicking incandescent lantern flame',
    stopsPreview: ['#fef08a', '#f97316', '#451a03'],
  },
  {
    id: 'radial-cyan-cyber-pod',
    name: 'Cyan Cyber Pod',
    type: 'radial',
    tag: 'neon',
    value: 'radial-gradient(circle at 50% 0%, #22d3ee 0%, #0e7490 50%, #082f49 100%)',
    description: 'Futuristic sci-fi ceiling pod light illuminating deep navy depths',
    stopsPreview: ['#22d3ee', '#0e7490', '#082f49'],
  },
  {
    id: 'radial-dark-luxury-spotlight',
    name: 'Dark Luxury Spotlight',
    type: 'radial',
    tag: 'dark',
    value: 'radial-gradient(circle at 50% 30%, #334155 0%, #0f172a 70%, #020617 100%)',
    description: 'Subtle slate studio spotlight for ultra-refined dark interfaces',
    stopsPreview: ['#334155', '#0f172a', '#020617'],
  },

  // ==========================================
  // CONIC GRADIENTS
  // ==========================================
  {
    id: 'conic-prism-rainbow',
    name: 'Prism Rainbow Sweep',
    type: 'conic',
    tag: 'popular',
    value: 'conic-gradient(from 0deg at 50% 50%, #ef4444 0deg, #f59e0b 60deg, #10b981 120deg, #06b6d4 180deg, #6366f1 240deg, #ec4899 300deg, #ef4444 360deg)',
    description: 'Full 360-degree chromatic spectrum sweep for iridescent accents and avatars',
    stopsPreview: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899'],
  },
  {
    id: 'conic-luxury-champagne',
    name: 'Luxury Champagne Wheel',
    type: 'conic',
    tag: 'luxury',
    value: 'conic-gradient(from 45deg at 50% 50%, #fef3c7 0deg, #d97706 90deg, #78350f 180deg, #d97706 270deg, #fef3c7 360deg)',
    description: 'Brushed gold metallic dial effect with angular light reflections',
    stopsPreview: ['#fef3c7', '#d97706', '#78350f'],
  },
  {
    id: 'conic-radar-scanner',
    name: 'Radar Scanner Sweep',
    type: 'conic',
    tag: 'neon',
    value: 'conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.05) 0deg, rgba(16, 185, 129, 0.85) 300deg, #10b981 360deg)',
    description: 'Sci-fi holographic radar beam sweeping smoothly around the center',
    stopsPreview: ['rgba(16,185,129,0.1)', '#10b981'],
  },
  {
    id: 'conic-chromatic-chrome',
    name: 'Chromatic Chrome Dial',
    type: 'conic',
    tag: 'luxury',
    value: 'conic-gradient(from 180deg at 50% 50%, #94a3b8 0deg, #f8fafc 90deg, #475569 180deg, #f8fafc 270deg, #94a3b8 360deg)',
    description: 'Precision-machined brushed aluminum dial with quad-angle sheen',
    stopsPreview: ['#94a3b8', '#f8fafc', '#475569'],
  },
  {
    id: 'conic-cyber-indigo-vortex',
    name: 'Cyber Indigo Vortex',
    type: 'conic',
    tag: 'vibrant',
    value: 'conic-gradient(from 90deg at 50% 50%, #312e81 0deg, #6366f1 120deg, #a855f7 240deg, #312e81 360deg)',
    description: 'Smooth angular spiral swirling through indigo and electric violet',
    stopsPreview: ['#312e81', '#6366f1', '#a855f7'],
  },
  {
    id: 'conic-neon-pinwheel',
    name: 'Neon Pinwheel',
    type: 'conic',
    tag: 'neon',
    value: 'conic-gradient(from 0deg at 50% 50%, #f43f5e 0deg, #8b5cf6 120deg, #06b6d4 240deg, #f43f5e 360deg)',
    description: 'Triple-blade energetic angular turbine in hot pink, purple, and cyan',
    stopsPreview: ['#f43f5e', '#8b5cf6', '#06b6d4'],
  },
  {
    id: 'conic-sunset-sweep',
    name: 'Sunset Angular Sweep',
    type: 'conic',
    tag: 'warm',
    value: 'conic-gradient(from 225deg at 50% 50%, #ea580c 0deg, #e11d48 90deg, #be185d 180deg, #fbbf24 270deg, #ea580c 360deg)',
    description: 'Rotating sunset palette sweeping from warm amber into deep berry',
    stopsPreview: ['#ea580c', '#e11d48', '#be185d', '#fbbf24'],
  },
  {
    id: 'conic-dark-carbon',
    name: 'Dark Carbon Dial',
    type: 'conic',
    tag: 'dark',
    value: 'conic-gradient(from 0deg at 50% 50%, #0f172a 0deg, #1e293b 90deg, #020617 180deg, #1e293b 270deg, #0f172a 360deg)',
    description: 'Tactile matte carbon watch bezel with anisotropic light falloff',
    stopsPreview: ['#0f172a', '#1e293b', '#020617'],
  },
  {
    id: 'conic-emerald-spin',
    name: 'Emerald Aurora Spin',
    type: 'conic',
    tag: 'cool',
    value: 'conic-gradient(from 120deg at 50% 50%, #064e3b 0deg, #10b981 180deg, #6ee7b7 270deg, #064e3b 360deg)',
    description: 'Refreshing jade and mint pinwheel for active badge frames',
    stopsPreview: ['#064e3b', '#10b981', '#6ee7b7'],
  },
  {
    id: 'conic-aurora-burst',
    name: 'Aurora Multi-Burst',
    type: 'conic',
    tag: 'vibrant',
    value: 'conic-gradient(from 30deg at 50% 50%, #06b6d4 0deg, #3b82f6 90deg, #8b5cf6 180deg, #ec4899 270deg, #06b6d4 360deg)',
    description: 'Vibrant circular color field for modern interactive widgets',
    stopsPreview: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
  },
];

export const GRADIENT_PRESETS: { name: string; value: string }[] = GRADIENT_PRESET_LIBRARY.map((g) => ({
  name: g.name,
  value: g.value,
}));

/**
 * Detects the CSS gradient type from a background or background-image string
 */
export function detectGradientType(gradientStr?: string): GradientType | null {
  if (!gradientStr) return null;
  const clean = gradientStr.toLowerCase();
  if (clean.includes('linear-gradient')) return 'linear';
  if (clean.includes('radial-gradient')) return 'radial';
  if (clean.includes('conic-gradient')) return 'conic';
  return null;
}

/**
 * Extracts linear gradient angle in degrees (e.g., 135 from 135deg), default 135
 */
export function extractLinearGradientAngle(gradientStr?: string): number {
  if (!gradientStr) return 135;
  const match = gradientStr.match(/linear-gradient\(\s*(\d+)deg/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  // Check keywords
  if (gradientStr.includes('to right')) return 90;
  if (gradientStr.includes('to bottom')) return 180;
  if (gradientStr.includes('to left')) return 270;
  if (gradientStr.includes('to top')) return 0;
  return 135;
}

/**
 * Updates or sets the angle on a linear-gradient
 */
export function updateLinearGradientAngle(gradientStr: string, newAngle: number): string {
  if (!gradientStr.includes('linear-gradient')) {
    return `linear-gradient(${newAngle}deg, #4f46e5 0%, #7c3aed 100%)`;
  }
  // Replace existing degree or direction
  if (/linear-gradient\(\s*(\d+deg|to\s+[a-z\s]+)\s*,/i.test(gradientStr)) {
    return gradientStr.replace(/linear-gradient\(\s*(\d+deg|to\s+[a-z\s]+)\s*,/i, `linear-gradient(${newAngle}deg,`);
  }
  // If no angle prefix was present, inject it
  return gradientStr.replace(/linear-gradient\(/i, `linear-gradient(${newAngle}deg, `);
}

/**
 * Updates the center position on a radial-gradient
 */
export function updateRadialGradientPosition(gradientStr: string, positionStr: string): string {
  if (!gradientStr.includes('radial-gradient')) {
    return `radial-gradient(circle at ${positionStr}, #6366f1 0%, #1e1b4b 100%)`;
  }
  if (/radial-gradient\(\s*(circle|ellipse)?\s*(at\s+[^,]+)\s*,/i.test(gradientStr)) {
    return gradientStr.replace(/radial-gradient\(\s*(circle|ellipse)?\s*(at\s+[^,]+)\s*,/i, `radial-gradient(circle at ${positionStr},`);
  }
  return gradientStr.replace(/radial-gradient\(/i, `radial-gradient(circle at ${positionStr}, `);
}

/**
 * Updates the starting angle on a conic-gradient
 */
export function updateConicGradientAngle(gradientStr: string, fromDeg: number): string {
  if (!gradientStr.includes('conic-gradient')) {
    return `conic-gradient(from ${fromDeg}deg at 50% 50%, #6366f1 0deg, #ec4899 360deg)`;
  }
  if (/conic-gradient\(\s*from\s+\d+deg/i.test(gradientStr)) {
    return gradientStr.replace(/conic-gradient\(\s*from\s+\d+deg/i, `conic-gradient(from ${fromDeg}deg`);
  }
  return gradientStr.replace(/conic-gradient\(/i, `conic-gradient(from ${fromDeg}deg at 50% 50%, `);
}

/**
 * Reverses the color stops order in a CSS gradient
 */
export function reverseGradientColorStops(gradientStr: string): string {
  if (!gradientStr || !gradientStr.includes('gradient(')) return gradientStr;

  const parenStart = gradientStr.indexOf('(');
  const parenEnd = gradientStr.lastIndexOf(')');
  if (parenStart === -1 || parenEnd === -1) return gradientStr;

  const prefix = gradientStr.substring(0, parenStart + 1);
  const suffix = gradientStr.substring(parenEnd);
  const body = gradientStr.substring(parenStart + 1, parenEnd).trim();

  // Split by top-level commas (avoid commas inside rgba / hsl)
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }

  if (parts.length <= 1) return gradientStr;

  // Check if first part is direction/shape (e.g. 135deg, circle at center, from 0deg)
  const hasDirection = parts[0].includes('deg') || parts[0].includes('circle') || parts[0].includes('ellipse') || parts[0].includes('at') || parts[0].includes('to ');
  const header = hasDirection ? parts[0] : null;
  const stops = hasDirection ? parts.slice(1) : parts;

  // Reverse stops but preserve percentages or inverting their sequence
  const reversedStops = [...stops].reverse();
  const newBody = header ? [header, ...reversedStops].join(', ') : reversedStops.join(', ');
  return `${prefix}${newBody}${suffix}`;
}

export const HOVER_LIFT_PRESETS: { label: string; value: string }[] = [
  { label: 'None', value: 'none' },
  { label: 'Lift -2px', value: 'translateY(-2px)' },
  { label: 'Lift -4px', value: 'translateY(-4px)' },
  { label: 'Lift -8px', value: 'translateY(-8px)' },
  { label: 'Press +2px', value: 'translateY(2px)' },
];

export const HOVER_SCALE_PRESETS: { label: string; value: string }[] = [
  { label: 'None', value: 'none' },
  { label: '102% (Subtle)', value: 'scale(1.02)' },
  { label: '105% (Pop)', value: 'scale(1.05)' },
  { label: '110% (Zoom)', value: 'scale(1.10)' },
  { label: '98% (Press)', value: 'scale(0.98)' },
];

export const HOVER_SHADOW_PRESETS: { label: string; value: string }[] = [
  { label: 'Same / Default', value: '' },
  { label: 'Float Shadow', value: '0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08)' },
  { label: 'High Elevation', value: '0 20px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
  { label: 'Deep 3D', value: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' },
  { label: 'Indigo Glow', value: '0 12px 28px -4px rgba(79, 70, 229, 0.55)' },
  { label: 'Emerald Glow', value: '0 12px 28px -4px rgba(16, 185, 129, 0.55)' },
  { label: 'Amber Glow', value: '0 12px 28px -4px rgba(245, 158, 11, 0.55)' },
  { label: 'Rose Glow', value: '0 12px 28px -4px rgba(239, 68, 68, 0.5)' },
];

export const TRANSITION_SPEED_PRESETS: { label: string; value: string }[] = [
  { label: 'Snappy (150ms)', value: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Smooth (250ms)', value: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Gentle (400ms)', value: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)' },
  { label: 'Spring (300ms)', value: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)' },
];

export interface ParsedTransition {
  property: string;
  durationMs: number;
  timingFunction: string;
  delayMs: number;
}

export interface ParsedAnimation {
  name: string;
  durationS: number;
  timingFunction: string;
  delayS: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
  playState: string;
}

export const TRANSITION_PROPERTY_PRESETS = [
  { label: 'All Properties', value: 'all', description: 'Animates every changing CSS property' },
  { label: 'Transform & Opacity', value: 'transform, opacity', description: 'GPU accelerated, 60fps smooth' },
  { label: 'Transform, Opacity & Shadow', value: 'transform, opacity, box-shadow', description: 'Standard modern card & button feel' },
  { label: 'Transform Only', value: 'transform', description: 'Move, scale, and rotate' },
  { label: 'Opacity Only', value: 'opacity', description: 'Fade in / fade out' },
  { label: 'Colors & Background', value: 'color, background-color, border-color', description: 'Smooth theme & palette shifting' },
  { label: 'Shadow & Glow', value: 'box-shadow', description: 'Elevation depth micro-interaction' },
  { label: 'Dimensions (Width/Height)', value: 'width, height, max-height', description: 'Accordion, drawer and sizing changes' },
  { label: 'Filters & Backdrop', value: 'filter, backdrop-filter', description: 'Blur, grayscale, brightness adjustments' },
];

export const EASING_PRESETS = [
  {
    name: 'Material Standard',
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    category: 'Modern UI',
    description: 'Fast start, gentle deceleration - standard in Material & modern web apps',
    p1: 0.4,
    p2: 0.0,
    p3: 0.2,
    p4: 1.0,
  },
  {
    name: 'Expo Out (Spring)',
    value: 'cubic-bezier(0.16, 1, 0.3, 1)',
    category: 'Modern UI',
    description: 'Ultra-snappy initial kick, soft settle (Apple & high-end SaaS standard)',
    p1: 0.16,
    p2: 1.0,
    p3: 0.3,
    p4: 1.0,
  },
  {
    name: 'Elastic Bounce (Overshoot)',
    value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    category: 'Playful',
    description: 'Playful overshoot pop beyond destination before snapping into place',
    p1: 0.34,
    p2: 1.56,
    p3: 0.64,
    p4: 1.0,
  },
  {
    name: 'Anticipate & Pop',
    value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    category: 'Playful',
    description: 'Winds backwards slightly first, then shoots forward past destination',
    p1: 0.68,
    p2: -0.55,
    p3: 0.265,
    p4: 1.55,
  },
  {
    name: 'Ease Out (Decelerate)',
    value: 'ease-out',
    category: 'Standard',
    description: 'Starts fast and slows down smoothly to a halt - ideal for entrance and hover',
    p1: 0.0,
    p2: 0.0,
    p3: 0.58,
    p4: 1.0,
  },
  {
    name: 'Ease In-Out (Symmetric)',
    value: 'ease-in-out',
    category: 'Standard',
    description: 'Gentle start and gentle landing - smooth symmetrical flow',
    p1: 0.42,
    p2: 0.0,
    p3: 0.58,
    p4: 1.0,
  },
  {
    name: 'Ease In (Accelerate)',
    value: 'ease-in',
    category: 'Standard',
    description: 'Starts slowly and accelerates toward the finish - ideal for exit animations',
    p1: 0.42,
    p2: 0.0,
    p3: 1.0,
    p4: 1.0,
  },
  {
    name: 'Ease (Default)',
    value: 'ease',
    category: 'Standard',
    description: 'Standard CSS ease curve with slight acceleration and deceleration',
    p1: 0.25,
    p2: 0.1,
    p3: 0.25,
    p4: 1.0,
  },
  {
    name: 'Linear (Uniform)',
    value: 'linear',
    category: 'Standard',
    description: 'Constant mechanical speed with zero acceleration - best for infinite spinners',
    p1: 0.0,
    p2: 0.0,
    p3: 1.0,
    p4: 1.0,
  },
  {
    name: 'Cinematic Drama',
    value: 'cubic-bezier(0.87, 0, 0.13, 1)',
    category: 'Expressive',
    description: 'Deep dramatic acceleration curve favored in luxury brand showpieces',
    p1: 0.87,
    p2: 0.0,
    p3: 0.13,
    p4: 1.0,
  },
];

export const DURATION_PRESETS = [
  { label: 'Instant', value: 100, text: '100ms' },
  { label: 'Snappy', value: 180, text: '180ms' },
  { label: 'Standard', value: 250, text: '250ms' },
  { label: 'Smooth', value: 350, text: '350ms' },
  { label: 'Gentle', value: 500, text: '500ms' },
  { label: 'Deliberate', value: 750, text: '750ms' },
  { label: 'Cinematic', value: 1000, text: '1.0s' },
];

export const DELAY_PRESETS = [
  { label: 'None', value: 0, text: '0ms' },
  { label: 'Stagger 1', value: 75, text: '75ms' },
  { label: 'Stagger 2', value: 150, text: '150ms' },
  { label: 'Subtle', value: 250, text: '250ms' },
  { label: 'Delayed', value: 400, text: '400ms' },
  { label: 'Half-sec', value: 500, text: '500ms' },
];

export const COMPLETE_TRANSITION_RECIPES = [
  {
    name: 'Snappy Card Hover',
    value: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1) 0ms',
    tag: 'Recommended',
    description: 'Immediate responsive lift and shadow',
  },
  {
    name: 'Silky Material Flow',
    value: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    tag: 'Clean',
    description: 'Polished Google / Stripe style transitions',
  },
  {
    name: 'Bouncy Pop',
    value: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 0ms',
    tag: 'Playful',
    description: 'Elastic rubber-band overshoot feedback',
  },
  {
    name: 'Subtle Fade & Lift',
    value: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease, box-shadow 250ms ease',
    tag: 'GPU Pro',
    description: 'Hardware accelerated multi-property stack',
  },
  {
    name: 'Cinematic Reveal',
    value: 'all 700ms cubic-bezier(0.87, 0, 0.13, 1) 100ms',
    tag: 'Luxury',
    description: 'High-end delayed luxury reveal',
  },
  {
    name: 'Instant Color Shift',
    value: 'color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out',
    tag: 'Fast',
    description: 'Zero-lag palette and border switches',
  },
];

export const ANIMATION_PRESETS = [
  { name: 'None / Off', value: 'none', description: 'No continuous animation' },
  { name: 'Pulse (Breathing)', value: 'pulse', description: 'Gentle rhythmic scale and opacity cycle' },
  { name: 'Float (Levitate)', value: 'float', description: 'Smooth, continuous vertical hovering wave' },
  { name: 'Bounce (Playful)', value: 'bounce', description: 'Energetic vertical bouncing hop' },
  { name: 'Fade In', value: 'fadeIn', description: 'Smooth upward entrance fade' },
  { name: 'Slide Up', value: 'slideUp', description: 'Prominent upward motion entrance' },
  { name: 'Shimmer (Gleam)', value: 'shimmer', description: 'Brightness and contrast reflection pass' },
  { name: 'Wiggle (Attention)', value: 'wiggle', description: 'Subtle rotational shake to catch the eye' },
  { name: 'Spin (360°)', value: 'spin', description: 'Smooth infinite circular rotation' },
  { name: 'Heartbeat', value: 'heartbeat', description: 'Double-pulse cardiovascular cadence' },
];

/**
 * Parses a CSS transition string into individual parameters
 */
export function parseTransition(raw?: string): ParsedTransition {
  const def: ParsedTransition = {
    property: 'all',
    durationMs: 250,
    timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delayMs: 0,
  };

  if (!raw || raw === 'none') return def;

  // Check if multiple comma separated transitions exist (e.g. transform 250ms ease, opacity 200ms ease)
  // We parse the primary / first one or clean combo
  let clean = raw.trim();

  // Extract timing function
  let timingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const bezierMatch = clean.match(/cubic-bezier\([^)]+\)|steps\([^)]+\)/i);
  if (bezierMatch) {
    timingFunction = bezierMatch[0];
    clean = clean.replace(timingFunction, ' ');
  } else {
    const namedEasing = clean.match(/\b(ease-in-out|ease-in|ease-out|ease|linear)\b/i);
    if (namedEasing) {
      timingFunction = namedEasing[0];
      clean = clean.replace(namedEasing[0], ' ');
    }
  }

  // Extract duration and delay
  const timeMatches = clean.match(/\b\d+(\.\d+)?(ms|s)\b/g);
  let durationMs = def.durationMs;
  let delayMs = def.delayMs;

  if (timeMatches && timeMatches.length > 0) {
    const toMs = (val: string) => {
      if (val.endsWith('ms')) return parseFloat(val);
      if (val.endsWith('s')) return parseFloat(val) * 1000;
      return parseFloat(val);
    };
    durationMs = toMs(timeMatches[0]);
    if (timeMatches.length > 1) {
      delayMs = toMs(timeMatches[1]);
    }
    timeMatches.forEach((t) => {
      clean = clean.replace(t, ' ');
    });
  }

  // The remaining text represents property names
  const remaining = clean
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ')
    .trim();

  const property = remaining || 'all';

  return {
    property,
    durationMs: isNaN(durationMs) ? 250 : durationMs,
    timingFunction: timingFunction || 'cubic-bezier(0.4, 0, 0.2, 1)',
    delayMs: isNaN(delayMs) ? 0 : delayMs,
  };
}

/**
 * Formats parsed parameters into a standard CSS transition declaration
 */
export function formatTransition(t: ParsedTransition): string {
  const delayStr = t.delayMs > 0 ? ` ${t.delayMs}ms` : '';
  return `${t.property} ${t.durationMs}ms ${t.timingFunction}${delayStr}`;
}

/**
 * Parses a CSS animation shorthand string into editable parameters
 */
export function parseAnimation(raw?: string): ParsedAnimation {
  const def: ParsedAnimation = {
    name: 'none',
    durationS: 2,
    timingFunction: 'ease-in-out',
    delayS: 0,
    iterationCount: 'infinite',
    direction: 'normal',
    fillMode: 'forwards',
    playState: 'running',
  };

  if (!raw || raw === 'none') return def;

  let clean = raw.trim();

  // Extract timing function
  let timingFunction = 'ease-in-out';
  const bezierMatch = clean.match(/cubic-bezier\([^)]+\)|steps\([^)]+\)/i);
  if (bezierMatch) {
    timingFunction = bezierMatch[0];
    clean = clean.replace(timingFunction, ' ');
  } else {
    const namedEasing = clean.match(/\b(ease-in-out|ease-in|ease-out|ease|linear)\b/i);
    if (namedEasing) {
      timingFunction = namedEasing[0];
      clean = clean.replace(namedEasing[0], ' ');
    }
  }

  // Iteration count
  let iterationCount = 'infinite';
  if (clean.includes('infinite')) {
    clean = clean.replace('infinite', ' ');
  } else {
    const numMatch = clean.match(/\b\d+\b/);
    if (numMatch) {
      iterationCount = numMatch[0];
      clean = clean.replace(numMatch[0], ' ');
    }
  }

  // Direction
  let direction = 'normal';
  const dirMatch = clean.match(/\b(alternate-reverse|alternate|reverse|normal)\b/i);
  if (dirMatch) {
    direction = dirMatch[0];
    clean = clean.replace(dirMatch[0], ' ');
  }

  // Fill mode
  let fillMode = 'forwards';
  const fillMatch = clean.match(/\b(forwards|backwards|both|none)\b/i);
  if (fillMatch) {
    fillMode = fillMatch[0];
    clean = clean.replace(fillMatch[0], ' ');
  }

  // Play state
  let playState = 'running';
  const playMatch = clean.match(/\b(running|paused)\b/i);
  if (playMatch) {
    playState = playMatch[0];
    clean = clean.replace(playMatch[0], ' ');
  }

  // Durations & Delays
  const timeMatches = clean.match(/\b\d+(\.\d+)?(ms|s)\b/g);
  let durationS = def.durationS;
  let delayS = def.delayS;

  if (timeMatches && timeMatches.length > 0) {
    const toS = (val: string) => {
      if (val.endsWith('ms')) return parseFloat(val) / 1000;
      if (val.endsWith('s')) return parseFloat(val);
      return parseFloat(val);
    };
    durationS = toS(timeMatches[0]);
    if (timeMatches.length > 1) {
      delayS = toS(timeMatches[1]);
    }
    timeMatches.forEach((t) => {
      clean = clean.replace(t, ' ');
    });
  }

  const name = clean.trim().split(/\s+/)[0] || 'none';

  return {
    name,
    durationS: isNaN(durationS) ? 2 : durationS,
    timingFunction,
    delayS: isNaN(delayS) ? 0 : delayS,
    iterationCount,
    direction,
    fillMode,
    playState,
  };
}

/**
 * Formats parsed parameters into CSS animation declaration
 */
export function formatAnimation(a: ParsedAnimation): string {
  if (!a.name || a.name === 'none') return 'none';
  const delayStr = a.delayS > 0 ? ` ${a.delayS}s` : '';
  return `${a.name} ${a.durationS}s ${a.timingFunction}${delayStr} ${a.iterationCount} ${a.direction} ${a.fillMode}`;
}

/**
 * Parses a CSS box-shadow string into editable parameters
 */
export function parseBoxShadow(raw?: string): ParsedBoxShadow {
  const def: ParsedBoxShadow = {
    inset: false,
    offsetX: 0,
    offsetY: 4,
    blur: 10,
    spread: 0,
    color: 'rgba(0, 0, 0, 0.15)',
  };

  if (!raw || raw === 'none') return def;

  const inset = raw.includes('inset');
  const clean = raw.replace('inset', '').trim();

  // Extract color if rgba/rgb or hex
  let color = 'rgba(0, 0, 0, 0.15)';
  const colorMatch = clean.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+)/);
  let numbersPart = clean;

  if (colorMatch) {
    color = colorMatch[0];
    numbersPart = clean.replace(color, '').trim();
  }

  const parts = numbersPart.split(/\s+/).map((p) => parseFloat(p)).filter((n) => !isNaN(n));

  return {
    inset,
    offsetX: parts[0] ?? def.offsetX,
    offsetY: parts[1] ?? def.offsetY,
    blur: parts[2] ?? def.blur,
    spread: parts[3] ?? def.spread,
    color,
  };
}

/**
 * Formats parsed parameters back to valid CSS box-shadow
 */
export function formatBoxShadow(parsed: ParsedBoxShadow): string {
  const { inset, offsetX, offsetY, blur, spread, color } = parsed;
  return `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
}

/**
 * Extracts clean pixel number
 */
export function parsePixelNumber(val?: string, fallback = 0): number {
  if (!val) return fallback;
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

export interface ParsedGridConfig {
  columns: number;
  columnMode: 'equal' | 'auto-fit' | 'auto-fill' | 'custom';
  autoFitMinPx: number;
  customColumns: string;
  rows: number;
  rowMode: 'auto' | 'equal' | 'custom';
  autoRowHeight: string;
  customRows: string;
  gapLinked: boolean;
  gapPx: number;
  rowGapPx: number;
  colGapPx: number;
  justifyItems: 'stretch' | 'start' | 'center' | 'end';
  alignItems: 'stretch' | 'start' | 'center' | 'end';
  justifyContent: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'stretch';
  autoFlow: 'row' | 'column' | 'row dense' | 'column dense';
}

export interface GridPreset {
  name: string;
  description: string;
  badge: string;
  columns: string;
  rows?: string;
  gap: string;
  alignItems?: string;
  justifyItems?: string;
}

export const GRID_LAYOUT_PRESETS: GridPreset[] = [
  {
    name: '2-Column Split',
    description: 'Even 50/50 balance, ideal for hero text + image or two comparison cards',
    badge: 'Popular',
    columns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
  },
  {
    name: '3-Column Cards',
    description: 'Standard 3-across layout for pricing, features, blog cards & reviews',
    badge: 'Standard',
    columns: 'repeat(3, minmax(0, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
  },
  {
    name: '4-Column Gallery',
    description: 'Dense 4-column layout for logo clouds, stats, team members & metrics',
    badge: 'Dense',
    columns: 'repeat(4, minmax(0, 1fr))',
    gap: '20px',
    alignItems: 'stretch',
  },
  {
    name: 'Responsive Auto-Fit Cards',
    description: 'Cards automatically wrap to new rows without media queries (min 260px)',
    badge: 'Responsive',
    columns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
  },
  {
    name: 'Sidebar + Main Content',
    description: 'Fixed 260px left sidebar alongside fluid primary workspace',
    badge: 'App Shell',
    columns: '260px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  {
    name: 'Main Content + Sidebar',
    description: 'Fluid content area with fixed 320px right rail for widgets/ads',
    badge: 'Blog / News',
    columns: '1fr 320px',
    gap: '32px',
    alignItems: 'start',
  },
  {
    name: 'Asymmetric 1/3 + 2/3',
    description: 'Featured headline/quote column alongside larger media or card block',
    badge: 'Editorial',
    columns: '1fr 2fr',
    gap: '32px',
    alignItems: 'center',
  },
  {
    name: 'Holy Grail 3-Column',
    description: 'Left nav (220px), flexible center body (1fr), and right sidebar (240px)',
    badge: 'Classic',
    columns: '220px 1fr 240px',
    gap: '24px',
    alignItems: 'stretch',
  },
  {
    name: '12-Column Bento Base',
    description: 'High-precision 12-column grid system for modern modular bento grids',
    badge: 'Bento Pro',
    columns: 'repeat(12, minmax(0, 1fr))',
    gap: '16px',
    alignItems: 'stretch',
  },
];

export const GAP_PRESETS = [
  { label: 'None', value: 0, text: '0px' },
  { label: 'Tight', value: 8, text: '8px' },
  { label: 'Compact', value: 12, text: '12px' },
  { label: 'Standard', value: 16, text: '16px' },
  { label: 'Spacious', value: 24, text: '24px' },
  { label: 'Large', value: 32, text: '32px' },
  { label: 'Hero', value: 48, text: '48px' },
];

export function parseGridConfig(styles: Record<string, string>): ParsedGridConfig {
  const colVal = (styles['grid-template-columns'] || '').trim();
  const rowVal = (styles['grid-template-rows'] || '').trim();
  const gapVal = styles['gap'] || '';
  const rowGapVal = styles['row-gap'] || '';
  const colGapVal = styles['column-gap'] || '';

  let columns = 3;
  let columnMode: 'equal' | 'auto-fit' | 'auto-fill' | 'custom' = 'equal';
  let autoFitMinPx = 260;
  let customColumns = colVal || 'repeat(3, minmax(0, 1fr))';

  if (colVal) {
    if (colVal.includes('auto-fit')) {
      columnMode = 'auto-fit';
      const matchMin = colVal.match(/minmax\(\s*(\d+)px/);
      if (matchMin) autoFitMinPx = parseInt(matchMin[1], 10);
    } else if (colVal.includes('auto-fill')) {
      columnMode = 'auto-fill';
      const matchMin = colVal.match(/minmax\(\s*(\d+)px/);
      if (matchMin) autoFitMinPx = parseInt(matchMin[1], 10);
    } else {
      const repeatMatch = colVal.match(/repeat\(\s*(\d+)\s*,/i);
      if (repeatMatch) {
        columnMode = 'equal';
        columns = Math.max(1, Math.min(12, parseInt(repeatMatch[1], 10) || 3));
      } else {
        const parts = colVal.split(/\s+(?![^(]*\))/);
        if (parts.length > 1 && parts.every((p) => p === '1fr' || p === 'minmax(0, 1fr)')) {
          columnMode = 'equal';
          columns = parts.length;
        } else if (parts.length > 1) {
          columnMode = 'custom';
          columns = parts.length;
          customColumns = colVal;
        }
      }
    }
  }

  let rows = 1;
  let rowMode: 'auto' | 'equal' | 'custom' = 'auto';
  let autoRowHeight = styles['grid-auto-rows'] || 'auto';
  let customRows = rowVal || 'none';

  if (rowVal && rowVal !== 'none' && rowVal !== 'auto') {
    const repeatRowMatch = rowVal.match(/repeat\(\s*(\d+)\s*,/i);
    if (repeatRowMatch) {
      rowMode = 'equal';
      rows = Math.max(1, Math.min(12, parseInt(repeatRowMatch[1], 10) || 1));
    } else {
      const parts = rowVal.split(/\s+(?![^(]*\))/);
      if (parts.length > 1) {
        rowMode = 'custom';
        rows = parts.length;
        customRows = rowVal;
      }
    }
  }

  let gapPx = 16;
  let rowGapPx = 16;
  let colGapPx = 16;
  let gapLinked = true;

  if (gapVal) {
    const parts = gapVal.trim().split(/\s+/);
    if (parts.length === 1) {
      gapPx = parsePixelNumber(parts[0], 16);
      rowGapPx = gapPx;
      colGapPx = gapPx;
    } else if (parts.length === 2) {
      rowGapPx = parsePixelNumber(parts[0], 16);
      colGapPx = parsePixelNumber(parts[1], 16);
      gapPx = rowGapPx;
      gapLinked = rowGapPx === colGapPx;
    }
  }
  if (rowGapVal) {
    rowGapPx = parsePixelNumber(rowGapVal, gapPx);
    gapLinked = false;
  }
  if (colGapVal) {
    colGapPx = parsePixelNumber(colGapVal, gapPx);
    gapLinked = false;
  }

  return {
    columns,
    columnMode,
    autoFitMinPx,
    customColumns,
    rows,
    rowMode,
    autoRowHeight,
    customRows,
    gapLinked,
    gapPx,
    rowGapPx,
    colGapPx,
    justifyItems: (styles['justify-items'] as any) || 'stretch',
    alignItems: (styles['align-items'] as any) || 'stretch',
    justifyContent: (styles['justify-content'] as any) || 'start',
    alignContent: (styles['align-content'] as any) || 'start',
    autoFlow: (styles['grid-auto-flow'] as any) || 'row',
  };
}

export function formatGridColumns(config: ParsedGridConfig): string {
  if (config.columnMode === 'auto-fit') {
    return `repeat(auto-fit, minmax(${config.autoFitMinPx}px, 1fr))`;
  }
  if (config.columnMode === 'auto-fill') {
    return `repeat(auto-fill, minmax(${config.autoFitMinPx}px, 1fr))`;
  }
  if (config.columnMode === 'custom') {
    return config.customColumns || `repeat(${config.columns}, minmax(0, 1fr))`;
  }
  return `repeat(${config.columns}, minmax(0, 1fr))`;
}

export function formatGridRows(config: ParsedGridConfig): string {
  if (config.rowMode === 'auto') {
    return 'none';
  }
  if (config.rowMode === 'custom') {
    return config.customRows || 'none';
  }
  return `repeat(${config.rows}, minmax(0, 1fr))`;
}

