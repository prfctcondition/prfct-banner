import React, { useRef } from 'react';
import { BannerConfig, DitherAlgorithm, PresetTheme } from '../types';
import { PRESET_THEMES } from '../data/defaultData';
import { 
  Sliders, 
  Type, 
  Image as ImageIcon, 
  Tv, 
  Sparkles, 
  Upload, 
  RotateCcw, 
  Eye, 
  Radio, 
  Cpu
} from 'lucide-react';

interface BannerControlsProps {
  config: BannerConfig;
  onChange: (updated: Partial<BannerConfig>) => void;
  onImageUploaded: (file: File) => void;
  onResetImage: () => void;
  hasCustomImage: boolean;
}

export const BannerControls: React.FC<BannerControlsProps> = ({
  config,
  onChange,
  onImageUploaded,
  onResetImage,
  hasCustomImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUploaded(e.target.files[0]);
    }
  };

  const applyPreset = (preset: PresetTheme) => {
    onChange(preset.config);
  };

  return (
    <div className="space-y-6 text-neutral-300 font-mono text-xs">
      {/* 1. Preset Archetypes */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 mb-3 text-neutral-200 font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Style Presets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg text-left transition-colors group"
            >
              <div className="font-medium text-white group-hover:text-emerald-300 truncate">
                {preset.name}
              </div>
              <div className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dither & Pixel Engine */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 mb-3 text-neutral-200 font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-neutral-400" />
          <span>Dither & Raster Engine</span>
        </div>

        {/* Algorithm Selector */}
        <div className="mb-4">
          <label className="block text-neutral-400 text-[11px] mb-1.5 uppercase">Algorithm</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {[
              { id: 'bayer8', label: 'Bayer 8x8' },
              { id: 'bayer4', label: 'Bayer 4x4' },
              { id: 'floyd-steinberg', label: 'Floyd-Stein' },
              { id: 'atkinson', label: 'Atkinson' },
              { id: 'halftone', label: 'Halftone' },
            ].map((algo) => (
              <button
                key={algo.id}
                onClick={() => onChange({ ditherAlgo: algo.id as DitherAlgorithm })}
                className={`px-2.5 py-1.5 rounded border text-center transition-colors ${
                  config.ditherAlgo === algo.id
                    ? 'bg-neutral-800 border-neutral-600 text-white'
                    : 'bg-neutral-900 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Contrast</span>
              <span className="text-white font-mono">{config.contrast.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.2"
              step="0.05"
              value={config.contrast}
              onChange={(e) => onChange({ contrast: parseFloat(e.target.value) })}
              className="w-full accent-neutral-200 bg-neutral-800 h-1.5 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Brightness</span>
              <span className="text-white font-mono">{config.brightness > 0 ? `+${config.brightness}` : config.brightness}</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="2"
              value={config.brightness}
              onChange={(e) => onChange({ brightness: parseInt(e.target.value) })}
              className="w-full accent-neutral-200 bg-neutral-800 h-1.5 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Pixel Grain</span>
              <span className="text-white font-mono">{config.ditherScale}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={config.ditherScale}
              onChange={(e) => onChange({ ditherScale: parseInt(e.target.value) })}
              className="w-full accent-neutral-200 bg-neutral-800 h-1.5 rounded"
            />
          </div>
        </div>

        {/* Invert Switch */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
          <span className="text-neutral-400">Color Polarity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange({ invert: false })}
              className={`px-3 py-1 rounded text-[11px] border transition-colors ${
                !config.invert
                  ? 'bg-neutral-800 border-neutral-600 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              White on Black
            </button>
            <button
              onClick={() => onChange({ invert: true })}
              className={`px-3 py-1 rounded text-[11px] border transition-colors ${
                config.invert
                  ? 'bg-neutral-200 border-white text-black'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
            >
              Black on White
            </button>
          </div>
        </div>
      </div>

      {/* 3. Project Typography Settings & Details */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold uppercase tracking-wider">
            <Type className="w-4 h-4 text-emerald-400" />
            <span>Projects & Terminal Details</span>
          </div>
          <span className="text-[10px] text-neutral-500">
            Toggle on/off, customize titles, categories & telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Project 1: zen zakura macro */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            config.project1.enabled !== false 
              ? 'bg-neutral-900/80 border-neutral-700' 
              : 'bg-neutral-950/60 border-neutral-900 opacity-60'
          }`}>
            {/* Header with Enable/Disable Toggle */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.project1.enabled !== false ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                  Slot 01: {config.project1.name || 'Unnamed'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    onChange({
                      project1: { ...config.project1, enabled: !config.project1.enabled },
                    })
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
                    config.project1.enabled !== false
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${config.project1.enabled !== false ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                  <span>{config.project1.enabled !== false ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>
            </div>

            {/* Edit Fields */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Project Name (Title)</label>
                <input
                  type="text"
                  value={config.project1.name}
                  disabled={config.project1.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project1: { ...config.project1, name: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1.5 text-white font-mono"
                  placeholder="e.g. zen zakura macro"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Prefix Tag / Header</label>
                <input
                  type="text"
                  value={config.project1.prefix ?? ''}
                  disabled={config.project1.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project1: { ...config.project1, prefix: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                  placeholder="// 01. PROJECT_INITIALIZED"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">Category Badge</label>
                  <input
                    type="text"
                    value={config.project1.category}
                    disabled={config.project1.enabled === false}
                    onChange={(e) =>
                      onChange({
                        project1: { ...config.project1, category: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                    placeholder="OPTICAL / BOTANICAL"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">System Code</label>
                  <input
                    type="text"
                    value={config.project1.code}
                    disabled={config.project1.enabled === false}
                    onChange={(e) =>
                      onChange({
                        project1: { ...config.project1, code: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                    placeholder="SYS.MACRO.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Telemetry Line</label>
                <input
                  type="text"
                  value={config.project1.telemetry}
                  disabled={config.project1.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project1: { ...config.project1, telemetry: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                  placeholder="[SYS.MACRO // F1.4 1:1 RESOLUTION // BOTANICAL STIPPLE]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Description / Subtext</label>
                <input
                  type="text"
                  value={config.project1.subtext}
                  disabled={config.project1.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project1: { ...config.project1, subtext: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1.5 text-neutral-300 font-mono text-[11px]"
                  placeholder="botanical micro-focus // 1:1 stipple capture // optics"
                />
              </div>

              {/* Reset to Zen Zakura Defaults */}
              <button
                onClick={() =>
                  onChange({
                    project1: {
                      enabled: true,
                      name: 'zen zakura macro',
                      category: 'OPTICAL / BOTANICAL',
                      code: 'SYS.MACRO.01',
                      telemetry: '[SYS.MACRO // F1.4 1:1 RESOLUTION // BOTANICAL STIPPLE // 35mm]',
                      subtext: 'botanical micro-focus // 1:1 stipple capture // optics',
                      showVisualElement: true,
                    },
                  })
                }
                className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors pt-1 block"
              >
                ↺ Reset Slot 01 to zen zakura macro defaults
              </button>
            </div>
          </div>

          {/* Project 2: otofy */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            config.project2.enabled !== false 
              ? 'bg-neutral-900/80 border-neutral-700' 
              : 'bg-neutral-950/60 border-neutral-900 opacity-60'
          }`}>
            {/* Header with Enable/Disable Toggle */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.project2.enabled !== false ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                  Slot 02: {config.project2.name || 'Unnamed'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    onChange({
                      project2: { ...config.project2, enabled: !config.project2.enabled },
                    })
                  }
                  className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
                    config.project2.enabled !== false
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${config.project2.enabled !== false ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                  <span>{config.project2.enabled !== false ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>
            </div>

            {/* Edit Fields */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Project Name (Title)</label>
                <input
                  type="text"
                  value={config.project2.name}
                  disabled={config.project2.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project2: { ...config.project2, name: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1.5 text-white font-mono"
                  placeholder="e.g. otofy"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Prefix Tag / Header</label>
                <input
                  type="text"
                  value={config.project2.prefix ?? ''}
                  disabled={config.project2.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project2: { ...config.project2, prefix: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                  placeholder="// 02. MODULAR_NODE"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">Category Badge</label>
                  <input
                    type="text"
                    value={config.project2.category}
                    disabled={config.project2.enabled === false}
                    onChange={(e) =>
                      onChange({
                        project2: { ...config.project2, category: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                    placeholder="SOUND / DSP"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">System Code</label>
                  <input
                    type="text"
                    value={config.project2.code}
                    disabled={config.project2.enabled === false}
                    onChange={(e) =>
                      onChange({
                        project2: { ...config.project2, code: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                    placeholder="AUDIO.DSP.V2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Waveform Tag / Visual Label</label>
                <input
                  type="text"
                  value={config.project2.visualLabel ?? ''}
                  disabled={config.project2.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project2: { ...config.project2, visualLabel: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                  placeholder="44.1kHz / 24-BIT WAV"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Telemetry Line</label>
                <input
                  type="text"
                  value={config.project2.telemetry}
                  disabled={config.project2.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project2: { ...config.project2, telemetry: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1 text-neutral-300 font-mono text-[11px]"
                  placeholder="[AUDIO.DSP // MODULAR SYNTHESIS // 20Hz - 22kHz]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-[10px] uppercase mb-1">Description / Subtext</label>
                <input
                  type="text"
                  value={config.project2.subtext}
                  disabled={config.project2.enabled === false}
                  onChange={(e) =>
                    onChange({
                      project2: { ...config.project2, subtext: e.target.value },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 disabled:bg-neutral-900/50 rounded px-2.5 py-1.5 text-neutral-300 font-mono text-[11px]"
                  placeholder="digital audio synthesis // dsp modular wave // 44.1kHz"
                />
              </div>

              {/* Reset to Otofy Defaults */}
              <button
                onClick={() =>
                  onChange({
                    project2: {
                      enabled: true,
                      name: 'otofy',
                      category: 'SOUND / DSP',
                      code: 'AUDIO.DSP.V2',
                      telemetry: '[AUDIO.DSP // MODULAR SYNTHESIS // 20Hz - 22kHz // FREQ_OUT]',
                      subtext: 'digital audio synthesis // dsp modular wave // 44.1kHz',
                      showVisualElement: true,
                    },
                  })
                }
                className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors pt-1 block"
              >
                ↺ Reset Slot 02 to otofy defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Terminal Header, Footer & System Typography */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold uppercase tracking-wider">
            <Type className="w-4 h-4 text-emerald-400" />
            <span>Header, Footer & System Texts</span>
          </div>
          <span className="text-[10px] text-neutral-500">
            Edit any corner, prompt, status badge, or handle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* System Prompt (Top Left) */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Top Left: Terminal Command Prompt
            </label>
            <input
              type="text"
              value={config.systemPrompt}
              onChange={(e) => onChange({ systemPrompt: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="USER@RETRO-TERMINAL:~$ init --profile-header"
            />
          </div>

          {/* Top Right Header Text */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Top Right: System Telemetry Header
            </label>
            <input
              type="text"
              value={config.topRightText ?? ''}
              onChange={(e) => onChange({ topRightText: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="[SYS.PROFILE // MONOCHROME MATRIX // 1200x400]"
            />
          </div>

          {/* Bottom Left Status Text */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Bottom Left: Status & Engine Telemetry
            </label>
            <input
              type="text"
              value={config.bottomLeftText ?? ''}
              onChange={(e) => onChange({ bottomLeftText: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="ASCII RASTER // 1-BIT DITHER // 2026"
            />
          </div>

          {/* Bottom Right System Text */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Bottom Right: Signature & System State
            </label>
            <input
              type="text"
              value={config.bottomRightText ?? ''}
              onChange={(e) => onChange({ bottomRightText: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="TERMINAL ENGINE // READY"
            />
          </div>

          {/* Author Handle */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Author Handle / Signature
            </label>
            <input
              type="text"
              value={config.authorHandle}
              onChange={(e) => onChange({ authorHandle: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="@zenzakura"
            />
          </div>

          {/* Safe Zone Guide Label */}
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Avatar Safe Zone Guide Label
            </label>
            <input
              type="text"
              value={config.safeZoneLabel ?? ''}
              onChange={(e) => onChange({ safeZoneLabel: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="AVATAR SAFE ZONE (DO NOT PLACE ESSENTIAL TEXT HERE)"
            />
          </div>
        </div>
      </div>

      {/* 5. Minimalist Void Texts (Active when both slots are disabled) */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-neutral-400" />
            <span>Standalone / Void Mode Texts</span>
          </div>
          <span className="text-[10px] text-neutral-500">
            Rendered when both project slots are disabled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Void Command Prompt
            </label>
            <input
              type="text"
              value={config.voidPrompt ?? ''}
              onChange={(e) => onChange({ voidPrompt: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="sys@creative-core:~$ systemctl status visual-nodes"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Main Void Title
            </label>
            <input
              type="text"
              value={config.voidTitle ?? ''}
              onChange={(e) => onChange({ voidTitle: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="BOTANICAL // DIGITAL VOID"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Void Subtitle Tag
            </label>
            <input
              type="text"
              value={config.voidSubtitle ?? ''}
              onChange={(e) => onChange({ voidSubtitle: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="[STANDALONE MONOCHROME AESTHETIC // DITHER: BAYER8]"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-[10px] uppercase mb-1">
              Void Description / Footnote
            </label>
            <input
              type="text"
              value={config.voidSubtext ?? ''}
              onChange={(e) => onChange({ voidSubtext: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono text-[11px]"
              placeholder="pure monochrome aesthetic // 1-bit raster"
            />
          </div>
        </div>
      </div>

      {/* 6. Flower Artwork & Image Source */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold uppercase tracking-wider">
            <ImageIcon className="w-4 h-4 text-neutral-400" />
            <span>Botanical Blossom / Avatar</span>
          </div>

          {hasCustomImage && (
            <button
              onClick={onResetImage}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Botanical Lily</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-400 text-[10px] mb-1">Flower Placement</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['right', 'center', 'left'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => onChange({ flowerPosition: pos })}
                  className={`py-1.5 rounded border text-center uppercase text-[11px] transition-colors ${
                    config.flowerPosition === pos
                      ? 'bg-neutral-800 border-neutral-600 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Flower Scale</span>
              <span className="text-white font-mono">{config.flowerScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.6"
              step="0.05"
              value={config.flowerScale}
              onChange={(e) => onChange({ flowerScale: parseFloat(e.target.value) })}
              className="w-full accent-neutral-200 bg-neutral-800 h-1.5 rounded"
            />
          </div>
        </div>

        {/* Upload Custom Avatar image */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center justify-center gap-2 text-neutral-300 hover:text-white transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload or Replace with Avatar Image (Instant Dither)</span>
          </button>
          <p className="text-[10px] text-neutral-500 text-center mt-1.5">
            Tip: You can upload your photo_2026-06-17_02-43-08.jpg file to dither it directly!
          </p>
        </div>
      </div>

      {/* 7. Terminal Overlays & Avatar Safe Zone */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 mb-3 text-neutral-200 font-semibold uppercase tracking-wider">
          <Tv className="w-4 h-4 text-neutral-400" />
          <span>Overlays & Visual Elements</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onChange({ showAudioWave: !config.showAudioWave })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showAudioWave
                ? 'bg-neutral-900 border-neutral-600 text-white'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>Audio Waveform [otofy]</span>
            <span className={`w-2 h-2 rounded-full ${config.showAudioWave ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
          </button>

          <button
            onClick={() => onChange({ showMacroFrame: !config.showMacroFrame })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showMacroFrame
                ? 'bg-neutral-900 border-neutral-600 text-white'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>Macro Viewfinder [zen zakura]</span>
            <span className={`w-2 h-2 rounded-full ${config.showMacroFrame ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
          </button>

          <button
            onClick={() => onChange({ showScanlines: !config.showScanlines })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showScanlines
                ? 'bg-neutral-900 border-neutral-600 text-white'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>CRT Scanlines</span>
            <span className={`w-2 h-2 rounded-full ${config.showScanlines ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
          </button>

          <button
            onClick={() => onChange({ showAsciiGrid: !config.showAsciiGrid })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showAsciiGrid
                ? 'bg-neutral-900 border-neutral-600 text-white'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>Coordinate Dot Grid</span>
            <span className={`w-2 h-2 rounded-full ${config.showAsciiGrid ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
          </button>

          <button
            onClick={() => onChange({ showTerminalBorder: !config.showTerminalBorder })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showTerminalBorder
                ? 'bg-neutral-900 border-neutral-600 text-white'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>ASCII Frame + Border</span>
            <span className={`w-2 h-2 rounded-full ${config.showTerminalBorder ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
          </button>

          <button
            onClick={() => onChange({ showSafeZoneGuide: !config.showSafeZoneGuide })}
            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
              config.showSafeZoneGuide
                ? 'bg-red-950/40 border-red-800 text-red-300'
                : 'bg-neutral-950 border-neutral-800/80 text-neutral-500'
            }`}
          >
            <span>Avatar Safe Zone Guide</span>
            <span className={`w-2 h-2 rounded-full ${config.showSafeZoneGuide ? 'bg-red-500' : 'bg-neutral-700'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
