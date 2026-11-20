'use client';

import React, { useState } from 'react';
import { WholesaleOrderRecord } from '../types';
import { formatInr } from '../lib/engine';

interface WholesaleWorkspaceProps {
  records: WholesaleOrderRecord[];
  onInspectEvidence: (record: WholesaleOrderRecord) => void;
  onInitiateAction: (record: WholesaleOrderRecord) => void;
  onStatusChange?: (recordId: string, newStatus: 'pending' | 'reviewed') => void;
}

export default function WholesaleWorkspace({
  records,
  onInspectEvidence,
  onInitiateAction,
}: WholesaleWorkspaceProps) {
  const [showFullLedger, setShowFullLedger] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'delayed' | 'pending_supplier' | 'credit_risk'>('all');

  const delayedRecords = records.filter((r) => r.dispatchStatus === 'delayed');
  const supplierPendingRecords = records.filter((r) => !r.supplierConfirmed);
  const creditOverdueRecords = records.filter((r) => r.daysOutstanding > r.creditTermDays);

  const urgentRecords = records.filter(
    (r) => r.followupStatus === 'pending' && (r.dispatchStatus === 'delayed' || !r.supplierConfirmed || r.ruleFlagged)
  );
  const topPriorityItems = urgentRecords.slice(0, 3);

  const totalOutstandingPaise = records.reduce(
    (sum, r) => sum + Math.max(0, r.orderValuePaise - r.paidAmountPaise),
    0
  );

  const filteredRecords = records.filter((r) => {
    if (filterMode === 'delayed') return r.dispatchStatus === 'delayed';
    if (filterMode === 'pending_supplier') return !r.supplierConfirmed;
    if (filterMode === 'credit_risk') return r.daysOutstanding > r.creditTermDays;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. OPERATIONAL ATTENTION DECK: What needs attention, Why, Next Steps */}
      <section className="bg-panel rounded-2xl p-6 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-coral">
                Operational Attention Required
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight tracking-tight">
              {urgentRecords.length > 0
                ? `${urgentRecords.length} bulk retail shipments require logistics and supplier coordination`
                : 'All wholesale dispatches are on schedule'}
            </h2>
          </div>
          <div className="text-xs font-mono text-ink-muted bg-porcelain px-3 py-1.5 rounded-xl border border-border shrink-0">
            Logistics Window: Daily Freight Staging
          </div>
        </div>

        {/* The "Why" and "What to do next" guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs text-ink-secondary leading-relaxed">
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Why this matters:</span>
            <span>
              Major retail accounts have delivery deadlines past due or are blocked by unconfirmed raw material
              suppliers. Holding dispatches jeopardizes retail shelf availability and delays 30-day payment
              collection cycles.
            </span>
          </div>
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Recommended action:</span>
            <span>
              Confirm supplier dispatch readiness for blocked lots. For ready cartons, book freight carrier
              logistics and update dispatch status to prevent retailer penalties.
            </span>
          </div>
        </div>

        {/* 2. Top Action Items (Urgent accounts only) */}
        {topPriorityItems.length > 0 ? (
          <div className="mt-2 space-y-3">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Priority Retailer Actions ({topPriorityItems.length} of {urgentRecords.length}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPriorityItems.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl p-4 border border-border hover:border-lavender/50 shadow-2xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-midnight">
                        {r.retailerName}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          r.dispatchStatus === 'delayed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.dispatchStatus === 'delayed' ? 'Dispatch Delayed' : 'Supplier Unconfirmed'}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary mb-2">
                      {r.itemDescription} ({r.units} units)
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-3 pb-3 border-b border-border-subtle">
                      <span className="text-ink-muted">Order Value:</span>
                      <span className="font-mono font-bold text-midnight tabular-nums text-sm">
                        {formatInr(r.orderValuePaise)}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted mb-4">
                      <span className="font-semibold text-midnight">Bottleneck: </span>
                      {r.ruleReason}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onInspectEvidence(r)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-lavender hover:bg-lavender-light border border-lavender/30 transition flex-1 text-center"
                    >
                      Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => onInitiateAction(r)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-lavender hover:bg-lavender-deep transition shadow-xs flex-1 text-center"
                    >
                      Coordinate Dispatch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-ink-muted bg-porcelain rounded-xl border border-border-subtle">
            All wholesale dispatches confirmed. Zero active logistics blockers.
          </div>
        )}
      </section>

      {/* 3. EXPANDABLE TASK-SPECIFIC VIEW: Full Wholesale Ledger & Metrics */}
      <div className="bg-panel rounded-2xl border border-border shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullLedger(!showFullLedger)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-porcelain/60 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lavender font-bold text-sm">
              {showFullLedger ? '▼' : '▶'}
            </span>
            <span className="font-bold text-sm text-midnight">
              {showFullLedger
                ? 'Hide Wholesale Fulfillment Ledger & Metrics'
                : `View Full Wholesale Fulfillment Ledger & Metrics (${records.length} accounts, ${formatInr(totalOutstandingPaise)} exposure)`}
            </span>
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {showFullLedger ? 'Click to collapse' : 'Click to expand full accounts'}
          </span>
        </button>

        {showFullLedger && (
          <div className="p-5 border-t border-border space-y-5 animate-in fade-in duration-150">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterMode === 'all'
                    ? 'bg-midnight text-white'
                    : 'bg-panel hover:bg-porcelain text-ink-secondary border border-border'
                }`}
              >
                All Accounts ({records.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('delayed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterMode === 'delayed'
                    ? 'bg-danger text-white'
                    : 'bg-panel hover:bg-porcelain text-danger border border-border'
                }`}
              >
                Delayed Dispatches ({delayedRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('pending_supplier')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterMode === 'pending_supplier'
                    ? 'bg-amber-600 text-white'
                    : 'bg-panel hover:bg-porcelain text-amber-800 border border-border'
                }`}
              >
                Supplier Pending ({supplierPendingRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('credit_risk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterMode === 'credit_risk'
                    ? 'bg-coral text-white'
                    : 'bg-panel hover:bg-porcelain text-coral border border-border'
                }`}
              >
                Credit Overdue &gt;30d ({creditOverdueRecords.length})
              </button>
            </div>

            {/* Wholesale Ledger Table */}
            <div className="border border-border rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-porcelain text-ink-muted font-semibold uppercase border-b border-border text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Retailer &amp; Contact</th>
                      <th className="py-2.5 px-3">Units &amp; Lot</th>
                      <th className="py-2.5 px-3">Order Value</th>
                      <th className="py-2.5 px-3">Dispatch Status</th>
                      <th className="py-2.5 px-3">Supplier Staged</th>
                      <th className="py-2.5 px-3">Credit Aging</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-porcelain/40 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-midnight">{r.retailerName}</div>
                          <div className="text-[10px] text-ink-muted">{r.contactPerson}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-semibold">{r.units}</span> units
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-midnight tabular-nums">
                          {formatInr(r.orderValuePaise)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              r.dispatchStatus === 'delayed'
                                ? 'bg-rose-100 text-rose-800'
                                : r.dispatchStatus === 'packed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.dispatchStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {r.supplierConfirmed ? (
                            <span className="text-emerald-700 font-semibold">✓ Ready</span>
                          ) : (
                            <span className="text-amber-800 font-semibold">⚠ Unconfirmed</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.daysOutstanding}d / {r.creditTermDays}d term
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onInspectEvidence(r)}
                              className="px-2 py-1 text-xs text-lavender hover:bg-lavender-light rounded"
                            >
                              Evidence
                            </button>
                            {r.followupStatus === 'pending' && (
                              <button
                                type="button"
                                onClick={() => onInitiateAction(r)}
                                className="px-2.5 py-1 text-xs text-white bg-lavender hover:bg-lavender-deep rounded font-semibold"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
