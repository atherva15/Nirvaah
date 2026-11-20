'use client';

import React, { useState } from 'react';
import { TaskPreset } from '../types';

interface TaskInputProps {
  currentPreset: TaskPreset;
  onSelectPreset: (preset: TaskPreset) => void;
  onApplyCustomQuery?: (amountInr: number, durationHours: number, preset: TaskPreset) => void;
}

export default function TaskInput({
  currentPreset,
  onSelectPreset,
  onApplyCustomQuery,
}: TaskInputProps) {
  const [queryText, setQueryText] = useState('');
  const [parsedFeedback, setParsedFeedback] = useState<string | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryText.trim().toLowerCase();
    if (!trimmed) return;

    // Deterministic parsing of numbers from natural query
    // Example: "orders above 5000 older than 72h" or "orders above 2000 over 48h"
    const amountMatch = trimmed.match(/(\d[\d,]*)/);
    const hoursMatch = trimmed.match(/(\d+)\s*(?:h|hour|hours)/);

    let amount = 2000;
    let duration = 48;
    let targetPreset: TaskPreset = 'triage_queue';

    if (amountMatch) {
      const parsedAmount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        amount = parsedAmount;
      }
    }

    if (hoursMatch) {
      const parsedHours = parseInt(hoursMatch[1], 10);
      if (!isNaN(parsedHours) && parsedHours > 0) {
        duration = parsedHours;
      }
    }

    if (trimmed.includes('outstanding') || trimmed.includes('exposure') || amount >= 5000) {
      targetPreset = 'exposure_summary';
    }

    setParsedFeedback(
      `Interpreted: ${targetPreset === 'triage_queue' ? 'Triage Queue' : 'Exposure Summary'} with ₹${amount.toLocaleString('en-IN')} and ${duration}h duration`
    );

    if (onApplyCustomQuery) {
      onApplyCustomQuery(amount, duration, targetPreset);
    } else {
      onSelectPreset(targetPreset);
    }
  };

  const handleApplyExample = (text: string, amount: number, duration: number, preset: TaskPreset) => {
    setQueryText(text);
    setParsedFeedback(`Interpreted: ${preset === 'triage_queue' ? 'Triage Queue' : 'Exposure Summary'} (₹${amount.toLocaleString('en-IN')}, ${duration}h)`);
    if (onApplyCustomQuery) {
      onApplyCustomQuery(amount, duration, preset);
    } else {
      onSelectPreset(preset);
    }
  };

  return (
    <div className="bg-surface-1 rounded-xl p-5 border border-border shadow-xs mb-6">
      {/* Query Bar */}
      <form onSubmit={handleQuerySubmit} className="mb-4">
        <label
          htmlFor="task-query-input"
          className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2"
        >
          Adaptive Task Planner
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <input
              id="task-query-input"
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Ask Nirvaah what needs attention... (e.g. Show custom orders above ₹2,000 with unconfirmed advance over 48h)"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-0 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand hover:bg-brand-deep text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <span>Run Task</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
        {parsedFeedback && (
          <p className="mt-2 text-xs text-brand font-medium flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            <span>{parsedFeedback}</span>
          </p>
        )}
      </form>

      {/* Zero-Prompt Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border">
        {/* Preset A: Triage Queue */}
        <div
          onClick={() =>
            handleApplyExample(
              'Show custom orders above ₹2,000 with unconfirmed advance over 48h, oldest first',
              2000,
              48,
              'triage_queue'
            )
          }
          className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left ${
            currentPreset === 'triage_queue'
              ? 'border-brand bg-brand-light/40 ring-1 ring-brand'
              : 'border-border bg-surface-0 hover:border-brand/40 hover:bg-surface-1'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <h3 className="text-sm font-semibold text-text-primary">
                Triage Queue (Advance Follow-up)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-text-secondary font-medium">
              Zero-Prompt Preset 1
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-2">
            Find custom orders waiting on unconfirmed advance payment to prioritize 6 PM shop closing follow-ups.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Field: Order total &gt; ₹2,000
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Clock: Advance wait &gt; 48h
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Sort: Oldest request
            </span>
          </div>
        </div>

        {/* Preset B: Exposure Summary */}
        <div
          onClick={() =>
            handleApplyExample(
              'Show orders with more than ₹5,000 outstanding created over 72 hours ago, grouped by payment status',
              5000,
              72,
              'exposure_summary'
            )
          }
          className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left ${
            currentPreset === 'exposure_summary'
              ? 'border-brand bg-brand-light/40 ring-1 ring-brand'
              : 'border-border bg-surface-0 hover:border-brand/40 hover:bg-surface-1'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h3 className="text-sm font-semibold text-text-primary">
                Exposure Summary (Unpaid Balance)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 text-text-secondary font-medium">
              Zero-Prompt Preset 2
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-2">
            Examine high-value outstanding amounts across all orders, grouped by payment status.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Field: Outstanding &gt; ₹5,000
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Clock: Order age &gt; 72h
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-border text-text-secondary">
              Group: Payment status
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
