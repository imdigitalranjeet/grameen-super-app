import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector
} from 'recharts';
import { PieChart as PieIcon, Filter, Layers, Tractor, ShoppingCart, IndianRupee, Sparkles } from 'lucide-react';
import { ExpenseCategory, ExpenseItem, Language } from '../types';
import { translations } from '../utils/translations';

interface ExpenseCategoryPieChartProps {
  expenses: ExpenseItem[];
  language: Language;
  onSelectCategory?: (category: ExpenseCategory | null) => void;
  selectedCategoryFilter?: string | null;
}

interface CategorySliceData {
  category: ExpenseCategory;
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
  isFarming: boolean;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fertilizer: '#059669', // Emerald
  labor: '#2563eb',      // Royal Blue
  seeds: '#d97706',      // Warm Amber
  pesticide: '#7c3aed',  // Violet
  diesel_tractor: '#ea580c', // Orange
  irrigation: '#0284c7', // Sky Blue
  groceries: '#0d9488',  // Teal
  household: '#475569',  // Slate
  medical: '#e11d48',    // Rose
  education: '#4f46e5',  // Indigo
  electricity_bills: '#ca8a04', // Yellow Amber
  livestock_fodder: '#65a30d', // Lime
  other: '#6b7280',      // Neutral Gray
};

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  fertilizer: '🧪',
  labor: '👷',
  seeds: '🌱',
  pesticide: '🛡️',
  diesel_tractor: '🚜',
  irrigation: '💧',
  groceries: '🛒',
  household: '🏠',
  medical: '💊',
  education: '📚',
  electricity_bills: '⚡',
  livestock_fodder: '🐄',
  other: '📦',
};

