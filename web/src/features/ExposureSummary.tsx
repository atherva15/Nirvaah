'use client';

import React, { useState } from 'react';
import { ComputedOrder, PaymentStatus } from '../types';
import { formatHours, formatInr } from '../lib/engine';

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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

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
      description: 'Full order total outstanding. High exposure risk.',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      status: 'partially_paid',
      title: 'Partially Paid (Advance Received)',
      description: 'Advance captured, remaining balance pending delivery or settlement.',
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
      <div className="bg-surface-1 rounded-2xl p-12 border border-border text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-surface-2 text-text-muted flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1">
          No Orders Exceed Exposure Threshold
        </h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-4">
          All orders have outstanding balances below the current threshold or order creation ages below the window.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 bg-surface-2 hover:bg-border text-text-primary text-xs font-semibold rounded-lg transition"
        >
          Reset to Exposure Preset (₹5,000 / 72h)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Exposure Header Description */}
      <div className="bg-surface-1 rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-text-primary">
            Exposure Summary (Grouped Queue)
          </h2>
          <p className="text-xs text-text-secondary">
            Structural grouping by payment status with aggregated balance calculations. Newest orders first.
          </p>
        </div>
        <div className="text-xs font-mono text-text-muted">
          Grouped by: <span className="font-semibold text-text-primary">payment_status</span>
        </div>
      </div>

      {/* Grouped Accordions */}
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
            className="bg-surface-1 rounded-xl border border-border overflow-hidden shadow-xs"
          >
            {/* Group Header Banner */}
            <div
              onClick={() => toggleGroup(status)}
              className="p-4 bg-surface-0 hover:bg-surface-2/60 cursor-pointer flex items-center justify-between border-b border-border transition select-none"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary transition"
                  aria-label={`Toggle ${title}`}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      {title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}
                    >
                      {groupOrders.length} {groupOrders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{description}</p>
                </div>
              </div>

              {/* Group Sub-total */}
              <div className="text-right">
                <div className="text-xs text-text-muted">Group Outstanding:</div>
                <div className="text-sm font-bold text-brand tabular-nums font-mono">
                  {formatInr(groupOutstandingPaise)}
                </div>
              </div>
            </div>

            {/* Group Items Table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-1 text-xs uppercase font-semibold text-text-secondary border-b border-border">
                    <tr>
                      <th scope="col" className="py-2.5 px-4">Order ID &amp; Customer</th>
                      <th scope="col" className="py-2.5 px-4">Created Age</th>
                      <th scope="col" className="py-2.5 px-4">Order Value</th>
                      <th scope="col" className="py-2.5 px-4">Outstanding</th>
                      <th scope="col" className="py-2.5 px-4">Follow-up</th>
                      <th scope="col" className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {groupOrders.map((order) => (
                      <tr
                        key={order.orderId}
                        className={`hover:bg-surface-0/60 transition ${
                          order.followupStatus === 'reviewed'
                            ? 'bg-surface-0/40 opacity-75'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-text-primary">
                            {order.customerName}
                          </div>
                          <div className="text-xs font-mono text-text-muted">
                            {order.orderId} · {order.sourceRef}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs font-mono text-text-secondary">
                          {formatHours(order.orderAgeHours)} old
                        </td>

                        <td className="py-3 px-4 font-mono text-text-primary tabular-nums">
                          {formatInr(order.totalAmountPaise)}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-brand tabular-nums">
                          {formatInr(order.outstandingPaise)}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${
                              order.followupStatus === 'reviewed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-2 text-text-secondary'
                            }`}
                          >
                            {order.followupStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onInspectEvidence(order)}
                              className="px-2 py-1 text-xs rounded border border-border hover:bg-surface-2 text-text-secondary transition"
                            >
                              Why?
                            </button>
                            <button
                              type="button"
                              disabled={order.followupStatus === 'reviewed'}
                              onClick={() => onInitiateAction(order)}
                              className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                                order.followupStatus === 'reviewed'
                                  ? 'bg-surface-2 text-text-muted cursor-default'
                                  : 'bg-brand hover:bg-brand-deep text-white'
                              }`}
                            >
                              {order.followupStatus === 'reviewed' ? 'Reviewed' : 'Review'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
