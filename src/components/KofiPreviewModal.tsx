import React, { useState } from 'react';
import { BannerConfig } from '../types';
import { X, Heart, Coffee, ExternalLink, Share2, CheckCircle2, Monitor, Smartphone } from 'lucide-react';

interface KofiPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BannerConfig;
  bannerCanvas: HTMLCanvasElement | null;
  avatarUrl: string | null;
}

export const KofiPreviewModal: React.FC<KofiPreviewModalProps> = ({
  isOpen,
  onClose,
  config,
  bannerCanvas,
  avatarUrl,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [coffeeCount, setCoffeeCount] = useState(3);

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
              Live Ko-fi Profile Simulator
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

        {/* Modal Content - Scrollable Ko-fi View */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-[#0e0e11] flex justify-center">
          <div
            className={`w-full transition-all duration-300 bg-[#141419] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl ${
              deviceMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'
            }`}
          >
            {/* 1. Ko-fi Banner Section */}
            <div className="relative w-full aspect-[3/1] bg-black overflow-hidden group">
              {bannerDataUrl ? (
                <img
                  src={bannerDataUrl}
                  alt="Ko-fi Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-neutral-500">
                  [GENERATING BANNER PREVIEW...]
                </div>
              )}

              {/* Verified Ko-fi Header Badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700/60 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                ko-fi.com/creative
              </div>
            </div>

            {/* 2. Ko-fi Profile Info Header (Avatar Overlap) */}
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

                {/* Ko-fi Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#ff5e5b] hover:bg-[#ff4946] text-white font-medium text-xs rounded-full shadow-lg transition-transform active:scale-95">
                    <Coffee className="w-4 h-4 fill-white" />
                    <span>Support $5</span>
                  </button>
                  <button className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full border border-neutral-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name & Bio */}
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Creative Digital Studio</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono font-normal">
                    Creator
                  </span>
                </h1>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  @zenzakura · 128 supporters
                </p>

                <p className="text-sm text-neutral-300 mt-3 max-w-2xl font-sans leading-relaxed">
                  {config.project1.enabled !== false && config.project2.enabled !== false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project1.name}</span> ({config.project1.category.toLowerCase()}) & <span className="font-mono text-white underline underline-offset-4">{config.project2.name}</span> ({config.project2.category.toLowerCase()}). Crafting dithered 1-bit monochrome digital art and retro-terminal experiences.
                    </>
                  )}
                  {config.project1.enabled !== false && config.project2.enabled === false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project1.name}</span> ({config.project1.category.toLowerCase()}). Crafting dithered 1-bit monochrome digital art and retro-terminal optics.
                    </>
                  )}
                  {config.project1.enabled === false && config.project2.enabled !== false && (
                    <>
                      Creator of <span className="font-mono text-white underline underline-offset-4">{config.project2.name}</span> ({config.project2.category.toLowerCase()}). Crafting dithered 1-bit monochrome digital art and modular audio experiences.
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

            {/* 3. Simulated Support & Content Feed */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#111116]">
              {/* Left Column: Support Box */}
              <div className="bg-[#181820] p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Buy {config.project1.name} a Coffee
                  </h3>
                  <div className="flex items-center gap-2 my-3">
                    <button
                      onClick={() => setCoffeeCount(1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        coffeeCount === 1
                          ? 'bg-[#ff5e5b] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      $5
                    </button>
                    <button
                      onClick={() => setCoffeeCount(3)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        coffeeCount === 3
                          ? 'bg-[#ff5e5b] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      $15
                    </button>
                    <button
                      onClick={() => setCoffeeCount(5)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        coffeeCount === 5
                          ? 'bg-[#ff5e5b] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      $25
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="Loving the dithered aesthetic!"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 font-mono mb-3"
                  />
                </div>
                <button className="w-full py-2 bg-[#ff5e5b] text-white font-semibold text-xs rounded-lg shadow transition-opacity hover:opacity-95">
                  Support with ${coffeeCount * 5}
                </button>
              </div>

              {/* Right Column: Recent Posts / Releases */}
              <div className="md:col-span-2 space-y-3">
                <div className="bg-[#181820] p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                    <span>PROJECT RELEASE</span>
                    <span>2 hours ago</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white font-mono">
                    {config.project1.name} // 1:1 Stipple Collection v1.0
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    New macro photography captures processed through our custom 8x8 Bayer dithering matrix.
                  </p>
                </div>

                <div className="bg-[#181820] p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5">
                    <span>AUDIO EXPERIMENT</span>
                    <span>Yesterday</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white font-mono">
                    {config.project2.name} // Modular DSP Engine Beta
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Real-time sound frequency shaping with retro-terminal interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>* Verified Ko-fi aspect ratio: 3:1 (1200 x 400 px)</span>
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
