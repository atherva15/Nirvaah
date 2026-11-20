'use client';

import React, { useState } from 'react';
import { ComputedOrder, PaymentStatus } from '../types';
import { formatInr } from '../lib/engine';

interface ExposureSummaryProps {
  orders: ComputedOrder[];
  onInspectEvidence: (order: ComputedOrder) => void;
  onInitiateAction: (order: ComputedOrder) => void;
  onResetFilters: () => void;
}

export default function ExposureSummary({
  orders,
  onInspectEvidence,
  onInitiateAction,
  onResetFilters,
}: ExposureSummaryProps) {
  const [showGroupedQueues, setShowGroupedQueues] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Unpaid & partially paid orders sorted by highest outstanding balance
  const exposureOrders = orders
    .filter((o) => o.outstandingPaise > 0)
    .sort((a, b) => b.outstandingPaise - a.outstandingPaise);

  const topPriorityItems = exposureOrders.slice(0, 3);
  const totalOutstandingPaise = orders.reduce((sum, o) => sum + o.outstandingPaise, 0);

  // Group orders by paymentStatus
  const groups: Record<PaymentStatus, ComputedOrder[]> = {
    unpaid: orders.filter((o) => o.paymentStatus === 'unpaid'),
    partially_paid: orders.filter((o) => o.paymentStatus === 'partially_paid'),
    paid: orders.filter((o) => o.paymentStatus === 'paid'),
    unknown: orders.filter((o) => o.paymentStatus === 'unknown'),
  };

  const groupConfigs: {
    status: PaymentStatus;
    title: string;
    description: string;
    badgeClass: string;
  }[] = [
    {
      status: 'unpaid',
      title: 'Zero Payment Received',
      description: 'Full order total outstanding. Immediate collection priority.',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      status: 'partially_paid',
      title: 'Partially Paid (Advance Captured)',
      description: 'Remaining delivery balance pending final dispatch and settlement.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      status: 'paid',
      title: 'Fully Paid (Zero Exposure)',
      description: 'Completed payments verified in source.',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ];

  if (orders.length === 0) {
    return (
      <div className="bg-panel rounded-2xl p-12 border border-border text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-porcelain text-ink-muted flex items-center justify-center mx-auto mb-3 text-lg font-bold">
          ✓
        </div>
        <h3 className="text-base font-bold text-midnight mb-1">
          No Outstanding Payment Exposure
        </h3>
        <p className="text-sm text-ink-secondary max-w-sm mx-auto mb-4">
          All orders have completed payments or balances below the filter threshold.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 bg-porcelain hover:bg-porcelain-dim text-midnight text-xs font-semibold rounded-xl border border-border transition"
        >
          Reset to Exposure Preset (₹5,000 / 72h)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. OPERATIONAL ATTENTION DECK: What needs attention, Why, Next Steps */}
      <section className="bg-panel rounded-2xl p-6 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-coral">
                Receivables &amp; Cash Flow Attention
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight tracking-tight">
              {formatInr(totalOutstandingPaise)} across {exposureOrders.length} customer orders pending settlement
            </h2>
          </div>
          <div className="text-xs font-mono text-ink-muted bg-porcelain px-3 py-1.5 rounded-xl border border-border shrink-0">
            Aging Window: &gt;72h Settlement
          </div>
        </div>

        {/* The "Why" and "What to do next" guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs text-ink-secondary leading-relaxed">
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Why this matters:</span>
            <span>
              Orders exceed the ₹5,000 receivables threshold and have aged over 72 hours. Holding unpaid balances
              ties up working capital needed for raw materials and courier fulfillment.
            </span>
          </div>
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Recommended action:</span>
            <span>
              Issue digital payment links for unpaid orders before packaging. For partially paid orders, confirm
              COD terms or collect balance before evening dispatch handover.
            </span>
          </div>
        </div>

        {/* 2. Top Action Items (Highest balance orders first) */}
        {topPriorityItems.length > 0 ? (
          <div className="mt-2 space-y-3">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Highest Exposure Orders ({topPriorityItems.length} of {exposureOrders.length}):
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
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold shrink-0">
                        {order.paymentStatus === 'unpaid' ? 'Unpaid' : 'Partially Paid'}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary mb-3 line-clamp-1">
                      {order.itemDescription || `${order.orderId} · Custom Hamper`}
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-3 pb-3 border-b border-border-subtle">
                      <span className="text-ink-muted">Due Balance:</span>
                      <span className="font-mono font-bold text-coral tabular-nums text-sm">
                        {formatInr(order.outstandingPaise)}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted mb-4">
                      <span className="font-semibold text-midnight">Aging: </span>
                      {order.orderAgeHours} hours elapsed
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
                      Follow up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-ink-muted bg-porcelain rounded-xl border border-border-subtle">
            All customer receivables are fully settled. Zero unpaid exposure.
          </div>
        )}
      </section>

      {/* 3. EXPANDABLE TASK-SPECIFIC VIEW: Grouped Queues (Unpaid, Partially Paid, Paid) */}
      <div className="bg-panel rounded-2xl border border-border shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGroupedQueues(!showGroupedQueues)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-porcelain/60 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lavender font-bold text-sm">
              {showGroupedQueues ? '▼' : '▶'}
            </span>
            <span className="font-bold text-sm text-midnight">
              {showGroupedQueues
                ? 'Hide Grouped Payment Queues'
                : `View All Grouped Payment Queues & Breakdown (${orders.length} total orders)`}
            </span>
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {showGroupedQueues ? 'Click to collapse' : 'Click to expand grouped queues'}
          </span>
        </button>

        {showGroupedQueues && (
          <div className="p-5 border-t border-border space-y-4 animate-in fade-in duration-150">
            {groupConfigs.map(({ status, title, description, badgeClass }) => {
              const groupOrders = groups[status];
              if (groupOrders.length === 0) return null;

              const groupOutstandingPaise = groupOrders.reduce(
                (sum, o) => sum + o.outstandingPaise,
                0
              );
              const isCollapsed = !!collapsedGroups[status];

              return (
                <div
                  key={status}
                  className="bg-white rounded-xl border border-border overflow-hidden shadow-2xs"
                >
                  <div
                    onClick={() => toggleGroup(status)}
                    className="p-3.5 bg-porcelain hover:bg-porcelain-dim cursor-pointer flex items-center justify-between border-b border-border transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-ink-muted text-xs font-bold">
                        {isCollapsed ? '▶' : '▼'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-midnight">{title}</h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${badgeClass}`}>
                            {groupOrders.length} {groupOrders.length === 1 ? 'order' : 'orders'}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted mt-0.5">{description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-ink-muted block">
                        Subtotal Due:
                      </span>
                      <span className="text-xs font-bold font-mono text-coral tabular-nums">
                        {formatInr(groupOutstandingPaise)}
                      </span>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="divide-y divide-border-subtle">
                      {groupOrders.map((order) => (
                        <div
                          key={order.orderId}
                          className="p-3.5 hover:bg-porcelain/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-midnight">{order.customerName}</span>
                              <span className="font-mono text-[10px] text-ink-muted">
                                {order.orderId}
                              </span>
                            </div>
                            <div className="text-ink-muted text-[11px] mt-0.5 truncate">
                              {order.itemDescription || `${order.orderId} · Custom Hamper`}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 sm:text-right shrink-0">
                            <div>
                              <div className="text-[10px] text-ink-muted">Total / Balance</div>
                              <div className="font-mono font-bold text-midnight tabular-nums">
                                {formatInr(order.totalAmountPaise)}{' '}
                                <span className="text-coral">({formatInr(order.outstandingPaise)} due)</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
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
                                  Follow up
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
