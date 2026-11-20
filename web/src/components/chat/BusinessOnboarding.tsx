'use client';

import React, { useState } from 'react';
import { BusinessCategory, BusinessProfile } from '../../types';

interface BusinessOnboardingProps {
  onProfileCreated: (profile: BusinessProfile) => void;
  onCancel?: () => void;
  isSecondBusiness?: boolean;
  onLoadSampleDemo?: () => void;
}

interface InterpretationProposal {
  name: string;
  category: BusinessCategory;
  categoryLabel: string;
  tagline: string;
  workflows: string[];
  modules: string[];
  suggestedFirstTask: string;
}

export default function BusinessOnboarding({
  onProfileCreated,
  onCancel,
  isSecondBusiness = false,
  onLoadSampleDemo,
}: BusinessOnboardingProps) {
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);
  const [proposal, setProposal] = useState<InterpretationProposal | null>(null);

  // Editable fields in confirmation step
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<BusinessCategory>('custom_gifting');

  const suggestedExamples = [
    {
      title: 'Custom Gifting Studio',
      category: 'custom_gifting' as BusinessCategory,
      text: 'I run a custom gifting business. Customers contact us through Instagram and WhatsApp. We make personalized hampers, take advance payments, manage artwork approvals and track delivery deadlines.',
      badge: 'Bespoke / Orders',
    },
    {
      title: 'Wholesale & B2B Distribution',
      category: 'wholesale_distribution' as BusinessCategory,
      text: 'We run a B2B wholesale distribution business supplying 45 retail stores. We manage bulk fulfillment, track dispatch delays, verify supplier stock and follow up on 30-day retailer credit terms.',
      badge: 'B2B Wholesale',
    },
    {
      title: 'Fresh Grocery & Daily Retail',
      category: 'grocery_retail' as BusinessCategory,
      text: 'We operate a neighbourhood organic grocery store. We need to track fast-moving stock, monitor daily expiry dates on dairy and fresh produce, and trigger supplier replenishment before shelves run dry.',
      badge: 'Retail Inventory',
    },
    {
      title: 'Creative Agency & Design Studio',
      category: 'service_project' as BusinessCategory,
      text: 'We run a boutique design and branding studio. We manage 8 concurrent client projects, track milestone approvals, monitor invoice payments and manage tight delivery deadlines.',
      badge: 'Client Milestones',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles(Array.from(e.target.files));
    }
  };

  const handleStartAnalysis = (textToAnalyze: string) => {
    const text = textToAnalyze.trim();
    if (!text) return;

    // Simulate meaningful understanding state with 3-stage progression
    setAnalyzingStep(1);

    setTimeout(() => {
      setAnalyzingStep(2);
    }, 400);

    setTimeout(() => {
      setAnalyzingStep(3);
    }, 850);

    setTimeout(() => {
      // Deterministic Classifier
      const lower = text.toLowerCase();
      let category: BusinessCategory = 'custom_gifting';
      let categoryLabel = 'Custom Gifting & Made-to-Order';
      let defaultName = 'Ananya Gifting Studio';
      let tagline = 'Personalized gift hampers, advance tracking, and custom artwork approvals';
      let workflows = [
        'Advance Payment Gate (>₹2,000 / >48h)',
        'Digital Artwork & Proof Approval',
        'Hamper Production & Dispatch Deadlines',
      ];
      let modules = ['order_lifecycle', 'priority_commitments', 'payment_exposure'];
      let suggestedFirstTask = 'Which customer orders need attention?';

      if (lower.includes('wholesale') || lower.includes('b2b') || lower.includes('retailer') || lower.includes('bulk') || lower.includes('dispatch') || lower.includes('distributor')) {
        category = 'wholesale_distribution';
        categoryLabel = 'Wholesale & Distribution';
        defaultName = 'Vanguard Wholesale Logistics';
        tagline = 'B2B bulk fulfillment, dispatch tracking, and retailer credit exposure';
        workflows = [
          'Retailer Bulk Order Fulfillment',
          'Supplier Stock Confirmation Check',
          'Dispatch Queue & Transport Deadlines',
          '30-Day Credit Aging Follow-up',
        ];
        modules = ['dispatch_queue', 'retailer_exposure', 'summary_cards'];
        suggestedFirstTask = 'Which dispatches are delayed?';
      } else if (lower.includes('grocery') || lower.includes('stock') || lower.includes('expiry') || lower.includes('dairy') || lower.includes('produce') || lower.includes('reorder') || lower.includes('food')) {
        category = 'grocery_retail';
        categoryLabel = 'Grocery & Fresh Retail';
        defaultName = 'GreenHarvest Organic Grocers';
        tagline = 'Fresh inventory, fast-moving dairy & produce, and expiry risk monitoring';
        workflows = [
          'Daily Expiry Horizon (<24h / <72h)',
          'Stock Reorder Threshold Alerts',
          'Supplier Restock Replenishment',
        ];
        modules = ['stock_watch', 'expiry_review', 'summary_cards'];
        suggestedFirstTask = 'What products need restocking?';
      } else if (lower.includes('studio') || lower.includes('agency') || lower.includes('service') || lower.includes('project') || lower.includes('client') || lower.includes('milestone') || lower.includes('invoice')) {
        category = 'service_project';
        categoryLabel = 'Client Service & Projects';
        defaultName = 'Studio Vistaar Creative Lab';
        tagline = 'Milestone deliverables, client design reviews, and invoice aging';
        workflows = [
          'Milestone Sign-off & Client Approvals',
          'Sprint Deliverable Health & Scope Track',
          'Outstanding Invoice Aging (Net-15 / Net-30)',
        ];
        modules = ['active_projects', 'invoice_aging', 'summary_cards'];
        suggestedFirstTask = 'What projects have upcoming deadlines?';
      }

      const generatedProposal: InterpretationProposal = {
        name: defaultName,
        category,
        categoryLabel,
        tagline,
        workflows,
        modules,
        suggestedFirstTask,
      };

      setProposal(generatedProposal);
      setEditName(defaultName);
      setEditCategory(category);
      setAnalyzingStep(0);
    }, 1300);
  };

  const handleConfirmProfile = () => {
    if (!proposal) return;

    const newProfile: BusinessProfile = {
      id: `biz-${editCategory}-${Date.now().toString(36)}`,
      name: editName.trim() || proposal.name,
      category: editCategory,
      tagline: proposal.tagline,
      description: description.trim() || 'Business created via conversational onboarding.',
      workflows: proposal.workflows,
      modules: proposal.modules,
      preferences: {
        currency: 'INR',
        defaultThresholdAmount: editCategory === 'wholesale_distribution' ? 25000 : 2000,
        defaultThresholdHours: 48,
      },
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      isSample: false,
    };

    onProfileCreated(newProfile);
  };

  return (
    <div className="min-h-screen bg-porcelain flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-midnight text-white flex items-center justify-center font-bold text-sm shadow-sm">
            N
          </div>
          <div>
            <span className="font-bold tracking-tight text-midnight text-base">NIRVAAH</span>
            <span className="text-xs text-ink-muted ml-2 font-mono">v2.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSecondBusiness && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-ink-muted hover:text-midnight px-3 py-1.5 rounded-lg border border-border hover:bg-porcelain-dim transition"
            >
              Cancel
            </button>
          )}
          <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-lavender-light text-lavender-deep border border-lavender/20">
            {isSecondBusiness ? 'Profile 2 of 2 (Free Tier)' : 'Free Tier (2 Businesses)'}
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        {!proposal && analyzingStep === 0 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-midnight tracking-tight mb-3">
                Tell Nirvaah about your business.
              </h1>
              <p className="text-sm sm:text-base text-ink-secondary max-w-lg mx-auto leading-relaxed">
                Describe your daily operations, how customers reach you, and where work bottlenecks. Nirvaah will adapt its workspace to fit you.
              </p>
            </div>

            {/* Conversational Composer */}
            <div className="bg-panel rounded-2xl border-2 border-border focus-within:border-lavender focus-within:ring-4 focus-within:ring-lavender/10 shadow-sm p-4 transition-all mb-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I run a custom gifting business. Customers contact us through Instagram and WhatsApp. We make personalized hampers, take advance payments, manage artwork approvals and track delivery deadlines..."
                rows={4}
                className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-ink-muted focus:outline-none resize-none leading-relaxed"
                autoFocus
              />

              {/* Composer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle mt-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="file-attachment"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-ink-secondary bg-porcelain hover:bg-porcelain-dim border border-border transition"
                  >
                    <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </svg>
                    <span>{attachedFiles.length > 0 ? `${attachedFiles.length} file(s) attached` : 'Attach records / CSV'}</span>
                  </label>
                  <input
                    id="file-attachment"
                    type="file"
                    multiple
                    accept=".csv,.txt,.json"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {attachedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAttachedFiles([])}
                      className="text-xs text-danger hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleStartAnalysis(description)}
                  disabled={!description.trim()}
                  className="px-5 py-2.5 bg-lavender hover:bg-lavender-deep disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Build My Workspace</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Suggested Starter Examples */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider px-1">
                Or pick an operational archetype:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {suggestedExamples.map((ex) => (
                  <button
                    key={ex.title}
                    type="button"
                    onClick={() => {
                      setDescription(ex.text);
                      handleStartAnalysis(ex.text);
                    }}
                    className="text-left p-3.5 rounded-xl bg-panel hover:bg-porcelain border border-border hover:border-lavender/40 transition group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-midnight group-hover:text-lavender transition-colors">
                        {ex.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-porcelain-dim text-ink-secondary">
                        {ex.badge}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {ex.text}
                    </p>
                  </button>
                ))}
              </div>

              {onLoadSampleDemo && !isSecondBusiness && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={onLoadSampleDemo}
                    className="text-xs text-ink-muted hover:text-midnight font-medium underline transition"
                  >
                    Or explore with pre-loaded demo store (Ananya Gifting Studio) →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Understanding & Synthesizing State */}
        {analyzingStep > 0 && (
          <div className="bg-panel rounded-2xl border border-border p-8 text-center shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-lavender-light text-lavender flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-6 h-6 animate-spin text-lavender" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>

            <h3 className="text-lg font-bold text-midnight mb-2">
              Understanding your business model...
            </h3>

            <div className="space-y-2 max-w-sm mx-auto text-xs text-ink-secondary mt-4">
              <div className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${analyzingStep >= 1 ? 'bg-lavender-light text-lavender-deep font-medium' : 'opacity-40'}`}>
                <span>✓</span>
                <span>Extracting revenue milestones &amp; customer touchpoints...</span>
              </div>
              <div className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${analyzingStep >= 2 ? 'bg-lavender-light text-lavender-deep font-medium' : 'opacity-40'}`}>
                <span>✓</span>
                <span>Identifying operational exception rules &amp; bottlenecks...</span>
              </div>
              <div className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${analyzingStep >= 3 ? 'bg-lavender-light text-lavender-deep font-medium' : 'opacity-40'}`}>
                <span>✓</span>
                <span>Assembling purpose-built workspace modules...</span>
              </div>
            </div>

            <div className="mt-6 text-[11px] font-mono text-ink-muted">
              Deterministic Demonstration Classifier (No cloud prompt leakage)
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {proposal && analyzingStep === 0 && (
          <div className="bg-panel rounded-2xl border-2 border-lavender/30 p-6 sm:p-8 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lavender-light text-lavender-deep">
                  Proposed Architecture
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-midnight mt-1">
                  Here is what Nirvaah understood:
                </h2>
              </div>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">
                Review &amp; Confirm
              </span>
            </div>

            <div className="space-y-5">
              {/* Business Name Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
                  Business Name:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-porcelain border border-border text-sm font-semibold text-midnight focus:outline-none focus:ring-2 focus:ring-lavender"
                />
              </div>

              {/* Business Category Pill Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
                  Operational Archetype:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'custom_gifting' as BusinessCategory, label: 'Custom Gifting / Orders' },
                    { id: 'wholesale_distribution' as BusinessCategory, label: 'Wholesale & B2B' },
                    { id: 'grocery_retail' as BusinessCategory, label: 'Grocery & Retail Inventory' },
                    { id: 'service_project' as BusinessCategory, label: 'Client Services & Projects' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEditCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition ${
                        editCategory === cat.id
                          ? 'border-lavender bg-lavender-light text-lavender-deep font-bold shadow-2xs'
                          : 'border-border bg-porcelain text-ink-secondary hover:bg-porcelain-dim'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Identified Workflows */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
                  Configured Workflows:
                </div>
                <div className="space-y-1.5">
                  {proposal.workflows.map((wf) => (
                    <div key={wf} className="p-2 rounded-lg bg-porcelain border border-border text-xs text-ink flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-lavender shrink-0"></span>
                      <span>{wf}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setProposal(null)}
                  className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-midnight transition"
                >
                  ← Edit Description
                </button>

                <button
                  type="button"
                  onClick={handleConfirmProfile}
                  className="px-6 py-3 bg-lavender hover:bg-lavender-deep text-white text-sm font-semibold rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <span>Launch {editName || proposal.name}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto py-4 text-center text-xs text-ink-muted border-t border-border-subtle">
        <span>Nirvaah by Team Vistaar</span>
        <span className="mx-2">·</span>
        <span>Deterministic Rule Engine</span>
        <span className="mx-2">·</span>
        <span>Browser-Local Isolation</span>
      </footer>
    </div>
  );
}
