'use client';

import React, { useState } from 'react';
import { GroceryStockRecord } from '../types';
import { formatInr } from '../lib/engine';

interface GroceryWorkspaceProps {
  records: GroceryStockRecord[];
  onInspectEvidence: (record: GroceryStockRecord) => void;
  onInitiateAction: (record: GroceryStockRecord) => void;
}

export default function GroceryWorkspace({
  records,
  onInspectEvidence,
  onInitiateAction,
}: GroceryWorkspaceProps) {
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const urgentItems = records.filter(
    (r) => r.stockUnits <= r.minReorderLevel || r.expiryStatus === 'expiring_soon' || r.ruleFlagged
  );
  const topPriorityItems = urgentItems.slice(0, 3);

  const categories = Array.from(new Set(records.map((r) => r.category)));

  const filteredRecords = records.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
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
              {urgentItems.length > 0
                ? `${urgentItems.length} perishable grocery lines require urgent replenishment & clearance`
                : 'All inventory stock levels are healthy'}
            </h2>
          </div>
          <div className="text-xs font-mono text-ink-muted bg-porcelain px-3 py-1.5 rounded-xl border border-border shrink-0">
            Perishable Window: 24h Expiry Horizon
          </div>
        </div>

        {/* The "Why" and "What to do next" guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs text-ink-secondary leading-relaxed">
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Why this matters:</span>
            <span>
              Fresh dairy and artisan bakery items have fallen below target shelf buffers or expire within 24
              hours. Stockouts will disappoint evening shoppers, while expired units lead to total inventory loss.
            </span>
          </div>
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Recommended action:</span>
            <span>
              Trigger evening replenishment orders to farm co-operatives. For units expiring today, mark down
              prices for quick clearance before store closing.
            </span>
          </div>
        </div>

        {/* 2. Top Action Items (Urgent stock only) */}
        {topPriorityItems.length > 0 ? (
          <div className="mt-2 space-y-3">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Priority Inventory Alerts ({topPriorityItems.length} of {urgentItems.length}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPriorityItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-border hover:border-lavender/50 shadow-2xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-midnight">
                        {item.productName}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          item.expiryStatus === 'expiring_soon'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.expiryStatus === 'expiring_soon'
                          ? `Expires in ${item.hoursUntilExpiry}h`
                          : 'Stock Depleted'}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary mb-2">
                      Supplier: <span className="font-medium text-midnight">{item.supplierName}</span> ({item.category})
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-3 pb-3 border-b border-border-subtle">
                      <span className="text-ink-muted">Stock Remaining:</span>
                      <span className="font-mono font-bold text-coral tabular-nums text-sm">
                        {item.stockUnits} units{' '}
                        <span className="text-xs text-ink-muted font-normal">(Min: {item.minReorderLevel})</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted mb-4">
                      <span className="font-semibold text-midnight">Reason: </span>
                      {item.ruleReason}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onInspectEvidence(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-lavender hover:bg-lavender-light border border-lavender/30 transition flex-1 text-center"
                    >
                      Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => onInitiateAction(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-lavender hover:bg-lavender-deep transition shadow-xs flex-1 text-center"
                    >
                      Restock / Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-ink-muted bg-porcelain rounded-xl border border-border-subtle">
            All inventory levels within safe threshold buffers.
          </div>
        )}
      </section>

      {/* 3. EXPANDABLE TASK-SPECIFIC VIEW: Full Inventory Catalog */}
      <div className="bg-panel rounded-2xl border border-border shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullCatalog(!showFullCatalog)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-porcelain/60 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lavender font-bold text-sm">
              {showFullCatalog ? '▼' : '▶'}
            </span>
            <span className="font-bold text-sm text-midnight">
              {showFullCatalog
                ? 'Hide Grocery Inventory Catalog'
                : `View Full Grocery Inventory Catalog & Expiry Monitor (${records.length} items)`}
            </span>
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {showFullCatalog ? 'Click to collapse' : 'Click to expand full catalog'}
          </span>
        </button>

        {showFullCatalog && (
          <div className="p-5 border-t border-border space-y-5 animate-in fade-in duration-150">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  categoryFilter === 'all'
                    ? 'bg-midnight text-white'
                    : 'bg-panel hover:bg-porcelain text-ink-secondary border border-border'
                }`}
              >
                All Products ({records.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    categoryFilter === cat
                      ? 'bg-lavender text-white'
                      : 'bg-panel hover:bg-porcelain text-ink-secondary border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inventory Table */}
            <div className="border border-border rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-porcelain text-ink-muted font-semibold uppercase border-b border-border text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Product &amp; Category</th>
                      <th className="py-2.5 px-3">Current Stock</th>
                      <th className="py-2.5 px-3">Safety Buffer</th>
                      <th className="py-2.5 px-3">Unit Price</th>
                      <th className="py-2.5 px-3">Expiry Window</th>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-porcelain/40 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-midnight">{item.productName}</div>
                          <div className="text-[10px] text-ink-muted">{item.category}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                          <span className={item.stockUnits <= item.minReorderLevel ? 'text-coral' : 'text-midnight'}>
                            {item.stockUnits} units
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-ink-muted">
                          {item.minReorderLevel} units
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums">
                          {formatInr(item.unitPricePaise)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.expiryStatus === 'expiring_soon'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.hoursUntilExpiry < 48 ? `${item.hoursUntilExpiry}h left` : 'Stable'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-ink-muted">
                          {item.supplierName}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onInspectEvidence(item)}
                              className="px-2 py-1 text-xs text-lavender hover:bg-lavender-light rounded"
                            >
                              Evidence
                            </button>
                            {item.followupStatus === 'pending' && (
                              <button
                                type="button"
                                onClick={() => onInitiateAction(item)}
                                className="px-2.5 py-1 text-xs text-white bg-lavender hover:bg-lavender-deep rounded font-semibold"
                              >
                                Restock
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
