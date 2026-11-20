import {
  WorkspacePlan,
  TaskPreset,
  TaskIntent,
  RegisteredModuleId,
  BusinessCategory,
} from '../types';

/**
 * Deterministic Workspace Planner
 *
 * NOTE: Nirvaah is architected to support a future Gemini-powered planning endpoint (/api/plan).
 * Until Gemini is genuinely connected, this module serves as the explicitly labelled
 * deterministic demo fallback. All plans generated here indicate plannerSource: 'deterministic_demo'.
 */

export function planWorkspace(
  rawQuery: string,
  category: BusinessCategory = 'custom_gifting'
): WorkspacePlan {
  const trimmed = rawQuery.trim();
  const lower = trimmed.toLowerCase();

  // Check for completely unsupported / off-topic requests
  const isOffTopic =
    lower.includes('crypto') ||
    lower.includes('bitcoin') ||
    lower.includes('weather') ||
    lower.includes('stocks trading') ||
    lower.includes('casino') ||
    lower.includes('horoscope') ||
    lower.includes('movie ticket');

  if (isOffTopic) {
    return {
      planId: `PLAN-UNSUPPORTED-${Date.now().toString(36).toUpperCase()}`,
      plannerSource: 'deterministic_demo',
      query: trimmed,
      intent: 'unsupported',
      preset: 'triage_queue',
      layout: 'unsupported',
      title: 'Unsupported Operational Request',
      description: 'The requested action is outside the operational capabilities of Nirvaah.',
      rationale:
        'Nirvaah provides verified operational workspaces for small businesses (order triage, payments, dispatches, stock, and client milestones). General AI conversation or unrelated topics are not mapped to workspaces.',
      modules: [],
      filterState: {
        preset: 'triage_queue',
        amountThresholdInr: 2000,
        durationThresholdHours: 48,
      },
      supported: false,
      unsupportedMessage: `Nirvaah cannot process "${trimmed}". Try asking about pending orders, payments, dispatches, stock levels, or milestone approvals.`,
      businessCategory: category,
    };
  }

  // Parse numeric amount if present (e.g. ₹2,000, 2000, 5000)
  const amountMatch = lower.match(/(?:₹\s*|rs\.?\s*|inr\s*)?(\d[\d,]*)/i);
  // Parse duration hours if present (e.g. 48h, 48 hours, 72 hrs)
  const hoursMatch = lower.match(/(\d+)\s*(?:h|hr|hrs|hour|hours)/i);

  let parsedAmount: number | null = null;
  if (amountMatch) {
    const num = parseInt(amountMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      parsedAmount = num;
    }
  }

  let parsedHours: number | null = null;
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10);
    if (!isNaN(hours) && hours > 0) {
      parsedHours = hours;
    }
  }

  // Route by Category & Intent
  if (category === 'wholesale_distribution') {
    if (lower.includes('payment') || lower.includes('outstanding') || lower.includes('credit') || lower.includes('retailer')) {
      return {
        planId: `PLAN-WHL-${Date.now().toString(36).toUpperCase()}`,
        plannerSource: 'deterministic_demo',
        query: trimmed,
        intent: 'outstanding_exposure',
        preset: 'exposure_summary',
        layout: 'retailer_exposure',
        title: 'Retailer Credit Exposure & Overdue Accounts',
        description: 'Analyzing retailer credit ledgers exceeding 30-day settlement terms. Prioritizing accounts with overdue exposure.',
        rationale: 'Generated Wholesale Credit Exposure view: displays accounts grouped by credit status, aged balances, and follow-up actions.',
        modules: ['retailer_exposure', 'summary_cards', 'evidence_drawer', 'action_panel'],
        filterState: {
          preset: 'exposure_summary',
          amountThresholdInr: parsedAmount ?? 25000,
          durationThresholdHours: parsedHours ?? 30,
        },
        supported: true,
        businessCategory: category,
      };
    }

    return {
      planId: `PLAN-WHL-DISP-${Date.now().toString(36).toUpperCase()}`,
      plannerSource: 'deterministic_demo',
      query: trimmed,
      intent: 'dispatch_queue',
      preset: 'triage_queue',
      layout: 'dispatch_queue',
      title: 'Wholesale Dispatch & Fulfillment Queue',
      description: 'Prioritizing bulk order shipments, supplier stock confirmations, and overdue freight dispatches.',
      rationale: 'Generated Dispatch Queue: organizes bulk fulfillment by urgency, supplier stock readiness, and transport deadlines.',
      modules: ['dispatch_queue', 'summary_cards', 'evidence_drawer', 'action_panel'],
      filterState: {
        preset: 'triage_queue',
        amountThresholdInr: parsedAmount ?? 50000,
        durationThresholdHours: parsedHours ?? 24,
      },
      supported: true,
      businessCategory: category,
    };
  }

  if (category === 'grocery_retail') {
    if (lower.includes('expiry') || lower.includes('expire') || lower.includes('shelf') || lower.includes('date')) {
      return {
        planId: `PLAN-GRO-EXP-${Date.now().toString(36).toUpperCase()}`,
        plannerSource: 'deterministic_demo',
        query: trimmed,
        intent: 'expiry_review',
        preset: 'exposure_summary',
        layout: 'expiry_review',
        title: 'Fresh Inventory Expiry Risk Horizon',
        description: 'Auditing perishables and dairy batches nearing expiration within 24–72 hours.',
        rationale: 'Generated Expiry Risk layout: groups inventory by expiry urgency (<24h, <72h, sufficient) with supplier provenance.',
        modules: ['expiry_review', 'summary_cards', 'evidence_drawer'],
        filterState: {
          preset: 'exposure_summary',
          amountThresholdInr: 100,
          durationThresholdHours: parsedHours ?? 24,
        },
        supported: true,
        businessCategory: category,
      };
    }

    return {
      planId: `PLAN-GRO-STK-${Date.now().toString(36).toUpperCase()}`,
      plannerSource: 'deterministic_demo',
      query: trimmed,
      intent: 'stock_watch',
      preset: 'triage_queue',
      layout: 'stock_watch',
      title: 'Stock Availability & Reorder Priorities',
      description: 'Auditing fast-moving grocery staples below minimum safety buffers for supplier replenishment.',
      rationale: 'Generated Stock Watch layout: displays low-stock alerts, supplier reorder triggers, and pantry inventory.',
      modules: ['stock_watch', 'summary_cards', 'evidence_drawer'],
      filterState: {
        preset: 'triage_queue',
        amountThresholdInr: 500,
        durationThresholdHours: 48,
      },
      supported: true,
      businessCategory: category,
    };
  }

  if (category === 'service_project') {
    if (lower.includes('invoice') || lower.includes('payment') || lower.includes('unpaid') || lower.includes('money')) {
      return {
        planId: `PLAN-SRV-INV-${Date.now().toString(36).toUpperCase()}`,
        plannerSource: 'deterministic_demo',
        query: trimmed,
        intent: 'outstanding_exposure',
        preset: 'exposure_summary',
        layout: 'invoice_aging',
        title: 'Client Invoice Aging & Retainer Balances',
        description: 'Tracking billed client invoices pending settlement across project milestones.',
        rationale: 'Generated Invoice Aging layout: shows overdue retainer balances, client contact points, and gated milestones.',
        modules: ['invoice_aging', 'summary_cards', 'evidence_drawer', 'action_panel'],
        filterState: {
          preset: 'exposure_summary',
          amountThresholdInr: parsedAmount ?? 50000,
          durationThresholdHours: parsedHours ?? 14,
        },
        supported: true,
        businessCategory: category,
      };
    }

    return {
      planId: `PLAN-SRV-PRJ-${Date.now().toString(36).toUpperCase()}`,
      plannerSource: 'deterministic_demo',
      query: trimmed,
      intent: 'active_projects',
      preset: 'triage_queue',
      layout: 'active_projects',
      title: 'Active Projects & Milestone Deadlines',
      description: 'Reviewing client deliverables, review approvals, and sprint commitments.',
      rationale: 'Generated Project Milestone layout: prioritizes at-risk deliverables, sign-off bottlenecks, and upcoming deadlines.',
      modules: ['active_projects', 'summary_cards', 'evidence_drawer'],
      filterState: {
        preset: 'triage_queue',
        amountThresholdInr: parsedAmount ?? 100000,
        durationThresholdHours: parsedHours ?? 48,
      },
      supported: true,
      businessCategory: category,
    };
  }

  // Default: Custom Gifting Category (Preserves existing core behavior)
  const isPaymentExposure =
    lower.includes('payment') ||
    lower.includes('outstanding') ||
    lower.includes('exposure') ||
    lower.includes('balance') ||
    lower.includes('debt') ||
    lower.includes('due') ||
    lower.includes('collection') ||
    lower.includes('where are my outstanding');

  const isOrderTriage =
    lower.includes('order') ||
    lower.includes('advance') ||
    lower.includes('deposit') ||
    lower.includes('triage') ||
    lower.includes('attention') ||
    lower.includes('follow') ||
    lower.includes('which customer orders');

  let intent: TaskIntent = 'advance_followup';
  let preset: TaskPreset = 'triage_queue';

  if (isPaymentExposure && !isOrderTriage) {
    intent = 'outstanding_exposure';
    preset = 'exposure_summary';
  } else if (isOrderTriage) {
    intent = 'advance_followup';
    preset = 'triage_queue';
  } else if (parsedAmount && parsedAmount >= 5000) {
    intent = 'outstanding_exposure';
    preset = 'exposure_summary';
  }

  const amountThresholdInr =
    parsedAmount ?? (preset === 'triage_queue' ? 2000 : 5000);
  const durationThresholdHours =
    parsedHours ?? (preset === 'triage_queue' ? 48 : 72);

  return buildGiftingPlan({
    query: trimmed,
    intent,
    preset,
    amountThresholdInr,
    durationThresholdHours,
  });
}

