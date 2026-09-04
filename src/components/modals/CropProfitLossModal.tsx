import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calculator,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Printer,
  Sprout,
  Sparkles,
  Layers,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { Language, PlantationCrop } from '../../types';

interface CropProfitLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: PlantationCrop | null;
  crops: PlantationCrop[];
  onSelectCrop?: (cropId: string) => void;
  onAddHarvest?: (cropId: string) => void;
  language: Language;
}

export const CropProfitLossModal: React.FC<CropProfitLossModalProps> = ({
  isOpen,
  onClose,
  crop,
  crops,
  onSelectCrop,
  onAddHarvest,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const isHi = language === 'hi';

  if (!isOpen || !crop) return null;

  // 1. Calculations: Profit/Loss = Total Harvest Revenue - (Total Fertilizer Expenses + Total Spray Expenses)
  const totalHarvestRevenue = crop.harvestRecords.reduce(
    (sum, h) => sum + (h.totalRevenue || 0),
    0
  );
  const totalFertilizerExpense = crop.fertilizerLogs.reduce(
    (sum, f) => sum + (f.cost || 0),
    0
  );
  const totalSprayExpense = crop.sprayLogs.reduce(
    (sum, s) => sum + (s.cost || 0),
    0
  );

  const totalInputExpenses = totalFertilizerExpense + totalSprayExpense;
  const netProfitLoss = totalHarvestRevenue - totalInputExpenses;

  const isProfit = netProfitLoss > 0;
  const isLoss = netProfitLoss < 0;
  const isBreakEven = netProfitLoss === 0;

  // Additional Insights
  const returnOnInvestment =
    totalInputExpenses > 0
      ? ((netProfitLoss / totalInputExpenses) * 100).toFixed(1)
      : '0.0';

  const profitPerAreaUnit =
    crop.areaValue > 0 ? (netProfitLoss / crop.areaValue).toFixed(0) : '0';

  const totalYieldAmount = crop.harvestRecords.reduce(
    (sum, h) => sum + (h.yieldAmount || 0),
    0
  );
  const yieldUnit = crop.harvestRecords[0]?.unit || 'Quintal';

  // Copy summary text for WhatsApp or SMS
  const handleCopySummary = () => {
    const summaryText = `🌾 *${crop.plotName} - ${crop.cropName}* (${crop.areaValue} ${crop.areaUnit})
📅 ${isHi ? 'बुवाई' : 'Sown'}: ${crop.plantingDate} | ${isHi ? 'स्थिति' : 'Status'}: ${crop.status}

💰 *${isHi ? 'फसल लाभ-हानि रिपोर्ट (P&L Summary)' : 'Crop Profit & Loss Summary'}*:
• ${isHi ? 'कुल उपज बिक्री आय (+)' : 'Harvest Sales (+)'}: ₹${totalHarvestRevenue.toLocaleString('en-IN')} (${totalYieldAmount} ${yieldUnit})
• ${isHi ? 'खाद व उर्वरक खर्च (-)' : 'Fertilizer Expenses (-)'}: ₹${totalFertilizerExpense.toLocaleString('en-IN')} (${crop.fertilizerLogs.length} ${isHi ? 'बार' : 'doses'})
• ${isHi ? 'कीटनाशक स्प्रे खर्च (-)' : 'Spray Expenses (-)'}: ₹${totalSprayExpense.toLocaleString('en-IN')} (${crop.sprayLogs.length} ${isHi ? 'स्प्रे' : 'sprays'})
----------------------------
• *${isHi ? 'कुल इनपुट लागत (खाद+स्प्रे)' : 'Total Input Cost'}*: ₹${totalInputExpenses.toLocaleString('en-IN')}
• *${isProfit ? (isHi ? '🟢 शुद्ध लाभ (Net Profit)' : '🟢 Net Profit') : isLoss ? (isHi ? '🔴 शुद्ध हानि (Net Loss)' : '🔴 Net Loss') : (isHi ? '⚪ लागत बराबर' : '⚪ Break Even')}*: ₹${Math.abs(netProfitLoss).toLocaleString('en-IN')}
• *${isHi ? 'प्रति ' + crop.areaUnit + ' लाभ/हानि' : 'Profit per ' + crop.areaUnit}*: ₹${Number(profitPerAreaUnit).toLocaleString('en-IN')}
${totalInputExpenses > 0 ? `• ROI: ${returnOnInvestment}%` : ''}

_Generated via Gramin: Village Super App_`;

    navigator.clipboard?.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="crop-profit-loss-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="crop-profit-loss-modal-dialog"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200"
      >
        {/* Modal Header */}
        <div
          id="crop-profit-loss-modal-header"
          className="flex items-center justify-between px-5 py-4 bg-emerald-900 text-white shrink-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate">
                {isHi ? 'फसल लाभ व हानि सारांश' : 'Crop Profit & Loss Summary'}
              </h2>
              <p className="text-xs text-emerald-200 truncate">
                {crop.plotName} • {crop.cropName} ({crop.areaValue} {crop.areaUnit})
              </p>
            </div>
          </div>

          <button
            id="close-profit-loss-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Scrollable Area */}
        <div
          id="crop-profit-loss-modal-body"
          className="p-5 overflow-y-auto space-y-5 text-neutral-800 flex-1"
        >
          {/* Crop Switcher Bar (if user has multiple crops) */}
          {crops.length > 1 && onSelectCrop && (
            <div
              id="crop-selector-bar"
              className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
            >
              <label htmlFor="crop-selector-dropdown" className="font-semibold text-neutral-600 shrink-0">
                {isHi ? 'खेत/फसल बदलें:' : 'Switch Plot/Crop:'}
              </label>
              <select
                id="crop-selector-dropdown"
                value={crop.id}
                onChange={(e) => onSelectCrop(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {crops.map((c) => {
                  const hasHarvest = c.harvestRecords.length > 0;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.plotName} - {c.cropName} ({c.areaValue} {c.areaUnit})
                      {hasHarvest ? ` • ${isHi ? 'उपज दर्ज' : 'Harvested'}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* No Harvest Warning (if harvest hasn't been logged yet) */}
          {crop.harvestRecords.length === 0 && (
            <div
              id="no-harvest-warning-alert"
              className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-xs font-bold text-amber-900">
                  {isHi
                    ? 'इस फसल की कटाई / बिक्री का रिकॉर्ड अभी दर्ज नहीं हुआ है।'
                    : 'No harvest sales recorded yet for this crop.'}
                </p>
                <p className="text-xs text-amber-800">
                  {isHi
                    ? `अब तक खाद व स्प्रे में कुल ₹${totalInputExpenses.toLocaleString(
                        'en-IN'
                      )} खर्च हो चुके हैं। अंतिम शुद्ध मुनाफा जानने के लिए उपज बिक्री दर्ज करें।`
                    : `Currently ₹${totalInputExpenses.toLocaleString(
                        'en-IN'
                      )} has been spent on fertilizers and sprays. Record your harvest sale to calculate net profit/loss.`}
                </p>
                {onAddHarvest && (
                  <button
                    id="add-harvest-from-modal-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddHarvest(crop.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-amber-200" />
                    <span>{isHi ? '+ कटाई व बिक्री दर्ज करें' : '+ Record Harvest Sale'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3 Component Breakdown Cards: Harvest Revenue, Fertilizer Cost, Spray Cost */}
          <div
            id="financial-breakdown-cards"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {/* 1. Harvest Revenue */}
            <div
              id="harvest-revenue-card"
              className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 text-emerald-900">
                <span className="text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? 'कुल बिक्री आय (+)' : 'Harvest Revenue (+)'}</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {crop.harvestRecords.length} {isHi ? 'बिक्री' : 'sales'}
                </span>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl font-black text-emerald-950">
                  ₹{totalHarvestRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  {totalYieldAmount > 0 ? (
                    <>
                      🌾 {totalYieldAmount} {yieldUnit}
                    </>
                  ) : (
                    <span>{isHi ? 'कोई बिक्री दर्ज नहीं' : 'No sales yet'}</span>
                  )}
                </p>
              </div>
            </div>

            {/* 2. Fertilizer Expenses */}
            <div
              id="fertilizer-expense-card"
              className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 text-amber-900">
                <span className="text-xs font-bold flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isHi ? 'खाद खर्च (-)' : 'Fertilizer Cost (-)'}</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                  {crop.fertilizerLogs.length} {isHi ? 'खुराक' : 'doses'}
                </span>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl font-black text-amber-950">
                  ₹{totalFertilizerExpense.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                  🧪 {crop.fertilizerLogs.length > 0
                    ? crop.fertilizerLogs.map((f) => f.fertilizerType.split(' ')[0]).slice(0, 2).join(', ')
                    : (isHi ? 'कोई खाद नहीं' : 'None')}
                </p>
              </div>
            </div>

            {/* 3. Spray Expenses */}
            <div
              id="spray-expense-card"
              className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 text-purple-900">
                <span className="text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isHi ? 'स्प्रे खर्च (-)' : 'Spray Cost (-)'}</span>
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                  {crop.sprayLogs.length} {isHi ? 'स्प्रे' : 'sprays'}
                </span>
              </div>
              <div className="mt-2.5">
                <p className="text-xl sm:text-2xl font-black text-purple-950">
                  ₹{totalSprayExpense.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-purple-700 font-medium mt-0.5">
                  🛡️ {crop.sprayLogs.length > 0
                    ? crop.sprayLogs.map((s) => s.name.split(' ')[0]).slice(0, 2).join(', ')
                    : (isHi ? 'कोई स्प्रे नहीं' : 'None')}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL PROFIT / LOSS HERO BANNER */}
          <div
            id="net-profit-loss-hero-card"
            className={`p-5 rounded-2xl border transition-all ${
              isProfit
                ? 'bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-green-50 border-emerald-300'
                : isLoss
                ? 'bg-gradient-to-br from-rose-50 via-rose-100/50 to-red-50 border-rose-300'
                : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            {/* Equation / Formula Line */}
            <div
              id="profit-loss-formula-badge"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-white/80 px-2.5 py-1 rounded-lg border border-neutral-200/80 mb-3"
            >
              <span>{isHi ? 'सूत्र:' : 'Formula:'}</span>
              <strong className="text-emerald-800">{isHi ? 'कुल बिक्री' : 'Revenue'}</strong>
              <span>-</span>
              <span className="text-neutral-700">({isHi ? 'खाद खर्च' : 'Fertilizer'} + {isHi ? 'स्प्रे खर्च' : 'Spray'})</span>
              <span>=</span>
              <strong className={isProfit ? 'text-emerald-700' : isLoss ? 'text-rose-700' : 'text-neutral-700'}>
                {isHi ? 'शुद्ध लाभ / हानि' : 'Net P&L'}
              </strong>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  {isProfit
                    ? isHi ? '🎉 कुल शुद्ध लाभ (Net Profit)' : '🎉 Total Net Profit'
                    : isLoss
                    ? isHi ? '⚠️ कुल शुद्ध घाटा (Net Loss)' : '⚠️ Total Net Loss'
                    : isHi ? '⚖️ लागत बराबर (Break Even)' : '⚖️ Break Even'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-3xl sm:text-4xl font-black tracking-tight ${
                      isProfit
                        ? 'text-emerald-900'
                        : isLoss
                        ? 'text-rose-900'
                        : 'text-neutral-800'
                    }`}
                  >
                    {isProfit ? '+' : isLoss ? '-' : ''}₹{Math.abs(netProfitLoss).toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isProfit
                        ? 'bg-emerald-200 text-emerald-900'
                        : isLoss
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {isProfit ? (isHi ? 'लाभ (PROFIT)' : 'PROFIT') : isLoss ? (isHi ? 'घाटा (LOSS)' : 'LOSS') : 'BREAK EVEN'}
                  </span>
                </div>
              </div>

              {/* Performance Metrics Pills */}
              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-neutral-500 font-medium">
                    {isHi ? `प्रति ${crop.areaUnit} ${isProfit ? 'लाभ' : 'हानि'}:` : `Per ${crop.areaUnit}:`}
                  </span>{' '}
                  <strong className={isProfit ? 'text-emerald-900 font-bold' : isLoss ? 'text-rose-900 font-bold' : 'text-neutral-800'}>
                    ₹{Number(profitPerAreaUnit).toLocaleString('en-IN')}
                  </strong>
                </div>

                {totalInputExpenses > 0 && (
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs">
                    <span className="text-neutral-500 font-medium">
                      {isHi ? 'लागत पर रिटर्न (ROI):' : 'Return on Cost:'}
                    </span>{' '}
                    <strong className={isProfit ? 'text-emerald-900 font-bold' : isLoss ? 'text-rose-900 font-bold' : 'text-neutral-800'}>
                      {returnOnInvestment}%
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* Arithmetic Calculation Line */}
            <div
              id="arithmetic-breakdown-row"
              className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600"
            >
              <span>
                ₹{totalHarvestRevenue.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] text-neutral-400">({isHi ? 'आय' : 'Revenue'})</span> - (₹{totalFertilizerExpense.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] text-neutral-400">({isHi ? 'खाद' : 'Fert'})</span> + ₹{totalSprayExpense.toLocaleString('en-IN')}{' '}
                <span className="text-[11px] text-neutral-400">({isHi ? 'स्प्रे' : 'Spray'})</span>)
              </span>
              <span className="font-bold text-neutral-900">
                = {netProfitLoss >= 0 ? '+' : '-'}₹{Math.abs(netProfitLoss).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* ITEMIZED DETAILS ACCORDIONS / SECTIONS */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {isHi ? 'मदवार खर्च व बिक्री सूची' : 'Itemized Logs & Transaction Records'}
            </h3>

            {/* 1. Harvest Records Detail Table */}
            <div
              id="harvest-records-table-container"
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <div className="bg-emerald-50 px-3.5 py-2 border-b border-neutral-200 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isHi ? 'उपज बिक्री रिकॉर्ड' : 'Harvest Sales'} ({crop.harvestRecords.length})</span>
                </span>
                <span>₹{totalHarvestRevenue.toLocaleString('en-IN')}</span>
              </div>

              {crop.harvestRecords.length > 0 ? (
                <div className="divide-y divide-neutral-100 text-xs">
                  {crop.harvestRecords.map((h) => (
                    <div key={h.id} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-neutral-900">
                          🌾 {h.yieldAmount} {h.unit} @ ₹{h.sellingRatePerUnit}/{h.unit}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          📅 {h.date} • 🏛️ {h.buyerOrMandi}
                        </p>
                        {h.notes && (
                          <p className="text-[10px] text-neutral-400 italic mt-0.5">"{h.notes}"</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-emerald-900 text-sm">
                          +₹{h.totalRevenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-neutral-400 bg-white">
                  {isHi ? 'कोई कटाई रिकॉर्ड दर्ज नहीं है।' : 'No harvest sales recorded.'}
                </div>
              )}
            </div>

            {/* 2. Fertilizer Applications Detail Table */}
            <div
              id="fertilizer-records-table-container"
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <div className="bg-amber-50 px-3.5 py-2 border-b border-neutral-200 flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isHi ? 'खाद व उर्वरक अनुप्रयोग' : 'Fertilizer Applications'} ({crop.fertilizerLogs.length})</span>
                </span>
                <span>-₹{totalFertilizerExpense.toLocaleString('en-IN')}</span>
              </div>

              {crop.fertilizerLogs.length > 0 ? (
                <div className="divide-y divide-neutral-100 text-xs">
                  {crop.fertilizerLogs.map((f) => (
                    <div key={f.id} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-neutral-900">{f.fertilizerType}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          📦 {f.quantity} {f.unit} • {f.stage} • 📅 {f.date}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {f.applicationMethod}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-amber-950">
                          -₹{(f.cost || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-neutral-400 bg-white">
                  {isHi ? 'कोई खाद का रिकॉर्ड दर्ज नहीं है।' : 'No fertilizer applications recorded.'}
                </div>
              )}
            </div>

            {/* 3. Spray Applications Detail Table */}
            <div
              id="spray-records-table-container"
              className="border border-neutral-200 rounded-xl overflow-hidden"
            >
              <div className="bg-purple-50 px-3.5 py-2 border-b border-neutral-200 flex items-center justify-between text-xs font-bold text-purple-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>{isHi ? 'कीटनाशक व रोग सुरक्षा स्प्रे' : 'Spray & Pesticide Treatments'} ({crop.sprayLogs.length})</span>
                </span>
                <span>-₹{totalSprayExpense.toLocaleString('en-IN')}</span>
              </div>

              {crop.sprayLogs.length > 0 ? (
                <div className="divide-y divide-neutral-100 text-xs">
                  {crop.sprayLogs.map((s) => (
                    <div key={s.id} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-neutral-900">{s.name}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          🛡️ {s.purpose} • 📅 {s.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-purple-950">
                          -₹{(s.cost || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-neutral-400 bg-white">
                  {isHi ? 'कोई स्प्रे रिकॉर्ड दर्ज नहीं है।' : 'No sprays recorded.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div
          id="crop-profit-loss-modal-footer"
          className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0"
        >
          <div className="flex items-center gap-2">
            <button
              id="copy-summary-btn"
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{isHi ? 'कॉपी हो गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  <span>{isHi ? 'शेयर हेतु कॉपी करें' : 'Copy Summary'}</span>
                </>
              )}
            </button>

            <button
              id="print-summary-btn"
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-500" />
              <span>{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>

          <button
            id="close-summary-footer-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer ml-auto"
          >
            {isHi ? 'पूर्ण / बंद करें' : 'Done / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
