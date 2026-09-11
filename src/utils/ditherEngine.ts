import { DitherAlgorithm } from '../types';

// Standard 8x8 Bayer Matrix normalized to 0..255
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map(row => row.map(v => (v / 64) * 255));

// 4x4 Bayer Matrix
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
].map(row => row.map(v => (v / 16) * 255));

// ASCII density ramp from dark to light
export const ASCII_RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
export const ASCII_RAMP_SHORT = " .:-=+*#%@";

/**
 * Applies contrast and brightness to RGB values
 */
function adjustColor(val: number, contrast: number, brightness: number): number {
  const c = Math.max(0.1, contrast);
  const adjusted = (val - 128) * c + 128 + brightness;
  return Math.max(0, Math.min(255, adjusted));
}

/**
 * Performs client-side dithering on ImageData in-place
 */
export function applyDithering(
  imageData: ImageData,
  algo: DitherAlgorithm,
  scale: number = 1,
  contrast: number = 1.2,
  brightness: number = 0,
  invert: boolean = false
): void {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Convert to grayscale with contrast & brightness applied
  const gray = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = adjustColor(data[idx], contrast, brightness);
      const g = adjustColor(data[idx + 1], contrast, brightness);
      const b = adjustColor(data[idx + 2], contrast, brightness);
      const a = data[idx + 3] / 255;

      // Perceptual luminance weighted
      let luma = 0.299 * r + 0.587 * g + 0.114 * b;
      if (a < 0.1) {
        luma = 0; // Pure black for transparent
      } else {
        luma = luma * a;
      }

      if (invert) {
        luma = 255 - luma;
      }
      gray[y * width + x] = luma;
    }
  }

  // Dithering algorithms
  if (algo === 'bayer8' || algo === 'bayer4') {
    const matrix = algo === 'bayer8' ? BAYER_8X8 : BAYER_4X4;
    const mSize = matrix.length;
    const blockSize = Math.max(1, Math.round(scale));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mx = Math.floor(x / blockSize) % mSize;
        const my = Math.floor(y / blockSize) % mSize;
        const threshold = matrix[my][mx];
        const val = gray[y * width + x];
        const pixelVal = val > threshold ? 255 : 0;

        const idx = (y * width + x) * 4;
        data[idx] = pixelVal;
        data[idx + 1] = pixelVal;
        data[idx + 2] = pixelVal;
        data[idx + 3] = pixelVal > 0 ? 255 : 255;
      }
    }
  } else if (algo === 'floyd-steinberg') {
    // Floyd-Steinberg error diffusion
    const work = new Float32Array(gray);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const oldVal = work[i];
        const newVal = oldVal > 128 ? 255 : 0;
        work[i] = newVal;
        const error = oldVal - newVal;

        if (x + 1 < width) {
          work[i + 1] += (error * 7) / 16;
        }
        if (y + 1 < height) {
          if (x - 1 >= 0) {
            work[i + width - 1] += (error * 3) / 16;
          }
          work[i + width] += (error * 5) / 16;
          if (x + 1 < width) {
            work[i + width + 1] += (error * 1) / 16;
          }
        }

        const idx = i * 4;
        data[idx] = newVal;
        data[idx + 1] = newVal;
        data[idx + 2] = newVal;
        data[idx + 3] = 255;
      }
    }
  } else if (algo === 'atkinson') {
    // Atkinson dithering (Apple Macintosh / HyperCard style)
    const work = new Float32Array(gray);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        const oldVal = work[i];
        const newVal = oldVal > 128 ? 255 : 0;
        work[i] = newVal;
        const error = Math.floor((oldVal - newVal) / 8);

        if (x + 1 < width) work[i + 1] += error;
        if (x + 2 < width) work[i + 2] += error;
        if (y + 1 < height) {
          if (x - 1 >= 0) work[i + width - 1] += error;
          work[i + width] += error;
          if (x + 1 < width) work[i + width + 1] += error;
        }
        if (y + 2 < height) {
          work[i + width * 2] += error;
        }

        const idx = i * 4;
        data[idx] = newVal;
        data[idx + 1] = newVal;
        data[idx + 2] = newVal;
        data[idx + 3] = 255;
      }
    }
  } else if (algo === 'halftone') {
    // Halftone dot screen
    const dotSize = Math.max(3, Math.round(scale * 4));
    for (let y = 0; y < height; y += dotSize) {
      for (let x = 0; x < width; x += dotSize) {
        // Compute average luminance in dot block
        let sum = 0;
        let count = 0;
        for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
          for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
            sum += gray[(y + dy) * width + (x + dx)];
            count++;
          }
        }
        const avg = count > 0 ? sum / count : 0;
        const radius = ((avg / 255) * dotSize) / 1.4;

        // Draw circle in block
        for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
          for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
            const dist = Math.hypot(dx - dotSize / 2, dy - dotSize / 2);
            const isDot = dist <= radius;
            const pVal = isDot ? 255 : 0;
            const idx = ((y + dy) * width + (x + dx)) * 4;
            data[idx] = pVal;
            data[idx + 1] = pVal;
            data[idx + 2] = pVal;
            data[idx + 3] = 255;
          }
        }
      }
    }
  } else {
    // Pure 1-bit threshold or default
    for (let i = 0; i < width * height; i++) {
      const pVal = gray[i] > 128 ? 255 : 0;
      const idx = i * 4;
      data[idx] = pVal;
      data[idx + 1] = pVal;
      data[idx + 2] = pVal;
      data[idx + 3] = 255;
    }
  }
}

/**
 * Generates an ASCII text representation of an image
 */
export function generateAsciiArt(
  imageData: ImageData,
  cols: number = 80,
  ramp: string = ASCII_RAMP_SHORT
): string {
  const { width, height, data } = imageData;
  const blockW = width / cols;
  const blockH = blockW * 1.8; // monospace character height ratio
  const rows = Math.floor(height / blockH);

  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    let line = '';
    const y0 = Math.floor(r * blockH);
    const y1 = Math.min(height, Math.floor((r + 1) * blockH));

    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(c * blockW);
      const x1 = Math.min(width, Math.floor((c + 1) * blockW));

      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * width + x) * 4;
          const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          sum += luma;
          count++;
        }
      }
      const avg = count > 0 ? sum / count : 0;
      const charIndex = Math.min(
        ramp.length - 1,
        Math.floor((avg / 255) * ramp.length)
      );
      line += ramp[charIndex];
    }
    lines.push(line);
  }

  return lines.join('\n');
}
