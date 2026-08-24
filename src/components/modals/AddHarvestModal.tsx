import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { HarvestRecord, Language, PlantationCrop } from '../../types';
import { translations } from '../../utils/translations';

interface AddHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: PlantationCrop[];
  selectedCropId?: string;
  onSave: (cropId: string, record: Omit<HarvestRecord, 'id' | 'totalRevenue'>) => void;
  language: Language;
}

export const AddHarvestModal: React.FC<AddHarvestModalProps> = ({
  isOpen,
  onClose,
  crops,
  selectedCropId,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [cropId, setCropId] = useState(selectedCropId || crops[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [yieldAmount, setYieldAmount] = useState('20');
  const [unit, setUnit] = useState<'Quintal' | 'Kg' | 'Bags' | 'Tons' | 'Mann'>('Quintal');
  const [sellingRatePerUnit, setSellingRatePerUnit] = useState('2275');
  const [buyerOrMandi, setBuyerOrMandi] = useState('District Agriculture Produce Mandi');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalCalculated = (Number(yieldAmount) || 0) * (Number(sellingRatePerUnit) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId || Number(yieldAmount) <= 0) return;

    onSave(cropId, {
      date,
      yieldAmount: Number(yieldAmount),
      unit,
      sellingRatePerUnit: Number(sellingRatePerUnit) || 0,
      buyerOrMandi: buyerOrMandi.trim() || 'Local Mandi',
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div id="add-harvest-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-harvest-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'फसल कटाई व बिक्री दर्ज करें' : 'Record Harvest & Sale Revenue'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'खेत व फसल' : 'Select Field / Crop'} *
            </label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.plotName} - {c.cropName} ({c.areaValue} {c.areaUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'कुल पैदावार (Yield)' : 'Total Yield'} *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={yieldAmount}
                onChange={(e) => setYieldAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'इकाई' : 'Unit'}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Quintal">{language === 'hi' ? 'क्विंटल (Quintal - 100kg)' : 'Quintal (100 kg)'}</option>
                <option value="Kg">{language === 'hi' ? 'किलो (Kg)' : 'Kg'}</option>
                <option value="Mann">{language === 'hi' ? 'मन (Mann - 40kg)' : 'Mann (40 kg)'}</option>
                <option value="Bags">{language === 'hi' ? 'बोरी (Bags)' : 'Bags'}</option>
                <option value="Tons">{language === 'hi' ? 'टन (Tons)' : 'Tons'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'बिक्री भाव प्रति इकाई (₹)' : 'Selling Rate / Unit (₹)'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={sellingRatePerUnit}
                onChange={(e) => setSellingRatePerUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'बिक्री दिनांक' : 'Sale Date'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Revenue Calculation Live Banner */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium">
                {language === 'hi' ? 'कुल प्राप्त आय (Revenue):' : 'Estimated Total Revenue:'}
              </p>
              <p className="text-xl font-bold text-emerald-950">
                ₹{totalCalculated.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-full">
              {yieldAmount} {unit} @ ₹{sellingRatePerUnit}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'खरीदार / मंडी का नाम' : 'Buyer or Mandi'}
            </label>
            <input
              type="text"
              value={buyerOrMandi}
              onChange={(e) => setBuyerOrMandi(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. जिला गल्ला मंडी / स्थानीय व्यापारी' : 'e.g. District Grain Mandi / Merchant'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'टिप्पणी' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. वजन पर्ची क्रमांक 402' : 'e.g. Mandi weighbridge slip #402'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs transition-colors"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
