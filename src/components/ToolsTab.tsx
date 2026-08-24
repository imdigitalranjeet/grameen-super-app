import React, { useState } from 'react';
import { 
  Bot, 
  Calculator, 
  TrendingUp, 
  BookOpen, 
  PhoneCall, 
  Sparkles, 
  Send, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Share2, 
  Sprout, 
  FlaskConical, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { BahiKhataItem, Language, MandiPrice, PlantationCrop, VillageSuperAppState } from '../types';
import { translations } from '../utils/translations';
import { VoiceInputButton } from './VoiceInputButton';

interface ToolsTabProps {
  state: VillageSuperAppState;
  onAddBahiKhata: () => void;
  onToggleBahiSettled: (id: string) => void;
  onDeleteBahiKhata: (id: string) => void;
  onOpenBackupModal: () => void;
  language: Language;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  state,
  onAddBahiKhata,
  onToggleBahiSettled,
  onDeleteBahiKhata,
  onOpenBackupModal,
  language,
}) => {
  const t = translations[language];

  // Active Tool Sub-tab
  const [activeSubTool, setActiveSubTool] = useState<'ai_advisor' | 'calc' | 'mandi' | 'bahikhata' | 'helpline'>('ai_advisor');

  // 1. AI Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiConversation, setAiConversation] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: language === 'hi'
        ? 'नमस्कार किसान भाई! मैं आपका ग्राम सुपर सहायक (Kisan AI) हूँ। आप फसल में खाद की मात्रा, कीट रोकथाम, सिंचाई या सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं।'
        : 'Namaste! I am your Kisan AI Village Assistant. Ask me anything regarding fertilizer dosage, pest remedies, crop schedules, or agricultural guidelines.',
      time: 'Just now',
    },
  ]);

  // 2. Fertilizer Calculator State
  const [calcCrop, setCalcCrop] = useState('Wheat (Gehun)');
  const [calcArea, setCalcArea] = useState('2.0');
  const [calcUnit, setCalcUnit] = useState<'Acre' | 'Bigha'>('Acre');
  const [calcResult, setCalcResult] = useState<{
    ureaBags: number;
    dapBags: number;
    potashBags: number;
    zincKg: number;
    schedule: string[];
  } | null>(null);

  // Fertilizer Calculator Logic
  const handleCalculateFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    const area = Number(calcArea) || 1;
    const factor = calcUnit === 'Bigha' ? area * 0.4 : area; // normalize to Acre approx

    if (calcCrop.toLowerCase().includes('wheat') || calcCrop.includes('गेहूं')) {
      setCalcResult({
        ureaBags: Math.round(factor * 2.5 * 10) / 10,
        dapBags: Math.round(factor * 1.0 * 10) / 10,
        potashBags: Math.round(factor * 0.5 * 10) / 10,
        zincKg: Math.round(factor * 10),
        schedule: [
          language === 'hi' ? 'बुवाई के समय (Basal): 1 बोरी DAP + आधा बोरी पोटाश + 10kg जिंक प्रति एकड़' : 'At Sowing (Basal): 1 Bag DAP + 0.5 Bag MOP Potash + 10kg Zinc/Acre',
          language === 'hi' ? 'पहली सिंचाई (21 दिन - CRI स्टेज): 1 बोरी यूरिया का पहला टॉप ड्रेसिंग' : '1st Irrigation (21 Days - CRI stage): 1 Bag Urea Top Dressing',
          language === 'hi' ? 'दूसरी सिंचाई (45 दिन - कल्ले फूटते समय): 1 बोरी यूरिया का दूसरा टॉप ड्रेसिंग' : '2nd Irrigation (45 Days - Tillering): 1 Bag Urea Top Dressing',
        ],
      });
    } else if (calcCrop.toLowerCase().includes('mustard') || calcCrop.includes('सरसों')) {
      setCalcResult({
        ureaBags: Math.round(factor * 1.5 * 10) / 10,
        dapBags: Math.round(factor * 0.8 * 10) / 10,
        potashBags: Math.round(factor * 0.4 * 10) / 10,
        zincKg: Math.round(factor * 5),
        schedule: [
          language === 'hi' ? 'बुवाई के समय: पूरा DAP व पोटाश + सल्फर 10kg प्रति एकड़' : 'At Sowing: Full DAP, Potash + 10kg Sulphur per Acre',
          language === 'hi' ? 'पहली सिंचाई (फूल आने से पूर्व): 1 बोरी यूरिया का छींटा' : '1st Irrigation (Before Flowering): 1 Bag Urea broadcasting',
        ],
      });
    } else {
      setCalcResult({
        ureaBags: Math.round(factor * 2.0 * 10) / 10,
        dapBags: Math.round(factor * 1.0 * 10) / 10,
        potashBags: Math.round(factor * 0.5 * 10) / 10,
        zincKg: Math.round(factor * 5),
        schedule: [
          language === 'hi' ? 'बुवाई के समय: 1 बोरी DAP + पूरा पोटाश' : 'Basal Dose: Full DAP & Potash at planting',
          language === 'hi' ? 'वानस्पतिक बढ़वार पर: 1-2 बोरी यूरिया बराबर किस्तों में' : 'Growth Phase: 1-2 bags Urea in split doses with irrigation',
        ],
      });
    }
  };

  // AI Chat Submit
  const handleAskAI = async (customPrompt?: string) => {
    const question = customPrompt || aiQuestion;
    if (!question.trim()) return;

    const userEntry = {
      sender: 'user' as const,
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiConversation((prev) => [...prev, userEntry]);
    setAiQuestion('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/farming-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language: state.language,
          context: {
            totalCrops: state.crops.length,
            crops: state.crops.map((c) => `${c.plotName}: ${c.cropName} (${c.status})`),
          },
        }),
      });

      const data = await response.json();
      const reply = data.advice || (language === 'hi' ? 'सर्वर से उत्तर प्राप्त नहीं हो सका।' : 'Unable to retrieve answer.');

      setAiConversation((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setAiConversation((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: language === 'hi' ? 'इंटरनेट कनेक्शन या सर्वर त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Quick AI Prompt Chips
  const aiPromptChips = language === 'hi'
    ? [
        'गेहूं में पहली सिंचाई के बाद कौन सी खाद डालें?',
        'सरसों में माहू (चेपा) की रोकथाम कैसे करें?',
        'आलू की फसल में झुलसा रोग से कैसे बचाएं?',
        'DAP और 19:19:19 खाद में क्या अंतर है?',
        'PM किसान सम्मान निधि की अगली किस्त कैसे चेक करें?',
      ]
    : [
        'What fertilizer after 1st irrigation in Wheat?',
        'How to prevent aphid attack in Mustard?',
        'Potato late blight protection remedies',
        'Difference between DAP and NPK 19:19:19',
        'How to apply for PM Crop Insurance PMFBY?',
      ];

  return (
    <div id="tools-tab-view" className="space-y-6">
      {/* Header & Sub-tool Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {t.tools.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            {t.tools.subtitle}
          </p>
        </div>

        <button
          id="tools-open-backup-btn"
          type="button"
          onClick={onOpenBackupModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <span>📦 {language === 'hi' ? 'डेटा बैकअप व एक्सेल' : 'Backup & Export'}</span>
        </button>
      </div>

      {/* Sub Tools Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ai_advisor', label: t.tools.kisanAi, icon: Bot },
          { id: 'calc', label: t.tools.fertilizerCalc, icon: Calculator },
          { id: 'mandi', label: t.tools.mandiPrices, icon: TrendingUp },
          { id: 'bahikhata', label: t.tools.bahiKhata, icon: BookOpen },
          { id: 'helpline', label: t.tools.helplineDirectory, icon: PhoneCall },
        ].map((sub) => {
          const isSel = activeSubTool === sub.id;
          const Icon = sub.icon;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubTool(sub.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSel
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-200' : 'text-neutral-500'}`} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TOOL 1: AI Kisan Salahkar */}
      {activeSubTool === 'ai_advisor' && (
        <div id="ai-advisor-panel" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">
                  {language === 'hi' ? 'किसान AI सलाहकार (Kisan AI Assistant)' : 'Kisan AI Agricultural Assistant'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {language === 'hi' ? '24x7 खेती, खाद, दवाई व सरकारी योजनाओं की सटीक जानकारी' : 'Instant advice on crops, fertilizers, dosages & government schemes'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5">
            {aiPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskAI(chip)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-medium transition-colors text-left"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Conversation Chat Stream */}
          <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-neutral-50 rounded-xl border border-neutral-200/70">
            {aiConversation.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-white text-neutral-900 border border-neutral-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-neutral-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {aiLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0">
                  AI
                </div>
                <div className="p-3 bg-white text-neutral-600 rounded-2xl border border-neutral-200 text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-neutral-500 font-medium ml-1">
                    {language === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Generating agricultural advice...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              placeholder={
                language === 'hi'
                  ? 'खेती, खाद, बीज या फसल के बारे में कुछ भी पूछें...'
                  : 'Ask any question about crops, fertilizers, dosages, or schemes...'
              }
              className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
            <VoiceInputButton
              language={language}
              onTranscript={(text) => setAiQuestion((prev) => (prev ? `${prev} ${text}` : text))}
            />
            <button
              type="button"
              onClick={() => handleAskAI()}
              disabled={aiLoading || !aiQuestion.trim()}
              className="p-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TOOL 2: Fertilizer & NPK Dosage Calculator */}
      {activeSubTool === 'calc' && (
        <div id="fertilizer-calculator-panel" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <FlaskConical className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'खाद व उर्वरक कैलकुलेटर (NPK Dosage Calculator)' : 'Fertilizer & NPK Dosage Calculator'}
              </h2>
              <p className="text-xs text-neutral-500">
                {language === 'hi' ? 'खेत के क्षेत्रफल के अनुसार यूरिया, DAP, पोटाश व जिंक की सटीक मात्रा जानें' : 'Calculate recommended bags of Urea, DAP, Potash & Zinc for your field size'}
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculateFertilizer} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
              </label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Wheat (Gehun)">🌾 {language === 'hi' ? 'गेहूं (Wheat)' : 'Wheat'}</option>
                <option value="Mustard (Sarson)">🌼 {language === 'hi' ? 'सरसों (Mustard / Toria)' : 'Mustard'}</option>
                <option value="Paddy (Dhan)">🌾 {language === 'hi' ? 'धान (Paddy / Rice)' : 'Paddy'}</option>
                <option value="Potato (Aaloo)">🥔 {language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
                <option value="Sugarcane (Ganna)">🎋 {language === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane'}</option>
                <option value="Cotton (Kapas)">☁️ {language === 'hi' ? 'कपास (Cotton)' : 'Cotton'}</option>
                <option value="Gram / Chana">🌱 {language === 'hi' ? 'चना / दालें (Gram / Pulses)' : 'Gram / Pulses'}</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {language === 'hi' ? 'खेत का क्षेत्रफल' : 'Field Area'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={calcArea}
                onChange={(e) => setCalcArea(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {language === 'hi' ? 'इकाई' : 'Unit'}
              </label>
              <select
                value={calcUnit}
                onChange={(e) => setCalcUnit(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Acre">{language === 'hi' ? 'एकड़ (Acre)' : 'Acre'}</option>
                <option value="Bigha">{language === 'hi' ? 'बीघा (Bigha)' : 'Bigha'}</option>
              </select>
            </div>

            <div className="sm:col-span-12">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'खाद की मात्रा की गणना करें (Calculate)' : 'Calculate Fertilizer Dosage'}
              </button>
            </div>
          </form>

          {/* Results Output */}
          {calcResult && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center justify-between">
                <span>
                  🎯 {calcCrop} - {calcArea} {calcUnit} {language === 'hi' ? 'के लिए संस्तुत मात्रा:' : 'Recommended Dosage:'}
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs text-center">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">यूरिया (Urea 46% N)</p>
                  <p className="text-xl font-bold text-emerald-950 mt-1">{calcResult.ureaBags} {language === 'hi' ? 'बोरी' : 'Bags'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs text-center">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">डीएपी (DAP 18:46:0)</p>
                  <p className="text-xl font-bold text-emerald-950 mt-1">{calcResult.dapBags} {language === 'hi' ? 'बोरी' : 'Bags'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs text-center">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">पोटाश (MOP 60%)</p>
                  <p className="text-xl font-bold text-emerald-950 mt-1">{calcResult.potashBags} {language === 'hi' ? 'बोरी' : 'Bags'}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs text-center">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">जिंक (Zinc 33%)</p>
                  <p className="text-xl font-bold text-emerald-950 mt-1">{calcResult.zincKg} Kg</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-bold text-emerald-950">
                  📅 {language === 'hi' ? 'डालने का समय व तरीका (Application Schedule):' : 'Application Schedule:'}
                </p>
                <ul className="space-y-1">
                  {calcResult.schedule.map((sch, i) => (
                    <li key={i} className="text-xs text-emerald-900 flex items-start gap-2">
                      <span className="font-bold text-emerald-700">•</span>
                      <span>{sch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TOOL 3: Mandi Bhav Tracker */}
      {activeSubTool === 'mandi' && (
        <div id="mandi-bhav-panel" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <div>
                <h2 className="text-sm font-bold text-neutral-900">
                  {language === 'hi' ? 'मंडी भाव व न्यूनतम समर्थन मूल्य (MSP)' : 'Mandi Rates & MSP Tracker'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {language === 'hi' ? 'विभिन्न फसलों के ताज़ा औसत मंडी भाव प्रति क्विंटल' : 'Average APMC Mandi rates & Government MSP per quintal (100 kg)'}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-semibold">
              ₹ / Quintal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.mandiPrices.map((mandi) => (
              <div
                key={mandi.id}
                className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">
                    🌾 {mandi.crop}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      mandi.trend === 'up'
                        ? 'bg-emerald-100 text-emerald-900'
                        : mandi.trend === 'down'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {mandi.trend === 'up' ? '↗ Bullish' : mandi.trend === 'down' ? '↘ Bearish' : '→ Stable'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xs text-neutral-500 block">
                      {language === 'hi' ? 'औसत मंडी भाव:' : 'Average Rate:'}
                    </span>
                    <p className="text-lg font-bold text-neutral-900">
                      ₹{mandi.modalPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-neutral-500 font-normal">/ Q</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      MSP: ₹{mandi.mspRate.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-200/60 pt-2">
                  <span>{mandi.marketName}</span>
                  <span>{mandi.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TOOL 4: Bahi Khata / Udhaar Register */}
      {activeSubTool === 'bahikhata' && (
        <div id="bahikhata-panel" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-800" />
              <div>
                <h2 className="text-sm font-bold text-neutral-900">
                  {language === 'hi' ? 'उधारी बही-खाता रजिस्टर (Bahi Khata)' : 'Bahi Khata & Udhaar Register'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {language === 'hi' ? 'दुकानदार से ली गई उधारी या दूसरों को दिए गए उधार का पक्का हिसाब' : 'Track credit taken from fertilizer stores and money lent to others'}
                </p>
              </div>
            </div>

            <button
              id="add-bahikhata-entry-btn"
              type="button"
              onClick={onAddBahiKhata}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{language === 'hi' ? 'नया खाता जोड़ें' : 'Add Credit Entry'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.bahiKhata.map((item) => {
              const isTook = item.type === 'you_took';

              // WhatsApp Reminder Generator URL
              const waText = encodeURIComponent(
                language === 'hi'
                  ? `नमस्ते ${item.personName} जी, बही-खाता के अनुसार ₹${item.amount} का बकाया हिसाब है। विवरण: ${item.purpose}। कृपया चेक करें।`
                  : `Hello ${item.personName}, this is a gentle reminder regarding ₹${item.amount} credit record (${item.purpose}). Thank you.`
              );
              const waUrl = item.phone ? `https://wa.me/91${item.phone}?text=${waText}` : null;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.settled
                      ? 'bg-neutral-50 border-neutral-200 opacity-70'
                      : isTook
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-emerald-50/50 border-emerald-200'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isTook
                            ? 'bg-red-100 text-red-900 border border-red-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {isTook
                          ? (language === 'hi' ? '🔴 आपने लिया (देना बाकी)' : 'You Took (You Owe)')
                          : (language === 'hi' ? '🟢 आपने दिया (लेना बाकी)' : 'You Gave (They Owe)')}
                      </span>
                      <span className="text-sm font-bold text-neutral-900">{item.personName}</span>
                      {item.phone && <span className="text-xs text-neutral-500">📞 {item.phone}</span>}
                    </div>

                    <p className="text-xs text-neutral-700 font-medium">
                      📝 {item.purpose}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                      <span>📅 {item.date}</span>
                      {item.dueDate && <span>⏰ {language === 'hi' ? 'नियत तारीख:' : 'Due:'} {item.dueDate}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200/60">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-neutral-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        onClick={() => onToggleBahiSettled(item.id)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border cursor-pointer ${
                          item.settled
                            ? 'bg-neutral-200 text-neutral-800 border-neutral-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        {item.settled
                          ? (language === 'hi' ? '✅ चुकता (Settled)' : 'Settled')
                          : (language === 'hi' ? 'बाकी (Unsettled)' : 'Unsettled')}
                      </button>
                    </div>

                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                        title={language === 'hi' ? 'WhatsApp पर याद दिलाएं' : 'Share on WhatsApp'}
                      >
                        <Share2 className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteBahiKhata(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {state.bahiKhata.length === 0 && (
              <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-500">
                  {language === 'hi' ? 'अभी कोई उधारी रिकॉर्ड नहीं है।' : 'No credit or ledger entries recorded yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TOOL 5: Important Kisan Helpline Directory */}
      {activeSubTool === 'helpline' && (
        <div id="helpline-directory-panel" className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <PhoneCall className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'आवश्यक किसान हेल्पलाइन व आपातकालीन नंबर' : 'Official Farmer Helplines & Govt Support'}
              </h2>
              <p className="text-xs text-neutral-500">
                {language === 'hi' ? 'टोल-फ्री हेल्पलाइन, फसल बीमा, पशु चिकित्सा व पंचायत सहायता' : 'Toll-free helplines for agriculture, crop insurance, veterinary and weather'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: language === 'hi' ? 'किसान कॉल सेंटर (Kisan Call Center)' : 'Kisan Call Center (Agri Advisory)',
                number: '1800-180-1551',
                desc: language === 'hi' ? 'फसल, बीज, कीट व मौसम पर कृषि वैज्ञानिकों से सीधी बात (मुफ्त)' : 'Free call to agri scientists in local languages (6 AM - 10 PM)',
                badge: 'Toll-Free 24x7',
              },
              {
                title: language === 'hi' ? 'PM किसान सम्मान निधि हेल्पलाइन' : 'PM Kisan Samman Nidhi Helpline',
                number: '155261',
                desc: language === 'hi' ? '₹6,000 वार्षिक किस्त स्थिति व e-KYC समस्या समाधान' : 'Installment status inquiry & e-KYC assistance',
                badge: 'Direct Govt',
              },
              {
                title: language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : 'PM Crop Insurance (PMFBY)',
                number: '1800-889-6868',
                desc: language === 'hi' ? 'फसल नुकसान, ओलावृष्टि व जलभराव दावा 72 घंटे में दर्ज कराएं' : 'Report crop damage / hailstorm within 72 hours',
                badge: 'Insurance',
              },
              {
                title: language === 'hi' ? 'पशु चिकित्सा व एंबुलेंस हेल्पलाइन' : 'Veterinary Hospital & Animal Helpline',
                number: '1962',
                desc: language === 'hi' ? 'गाय, भैंस व मवेशियों के इलाज हेतु मोबाइल पशु चिकित्सा सेवा' : 'Mobile veterinary hospital for livestock emergency care',
                badge: 'Animal Care',
              },
              {
                title: language === 'hi' ? 'बिजली विभाग (ट्यूबवेल व ग्रामीण फॉल्ट)' : 'Electricity Board / Rural Power Helpline',
                number: '1912',
                desc: language === 'hi' ? 'ट्रांसफार्मर फुंकने, तार टूटने व ट्यूबवेल बिजली शिकायत' : 'Transformer replacement & irrigation power fault complaint',
                badge: 'Electricity',
              },
              {
                title: language === 'hi' ? 'राष्ट्रीय बीज निगम (National Seeds Corp)' : 'National Seeds Corporation',
                number: '011-25841444',
                desc: language === 'hi' ? 'प्रमाणित उच्च गुणवत्ता वाले बीजों की उपलब्धता व रेट' : 'Certified high-yielding seed varieties & delivery',
                badge: 'Certified Seeds',
              },
            ].map((help, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-900">{help.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      {help.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{help.desc}</p>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-950">{help.number}</span>
                  <a
                    href={`tel:${help.number}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call Now'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
