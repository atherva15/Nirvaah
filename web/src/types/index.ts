export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'unknown';
export type AdvanceStatus = 'unconfirmed' | 'confirmed' | 'not_required' | 'unknown';
export type ContactPermission = 'allowed' | 'denied' | 'unknown';
export type FollowupStatus = 'pending' | 'drafted' | 'reviewed' | 'contacted';

export interface Order {
  orderId: string;
  customerName: string;
  itemDescription?: string;
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

export type TaskIntent = 'advance_followup' | 'outstanding_exposure' | 'custom_query' | 'clarify';
export type WorkspaceLayout = 'triage_queue' | 'exposure_summary' | 'business_overview';

export type RegisteredModuleId =
  | 'summary_cards'
  | 'threshold_controls'
  | 'orders_table'
  | 'grouped_queue'
  | 'needs_review'
  | 'evidence_drawer'
  | 'action_panel'
  | 'order_lifecycle'
  | 'priority_commitments'
  | 'dispatch_queue'
  | 'retailer_exposure'
  | 'stock_watch'
  | 'expiry_review'
  | 'active_projects'
  | 'invoice_aging';

export interface WorkspacePlan {
  planId: string;
  plannerSource: 'deterministic_demo' | 'gemini';
  query: string;
  intent: TaskIntent | string;
  preset: TaskPreset;
  layout: WorkspaceLayout | string;
  title: string;
  description: string;
  rationale: string;
  modules: (RegisteredModuleId | string)[];
  filterState: TaskFilterState;
  supported?: boolean;
  unsupportedMessage?: string;
  businessCategory?: BusinessCategory;
}

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
  order: ComputedOrder | unknown;
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

/* ========================================================================= */
/* NIRVAAH V2: Business Profiles, Multi-Domain Workspaces & Onboarding Types */
/* ========================================================================= */

export type BusinessCategory =
  | 'custom_gifting'
  | 'wholesale_distribution'
  | 'grocery_retail'
  | 'service_project';

export interface BusinessProfile {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  tagline: string;
  workflows: string[];
  modules: string[];
  preferences: {
    currency: string;
    defaultThresholdAmount: number;
    defaultThresholdHours: number;
  };
  createdAt: string;
  lastActiveAt: string;
  isSample: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nirvaah';
  text: string;
  timestamp: string;
  plan?: WorkspacePlan;
  attachments?: {
    name: string;
    size: number;
    type: string;
  }[];
}

export interface ChatThread {
  id: string;
  businessId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface DocumentRecord {
  id: string;
  businessId: string;
  name: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status:
    | 'selected'
    | 'processing'
    | 'extracted'
    | 'needs_confirmation'
    | 'verified'
    | 'failed'
    | 'unsupported';
  extractedCount: number;
  issuesCount: number;
  rows: unknown[];
  verificationNotes?: string;
}

export interface ExtractedOrderRecord {
  orderId: string | null;
  customerName: string | null;
  itemDescription?: string | null;
  orderDate: string | null;
  dueDate?: string | null;
  totalAmountInr: number | null;
  paidAmountInr: number | null;
  totalAmountPaise: number;
  paidAmountPaise: number;
  outstandingPaise: number;
  outstandingInr: number;
  paymentStatus: PaymentStatus;
  advanceStatus: AdvanceStatus;
  sourceEvidence: string;
  missingFields: string[];
  uncertainFields: string[];
  notes?: string | null;
  isFlagged: boolean;
  issue?: string;
  ruleId?: string;
}

export interface DocumentExtractResponse {
  success: boolean;
  model?: string;
  rawCount?: number;
  records?: ExtractedOrderRecord[];
  error?: string;
  code?: string;
  missingApiKey?: boolean;
  metadata?: {
    filename: string;
    fileSize: number;
    mimeType: string;
    extractedAt: string;
    processingTimeMs: number;
  };
}

/* Domain-Specific Operational Record Schemas */

export interface WholesaleOrderRecord {
  id: string;
  retailerName: string;
  contactPerson: string;
  orderValuePaise: number;
  paidAmountPaise: number;
  units: number;
  itemDescription: string;
  dispatchStatus: 'pending_stock' | 'packed' | 'dispatched' | 'delivered' | 'delayed';
  dispatchDueDate: string;
  supplierConfirmed: boolean;
  creditTermDays: number;
  daysOutstanding: number;
  followupStatus: 'pending' | 'reviewed';
  ruleFlagged?: boolean;
  ruleReason?: string;
  ruleId?: string;
  sourceRef: string;
}

export interface GroceryStockRecord {
  id: string;
  productName: string;
  category: 'Dairy' | 'Produce' | 'Grains' | 'Bakery' | 'Beverages';
  stockUnits: number;
  minReorderLevel: number;
  unitPricePaise: number;
  expiryDate: string;
  hoursUntilExpiry: number;
  expiryStatus: 'good' | 'expiring_soon' | 'expired';
  supplierName: string;
  reorderStatus: 'sufficient' | 'reorder_needed' | 'ordered';
  followupStatus: 'pending' | 'reviewed';
  ruleFlagged?: boolean;
  ruleReason?: string;
  ruleId?: string;
  sourceRef: string;
}

export interface ServiceProjectRecord {
  id: string;
  projectName: string;
  clientName: string;
  contractValuePaise: number;
  paidAmountPaise: number;
  currentMilestone: string;
  milestoneStatus: 'in_progress' | 'client_review' | 'approved' | 'invoiced';
  deadline: string;
  daysRemaining: number;
  deliverableStatus: 'on_track' | 'pending_approval' | 'at_risk' | 'delayed' | 'blocked';
  followupStatus: 'pending' | 'reviewed';
  ruleFlagged?: boolean;
  ruleReason?: string;
  ruleId?: string;
  sourceRef: string;
}
