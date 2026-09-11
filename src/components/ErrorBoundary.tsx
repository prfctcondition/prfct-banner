import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-neutral-200 flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full bg-neutral-950 border border-red-900/60 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
              <Terminal className="w-5 h-5" />
              <span>TERMINAL KERNEL EXCEPTION</span>
            </div>
            <p className="text-xs text-neutral-400">
              An unexpected error occurred while rendering the retro-terminal canvas interface:
            </p>
            <div className="p-3 bg-black rounded border border-neutral-800 text-[11px] text-red-300 overflow-x-auto select-all">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-mono transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reboot Terminal Interface</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
