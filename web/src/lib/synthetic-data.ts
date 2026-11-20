import { Order } from '../types/index';

/**
 * P0 Synthetic Merchant Dataset
 * Label: SYNTHETIC DEMO (Clearly identified fixture data)
 * Pinned Clock Reference: 2026-11-20T18:00:00+05:30 (Daily 6 PM Closing)
 */
export const FIXTURE_NOW_ISO = '2026-11-20T18:00:00+05:30';
export const FIXTURE_NOW_MS = new Date(FIXTURE_NOW_ISO).getTime();

export const SYNTHETIC_ORDERS: Order[] = [
  {
    orderId: 'ORD-101',
    customerName: 'Ananya Sharma',
    createdAt: '2026-11-17T11:00:00+05:30', // ~79h ago
    totalAmountPaise: 450000, // ₹4,500
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-17T14:30:00+05:30', // ~75.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A2:I2',
  },
  {
    orderId: 'ORD-102',
    customerName: 'Rohit Mehta',
    createdAt: '2026-11-18T09:15:00+05:30', // ~56.75h ago
    totalAmountPaise: 280000, // ₹2,800
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-18T10:00:00+05:30', // ~56h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A3:I3',
  },
  {
    orderId: 'ORD-103',
    customerName: 'Pooja Iyer',
    createdAt: '2026-11-19T14:00:00+05:30', // ~28h ago
    totalAmountPaise: 350000, // ₹3,500
    paidAmountPaise: 100000, // ₹1,000
    paymentStatus: 'partially_paid',
    advanceStatus: 'confirmed',
    advanceRequestedAt: '2026-11-19T14:30:00+05:30',
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A4:I4',
  },
  {
    orderId: 'ORD-104',
    customerName: 'Vikram Malhotra',
    createdAt: '2026-11-16T16:00:00+05:30', // ~98h ago
    totalAmountPaise: 1250000, // ₹12,500
    paidAmountPaise: 250000, // ₹2,500
    paymentStatus: 'partially_paid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-16T17:00:00+05:30', // ~97h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A5:I5',
  },
  {
    orderId: 'ORD-105',
    customerName: 'Sneha Kulkarni',
    createdAt: '2026-11-18T16:45:00+05:30', // ~49.25h ago
    totalAmountPaise: 180000, // ₹1,800 (<₹2,000 threshold test)
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-18T17:00:00+05:30', // 49h wait
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A6:I6',
  },
  {
    orderId: 'ORD-106',
    customerName: 'Aarav Patel',
    createdAt: '2026-11-19T10:00:00+05:30', // ~32h ago
    totalAmountPaise: 620000, // ₹6,200
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-19T11:00:00+05:30', // ~31h wait (<48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A7:I7',
  },
  {
    orderId: 'ORD-107',
    customerName: 'Divya Nambiar',
    createdAt: '2026-11-15T12:00:00+05:30', // ~126h ago
    totalAmountPaise: 890000, // ₹8,900
    paidAmountPaise: 890000, // fully paid
    paymentStatus: 'paid',
    advanceStatus: 'confirmed',
    advanceRequestedAt: '2026-11-15T12:30:00+05:30',
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A8:I8',
  },
  {
    orderId: 'ORD-108',
    customerName: 'Kabir Oberoi',
    createdAt: '2026-11-17T18:00:00+05:30', // ~72h ago
    totalAmountPaise: 750000, // ₹7,500
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-17T18:30:00+05:30', // ~71.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A9:I9',
  },
  {
    orderId: 'ORD-109',
    customerName: 'Meera Deshmukh',
    createdAt: '2026-11-18T13:30:00+05:30', // ~52.5h ago
    totalAmountPaise: 540000, // ₹5,400
    paidAmountPaise: 100000, // ₹1,000 paid, ₹4,400 outstanding
    paymentStatus: 'partially_paid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-18T14:00:00+05:30', // ~52h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A10:I10',
  },
  {
    orderId: 'ORD-110',
    customerName: 'Zoya Khan',
    createdAt: '2026-11-19T16:00:00+05:30', // ~26h ago
    totalAmountPaise: 210000, // ₹2,100
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-19T16:30:00+05:30', // ~25.5h wait (<48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A11:I11',
  },
  {
    orderId: 'ORD-111',
    customerName: 'Arjun Singhania',
    createdAt: '2026-11-14T10:00:00+05:30', // ~152h ago (>72h)
    totalAmountPaise: 1500000, // ₹15,000
    paidAmountPaise: 500000, // ₹5,000 paid, ₹10,000 outstanding (>₹5,000)
    paymentStatus: 'partially_paid',
    advanceStatus: 'confirmed',
    advanceRequestedAt: '2026-11-14T10:30:00+05:30',
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A12:I12',
  },
  {
    orderId: 'ORD-112',
    customerName: 'Ishaan Verma',
    createdAt: '2026-11-17T08:00:00+05:30', // ~82h ago (>72h)
    totalAmountPaise: 680000, // ₹6,800
    paidAmountPaise: 0, // ₹6,800 outstanding (>₹5,000)
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-17T08:30:00+05:30', // ~81.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A13:I13',
  },
  {
    orderId: 'ORD-113',
    customerName: 'Kavita Chawla',
    createdAt: '2026-11-16T11:00:00+05:30', // ~103h ago (>72h)
    totalAmountPaise: 320000, // ₹3,200
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-16T11:30:00+05:30', // ~102.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A14:I14',
  },
  {
    orderId: 'ORD-114',
    customerName: 'Aditya Roy',
    createdAt: '2026-11-20T10:00:00+05:30', // ~8h ago
    totalAmountPaise: 420000, // ₹4,200
    paidAmountPaise: 420000, // fully paid
    paymentStatus: 'paid',
    advanceStatus: 'not_required',
    advanceRequestedAt: null,
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A15:I15',
  },
  {
    orderId: 'ORD-115',
    customerName: 'Tanvi Joshi',
    createdAt: '2026-11-18T11:00:00+05:30', // ~55h ago
    totalAmountPaise: 950000, // ₹9,500
    paidAmountPaise: 300000, // ₹3,000 paid, ₹6,500 outstanding
    paymentStatus: 'partially_paid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-18T11:30:00+05:30', // ~54.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A16:I16',
  },
  {
    orderId: 'ORD-116',
    customerName: 'Rhea Kapoor',
    createdAt: '2026-11-19T09:00:00+05:30', // ~33h ago
    totalAmountPaise: 1100000, // ₹11,000
    paidAmountPaise: 1100000,
    paymentStatus: 'paid',
    advanceStatus: 'confirmed',
    advanceRequestedAt: '2026-11-19T09:15:00+05:30',
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A17:I17',
  },
  {
    orderId: 'ORD-117',
    customerName: 'Nikhil Sen',
    createdAt: '2026-11-15T15:00:00+05:30', // ~123h ago (>72h)
    totalAmountPaise: 580000, // ₹5,800
    paidAmountPaise: 0, // ₹5,800 outstanding (>₹5,000)
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-15T15:30:00+05:30', // ~122.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A18:I18',
  },
  {
    orderId: 'ORD-118',
    customerName: 'Simran Bajaj',
    createdAt: '2026-11-20T12:00:00+05:30', // ~6h ago
    totalAmountPaise: 240000, // ₹2,400
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-20T12:30:00+05:30', // ~5.5h wait (<48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A19:I19',
  },
  {
    orderId: 'ORD-119',
    customerName: 'Harshvardhan Rao',
    createdAt: '2026-11-16T14:00:00+05:30', // ~100h ago (>72h)
    totalAmountPaise: 820000, // ₹8,200
    paidAmountPaise: 200000, // ₹2,000 paid, ₹6,200 outstanding (>₹5,000)
    paymentStatus: 'partially_paid',
    advanceStatus: 'confirmed',
    advanceRequestedAt: '2026-11-16T14:30:00+05:30',
    followupStatus: 'reviewed',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A20:I20',
  },
  {
    orderId: 'ORD-120',
    customerName: 'Priyanka Ghosh',
    createdAt: '2026-11-17T16:00:00+05:30', // ~74h ago (>72h)
    totalAmountPaise: 200000, // ₹2,000 (boundary test)
    paidAmountPaise: 0,
    paymentStatus: 'unpaid',
    advanceStatus: 'unconfirmed',
    advanceRequestedAt: '2026-11-17T16:30:00+05:30', // ~73.5h wait (>48h)
    followupStatus: 'pending',
    sourceId: 'demo-sheet-01',
    sourceRef: 'Synthetic_Orders!A21:I21',
  },
];
