import {
  BusinessProfile,
  BusinessCategory,
  ChatThread,
  DocumentRecord,
  Order,
  WholesaleOrderRecord,
  GroceryStockRecord,
  ServiceProjectRecord,
} from '../types';
import { SYNTHETIC_ORDERS } from './synthetic-data';

const STORAGE_KEY = 'nirvaah_v2_state';

export interface NirvaahAppState {
  profiles: BusinessProfile[];
  activeProfileId: string | null;
  threads: Record<string, ChatThread[]>;
  activeThreadId: Record<string, string | null>;
  giftingOrders: Record<string, Order[]>;
  wholesaleRecords: Record<string, WholesaleOrderRecord[]>;
  groceryRecords: Record<string, GroceryStockRecord[]>;
  serviceRecords: Record<string, ServiceProjectRecord[]>;
  documents: Record<string, DocumentRecord[]>;
}

/* -------------------------------------------------------------------------- */
/* SEED DATA FOR ALL 4 SUPPORTED BUSINESS CATEGORIES                          */
/* -------------------------------------------------------------------------- */

export const INITIAL_GIFTING_PROFILE: BusinessProfile = {
  id: 'biz-gifting-default',
  name: 'Ananya Gifting Studio',
  category: 'custom_gifting',
  tagline: 'Handcrafted hampers, bespoke keepsakes, and personalized gifting',
  description:
    'Custom gifting studio managing personalized gift hampers, advance deposit verifications, artwork proofs, and urgent courier delivery commitments.',
  workflows: [
    'Advance Payment Confirmation (>₹2,000 / >48h)',
    'Digital Artwork & Proof Approval',
    'Hamper Production & Custom Assembly',
    'Fragile Courier & Dispatch Commitments',
  ],
  modules: [
    'order_lifecycle',
    'priority_commitments',
    'payment_exposure',
    'evidence_drawer',
    'action_panel',
  ],
  preferences: {
    currency: 'INR',
    defaultThresholdAmount: 2000,
    defaultThresholdHours: 48,
  },
  createdAt: '2026-11-15T10:00:00+05:30',
  lastActiveAt: '2026-11-20T18:00:00+05:30',
  isSample: true,
};

export const INITIAL_WHOLESALE_RECORDS: WholesaleOrderRecord[] = [
  {
    id: 'WHL-801',
    retailerName: 'Metro HyperMarket Vashi',
    contactPerson: 'Suresh Singhania',
    orderValuePaise: 18500000, // ₹1,85,000
    paidAmountPaise: 5000000, // ₹50,000
    units: 420,
    itemDescription: 'Cotton Apparel Assorted Cartons (Bulk Grade A)',
    dispatchStatus: 'delayed',
    dispatchDueDate: '2026-11-18T16:00:00+05:30',
    supplierConfirmed: true,
    creditTermDays: 30,
    daysOutstanding: 45,
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-WHL-DISPATCH-DELAYED',
    ruleReason: 'Bulk dispatch overdue by 48h; transport booking awaiting confirmation',
    sourceRef: 'Wholesale_Ledger!B12:H12',
  },
  {
    id: 'WHL-802',
    retailerName: 'Kalyan Retail Hub Pune',
    contactPerson: 'Mahesh Deshpande',
    orderValuePaise: 9200000, // ₹92,000
    paidAmountPaise: 0,
    units: 180,
    itemDescription: 'Festive Packaging Trays & Decorative Boxes',
    dispatchStatus: 'pending_stock',
    dispatchDueDate: '2026-11-21T11:00:00+05:30',
    supplierConfirmed: false,
    creditTermDays: 15,
    daysOutstanding: 22,
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-WHL-SUPPLIER-UNCONFIRMED',
    ruleReason: 'Stock unconfirmed by raw material supplier; fulfillment blocked',
    sourceRef: 'Wholesale_Ledger!B13:H13',
  },
  {
    id: 'WHL-803',
    retailerName: 'Sagar Emporium Dadar',
    contactPerson: 'Kishore Shah',
    orderValuePaise: 14500000, // ₹1,45,000
    paidAmountPaise: 14500000, // Fully paid
    units: 300,
    itemDescription: 'Handloom Silk Scarves & Stoles Pack',
    dispatchStatus: 'packed',
    dispatchDueDate: '2026-11-20T17:00:00+05:30',
    supplierConfirmed: true,
    creditTermDays: 30,
    daysOutstanding: 5,
    followupStatus: 'reviewed',
    ruleFlagged: false,
    ruleId: 'BR-WHL-NORMAL',
    ruleReason: 'Packed and staged for evening logistics pickup',
    sourceRef: 'Wholesale_Ledger!B14:H14',
  },
  {
    id: 'WHL-804',
    retailerName: 'Navrang Bazar Thane',
    contactPerson: 'Ashok Patel',
    orderValuePaise: 7400000, // ₹74,000
    paidAmountPaise: 2000000,
    units: 150,
    itemDescription: 'Brass Diya & Festive Pooja Thali Sets',
    dispatchStatus: 'delayed',
    dispatchDueDate: '2026-11-19T14:00:00+05:30',
    supplierConfirmed: true,
    creditTermDays: 30,
    daysOutstanding: 38,
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-WHL-CREDIT-EXCEEDED',
    ruleReason: 'Credit term of 30 days exceeded (38 days overdue)',
    sourceRef: 'Wholesale_Ledger!B15:H15',
  },
];

