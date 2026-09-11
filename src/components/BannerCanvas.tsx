import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { BannerConfig } from '../types';
import { applyDithering, generateAsciiArt } from '../utils/ditherEngine';
import { drawProceduralFlower } from '../utils/flowerGenerator';

export interface BannerCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getAsciiArt: (cols?: number) => string;
  downloadImage: (multiplier?: number, filename?: string) => void;
}

interface BannerCanvasProps {
  config: BannerConfig;
  customImageElement: HTMLImageElement | null;
  onAsciiGenerated?: (ascii: string) => void;
}

export const BannerCanvas = forwardRef<BannerCanvasHandle, BannerCanvasProps>(
  ({ config, customImageElement, onAsciiGenerated }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getAsciiArt: (cols = 90) => {
        if (!canvasRef.current) return '';
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return '';
        const imgData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        return generateAsciiArt(imgData, cols);
      },
      downloadImage: (multiplier = 1, filename = 'kofi-header-banner.png') => {
        if (!canvasRef.current) return;
        const srcCanvas = canvasRef.current;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = srcCanvas.width * multiplier;
        exportCanvas.height = srcCanvas.height * multiplier;
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return;

        // Pixelated crisp rendering for retina scaling
        exportCtx.imageSmoothingEnabled = false;
        exportCtx.drawImage(
          srcCanvas,
          0,
          0,
          exportCanvas.width,
          exportCanvas.height
        );

        const link = document.createElement('a');
        link.download = filename;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const { width, height } = config;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Fill
      const bgColor = config.invert ? '#ffffff' : '#000000';
      const fgColor = config.invert ? '#000000' : '#ffffff';
      const dimColor = config.invert ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';
      const veryDimColor = config.invert ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. ASCII / Coordinate Dot Grid
      if (config.showAsciiGrid) {
        ctx.fillStyle = veryDimColor;
        const gridStep = 32;
        for (let x = 16; x < width; x += gridStep) {
          for (let y = 16; y < height; y += gridStep) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // 3. Flower Layer (Rendered on offscreen canvas then dithered)
      const flowerCanvas = document.createElement('canvas');
      flowerCanvas.width = width;
      flowerCanvas.height = height;
      const flowerCtx = flowerCanvas.getContext('2d', { willReadFrequently: true });

      if (flowerCtx) {
        flowerCtx.fillStyle = '#000000';
        flowerCtx.fillRect(0, 0, width, height);

        // Determine flower center and size
        let flowerCx = width * 0.76 + config.flowerOffsetX;
        let flowerCy = height * 0.52 + config.flowerOffsetY;
        if (config.flowerPosition === 'left') {
          flowerCx = width * 0.28 + config.flowerOffsetX;
        } else if (config.flowerPosition === 'center') {
          flowerCx = width * 0.5 + config.flowerOffsetX;
        }

        const baseSize = (height * 0.72) * config.flowerScale;

        if (customImageElement && customImageElement.complete) {
          // Draw user uploaded image
          flowerCtx.save();
          const imgAspect = customImageElement.width / customImageElement.height;
          const targetH = baseSize * 1.8;
          const targetW = targetH * imgAspect;
          flowerCtx.drawImage(
            customImageElement,
            flowerCx - targetW / 2,
            flowerCy - targetH / 2,
            targetW,
            targetH
          );
          flowerCtx.restore();
        } else {
          // Draw high-fidelity botanical lily
          drawProceduralFlower(flowerCtx, flowerCx, flowerCy, baseSize);

          if (config.flowerPosition === 'duo') {
            // Secondary complementary blossom
            drawProceduralFlower(flowerCtx, width * 0.24, height * 0.5, baseSize * 0.65);
          }
        }

        // Apply Dithering Algorithm to flower
        const flowerImgData = flowerCtx.getImageData(0, 0, width, height);
        applyDithering(
          flowerImgData,
          config.ditherAlgo,
          config.ditherScale,
          config.contrast,
          config.brightness,
          config.invert
        );
        flowerCtx.putImageData(flowerImgData, 0, 0);

        // Blend onto main canvas using screen/multiply mode depending on invert
        ctx.save();
        if (!config.invert) {
          ctx.globalCompositeOperation = 'screen';
        } else {
          ctx.globalCompositeOperation = 'multiply';
        }
        ctx.drawImage(flowerCanvas, 0, 0);
        ctx.restore();
      }

      // 4. Draw Retro-Terminal Typography & Layout
      ctx.save();

      // Top System Banner
      ctx.font = '200 11px "JetBrains Mono", "Share Tech Mono", monospace';
      ctx.fillStyle = dimColor;
      ctx.fillText(config.systemPrompt, 36, 38);

      const sessionText = `${config.sessionCode}  [KO-FI: 1200x400]`;
      const sessionMetrics = ctx.measureText(sessionText);
      ctx.fillText(sessionText, width - sessionMetrics.width - 36, 38);

      // Thin Top Divider
      ctx.strokeStyle = veryDimColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(36, 50);
      ctx.lineTo(width - 36, 50);
      ctx.stroke();

      // Left Column: Projects Typography
      const startX = 42;
      const p1Active = config.project1.enabled !== false;
      const p2Active = config.project2.enabled !== false;

      if (p1Active && p2Active) {
        // Both projects enabled: Two stacked sections
        let curY = 96;

        // Project 1
        ctx.font = '200 10px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(`// 01. PROJECT_INITIALIZED [${config.project1.category}]`, startX, curY);

        curY += 34;
        ctx.font = '200 36px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText(config.project1.name, startX, curY);

        const title1Width = ctx.measureText(config.project1.name).width;
        ctx.font = '100 34px "JetBrains Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText('_', startX + title1Width + 6, curY);

        curY += 22;
        ctx.font = '200 11px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(config.project1.telemetry || `[SYS.MACRO // F1.4 1:1 RESOLUTION // BOTANICAL STIPPLE]`, startX, curY);

        curY += 16;
        ctx.fillStyle = veryDimColor;
        ctx.fillText(`>> ${config.project1.subtext}`, startX, curY);

        if (config.showMacroFrame) {
          ctx.save();
          ctx.strokeStyle = dimColor;
          ctx.lineWidth = 1;
          const bracketX = startX + 420;
          const bracketY = curY - 50;
          const bSize = 16;
          ctx.strokeRect(bracketX - bSize, bracketY - bSize, 6, 1);
          ctx.strokeRect(bracketX - bSize, bracketY - bSize, 1, 6);
          ctx.strokeRect(bracketX + bSize - 6, bracketY - bSize, 6, 1);
          ctx.strokeRect(bracketX + bSize, bracketY - bSize, 1, 6);
          ctx.strokeRect(bracketX - bSize, bracketY + bSize, 6, 1);
          ctx.strokeRect(bracketX - bSize, bracketY + bSize - 6, 1, 6);
          ctx.strokeRect(bracketX + bSize - 6, bracketY + bSize, 6, 1);
          ctx.strokeRect(bracketX + bSize, bracketY + bSize - 6, 1, 6);
          ctx.fillRect(bracketX - 1, bracketY - 1, 2, 2);
          ctx.restore();
        }

        // Mid Section Divider
        curY += 40;
        ctx.strokeStyle = veryDimColor;
        ctx.beginPath();
        ctx.moveTo(startX, curY);
        ctx.lineTo(startX + 440, curY);
        ctx.stroke();

        curY += 30;

        // Project 2
        ctx.font = '200 10px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(`// 02. MODULAR_NODE [${config.project2.category}]`, startX, curY);

        curY += 34;
        ctx.font = '200 36px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText(config.project2.name, startX, curY);

        const title2Width = ctx.measureText(config.project2.name).width;

        if (config.showAudioWave) {
          ctx.save();
          const waveX = startX + title2Width + 24;
          const waveY = curY - 12;
          const waveBars = 22;
          ctx.fillStyle = fgColor;

          for (let b = 0; b < waveBars; b++) {
            const barHeight = Math.abs(Math.sin(b * 0.48) * 16) + Math.cos(b * 0.2) * 6 + 4;
            const barX = waveX + b * 5;
            ctx.fillRect(barX, waveY - barHeight / 2, 2, barHeight);
          }

          ctx.font = '200 9px "Share Tech Mono", monospace';
          ctx.fillStyle = dimColor;
          ctx.fillText('44.1kHz / 24-BIT WAV', waveX + waveBars * 5 + 8, curY - 6);
          ctx.restore();
        }

        curY += 22;
        ctx.font = '200 11px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(config.project2.telemetry || `[AUDIO.DSP // MODULAR SYNTHESIS // 20Hz - 22kHz]`, startX, curY);

        curY += 16;
        ctx.fillStyle = veryDimColor;
        ctx.fillText(`>> ${config.project2.subtext}`, startX, curY);

      } else if (p1Active && !p2Active) {
        // Only Project 1 active: prominent centered layout
        let curY = 150;
        ctx.font = '200 11px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(`// 01. PRIMARY_FOCUS [${config.project1.category}] // CODE: ${config.project1.code}`, startX, curY);

        curY += 42;
        ctx.font = '200 44px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText(config.project1.name, startX, curY);

        const titleWidth = ctx.measureText(config.project1.name).width;
        ctx.font = '100 40px "JetBrains Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText('_', startX + titleWidth + 8, curY);

        curY += 26;
        ctx.font = '200 12px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(config.project1.telemetry, startX, curY);

        curY += 20;
        ctx.font = '200 12px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = veryDimColor;
        ctx.fillText(`>> ${config.project1.subtext}`, startX, curY);

        if (config.showMacroFrame) {
          ctx.save();
          ctx.strokeStyle = dimColor;
          ctx.lineWidth = 1;
          const bracketX = startX + 460;
          const bracketY = curY - 50;
          const bSize = 20;
          ctx.strokeRect(bracketX - bSize, bracketY - bSize, 8, 1);
          ctx.strokeRect(bracketX - bSize, bracketY - bSize, 1, 8);
          ctx.strokeRect(bracketX + bSize - 8, bracketY - bSize, 8, 1);
          ctx.strokeRect(bracketX + bSize, bracketY - bSize, 1, 8);
          ctx.strokeRect(bracketX - bSize, bracketY + bSize, 8, 1);
          ctx.strokeRect(bracketX - bSize, bracketY + bSize - 8, 1, 8);
          ctx.strokeRect(bracketX + bSize - 8, bracketY + bSize, 8, 1);
          ctx.strokeRect(bracketX + bSize, bracketY + bSize - 8, 1, 8);
          ctx.fillRect(bracketX - 1.5, bracketY - 1.5, 3, 3);
          ctx.restore();
        }

      } else if (!p1Active && p2Active) {
        // Only Project 2 active: prominent centered layout
        let curY = 150;
        ctx.font = '200 11px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(`// 01. PRIMARY_DSP_NODE [${config.project2.category}] // CODE: ${config.project2.code}`, startX, curY);

        curY += 42;
        ctx.font = '200 44px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText(config.project2.name, startX, curY);

        const titleWidth = ctx.measureText(config.project2.name).width;

        if (config.showAudioWave) {
          ctx.save();
          const waveX = startX + titleWidth + 28;
          const waveY = curY - 16;
          const waveBars = 30;
          ctx.fillStyle = fgColor;

          for (let b = 0; b < waveBars; b++) {
            const barHeight = Math.abs(Math.sin(b * 0.42) * 22) + Math.cos(b * 0.18) * 8 + 4;
            const barX = waveX + b * 5.5;
            ctx.fillRect(barX, waveY - barHeight / 2, 2.5, barHeight);
          }

          ctx.font = '200 10px "Share Tech Mono", monospace';
          ctx.fillStyle = dimColor;
          ctx.fillText('44.1kHz / 24-BIT HI-RES AUDIO', waveX + waveBars * 5.5 + 10, curY - 10);
          ctx.restore();
        }

        curY += 26;
        ctx.font = '200 12px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(config.project2.telemetry, startX, curY);

        curY += 20;
        ctx.font = '200 12px "JetBrains Mono", "Share Tech Mono", monospace';
        ctx.fillStyle = veryDimColor;
        ctx.fillText(`>> ${config.project2.subtext}`, startX, curY);

      } else {
        // Neither project active: Clean minimalist retro terminal interface
        let curY = 160;
        ctx.font = '200 12px "JetBrains Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText('sys@creative-core:~$ systemctl status visual-nodes', startX, curY);

        curY += 30;
        ctx.font = '200 28px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText('BOTANICAL // DIGITAL VOID', startX, curY);

        curY += 22;
        ctx.font = '200 11px "JetBrains Mono", monospace';
        ctx.fillStyle = dimColor;
        ctx.fillText(`[STANDALONE MONOCHROME AESTHETIC // DITHER: ${config.ditherAlgo.toUpperCase()}]`, startX, curY);

        curY += 16;
        ctx.fillStyle = veryDimColor;
        ctx.fillText('>> Toggle project slots on from the controls below to display custom title & telemetry.', startX, curY);
      }

      // Bottom Status Telemetry Bar
      const bottomY = height - 30;
      ctx.strokeStyle = veryDimColor;
      ctx.beginPath();
      ctx.moveTo(36, bottomY - 14);
      ctx.lineTo(width - 36, bottomY - 14);
      ctx.stroke();

      ctx.font = '200 10px "JetBrains Mono", "Share Tech Mono", monospace';
      ctx.fillStyle = dimColor;
      const statusLeft = `[ONLINE] ${config.statusTag} · MEM: 0x8F40 · DITHER: ${config.ditherAlgo.toUpperCase()}`;
      ctx.fillText(statusLeft, 36, bottomY);

      const statusRight = `CREATIVE STUDIO // RETRO-TERMINAL MONOCHROME`;
      const rightMetrics = ctx.measureText(statusRight);
      ctx.fillText(statusRight, width - rightMetrics.width - 36, bottomY);

      // 5. Terminal ASCII Border Frame
      if (config.showTerminalBorder) {
        ctx.strokeStyle = dimColor;
        ctx.lineWidth = 1;
        const inset = 16;
        ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

        // Corner aesthetic crosses `+`
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = fgColor;
        ctx.fillText('+', inset - 3, inset + 4);
        ctx.fillText('+', width - inset - 3, inset + 4);
        ctx.fillText('+', inset - 3, height - inset + 4);
        ctx.fillText('+', width - inset - 3, height - inset + 4);
      }

      // 6. Ko-fi Profile Avatar Safe Zone Guide Overlay
      if (config.showSafeZoneGuide) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.75)';
        ctx.lineWidth = 1.5;

        // Standard Ko-fi profile avatar placement is bottom-left, overlapping banner
        const avatarCenterX = 96;
        const avatarCenterY = height;
        const avatarRadius = 60;

        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 100, 100, 0.12)';
        ctx.fill();

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
        ctx.fillText('KO-FI AVATAR SAFE ZONE (DO NOT PLACE ESSENTIAL TEXT HERE)', 24, height - 74);
        ctx.restore();
      }

      // 7. CRT Scanlines Overlay
      if (config.showScanlines && !config.invert) {
        ctx.fillStyle = `rgba(0, 0, 0, ${config.scanlineIntensity})`;
        for (let y = 0; y < height; y += 3) {
          ctx.fillRect(0, y, width, 1);
        }
      }

      ctx.restore();

      // Trigger ASCII callback if provided
      if (onAsciiGenerated) {
        const fullImgData = ctx.getImageData(0, 0, width, height);
        const ascii = generateAsciiArt(fullImgData, 80);
        onAsciiGenerated(ascii);
      }
    }, [config, customImageElement, onAsciiGenerated]);

    return (
      <div className="relative w-full flex justify-center items-center overflow-hidden">
        <canvas
          ref={canvasRef}
          id="kofi-banner-canvas"
          className="w-full h-auto max-w-full rounded-sm border border-neutral-800 shadow-2xl transition-all"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    );
  }
);
