import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  PlusCircle, 
  Search, 
  Download, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { GiftItem, Language } from '../types';
import { translations } from '../utils/translations';
import { exportGiftsToCSV } from '../utils/storage';
import { VoiceInputButton } from './VoiceInputButton';

interface GiftsTabProps {
  gifts: GiftItem[];
  onAddGift: () => void;
  onToggleCounterSettled: (id: string) => void;
  onDeleteGift: (id: string) => void;
  language: Language;
}

export const GiftsTab: React.FC<GiftsTabProps> = ({
  gifts,
  onAddGift,
  onToggleCounterSettled,
  onDeleteGift,
  language,
}) => {
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'received' | 'given' | 'pending_return'>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Occasions list
  const occasions = useMemo(() => {
    const set = new Set<string>();
    gifts.forEach((g) => set.add(g.occasion));
    return Array.from(set);
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      if (activeFilter === 'received' && g.type !== 'received') return false;
      if (activeFilter === 'given' && g.type !== 'given') return false;
      if (activeFilter === 'pending_return' && (g.type !== 'received' || g.counterGiftSettled)) return false;

      if (selectedOccasion !== 'all' && g.occasion !== selectedOccasion) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = g.personName.toLowerCase().includes(query);
        const matchVillage = (g.villageOrRelation || '').toLowerCase().includes(query);
        const matchOccasion = g.occasion.toLowerCase().includes(query);
        const matchDesc = (g.itemDescription || '').toLowerCase().includes(query);
        if (!matchName && !matchVillage && !matchOccasion && !matchDesc) return false;
      }

      return true;
    });
  }, [gifts, activeFilter, selectedOccasion, searchTerm]);

  // Aggregate Stats
  const totalReceived = useMemo(() => {
    return gifts.filter((g) => g.type === 'received').reduce((sum, g) => sum + g.amountOrValue, 0);
  }, [gifts]);

  const totalGiven = useMemo(() => {
    return gifts.filter((g) => g.type === 'given').reduce((sum, g) => sum + g.amountOrValue, 0);
  }, [gifts]);

  const pendingToReturnCount = useMemo(() => {
    return gifts.filter((g) => g.type === 'received' && !g.counterGiftSettled).length;
  }, [gifts]);

  const getGiftCategoryIcon = (cat: GiftItem['giftCategory']) => {
    switch (cat) {
      case 'cash':
        return '💵';
      case 'gold_silver':
        return '🪙';
      case 'utensils':
        return '🍽️';
      case 'clothes':
        return '👗';
      case 'livestock':
        return '🐄';
      default:
        return '🎁';
    }
  };

  return (
    <div id="gifts-tab-view" className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {t.gifts.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            {t.gifts.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-gifts-csv-btn"
            type="button"
            onClick={() => exportGiftsToCSV(filteredGifts)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'शगुन बही CSV' : 'Export CSV'}</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <button
            id="add-gift-main-btn"
            type="button"
            onClick={onAddGift}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>{t.gifts.addNewGift}</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.gifts.receivedTotal}</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold">
              {gifts.filter((g) => g.type === 'received').length} {language === 'hi' ? 'लिफाफे' : 'Entries'}
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            ₹{totalReceived.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600" />
              <span>{t.gifts.givenTotal}</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-900 font-semibold">
              {gifts.filter((g) => g.type === 'given').length} {language === 'hi' ? 'दिए गए' : 'Entries'}
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            ₹{totalGiven.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.gifts.pendingReturns}</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
              {pendingToReturnCount}
            </span>
          </div>
          <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
            {language === 'hi'
              ? 'आए हुए शगुन जिन्हें उनके घर किसी अवसर पर लौटाना बाकी है।'
              : 'Gifts received that are due to be reciprocated at future events.'}
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी शगुन (All)' : 'All Records' },
            { id: 'received', label: `📥 ${t.gifts.received}` },
            { id: 'given', label: `📤 ${t.gifts.given}` },
            { id: 'pending_return', label: `⏳ ${language === 'hi' ? 'लौटाना बाकी (Pending Return)' : 'Pending Return'}` },
          ].map((f) => {
            const isSel = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-8 relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.gifts.searchPlaceholder}
              className="w-full pl-9 pr-14 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
            <div className="absolute right-1">
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setSearchTerm(text)}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी अवसर (All Occasions)' : 'All Occasions'}</option>
              {occasions.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gifts List */}
      <div className="space-y-3">
        {filteredGifts.map((gift) => {
          const isReceived = gift.type === 'received';
          const icon = getGiftCategoryIcon(gift.giftCategory);

          return (
            <div
              key={gift.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isReceived
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    }`}
                  >
                    {isReceived ? '📥 Shagun Received' : '📤 Shagun Given'}
                  </span>

                  <span className="text-sm font-bold text-neutral-900">
                    {gift.personName}
                  </span>

                  {gift.villageOrRelation && (
                    <span className="text-xs text-neutral-600 font-medium">
                      ({gift.villageOrRelation})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-800">
                    🎉 {gift.occasion}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>{gift.date}</span>
                  </span>
                  <span>•</span>
                  <span>{icon} {gift.giftCategory}</span>
                </div>

                {gift.itemDescription && (
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2 rounded-lg border border-neutral-200/50">
                    🎁 {gift.itemDescription}
                  </p>
                )}

                {/* Reciprocity Counter Note for Received Gifts */}
                {isReceived && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onToggleCounterSettled(gift.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        gift.counterGiftSettled
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {gift.counterGiftSettled
                          ? (language === 'hi' ? 'हिसाब चुकता (Reciprocated)' : 'Settled')
                          : (language === 'hi' ? 'लौटाना शेष (Pending Return)' : 'Pending Return')}
                      </span>
                    </button>

                    {gift.counterGiftDetails && (
                      <span className="text-xs text-neutral-600 italic">
                        "{gift.counterGiftDetails}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Amount & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold text-emerald-950">
                    ₹{gift.amountOrValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {gift.giftCategory === 'cash' ? 'Cash Shagun' : 'Estimated Value'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteGift(gift.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredGifts.length === 0 && (
          <div className="p-12 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
            <p className="text-sm text-neutral-500 font-medium">
              {language === 'hi' ? 'कोई शगुन या उपहार प्रविष्टि नहीं मिली।' : 'No gift entries found.'}
            </p>
            <button
              type="button"
              onClick={onAddGift}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-emerald-900 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t.gifts.addNewGift}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
