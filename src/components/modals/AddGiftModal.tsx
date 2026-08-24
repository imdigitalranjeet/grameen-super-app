import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { GiftItem, Language } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gift: Omit<GiftItem, 'id'>) => void;
  language: Language;
}

export const AddGiftModal: React.FC<AddGiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [type, setType] = useState<'received' | 'given'>('received');
  const [personName, setPersonName] = useState('');
  const [villageOrRelation, setVillageOrRelation] = useState('');
  const [occasion, setOccasion] = useState<GiftItem['occasion']>('Daughter Wedding / Kanyadan');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [giftCategory, setGiftCategory] = useState<GiftItem['giftCategory']>('cash');
  const [amountOrValue, setAmountOrValue] = useState('2100');
  const [itemDescription, setItemDescription] = useState('');
  const [counterGiftSettled, setCounterGiftSettled] = useState(false);
  const [counterGiftDetails, setCounterGiftDetails] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    onSave({
      type,
      personName: personName.trim(),
      villageOrRelation: villageOrRelation.trim() || 'Village Member',
      occasion,
      date,
      giftCategory,
      amountOrValue: Number(amountOrValue) || 0,
      itemDescription: itemDescription.trim() || undefined,
      counterGiftSettled,
      counterGiftDetails: counterGiftDetails.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setPersonName('');
    setVillageOrRelation('');
    setItemDescription('');
    setCounterGiftDetails('');
    setNotes('');
    onClose();
  };

  return (
    <div id="add-gift-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-gift-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold">
              {t.gifts.addNewGift}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle: Shagun Received vs Given */}
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setType('received')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'received'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              📥 {language === 'hi' ? 'आया हुआ शगुन (Received)' : 'Shagun Received'}
            </button>
            <button
              type="button"
              onClick={() => setType('given')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'given'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              📤 {language === 'hi' ? 'दिया हुआ शगुन (Given)' : 'Shagun Given'}
            </button>
          </div>

          {/* Person Name + Voice */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {t.gifts.personName} *
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
              placeholder={language === 'hi' ? 'उदा. रामेश्वर शर्मा, मुखिया जी, सुरेश वर्मा (मामा जी)' : 'e.g. Rameshwar Sharma, Mukhiya Ji, Uncle Suresh'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Village / Relation & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.gifts.villageOrRelation}
              </label>
              <input
                type="text"
                value={villageOrRelation}
                onChange={(e) => setVillageOrRelation(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. रामपुर खास, मामा जी, पड़ोसी' : 'e.g. Rampur Village, Maternal Uncle, Neighbor'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.gifts.occasion} *
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Daughter Wedding / Kanyadan">{language === 'hi' ? '👰 बेटी की शादी (कन्यादान / शादी)' : 'Daughter Wedding / Kanyadan'}</option>
                <option value="Son Wedding / Barat">{language === 'hi' ? '🤵 बेटे का विवाह (बारात / ब्याह)' : 'Son Wedding / Barat'}</option>
                <option value="Housewarming / Griha Pravesh">{language === 'hi' ? '🏡 गृह प्रवेश (नया घर)' : 'Housewarming / Griha Pravesh'}</option>
                <option value="Mundan / Baby Shower">{language === 'hi' ? '👶 मुंडन / नामकरण / छठी' : 'Mundan / Baby Ceremony'}</option>
                <option value="Festival / Diwali / Holi / Eid">{language === 'hi' ? '🪔 त्यौहार (दीवाली / होली / ईद)' : 'Festival (Diwali / Eid)'}</option>
                <option value="Anniversary / Birthday">{language === 'hi' ? '🎂 जन्मदिन / वर्षगांठ' : 'Birthday / Anniversary'}</option>
                <option value="Retirement">{language === 'hi' ? '🎖️ विदाई / सेवानिवृत्ति' : 'Retirement'}</option>
                <option value="Other Social Event">{language === 'hi' ? '🤝 अन्य सामाजिक उत्सव' : 'Other Social Event'}</option>
              </select>
            </div>
          </div>

          {/* Gift Category & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.gifts.giftType}
              </label>
              <select
                value={giftCategory}
                onChange={(e) => setGiftCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="cash">{language === 'hi' ? '💵 नकद लिफाफा (Cash Lifafa)' : 'Cash Lifafa'}</option>
                <option value="gold_silver">{language === 'hi' ? '🪙 सोना / चांदी (Gold/Silver)' : 'Gold / Silver Jewelry'}</option>
                <option value="utensils">{language === 'hi' ? '🍽️ बर्तन / स्टील सेट (Utensils)' : 'Utensils / Cookware'}</option>
                <option value="clothes">{language === 'hi' ? '👗 कपड़े / शॉल / साड़ी (Clothes)' : 'Clothes / Saree / Shawl'}</option>
                <option value="livestock">{language === 'hi' ? '🐄 पशुधन / गाय-बछिया (Livestock)' : 'Livestock'}</option>
                <option value="other">{language === 'hi' ? '🎁 अन्य उपहार (Other)' : 'Other Gift'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.gifts.amountValue} *
              </label>
              <input
                type="number"
                min="0"
                required
                value={amountOrValue}
                onChange={(e) => setAmountOrValue(e.target.value)}
                placeholder="2100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Cash Presets */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-neutral-500 self-center mr-1">
              {language === 'hi' ? 'शुभ शगुन:' : 'Presets:'}
            </span>
            {['501', '1100', '2100', '5100', '11000', '21000', '31000', '51000'].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmountOrValue(preset)}
                className="px-2 py-0.5 text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-md hover:bg-amber-100 font-medium"
              >
                ₹{Number(preset).toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Item Description (Gold / Utensils / Cash details) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'उपहार का विस्तृत विवरण' : 'Gift Item Description'}
            </label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. ₹5,100 नकद + 1 चांदी का सिक्का (10 ग्राम)' : 'e.g. ₹5,100 Cash + 1 Silver Coin (10g)'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'समारोह की तारीख' : 'Event Date'}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Return Reciprocity Settlement */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="counter-gift-chk"
                type="checkbox"
                checked={counterGiftSettled}
                onChange={(e) => setCounterGiftSettled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
              <label htmlFor="counter-gift-chk" className="text-xs font-semibold text-neutral-900 cursor-pointer">
                {language === 'hi'
                  ? 'शगुन का हिसाब चुकता / वापस लौटा दिया गया है (Reciprocated)'
                  : 'Gift is already reciprocated / settled'}
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                {language === 'hi' ? 'लौटाने की स्थिति / विवरण (Counter Details)' : 'Counter Return Details / Occasion'}
              </label>
              <input
                type="text"
                value={counterGiftDetails}
                onChange={(e) => setCounterGiftDetails(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'उदा. उनके बेटे के ब्याह में ₹5,100 लौटाना बाकी है (सितंबर 2026)'
                    : 'e.g. Need to return at their nephew wedding in Sept 2026'
                }
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Extra Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'अन्य कोई टिप्पणी' : 'Additional Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. पूरे परिवार सहित उपस्थित हुए थे' : 'e.g. Attended with whole family'}
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
