import React, { useState, useMemo } from 'react';
import { 
  BellRing, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Trash2, 
  AlertCircle, 
  Filter, 
  Sprout, 
  Gift, 
  Landmark, 
  Zap, 
  FlaskConical 
} from 'lucide-react';
import { Language, PlantationCrop, ReminderItem } from '../types';
import { translations } from '../utils/translations';
import { VoiceInputButton } from './VoiceInputButton';

interface RemindersTabProps {
  reminders: ReminderItem[];
  crops: PlantationCrop[];
  onAddReminder: () => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  language: Language;
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  reminders,
  crops,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  language,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredReminders = useMemo(() => {
    return reminders.filter((r) => {
      if (activeTab === 'pending' && r.completed) return false;
      if (activeTab === 'completed' && !r.completed) return false;

      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchNotes = (r.notes || '').toLowerCase().includes(query);
        const matchPlot = (r.relatedPlotOrCrop || '').toLowerCase().includes(query);
        if (!matchTitle && !matchNotes && !matchPlot) return false;
      }

      return true;
    });
  }, [reminders, activeTab, selectedCategory, searchTerm]);

  const getUrgencyInfo = (dueDate: string, completed: boolean) => {
    if (completed) return { label: 'Completed', color: 'bg-neutral-100 text-neutral-600' };

    const due = new Date(dueDate).setHours(0,0,0,0);
    const now = new Date(todayStr).setHours(0,0,0,0);
    const diffDays = Math.round((due - now) / 86400000);

    if (diffDays < 0) {
      return {
        label: language === 'hi' ? `⚠️ मियाद समाप्त (${Math.abs(diffDays)} दिन पूर्व)` : `Overdue (${Math.abs(diffDays)}d ago)`,
        color: 'bg-red-100 text-red-900 border-red-300 font-bold',
      };
    } else if (diffDays === 0) {
      return {
        label: language === 'hi' ? '🚨 आज ही करना है (Today)' : 'Due Today',
        color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      };
    } else if (diffDays === 1) {
      return {
        label: language === 'hi' ? 'कल (Tomorrow)' : 'Tomorrow',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
      };
    } else {
      return {
        label: language === 'hi' ? `${diffDays} दिन बाद` : `In ${diffDays} days`,
        color: 'bg-neutral-100 text-neutral-700',
      };
    }
  };

  const pendingCount = reminders.filter((r) => !r.completed).length;
  const overdueCount = reminders.filter((r) => !r.completed && r.dueDate < todayStr).length;

  return (
    <div id="reminders-tab-view" className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {t.reminders.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            {t.reminders.subtitle}
          </p>
        </div>

        <button
          id="add-reminder-main-btn"
          type="button"
          onClick={onAddReminder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-200" />
          <span>{t.reminders.addNewReminder}</span>
        </button>
      </div>

      {/* Summary Urgency Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {language === 'hi' ? 'कुल बाकी कार्य' : 'Total Pending'}
          </p>
          <p className="text-xl font-bold text-neutral-900 mt-1">{pendingCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-800">
            {language === 'hi' ? '⚠️ मियाद पूरी / अति आवश्यक' : 'Overdue / Urgent'}
          </p>
          <p className="text-xl font-bold text-red-950 mt-1">{overdueCount}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            🧪 {language === 'hi' ? 'खाद व स्प्रे अलर्ट' : 'Fertilizer Alerts'}
          </p>
          <p className="text-xl font-bold text-emerald-950 mt-1">
            {reminders.filter((r) => (r.category === 'fertilizer_due' || r.category === 'spray_due') && !r.completed).length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            🎁 {language === 'hi' ? 'शगुन / न्योता लौटाना' : 'Gift Return Alerts'}
          </p>
          <p className="text-xl font-bold text-amber-950 mt-1">
            {reminders.filter((r) => r.category === 'gift_return' && !r.completed).length}
          </p>
        </div>
      </div>

      {/* Control Bar: Pending / Done filter, Category select, Search */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.reminders.pending} ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.reminders.completed} ({reminders.length - pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.common.viewAll}
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी प्रकार के अलर्ट (All)' : 'All Categories'}</option>
              <option value="fertilizer_due">🧪 {language === 'hi' ? 'खाद डालने की तारीख' : 'Fertilizer Application'}</option>
              <option value="spray_due">🛡️ {language === 'hi' ? 'कीटनाशक स्प्रे' : 'Pesticide / Spray'}</option>
              <option value="irrigation_due">💧 {language === 'hi' ? 'सिंचाई की बारी' : 'Irrigation Turn'}</option>
              <option value="kcc_loan_emi">🏦 {language === 'hi' ? 'KCC लोन / बैंक किस्त' : 'KCC Loan / Bank'}</option>
              <option value="electricity_bill">⚡ {language === 'hi' ? 'बिजली बिल' : 'Electricity Bill'}</option>
              <option value="gift_return">🎁 {language === 'hi' ? 'शगुन लौटाने का न्योता' : 'Gift Return / Shagun'}</option>
              <option value="gram_sabha">🏛️ {language === 'hi' ? 'ग्राम सभा बैठक' : 'Gram Sabha Meeting'}</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'रिमाइंडर खोजें...' : 'Search reminders by title, plot or notes...'}
            className="w-full pl-9 pr-14 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
          />
          <div className="absolute right-1">
            <VoiceInputButton
              language={language}
              onTranscript={(text) => setSearchTerm(text)}
            />
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map((rem) => {
          const urgency = getUrgencyInfo(rem.dueDate, rem.completed);

          return (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl bg-white border shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                rem.completed
                  ? 'border-neutral-200 bg-neutral-50/60 opacity-75'
                  : rem.priority === 'high'
                  ? 'border-red-200'
                  : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Toggle Completion */}
                <button
                  type="button"
                  onClick={() => onToggleReminder(rem.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    rem.completed
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border-2 border-neutral-300 hover:border-emerald-600 text-transparent hover:text-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        rem.completed ? 'line-through text-neutral-500' : 'text-neutral-900'
                      }`}
                    >
                      {rem.title}
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded-md border ${urgency.color}`}>
                      {urgency.label}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        rem.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : rem.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {rem.priority === 'high' ? 'High' : rem.priority === 'medium' ? 'Normal' : 'Low'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{rem.dueDate}</span>
                    </span>

                    {rem.dueTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{rem.dueTime}</span>
                      </span>
                    )}

                    {rem.relatedPlotOrCrop && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px]">
                        🌱 {rem.relatedPlotOrCrop}
                      </span>
                    )}

                    {rem.recurring !== 'none' && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[11px]">
                        🔁 {rem.recurring}
                      </span>
                    )}
                  </div>

                  {rem.notes && (
                    <p className="text-xs text-neutral-600 italic mt-1 bg-neutral-50 p-2 rounded-lg border border-neutral-200/50">
                      "{rem.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onDeleteReminder(rem.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredReminders.length === 0 && (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
            <p className="text-sm text-neutral-500 font-medium">
              {language === 'hi' ? 'कोई रिमाइंडर नहीं मिला।' : 'No reminders found.'}
            </p>
            <button
              type="button"
              onClick={onAddReminder}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-emerald-900 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.reminders.addNewReminder}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
