import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { Language, PlantationCrop, SprayLog } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddSprayModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: PlantationCrop[];
  selectedCropId?: string;
  onSave: (cropId: string, log: Omit<SprayLog, 'id'>, alsoRecordExpense: boolean) => void;
  language: Language;
}

export const AddSprayModal: React.FC<AddSprayModalProps> = ({
  isOpen,
  onClose,
  crops,
  selectedCropId,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [cropId, setCropId] = useState(selectedCropId || crops[0]?.id || '');
  const [name, setName] = useState('Neem Oil Extract + Fungicide');
  const [purpose, setPurpose] = useState('Pest & Leaf Curl Prevention');
  const [cost, setCost] = useState('450');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [alsoRecordExpense, setAlsoRecordExpense] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId || !name.trim()) return;

    onSave(
      cropId,
      {
        date,
        name: name.trim(),
        purpose: purpose.trim(),
        cost: Number(cost) || 0,
      },
      alsoRecordExpense
    );

    onClose();
  };

  return (
    <div id="add-spray-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-spray-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'कीटनाशक / दवाई स्प्रे दर्ज करें' : 'Log Spray Application'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'खेत व फसल चुनें' : 'Select Field / Crop'} *
            </label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.plotName} - {c.cropName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {language === 'hi' ? 'दवाई / कीटनाशक / टॉनिक का नाम' : 'Spray / Chemical Name'} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setName((p) => (p ? `${p} ${text}` : text))}
              />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. रोगोर (Rogor), नीम तेल, इंडोफिल M-45' : 'e.g. Rogor 30 EC, Neem Oil, Mancozeb'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'छिड़काव का उद्देश्य (Purpose / Disease)' : 'Purpose / Disease Protection'}
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. माहू/चेपा रोकथाम, पत्ती झुलसा, फफूंद' : 'e.g. Aphid control, Blight protection, Growth booster'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'दवाई की लागत (₹)' : 'Spray Cost (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'छिड़काव की तारीख' : 'Spray Date'}
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

          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <input
              id="also-record-spray-exp"
              type="checkbox"
              checked={alsoRecordExpense}
              onChange={(e) => setAlsoRecordExpense(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
            <label htmlFor="also-record-spray-exp" className="text-xs font-medium text-emerald-950 cursor-pointer">
              {language === 'hi'
                ? 'इस दवाई के खर्च को भी खर्च रजिस्टर में जोड़ें'
                : 'Also add spray cost to Expense Register'}
            </label>
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