export const INITIAL_GROCERY_RECORDS: GroceryStockRecord[] = [
  {
    id: 'GRO-301',
    productName: 'Organic A2 Gir Cow Milk (1L)',
    category: 'Dairy',
    stockUnits: 8,
    minReorderLevel: 25,
    unitPricePaise: 9500, // ₹95
    expiryDate: '2026-11-21T10:00:00+05:30',
    hoursUntilExpiry: 16,
    expiryStatus: 'expiring_soon',
    supplierName: 'Vrindavan Farms Nashik',
    reorderStatus: 'reorder_needed',
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-GROCERY-EXPIRY-CRITICAL',
    ruleReason: 'Short shelf life (<24 hours) & stock below 25-unit safety buffer',
    sourceRef: 'Inventory_Sheet!A4:G4',
  },
  {
    id: 'GRO-302',
    productName: 'Sourdough Country Loaf (400g)',
    category: 'Bakery',
    stockUnits: 3,
    minReorderLevel: 15,
    unitPricePaise: 14000, // ₹140
    expiryDate: '2026-11-21T18:00:00+05:30',
    hoursUntilExpiry: 24,
    expiryStatus: 'expiring_soon',
    supplierName: 'Artisan Bakehouse Bandra',
    reorderStatus: 'reorder_needed',
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-GROCERY-LOW-STOCK',
    ruleReason: 'Critical low stock (3 left, min 15); urgent evening replenishment',
    sourceRef: 'Inventory_Sheet!A5:G5',
  },
  {
    id: 'GRO-303',
    productName: 'Ratnagiri Alphonso Pulp (850g Tin)',
    category: 'Produce',
    stockUnits: 48,
    minReorderLevel: 20,
    unitPricePaise: 38000, // ₹380
    expiryDate: '2027-04-30T00:00:00+05:30',
    hoursUntilExpiry: 3800,
    expiryStatus: 'good',
    supplierName: 'Konkan Agro Co-op',
    reorderStatus: 'sufficient',
    followupStatus: 'reviewed',
    ruleFlagged: false,
    ruleId: 'BR-GROCERY-HEALTHY',
    ruleReason: 'Healthy stock buffer and 6-month shelf stability',
    sourceRef: 'Inventory_Sheet!A6:G6',
  },
  {
    id: 'GRO-304',
    productName: 'Stone-Ground Khapli Wheat Flour (5kg)',
    category: 'Grains',
    stockUnits: 4,
    minReorderLevel: 18,
    unitPricePaise: 42000, // ₹420
    expiryDate: '2027-02-15T00:00:00+05:30',
    hoursUntilExpiry: 2000,
    expiryStatus: 'good',
    supplierName: 'Sahyadri Natural Staples',
    reorderStatus: 'reorder_needed',
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-GROCERY-REORDER-URGENT',
    ruleReason: 'Fast-moving pantry staple below reorder threshold (4 of 18)',
    sourceRef: 'Inventory_Sheet!A7:G7',
  },
];

