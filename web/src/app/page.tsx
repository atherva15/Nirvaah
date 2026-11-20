'use client';

import React, { useState, useMemo } from 'react';
import AppShell from '../components/AppShell';
import TaskInput from '../components/TaskInput';
import SummaryCards from '../components/SummaryCards';
import ThresholdControls from '../components/ThresholdControls';
import NeedsReviewList from '../components/NeedsReviewList';
import EvidenceDrawer from '../components/EvidenceDrawer';
import ActionReviewModal from '../components/ActionReviewModal';
import TriageQueue from '../features/TriageQueue';
import ExposureSummary from '../features/ExposureSummary';
import { SYNTHETIC_ORDERS, FIXTURE_NOW_MS } from '../lib/synthetic-data';
import { filterAndSortOrders, computeSummaryMetrics } from '../lib/engine';
import { Order, TaskPreset, TaskFilterState, ComputedOrder, ActionReceipt } from '../types';

export default function Home() {
  // Master orders state (synthetic data baseline)
  const [orders, setOrders] = useState<Order[]>(SYNTHETIC_ORDERS);

  // Active task filter & layout state
  const [filterState, setFilterState] = useState<TaskFilterState>({
    preset: 'triage_queue',
    amountThresholdInr: 2000,
    durationThresholdHours: 48,
  });

  // Modal / Drawer inspect states
  const [evidenceOrder, setEvidenceOrder] = useState<ComputedOrder | null>(null);
  const [actionOrder, setActionOrder] = useState<ComputedOrder | null>(null);
  const [recentReceipt, setRecentReceipt] = useState<ActionReceipt | null>(null);

  // Filtered and computed orders via deterministic rule engine
  const matchedOrders = useMemo(() => {
    return filterAndSortOrders(orders, filterState, FIXTURE_NOW_MS);
  }, [orders, filterState]);

  // Verified summary metrics derived from deterministic calculation
  const metrics = useMemo(() => {
    return computeSummaryMetrics(orders, matchedOrders, FIXTURE_NOW_MS);
  }, [orders, matchedOrders]);

  // Preset switch handler
  const handleSelectPreset = (preset: TaskPreset) => {
    if (preset === 'triage_queue') {
      setFilterState({
        preset: 'triage_queue',
        amountThresholdInr: 2000,
        durationThresholdHours: 48,
      });
    } else {
      setFilterState({
        preset: 'exposure_summary',
        amountThresholdInr: 5000,
        durationThresholdHours: 72,
      });
    }
  };

  // Threshold update handlers
  const handleUpdateAmount = (amountInr: number) => {
    setFilterState((prev) => ({ ...prev, amountThresholdInr: amountInr }));
  };

  const handleUpdateDuration = (hours: number) => {
    setFilterState((prev) => ({ ...prev, durationThresholdHours: hours }));
  };

  const handleApplyCustomQuery = (
    amountInr: number,
    durationHours: number,
    preset: TaskPreset
  ) => {
    setFilterState({
      preset,
      amountThresholdInr: amountInr,
      durationThresholdHours: durationHours,
    });
  };

  const handleResetFilters = () => {
    if (filterState.preset === 'triage_queue') {
      setFilterState({
        preset: 'triage_queue',
        amountThresholdInr: 2000,
        durationThresholdHours: 48,
      });
    } else {
      setFilterState({
        preset: 'exposure_summary',
        amountThresholdInr: 5000,
        durationThresholdHours: 72,
      });
    }
  };

  // Safe Approved Action Mutation Handler (BR-12 & P-09)
  const handleApproveSuccess = (orderId: string, receipt: ActionReceipt) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, followupStatus: 'reviewed' } : o
      )
    );
    setRecentReceipt(receipt);
    // If evidence drawer is open for this order, update it
    if (evidenceOrder && evidenceOrder.orderId === orderId) {
      setEvidenceOrder((prev) => (prev ? { ...prev, followupStatus: 'reviewed' } : null));
    }
  };

  return (
    <AppShell
      currentPreset={filterState.preset}
      onSelectPreset={handleSelectPreset}
    >
      {/* Recent Action Banner if executed */}
      {recentReceipt && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>
              <strong>Verified Update Confirmed:</strong> Order{' '}
              <span className="font-mono font-bold">{recentReceipt.orderId}</span> marked{' '}
              <span className="font-mono font-bold text-emerald-800">reviewed</span> in source (Receipt:{' '}
              <span className="font-mono">{recentReceipt.receiptId}</span>).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRecentReceipt(null)}
            className="text-emerald-800 hover:text-emerald-950 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Task Input / Preset Selector */}
      <TaskInput
        currentPreset={filterState.preset}
        onSelectPreset={handleSelectPreset}
        onApplyCustomQuery={handleApplyCustomQuery}
      />

      {/* Source Data Hygiene / Needs Review Alert */}
      <NeedsReviewList />

      {/* Reusable Verified Summary Metrics Cards */}
      <SummaryCards metrics={metrics} preset={filterState.preset} />

      {/* Parameterized Threshold Controls */}
      <ThresholdControls
        filterState={filterState}
        onUpdateAmount={handleUpdateAmount}
        onUpdateDuration={handleUpdateDuration}
        matchedCount={matchedOrders.length}
      />

      {/* Dynamic Registered View Layouts */}
      {filterState.preset === 'triage_queue' ? (
        <TriageQueue
          orders={matchedOrders}
          onInspectEvidence={(order) => setEvidenceOrder(order)}
          onInitiateAction={(order) => setActionOrder(order)}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <ExposureSummary
          orders={matchedOrders}
          onInspectEvidence={(order) => setEvidenceOrder(order)}
          onInitiateAction={(order) => setActionOrder(order)}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Contextual Evidence Drawer (Evidence Lens) */}
      <EvidenceDrawer
        order={evidenceOrder}
        onClose={() => setEvidenceOrder(null)}
        onInitiateAction={(order) => {
          setEvidenceOrder(null);
          setActionOrder(order);
        }}
      />

      {/* Action Review Modal (Human-in-the-Loop Safe Mutation) */}
      <ActionReviewModal
        order={actionOrder}
        isOpen={!!actionOrder}
        onClose={() => setActionOrder(null)}
        onApproveSuccess={handleApproveSuccess}
      />
    </AppShell>
  );
}
