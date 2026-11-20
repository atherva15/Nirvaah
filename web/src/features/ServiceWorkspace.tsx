'use client';

import React, { useState } from 'react';
import { ServiceProjectRecord } from '../types';
import { formatInr } from '../lib/engine';

interface ServiceWorkspaceProps {
  records: ServiceProjectRecord[];
  onInspectEvidence: (record: ServiceProjectRecord) => void;
  onInitiateAction: (record: ServiceProjectRecord) => void;
}

export default function ServiceWorkspace({
  records,
  onInspectEvidence,
  onInitiateAction,
}: ServiceWorkspaceProps) {
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);
  const [filterHealth, setFilterHealth] = useState<'all' | 'at_risk' | 'invoiced'>('all');

  const urgentProjects = records.filter(
    (r) =>
      r.followupStatus === 'pending' &&
      (r.deliverableStatus === 'at_risk' ||
        r.deliverableStatus === 'delayed' ||
        r.deliverableStatus === 'blocked' ||
        r.milestoneStatus === 'invoiced' ||
        r.ruleFlagged)
  );
  const topPriorityItems = urgentProjects.slice(0, 3);

  const totalContractPaise = records.reduce((sum, r) => sum + r.contractValuePaise, 0);
  const totalUnpaidPaise = records.reduce(
    (sum, r) => sum + Math.max(0, r.contractValuePaise - r.paidAmountPaise),
    0
  );

  const filteredRecords = records.filter((r) => {
    if (filterHealth === 'at_risk')
      return (
        r.deliverableStatus === 'at_risk' ||
        r.deliverableStatus === 'delayed' ||
        r.deliverableStatus === 'blocked'
      );
    if (filterHealth === 'invoiced') return r.milestoneStatus === 'invoiced';
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
              {urgentProjects.length > 0
                ? `${urgentProjects.length} client engagements require milestone sign-off and invoice resolution`
                : 'All client project milestones are on schedule'}
            </h2>
          </div>
          <div className="text-xs font-mono text-ink-muted bg-porcelain px-3 py-1.5 rounded-xl border border-border shrink-0">
            Sprint Review: Friday Milestone Sign-offs
          </div>
        </div>

        {/* The "Why" and "What to do next" guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs text-ink-secondary leading-relaxed">
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Why this matters:</span>
            <span>
              Client approvals are delayed past scheduled review windows, blocking next-phase sprint work.
              Additionally, unpaid milestone invoices threaten design studio cash flow and breach contractual terms.
            </span>
          </div>
          <div className="bg-porcelain/60 rounded-xl p-3.5 border border-border-subtle">
            <span className="font-bold text-midnight block mb-1">Recommended action:</span>
            <span>
              Follow up with client stakeholders on pending deliverable approvals. For overdue milestone invoices,
              send payment remittance reminders before gating subsequent deliverables.
            </span>
          </div>
        </div>

        {/* 2. Top Action Items (Urgent client engagements only) */}
        {topPriorityItems.length > 0 ? (
          <div className="mt-2 space-y-3">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Priority Engagement Actions ({topPriorityItems.length} of {urgentProjects.length}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPriorityItems.map((prj) => (
                <div
                  key={prj.id}
                  className="bg-white rounded-xl p-4 border border-border hover:border-lavender/50 shadow-2xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-midnight">
                        {prj.clientName}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          prj.deliverableStatus === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prj.milestoneStatus === 'invoiced' ? 'Invoice Overdue' : 'Client Review Pending'}
                      </span>
                    </div>

                    <div className="text-xs text-ink-secondary font-medium mb-1">
                      {prj.projectName}
                    </div>
                    <div className="text-xs text-ink-muted mb-3 line-clamp-1">
                      Milestone: {prj.currentMilestone}
                    </div>

                    <div className="flex items-baseline justify-between text-xs mb-3 pb-3 border-b border-border-subtle">
                      <span className="text-ink-muted">Contract Total:</span>
                      <span className="font-mono font-bold text-midnight tabular-nums text-sm">
                        {formatInr(prj.contractValuePaise)}
                      </span>
                    </div>

                    <div className="text-[11px] text-ink-muted mb-4">
                      <span className="font-semibold text-midnight">Status: </span>
                      {prj.ruleReason}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onInspectEvidence(prj)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-lavender hover:bg-lavender-light border border-lavender/30 transition flex-1 text-center"
                    >
                      Evidence
                    </button>
                    <button
                      type="button"
                      onClick={() => onInitiateAction(prj)}
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
            All client deliverables and milestone payments are up to date.
          </div>
        )}
      </section>

      {/* 3. EXPANDABLE TASK-SPECIFIC VIEW: Full Project Portfolio & Invoice Aging */}
      <div className="bg-panel rounded-2xl border border-border shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullPortfolio(!showFullPortfolio)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-porcelain/60 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lavender font-bold text-sm">
              {showFullPortfolio ? '▼' : '▶'}
            </span>
            <span className="font-bold text-sm text-midnight">
                {showFullPortfolio
                ? 'Hide Project Portfolio & Invoices'
                : `View Full Project Portfolio & Invoice Aging (${records.length} engagements, ${formatInr(totalContractPaise)} total, ${formatInr(totalUnpaidPaise)} unpaid)`}
            </span>
          </div>
          <span className="text-xs text-ink-muted font-mono">
            {showFullPortfolio ? 'Click to collapse' : 'Click to expand full portfolio'}
          </span>
        </button>

        {showFullPortfolio && (
          <div className="p-5 border-t border-border space-y-5 animate-in fade-in duration-150">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterHealth('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterHealth === 'all'
                    ? 'bg-midnight text-white'
                    : 'bg-panel hover:bg-porcelain text-ink-secondary border border-border'
                }`}
              >
                All Engagements ({records.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterHealth('at_risk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterHealth === 'at_risk'
                    ? 'bg-danger text-white'
                    : 'bg-panel hover:bg-porcelain text-danger border border-border'
                }`}
              >
                At Risk / Delayed
              </button>
              <button
                type="button"
                onClick={() => setFilterHealth('invoiced')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterHealth === 'invoiced'
                    ? 'bg-coral text-white'
                    : 'bg-panel hover:bg-porcelain text-coral border border-border'
                }`}
              >
                Invoiced &amp; Pending
              </button>
            </div>

            {/* Portfolio Table */}
            <div className="border border-border rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-porcelain text-ink-muted font-semibold uppercase border-b border-border text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Project &amp; Client</th>
                      <th className="py-2.5 px-3">Current Milestone</th>
                      <th className="py-2.5 px-3">Contract Value</th>
                      <th className="py-2.5 px-3">Unpaid Balance</th>
                      <th className="py-2.5 px-3">Milestone Status</th>
                      <th className="py-2.5 px-3">Health</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredRecords.map((prj) => {
                      const unpaidPaise = Math.max(0, prj.contractValuePaise - prj.paidAmountPaise);
                      return (
                        <tr key={prj.id} className="hover:bg-porcelain/40 transition">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-midnight">{prj.projectName}</div>
                            <div className="text-[10px] text-ink-muted">{prj.clientName}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-midnight">{prj.currentMilestone}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-midnight tabular-nums">
                            {formatInr(prj.contractValuePaise)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-coral tabular-nums">
                            {formatInr(unpaidPaise)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                prj.milestoneStatus === 'invoiced'
                                  ? 'bg-amber-100 text-amber-900'
                                  : prj.milestoneStatus === 'approved'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-lavender-light text-lavender-deep'
                              }`}
                            >
                              {prj.milestoneStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                prj.deliverableStatus === 'at_risk' ||
                                prj.deliverableStatus === 'delayed' ||
                                prj.deliverableStatus === 'blocked'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {prj.deliverableStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onInspectEvidence(prj)}
                                className="px-2 py-1 text-xs text-lavender hover:bg-lavender-light rounded"
                              >
                                Evidence
                              </button>
                              {prj.followupStatus === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => onInitiateAction(prj)}
                                  className="px-2.5 py-1 text-xs text-white bg-lavender hover:bg-lavender-deep rounded font-semibold"
                                >
                                  Follow up
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
