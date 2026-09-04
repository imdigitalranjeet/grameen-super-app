import React, { useState, useEffect } from 'react';
import { X, FlaskConical, Sparkles } from 'lucide-react';
import { FertilizerLog, Language, PlantationCrop } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddFertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: PlantationCrop[];
  selectedCropId?: string;
  initialData?: Partial<FertilizerLog>;
  onSave: (cropId: string, log: Omit<FertilizerLog, 'id'>, createExpenseEntry: boolean) => void;
  language: Language;
}

export const AddFertilizerModal: React.FC<AddFertilizerModalProps> = ({
  isOpen,
  onClose,
  crops,
  selectedCropId,
  initialData,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [cropId, setCropId] = useState(selectedCropId || crops[0]?.id || '');
  const [fertilizerType, setFertilizerType] = useState('Neem Coated Urea');
  const [quantity, setQuantity] = useState('2');
  const [unit, setUnit] = useState<'bags' | 'kg' | 'quintal' | 'liters'>('bags');
  const [cost, setCost] = useState('540');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [applicationMethod, setApplicationMethod] = useState<'Broadcasting' | 'Drip/Fertigation' | 'Foliar Spray' | 'Basal Application'>('Broadcasting');
  const [stage, setStage] = useState('Top Dressing');
  const [notes, setNotes] = useState('');
  const [alsoRecordExpense, setAlsoRecordExpense] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (selectedCropId) {
        setCropId(selectedCropId);
      } else if (crops.length > 0 && !cropId) {
        setCropId(crops[0].id);
      }

      if (initialData) {
        if (initialData.fertilizerType) setFertilizerType(initialData.fertilizerType);
        if (initialData.quantity !== undefined) setQuantity(String(initialData.quantity));
        if (initialData.unit) setUnit(initialData.unit);
        if (initialData.cost !== undefined) setCost(String(initialData.cost));
        if (initialData.date) setDate(initialData.date);
        if (initialData.applicationMethod) setApplicationMethod(initialData.applicationMethod);
        if (initialData.stage) setStage(initialData.stage);
        if (initialData.notes !== undefined) setNotes(initialData.notes);
      }
    }
  }, [isOpen, initialData, selectedCropId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropId || !fertilizerType.trim()) return;

    onSave(
      cropId,
      {
        date,
        fertilizerType: fertilizerType.trim(),
        quantity: Number(quantity) || 1,
        unit,
        cost: Number(cost) || 0,
        applicationMethod,
        stage: stage.trim() || 'General Nutrition',
        notes: notes.trim() || undefined,
      },
      alsoRecordExpense
    );

    onClose();
  };

  return (
    <div id="add-fertilizer-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-fertilizer-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'खाद डालने का रिकॉर्ड दर्ज करें' : 'Log Fertilizer Application'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {initialData?.fertilizerType && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-medium">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                {language === 'hi'
                  ? '✨ कैमरा लेबल स्कैनर द्वारा जानकारी स्वतः भर दी गई है। आवश्यकतानुसार जांच लें।'
                  : '✨ Details auto-filled from Camera Label Scanner. Review or edit before saving.'}
              </span>
            </div>
          )}

          {/* Select Target Crop / Plot */}
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
                  {c.plotName} - {c.cropName} ({c.areaValue} {c.areaUnit})
                </option>
              ))}
            </select>
          </div>

          {/* Fertilizer Type Preset & Custom */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {language === 'hi' ? 'खाद / उर्वरक का नाम' : 'Fertilizer Name'} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setFertilizerType((p) => (p ? `${p} ${text}` : text))}
              />
            </div>
            <input
              type="text"
              required
              value={fertilizerType}
              onChange={(e) => setFertilizerType(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. यूरिया (Urea), डीएपी (DAP), पोटाश (MOP), 19:19:19' : 'e.g. Urea, DAP, NPK 19:19:19, Zinc, Potash'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Neem Coated Urea', 'DAP 18:46:0', 'NPK 19:19:19', 'MOP Potash', 'Zinc Sulphate', 'Gobar Khad (Vermicompost)'].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setFertilizerType(chip)}
                  className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md hover:bg-emerald-100"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'मात्रा (Quantity)' : 'Quantity'} *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'इकाई (Unit)' : 'Unit'}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="bags">{language === 'hi' ? 'बोरी (Bags)' : 'Bags'}</option>
                <option value="kg">{language === 'hi' ? 'किलो (Kg)' : 'Kg'}</option>
                <option value="quintal">{language === 'hi' ? 'क्विंटल (Quintal)' : 'Quintal'}</option>
                <option value="liters">{language === 'hi' ? 'लीटर (Liters)' : 'Liters'}</option>
              </select>
            </div>
          </div>

          {/* Cost & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'लागत / कीमत (₹)' : 'Cost (₹)'}
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
                {language === 'hi' ? 'तारीख (Date)' : 'Application Date'}
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

          {/* Method & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'डालने का तरीका (Method)' : 'Application Method'}
              </label>
              <select
                value={applicationMethod}
                onChange={(e) => setApplicationMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Broadcasting">{language === 'hi' ? 'हाथ से छींटा मारना (Broadcasting)' : 'Broadcasting'}</option>
                <option value="Basal Application">{language === 'hi' ? 'बुवाई के समय नीचे डालना (Basal)' : 'Basal Dose'}</option>
                <option value="Foliar Spray">{language === 'hi' ? 'पत्तियों पर स्प्रे (Foliar Spray)' : 'Foliar Spray'}</option>
                <option value="Drip/Fertigation">{language === 'hi' ? 'ड्रिप / पानी के साथ घोल (Fertigation)' : 'Drip / Fertigation'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'फसल अवस्था (Stage)' : 'Growth Stage'}
              </label>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. पहली सिंचाई के बाद (21 दिन)' : 'e.g. 1st Top Dressing (21 Days)'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'विशेष टिप्पणी (Notes)' : 'Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. सुबह ओस सूखने के बाद डाला गया' : 'e.g. Applied in cool evening after light watering'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Auto-record in Expense Register Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <input
              id="also-record-expense-chk"
              type="checkbox"
              checked={alsoRecordExpense}
              onChange={(e) => setAlsoRecordExpense(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
            <label htmlFor="also-record-expense-chk" className="text-xs font-medium text-emerald-950 cursor-pointer">
              {language === 'hi'
                ? 'इस खाद की लागत को खर्च रजिस्टर (Kharcha Register) में भी स्वतः जोड़ें'
                : 'Also automatically add this cost to Expense Register'}
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
