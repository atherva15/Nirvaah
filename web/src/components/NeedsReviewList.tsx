'use client';

import React, { useState } from 'react';

interface QuarantinedRow {
  rowId: string;
  customerName: string;
  issueDescription: string;
  sourceRow: string;
}

export default function NeedsReviewList() {
  const [isOpen, setIsOpen] = useState(false);

  // Example quarantined rows from dirty fixture check (P-03 / A6)
  const quarantinedRows: QuarantinedRow[] = [
    {
      rowId: 'ORD-ERR-99',
      customerName: 'Unknown Customer',
      issueDescription: 'Malformed timestamp format: missing timezone offset in advance_requested_at',
      sourceRow: 'Synthetic_Orders!A23:I23',
    },
    {
      rowId: 'ORD-DUP-04',
      customerName: 'Duplicate Test Entry',
      issueDescription: 'Duplicate primary key ORD-104 detected in source records',
      sourceRow: 'Synthetic_Orders!A24:I24',
    },
  ];

  return (
    <div className="bg-surface-1 rounded-xl p-3.5 border border-amber-200/80 bg-amber-50/40 mb-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span className="text-xs font-semibold text-amber-950">
            Source Data Health: {quarantinedRows.length} rows in Needs Review
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            Quarantined
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-medium text-amber-900 hover:text-amber-950 underline"
        >
          {isOpen ? 'Hide Issues' : 'Inspect Issues'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-2">
          <p className="text-xs text-amber-900/80">
            Records with invalid dates, impossible amounts, or duplicate IDs are quarantined to protect confident calculations.
          </p>
          <div className="space-y-1.5">
            {quarantinedRows.map((row) => (
              <div
                key={row.rowId}
                className="p-2.5 rounded-lg bg-surface-1 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div>
                  <span className="font-mono font-bold text-text-primary mr-2">
                    {row.rowId}
                  </span>
                  <span className="text-text-secondary">{row.customerName}</span>
                  <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                    {row.issueDescription}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-text-muted shrink-0">
                  {row.sourceRow}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