export const INITIAL_SERVICE_RECORDS: ServiceProjectRecord[] = [
  {
    id: 'PRJ-101',
    projectName: 'Kaveri Living E-commerce & Identity',
    clientName: 'Kaveri Lifestyle Pvt Ltd',
    contractValuePaise: 45000000, // ₹4,50,000
    paidAmountPaise: 20000000, // ₹2,00,000
    currentMilestone: 'Production Design Tokens & Checkout Flow',
    milestoneStatus: 'client_review',
    deadline: '2026-11-19T18:00:00+05:30',
    daysRemaining: -1,
    deliverableStatus: 'at_risk',
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-SERVICE-MILESTONE-OVERDUE',
    ruleReason: 'Sign-off pending from client for 48h; development phase on hold',
    sourceRef: 'Project_Tracker!C2:J2',
  },
  {
    id: 'PRJ-102',
    projectName: 'FinPulse Brand Guidelines & App System',
    clientName: 'FinPulse Technologies',
    contractValuePaise: 68000000, // ₹6,80,000
    paidAmountPaise: 34000000,
    currentMilestone: 'Sprint 3 Design Review & Component Audit',
    milestoneStatus: 'in_progress',
    deadline: '2026-11-23T17:00:00+05:30',
    daysRemaining: 3,
    deliverableStatus: 'on_track',
    followupStatus: 'reviewed',
    ruleFlagged: false,
    ruleId: 'BR-SERVICE-HEALTHY',
    ruleReason: 'Deliverables on track for Monday sprint review',
    sourceRef: 'Project_Tracker!C3:J3',
  },
  {
    id: 'PRJ-103',
    projectName: 'AyurVeda Health Portal Redesign',
    clientName: 'AyurVeda Wellness India',
    contractValuePaise: 32000000, // ₹3,20,000
    paidAmountPaise: 8000000,
    currentMilestone: 'Milestone 2 Invoicing & Milestone 3 Kickoff',
    milestoneStatus: 'invoiced',
    deadline: '2026-11-16T12:00:00+05:30',
    daysRemaining: -4,
    deliverableStatus: 'blocked',
    followupStatus: 'pending',
    ruleFlagged: true,
    ruleId: 'BR-SERVICE-INVOICE-OVERDUE',
    ruleReason: 'Milestone invoice of ₹1,60,000 unpaid for 14 days; Milestone 3 gated',
    sourceRef: 'Project_Tracker!C4:J4',
  },
];

/* -------------------------------------------------------------------------- */
/* STATE MANAGEMENT                                                           */
/* -------------------------------------------------------------------------- */

export function getEmptyAppState(): NirvaahAppState {
  return {
    profiles: [],
    activeProfileId: null,
    threads: {},
    activeThreadId: {},
    giftingOrders: {},
    wholesaleRecords: {},
    groceryRecords: {},
    serviceRecords: {},
    documents: {},
  };
}

export function getSampleDemoState(): NirvaahAppState {
  const initialThread: ChatThread = {
    id: 'th-default-gifting',
    businessId: INITIAL_GIFTING_PROFILE.id,
    title: 'Daily 6 PM Order Triage',
    createdAt: '2026-11-20T17:00:00+05:30',
    updatedAt: '2026-11-20T18:00:00+05:30',
    messages: [
      {
        id: 'msg-seed-1',
        sender: 'user',
        text: 'Which customer orders need attention?',
        timestamp: '2026-11-20T17:30:00+05:30',
      },
      {
        id: 'msg-seed-2',
        sender: 'nirvaah',
        text: 'Evaluated 20 custom orders. 9 priority orders require advance confirmation (>₹2,000 / >48h wait).',
        timestamp: '2026-11-20T17:30:02+05:30',
      },
    ],
  };

  const initialDoc: DocumentRecord = {
    id: 'doc-seed-01',
    businessId: INITIAL_GIFTING_PROFILE.id,
    name: 'Sample_Gifting_Orders_Nov2026.csv',
    fileType: 'text/csv',
    fileSize: 14250,
    uploadedAt: '2026-11-20T16:00:00+05:30',
    status: 'verified',
    extractedCount: 20,
    issuesCount: 2,
    rows: SYNTHETIC_ORDERS,
    verificationNotes: '20 valid rows parsed. 2 quarantined rows placed in Needs Review.',
  };

  return {
    profiles: [INITIAL_GIFTING_PROFILE],
    activeProfileId: INITIAL_GIFTING_PROFILE.id,
    threads: {
      [INITIAL_GIFTING_PROFILE.id]: [initialThread],
    },
    activeThreadId: {
      [INITIAL_GIFTING_PROFILE.id]: initialThread.id,
    },
    giftingOrders: {
      [INITIAL_GIFTING_PROFILE.id]: SYNTHETIC_ORDERS,
    },
    wholesaleRecords: {},
    groceryRecords: {},
    serviceRecords: {},
    documents: {
      [INITIAL_GIFTING_PROFILE.id]: [initialDoc],
    },
  };
}

export function getDefaultAppState(): NirvaahAppState {
  return getEmptyAppState();
}

export function loadAppState(): NirvaahAppState {
  if (typeof window === 'undefined') {
    return getEmptyAppState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const emptyState = getEmptyAppState();
      saveAppState(emptyState);
      return emptyState;
    }
    const parsed = JSON.parse(raw) as NirvaahAppState;
    if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
      return getEmptyAppState();
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse Nirvaah app state from storage, resetting:', err);
    const emptyState = getEmptyAppState();
    saveAppState(emptyState);
    return emptyState;
  }
}

export function saveAppState(state: NirvaahAppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist Nirvaah app state to localStorage:', err);
  }
}

/**
 * Creates a new business profile in the local application state.
 * Enforces the free tier limit of 2 business profiles.
 */
