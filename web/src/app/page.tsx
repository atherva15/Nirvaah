'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/shell/Sidebar';
import BusinessOnboarding from '../components/chat/BusinessOnboarding';
import InitialTaskScreen from '../components/InitialTaskScreen';
import WorkspaceHeader from '../components/WorkspaceHeader';
import NeedsReviewList from '../components/NeedsReviewList';
import EvidenceDrawer from '../components/EvidenceDrawer';
import ActionReviewModal from '../components/ActionReviewModal';
import BusinessSettingsModal from '../components/business/BusinessSettingsModal';

import GiftingWorkspace from '../features/GiftingWorkspace';
import ExposureSummary from '../features/ExposureSummary';
import WholesaleWorkspace from '../features/WholesaleWorkspace';
import GroceryWorkspace from '../features/GroceryWorkspace';
import ServiceWorkspace from '../features/ServiceWorkspace';
import DocumentCenter, { StagedRow } from '../features/DocumentCenter';

import { SYNTHETIC_ORDERS, FIXTURE_NOW_MS } from '../lib/synthetic-data';
import { filterAndSortOrders } from '../lib/engine';
import { planWorkspace, getPresetPlan } from '../lib/planner';
import {
  loadAppState,
  saveAppState,
  createNewBusinessProfile,
  getDefaultAppState,
  getSampleDemoState,
  NirvaahAppState,
} from '../lib/storage';
import {
  Order,
  TaskPreset,
  ComputedOrder,
  ActionReceipt,
  WorkspacePlan,
  BusinessProfile,
  BusinessCategory,
  ChatMessage,
  ChatThread,
  DocumentRecord,
  ExtractedOrderRecord,
  WholesaleOrderRecord,
  GroceryStockRecord,
  ServiceProjectRecord,
} from '../types';

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [appState, setAppState] = useState<NirvaahAppState>(getDefaultAppState());

  // Navigation and Workspace view state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<'workspace' | 'documents'>('workspace');
  const [activePlan, setActivePlan] = useState<WorkspacePlan | null>(null);

  // Shell & Dialog states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

  // Inspect and Safe Action Review states
  const [evidenceOrder, setEvidenceOrder] = useState<ComputedOrder | null>(null);
  const [actionOrder, setActionOrder] = useState<ComputedOrder | null>(null);
  const [actionContext, setActionContext] = useState<{ category: BusinessCategory; id: string } | null>(null);
  const [recentReceipt, setRecentReceipt] = useState<ActionReceipt | null>(null);

  // 1. Hydrate state from localStorage on client mount
  useEffect(() => {
    const loaded = loadAppState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppState(loaded);
    if (!loaded.profiles || loaded.profiles.length === 0) {
      setShowOnboarding(true);
    }
    setIsHydrated(true);
  }, []);

  // 2. Active business profile resolution
  const activeProfile: BusinessProfile | null = useMemo(() => {
    if (!appState.profiles || appState.profiles.length === 0) return null;
    return (
      appState.profiles.find((p) => p.id === appState.activeProfileId) ||
      appState.profiles[0] ||
      null
    );
  }, [appState.profiles, appState.activeProfileId]);

  // Active threads & documents for current business
  const currentThreads: ChatThread[] = useMemo(() => {
    if (!activeProfile) return [];
    return appState.threads[activeProfile.id] || [];
  }, [appState.threads, activeProfile]);

  const activeThreadId: string | null = useMemo(() => {
    if (!activeProfile) return null;
    return appState.activeThreadId[activeProfile.id] || null;
  }, [appState.activeThreadId, activeProfile]);

  const currentDocuments: DocumentRecord[] = useMemo(() => {
    if (!activeProfile) return [];
    return appState.documents[activeProfile.id] || [];
  }, [appState.documents, activeProfile]);

  // 3. Category-specific operational records for the active business
  const activeGiftingOrders: Order[] = useMemo(() => {
    if (!activeProfile) return SYNTHETIC_ORDERS;
    return appState.giftingOrders[activeProfile.id] || SYNTHETIC_ORDERS;
  }, [appState.giftingOrders, activeProfile]);

  const activeWholesaleRecords: WholesaleOrderRecord[] = useMemo(() => {
    if (!activeProfile) return [];
    return appState.wholesaleRecords[activeProfile.id] || [];
  }, [appState.wholesaleRecords, activeProfile]);

  const activeGroceryRecords: GroceryStockRecord[] = useMemo(() => {
    if (!activeProfile) return [];
    return appState.groceryRecords[activeProfile.id] || [];
  }, [appState.groceryRecords, activeProfile]);

  const activeServiceRecords: ServiceProjectRecord[] = useMemo(() => {
    if (!activeProfile) return [];
    return appState.serviceRecords[activeProfile.id] || [];
  }, [appState.serviceRecords, activeProfile]);

  // 4. Deterministic Gifting Order Calculations (Paise integer math via engine.ts)
  const matchedGiftingOrders = useMemo(() => {
    if (!activePlan || activeProfile?.category !== 'custom_gifting') return [];
    return filterAndSortOrders(activeGiftingOrders, activePlan.filterState, FIXTURE_NOW_MS);
  }, [activeGiftingOrders, activePlan, activeProfile]);

  // 5. Query execution handler (runs deterministic planner and logs to conversation thread)
  const handleRunQuery = (query: string) => {
    if (!activeProfile) return;
    const newPlan = planWorkspace(query, activeProfile.category);
    setActivePlan(newPlan);
    setActiveWorkspaceView('workspace');

    // Append to active business thread
    const nowIso = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: query,
      timestamp: nowIso,
    };
    const nirvaahMsg: ChatMessage = {
      id: `msg-${Date.now()}-n`,
      sender: 'nirvaah',
      text: newPlan.supported
        ? `Loaded adapted task workspace: "${newPlan.title}". ${newPlan.rationale}`
        : newPlan.unsupportedMessage || 'Unable to adapt workspace for this request.',
      timestamp: nowIso,
      plan: newPlan,
    };

    setAppState((prev) => {
      const profileThreads = prev.threads[activeProfile.id] || [];
      const currentThId = prev.activeThreadId[activeProfile.id];
      let updatedThreads: ChatThread[];

      if (currentThId && profileThreads.some((t) => t.id === currentThId)) {
        updatedThreads = profileThreads.map((t) =>
          t.id === currentThId
            ? {
                ...t,
                updatedAt: nowIso,
                messages: [...t.messages, userMsg, nirvaahMsg],
              }
            : t
        );
      } else {
        const newThread: ChatThread = {
          id: `th-${Date.now().toString(36)}`,
          businessId: activeProfile.id,
          title: query.length > 34 ? `${query.substring(0, 32)}...` : query,
          createdAt: nowIso,
          updatedAt: nowIso,
          messages: [userMsg, nirvaahMsg],
        };
        updatedThreads = [newThread, ...profileThreads];
      }

      const next: NirvaahAppState = {
        ...prev,
        threads: { ...prev.threads, [activeProfile.id]: updatedThreads },
        activeThreadId: { ...prev.activeThreadId, [activeProfile.id]: updatedThreads[0].id },
      };
      saveAppState(next);
      return next;
    });
  };

  // 6. Direct Preset switch handler (e.g. from nav or quick-switch buttons)
  const handleSelectPreset = (preset: TaskPreset) => {
    if (!activeProfile) return;
    const newPlan = getPresetPlan(preset, undefined, activeProfile.category);
    setActivePlan(newPlan);
    setActiveWorkspaceView('workspace');
  };

  // 7. Profile switcher handler
  const handleSelectProfile = (profileId: string) => {
    setAppState((prev) => {
      const next: NirvaahAppState = { ...prev, activeProfileId: profileId };
      saveAppState(next);
      return next;
    });
    setActivePlan(null);
    setActiveWorkspaceView('workspace');
    setIsMobileSidebarOpen(false);
  };

  // 8. Create new business handler (enforces 2-business limit)
  const handleCreateNewBusiness = () => {
    if (appState.profiles.length >= 2) {
      setAlertNotification(
        'Free tier supports up to 2 businesses. Switch between your 2 active profiles in the sidebar.'
      );
      return;
    }
    setShowOnboarding(true);
    setIsMobileSidebarOpen(false);
  };

  // 9. Business onboarding completion handler
  const handleProfileCreated = (newProfile: BusinessProfile) => {
    const res = createNewBusinessProfile(appState, {
      name: newProfile.name,
      category: newProfile.category,
      description: newProfile.description,
      tagline: newProfile.tagline,
      workflows: newProfile.workflows,
      modules: newProfile.modules,
    });

    if (res.success && res.state) {
      setAppState(res.state);
      setShowOnboarding(false);
      setActivePlan(null);
      setActiveWorkspaceView('workspace');
    } else if (res.error) {
      setAlertNotification(res.error);
    }
  };

  // Quick demo loader for testing/evaluating sample shop
  const handleLoadSampleDemo = () => {
    const demo = getSampleDemoState();
    setAppState(demo);
    saveAppState(demo);
    setShowOnboarding(false);
    setActivePlan(null);
    setActiveWorkspaceView('workspace');
  };

  // 10. Start New Conversation
  const handleNewConversation = () => {
    setActivePlan(null);
    setActiveWorkspaceView('workspace');
    setIsMobileSidebarOpen(false);
  };

  // 11. Select previous conversation thread
  const handleSelectThread = (threadId: string) => {
    if (!activeProfile) return;
    setAppState((prev) => {
      const next: NirvaahAppState = {
        ...prev,
        activeThreadId: { ...prev.activeThreadId, [activeProfile.id]: threadId },
      };
      saveAppState(next);
      return next;
    });

    const thread = appState.threads[activeProfile.id]?.find((t) => t.id === threadId);
    const lastPlanMsg = thread?.messages.slice().reverse().find((m) => m.plan);
    if (lastPlanMsg && lastPlanMsg.plan) {
      setActivePlan(lastPlanMsg.plan);
    } else {
      setActivePlan(null);
    }
    setActiveWorkspaceView('workspace');
    setIsMobileSidebarOpen(false);
  };

  // 12. Save Business Settings
  const handleSaveProfileSettings = (updated: Partial<BusinessProfile>) => {
    if (!activeProfile) return;
    setAppState((prev) => {
      const nextProfiles = prev.profiles.map((p) =>
        p.id === activeProfile.id ? { ...p, ...updated } : p
      );
      const next: NirvaahAppState = { ...prev, profiles: nextProfiles };
      saveAppState(next);
      return next;
    });
  };

  // 13. Document Import confirmation handler
  const handleImportConfirmedRecords = (
    stagedRows: StagedRow[],
    docName: string,
    extractedOrders?: ExtractedOrderRecord[]
  ) => {
    if (!activeProfile) return;
    const nowIso = new Date().toISOString();
    const isPdf = docName.toLowerCase().endsWith('.pdf');
    const isPng = docName.toLowerCase().endsWith('.png');
    const fileType = isPdf ? 'application/pdf' : isPng ? 'image/png' : 'text/csv';

    const docRecord: DocumentRecord = {
      id: `doc-${Date.now().toString(36)}`,
      businessId: activeProfile.id,
      name: docName,
      fileType,
      fileSize: stagedRows.length * 256,
      uploadedAt: nowIso,
      status: 'verified',
      extractedCount: stagedRows.length,
      issuesCount: stagedRows.filter((r) => r.isFlagged).length,
      rows: stagedRows,
      verificationNotes: `Verified ${stagedRows.length} records staged into ${activeProfile.name} operational store.`,
    };

    setAppState((prev) => {
      let nextGifting = prev.giftingOrders;
      const nextWholesale = prev.wholesaleRecords;
      const nextGrocery = prev.groceryRecords;
      const nextService = prev.serviceRecords;

      if (activeProfile.category === 'custom_gifting') {
        const currentOrders = prev.giftingOrders[activeProfile.id] || SYNTHETIC_ORDERS;

        const newOrders: Order[] = (extractedOrders && extractedOrders.length > 0)
          ? extractedOrders.map((rec, idx) => ({
              orderId: rec.orderId || `ORD-IMP-${idx + 101}`,
              customerName: rec.customerName || 'Verified Customer',
              itemDescription: rec.itemDescription || 'Custom Gifting Hamper',
              createdAt: rec.orderDate || nowIso,
              dueAt: rec.dueDate || null,
              totalAmountPaise: rec.totalAmountPaise,
              paidAmountPaise: rec.paidAmountPaise,
              paymentStatus: rec.paymentStatus,
              advanceStatus: rec.advanceStatus,
              advanceRequestedAt:
                rec.advanceStatus === 'unconfirmed' ? (rec.orderDate || nowIso) : null,
              followupStatus: 'pending',
              sourceId: docRecord.id,
              sourceRef: `${docName}#${rec.orderId || idx + 1}`,
              sourceFingerprint: `fp-${rec.orderId || idx + 1}`,
            }))
          : stagedRows.map((row) => {
              const numericAmount = parseInt(row.fieldB.replace(/[^0-9]/g, ''), 10) || 5000;
              const isAdvanceUnconfirmed =
                row.fieldC.toLowerCase().includes('advance') || row.isFlagged;
              return {
                orderId: row.id,
                customerName: row.fieldA.split('(')[0].trim(),
                itemDescription: row.fieldA.includes('(')
                  ? row.fieldA.split('(')[1].replace(')', '')
                  : 'Custom Hamper',
                createdAt: nowIso,
                dueAt: null,
                totalAmountPaise: numericAmount * 100,
                paidAmountPaise: isAdvanceUnconfirmed ? 0 : numericAmount * 100,
                paymentStatus: isAdvanceUnconfirmed ? 'unpaid' : 'paid',
                advanceStatus: isAdvanceUnconfirmed ? 'unconfirmed' : 'confirmed',
                advanceRequestedAt: isAdvanceUnconfirmed ? nowIso : null,
                followupStatus: 'pending',
                sourceId: docRecord.id,
                sourceRef: `${docName}#${row.id}`,
                sourceFingerprint: `fp-${row.id}`,
              };
            });

        // Prepend newly imported orders to the business's orders
        nextGifting = {
          ...prev.giftingOrders,
          [activeProfile.id]: [...newOrders, ...currentOrders],
        };
      }

      const nextDocs = {
        ...prev.documents,
        [activeProfile.id]: [docRecord, ...(prev.documents[activeProfile.id] || [])],
      };

      const next: NirvaahAppState = {
        ...prev,
        documents: nextDocs,
        giftingOrders: nextGifting,
        wholesaleRecords: nextWholesale,
        groceryRecords: nextGrocery,
        serviceRecords: nextService,
      };
      saveAppState(next);
      return next;
    });

    if (!activePlan) {
      const defaultPlan = getPresetPlan('triage_queue', undefined, activeProfile.category);
      setActivePlan(defaultPlan);
    }
    setActiveWorkspaceView('workspace');
  };

  // 14. Universal Evidence Lens normalizer
  const handleInspectWholesale = (r: WholesaleOrderRecord) => {
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: r.retailerName,
      createdAt: r.dispatchDueDate,
      totalAmountPaise: r.orderValuePaise,
      paidAmountPaise: r.paidAmountPaise,
      paymentStatus:
        r.paidAmountPaise >= r.orderValuePaise
          ? 'paid'
          : r.paidAmountPaise > 0
          ? 'partially_paid'
          : 'unpaid',
      advanceStatus: r.paidAmountPaise >= r.orderValuePaise ? 'confirmed' : 'unconfirmed',
      advanceRequestedAt: r.dispatchDueDate,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-WHL-CSV',
      sourceRef: r.sourceRef,
      outstandingPaise: Math.max(0, r.orderValuePaise - r.paidAmountPaise),
      outstandingInr: Math.max(0, r.orderValuePaise - r.paidAmountPaise) / 100,
      totalInr: r.orderValuePaise / 100,
      paidInr: r.paidAmountPaise / 100,
      orderAgeHours: r.daysOutstanding * 24,
      advanceWaitHours: r.daysOutstanding * 24,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Wholesale credit or logistics threshold breached',
      ruleId: r.ruleId || 'BR-WHL-ALERT',
    };
    setEvidenceOrder(comp);
  };

  const handleActionWholesale = (r: WholesaleOrderRecord) => {
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: r.retailerName,
      createdAt: r.dispatchDueDate,
      totalAmountPaise: r.orderValuePaise,
      paidAmountPaise: r.paidAmountPaise,
      paymentStatus:
        r.paidAmountPaise >= r.orderValuePaise
          ? 'paid'
          : r.paidAmountPaise > 0
          ? 'partially_paid'
          : 'unpaid',
      advanceStatus: r.paidAmountPaise >= r.orderValuePaise ? 'confirmed' : 'unconfirmed',
      advanceRequestedAt: r.dispatchDueDate,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-WHL-CSV',
      sourceRef: r.sourceRef,
      outstandingPaise: Math.max(0, r.orderValuePaise - r.paidAmountPaise),
      outstandingInr: Math.max(0, r.orderValuePaise - r.paidAmountPaise) / 100,
      totalInr: r.orderValuePaise / 100,
      paidInr: r.paidAmountPaise / 100,
      orderAgeHours: r.daysOutstanding * 24,
      advanceWaitHours: r.daysOutstanding * 24,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Wholesale credit or logistics threshold breached',
      ruleId: r.ruleId || 'BR-WHL-ALERT',
    };
    setActionOrder(comp);
    setActionContext({ category: 'wholesale_distribution', id: r.id });
  };

  const handleInspectGrocery = (r: GroceryStockRecord) => {
    const totalPaise = r.unitPricePaise * r.stockUnits;
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: `${r.supplierName} (${r.productName})`,
      createdAt: r.expiryDate,
      totalAmountPaise: totalPaise,
      paidAmountPaise: totalPaise,
      paymentStatus: 'paid',
      advanceStatus: 'confirmed',
      advanceRequestedAt: null,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-GRO-SHEET',
      sourceRef: r.sourceRef,
      outstandingPaise: 0,
      outstandingInr: 0,
      totalInr: totalPaise / 100,
      paidInr: totalPaise / 100,
      orderAgeHours: r.hoursUntilExpiry,
      advanceWaitHours: null,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Grocery safety buffer or expiry alert',
      ruleId: r.ruleId || 'BR-GRO-ALERT',
    };
    setEvidenceOrder(comp);
  };

  const handleActionGrocery = (r: GroceryStockRecord) => {
    const totalPaise = r.unitPricePaise * r.stockUnits;
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: `${r.supplierName} (${r.productName})`,
      createdAt: r.expiryDate,
      totalAmountPaise: totalPaise,
      paidAmountPaise: totalPaise,
      paymentStatus: 'paid',
      advanceStatus: 'confirmed',
      advanceRequestedAt: null,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-GRO-SHEET',
      sourceRef: r.sourceRef,
      outstandingPaise: 0,
      outstandingInr: 0,
      totalInr: totalPaise / 100,
      paidInr: totalPaise / 100,
      orderAgeHours: r.hoursUntilExpiry,
      advanceWaitHours: null,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Grocery safety buffer or expiry alert',
      ruleId: r.ruleId || 'BR-GRO-ALERT',
    };
    setActionOrder(comp);
    setActionContext({ category: 'grocery_retail', id: r.id });
  };

  const handleInspectService = (r: ServiceProjectRecord) => {
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: `${r.clientName} (${r.projectName})`,
      createdAt: r.deadline,
      totalAmountPaise: r.contractValuePaise,
      paidAmountPaise: r.paidAmountPaise,
      paymentStatus:
        r.paidAmountPaise >= r.contractValuePaise
          ? 'paid'
          : r.paidAmountPaise > 0
          ? 'partially_paid'
          : 'unpaid',
      advanceStatus: r.paidAmountPaise >= r.contractValuePaise ? 'confirmed' : 'unconfirmed',
      advanceRequestedAt: r.deadline,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-SRV-TRACKER',
      sourceRef: r.sourceRef,
      outstandingPaise: Math.max(0, r.contractValuePaise - r.paidAmountPaise),
      outstandingInr: Math.max(0, r.contractValuePaise - r.paidAmountPaise) / 100,
      totalInr: r.contractValuePaise / 100,
      paidInr: r.paidAmountPaise / 100,
      orderAgeHours: Math.abs(r.daysRemaining) * 24,
      advanceWaitHours: Math.abs(r.daysRemaining) * 24,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Client milestone review or invoice overdue',
      ruleId: r.ruleId || 'BR-SRV-ALERT',
    };
    setEvidenceOrder(comp);
  };

  const handleActionService = (r: ServiceProjectRecord) => {
    const comp: ComputedOrder = {
      orderId: r.id,
      customerName: `${r.clientName} (${r.projectName})`,
      createdAt: r.deadline,
      totalAmountPaise: r.contractValuePaise,
      paidAmountPaise: r.paidAmountPaise,
      paymentStatus:
        r.paidAmountPaise >= r.contractValuePaise
          ? 'paid'
          : r.paidAmountPaise > 0
          ? 'partially_paid'
          : 'unpaid',
      advanceStatus: r.paidAmountPaise >= r.contractValuePaise ? 'confirmed' : 'unconfirmed',
      advanceRequestedAt: r.deadline,
      followupStatus: r.followupStatus,
      sourceId: 'SRC-SRV-TRACKER',
      sourceRef: r.sourceRef,
      outstandingPaise: Math.max(0, r.contractValuePaise - r.paidAmountPaise),
      outstandingInr: Math.max(0, r.contractValuePaise - r.paidAmountPaise) / 100,
      totalInr: r.contractValuePaise / 100,
      paidInr: r.paidAmountPaise / 100,
      orderAgeHours: Math.abs(r.daysRemaining) * 24,
      advanceWaitHours: Math.abs(r.daysRemaining) * 24,
      ruleFlagged: !!r.ruleFlagged,
      ruleReason: r.ruleReason || 'Client milestone review or invoice overdue',
      ruleId: r.ruleId || 'BR-SRV-ALERT',
    };
    setActionOrder(comp);
    setActionContext({ category: 'service_project', id: r.id });
  };

  // 15. Safe Approved Action Mutation Handler (BR-12 & P-09)
  const handleApproveSuccess = (recordId: string, receipt: ActionReceipt) => {
    if (!activeProfile) return;
    const targetCategory = actionContext?.category || activeProfile.category;

    setAppState((prev) => {
      let nextGifting = prev.giftingOrders;
      let nextWholesale = prev.wholesaleRecords;
      let nextGrocery = prev.groceryRecords;
      let nextService = prev.serviceRecords;

      if (targetCategory === 'custom_gifting') {
        const currentOrders = prev.giftingOrders[activeProfile.id] || SYNTHETIC_ORDERS;
        nextGifting = {
          ...prev.giftingOrders,
          [activeProfile.id]: currentOrders.map((o) =>
            o.orderId === recordId ? { ...o, followupStatus: 'reviewed' } : o
          ),
        };
      } else if (targetCategory === 'wholesale_distribution') {
        const current = prev.wholesaleRecords[activeProfile.id] || [];
        nextWholesale = {
          ...prev.wholesaleRecords,
          [activeProfile.id]: current.map((r) =>
            r.id === recordId ? { ...r, followupStatus: 'reviewed' } : r
          ),
        };
      } else if (targetCategory === 'grocery_retail') {
        const current = prev.groceryRecords[activeProfile.id] || [];
        nextGrocery = {
          ...prev.groceryRecords,
          [activeProfile.id]: current.map((r) =>
            r.id === recordId ? { ...r, followupStatus: 'reviewed' } : r
          ),
        };
      } else if (targetCategory === 'service_project') {
        const current = prev.serviceRecords[activeProfile.id] || [];
        nextService = {
          ...prev.serviceRecords,
          [activeProfile.id]: current.map((r) =>
            r.id === recordId ? { ...r, followupStatus: 'reviewed' } : r
          ),
        };
      }

      const next: NirvaahAppState = {
        ...prev,
        giftingOrders: nextGifting,
        wholesaleRecords: nextWholesale,
        groceryRecords: nextGrocery,
        serviceRecords: nextService,
      };
      saveAppState(next);
      return next;
    });

    setRecentReceipt(receipt);
    if (evidenceOrder && evidenceOrder.orderId === recordId) {
      setEvidenceOrder((prev) => (prev ? { ...prev, followupStatus: 'reviewed' } : null));
    }
  };

  // Threshold update handlers
  const handleUpdateAmount = (amountInr: number) => {
    if (!activePlan) return;
    setActivePlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        filterState: {
          ...prev.filterState,
          amountThresholdInr: amountInr,
        },
      };
    });
  };

  const handleUpdateDuration = (hours: number) => {
    if (!activePlan) return;
    setActivePlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        filterState: {
          ...prev.filterState,
          durationThresholdHours: hours,
        },
      };
    });
  };

  const handleResetFilters = () => {
    if (!activePlan || !activeProfile) return;
    const defaultPlan = getPresetPlan(activePlan.preset, undefined, activeProfile.category);
    setActivePlan(defaultPlan);
  };

  // SSR hydration guard
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="flex items-center gap-2 text-ink font-mono text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-lavender animate-pulse"></span>
          <span>Loading Nirvaah Workspace...</span>
        </div>
      </div>
    );
  }

  // 16. CHAT-FIRST ONBOARDING SCREEN (Screen 1)
  if (showOnboarding || !activeProfile) {
    return (
      <main className="min-h-screen bg-porcelain">
        <BusinessOnboarding
          onProfileCreated={handleProfileCreated}
          onCancel={appState.profiles.length > 0 ? () => setShowOnboarding(false) : undefined}
          isSecondBusiness={appState.profiles.length === 1}
          onLoadSampleDemo={handleLoadSampleDemo}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-porcelain text-ink antialiased">
      {/* 1. COLLAPSIBLE PERSISTENT SIDEBAR & MOBILE DRAWER */}
      <Sidebar
        profiles={appState.profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onCreateNewBusiness={handleCreateNewBusiness}
        threads={currentThreads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewConversation={handleNewConversation}
        onOpenDocuments={() => {
          setActiveWorkspaceView('documents');
          setIsMobileSidebarOpen(false);
        }}
        onOpenSettings={() => {
          setIsSettingsOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-panel/95 backdrop-blur-xs border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-porcelain border border-border transition"
              aria-label="Open navigation sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Active Business Identity Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <div>
                <span className="font-bold text-sm text-ink">{activeProfile.name}</span>
                <span className="hidden sm:inline-block ml-2 text-xs text-ink-muted font-mono capitalize">
                  · {activeProfile.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Badges: Honest Synthetic Data & Fixed Demo Clock */}
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-200"
              title="All records are offline verified synthetic demonstration fixtures."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span className="uppercase">SYNTHETIC DEMO</span>
            </span>

            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-ink-muted bg-porcelain border border-border"
              title="Deterministic verification fixture clock: 20 Nov 2026, 6:00 PM IST"
            >
              <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Demo Clock: 20 Nov, 6:00 PM IST</span>
            </span>
          </div>
        </header>

        {/* Main Content Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Notification Alert Banner (e.g. Free Tier limit) */}
          {alertNotification && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{alertNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setAlertNotification(null)}
                className="text-amber-900 hover:text-black font-semibold underline ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Verified Mutation Confirmation Receipt Banner */}
          {recentReceipt && (
            <div className="mb-6 p-4 rounded-2xl bg-success-light border border-success/30 text-success flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>
                  <strong>Verified Action Applied:</strong> Record{' '}
                  <span className="font-mono font-bold">{recentReceipt.orderId}</span> updated to{' '}
                  <span className="font-mono font-bold">{recentReceipt.confirmedValue}</span>. Receipt:{' '}
                  <span className="font-mono font-semibold">{recentReceipt.receiptId}</span>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRecentReceipt(null)}
                className="text-success hover:text-emerald-950 font-bold underline ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 3. DOCUMENT STAGING & VERIFICATION CENTER */}
          {activeWorkspaceView === 'documents' ? (
            <DocumentCenter
              profile={activeProfile}
              documents={currentDocuments}
              onImportConfirmedRecords={handleImportConfirmedRecords}
              onBackToWorkspace={() => setActiveWorkspaceView('workspace')}
            />
          ) : !activePlan ? (
            /* 4. INITIAL TASK SCREEN (Simple, Low-Cognitive Load Starting View) */
            <InitialTaskScreen onRunQuery={handleRunQuery} profile={activeProfile} />
          ) : (
            /* 5. ADAPTIVE BUSINESS WORKSPACE */
            <div>
              {/* Task Planning Header */}
              <WorkspaceHeader
                plan={activePlan}
                onResetTask={() => setActivePlan(null)}
                onSwitchPreset={handleSelectPreset}
                onReplan={handleRunQuery}
              />

              {/* Unsupported Request Guidance Notice */}
              {activePlan.supported === false && (
                <div className="mb-6 p-6 rounded-2xl bg-coral-light border border-coral/30 text-ink">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-xl bg-coral text-white flex items-center justify-center font-bold text-xs shrink-0">
                      !
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-ink mb-1">
                        Task Request Outside Supported Operations
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        {activePlan.unsupportedMessage}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActivePlan(null)}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-panel border border-border text-xs font-semibold text-ink hover:bg-white transition"
                      >
                        Return to suggested tasks
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DOMAIN A: CUSTOM GIFTING WORKSPACE */}
              {activeProfile.category === 'custom_gifting' && (
                <div>
                  {activePlan.modules.includes('needs_review') && <NeedsReviewList />}

                  {activePlan.layout === 'exposure_summary' ? (
                    <ExposureSummary
                      orders={matchedGiftingOrders}
                      onInspectEvidence={(order) => setEvidenceOrder(order)}
                      onInitiateAction={(order) => {
                        setActionOrder(order);
                        setActionContext({ category: 'custom_gifting', id: order.orderId });
                      }}
                      onResetFilters={handleResetFilters}
                    />
                  ) : (
                    <GiftingWorkspace
                      orders={matchedGiftingOrders}
                      filterState={activePlan.filterState}
                      onUpdateAmount={handleUpdateAmount}
                      onUpdateDuration={handleUpdateDuration}
                      onInspectEvidence={(order) => setEvidenceOrder(order)}
                      onInitiateAction={(order) => {
                        setActionOrder(order);
                        setActionContext({ category: 'custom_gifting', id: order.orderId });
                      }}
                      onResetFilters={handleResetFilters}
                    />
                  )}
                </div>
              )}

              {/* DOMAIN B: WHOLESALE & DISTRIBUTION WORKSPACE */}
              {activeProfile.category === 'wholesale_distribution' && (
                <WholesaleWorkspace
                  records={activeWholesaleRecords}
                  onInspectEvidence={handleInspectWholesale}
                  onInitiateAction={handleActionWholesale}
                />
              )}

              {/* DOMAIN C: FRESH GROCERY & RETAIL WORKSPACE */}
              {activeProfile.category === 'grocery_retail' && (
                <GroceryWorkspace
                  records={activeGroceryRecords}
                  onInspectEvidence={handleInspectGrocery}
                  onInitiateAction={handleActionGrocery}
                />
              )}

              {/* DOMAIN D: SERVICE & PROJECT WORKSPACE */}
              {activeProfile.category === 'service_project' && (
                <ServiceWorkspace
                  records={activeServiceRecords}
                  onInspectEvidence={handleInspectService}
                  onInitiateAction={handleActionService}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* 6. CONTEXTUAL EVIDENCE LENS DRAWER */}
      <EvidenceDrawer
        order={evidenceOrder}
        onClose={() => setEvidenceOrder(null)}
        onInitiateAction={(order) => {
          setEvidenceOrder(null);
          setActionOrder(order);
          if (activeProfile) {
            setActionContext({ category: activeProfile.category, id: order.orderId });
          }
        }}
      />

      {/* 7. ACTION REVIEW MODAL (Safe Human-in-the-Loop Mutation with Zero-Mutation Cancellation) */}
      <ActionReviewModal
        order={actionOrder}
        isOpen={!!actionOrder}
        onClose={() => {
          setActionOrder(null);
          setActionContext(null);
        }}
        onApproveSuccess={handleApproveSuccess}
      />

      {/* 8. BUSINESS SETTINGS MODAL */}
      <BusinessSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={activeProfile}
        onSaveProfile={handleSaveProfileSettings}
        profilesCount={appState.profiles.length}
      />
    </div>
  );
}
