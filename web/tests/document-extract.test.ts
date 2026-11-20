import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST } from '../src/app/api/documents/extract/route';
import { ExtractedOrderRecord } from '../src/types';

async function runTests() {
  console.log('--- Starting Nirvaah Gemini Document Extract API Tests ---\n');

  // Test 1: Missing file returns 400
  {
    const emptyFormData = new FormData();
    const req = new NextRequest('http://localhost:3000/api/documents/extract', {
      method: 'POST',
      body: emptyFormData,
    });
    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 400, 'Expected status 400 for missing file');
    assert.strictEqual(json.code, 'FILE_MISSING');
    console.log('✓ Test 1 Passed: Missing file returns 400 FILE_MISSING');
  }

  // Test 2: Unsupported MIME type returns 400
  {
    const formData = new FormData();
    const badBlob = new Blob(['hello world'], { type: 'text/html' });
    formData.append('file', badBlob, 'test.html');
    const req = new NextRequest('http://localhost:3000/api/documents/extract', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 400, 'Expected status 400 for unsupported file');
    assert.strictEqual(json.code, 'INVALID_FILE_TYPE');
    console.log('✓ Test 2 Passed: Unsupported MIME type returns 400 INVALID_FILE_TYPE');
  }

  // Test 3: Missing API Key returns 503 (when not in test mode)
  {
    const originalKey = process.env.GEMINI_API_KEY;
    const originalGoogleKey = process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    const pdfPath = path.join(process.cwd(), 'tests/fixtures/nirvaah-sample-order-register.pdf');
    const pdfBuf = fs.readFileSync(pdfPath);
    const blob = new Blob([pdfBuf], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'sample-register.pdf');

    const req = new NextRequest('http://localhost:3000/api/documents/extract', {
      method: 'POST',
      body: formData,
    });
    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 503, 'Expected status 503 when API key is missing');
    assert.strictEqual(json.code, 'MISSING_API_KEY');
    assert.strictEqual(json.missingApiKey, true);
    console.log('✓ Test 3 Passed: Missing API key returns 503 MISSING_API_KEY with missingApiKey: true');

    // Restore env
    if (originalKey) process.env.GEMINI_API_KEY = originalKey;
    if (originalGoogleKey) process.env.GOOGLE_API_KEY = originalGoogleKey;
  }

  // Test 4: Synthetic Test Mode extraction with real sample PDF
  {
    const pdfPath = path.join(process.cwd(), 'tests/fixtures/nirvaah-sample-order-register.pdf');
    const pdfBuf = fs.readFileSync(pdfPath);
    const blob = new Blob([pdfBuf], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'nirvaah-sample-order-register.pdf');
    formData.append('testMode', 'synthetic');

    const req = new NextRequest('http://localhost:3000/api/documents/extract', {
      method: 'POST',
      headers: {
        'x-nirvaah-test-mode': 'synthetic',
      },
      body: formData,
    });
    const res = await POST(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200, 'Expected status 200 in synthetic test mode');
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.rawCount, 4, 'Expected 4 extracted records');
    assert(Array.isArray(json.records), 'Records should be an array');

    const records: ExtractedOrderRecord[] = json.records;

    // Test 4a: Deterministic integer paise arithmetic
    const ord401 = records.find((r) => r.orderId === 'ORD-401');
    assert(ord401, 'ORD-401 should exist');
    assert.strictEqual(ord401.totalAmountInr, 8500);
    assert.strictEqual(ord401.totalAmountPaise, 850000);
    assert.strictEqual(ord401.paidAmountPaise, 0);
    assert.strictEqual(ord401.outstandingPaise, 850000);
    assert.strictEqual(ord401.outstandingInr, 8500);
    assert.strictEqual(ord401.advanceStatus, 'unconfirmed');
    assert.strictEqual(ord401.isFlagged, true);
    assert.strictEqual(ord401.ruleId, 'BR-ADVANCE-UNCONFIRMED');
    console.log('✓ Test 4a Passed: ORD-401 integer paise math & advance unconfirmed flag verified');

    // Test 4b: Confirmed paid order
    const ord402 = records.find((r) => r.orderId === 'ORD-402');
    assert(ord402, 'ORD-402 should exist');
    assert.strictEqual(ord402.totalAmountInr, 18000);
    assert.strictEqual(ord402.paidAmountInr, 18000);
    assert.strictEqual(ord402.outstandingPaise, 0);
    assert.strictEqual(ord402.isFlagged, false);
    console.log('✓ Test 4b Passed: ORD-402 confirmed paid order verified with zero balance');

    // Test 4c: Outstanding exposure order
    const ord403 = records.find((r) => r.orderId === 'ORD-403');
    assert(ord403, 'ORD-403 should exist');
    assert.strictEqual(ord403.totalAmountInr, 34000);
    assert.strictEqual(ord403.paidAmountInr, 10000);
    assert.strictEqual(ord403.outstandingPaise, 2400000);
    assert.strictEqual(ord403.outstandingInr, 24000);
    assert.strictEqual(ord403.isFlagged, true);
    console.log('✓ Test 4c Passed: ORD-403 partial advance & outstanding exposure ₹24,000 verified');

    // Test 4d: Invariant: Dates are NEVER fabricated when missing
    const ord404 = records.find((r) => r.orderId === 'ORD-404');
    assert(ord404, 'ORD-404 should exist');
    assert.strictEqual(ord404.orderDate, null, 'ORD-404 orderDate must remain null when missing');
    assert(ord404.missingFields.includes('orderDate'), 'missingFields must include orderDate');
    assert.strictEqual(ord404.isFlagged, true);
    assert.strictEqual(ord404.ruleId, 'ORD-INCOMPLETE');
    console.log('✓ Test 4d Passed: Invariant preserved: Missing orderDate is NOT fabricated and flagged');
  }

  // Test 5: Test with PNG sample image
  {
    const pngPath = path.join(process.cwd(), 'tests/fixtures/nirvaah-sample-order-register.png');
    const pngBuf = fs.readFileSync(pngPath);
    const blob = new Blob([pngBuf], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'sample-scan.png');
    formData.append('testMode', 'synthetic');

    const req = new NextRequest('http://localhost:3000/api/documents/extract', {
      method: 'POST',
      headers: { 'x-nirvaah-test-mode': 'synthetic' },
      body: formData,
    });
    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 200, 'Expected status 200 for PNG image');
    assert.strictEqual(json.metadata.mimeType, 'image/png');
    console.log('✓ Test 5 Passed: PNG image document successfully accepted and processed');
  }

  console.log('\n--- All 5 Document Extract API Tests Passed Successfully! ---\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
