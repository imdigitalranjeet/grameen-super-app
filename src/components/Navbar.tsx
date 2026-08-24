import React from 'react';
import { 
  Sprout, 
  Languages, 
  Download, 
  PhoneCall, 
  Bell, 
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  language: Language;
  pendingRemindersCount?: number;
  onToggleLanguage: () => void;
  onOpenBackupModal: () => void;
  onNavigateTab?: (tab: any) => void;
  onResetDemoData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language = 'en',
  pendingRemindersCount = 0,
  onToggleLanguage,
  onOpenBackupModal,
  onNavigateTab,
}) => {
  const currentLang = language || 'en';
  const t = translations[currentLang] || translations.en;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div 
            id="nav-brand" 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigateTab && onNavigateTab('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-neutral-900 tracking-tight">
                  {currentLang === 'hi' ? 'ग्रामीण सुपर ऐप' : 'Gramin'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  {currentLang === 'hi' ? '🌾 किसान साथी' : 'Super App'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Toll Free Kisan Helpline Info (Hidden on very small screens) */}
            <a
              id="kisan-helpline-link"
              href="tel:18001801551"
              title={t.common?.helpline || 'Helpline'}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>{currentLang === 'hi' ? 'किसान हेल्पलाइन: 1800-180-1551' : 'Kisan Helpline: 1800-180-1551'}</span>
            </a>

            {/* Reminder Alert Badge Button */}
            {onNavigateTab && (
              <button
                id="nav-reminders-bell"
                type="button"
                onClick={() => onNavigateTab('reminders')}
                className="relative p-2 text-neutral-700 hover:text-emerald-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                title={currentLang === 'hi' ? 'याद-दहानी (अलर्ट)' : 'Reminders'}
              >
                <Bell className="w-5 h-5" />
                {pendingRemindersCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {pendingRemindersCount}
                  </span>
                )}
              </button>
            )}

            {/* Backup / Export Button */}
            <button
              id="nav-backup-btn"
              type="button"
              onClick={onOpenBackupModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors border border-neutral-200 cursor-pointer"
              title={t.common?.backupData || 'Backup'}
            >
              <Download className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">{currentLang === 'hi' ? 'बैकअप' : 'Backup'}</span>
            </button>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-200" />
              <span>{currentLang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
