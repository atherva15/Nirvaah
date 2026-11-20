'use client';

import React, { useState } from 'react';
import { BusinessProfile } from '../types';

interface InitialTaskScreenProps {
  onRunQuery: (query: string) => void;
  profile?: BusinessProfile | null;
}

interface SuggestedItem {
  query: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  title: string;
  description: string;
  actionText: string;
}

export default function InitialTaskScreen({ onRunQuery, profile }: InitialTaskScreenProps) {
  const [queryText, setQueryText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = queryText.trim();
    if (!trimmed) return;
    onRunQuery(trimmed);
  };

  const handleSuggestedClick = (suggested: string) => {
    setQueryText(suggested);
    onRunQuery(suggested);
  };

  const category = profile?.category || 'custom_gifting';

  const suggestionsByCategory: Record<string, SuggestedItem[]> = {
    custom_gifting: [
      {
        query: 'Which customer orders need attention?',
        badge: 'Triage Queue',
        badgeColor: 'bg-lavender-light text-lavender-deep',
        iconBg: 'bg-amber-100 text-amber-900',
        title: 'Which customer orders need attention?',
        description: 'Identify custom orders above ₹2,000 with unconfirmed advance deposits waiting over 48h.',
        actionText: 'Generate Triage Queue',
      },
      {
        query: 'Where are my outstanding payments?',
        badge: 'Exposure Summary',
        badgeColor: 'bg-emerald-100 text-emerald-900',
        iconBg: 'bg-emerald-100 text-emerald-800',
        title: 'Where are my outstanding payments?',
        description: 'Inspect orders with outstanding balance above ₹5,000 pending settlement over 72h, grouped by payment status.',
        actionText: 'Generate Exposure View',
      },
    ],
    wholesale_distribution: [
      {
        query: 'Show delayed bulk dispatches',
        badge: 'Dispatch Queue',
        badgeColor: 'bg-coral-light text-coral',
        iconBg: 'bg-rose-100 text-rose-800',
        title: 'Show delayed bulk dispatches',
        description: 'Review orders with logistics dispatch delayed past scheduled due dates or unconfirmed by suppliers.',
        actionText: 'Open Dispatch Queue',
      },
      {
        query: 'Which retailers exceeded 30-day credit?',
        badge: 'Credit Aging',
        badgeColor: 'bg-amber-100 text-amber-900',
        iconBg: 'bg-amber-100 text-amber-800',
        title: 'Which retailers exceeded 30-day credit?',
        description: 'Filter accounts with credit balances past 30-day term thresholds to prepare payment follow-ups.',
        actionText: 'View Retailer Balances',
      },
    ],
    grocery_retail: [
      {
        query: 'Which items expire within 24 hours?',
        badge: 'Expiry Horizon',
        badgeColor: 'bg-rose-100 text-rose-900',
        iconBg: 'bg-rose-100 text-rose-800',
        title: 'Which items expire within 24 hours?',
        description: 'Prioritize dairy, fresh bakery, and perishable batches nearing critical shelf-life boundaries.',
        actionText: 'Check Expiry Horizon',
      },
      {
        query: 'Show products below minimum stock buffer',
        badge: 'Reorder Queue',
        badgeColor: 'bg-lavender-light text-lavender-deep',
        iconBg: 'bg-indigo-100 text-indigo-800',
        title: 'Show products below minimum stock buffer',
        description: 'Audit fast-moving SKUs where inventory has dropped below target safety stock levels.',
        actionText: 'Open Reorder List',
      },
    ],
    service_project: [
      {
        query: 'Which project milestones are at risk?',
        badge: 'Milestone Roadmap',
        badgeColor: 'bg-amber-100 text-amber-900',
        iconBg: 'bg-amber-100 text-amber-800',
        title: 'Which project milestones are at risk?',
        description: 'Check active client retainers where client feedback or milestone deliverables are delayed.',
        actionText: 'View Milestone Health',
      },
      {
        query: 'Where are overdue client invoices?',
        badge: 'Invoice Aging',
        badgeColor: 'bg-emerald-100 text-emerald-900',
        iconBg: 'bg-emerald-100 text-emerald-800',
        title: 'Where are overdue client invoices?',
        description: 'Inspect milestone payments pending client remittance to safeguard cash flow.',
        actionText: 'Review Invoice Aging',
      },
    ],
  };

  const suggestions = suggestionsByCategory[category] || suggestionsByCategory.custom_gifting;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-16 px-4">
      {/* Active Business Context Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel border border-border text-xs text-ink-secondary shadow-xs">
          <span className="w-2 h-2 rounded-full bg-lavender"></span>
          <span className="font-semibold text-ink">
            {profile?.name || 'Ananya Gifting Studio'}
          </span>
          <span className="text-ink-muted">·</span>
          <span className="capitalize">{category.replace('_', ' ')}</span>
          <span className="text-ink-muted">·</span>
          <span className="font-mono text-ink-muted">Deterministic Workspace</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lavender text-white shadow-xs mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
            />
          </svg>
        </div>

        <h1 className="text-xs font-bold uppercase tracking-widest text-lavender mb-2">
          NIRVAAH
        </h1>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight font-sans">
          What would you like to accomplish?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ink-secondary max-w-lg mx-auto">
          An adaptive operations workspace. Ask in natural language or choose a suggested request below to generate a focused, verified task view.
        </p>
      </div>

      {/* Prominent Natural Language Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative rounded-2xl bg-panel border-2 border-border focus-within:border-lavender focus-within:ring-4 focus-within:ring-lavender/10 transition-all shadow-xs p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-ink-muted shrink-0 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              id="initial-task-query"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={`Ask Nirvaah what needs attention in ${profile?.name || 'your business'}...`}
              className="w-full py-3 bg-transparent text-sm sm:text-base text-ink placeholder:text-ink-muted focus:outline-none"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-lavender hover:bg-lavender-deep text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            <span>Run Task</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Two Suggested Requests */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider px-1">
          Suggested Requests for {profile?.name || 'this Business'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestedClick(item.query)}
              className="group text-left p-5 rounded-2xl bg-panel hover:bg-white border border-border hover:border-lavender/50 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform font-bold text-xs`}>
                    {idx === 0 ? '!' : '₹'}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink group-hover:text-lavender transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-ink-muted line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-lavender font-semibold">
                <span>{item.actionText}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Truth & Integrity Statement */}
      <div className="mt-12 text-center text-xs text-ink-muted border-t border-border pt-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-lavender" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>Deterministic Math (Paise Integer Precision)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-lavender" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>Explicit Human Review Before Mutation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-lavender" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span>Isolated Profile Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
