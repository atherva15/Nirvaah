import { Order, ComputedOrder, TaskFilterState, SummaryMetrics } from '../types/index';
import { FIXTURE_NOW_MS } from './synthetic-data';

/**
 * Format paise to Indian Rupee representation (e.g. 200000 paise -> ₹2,000)
 */
export function formatInr(paise: number): string {
  const inr = Math.round(paise / 100);
  return '₹' + inr.toLocaleString('en-IN');
}

/**
 * Format duration hours into readable human duration
 */
export function formatHours(hours: number): string {
  if (hours < 1) {
    const mins = Math.max(1, Math.round(hours * 60));
    return `${mins}m`;
  }
  const wholeHours = Math.floor(hours);
  return `${wholeHours}h`;
}

/**
 * Format ISO string to readable Indian Standard Time date
 */
export function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'Not recorded';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Core Deterministic Calculation Engine (takes explicit nowMs)
 */
export function computeOrderDetails(order: Order, nowMs: number = FIXTURE_NOW_MS): ComputedOrder {
  // BR-01: Outstanding = total - paid in integer paise
  const outstandingPaise = Math.max(0, order.totalAmountPaise - order.paidAmountPaise);
  const totalInr = Math.round(order.totalAmountPaise / 100);
  const paidInr = Math.round(order.paidAmountPaise / 100);
  const outstandingInr = Math.round(outstandingPaise / 100);

  // Time calculations
  const createdMs = new Date(order.createdAt).getTime();
  const orderAgeHours = Math.max(0, (nowMs - createdMs) / 3600000);

  let advanceWaitHours: number | null = null;
  if (order.advanceRequestedAt) {
    const advanceReqMs = new Date(order.advanceRequestedAt).getTime();
    if (!isNaN(advanceReqMs)) {
      advanceWaitHours = Math.max(0, (nowMs - advanceReqMs) / 3600000);
    }
  }

  // Reason generation
  let ruleFlagged = false;
  let ruleReason = 'Normal order status';
  let ruleId = 'ORD-STANDARD';

  if (order.advanceStatus === 'unconfirmed') {
    ruleFlagged = true;
    ruleId = 'BR-ADVANCE-UNCONFIRMED';
    const waitStr = advanceWaitHours !== null ? `waiting ${formatHours(advanceWaitHours)}` : 'unrecorded wait';
    ruleReason = `Unconfirmed advance deposit (${waitStr})`;
  } else if (outstandingPaise > 0) {
    ruleFlagged = true;
    ruleId = 'BR-OUTSTANDING-EXPOSURE';
    ruleReason = `Outstanding balance ${formatInr(outstandingPaise)}`;
  }

  return {
    ...order,
    outstandingPaise,
    outstandingInr,
    totalInr,
    paidInr,
    orderAgeHours,
    advanceWaitHours,
    ruleFlagged,
    ruleReason,
    ruleId,
  };
}

/**
 * Apply Parameterized Filters for Triage Queue or Exposure Summary
 */
export function filterAndSortOrders(
  orders: Order[],
  filterState: TaskFilterState,
  nowMs: number = FIXTURE_NOW_MS
): ComputedOrder[] {
  const computed = orders.map((o) => computeOrderDetails(o, nowMs));
  const amountThresholdPaise = filterState.amountThresholdInr * 100;

  if (filterState.preset === 'triage_queue') {
    // Triage Queue:
    // Fixed field: totalAmountPaise > threshold
    // Advance status: unconfirmed
    // Fixed clock: advanceWaitHours > threshold
    // Sorted: oldest advance request first (ASC)
    return computed
      .filter((o) => {
        const matchesAmount = o.totalAmountPaise > amountThresholdPaise;
        const matchesAdvance = o.advanceStatus === 'unconfirmed';
        const matchesDuration = o.advanceWaitHours !== null && o.advanceWaitHours > filterState.durationThresholdHours;
        return matchesAmount && matchesAdvance && matchesDuration;
      })
      .sort((a, b) => {
        const timeA = a.advanceRequestedAt ? new Date(a.advanceRequestedAt).getTime() : 0;
        const timeB = b.advanceRequestedAt ? new Date(b.advanceRequestedAt).getTime() : 0;
        return timeA - timeB; // Oldest first
      });
  } else {
    // Exposure Summary:
    // Fixed field: outstandingPaise > threshold
    // Fixed clock: orderAgeHours > threshold
    // Sorted: newest order creation first (DESC)
    return computed
      .filter((o) => {
        const matchesAmount = o.outstandingPaise > amountThresholdPaise;
        const matchesDuration = o.orderAgeHours > filterState.durationThresholdHours;
        return matchesAmount && matchesDuration;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA; // Newest first
      });
  }
}

/**
 * Compute Verified Summary Metrics
 */
export function computeSummaryMetrics(
  allOrders: Order[],
  matchedOrders: ComputedOrder[],
  nowMs: number = FIXTURE_NOW_MS
): SummaryMetrics {
  const computedAll = allOrders.map((o) => computeOrderDetails(o, nowMs));

  const totalValueInr = computedAll.reduce((sum, o) => sum + o.totalInr, 0);
  const totalOutstandingInr = computedAll.reduce((sum, o) => sum + o.outstandingInr, 0);
  const unconfirmedAdvanceCount = computedAll.filter((o) => o.advanceStatus === 'unconfirmed').length;

  return {
    totalOrdersExamined: allOrders.length,
    matchingCount: matchedOrders.length,
    totalValueInr,
    totalOutstandingInr,
    unconfirmedAdvanceCount,
    criticalExceptionsCount: matchedOrders.filter((o) => o.followupStatus === 'pending').length,
  };
}
