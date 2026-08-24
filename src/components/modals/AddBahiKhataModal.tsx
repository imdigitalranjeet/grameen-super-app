import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { BahiKhataItem, Language } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddBahiKhataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<BahiKhataItem, 'id'>) => void;
  language: Language;
}

export const AddBahiKhataModal: React.FC<AddBahiKhataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [type, setType] = useState<'you_gave' | 'you_took'>('you_took');
  const [personName, setPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || Number(amount) <= 0) return;

    onSave({
      type,
      personName: personName.trim(),
      phone: phone.trim() || undefined,
      amount: Number(amount),
      date,
      dueDate: dueDate || undefined,
      settled: false,
      purpose: purpose.trim() || 'General Credit',
      notes: notes.trim() || undefined,
    });

    setPersonName('');
    setPhone('');
    setAmount('');
    setPurpose('');
    setNotes('');
    onClose();
  };

  return (
    <div id="add-bahikhata-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-bahikhata-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'उधारी / बही-खाता प्रविष्टि' : 'Add Udhaar / Credit Entry'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setType('you_took')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'you_took'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🔴 {language === 'hi' ? 'आपने लिया (You Took Credit / Dena Hai)' : 'You Took (You Owe)'}
            </button>
            <button
              type="button"
              onClick={() => setType('you_gave')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'you_gave'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🟢 {language === 'hi' ? 'आपने दिया (You Gave Advance / Lena Hai)' : 'You Gave (They Owe)'}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {language === 'hi' ? 'व्यक्ति / दुकानदार का नाम' : 'Person or Shop Name'} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setPersonName((p) => (p ? `${p} ${text}` : text))}
              />
            </div>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. शर्मा खाद भंडार, सूरज पाल ट्रैक्टर वाले' : 'e.g. Sharma Fertilizer Store, Suraj Pal'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'राशि (Amount ₹)' : 'Amount (₹)'} *
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1200"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'मोबाइल नंबर (WhatsApp के लिए)' : 'Mobile Phone'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'उधारी तारीख' : 'Entry Date'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'चुकता करने की नियत तारीख' : 'Due Date for Settlement'}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'उद्देश्य / किस चीज का बाकी है' : 'Purpose / Item Description'}
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. 2 बोरी यूरिया का बकाया, थ्रेशर बुकिंग का एडवांस' : 'e.g. 2 bags Urea balance, Harvester advance'}
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
