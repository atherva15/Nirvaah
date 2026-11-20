'use client';

import React, { useState } from 'react';
import { BusinessProfile, ChatThread } from '../../types';

interface SidebarProps {
  profiles: BusinessProfile[];
  activeProfile: BusinessProfile | null;
  onSelectProfile: (profileId: string) => void;
  onCreateNewBusiness: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onNewConversation: () => void;
  onOpenDocuments: () => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateNewBusiness,
  threads,
  activeThreadId,
  onSelectThread,
  onNewConversation,
  onOpenDocuments,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const canCreateMore = profiles.length < 2;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-midnight text-porcelain select-none">
      {/* Top Branding & Business Switcher */}
      <div>
        {/* Brand Bar */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lavender flex items-center justify-center font-bold text-white text-sm shadow-xs shrink-0">
              N
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-bold tracking-tight text-white text-sm">NIRVAAH</div>
                <div className="text-[10px] text-ink-muted uppercase font-mono tracking-wider">
                  Adaptive Workspace
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:inline-flex p-1.5 rounded-lg text-ink-muted hover:text-white hover:bg-white/5 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={isCollapsed ? 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' : 'M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5'} />
            </svg>
          </button>
        </div>

        {/* Business Profile Switcher */}
        {!isCollapsed && activeProfile && (
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate group-hover:text-lavender transition-colors">
                      {activeProfile.name}
                    </div>
                    <div className="text-[10px] text-ink-muted font-mono truncate">
                      {activeProfile.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <svg className="w-3.5 h-3.5 text-ink-muted group-hover:text-white transition shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Profile Switcher Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-midnight border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-ink-muted uppercase">
                    Profiles ({profiles.length}/2 Free)
                  </div>
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectProfile(p.id);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                        p.id === activeProfile.id
                          ? 'bg-lavender text-white font-bold'
                          : 'text-ink-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {p.id === activeProfile.id && <span>✓</span>}
                    </button>
                  ))}

                  <div className="pt-1 border-t border-white/10 mt-1">
                    {canCreateMore ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onCreateNewBusiness();
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs font-semibold text-lavender hover:bg-lavender/10 transition flex items-center gap-1.5"
                      >
                        <span>+ Add Second Business</span>
                      </button>
                    ) : (
                      <div className="px-2 py-1.5 text-[10px] text-ink-muted">
                        Free tier capacity reached (2/2)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls: New Conversation & New Business */}
        <div className="p-3 space-y-2">
          <button
            type="button"
            onClick={onNewConversation}
            className={`w-full p-2.5 rounded-xl bg-lavender hover:bg-lavender-deep text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Start a new conversation in this business"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {!isCollapsed && <span>New Conversation</span>}
          </button>

          {!isCollapsed && canCreateMore && (
            <button
              type="button"
              onClick={onCreateNewBusiness}
              className="w-full p-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-ink-muted hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
              <span>+ New Business</span>
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        {!isCollapsed && (
          <div className="px-3 py-2 space-y-1">
            <button
              type="button"
              onClick={onOpenDocuments}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-white hover:bg-white/5 transition flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span>Documents &amp; Staging</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">
                CSV
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-white hover:bg-white/5 transition flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span>Business Settings</span>
            </button>
          </div>
        )}

        {/* Recent Conversations List */}
        {!isCollapsed && (
          <div className="px-3 pt-3 flex-1 overflow-y-auto">
            <div className="text-[10px] font-mono text-ink-muted uppercase tracking-wider px-2 mb-1.5">
              Recent Conversations
            </div>
            {threads.length === 0 ? (
              <div className="px-2 py-3 text-xs text-ink-muted italic">
                No recent conversations.
              </div>
            ) : (
              <div className="space-y-0.5">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectThread(t.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs truncate transition ${
                      t.id === activeThreadId
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-ink-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate block">{t.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/10 text-[11px] text-ink-muted">
          <div className="flex items-center justify-between">
            <span>Deterministic Math</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-[10px] mt-0.5 opacity-60">
            Offline Verified · No Leakage
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 border-r border-border ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Panel */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
