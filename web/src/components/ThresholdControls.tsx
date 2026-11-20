'use client';

import React from 'react';
import { TaskFilterState } from '../types';

interface ThresholdControlsProps {
  filterState: TaskFilterState;
  onUpdateAmount: (amountInr: number) => void;
  onUpdateDuration: (hours: number) => void;
  matchedCount: number;
}

export default function ThresholdControls({
  filterState,
  onUpdateAmount,
  onUpdateDuration,
  matchedCount,
}: ThresholdControlsProps) {
  const isTriage = filterState.preset === 'triage_queue';

  return (
    <div className="bg-surface-1 rounded-xl p-4 border border-border shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Chips Header & Context */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <svg
              className="w-4 h-4 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            <span>Active Threshold Filters</span>
          </div>

          {/* Fixed Field Chip */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-2 text-text-secondary border border-border">
            <span className="text-text-muted">Interpreted Field:</span>
            <span className="font-semibold text-text-primary">
              {isTriage ? 'Order Total (₹)' : 'Outstanding Balance (₹)'}
            </span>
          </span>

          {/* Fixed Clock Chip */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-2 text-text-secondary border border-border">
            <span className="text-text-muted">Clock:</span>
            <span className="font-semibold text-text-primary">
              {isTriage ? 'Time since advance request' : 'Order age since creation'}
            </span>
          </span>
        </div>

        {/* Counter Badge */}
        <div className="text-xs text-text-secondary">
          Showing <span className="font-bold text-brand tabular-nums font-mono">{matchedCount}</span> validated priority orders
        </div>
      </div>

      {/* Editable Threshold Adjusters */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-6">
        {/* Amount Threshold Editor */}
        <div className="flex items-center gap-2">
          <label htmlFor="amount-input" className="text-xs font-medium text-text-secondary">
            Min Amount:
          </label>
          <div className="flex items-center rounded-lg border border-border bg-surface-0 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateAmount(Math.max(500, filterState.amountThresholdInr - 500))}
              className="px-2 py-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition"
              title="Decrease by ₹500"
            >
              -
            </button>
            <div className="px-2.5 py-1 text-xs font-mono font-semibold text-text-primary tabular-nums">
              ₹{filterState.amountThresholdInr.toLocaleString('en-IN')}
            </div>
            <button
              type="button"
              onClick={() => onUpdateAmount(filterState.amountThresholdInr + 500)}
              className="px-2 py-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition"
              title="Increase by ₹500"
            >
              +
            </button>
          </div>
          <div className="flex gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => onUpdateAmount(2000)}
              className={`px-2 py-0.5 rounded font-mono transition ${
                filterState.amountThresholdInr === 2000
                  ? 'bg-brand text-white font-semibold'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary'
              }`}
            >
              ₹2,000
            </button>
            <button
              type="button"
              onClick={() => onUpdateAmount(5000)}
              className={`px-2 py-0.5 rounded font-mono transition ${
                filterState.amountThresholdInr === 5000
                  ? 'bg-brand text-white font-semibold'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary'
              }`}
            >
              ₹5,000
            </button>
          </div>
        </div>

        {/* Duration Threshold Editor */}
        <div className="flex items-center gap-2">
          <label htmlFor="duration-input" className="text-xs font-medium text-text-secondary">
            Min Elapsed Time:
          </label>
          <div className="flex items-center rounded-lg border border-border bg-surface-0 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => onUpdateDuration(Math.max(12, filterState.durationThresholdHours - 12))}
              className="px-2 py-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition"
              title="Decrease by 12h"
            >
              -
            </button>
            <div className="px-2.5 py-1 text-xs font-mono font-semibold text-text-primary tabular-nums">
              {filterState.durationThresholdHours}h
            </div>
            <button
              type="button"
              onClick={() => onUpdateDuration(filterState.durationThresholdHours + 12)}
              className="px-2 py-1 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition"
              title="Increase by 12h"
            >
              +
            </button>
          </div>
          <div className="flex gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => onUpdateDuration(48)}
              className={`px-2 py-0.5 rounded font-mono transition ${
                filterState.durationThresholdHours === 48
                  ? 'bg-brand text-white font-semibold'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary'
              }`}
            >
              48h
            </button>
            <button
              type="button"
              onClick={() => onUpdateDuration(72)}
              className={`px-2 py-0.5 rounded font-mono transition ${
                filterState.durationThresholdHours === 72
                  ? 'bg-brand text-white font-semibold'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary'
              }`}
            >
              72h
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
