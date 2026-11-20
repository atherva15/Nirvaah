'use client';

import React from 'react';
import { TaskPreset } from '../types';

interface AppShellProps {
  currentPreset: TaskPreset;
  onSelectPreset: (preset: TaskPreset) => void;
  children: React.ReactNode;
}

export default function AppShell({
  currentPreset,
  onSelectPreset,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-0 text-text-primary">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface-1/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Wordmark */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-xs">
                  {/* Clean SVG Mark */}
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-text-primary">
                    NIRVAAH
                  </span>
                  <span className="hidden sm:inline-block ml-2 text-xs font-medium text-text-muted">
                    Operations Cockpit
                  </span>
                </div>
              </div>

              {/* Workspace Badge */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 text-xs text-text-secondary border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                <span>Ananya Apparel &amp; Crafts</span>
              </div>
            </div>

            {/* Badges: Source Mode & Demo Clock (BR-15 & P-02) */}
            <div className="flex items-center gap-2.5">
              {/* Source Honesty Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                title="Clearly labelled synthetic demonstration data. Offline verified."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="tracking-wide uppercase text-[10px] font-semibold">
                  SYNTHETIC DEMO
                </span>
              </div>

              {/* Pinned Clock Badge */}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-2 text-text-secondary border border-border"
                title="NIRVAAH_NOW fixed clock for deterministic verification"
              >
                <svg
                  className="w-3.5 h-3.5 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span>Demo Clock: 20 Nov, 6:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Preset Navigation Tabs */}
          <nav
            aria-label="Workspace views"
            className="flex space-x-1 sm:space-x-4 border-t border-border pt-1"
          >
            <button
              type="button"
              onClick={() => onSelectPreset('triage_queue')}
              className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                currentPreset === 'triage_queue'
                  ? 'border-brand text-brand font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <span>Triage Queue</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-brand-light text-brand font-mono font-medium">
                P0
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPreset('exposure_summary')}
              className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                currentPreset === 'exposure_summary'
                  ? 'border-brand text-brand font-semibold'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>
              <span>Exposure Summary</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-surface-2 text-text-secondary font-mono font-medium">
                P0
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer / Integrity Notice */}
      <footer className="border-t border-border bg-surface-1 py-4 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Nirvaah by Team Vistaar · Startup Buildathon India 2026
          </div>
          <div className="flex items-center gap-4 text-text-secondary">
            <span>Deterministic Math Engine</span>
            <span>·</span>
            <span>Zero Autonomous Writes</span>
            <span>·</span>
            <span>Explicit Human Review</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
