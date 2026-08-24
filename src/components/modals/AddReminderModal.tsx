import React, { useState } from 'react';
import { X, BellPlus } from 'lucide-react';
import { Language, PlantationCrop, ReminderItem } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: PlantationCrop[];
  onSave: (reminder: Omit<ReminderItem, 'id' | 'completed'>) => void;
  language: Language;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  crops,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderItem['category']>('fertilizer_due');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [dueTime, setDueTime] = useState('08:00 AM');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [recurring, setRecurring] = useState<'none' | 'weekly' | 'monthly' | 'seasonal'>('none');
  const [relatedPlotOrCrop, setRelatedPlotOrCrop] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      priority,
      recurring,
      relatedPlotOrCrop: relatedPlotOrCrop.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div id="add-reminder-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-reminder-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <BellPlus className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">
              {t.reminders.addNewReminder}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {language === 'hi' ? 'रिमाइंडर का विषय / कार्य' : 'Reminder Title'} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setTitle((p) => (p ? `${p} ${text}` : text))}
              />
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'उदा. गेहूं में यूरिया का दूसरा छींटा, ट्यूबवेल बिजली बिल भुगतान, KCC नवीनीकरण'
                  : 'e.g. Second Urea top dressing on wheat, Pay electricity bill, Return shagun'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'अलर्ट श्रेणी (Category)' : 'Reminder Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="fertilizer_due">{language === 'hi' ? '🧪 खाद डालने की तारीख (Fertilizer)' : 'Fertilizer Application'}</option>
                <option value="spray_due">{language === 'hi' ? '🛡️ कीटनाशक स्प्रे (Spray)' : 'Pesticide / Spray Cycle'}</option>
                <option value="irrigation_due">{language === 'hi' ? '💧 सिंचाई का टर्न (Irrigation)' : 'Irrigation Roster'}</option>
                <option value="kcc_loan_emi">{language === 'hi' ? '🏦 KCC लोन / बैंक किस्त' : 'KCC Loan / Bank EMI'}</option>
                <option value="electricity_bill">{language === 'hi' ? '⚡ बिजली बिल अंतिम तिथि' : 'Electricity / Utility Bill'}</option>
                <option value="seeds_booking">{language === 'hi' ? '🌱 बीज व खाद बुकिंग' : 'Seed / Fertilizer Booking'}</option>
                <option value="gift_return">{language === 'hi' ? '🎁 शगुन / न्योता लौटाने की तिथि' : 'Return Shagun / Sagan'}</option>
                <option value="gram_sabha">{language === 'hi' ? '🏛️ ग्राम सभा / पंचायत बैठक' : 'Gram Sabha / Panchayat'}</option>
                <option value="general">{language === 'hi' ? '📌 अन्य सामान्य काम' : 'General Reminder'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'प्राथमिकता (Priority)' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="high">{language === 'hi' ? '🔴 अति आवश्यक (High Urgency)' : 'High Priority'}</option>
                <option value="medium">{language === 'hi' ? '🟡 सामान्य (Normal)' : 'Normal Priority'}</option>
                <option value="low">{language === 'hi' ? '🟢 कम जरूरी (Low)' : 'Low Priority'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.reminders.dueDate} *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.reminders.time}
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="07:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'संबंधित खेत / फसल (वैकल्पिक)' : 'Related Crop or Plot (Optional)'}
            </label>
            <input
              type="text"
              value={relatedPlotOrCrop}
              onChange={(e) => setRelatedPlotOrCrop(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. उत्तर वाला गेहूं का खेत' : 'e.g. North Field - Wheat'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'पुनरावृत्ति (Repeat)' : 'Recurring'}
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="none">{language === 'hi' ? 'एक बार (One Time)' : 'One Time'}</option>
              <option value="weekly">{language === 'hi' ? 'साप्ताहिक (Weekly)' : 'Weekly'}</option>
              <option value="monthly">{language === 'hi' ? 'मासिक (Monthly)' : 'Monthly'}</option>
              <option value="seasonal">{language === 'hi' ? 'मौसमी (Seasonal)' : 'Seasonal'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'विवरण या निर्देश' : 'Notes / Instructions'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. शाम 5 बजे से पहले बैंक में जमा करना है' : 'e.g. Apply after morning dew dries'}
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
