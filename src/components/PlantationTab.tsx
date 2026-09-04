import React, { useState } from 'react';
import { 
  Sprout, 
  PlusCircle, 
  FlaskConical, 
  ShieldCheck, 
  Droplets, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Trash2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Calculator,
  Camera
} from 'lucide-react';
import { Language, PlantationCrop } from '../types';
import { translations } from '../utils/translations';
import { CropProfitLossModal } from './modals/CropProfitLossModal';

interface PlantationTabProps {
  crops: PlantationCrop[];
  onAddCrop: () => void;
  onAddFertilizer: (cropId: string) => void;
  onAddSpray: (cropId: string) => void;
  onAddHarvest: (cropId: string) => void;
  onDeleteCrop: (id: string) => void;
  onAskAiForCrop: (crop: PlantationCrop) => void;
  onOpenScanner: (cropId?: string) => void;
  language: Language;
}

export const PlantationTab: React.FC<PlantationTabProps> = ({
  crops,
  onAddCrop,
  onAddFertilizer,
  onAddSpray,
  onAddHarvest,
  onDeleteCrop,
  onAskAiForCrop,
  onOpenScanner,
  language,
}) => {
  const t = translations[language];
  const [expandedCropId, setExpandedCropId] = useState<string | null>(crops[0]?.id || null);
  const [summaryModalCropId, setSummaryModalCropId] = useState<string | null>(null);

  const selectedSummaryCrop = crops.find((c) => c.id === summaryModalCropId) || null;

  const getStatusBadge = (status: PlantationCrop['status']) => {
    switch (status) {
      case 'sown':
        return { label: language === 'hi' ? '🌱 बुवाई (Sown)' : 'Sown', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'growing':
        return { label: language === 'hi' ? '🌿 बढ़वार (Growing)' : 'Growing', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'flowering':
        return { label: language === 'hi' ? '🌸 फूल/बाली (Flowering)' : 'Flowering', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'harvest_ready':
        return { label: language === 'hi' ? '🌾 कटाई योग्य (Ready)' : 'Harvest Ready', color: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'harvested':
        return { label: language === 'hi' ? '✅ कटाई पूर्ण (Harvested)' : 'Harvested', color: 'bg-neutral-100 text-neutral-800 border-neutral-300' };
    }
  };

  return (
    <div id="plantation-tab-view" className="space-y-6">
      {/* Header & Add Crop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {t.plantation.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            {t.plantation.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            id="scan-label-main-header-btn"
            type="button"
            onClick={() => onOpenScanner()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title={language === 'hi' ? 'कैमरा से खाद या कीटनाशक का लेबल स्कैन करें' : 'Scan fertilizer or pesticide label with camera'}
          >
            <Camera className="w-4 h-4 text-purple-200" />
            <span>{language === 'hi' ? 'लेबल स्कैन (AI Camera)' : 'Scan Label (AI Camera)'}</span>
          </button>

          {crops.length > 0 && (
            <button
              id="open-harvest-summary-main-btn"
              type="button"
              onClick={() => {
                const targetCrop = crops.find((c) => c.harvestRecords.length > 0) || crops[0];
                if (targetCrop) setSummaryModalCropId(targetCrop.id);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'फसल लाभ-हानि रिपोर्ट (P&L)' : 'Crop P&L Summary'}</span>
            </button>
          )}

          <button
            id="add-crop-plot-main-btn"
            type="button"
            onClick={onAddCrop}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>{t.plantation.addNewPlot}</span>
          </button>
        </div>
      </div>

      {/* Crops List */}
      <div className="space-y-4">
        {crops.map((crop) => {
          const isExpanded = expandedCropId === crop.id;
          const statusInfo = getStatusBadge(crop.status);

          // Calculate total fertilizer and spray expenses and total harvest revenue
          const totalFertilizerCost = crop.fertilizerLogs.reduce((sum, f) => sum + (f.cost || 0), 0);
          const totalSprayCost = crop.sprayLogs.reduce((sum, s) => sum + (s.cost || 0), 0);
          const totalInputCost = totalFertilizerCost + totalSprayCost;
          const totalHarvestRevenue = crop.harvestRecords.reduce((sum, h) => sum + h.totalRevenue, 0);
          const netProfitLoss = totalHarvestRevenue - totalInputCost;

          return (
            <div
              key={crop.id}
              className="bg-white border border-neutral-200 rounded-2xl shadow-2xs overflow-hidden transition-all"
            >
              {/* Header bar of Crop Plot */}
              <div
                onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-900 flex items-center justify-center font-bold text-lg shrink-0">
                    🌱
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-neutral-900">
                        {crop.plotName}
                      </h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 font-medium mt-0.5">
                      🌾 <strong className="text-neutral-900">{crop.cropName}</strong>
                      {crop.variety && ` (${crop.variety})`} • {crop.areaValue} {crop.areaUnit} • {crop.soilType}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>{t.plantation.plantingDate}: {crop.plantingDate}</span>
                      </span>
                      <span>•</span>
                      <span>{t.plantation.expectedHarvest}: {crop.expectedHarvestDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                  <div className="text-left sm:text-right">
                    {crop.harvestRecords.length > 0 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSummaryModalCropId(crop.id);
                        }}
                        className={`p-2 rounded-xl border text-left sm:text-right transition-all cursor-pointer hover:shadow-xs ${
                          netProfitLoss >= 0
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100/80'
                            : 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/80'
                        }`}
                        title={language === 'hi' ? 'लाभ/हानि रिपोर्ट देखने के लिए क्लिक करें' : 'Click to view Profit/Loss statement'}
                      >
                        <div className="flex items-center gap-1 sm:justify-end">
                          <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-xs font-bold">
                            {netProfitLoss >= 0 ? '+' : '-'}₹{Math.abs(netProfitLoss).toLocaleString('en-IN')}{' '}
                            {language === 'hi' ? (netProfitLoss >= 0 ? 'शुद्ध लाभ' : 'शुद्ध घाटा') : (netProfitLoss >= 0 ? 'Net Profit' : 'Net Loss')}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-600 block mt-0.5">
                          ₹{totalHarvestRevenue.toLocaleString('en-IN')} {language === 'hi' ? 'आय' : 'Rev'} - ₹{totalInputCost.toLocaleString('en-IN')} {language === 'hi' ? 'लागत' : 'Cost'}
                        </span>
                      </button>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-emerald-950 block">
                          🧪 {crop.fertilizerLogs.length} {language === 'hi' ? 'खाद चक्र' : 'Fertilizer Doses'}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          ₹{totalFertilizerCost.toLocaleString('en-IN')} {language === 'hi' ? 'खाद' : 'Fert'} • ₹{totalSprayCost.toLocaleString('en-IN')} {language === 'hi' ? 'स्प्रे' : 'Spray'}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Plot Management */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-neutral-100 bg-neutral-50/40 space-y-5">
                  {/* Action Buttons for this crop */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      id={`crop-scan-label-btn-${crop.id}`}
                      type="button"
                      onClick={() => onOpenScanner(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      title={language === 'hi' ? 'इस खेत के लिए खाद/दवा का लेबल स्कैन करें' : 'Scan fertilizer or spray label for this crop'}
                    >
                      <Camera className="w-3.5 h-3.5 text-purple-200" />
                      <span>{language === 'hi' ? 'लेबल स्कैन' : 'Scan Label'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddFertilizer(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{t.plantation.addFertilizer}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddSpray(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      <span>{t.plantation.addSpray}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddHarvest(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t.plantation.addHarvest}</span>
                    </button>

                    <button
                      id={`crop-pnl-summary-btn-${crop.id}`}
                      type="button"
                      onClick={() => setSummaryModalCropId(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title={language === 'hi' ? 'लाभ व हानि सारांश' : 'Profit & Loss Summary'}
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'hi' ? 'मुनाफ़ा / नुकसान विवरण' : 'Profit/Loss Summary'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAskAiForCrop(crop)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'hi' ? 'फसल की सलाह (AI Advice)' : 'Get AI Advisory'}</span>
                    </button>

                    <div className="ml-auto">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(language === 'hi' ? 'क्या आप इस खेत के रिकॉर्ड को हटाना चाहते हैं?' : 'Delete this crop & plot record?')) {
                            onDeleteCrop(crop.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Fertilizer Logs Sub-section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{t.plantation.fertilizerLogs} ({crop.fertilizerLogs.length})</span>
                      </h3>
                      <span className="text-xs text-neutral-500 font-medium">
                        {language === 'hi' ? 'कुल खाद खर्च:' : 'Total Cost:'} ₹{totalFertilizerCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {crop.fertilizerLogs.map((f) => (
                        <div
                          key={f.id}
                          className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-neutral-900">
                                {f.fertilizerType}
                              </p>
                              <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                                📦 {f.quantity} {f.unit} • {f.applicationMethod}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                              ₹{(f.cost || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 border-t border-neutral-100 pt-1.5">
                            <span>📅 {f.date}</span>
                            <span>🌱 {f.stage}</span>
                          </div>
                          {f.notes && (
                            <p className="text-[10px] text-neutral-500 italic mt-1">"{f.notes}"</p>
                          )}
                        </div>
                      ))}

                      {crop.fertilizerLogs.length === 0 && (
                        <div className="p-4 bg-white rounded-xl border border-dashed border-neutral-300 text-center col-span-full">
                          <p className="text-xs text-neutral-500">
                            {language === 'hi' ? 'अभी कोई खाद का रिकॉर्ड नहीं है। खाद डालने पर रिकॉर्ड दर्ज करें।' : 'No fertilizer logs yet. Click "Add Fertilizer" to record application.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Spray Logs Sub-section */}
                  {crop.sprayLogs.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                        <span>{t.plantation.sprayLogs} ({crop.sprayLogs.length})</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {crop.sprayLogs.map((s) => (
                          <div
                            key={s.id}
                            className="p-3 bg-white rounded-xl border border-neutral-200/80 shadow-2xs flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs font-bold text-neutral-900">{s.name}</p>
                              <p className="text-[11px] text-purple-900 font-medium">{s.purpose}</p>
                              <p className="text-[10px] text-neutral-500 mt-0.5">📅 {s.date}</p>
                            </div>
                            {s.cost && (
                              <span className="text-xs font-bold text-neutral-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                ₹{s.cost.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Harvest & Sale Revenue Records Sub-section */}
                  {crop.harvestRecords.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-200/60">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                          <span>{t.plantation.harvestRecords}</span>
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-emerald-950">
                            {language === 'hi' ? 'कुल बिक्री आय:' : 'Total Harvest Revenue:'} ₹{totalHarvestRevenue.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSummaryModalCropId(crop.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5 text-amber-800" />
                            <span>{language === 'hi' ? 'विस्तृत P&L रिपोर्ट' : 'View P&L Report'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {crop.harvestRecords.map((h) => (
                          <div
                            key={h.id}
                            className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between"
                          >
                            <div>
                              <p className="text-xs font-bold text-neutral-900">
                                🌾 {h.yieldAmount} {h.unit} @ ₹{h.sellingRatePerUnit}/{h.unit}
                              </p>
                              <p className="text-[11px] text-neutral-600 mt-0.5">
                                🏛️ {h.buyerOrMandi} • 📅 {h.date}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-emerald-950">
                                ₹{h.totalRevenue.toLocaleString('en-IN')}
                              </p>
                              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                                Received
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {crops.length === 0 && (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
            <p className="text-sm text-neutral-500 font-medium">
              {language === 'hi' ? 'अभी कोई फसल / खेत नहीं जोड़ा गया है।' : 'No crops or plots registered yet.'}
            </p>
            <button
              type="button"
              onClick={onAddCrop}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-emerald-900 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.plantation.addNewPlot}</span>
            </button>
          </div>
        )}
      </div>

      {/* Crop Profit & Loss Summary Modal */}
      <CropProfitLossModal
        isOpen={selectedSummaryCrop !== null}
        onClose={() => setSummaryModalCropId(null)}
        crop={selectedSummaryCrop}
        crops={crops}
        onSelectCrop={(cropId) => setSummaryModalCropId(cropId)}
        onAddHarvest={(cropId) => onAddHarvest(cropId)}
        language={language}
      />
    </div>
  );
};