export function getPresetPlan(
  preset: TaskPreset,
  queryOverride?: string,
  category: BusinessCategory = 'custom_gifting'
): WorkspacePlan {
  if (category === 'wholesale_distribution') {
    return planWorkspace(
      preset === 'triage_queue'
        ? 'Which dispatches are delayed?'
        : 'Where are my outstanding payments?',
      category
    );
  }
  if (category === 'grocery_retail') {
    return planWorkspace(
      preset === 'triage_queue'
        ? 'What products need restocking?'
        : 'Which items are expiring soon?',
      category
    );
  }
  if (category === 'service_project') {
    return planWorkspace(
      preset === 'triage_queue'
        ? 'What projects have upcoming deadlines?'
        : 'Where are my outstanding invoices?',
      category
    );
  }

  // Gifting default
  if (preset === 'triage_queue') {
    return buildGiftingPlan({
      query: queryOverride || 'Which customer orders need attention?',
      intent: 'advance_followup',
      preset: 'triage_queue',
      amountThresholdInr: 2000,
      durationThresholdHours: 48,
    });
  } else {
    return buildGiftingPlan({
      query: queryOverride || 'Where are my outstanding payments?',
      intent: 'outstanding_exposure',
      preset: 'exposure_summary',
      amountThresholdInr: 5000,
      durationThresholdHours: 72,
    });
  }
}