export function createNewBusinessProfile(
  currentState: NirvaahAppState,
  params: {
    name: string;
    category: BusinessCategory;
    description: string;
    tagline?: string;
    workflows?: string[];
    modules?: string[];
  }
): { success: boolean; state: NirvaahAppState; profileId?: string; error?: string } {
  if (currentState.profiles.length >= 2) {
    return {
      success: false,
      state: currentState,
      error: 'Free tier supports up to 2 businesses. Delete an existing business or switch between your 2 profiles.',
    };
  }

  const profileId = `biz-${params.category}-${Date.now().toString(36)}`;
  const nowIso = new Date().toISOString();

  let workflows: string[] = params.workflows || [];
  let modules: string[] = params.modules || [];
  let tagline = params.tagline || '';

  if (params.category === 'custom_gifting') {
    tagline = tagline || 'Personalized gift hampers, advance tracking, and custom artwork approvals';
    workflows = workflows.length ? workflows : [
      'Advance Payment Confirmation (>₹2,000 / >48h)',
      'Artwork Approval & Custom Proofs',
      'Hamper Production & Dispatch Deadlines',
    ];
    modules = modules.length ? modules : ['order_lifecycle', 'priority_commitments', 'payment_exposure'];
  } else if (params.category === 'wholesale_distribution') {
    tagline = tagline || 'B2B bulk fulfillment, dispatch tracking, and retailer credit exposure';
    workflows = workflows.length ? workflows : [
      'Retailer Bulk Order Fulfillment',
      'Supplier Confirmation Check',
      'Dispatch Queue & Logistics Escalation',
      '30-Day Credit Aging Follow-up',
    ];
    modules = modules.length ? modules : ['dispatch_queue', 'retailer_exposure', 'summary_cards'];
  } else if (params.category === 'grocery_retail') {
    tagline = tagline || 'Fresh inventory, fast-moving dairy & produce, and expiry risk monitoring';
    workflows = workflows.length ? workflows : [
      'Daily Expiry Horizon (<24h / <72h)',
      'Reorder Threshold Alerts',
      'Supplier Restock Replenishment',
      'Batch Clearance Management',
    ];
    modules = modules.length ? modules : ['stock_watch', 'expiry_review', 'summary_cards'];
  } else {
    tagline = tagline || 'Milestone deliverables, client design reviews, and invoice aging';
    workflows = workflows.length ? workflows : [
      'Milestone Sign-off & Client Approvals',
      'Sprint Deliverable Health',
      'Outstanding Invoice Aging',
      'Deadline Review',
    ];
    modules = modules.length ? modules : ['active_projects', 'invoice_aging', 'summary_cards'];
  }

  const newProfile: BusinessProfile = {
    id: profileId,
    name: params.name,
    category: params.category,
    tagline,
    description: params.description,
    workflows,
    modules,
    preferences: {
      currency: 'INR',
      defaultThresholdAmount: params.category === 'wholesale_distribution' ? 25000 : 2000,
      defaultThresholdHours: 48,
    },
    createdAt: nowIso,
    lastActiveAt: nowIso,
    isSample: false,
  };

  const initialThread: ChatThread = {
    id: `th-${profileId}-1`,
    businessId: profileId,
    title: 'Workspace Onboarding',
    createdAt: nowIso,
    updatedAt: nowIso,
    messages: [
      {
        id: `msg-${Date.now()}-1`,
        sender: 'user',
        text: params.description,
        timestamp: nowIso,
      },
      {
        id: `msg-${Date.now()}-2`,
        sender: 'nirvaah',
        text: `Workspace generated for ${params.name}. Adapted operational modules loaded for ${params.category.replace('_', ' ')}.`,
        timestamp: nowIso,
      },
    ],
  };

  const nextState: NirvaahAppState = {
    ...currentState,
    profiles: [...currentState.profiles, newProfile],
    activeProfileId: profileId,
    threads: {
      ...currentState.threads,
      [profileId]: [initialThread],
    },
    activeThreadId: {
      ...currentState.activeThreadId,
      [profileId]: initialThread.id,
    },
    giftingOrders: {
      ...currentState.giftingOrders,
      [profileId]: params.category === 'custom_gifting' ? SYNTHETIC_ORDERS : [],
    },
    wholesaleRecords: {
      ...currentState.wholesaleRecords,
      [profileId]: params.category === 'wholesale_distribution' ? INITIAL_WHOLESALE_RECORDS : [],
    },
    groceryRecords: {
      ...currentState.groceryRecords,
      [profileId]: params.category === 'grocery_retail' ? INITIAL_GROCERY_RECORDS : [],
    },
    serviceRecords: {
      ...currentState.serviceRecords,
      [profileId]: params.category === 'service_project' ? INITIAL_SERVICE_RECORDS : [],
    },
    documents: {
      ...currentState.documents,
      [profileId]: [],
    },
  };

  saveAppState(nextState);
  return { success: true, state: nextState, profileId };
}
