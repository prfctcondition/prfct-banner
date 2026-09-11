export type DitherAlgorithm = 
  | 'floyd-steinberg'
  | 'atkinson'
  | 'bayer8'
  | 'bayer4'
  | 'halftone'
  | 'ascii'
  | 'pure-1bit';

export type BannerAspectRatio = '3:1' | '16:9' | '2.5:1';

export interface ProjectData {
  title: string;
  tagline: string;
  badge: string;
  telemetry: string;
}

export interface ProjectItemConfig {
  enabled: boolean;
  prefix?: string;
  name: string;
  subtext: string;
  code: string;
  category: string;
  telemetry: string;
  showVisualElement?: boolean;
  visualLabel?: string;
}

export interface BannerConfig {
  // Projects
  project1: ProjectItemConfig;
  project2: ProjectItemConfig;

  // Terminal & Header System (Fully Editable)
  systemPrompt: string;
  sessionCode: string;
  topRightText: string;
  authorHandle: string;
  statusTag: string;
  bottomLeftText: string;
  bottomRightText: string;

  // Standalone / Void Text (when projects disabled)
  voidTitle: string;
  voidSubtitle: string;
  voidPrompt: string;
  voidSubtext: string;
  safeZoneLabel: string;

  // Visual Styling
  ditherAlgo: DitherAlgorithm;
  ditherScale: number; // 1 = ultra fine, 2 = retro 8-bit, 3 = chunky
  contrast: number; // 0.5 to 2.0
  brightness: number; // -50 to 50
  invert: boolean; // false = white on black (default), true = black on white
  colorTint: 'monochrome' | 'soft-warm' | 'matrix' | 'amber';

  // Overlays & Telemetry
  showScanlines: boolean;
  scanlineIntensity: number;
  showAsciiGrid: boolean;
  showAudioWave: boolean;
  showMacroFrame: boolean;
  showTerminalBorder: boolean;
  showSafeZoneGuide: boolean;

  // Flower Composition
  flowerPosition: 'right' | 'left' | 'center' | 'duo';
  flowerScale: number; // 0.6 to 1.6
  flowerOffsetX: number;
  flowerOffsetY: number;

  // Custom Avatar / Image
  customImageSrc: string | null;

  // Dimensions
  aspectRatio: BannerAspectRatio;
  width: number;
  height: number;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  config: Partial<BannerConfig>;
}
