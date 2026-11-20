'use client';

import React, { useEffect } from 'react';
import { ComputedOrder } from '../types';
import { formatDateTime, formatHours, formatInr } from '../lib/engine';

interface EvidenceDrawerProps {
  order: ComputedOrder | null;
  onClose: () => void;
  onInitiateAction: (order: ComputedOrder) => void;
}

export default function EvidenceDrawer({
  order,
  onClose,
  onInitiateAction,
}: EvidenceDrawerProps) {
  // Trap escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-lens-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-1 shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand text-white font-semibold">
                  EVIDENCE LENS
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {order.sourceRef}
                </span>
              </div>
              <h2
                id="evidence-lens-title"
                className="text-lg font-bold text-text-primary tracking-tight"
              >
                {order.orderId} · {order.customerName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition"
              aria-label="Close evidence drawer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Rule Justification Box */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                  !
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wide">
                  Rule Trigger: {order.ruleId}
                </span>
              </div>
              <p className="text-sm text-amber-950 font-medium">
                {order.ruleReason}
              </p>
              <div className="mt-2 text-xs text-amber-900/80 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
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
                <span>Calculated via deterministic rule engine. No AI hallucination.</span>
              </div>
            </div>

            {/* Financial Ledger Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Financial Breakdown (Integer Paise)
              </h3>
              <div className="rounded-xl border border-border bg-surface-0 overflow-hidden divide-y divide-border">
                <div className="p-3 flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Order Total:</span>
                  <span className="font-semibold text-text-primary tabular-nums font-mono">
                    {formatInr(order.totalAmountPaise)}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Amount Paid:</span>
                  <span className="font-semibold text-text-primary tabular-nums font-mono">
                    {formatInr(order.paidAmountPaise)}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center text-sm bg-surface-1">
                  <span className="font-medium text-text-primary">
                    Outstanding Balance:
                  </span>
                  <span className="font-bold text-brand tabular-nums font-mono text-base">
                    {formatInr(order.outstandingPaise)}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center text-xs">
                  <span className="text-text-muted">Payment Status:</span>
                  <span className="capitalize font-medium text-text-secondary">
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center text-xs">
                  <span className="text-text-muted">Advance Status:</span>
                  <span className={`capitalize font-semibold ${
                    order.advanceStatus === 'unconfirmed'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}>
                    {order.advanceStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Timing & Clock Verification Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Timing &amp; Clock Provenance
              </h3>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-border bg-surface-0">
                  <div className="flex justify-between items-center text-xs text-text-muted mb-1">
                    <span>Order Created:</span>
                    <span className="font-mono text-text-primary">
                      {formatHours(order.orderAgeHours)} ago
                    </span>
                  </div>
                  <div className="text-xs font-medium text-text-primary">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-0">
                  <div className="flex justify-between items-center text-xs text-text-muted mb-1">
                    <span>Advance Requested:</span>
                    <span className="font-mono text-text-primary font-semibold">
                      {order.advanceWaitHours !== null
                        ? `${formatHours(order.advanceWaitHours)} wait`
                        : 'No request recorded'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-text-primary">
                    {formatDateTime(order.advanceRequestedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Source Truth & Integrity */}
            <div className="p-3.5 rounded-xl border border-border bg-surface-2 text-xs text-text-secondary space-y-1">
              <div className="font-semibold text-text-primary">
                Source Row Reference
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                Source ID: {order.sourceId}
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                Row Coordinates: {order.sourceRef}
              </div>
              <div className="text-[11px] text-text-muted pt-1 border-t border-border mt-1">
                Integrity: Stable ID checked · Plaintext ISO-8601 offset parsed · Nonnegative paise validated
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-border bg-surface-0 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-2 transition"
            >
              Close
            </button>
            <button
              type="button"
              disabled={order.followupStatus === 'reviewed'}
              onClick={() => onInitiateAction(order)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-xs flex items-center justify-center gap-1.5 ${
                order.followupStatus === 'reviewed'
                  ? 'bg-surface-2 text-text-muted cursor-not-allowed border border-border'
                  : 'bg-brand hover:bg-brand-deep text-white'
              }`}
            >
              <span>{order.followupStatus === 'reviewed' ? 'Already Reviewed' : 'Review Change'}</span>
              {order.followupStatus !== 'reviewed' && (
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
