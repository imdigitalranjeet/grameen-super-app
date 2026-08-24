import React from 'react';
import { 
  Tractor, 
  ShoppingCart, 
  Sprout, 
  BellRing, 
  Gift, 
  PlusCircle, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  CloudSun,
  Droplets,
  Wind,
  Bot
} from 'lucide-react';
import { VillageSuperAppState } from '../types';
import { translations } from '../utils/translations';
import { TabKey } from './TabNavigation';

interface OverviewDashboardProps {
  state: VillageSuperAppState;
  onNavigateTab: (tab: TabKey) => void;
  onOpenAddExpense: () => void;
  onOpenAddCrop: () => void;
  onOpenAddReminder: () => void;
  onOpenAddGift: () => void;
  onToggleReminder: (id: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  state,
  onNavigateTab,
  onOpenAddExpense,
  onOpenAddCrop,
  onOpenAddReminder,
  onOpenAddGift,
  onToggleReminder,
}) => {
  const t = translations[state.language];

  // Calculations
  const farmingExpenses = state.expenses
    .filter((e) => e.isFarming)
    .reduce((sum, e) => sum + e.amount, 0);

  const dailyExpenses = state.expenses
    .filter((e) => !e.isFarming)
    .reduce((sum, e) => sum + e.amount, 0);

  const fertilizerExpenses = state.expenses
    .filter((e) => e.category === 'fertilizer')
    .reduce((sum, e) => sum + e.amount, 0);

  const groceryExpenses = state.expenses
    .filter((e) => e.category === 'groceries')
    .reduce((sum, e) => sum + e.amount, 0);

  const giftsReceived = state.gifts
    .filter((g) => g.type === 'received')
    .reduce((sum, g) => sum + g.amountOrValue, 0);

  const giftsGiven = state.gifts
    .filter((g) => g.type === 'given')
    .reduce((sum, g) => sum + g.amountOrValue, 0);

  const pendingGiftsToReturn = state.gifts.filter(
    (g) => g.type === 'received' && !g.counterGiftSettled
  ).length;

  const activeCropsCount = state.crops.filter((c) => c.status !== 'harvested').length;
  const pendingReminders = state.reminders.filter((r) => !r.completed);
  const overdueOrTodayReminders = pendingReminders.filter((r) => {
    const today = new Date().toISOString().slice(0, 10);
    return r.dueDate <= today;
  });

  return (
    <div id="overview-dashboard-view" className="space-y-6">
      {/* Welcome Banner & Quick Actions */}
      <div id="overview-hero-card" className="bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold border border-emerald-500/30">
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.overview.weatherSeason}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t.overview.title}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.overview.subtitle}
            </p>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            <button
              id="quick-add-expense-btn"
              type="button"
              onClick={onOpenAddExpense}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-emerald-500/40 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>{t.overview.quickAddExpense}</span>
            </button>

            <button
              id="quick-add-crop-btn"
              type="button"
              onClick={onOpenAddCrop}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-emerald-500/40 transition-all cursor-pointer"
            >
              <Sprout className="w-4 h-4 text-emerald-200" />
              <span>{t.overview.quickAddCrop}</span>
            </button>

            <button
              id="quick-add-reminder-btn"
              type="button"
              onClick={onOpenAddReminder}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-emerald-500/40 transition-all cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-amber-300" />
              <span>{t.overview.quickAddReminder}</span>
            </button>

            <button
              id="quick-add-gift-btn"
              type="button"
              onClick={onOpenAddGift}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-emerald-500/40 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>{t.overview.quickAddGift}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div id="overview-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Farming Expenses Card */}
        <div
          id="metric-farming-expenses"
          onClick={() => onNavigateTab('expenses')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {t.overview.totalFarmingExpense}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tractor className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            ₹{farmingExpenses.toLocaleString('en-IN')}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>🧪 {state.language === 'hi' ? 'खाद/उर्वरक:' : 'Fertilizers:'} ₹{fertilizerExpenses.toLocaleString('en-IN')}</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-700" />
          </div>
        </div>

        {/* Daily Living & Grocery Expenses Card */}
        <div
          id="metric-daily-expenses"
          onClick={() => onNavigateTab('expenses')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {t.overview.totalDailyExpense}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4 text-teal-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            ₹{dailyExpenses.toLocaleString('en-IN')}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>🛒 {state.language === 'hi' ? 'राशन-किराना:' : 'Groceries:'} ₹{groceryExpenses.toLocaleString('en-IN')}</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-teal-700" />
          </div>
        </div>

        {/* Active Crops & Plots Card */}
        <div
          id="metric-active-crops"
          onClick={() => onNavigateTab('plantation')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {t.overview.activePlots}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sprout className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {activeCropsCount} {state.language === 'hi' ? 'फसलें / खेत' : 'Active Crops'}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>🌾 {state.crops[0]?.cropName || 'Wheat'} & more</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-700" />
          </div>
        </div>

        {/* Shagun / Gift Registry Balance Card */}
        <div
          id="metric-shagun-gifts"
          onClick={() => onNavigateTab('gifts')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {state.language === 'hi' ? 'शगुन व न्योता बही' : 'Shagun Gifts Registry'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-neutral-900 tracking-tight">
              ₹{giftsReceived.toLocaleString('en-IN')}
            </p>
            <span className="text-xs text-emerald-700 font-semibold">
              {state.language === 'hi' ? 'प्राप्त' : 'Recv'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>📤 {state.language === 'hi' ? 'दिया:' : 'Given:'} ₹{giftsGiven.toLocaleString('en-IN')}</span>
            <span className="text-rose-700 font-medium">{pendingGiftsToReturn} {state.language === 'hi' ? 'लौटाना शेष' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Weather & Agronomy Advisory + Urgent Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather & Agronomy Advisory Widget */}
        <div id="weather-advisory-widget" className="lg:col-span-1 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-neutral-900">
                {t.overview.weatherCardTitle}
              </h2>
            </div>
            <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-md border border-emerald-200">
              {state.language === 'hi' ? 'आज का मौसम' : 'Today'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
            <div>
              <p className="text-2xl font-bold text-neutral-900">29°C</p>
              <p className="text-xs text-neutral-500">{state.language === 'hi' ? 'हल्की धूप व हवा' : 'Partly Cloudy & Breezy'}</p>
            </div>
            <div className="space-y-1 text-right text-xs text-neutral-600">
              <div className="flex items-center gap-1.5 justify-end">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <span>{state.language === 'hi' ? 'नमी: 68%' : 'Humidity: 68%'}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                <span>{state.language === 'hi' ? 'हवा: 12 km/h' : 'Wind: 12 km/h'}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1.5">
            <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <span>🌾</span>
              <span>{state.language === 'hi' ? 'किसान परामर्श (Kisan Advisory):' : 'Farm Recommendation:'}</span>
            </p>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {t.overview.weatherAdvice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('tools')}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>{state.language === 'hi' ? 'किसान AI सहायक से पूछें' : 'Ask Kisan AI Assistant'}</span>
          </button>
        </div>

        {/* Priority Reminders & Tasks */}
        <div id="urgent-reminders-widget" className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-bold text-neutral-900">
                {state.language === 'hi' ? 'अति आवश्यक कार्य व याद-दहानी' : 'Upcoming Reminders & Deadlines'}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('reminders')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline inline-flex items-center gap-1"
            >
              <span>{t.overview.viewAll}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingReminders.slice(0, 4).map((rem) => {
              const isUrgent = rem.priority === 'high' || rem.dueDate <= new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={rem.id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                    isUrgent
                      ? 'bg-red-50/60 border-red-200'
                      : 'bg-neutral-50/80 border-neutral-200/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleReminder(rem.id)}
                      className="mt-0.5 w-5 h-5 rounded-md border border-neutral-400 hover:border-emerald-600 flex items-center justify-center bg-white text-transparent hover:text-emerald-700 transition-colors"
                      title={t.reminders.markDone}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-neutral-900">
                        {rem.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span>{rem.dueDate}</span>
                        </span>
                        {rem.dueTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{rem.dueTime}</span>
                          </span>
                        )}
                        {rem.relatedPlotOrCrop && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                            🌱 {rem.relatedPlotOrCrop}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rem.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : rem.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {rem.priority === 'high' ? 'High' : rem.priority === 'medium' ? 'Normal' : 'Low'}
                  </span>
                </div>
              );
            })}

            {pendingReminders.length === 0 && (
              <p className="text-xs text-neutral-500 text-center py-6">
                {state.language === 'hi' ? 'कोई बकाया कार्य नहीं है। सब कुछ पूर्ण है!' : 'No pending reminders. You are all caught up!'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div id="overview-recent-activity" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-sm font-bold text-neutral-900">
            {t.overview.recentActivities}
          </h2>
          <button
            onClick={() => onNavigateTab('expenses')}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            {t.overview.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Latest Expenses */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span>{state.language === 'hi' ? 'नवीनतम खर्चे' : 'Latest Expenses'}</span>
              <span className="text-neutral-400 font-normal">₹</span>
            </h3>
            {state.expenses.slice(0, 3).map((exp) => (
              <div key={exp.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{exp.title}</p>
                  <p className="text-[11px] text-neutral-500">
                    {exp.date} • {exp.isFarming ? '🌾 Farming' : '🛒 Daily'} {exp.quantityUsed && `• ${exp.quantityUsed}`}
                  </p>
                </div>
                <span className="text-xs font-bold text-neutral-900">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Latest Gifts / Shagun */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span>{state.language === 'hi' ? 'नवीनतम शगुन प्रविष्टियां' : 'Latest Shagun Records'}</span>
              <span className="text-neutral-400 font-normal">🎁</span>
            </h3>
            {state.gifts.slice(0, 3).map((gift) => (
              <div key={gift.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    {gift.personName}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {gift.occasion} • {gift.type === 'received' ? '📥 Recv' : '📤 Given'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-900">
                    ₹{gift.amountOrValue.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[10px] text-neutral-500">{gift.giftCategory}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
