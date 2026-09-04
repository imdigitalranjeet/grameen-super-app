import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  Download, 
  Trash2, 
  Tractor, 
  ShoppingCart, 
  FlaskConical, 
  Calendar, 
  Tag, 
  Filter, 
  CreditCard,
  Layers
} from 'lucide-react';
import { ExpenseCategory, ExpenseItem, Language, PlantationCrop } from '../types';
import { translations } from '../utils/translations';
import { exportExpensesToCSV } from '../utils/storage';
import { VoiceInputButton } from './VoiceInputButton';
import { ExpenseCategoryPieChart } from './ExpenseCategoryPieChart';

interface ExpensesTabProps {
  expenses: ExpenseItem[];
  crops: PlantationCrop[];
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  language: Language;
}

type FilterType = 'all' | 'farming' | 'daily' | 'fertilizer' | 'diesel' | 'groceries';

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses,
  crops,
  onAddExpense,
  onDeleteExpense,
  language,
}) => {
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Expenses for the Pie Chart visualization (reflects selected crop/plot or month if filtered)
  const expensesForChart = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedCrop !== 'all' && e.cropOrPlot !== selectedCrop) return false;
      if (selectedMonth !== 'all' && !e.date.startsWith(selectedMonth)) return false;
      return true;
    });
  }, [expenses, selectedCrop, selectedMonth]);

  // Unique months from data
  const months = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      if (e.date) {
        set.add(e.date.slice(0, 7)); // YYYY-MM
      }
    });
    return Array.from(set).sort().reverse();
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // Category Specific Filter from Pie Chart or Selector
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;

      // Type Filter
      if (activeFilter === 'farming' && !e.isFarming) return false;
      if (activeFilter === 'daily' && e.isFarming) return false;
      if (activeFilter === 'fertilizer' && e.category !== 'fertilizer') return false;
      if (activeFilter === 'diesel' && e.category !== 'diesel_tractor') return false;
      if (activeFilter === 'groceries' && e.category !== 'groceries') return false;

      // Crop Filter
      if (selectedCrop !== 'all' && e.cropOrPlot !== selectedCrop) return false;

      // Month Filter
      if (selectedMonth !== 'all' && !e.date.startsWith(selectedMonth)) return false;

      // Search Term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(query);
        const matchNotes = (e.notes || '').toLowerCase().includes(query);
        const matchCrop = (e.cropOrPlot || '').toLowerCase().includes(query);
        const matchQty = (e.quantityUsed || '').toLowerCase().includes(query);
        if (!matchTitle && !matchNotes && !matchCrop && !matchQty) return false;
      }

      return true;
    });
  }, [expenses, activeFilter, selectedCrop, selectedMonth, searchTerm]);

  // Aggregate Totals
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const farmingTotal = useMemo(() => {
    return expenses.filter((e) => e.isFarming).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const dailyTotal = useMemo(() => {
    return expenses.filter((e) => !e.isFarming).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const fertilizerTotal = useMemo(() => {
    return expenses.filter((e) => e.category === 'fertilizer').reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getCategoryBadgeColor = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'fertilizer':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'seeds':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'pesticide':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'diesel_tractor':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'labor':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'groceries':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'medical':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div id="expenses-tab-view" className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {t.expenses.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            {t.expenses.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-expenses-csv-action-btn"
            type="button"
            onClick={() => exportExpensesToCSV(filteredExpenses)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.expenses.exportCSV}</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <button
            id="add-expense-main-btn"
            type="button"
            onClick={onAddExpense}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>{t.expenses.addNewExpense}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            {language === 'hi' ? 'दिखाया गया कुल खर्च' : 'Filtered Total'}
          </p>
          <p className="text-xl font-bold text-neutral-900 mt-1">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            🌾 {t.expenses.farmingShare}
          </p>
          <p className="text-xl font-bold text-emerald-950 mt-1">
            ₹{farmingTotal.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/70 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
            🛒 {t.expenses.dailyShare}
          </p>
          <p className="text-xl font-bold text-teal-950 mt-1">
            ₹{dailyTotal.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            🧪 {language === 'hi' ? 'कुल खाद व पोषण' : 'Fertilizers Total'}
          </p>
          <p className="text-xl font-bold text-amber-950 mt-1">
            ₹{fertilizerTotal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Category Breakdown Visualization using Recharts */}
      <ExpenseCategoryPieChart
        expenses={expensesForChart}
        language={language}
        onSelectCategory={(cat) => {
          setSelectedCategory((prev) => (prev === cat ? 'all' : (cat || 'all')));
        }}
        selectedCategoryFilter={selectedCategory === 'all' ? null : selectedCategory}
      />

      {/* Filters & Search Control Bar */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-3">
        {selectedCategory !== 'all' && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {language === 'hi' ? 'पाई चार्ट फ़िल्टर:' : 'Category Filter:'}{' '}
                <strong className="text-emerald-950 font-bold">
                  {t.expenses.categories[selectedCategory] || selectedCategory}
                </strong>{' '}
                ({filteredExpenses.length} {language === 'hi' ? 'प्रविष्टियां' : 'records'})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline px-2 py-0.5 rounded cursor-pointer"
            >
              {language === 'hi' ? 'फ़िल्टर हटाएं (सभी श्रेणियां देखें)' : 'Show All Categories'}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: t.expenses.all, icon: Layers },
            { id: 'farming', label: t.expenses.farmingOnly, icon: Tractor },
            { id: 'daily', label: t.expenses.dailyOnly, icon: ShoppingCart },
            { id: 'fertilizer', label: t.expenses.fertilizerOnly, icon: FlaskConical },
            { id: 'diesel', label: language === 'hi' ? '🚜 ट्रैक्टर व डीजल' : '🚜 Tractor & Fuel', icon: Tractor },
            { id: 'groceries', label: language === 'hi' ? '🛒 राशन-किराना' : '🛒 Groceries', icon: ShoppingCart },
          ].map((f) => {
            const isSel = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search & Select dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search with Voice input */}
          <div className="sm:col-span-6 relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.expenses.searchPlaceholder}
              className="w-full pl-9 pr-14 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
            <div className="absolute right-1">
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setSearchTerm(text)}
              />
            </div>
          </div>

          {/* Month selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी महीने (All Months)' : 'All Months'}</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Crop selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी खेत / फसलें' : 'All Fields / Crops'}</option>
              {crops.map((c) => (
                <option key={c.id} value={c.plotName}>
                  {c.plotName} ({c.cropName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense List Card Grid */}
      <div className="space-y-3">
        {filteredExpenses.map((exp) => {
          const catLabel = t.expenses.categories[exp.category] || exp.category;
          return (
            <div
              key={exp.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(
                      exp.category
                    )}`}
                  >
                    {catLabel}
                  </span>
                  <span className="text-xs font-bold text-neutral-900">
                    {exp.title}
                  </span>
                  {exp.isFarming && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      🌾 Farm
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{exp.date}</span>
                  </span>

                  {exp.quantityUsed && (
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-md font-medium text-[11px]">
                      📦 {exp.quantityUsed}
                    </span>
                  )}

                  {exp.cropOrPlot && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-medium text-[11px]">
                      🌱 {exp.cropOrPlot}
                    </span>
                  )}

                  <span className="capitalize text-neutral-600">
                    💳 {exp.paymentMode.replace('_', ' ')}
                  </span>
                </div>

                {exp.notes && (
                  <p className="text-xs text-neutral-600 italic bg-neutral-50 p-2 rounded-lg border border-neutral-200/50">
                    "{exp.notes}"
                  </p>
                )}
              </div>

              {/* Amount & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-neutral-900">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {exp.isFarming ? 'Farm Investment' : 'Household'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteExpense(exp.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
            <p className="text-sm text-neutral-500 font-medium">
              {language === 'hi' ? 'कोई खर्चा प्रविष्टि नहीं मिली।' : 'No expense entries found matching criteria.'}
            </p>
            <button
              type="button"
              onClick={onAddExpense}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-emerald-900 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.expenses.addNewExpense}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
