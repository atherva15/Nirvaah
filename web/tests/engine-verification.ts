import * as assert from 'assert';
import { SYNTHETIC_ORDERS, FIXTURE_NOW_MS } from '../src/lib/synthetic-data';
import {
  computeOrderDetails,
  filterAndSortOrders,
  computeSummaryMetrics,
  formatInr,
} from '../src/lib/engine';
import { TaskFilterState } from '../src/types/index';

console.log('Running Nirvaah Deterministic Calculation Engine Verification...\n');

// 1. Invariant BR-01: Outstanding Balance in Integer Paise
{
  const sample = SYNTHETIC_ORDERS.find((o) => o.orderId === 'ORD-104')!;
  const computed = computeOrderDetails(sample, FIXTURE_NOW_MS);
  assert.strictEqual(computed.totalAmountPaise, 1250000, 'Total paise mismatch');
  assert.strictEqual(computed.paidAmountPaise, 250000, 'Paid paise mismatch');
  assert.strictEqual(computed.outstandingPaise, 1000000, 'Outstanding paise mismatch');
  assert.strictEqual(computed.outstandingInr, 10000, 'Outstanding INR mismatch');
  assert.strictEqual(formatInr(computed.outstandingPaise), '₹10,000', 'Formatted INR mismatch');
  console.log('✓ BR-01: Integer paise arithmetic verified.');
}

// 2. Invariant BR-03 & BR-04: Triage Queue Filtering (₹2,000 / 48h)
{
  const triageFilter: TaskFilterState = {
    preset: 'triage_queue',
    amountThresholdInr: 2000,
    durationThresholdHours: 48,
  };

  const results = filterAndSortOrders(SYNTHETIC_ORDERS, triageFilter, FIXTURE_NOW_MS);

  // All results must have total > 200000 paise, advanceStatus === 'unconfirmed', advanceWaitHours > 48
  for (const o of results) {
    assert.ok(o.totalAmountPaise > 200000, `Order ${o.orderId} total not > ₹2,000`);
    assert.strictEqual(o.advanceStatus, 'unconfirmed', `Order ${o.advanceStatus} not unconfirmed`);
    assert.ok(o.advanceWaitHours !== null && o.advanceWaitHours > 48, `Order ${o.orderId} wait not > 48h`);
  }

  // ORD-105 has total ₹1,800 (< ₹2,000), must be excluded
  assert.ok(!results.some((o) => o.orderId === 'ORD-105'), 'ORD-105 must be excluded (total < ₹2,000)');

  // ORD-106 has wait ~31h (< 48h), must be excluded
  assert.ok(!results.some((o) => o.orderId === 'ORD-106'), 'ORD-106 must be excluded (wait < 48h)');

  // Sorting: Oldest advance request first (ASC)
  for (let i = 0; i < results.length - 1; i++) {
    const timeA = new Date(results[i].advanceRequestedAt!).getTime();
    const timeB = new Date(results[i + 1].advanceRequestedAt!).getTime();
    assert.ok(timeA <= timeB, 'Triage Queue must be sorted oldest request first');
  }

  console.log(`✓ BR-03/BR-04: Triage Queue filter (₹2,000/48h) matched ${results.length} orders in ASC sort order.`);
}

// 3. Invariant BR-03 & BR-04: Exposure Summary Filtering (₹5,000 / 72h)
{
  const exposureFilter: TaskFilterState = {
    preset: 'exposure_summary',
    amountThresholdInr: 5000,
    durationThresholdHours: 72,
  };

  const results = filterAndSortOrders(SYNTHETIC_ORDERS, exposureFilter, FIXTURE_NOW_MS);

  // All results must have outstanding > 500000 paise, orderAgeHours > 72
  for (const o of results) {
    assert.ok(o.outstandingPaise > 500000, `Order ${o.orderId} outstanding not > ₹5,000`);
    assert.ok(o.orderAgeHours > 72, `Order ${o.orderId} age not > 72h`);
  }

  // Sorting: Newest order creation first (DESC)
  for (let i = 0; i < results.length - 1; i++) {
    const timeA = new Date(results[i].createdAt).getTime();
    const timeB = new Date(results[i + 1].createdAt).getTime();
    assert.ok(timeA >= timeB, 'Exposure Summary must be sorted newest order first');
  }

  console.log(`✓ BR-03/BR-04: Exposure Summary filter (₹5,000/72h) matched ${results.length} orders in DESC sort order.`);
}

// 4. Invariant BR-15: Clock dependency via explicit parameter
{
  const sample = SYNTHETIC_ORDERS[0];
  const t1 = FIXTURE_NOW_MS;
  const t2 = FIXTURE_NOW_MS + 24 * 3600 * 1000; // 24 hours later
  const res1 = computeOrderDetails(sample, t1);
  const res2 = computeOrderDetails(sample, t2);
  assert.strictEqual(Math.round(res2.orderAgeHours - res1.orderAgeHours), 24, 'Clock diff must be exact');
  console.log('✓ BR-15: Deterministic clock parameter validated.');
}

// 5. Invariant Summary Metrics verification
{
  const triageFilter: TaskFilterState = {
    preset: 'triage_queue',
    amountThresholdInr: 2000,
    durationThresholdHours: 48,
  };
  const matched = filterAndSortOrders(SYNTHETIC_ORDERS, triageFilter, FIXTURE_NOW_MS);
  const metrics = computeSummaryMetrics(SYNTHETIC_ORDERS, matched, FIXTURE_NOW_MS);
  assert.strictEqual(metrics.totalOrdersExamined, 20, 'Examined orders must equal dataset size');
  assert.strictEqual(metrics.matchingCount, matched.length, 'Matching count must match filtered length');
  assert.ok(metrics.totalValueInr > 0, 'Total value must be positive');
  assert.ok(metrics.totalOutstandingInr > 0, 'Total outstanding must be positive');
  console.log('✓ Summary metrics deterministic aggregation validated.');
}

console.log('\nAll Deterministic Calculation Engine Tests Passed Successfully!');