interface PlanBuildOptions {
  query: string;
  intent: TaskIntent;
  preset: TaskPreset;
  amountThresholdInr: number;
  durationThresholdHours: number;
}

function buildGiftingPlan({
  query,
  intent,
  preset,
  amountThresholdInr,
  durationThresholdHours,
}: PlanBuildOptions): WorkspacePlan {
  const planId = `PLAN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  if (preset === 'triage_queue') {
    const modules: RegisteredModuleId[] = [
      'summary_cards',
      'threshold_controls',
      'orders_table',
      'needs_review',
      'evidence_drawer',
      'action_panel',
    ];

    return {
      planId,
      plannerSource: 'deterministic_demo',
      query,
      intent,
      preset: 'triage_queue',
      layout: 'triage_queue',
      title: 'Order Attention & Advance Triage',
      description: `Evaluating custom orders requiring advance deposit confirmation before 6 PM closing. Flagging orders over ₹${amountThresholdInr.toLocaleString('en-IN')} with advance wait exceeding ${durationThresholdHours} hours.`,
      rationale:
        'Selected Triage Queue composition: summary exception metrics, parameter threshold controls, priority order table sorted by oldest advance request, and contextual review actions.',
      modules,
      filterState: {
        preset: 'triage_queue',
        amountThresholdInr,
        durationThresholdHours,
      },
      supported: true,
      businessCategory: 'custom_gifting',
    };
  } else {
    const modules: RegisteredModuleId[] = [
      'summary_cards',
      'threshold_controls',
      'grouped_queue',
      'needs_review',
      'evidence_drawer',
      'action_panel',
    ];

    return {
      planId,
      plannerSource: 'deterministic_demo',
      query,
      intent,
      preset: 'exposure_summary',
      layout: 'exposure_summary',
      title: 'Outstanding Payments & Exposure Summary',
      description: `Evaluating payment exposure across customer orders. Flagging balances over ₹${amountThresholdInr.toLocaleString('en-IN')} with order age exceeding ${durationThresholdHours} hours, grouped by payment status.`,
      rationale:
        'Selected Exposure Summary composition: exposure summary metrics, parameter threshold controls, payment-status grouped queue (Unpaid, Partially Paid, Paid), and evidence inspection.',
      modules,
      filterState: {
        preset: 'exposure_summary',
        amountThresholdInr,
        durationThresholdHours,
      },
      supported: true,
      businessCategory: 'custom_gifting',
    };
  }
}
