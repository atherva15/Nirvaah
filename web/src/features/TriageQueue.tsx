'use client';

import React from 'react';
import { ComputedOrder } from '../types';
import { formatHours, formatInr } from '../lib/engine';

interface TriageQueueProps {
  orders: ComputedOrder[];
  onInspectEvidence: (order: ComputedOrder) => void;
  onInitiateAction: (order: ComputedOrder) => void;
  onResetFilters: () => void;
}

export default function TriageQueue({
  orders,
  onInspectEvidence,
  onInitiateAction,
  onResetFilters,
}: TriageQueueProps) {
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
          No Orders Match Active Thresholds
        </h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto mb-4">
          All orders in this source are within acceptable advance wait limits or have completed deposit confirmation.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 bg-surface-2 hover:bg-border text-text-primary text-xs font-semibold rounded-lg transition"
        >
          Reset to Default (₹2,000 / 48h)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 rounded-xl border border-border shadow-xs overflow-hidden">
      {/* Table Header Description */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-0">
        <div>
          <h2 className="text-sm font-bold text-text-primary">
            Triage Priority Queue
          </h2>
          <p className="text-xs text-text-secondary">
            Custom orders requiring advance deposit confirmation before 6 PM closing. Oldest requests first.
          </p>
        </div>
        <div className="text-xs text-text-muted font-mono">
          Sorted by: <span className="font-semibold text-text-primary">advance_requested_at ASC</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase font-semibold text-text-secondary border-b border-border">
            <tr>
              <th scope="col" className="py-3 px-4">Order &amp; Customer</th>
              <th scope="col" className="py-3 px-4">Order Value</th>
              <th scope="col" className="py-3 px-4">Paid / Balance</th>
              <th scope="col" className="py-3 px-4">Advance Status</th>
              <th scope="col" className="py-3 px-4">Wait Duration</th>
              <th scope="col" className="py-3 px-4">Follow-up</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className={`hover:bg-surface-0/60 transition ${
                  order.followupStatus === 'reviewed' ? 'bg-surface-0/40 opacity-75' : ''
                }`}
              >
                {/* Order & Customer */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-text-primary">
                    {order.customerName}
                  </div>
                  <div className="text-xs font-mono text-text-muted">
                    {order.orderId} · {order.sourceRef}
                  </div>
                </td>

                {/* Total Value */}
                <td className="py-3.5 px-4 font-mono font-semibold text-text-primary tabular-nums">
                  {formatInr(order.totalAmountPaise)}
                </td>

                {/* Paid / Outstanding */}
                <td className="py-3.5 px-4">
                  <div className="text-xs text-text-secondary tabular-nums font-mono">
                    Paid: {formatInr(order.paidAmountPaise)}
                  </div>
                  <div className="text-xs font-bold text-brand tabular-nums font-mono">
                    Due: {formatInr(order.outstandingPaise)}
                  </div>
                </td>

                {/* Advance Status */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    <span>unconfirmed</span>
                  </span>
                </td>

                {/* Advance Wait Duration */}
                <td className="py-3.5 px-4">
                  <div className="font-mono text-xs font-semibold text-text-primary">
                    {order.advanceWaitHours !== null
                      ? `${formatHours(order.advanceWaitHours)} wait`
                      : 'Unknown'}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    clock: advance request
                  </div>
                </td>

                {/* Follow-up Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                      order.followupStatus === 'reviewed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-surface-2 text-text-secondary border border-border'
                    }`}
                  >
                    {order.followupStatus === 'reviewed' ? 'reviewed' : 'pending'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onInspectEvidence(order)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-2 hover:bg-border transition"
                      title="Inspect calculation justification"
                    >
                      Why?
                    </button>

                    <button
                      type="button"
                      disabled={order.followupStatus === 'reviewed'}
                      onClick={() => onInitiateAction(order)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition shadow-2xs ${
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

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {orders.map((order) => (
          <div key={order.orderId} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-text-primary">
                  {order.customerName}
                </div>
                <div className="text-xs font-mono text-text-muted">
                  {order.orderId}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                unconfirmed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-surface-0 p-2.5 rounded-lg border border-border">
              <div>
                <span className="text-text-muted block">Order Total:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {formatInr(order.totalAmountPaise)}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Wait Duration:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {order.advanceWaitHours !== null ? `${formatHours(order.advanceWaitHours)} wait` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded ${
                  order.followupStatus === 'reviewed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface-2 text-text-secondary'
                }`}
              >
                {order.followupStatus}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onInspectEvidence(order)}
                  className="px-2.5 py-1 text-xs border border-border rounded-md text-text-secondary"
                >
                  Why?
                </button>
                <button
                  type="button"
                  disabled={order.followupStatus === 'reviewed'}
                  onClick={() => onInitiateAction(order)}
                  className={`px-3 py-1 text-xs rounded-md font-medium ${
                    order.followupStatus === 'reviewed'
                      ? 'bg-surface-2 text-text-muted'
                      : 'bg-brand text-white'
                  }`}
                >
                  {order.followupStatus === 'reviewed' ? 'Reviewed' : 'Review'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
