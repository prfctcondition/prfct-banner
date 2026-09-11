import React, { useState } from 'react';
import { BannerConfig } from '../types';
import { X, ExternalLink, Share2, CheckCircle2, Monitor, Smartphone, Terminal, Globe } from 'lucide-react';

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BannerConfig;
  bannerCanvas: HTMLCanvasElement | null;
  avatarUrl: string | null;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  config,
  bannerCanvas,
  avatarUrl,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const bannerDataUrl = bannerCanvas ? bannerCanvas.toDataURL('image/png') : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-neutral-300 uppercase">
              Profile Banner Simulator
            </span>
            <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
              // Test banner framing & avatar overlap in real context
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-md p-0.5 mr-2">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  deviceMode === 'desktop'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  deviceMode === 'mobile'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable Profile View */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-[#0e0e11] flex justify-center">
          <div
            className={`w-full transition-all duration-300 bg-[#141419] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl ${
              deviceMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'
            }`}
          >
            {/* 1. Banner Section */}
            <div className="relative w-full aspect-[3/1] bg-black overflow-hidden group">
              {bannerDataUrl ? (
                <img
                  src={bannerDataUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-neutral-500">
                  [GENERATING BANNER PREVIEW...]
                </div>
              )}

              {/* Verified Header Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700/60 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {config.authorHandle || '@creative'}
              </div>
            </div>

            {/* 2. Profile Info Header (Avatar Overlap) */}
            <div className="px-6 relative pb-6 border-b border-neutral-800/80">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
                {/* Overlapping Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#141419] bg-black overflow-hidden shadow-xl flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-xs font-mono text-neutral-400">
                        AVATAR
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#141419] flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-black" />
                  </span>
                </div>

                {/* Profile Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-white text-black font-semibold text-xs rounded-full shadow-lg transition-transform active:scale-95 font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </button>
                  <button className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full border border-neutral-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name & Bio */}
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Digital Creative Studio</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono font-normal">
                    Creator
                  </span>
                </h1>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {config.authorHandle || '@creative'} · Visual & Sound Architect
                </p>

                <p className="text-sm text-neutral-300 mt-3 max-w-2xl font-sans leading-relaxed">
                  {config.project1.enabled !== false && config.project2.enabled !== false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project1.name}</span> ({config.project1.category.toLowerCase()}) & <span className="font-mono text-white underline underline-offset-4">{config.project2.name}</span> ({config.project2.category.toLowerCase()}). Crafting dithered monochrome digital art and retro-terminal experiences.
                    </>
                  )}
                  {config.project1.enabled !== false && config.project2.enabled === false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project1.name}</span> ({config.project1.category.toLowerCase()}). Crafting dithered monochrome digital art and retro-terminal optics.
                    </>
                  )}
                  {config.project1.enabled === false && config.project2.enabled !== false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project2.name}</span> ({config.project2.category.toLowerCase()}). Crafting dithered monochrome digital art and modular sound systems.
                    </>
                  )}
                  {config.project1.enabled === false && config.project2.enabled === false && (
                    <>
                      Digital artist & developer crafting dithered 1-bit monochrome artwork, ASCII interfaces, and retro-digital aesthetics.
                    </>
                  )}
                </p>

                {/* Project Links / Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {config.project1.enabled !== false && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-md">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {config.project1.name} [{config.project1.code || 'SYS'}]
                    </span>
                  )}
                  {config.project2.enabled !== false && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 rounded-md">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      {config.project2.name} [{config.project2.code || 'AUDIO'}]
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/60 text-neutral-400 text-xs font-mono rounded-md">
                    dithered · ascii · retro-digital
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Simulated Content Feed */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111116]">
              <div className="bg-[#181820] p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                  <span>ACTIVE DEPLOYMENT</span>
                  <span>ONLINE</span>
                </div>
                <h4 className="text-sm font-semibold text-white font-mono">
                  {config.project1.name} // {config.project1.category}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {config.project1.subtext}
                </p>
              </div>

              <div className="bg-[#181820] p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                  <span>DSP SIGNAL</span>
                  <span>SYNCED</span>
                </div>
                <h4 className="text-sm font-semibold text-white font-mono">
                  {config.project2.name} // {config.project2.category}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {config.project2.subtext}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>* Standard profile banner ratio: 3:1 (1200 x 400 px)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-mono text-xs transition-colors"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
