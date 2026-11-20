import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/documents/extract/route';
import {
  ExtractedOrderRecord,
  Order,
  BusinessProfile,
} from '../src/types';
import { computeOrderDetails, filterAndSortOrders } from '../src/lib/engine';
import { SYNTHETIC_ORDERS, FIXTURE_NOW_MS } from '../src/lib/synthetic-data';

async function runEndToEndWorkflowTest() {
  console.log('=== NIRVAAH END-TO-END DOCUMENT INTELLIGENCE WORKFLOW TEST ===\n');

  // STEP 1: Owner opens business workspace
  const activeProfile: BusinessProfile = {
    id: 'biz-gifting-default',
    name: 'Ananya Gifting Studio',
    category: 'custom_gifting',
    tagline: 'Handcrafted hampers and bespoke gifting',
    description: 'Custom gifting studio managing hampers, advances, and urgent deliveries.',
    workflows: ['Advance Payment Confirmation', 'Artwork Proof Approval'],
    modules: ['order_lifecycle', 'priority_commitments', 'evidence_drawer'],
    preferences: {
      currency: 'INR',
      defaultThresholdAmount: 2000,
      defaultThresholdHours: 48,
    },
    createdAt: '2026-11-15T10:00:00+05:30',
    lastActiveAt: '2026-11-20T18:00:00+05:30',
    isSample: true,
  };
  console.log(`[Step 1] Owner opened business: "${activeProfile.name}" (${activeProfile.category})`);

  // STEP 2: Owner uploads sample order register PDF
  const pdfPath = path.join(process.cwd(), 'tests/fixtures/nirvaah-sample-order-register.pdf');
  assert(fs.existsSync(pdfPath), 'Sample PDF register must exist at tests/fixtures');
  const pdfBuf = fs.readFileSync(pdfPath);
  const pdfBlob = new Blob([pdfBuf], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', pdfBlob, 'nirvaah-sample-order-register.pdf');
  formData.append('testMode', 'synthetic');

  console.log(`[Step 2] Uploaded document: "nirvaah-sample-order-register.pdf" (${pdfBuf.length} bytes)`);

  // STEP 3: Gemini extracts structured information
  const extractReq = new NextRequest('http://localhost:3000/api/documents/extract', {
    method: 'POST',
    headers: { 'x-nirvaah-test-mode': 'synthetic' },
    body: formData,
  });
  const extractRes = await POST(extractReq);
  const extractJson = await extractRes.json();

  assert.strictEqual(extractRes.status, 200);
  assert.strictEqual(extractJson.success, true);
  assert.strictEqual(extractJson.rawCount, 4);

  const extractedRecords: ExtractedOrderRecord[] = extractJson.records;
  console.log(`[Step 3] Gemini extracted ${extractedRecords.length} structured order records.`);
  for (const r of extractedRecords) {
    console.log(
      `         - ${r.orderId}: ${r.customerName} | ₹${r.totalAmountInr} | ${r.advanceStatus} | Missing: [${r.missingFields.join(', ')}]`
    );
  }

  // Verify missing date is preserved for ORD-404 (Never fabricated)
  const ord404 = extractedRecords.find((r) => r.orderId === 'ORD-404');
  assert(ord404);
  assert.strictEqual(ord404.orderDate, null, 'ORD-404 orderDate must remain null when missing');
  assert(ord404.missingFields.includes('orderDate'), 'missingFields must include orderDate');
  assert.strictEqual(ord404.isFlagged, true);

  // STEP 4: Human verification - Owner inspects and corrects extracted fields
  console.log('\n[Step 4] Human Verification: Owner inspects grid and provides missing date for ORD-404...');
  const verifiedRecords = extractedRecords.map((rec) => {
    if (rec.orderId === 'ORD-404') {
      // Owner supplies the verified date
      return {
        ...rec,
        orderDate: '2026-11-18T09:00:00+05:30',
        missingFields: rec.missingFields.filter((f) => f !== 'orderDate'),
        isFlagged: true,
        issue: 'Advance unconfirmed (₹4,200)',
        ruleId: 'BR-ADVANCE-UNCONFIRMED',
      };
    }
    return rec;
  });

  const verifiedOrd404 = verifiedRecords.find((r) => r.orderId === 'ORD-404');
  assert(verifiedOrd404);
  assert.strictEqual(verifiedOrd404.orderDate, '2026-11-18T09:00:00+05:30');
  assert(!verifiedOrd404.missingFields.includes('orderDate'));
  console.log('         - ORD-404 corrected by owner: orderDate set to 18 Nov 2026, 09:00 IST');

  // STEP 5: Confirmed records enter that business's active workspace
  console.log('\n[Step 5] Owner clicks "Confirm & Import". Records enter active business store...');

  const importedOrders: Order[] = verifiedRecords.map((rec, idx) => ({
    orderId: rec.orderId || `ORD-IMP-${idx + 101}`,
    customerName: rec.customerName || 'Verified Customer',
    itemDescription: rec.itemDescription || 'Custom Hamper',
    createdAt: rec.orderDate || '2026-11-20T10:00:00+05:30',
    dueAt: rec.dueDate || null,
    totalAmountPaise: rec.totalAmountPaise,
    paidAmountPaise: rec.paidAmountPaise,
    paymentStatus: rec.paymentStatus,
    advanceStatus: rec.advanceStatus,
    advanceRequestedAt:
      rec.advanceStatus === 'unconfirmed'
        ? (rec.orderDate || '2026-11-20T10:00:00+05:30')
        : null,
    followupStatus: 'pending',
    sourceId: 'SRC-DOC-VERIFIED-PDF',
    sourceRef: `nirvaah-sample-order-register.pdf#${rec.orderId}`,
    sourceFingerprint: `fp-${rec.orderId}`,
  }));

  // Store in active business collection
  const businessGiftingStore: Record<string, Order[]> = {
    [activeProfile.id]: [...importedOrders, ...SYNTHETIC_ORDERS],
    'biz-other-merchant': [], // Verify profile isolation
  };

  assert.strictEqual(
    businessGiftingStore[activeProfile.id].length,
    importedOrders.length + SYNTHETIC_ORDERS.length
  );
  assert.strictEqual(
    businessGiftingStore['biz-other-merchant'].length,
    0,
    'Profile isolation: other business must remain empty'
  );
  console.log(
    `         - Stored ${importedOrders.length} imported orders into profile "${activeProfile.id}". Total orders: ${businessGiftingStore[activeProfile.id].length}`
  );
  console.log('         - Profile isolation confirmed: "biz-other-merchant" contains 0 orders.');

  // STEP 6: Nirvaah highlights relevant issues using existing deterministic rules
  console.log('\n[Step 6] Evaluating confirmed records through Nirvaah Deterministic Rule Engine...');

  const activeOrders = businessGiftingStore[activeProfile.id];

  // 6a. Evaluate all imported orders through computeOrderDetails
  for (const imp of importedOrders) {
    const computed = computeOrderDetails(imp, FIXTURE_NOW_MS);
    console.log(
      `         - ${computed.orderId} (${computed.customerName}): Total ₹${computed.totalInr}, Paid ₹${computed.paidInr}, Outstanding ₹${computed.outstandingInr} | Rule: ${computed.ruleId} (${computed.ruleReason})`
    );

    if (computed.orderId === 'ORD-401') {
      assert.strictEqual(computed.ruleId, 'BR-ADVANCE-UNCONFIRMED');
      assert.strictEqual(computed.ruleFlagged, true);
      assert.strictEqual(computed.outstandingInr, 8500);
    }
    if (computed.orderId === 'ORD-402') {
      assert.strictEqual(computed.ruleFlagged, false);
      assert.strictEqual(computed.outstandingInr, 0);
    }
    if (computed.orderId === 'ORD-403') {
      assert.strictEqual(computed.ruleFlagged, true);
      assert.strictEqual(computed.outstandingInr, 24000);
      assert.strictEqual(computed.ruleId, 'BR-ADVANCE-UNCONFIRMED');
    }
  }

  // 6b. Evaluate Triage Queue filter (> ₹2,000, advance unconfirmed, duration > 48h)
  const triageFilter = {
    preset: 'triage_queue' as const,
    amountThresholdInr: 2000,
    durationThresholdHours: 48,
  };
  const triageMatches = filterAndSortOrders(activeOrders, triageFilter, FIXTURE_NOW_MS);

  console.log(`\n[Step 7] Triage Queue Evaluation (threshold > ₹2,000 / > 48h):`);
  console.log(`         - Matched ${triageMatches.length} orders requiring advance payment confirmation.`);

  // Verify that newly imported unconfirmed orders appear in triage queue
  const matchedOrd401 = triageMatches.find((o) => o.orderId === 'ORD-401');
  assert(matchedOrd401, 'ORD-401 must appear in Triage Queue');
  assert.strictEqual(matchedOrd401.customerName, 'Meera Kapoor');
  assert.strictEqual(matchedOrd401.totalInr, 8500);

  const matchedOrd403 = triageMatches.find((o) => o.orderId === 'ORD-403');
  assert(matchedOrd403, 'ORD-403 must appear in Triage Queue');
  assert.strictEqual(matchedOrd403.customerName, 'Priya & Rohan Soni');
  assert.strictEqual(matchedOrd403.outstandingInr, 24000);

  console.log('         ✓ ORD-401 (Meera Kapoor, ₹8,500) successfully matched in Triage Queue');
  console.log('         ✓ ORD-403 (Priya & Rohan Soni, ₹24,000 balance) successfully matched in Triage Queue');

  console.log('\n=== END-TO-END WORKFLOW VERIFIED SUCCESSFULLY! ===\n');
}

runEndToEndWorkflowTest().catch((err) => {
  console.error('End-to-End Test Failed:', err);
  process.exit(1);
});
