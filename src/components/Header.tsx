import React from 'react';
import { Download, Terminal, Eye, Sparkles, Coffee } from 'lucide-react';
import { BannerConfig } from '../types';

interface HeaderProps {
  config: BannerConfig;
  onOpenPreview: () => void;
  onOpenAscii: () => void;
  onDownload: (multiplier: number, name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenPreview,
  onOpenAscii,
  onDownload,
}) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Logo & Terminal Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner">
            <span>░▒</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-wider text-white">
                RETRO BANNER STUDIO
              </span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-400 border border-neutral-700">
                1200×400
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <span>active slots:</span>
              {config.project1.enabled !== false && (
                <span className="text-neutral-200">{config.project1.name}</span>
              )}
              {config.project1.enabled !== false && config.project2.enabled !== false && (
                <span className="text-neutral-600">|</span>
              )}
              {config.project2.enabled !== false && (
                <span className="text-neutral-200">{config.project2.name}</span>
              )}
              {config.project1.enabled === false && config.project2.enabled === false && (
                <span className="text-neutral-500 italic">pure monochrome aesthetic</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Profile Simulator Button */}
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-neutral-200 rounded-lg text-xs font-mono transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span>Profile Mockup</span>
          </button>

          {/* ASCII Export */}
          <button
            onClick={onOpenAscii}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-neutral-200 rounded-lg text-xs font-mono transition-colors shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Raw ASCII</span>
          </button>

          {/* Download Standard 1200x400 */}
          <button
            onClick={() => onDownload(1, 'banner-1200x400.png')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 hover:bg-white text-black font-semibold rounded-lg text-xs font-mono transition-all shadow active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          {/* Download 2x Retina */}
          <button
            onClick={() => onDownload(2, 'banner-2400x800-retina.png')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono border border-neutral-700 transition-colors"
          >
            <span>2X Retina</span>
          </button>
        </div>
      </div>
    </header>
  );
};
