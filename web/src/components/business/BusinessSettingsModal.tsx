'use client';

import React, { useState } from 'react';
import { BusinessProfile } from '../../types';

interface BusinessSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile | null;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
  profilesCount: number;
}

export default function BusinessSettingsModal(props: BusinessSettingsModalProps) {
  if (!props.isOpen || !props.profile) return null;
  return <BusinessSettingsDialog {...props} profile={props.profile} />;
}

interface DialogProps {
  onClose: () => void;
  profile: BusinessProfile;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
  profilesCount: number;
}

function BusinessSettingsDialog({
  onClose,
  profile,
  onSaveProfile,
  profilesCount,
}: DialogProps) {
  const [name, setName] = useState(profile.name || '');
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [description, setDescription] = useState(profile.description || '');
  const [thresholdAmount, setThresholdAmount] = useState<number>(
    profile.preferences?.defaultThresholdAmount ?? 2000
  );
  const [thresholdHours, setThresholdHours] = useState<number>(
    profile.preferences?.defaultThresholdHours ?? 48
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || profile.name,
      tagline: tagline.trim(),
      description: description.trim(),
      preferences: {
        currency: profile.preferences?.currency || 'INR',
        defaultThresholdAmount: thresholdAmount,
        defaultThresholdHours: thresholdHours,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const categoryLabels: Record<string, string> = {
    custom_gifting: 'Custom Gifting / Made-to-Order',
    wholesale_distribution: 'Wholesale & B2B Distribution',
    grocery_retail: 'Grocery & Perishable Retail',
    service_project: 'Service & Project Agency',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-xl bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-start justify-between bg-porcelain/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lavender"></span>
              <h2 id="settings-title" className="text-lg font-bold text-ink">
                Business Settings &amp; Preferences
              </h2>
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Configure business profile identity, deterministic thresholds, and operational rules.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-porcelain transition"
            aria-label="Close settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-success-light border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
              <span>✓ Settings saved successfully.</span>
            </div>
          )}

          {/* Business Meta Row */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-porcelain border border-border-subtle text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Profile ID</span>
              <span className="font-mono text-ink font-semibold select-all">{profile.id}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Business Type</span>
              <span className="font-semibold text-lavender-deep">
                {categoryLabels[profile.category] || profile.category}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Free Tier Usage</span>
              <span className="font-semibold text-ink">
                {profilesCount} of 2 Profiles Used
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Base Currency</span>
              <span className="font-mono font-semibold text-ink">
                {profile.preferences?.currency || 'INR'} (₹)
              </span>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="biz-name" className="block text-xs font-semibold text-ink mb-1.5">
              Business Name
            </label>
            <input
              id="biz-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:border-lavender focus:ring-1 focus:ring-lavender"
            />
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="biz-tagline" className="block text-xs font-semibold text-ink mb-1.5">
              Tagline / Subtitle
            </label>
            <input
              id="biz-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Handcrafted hampers, bespoke keepsakes"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:border-lavender focus:ring-1 focus:ring-lavender"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="biz-desc" className="block text-xs font-semibold text-ink mb-1.5">
              Business Description &amp; Operational Context
            </label>
            <textarea
              id="biz-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-ink text-xs focus:border-lavender focus:ring-1 focus:ring-lavender resize-none leading-relaxed"
            />
          </div>

          {/* Configured Workflows (Informative) */}
          <div>
            <div className="text-xs font-semibold text-ink mb-2">
              Configured Operational Workflows ({profile.workflows.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.workflows.map((wf, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-lavender-light border border-lavender/20 text-lavender-deep text-[11px] font-medium"
                >
                  {wf}
                </span>
              ))}
            </div>
          </div>

          {/* Deterministic Filter Thresholds */}
          <div className="pt-2 border-t border-border-subtle">
            <div className="text-xs font-semibold text-ink mb-1">
              Default Operational Alert Thresholds
            </div>
            <p className="text-[11px] text-ink-muted mb-3">
              Deterministic rule engines trigger exception flags whenever records breach these values.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="thresh-amt" className="block text-xs font-medium text-ink mb-1">
                  Amount Threshold (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-ink-muted">₹</span>
                  <input
                    id="thresh-amt"
                    type="number"
                    min={0}
                    step={500}
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-white text-ink text-xs font-mono font-medium focus:border-lavender"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="thresh-hrs" className="block text-xs font-medium text-ink mb-1">
                  Aging / Urgency Window (Hours)
                </label>
                <div className="relative">
                  <input
                    id="thresh-hrs"
                    type="number"
                    min={1}
                    max={720}
                    value={thresholdHours}
                    onChange={(e) => setThresholdHours(Number(e.target.value) || 24)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-white text-ink text-xs font-mono font-medium focus:border-lavender"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-ink-muted">hrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-ink-muted font-mono">
              Changes persist in local state
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-ink-secondary hover:bg-porcelain transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-lavender hover:bg-lavender-deep text-white text-xs font-semibold shadow-xs transition"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
