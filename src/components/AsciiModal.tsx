import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

interface AsciiModalProps {
  isOpen: boolean;
  onClose: () => void;
  asciiContent: string;
}

export const AsciiModal: React.FC<AsciiModalProps> = ({ isOpen, onClose, asciiContent }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asciiContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c0c0e] border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/70">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>RAW ASCII TERMINAL MATRIX</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-mono border border-neutral-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY ASCII TEXT'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto flex-1 bg-black font-mono text-[9px] leading-[10px] text-neutral-300 whitespace-pre select-all selection:bg-neutral-800">
          {asciiContent || '// Generating ASCII raster...'}
        </div>

        <div className="px-5 py-2.5 border-t border-neutral-900 bg-neutral-950 flex justify-between items-center text-[11px] font-mono text-neutral-500">
          <span>// Use for GitHub profile, terminal motd, or Ko-fi bio description</span>
          <span>Characters: {asciiContent.length}</span>
        </div>
      </div>
    </div>
  );
};
