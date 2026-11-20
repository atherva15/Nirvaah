'use client';

import React, { useState } from 'react';
import { WorkspacePlan, TaskPreset } from '../types';

interface WorkspaceHeaderProps {
  plan: WorkspacePlan;
  onResetTask: () => void;
  onSwitchPreset: (preset: TaskPreset) => void;
  onReplan: (query: string) => void;
}

export default function WorkspaceHeader({
  plan,
  onResetTask,
  onSwitchPreset,
  onReplan,
}: WorkspaceHeaderProps) {
  const [queryInput, setQueryInput] = useState(plan.query);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onReplan(queryInput.trim());
  };

  const otherPreset: TaskPreset =
    plan.layout === 'triage_queue' ? 'exposure_summary' : 'triage_queue';
  const otherLabel =
    plan.layout === 'triage_queue' ? 'Exposure Summary' : 'Triage Queue';

  return (
    <div className="bg-panel rounded-2xl p-4 sm:p-5 border border-border shadow-xs mb-6">
      {/* Top Bar: Navigation Back & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetTask}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-secondary bg-porcelain hover:bg-porcelain-dim border border-border transition hover:text-ink"
            title="Return to the task selection screen"
          >
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span>Choose different task</span>
          </button>

          {/* Explicit Planner Provenance Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-porcelain text-ink-secondary border border-border"
            title="Generated via typed WorkspacePlan contract. Deterministic demo fallback ready for Gemini planning endpoint."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lavender"></span>
            <span>DETERMINISTIC DEMO PLANNER</span>
          </span>
        </div>

        {/* Quick layout switch (for custom gifting) */}
        {plan.businessCategory === 'custom_gifting' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-muted hidden sm:inline">Switch layout:</span>
            <button
              type="button"
              onClick={() => onSwitchPreset(otherPreset)}
              className="px-2.5 py-1 rounded-lg bg-porcelain hover:bg-porcelain-dim border border-border text-xs font-semibold text-lavender hover:text-lavender-deep transition flex items-center gap-1"
            >
              <span>Switch to {otherLabel}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Task Context Title & Description */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lavender-light text-lavender-deep">
            Active Task View
          </span>
          <span className="text-xs font-mono text-ink-muted">
            Plan ID: {plan.planId}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
          {plan.title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-secondary leading-relaxed">
          {plan.description}
        </p>
      </div>

      {/* Query Bar for In-Context Refinement */}
      <form onSubmit={handleQuerySubmit} className="pt-3 border-t border-border-subtle">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
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
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Refine task request or enter custom parameters..."
              className="w-full pl-9 pr-3 py-2 bg-porcelain border border-border rounded-xl text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-lavender hover:bg-lavender-deep text-white text-xs font-semibold rounded-xl transition shadow-xs shrink-0 flex items-center gap-1"
          >
            <span>Update Task</span>
          </button>
        </div>
      </form>
    </div>
  );
}
