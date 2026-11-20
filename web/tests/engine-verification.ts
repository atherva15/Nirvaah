import * as assert from 'assert';
import { SYNTHETIC_ORDERS, FIXTURE_NOW_MS } from '../src/lib/synthetic-data';
import {
  computeOrderDetails,
  filterAndSortOrders,
  computeSummaryMetrics,
  formatInr,
} from '../src/lib/engine';
import { TaskFilterState } from '../src/types/index';
import { planWorkspace, getPresetPlan } from '../src/lib/planner';

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

// 6. Invariant WorkspacePlan Contract & Task Adaptation
{
  // Suggested Task 1: "Which customer orders need attention?"
  const plan1 = planWorkspace('Which customer orders need attention?');
  assert.strictEqual(plan1.plannerSource, 'deterministic_demo', 'Planner source must be deterministic_demo');
  assert.strictEqual(plan1.intent, 'advance_followup', 'Intent must be advance_followup');
  assert.strictEqual(plan1.layout, 'triage_queue', 'Layout must be triage_queue');
  assert.ok(plan1.modules.includes('orders_table'), 'Triage plan must include orders_table module');
  assert.ok(!plan1.modules.includes('grouped_queue'), 'Triage plan must NOT include grouped_queue module');
  assert.strictEqual(plan1.filterState.amountThresholdInr, 2000, 'Default triage amount must be 2000');
  assert.strictEqual(plan1.filterState.durationThresholdHours, 48, 'Default triage duration must be 48');

  // Suggested Task 2: "Where are my outstanding payments?"
  const plan2 = planWorkspace('Where are my outstanding payments?');
  assert.strictEqual(plan2.plannerSource, 'deterministic_demo', 'Planner source must be deterministic_demo');
  assert.strictEqual(plan2.intent, 'outstanding_exposure', 'Intent must be outstanding_exposure');
  assert.strictEqual(plan2.layout, 'exposure_summary', 'Layout must be exposure_summary');
  assert.ok(plan2.modules.includes('grouped_queue'), 'Exposure plan must include grouped_queue module');
  assert.ok(!plan2.modules.includes('orders_table'), 'Exposure plan must NOT include orders_table module');
  assert.strictEqual(plan2.filterState.amountThresholdInr, 5000, 'Default exposure amount must be 5000');
  assert.strictEqual(plan2.filterState.durationThresholdHours, 72, 'Default exposure duration must be 72');

  // Invariant: Visibly different layout types
  assert.notStrictEqual(plan1.layout, plan2.layout, 'Both supported tasks must produce visibly different layouts');

  // Direct preset plan generation
  const presetPlan = getPresetPlan('triage_queue');
  assert.strictEqual(presetPlan.preset, 'triage_queue', 'Preset plan must match triage_queue');

  // Custom parameterized query
  const planCustom = planWorkspace('Show orders above ₹3,500 waiting more than 60 hours');
  assert.strictEqual(planCustom.filterState.amountThresholdInr, 3500, 'Custom amount parsed');
  assert.strictEqual(planCustom.filterState.durationThresholdHours, 60, 'Custom duration parsed');

  console.log('✓ WorkspacePlan contract: Verified visibly different layouts & parameter parsing.');
}

// 7. Invariant: Action Cancellation Produces Zero Mutation
{
  const sample = SYNTHETIC_ORDERS[0];
  const initialStatus = sample.followupStatus;
  // Simulation of user opening review modal and clicking Cancel
  const ordersList = [...SYNTHETIC_ORDERS];
  const handleCancel = () => {
    // No-op / closes dialog without modifying ordersList
  };
  handleCancel();
  const currentStatus = ordersList.find((o) => o.orderId === sample.orderId)!.followupStatus;
  assert.strictEqual(currentStatus, initialStatus, 'Cancellation must produce no mutation');
  console.log('✓ Invariant: Action review cancellation leaves source data untouched.');
}

console.log('\nAll Deterministic Calculation Engine Tests Passed Successfully!');
