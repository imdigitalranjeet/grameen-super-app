import React, { useState } from 'react';
import { X, Receipt, Sparkles } from 'lucide-react';
import { ExpenseCategory, ExpenseItem, Language, PlantationCrop } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<ExpenseItem, 'id'>) => void;
  language: Language;
  crops: PlantationCrop[];
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  language,
  crops,
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('fertilizer');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isFarming, setIsFarming] = useState<boolean>(true);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'credit' | 'bank_transfer'>('cash');
  const [cropOrPlot, setCropOrPlot] = useState<string>(crops[0]?.plotName || '');
  const [quantityUsed, setQuantityUsed] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    onSave({
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      isFarming,
      paymentMode,
      cropOrPlot: isFarming ? cropOrPlot : undefined,
      quantityUsed: quantityUsed.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset
    setTitle('');
    setAmount('');
    setQuantityUsed('');
    setNotes('');
    onClose();
  };

  const handleCategoryChange = (cat: ExpenseCategory) => {
    setCategory(cat);
    const farmingCategories: ExpenseCategory[] = ['fertilizer', 'seeds', 'pesticide', 'diesel_tractor', 'labor', 'irrigation'];
    setIsFarming(farmingCategories.includes(cat));
  };

  return (
    <div id="add-expense-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-expense-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {t.expenses.addNewExpense}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Expense Nature Toggle */}
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => {
                setIsFarming(true);
                setCategory('fertilizer');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isFarming
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🌾 {language === 'hi' ? 'खेती-बाड़ी खर्च (Farm)' : 'Farming & Crop Cost'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFarming(false);
                setCategory('groceries');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isFarming
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🛒 {language === 'hi' ? 'दैनिक व राशन खर्च (Daily)' : 'Daily & Household Cost'}
            </button>
          </div>

          {/* Expense Title + Voice input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {language === 'hi' ? 'खर्च का नाम / विवरण' : 'Expense Title'} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setTitle((prev) => (prev ? `${prev} ${text}` : text))}
              />
            </div>
            <input
              id="expense-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isFarming
                  ? language === 'hi'
                    ? 'उदा. 2 बोरी यूरिया खाद, ट्रैक्टर जुताई, गेहूं बीज'
                    : 'e.g. 2 Bags Urea fertilizer, Tractor ploughing, Wheat seed'
                  : language === 'hi'
                  ? 'उदा. साप्ताहिक राशन व तेल, बच्चों की स्कूल कॉपी'
                  : 'e.g. Weekly grocery & mustard oil, School books'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          {/* Category & Amount in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.expenses.category}
              </label>
              <select
                id="expense-category-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <optgroup label={language === 'hi' ? 'खेती से जुड़े खर्च' : 'Farming Costs'}>
                  <option value="fertilizer">{t.expenses.categories.fertilizer}</option>
                  <option value="seeds">{t.expenses.categories.seeds}</option>
                  <option value="pesticide">{t.expenses.categories.pesticide}</option>
                  <option value="diesel_tractor">{t.expenses.categories.diesel_tractor}</option>
                  <option value="labor">{t.expenses.categories.labor}</option>
                  <option value="irrigation">{t.expenses.categories.irrigation}</option>
                </optgroup>
                <optgroup label={language === 'hi' ? 'दैनिक व घरेलू खर्च' : 'Daily & Family Costs'}>
                  <option value="groceries">{t.expenses.categories.groceries}</option>
                  <option value="household">{t.expenses.categories.household}</option>
                  <option value="medical">{t.expenses.categories.medical}</option>
                  <option value="education">{t.expenses.categories.education}</option>
                  <option value="electricity_bills">{t.expenses.categories.electricity_bills}</option>
                  <option value="livestock_fodder">{t.expenses.categories.livestock_fodder}</option>
                  <option value="other">{t.expenses.categories.other}</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.expenses.amount} (₹) *
              </label>
              <input
                id="expense-amount-input"
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="540"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Date & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.expenses.date}
              </label>
              <input
                id="expense-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.expenses.paymentMode}
              </label>
              <select
                id="expense-payment-mode-select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="cash">{language === 'hi' ? 'नकद (Cash)' : 'Cash'}</option>
                <option value="upi">{language === 'hi' ? 'ऑनलाइन / UPI (Google Pay, PhonePe, Paytm)' : 'UPI / Online'}</option>
                <option value="credit">{language === 'hi' ? 'उधारी / खाता (Credit Udhaar)' : 'Credit / Khata'}</option>
                <option value="bank_transfer">{language === 'hi' ? 'बैंक ट्रांसफर / चेक' : 'Bank Transfer'}</option>
              </select>
            </div>
          </div>

          {/* If Farming, show Associated Field / Plot */}
          {isFarming && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.expenses.cropOrField}
              </label>
              <input
                id="expense-crop-plot-input"
                type="text"
                value={cropOrPlot}
                onChange={(e) => setCropOrPlot(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. उत्तर वाला गेहूं का खेत, सरसों का चक' : 'e.g. North Wheat Field, East Mustard Field'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          )}

          {/* Quantity Used / Breakdown */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {t.expenses.quantity} ({language === 'hi' ? 'मात्रा व विवरण' : 'e.g. 2 Bags, 15 Liters, 5 kg'})
            </label>
            <input
              id="expense-quantity-input"
              type="text"
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. 2 बोरी (90 किलो), 20 लीटर डीजल' : 'e.g. 2 Bags (90 kg), 20 Liters Diesel'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {t.expenses.notes}
            </label>
            <input
              id="expense-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'दुकानदार का नाम, बिल नंबर या विशेष टिप्पणी' : 'Dealer name, receipt number or extra note'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              id="save-expense-btn"
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
