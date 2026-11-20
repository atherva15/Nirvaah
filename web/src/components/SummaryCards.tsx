'use client';

import React from 'react';
import { SummaryMetrics } from '../types';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  preset: 'triage_queue' | 'exposure_summary';
}

export default function SummaryCards({ metrics, preset }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Actionable Priorities */}
      <div className="bg-surface-1 rounded-xl p-4 border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            {preset === 'triage_queue' ? 'Queue Priorities' : 'Exposure Items'}
          </span>
          <div className="w-7 h-7 rounded-md bg-brand-light flex items-center justify-center text-brand">
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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums font-mono">
          {metrics.matchingCount}
        </div>
        <div className="mt-1 text-xs text-text-muted flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
          <span>{metrics.criticalExceptionsCount} pending action</span>
        </div>
      </div>

      {/* Metric 2: Matched Value / Exposure Amount */}
      <div className="bg-surface-1 rounded-xl p-4 border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            {preset === 'triage_queue' ? 'Queue Total Value' : 'Filtered Outstanding'}
          </span>
          <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center text-amber-700">
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
                d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums font-mono">
          ₹{metrics.totalValueInr.toLocaleString('en-IN')}
        </div>
        <div className="mt-1 text-xs text-text-muted">
          <span>Across all {metrics.totalOrdersExamined} examined orders</span>
        </div>
      </div>

      {/* Metric 3: Total Unconfirmed Advances */}
      <div className="bg-surface-1 rounded-xl p-4 border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            Unconfirmed Advances
          </span>
          <div className="w-7 h-7 rounded-md bg-surface-2 flex items-center justify-center text-text-secondary">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums font-mono">
          {metrics.unconfirmedAdvanceCount}
        </div>
        <div className="mt-1 text-xs text-text-muted">
          <span>Awaiting merchant deposit verification</span>
        </div>
      </div>

      {/* Metric 4: Merchant Total Outstanding */}
      <div className="bg-surface-1 rounded-xl p-4 border border-border shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            Merchant Unpaid Balance
          </span>
          <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700">
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
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-text-primary tabular-nums font-mono">
          ₹{metrics.totalOutstandingInr.toLocaleString('en-IN')}
        </div>
        <div className="mt-1 text-xs text-text-muted">
          <span>Total uncollected across all orders</span>
        </div>
      </div>
    </div>
  );
}
