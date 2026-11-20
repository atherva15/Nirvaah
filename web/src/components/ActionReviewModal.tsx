'use client';

import React, { useState } from 'react';
import { ComputedOrder, ActionReceipt } from '../types';

interface ActionReviewModalProps {
  order: ComputedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveSuccess: (orderId: string, receipt: ActionReceipt) => void;
}

export default function ActionReviewModal({
  order,
  isOpen,
  onClose,
  onApproveSuccess,
}: ActionReviewModalProps) {
  const [applying, setApplying] = useState(false);
  const [receipt, setReceipt] = useState<ActionReceipt | null>(null);

  if (!isOpen || !order) return null;

  const handleApprove = () => {
    setApplying(true);

    // Simulate safe server action execution boundary
    // Pre-check -> Claim single-use actionId -> Update allowlisted cell -> Re-read -> Receipt
    setTimeout(() => {
      const generatedReceipt: ActionReceipt = {
        receiptId: `RCP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        orderId: order.orderId,
        targetField: 'followup_status',
        previousValue: 'pending',
        confirmedValue: 'reviewed',
        actor: 'Authorized Presenter Session',
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        }),
        sourceRef: order.sourceRef,
        integrityStatement:
          'Verified single-field metadata update. Source re-read confirmed. Zero customer messages sent; zero payments altered.',
      };

      setApplying(false);
      setReceipt(generatedReceipt);
      onApproveSuccess(order.orderId, generatedReceipt);
    }, 700);
  };

  const handleDone = () => {
    setReceipt(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-review-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={receipt ? handleDone : onClose}
        className="fixed inset-0 bg-text-primary/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface-1 rounded-2xl shadow-2xl border border-border p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        {!receipt ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand"></span>
                <h2
                  id="action-review-title"
                  className="text-base font-bold text-text-primary tracking-tight"
                >
                  Review Proposed Change
                </h2>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-2 text-text-secondary">
                SAFE ACTION BOUNDARY
              </span>
            </div>

            {/* Target & Scope Details */}
            <div className="py-4 space-y-4">
              <div className="p-3 rounded-xl bg-surface-0 border border-border">
                <div className="text-xs text-text-muted mb-1">Target Order:</div>
                <div className="text-sm font-semibold text-text-primary flex items-center justify-between">
                  <span>{order.orderId} · {order.customerName}</span>
                  <span className="text-xs font-mono text-text-muted">
                    {order.sourceRef}
                  </span>
                </div>
              </div>

              {/* Exact Before / After Diff */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Target Field: <code className="text-text-primary font-mono font-bold">followup_status</code>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-lg border border-border bg-surface-0">
                    <div className="text-[11px] text-text-muted mb-1 font-mono uppercase">
                      Current Value
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-semibold">
                      pending
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-brand/40 bg-brand-light/30">
                    <div className="text-[11px] text-brand mb-1 font-mono uppercase font-semibold">
                      Proposed Value
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-semibold">
                      reviewed
                    </span>
                  </div>
                </div>
              </div>

              {/* Consequence Statement (BR-12 & PRD) */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex gap-2.5 items-start">
                <svg
                  className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                <div>
                  <span className="font-semibold">Operator Consequence: </span>
                  This marks the record internally reviewed. It does not send a customer message or alter payment amounts.
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={applying}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-2 transition"
              >
                Cancel (No Write)
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={applying}
                className="px-5 py-2 bg-brand hover:bg-brand-deep text-white text-sm font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                {applying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Verifying Source...</span>
                  </>
                ) : (
                  <>
                    <span>Approve Update</span>
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
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Succeeded State / Verified Action Receipt */
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-border text-emerald-800">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  Action Executed &amp; Verified
                </h2>
                <span className="text-xs font-mono text-emerald-700">
                  {receipt.receiptId}
                </span>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-surface-0 border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Target Record:</span>
                  <span className="font-semibold text-text-primary font-mono">{receipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Field Changed:</span>
                  <span className="font-mono font-semibold text-text-primary">{receipt.targetField}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Confirmed Value:</span>
                  <span className="font-mono font-bold text-emerald-700">{receipt.confirmedValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Source Coordinate:</span>
                  <span className="font-mono text-text-secondary">{receipt.sourceRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Operator:</span>
                  <span className="text-text-secondary">{receipt.actor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Confirmed Time:</span>
                  <span className="font-mono text-text-secondary">{receipt.timestamp}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <div className="font-semibold mb-0.5">Audit Integrity Statement</div>
                <p className="text-[11px] leading-relaxed text-emerald-950">
                  {receipt.integrityStatement}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={handleDone}
                className="px-5 py-2 bg-text-primary hover:bg-black text-white text-sm font-semibold rounded-lg transition shadow-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
