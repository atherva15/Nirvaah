export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'unknown';
export type AdvanceStatus = 'unconfirmed' | 'confirmed' | 'not_required' | 'unknown';
export type ContactPermission = 'allowed' | 'denied' | 'unknown';
export type FollowupStatus = 'pending' | 'drafted' | 'reviewed' | 'contacted';

export interface Order {
  orderId: string;
  customerName: string;
  createdAt: string; // ISO-8601
  dueAt?: string | null; // P1
  totalAmountPaise: number; // Safe nonnegative integer
  paidAmountPaise: number; // Safe integer, 0..total
  paymentStatus: PaymentStatus;
  advanceStatus: AdvanceStatus;
  advanceRequestedAt: string | null;
  followupStatus: FollowupStatus;
  contactPermission?: ContactPermission;
  contactPhoneE164?: string | null;
  assignedTo?: string | null;
  sourceId: string;
  sourceRef: string;
  sourceFingerprint?: string;
}

export type TaskPreset = 'triage_queue' | 'exposure_summary';

export interface TaskFilterState {
  preset: TaskPreset;
  amountThresholdInr: number; // e.g. 2000 or 5000
  durationThresholdHours: number; // e.g. 48 or 72
}

export interface ComputedOrder extends Order {
  outstandingPaise: number;
  outstandingInr: number;
  totalInr: number;
  paidInr: number;
  orderAgeHours: number;
  advanceWaitHours: number | null;
  ruleFlagged: boolean;
  ruleReason: string;
  ruleId: string;
}

export interface SummaryMetrics {
  totalOrdersExamined: number;
  matchingCount: number;
  totalValueInr: number;
  totalOutstandingInr: number;
  unconfirmedAdvanceCount: number;
  criticalExceptionsCount: number;
}

export interface EvidenceDetails {
  order: ComputedOrder;
  ruleId: string;
  ruleDescription: string;
  calculationExplanation: string;
  sourceProvenance: {
    sourceId: string;
    sourceRef: string;
    mode: 'SYNTHETIC DEMO' | 'LIVE SHEET' | 'IMPORTED CSV';
    lastRefreshed: string;
  };
}

export interface ActionPreviewState {
  actionId: string;
  orderId: string;
  customerName: string;
  targetField: 'followup_status';
  expectedOldValue: 'pending';
  newValue: 'reviewed';
  status: 'idle' | 'preview' | 'applying' | 'succeeded' | 'failed' | 'cancelled';
  receipt?: ActionReceipt | null;
  errorMessage?: string;
}

export interface ActionReceipt {
  receiptId: string;
  orderId: string;
  targetField: string;
  previousValue: string;
  confirmedValue: string;
  actor: string;
  timestamp: string;
  sourceRef: string;
  integrityStatement: string;
}
