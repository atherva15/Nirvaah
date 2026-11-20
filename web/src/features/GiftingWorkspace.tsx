'use client';

import React, { useState } from 'react';
import { ComputedOrder, TaskFilterState } from '../types';
import { formatHours, formatInr } from '../lib/engine';
import ThresholdControls from '../components/ThresholdControls';

interface GiftingWorkspaceProps {
  orders: ComputedOrder[];
  filterState: TaskFilterState;
  onUpdateAmount: (amount: number) => void;
  onUpdateDuration: (hours: number) => void;
  onInspectEvidence: (order: ComputedOrder) => void;
  onInitiateAction: (order: ComputedOrder) => void;
  onResetFilters: () => void;
}

export default function GiftingWorkspace({
  orders,
  filterState,
  onUpdateAmount,
  onUpdateDuration,
  onInspectEvidence,
  onInitiateAction,
  onResetFilters,
}: GiftingWorkspaceProps) {
  const [showFullLedger, setShowFullLedger] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Identify high-priority orders that genuinely need urgent attention
  const urgentOrders = orders.filter(
    (o) => o.followupStatus === 'pending' && (o.advanceStatus === 'unconfirmed' || o.ruleFlagged)
  );
  // Show at most top 3 priority action cards
  const topPriorityItems = urgentOrders.slice(0, 3);

  // Stages for the expandable full ledger
  const stages = [
    { id: 'all', label: 'All Orders', count: orders.length },
    {
      id: 'advance_pending',
      label: 'Advance Pending',
      count: orders.filter((o) => o.advanceStatus === 'unconfirmed').length,
    },
    {
      id: 'artwork_approval',
      label: 'Artwork Review',
      count: orders.filter((o) => o.followupStatus === 'pending' && o.advanceStatus === 'confirmed').length,
    },
    {
      id: 'reviewed',
      label: 'Reviewed / Staged',
      count: orders.filter((o) => o.followupStatus === 'reviewed').length,
    },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStage === 'all') return true;
    if (selectedStage === 'advance_pending') return o.advanceStatus === 'unconfirmed';
    if (selectedStage === 'artwork_approval')
      return o.followupStatus === 'pending' && o.advanceStatus === 'confirmed';
    if (selectedStage === 'reviewed') return o.followupStatus === 'reviewed';
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
              {urgentOrders.length > 0
                ? `${urgentOrders.length} custom hampers require advance payment confirmation`
                : 'All custom orders are on track'}
            </h2>
          </div>
          <div className="text-xs font-mono text-ink-muted bg-porcelain px-3 py-1.5 rounded-xl border border-border shrink-0">
            Cutoff: 6:00 PM Courier Dispatch
          </div>
        </div>

        {/* The "Why" and "What to do next" guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs text-ink-secondary leading-relaxed">
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Why this matters:</span>
            <span>
              Orders exceed the ₹{filterState.amountThresholdInr.toLocaleString('en-IN')} threshold and have
              waited over {filterState.durationThresholdHours} hours without advance verification. Production is
              paused, placing custom delivery commitments at risk.
            </span>
          </div>
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Recommended action:</span>
            <span>
              Verify bank credit for each customer. If received, mark reviewed to release hamper production. If
              unpaid, send WhatsApp payment link before evening dispatch cutoff.
            </span>
          </div>
        </div>

        {/* 2. Top Action Cards (Showing only urgent records first) */}
        {topPriorityItems.length > 0 ? (
          <div className="mt-2 space-y-3">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Priority Action Items ({topPriorityItems.length} of {urgentOrders.length}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topPriorityItems.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl p-4 border border-border hover:border-lavender/50 shadow-2xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-midnight truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral-light text-coral font-bold shrink-0">
                        {order.advanceWaitHours !== null ? `${formatHours(order.advanceWaitHours)} wait` : 'Pending'}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary mb-3 line-clamp-1">
                      {order.itemDescription || `${order.orderId} · Handcrafted Gift Hamper`}
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-3 pb-3 border-b border-border-subtle">
                      <span className="text-ink-muted">Total:</span>
                      <span className="font-mono font-bold text-midnight tabular-nums text-sm">
                        {formatInr(order.totalAmountPaise)}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted mb-4">
                      <span className="font-semibold text-midnight">Rule: </span>
                      {order.ruleReason || 'Advance unconfirmed past 48h cutoff'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onInspectEvidence(order)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-lavender hover:bg-lavender-light border border-lavender/30 transition flex-1 text-center"
                    >
                      Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => onInitiateAction(order)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-lavender hover:bg-lavender-deep transition shadow-xs flex-1 text-center"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-ink-muted bg-porcelain rounded-xl border border-border-subtle">
            All customer orders have confirmed advance deposits. Zero active bottlenecks.
          </div>
        )}
      </section>

      {/* 3. EXPANDABLE TASK-SPECIFIC VIEW: Full Ledger, Pipeline Stages & Sliders */}
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
                ? 'Hide Detailed Order Ledger & Filter Controls'
                : `View Full Order Ledger & Threshold Controls (${orders.length} total orders)`}
            </span>
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {showFullLedger ? 'Click to collapse' : 'Click to expand detailed controls'}
          </span>
        </button>

        {showFullLedger && (
          <div className="p-5 border-t border-border space-y-5 animate-in fade-in duration-150">
            {/* Stage Pipeline Filter Chips */}
            <div>
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                Filter by Production Stage:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStage(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedStage === st.id
                        ? 'border-lavender bg-lavender-light text-lavender-deep font-bold'
                        : 'border-border bg-porcelain/50 hover:bg-porcelain text-ink-secondary'
                    }`}
                  >
                    <div className="text-[11px] text-ink-muted truncate">{st.label}</div>
                    <div className="text-lg font-mono font-bold tabular-nums text-midnight">
                      {st.count}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Controls */}
            <ThresholdControls
              filterState={filterState}
              onUpdateAmount={onUpdateAmount}
              onUpdateDuration={onUpdateDuration}
              matchedCount={filteredOrders.length}
            />

            {/* Full Order Ledger Table */}
            <div className="border border-border rounded-xl overflow-hidden bg-white">
              <div className="p-3 border-b border-border bg-porcelain flex items-center justify-between text-xs">
                <span className="font-semibold text-midnight">
                  Complete Order Ledger ({filteredOrders.length} records)
                </span>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-lavender hover:text-lavender-deep font-semibold underline"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-porcelain text-ink-muted font-semibold uppercase border-b border-border text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Customer &amp; Item</th>
                      <th className="py-2.5 px-3">Total Value</th>
                      <th className="py-2.5 px-3">Advance Status</th>
                      <th className="py-2.5 px-3">Wait Hours</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-porcelain/40 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-midnight">{order.customerName}</div>
                          <div className="text-[10px] text-ink-muted font-mono">{order.orderId}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-midnight tabular-nums">
                          {formatInr(order.totalAmountPaise)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              order.advanceStatus === 'unconfirmed'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {order.advanceStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {order.advanceWaitHours !== null ? `${formatHours(order.advanceWaitHours)}` : '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              order.followupStatus === 'reviewed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.followupStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onInspectEvidence(order)}
                              className="px-2 py-1 text-xs text-lavender hover:bg-lavender-light rounded"
                            >
                              Evidence
                            </button>
                            {order.followupStatus === 'pending' && (
                              <button
                                type="button"
                                onClick={() => onInitiateAction(order)}
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