export const ExpenseCategoryPieChart: React.FC<ExpenseCategoryPieChartProps> = ({
  expenses,
  language,
  onSelectCategory,
  selectedCategoryFilter,
}) => {
  const t = translations[language];
  const isHi = language === 'hi';

  const [scopeFilter, setScopeFilter] = useState<'all' | 'farming' | 'household'>('all');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Filter expenses according to chart's scope (all, farming only, or household only)
  const scopedExpenses = useMemo(() => {
    if (scopeFilter === 'farming') {
      return expenses.filter((e) => e.isFarming);
    }
    if (scopeFilter === 'household') {
      return expenses.filter((e) => !e.isFarming);
    }
    return expenses;
  }, [expenses, scopeFilter]);

  // Aggregate by category
  const { chartData, totalAmount, topCategory } = useMemo(() => {
    const map = new Map<ExpenseCategory, { amount: number; count: number }>();

    scopedExpenses.forEach((item) => {
      const existing = map.get(item.category) || { amount: 0, count: 0 };
      existing.amount += item.amount;
      existing.count += 1;
      map.set(item.category, existing);
    });

    const total = Array.from(map.values()).reduce((sum, v) => sum + v.amount, 0);

    const slices: CategorySliceData[] = Array.from(map.entries())
      .map(([cat, val]) => {
        const catLabel = t.expenses.categories[cat] || cat;
        const pct = total > 0 ? (val.amount / total) * 100 : 0;
        const isFarm = [
          'fertilizer',
          'seeds',
          'pesticide',
          'diesel_tractor',
          'labor',
          'irrigation',
          'livestock_fodder',
        ].includes(cat);

        return {
          category: cat,
          name: catLabel,
          amount: val.amount,
          percentage: pct,
          count: val.count,
          color: CATEGORY_COLORS[cat] || '#6b7280',
          isFarming: isFarm,
        };
      })
      .filter((s) => s.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const top = slices.length > 0 ? slices[0] : null;

    return {
      chartData: slices,
      totalAmount: total,
      topCategory: top,
    };
  }, [scopedExpenses, t.expenses.categories]);

  // Custom Active Shape for Hovered Pie Slice
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-300"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 12}
          fill={fill}
          opacity={0.4}
        />
      </g>
    );
  };

  const activeItem = activeIndex !== null && chartData[activeIndex] ? chartData[activeIndex] : null;

  return (
    <div
      id="expense-category-pie-chart-card"
      className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-5"
    >
      {/* Header & Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>{isHi ? 'श्रेणीवार खर्च विश्लेषण (पाई चार्ट)' : 'Spending Breakdown by Category'}</span>
            </h2>
            <p className="text-xs text-neutral-500">
              {isHi
                ? 'खाद, बीज, मजदूरी, डीजल व दैनिक खर्चों का सटीक वितरण'
                : 'Proportional breakdown of fertilizer, labor, seeds, fuel & living costs'}
            </p>
          </div>
        </div>

        {/* Scope toggles: All / Farming / Household */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setScopeFilter('all');
              setActiveIndex(null);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              scopeFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isHi ? 'सभी' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => {
              setScopeFilter('farming');
              setActiveIndex(null);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              scopeFilter === 'farming'
                ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🌾</span>
            <span>{isHi ? 'खेती-बाड़ी' : 'Farming'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScopeFilter('household');
              setActiveIndex(null);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              scopeFilter === 'household'
                ? 'bg-teal-800 text-white shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🛒</span>
            <span>{isHi ? 'घर-गृहस्थी' : 'Household'}</span>
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <p className="text-xs text-neutral-500 font-medium">
            {isHi ? 'चयनित श्रेणी के लिए कोई खर्च दर्ज नहीं है।' : 'No expense data recorded in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Top: Interactive Donut Pie Chart with Center Metric */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full h-64 sm:h-72 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategorySliceData;
                        return (
                          <div className="bg-neutral-900 text-white p-2.5 rounded-xl shadow-lg border border-neutral-800 text-xs space-y-1 pointer-events-none z-50">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span>{CATEGORY_ICONS[data.category] || '📌'}</span>
                              <span>{data.name}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-[11px] text-neutral-300">
                              <span>{isHi ? 'कुल राशि:' : 'Amount:'}</span>
                              <span className="font-bold text-white">₹{data.amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-[11px] text-neutral-300">
                              <span>{isHi ? 'हिस्सा:' : 'Share:'}</span>
                              <span className="font-bold text-emerald-400">{data.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-[10px] text-neutral-400">
                              <span>{isHi ? 'प्रविष्टियां:' : 'Entries:'}</span>
                              <span>{data.count}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="amount"
                    activeIndex={activeIndex !== null ? activeIndex : undefined}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={(entry: any) => {
                      const cat = entry?.category || entry?.payload?.category;
                      if (onSelectCategory && cat) {
                        onSelectCategory(cat);
                      }
                    }}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.category}-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Content in Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {activeItem ? (
                  <div className="text-center px-2 animate-in fade-in zoom-in duration-200">
                    <span className="text-lg">{CATEGORY_ICONS[activeItem.category] || '📌'}</span>
                    <p className="text-[11px] font-bold text-neutral-700 max-w-[120px] truncate">
                      {activeItem.name}
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-neutral-900 leading-tight">
                      ₹{activeItem.amount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {activeItem.percentage.toFixed(1)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-center px-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                      {isHi ? 'कुल व्यय' : 'Total Spent'}
                    </span>
                    <p className="text-lg sm:text-xl font-black text-neutral-900">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-neutral-500">
                      {chartData.length} {isHi ? 'श्रेणियां' : 'categories'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Top Spending Category Callout */}
            {topCategory && (
              <div className="mt-1 flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  {isHi ? 'सर्वाधिक खर्च:' : 'Highest Expense:'}{' '}
                  <strong className="text-neutral-900">
                    {CATEGORY_ICONS[topCategory.category]} {topCategory.name}
                  </strong>{' '}
                  (₹{topCategory.amount.toLocaleString('en-IN')} • {topCategory.percentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Right / Bottom: Ranked Category Breakdown Table with Progress Bars */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
              <span>{isHi ? 'श्रेणी' : 'Category'}</span>
              <div className="flex items-center gap-6">
                <span>{isHi ? 'हिस्सा' : 'Share'}</span>
                <span>{isHi ? 'राशि (₹)' : 'Amount (₹)'}</span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {chartData.map((item, idx) => {
                const isHovered = activeIndex === idx;
                const isFilterActive = selectedCategoryFilter === item.category;

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => onSelectCategory && onSelectCategory(item.category)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isHovered || isFilterActive
                        ? 'bg-neutral-50 border-neutral-400 shadow-2xs translate-x-0.5'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs">{CATEGORY_ICONS[item.category]}</span>
                        <span className="text-xs font-bold text-neutral-900 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded font-medium">
                          {item.count} {isHi ? 'बार' : 'items'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <span className="text-xs font-bold text-neutral-700 w-12 text-right">
                          {item.percentage.toFixed(1)}%
                        </span>
                        <span className="text-xs font-extrabold text-neutral-900 w-20 text-right">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Proportional Mini Bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
