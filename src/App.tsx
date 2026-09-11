import React, { useState, useRef, useCallback } from 'react';
import { BannerConfig } from './types';
import { DEFAULT_BANNER_CONFIG, PRESET_THEMES } from './data/defaultData';
import { BannerCanvas, BannerCanvasHandle } from './components/BannerCanvas';
import { BannerControls } from './components/BannerControls';
import { ProfilePreviewModal } from './components/ProfilePreviewModal';
import { AsciiModal } from './components/AsciiModal';
import { Header } from './components/Header';
import { 
  Terminal, 
  Sparkles, 
  Eye, 
  Download, 
  Upload, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Layers, 
  Cpu, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_BANNER_CONFIG);
  const [customImageElement, setCustomImageElement] = useState<HTMLImageElement | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [rawAscii, setRawAscii] = useState<string>('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAsciiModalOpen, setIsAsciiModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'typography' | 'dither' | 'overlays'>('presets');

  const canvasRef = useRef<BannerCanvasHandle | null>(null);

  // Handle configuration updates
  const handleConfigChange = useCallback((updated: Partial<BannerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  }, []);

  // Handle file uploads (image/avatar)
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setCustomImageElement(img);
        setCustomImageUrl(url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleResetImage = useCallback(() => {
    setCustomImageElement(null);
    setCustomImageUrl(null);
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = (multiplier: number, name: string) => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage(multiplier, name);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Top Header */}
      <Header
        config={config}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        onOpenAscii={() => setIsAsciiModalOpen(true)}
        onDownload={handleDownload}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Terminal Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-neutral-950 border border-neutral-800/80 rounded-lg text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-neutral-300">ACTIVE SLOTS:</span>
            <span className="text-white">
              {[
                config.project1.enabled !== false ? config.project1.name : null,
                config.project2.enabled !== false ? config.project2.name : null,
              ].filter(Boolean).join(' // ') || 'NO PROJECTS LINKED (BOTANICAL VOID)'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>FORMAT: 1200×400 (3:1 BANNER)</span>
            <span className="hidden sm:inline">ALGO: {config.ditherAlgo.toUpperCase()}</span>
            <span className="hidden md:inline">POLARITY: {config.invert ? 'BLACK/WHITE' : 'WHITE/BLACK'}</span>
          </div>
        </div>

        {/* 1. Primary Banner Stage / Canvas Viewport */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-neutral-300 uppercase">
                Profile Header Preview
              </span>
              <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                1200 × 400 PX
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Safe Zone Toggle */}
              <button
                onClick={() => handleConfigChange({ showSafeZoneGuide: !config.showSafeZoneGuide })}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  config.showSafeZoneGuide
                    ? 'bg-red-950/60 border-red-800 text-red-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
                title="Toggle circular avatar safe zone guide"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Avatar Safe Zone</span>
              </button>

              {/* Invert Polarity */}
              <button
                onClick={() => handleConfigChange({ invert: !config.invert })}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-mono rounded transition-colors"
                title="Invert colors (White on Black / Black on White)"
              >
                {config.invert ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{config.invert ? 'Dark Void' : 'Paper Invert'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Frame (Drag & Drop Target) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border p-2 sm:p-3 bg-neutral-950 transition-all ${
              isDragging
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/10'
                : 'border-neutral-800 shadow-2xl'
            }`}
          >
            {/* Banner Canvas */}
            <BannerCanvas
              ref={canvasRef}
              config={config}
              customImageElement={customImageElement}
              onAsciiGenerated={(ascii) => setRawAscii(ascii)}
            />

            {/* Drag Overlay Hint */}
            {isDragging && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center rounded-xl border border-emerald-500 z-20">
                <div className="text-center font-mono text-emerald-400 text-sm">
                  <Upload className="w-8 h-8 mx-auto mb-2 animate-bounce" />
                  <span>Drop avatar image to dither instantly</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Pills Under Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400 px-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase text-neutral-600 mr-1">Presets:</span>
              {PRESET_THEMES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleConfigChange(p.config)}
                  className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-[11px] text-neutral-300 transition-colors"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewModalOpen(true)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate in Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Customization Controls Section */}
        <section className="mt-2">
          <BannerControls
            config={config}
            onChange={handleConfigChange}
            onImageUploaded={handleFile}
            onResetImage={handleResetImage}
            hasCustomImage={!!customImageElement}
          />
        </section>
      </main>

      {/* Realistic Profile Simulator Modal */}
      <ProfilePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        config={config}
        bannerCanvas={canvasRef.current ? canvasRef.current.getCanvas() : null}
        avatarUrl={customImageUrl}
      />

      {/* Raw ASCII Matrix Exporter Modal */}
      <AsciiModal
        isOpen={isAsciiModalOpen}
        onClose={() => setIsAsciiModalOpen(false)}
        asciiContent={rawAscii}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>// RETRO-TERMINAL BANNER STUDIO · DITHERED · ASCII MATRIX</span>
          <span>
            active: {[config.project1.enabled !== false ? config.project1.name : null, config.project2.enabled !== false ? config.project2.name : null].filter(Boolean).join(' · ') || 'botanical void'}
          </span>
        </div>
      </footer>
    </div>
  );
}
