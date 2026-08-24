import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Sprout, 
  BellRing, 
  Gift, 
  Wrench 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

export type TabKey = 'overview' | 'expenses' | 'plantation' | 'reminders' | 'gifts' | 'tools';

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  language: Language;
  pendingRemindersCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  pendingRemindersCount,
}) => {
  const t = translations[language];

  const tabs: { id: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: t.nav.overview, icon: LayoutDashboard },
    { id: 'expenses', label: t.nav.expenses, icon: ReceiptIndianRupee },
    { id: 'plantation', label: t.nav.plantation, icon: Sprout },
    { id: 'reminders', label: t.nav.reminders, icon: BellRing, badge: pendingRemindersCount },
    { id: 'gifts', label: t.nav.gifts, icon: Gift },
    { id: 'tools', label: t.nav.tools, icon: Wrench },
  ];

  return (
    <nav id="main-tab-navigation" className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                type="button"
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-emerald-900' : 'bg-red-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
