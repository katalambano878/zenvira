import assert from 'node:assert/strict';

function stripPaymentAttemptSuffix(externalRef) {
  return String(externalRef || '').replace(/-R\d+$/, '');
}

function isSuccessfulMoolreStatus(status) {
  const statusStr = String(status || '').toLowerCase();
  return ['success', 'successful', 'completed', 'paid'].includes(statusStr);
}

assert.equal(stripPaymentAttemptSuffix('ORD-123-456-R1710000000000'), 'ORD-123-456');
assert.equal(stripPaymentAttemptSuffix('ORD-123-456'), 'ORD-123-456');
assert.equal(isSuccessfulMoolreStatus('SUCCESSFUL'), true);
assert.equal(isSuccessfulMoolreStatus('failed'), false);
console.log('moolre helpers: ok');
