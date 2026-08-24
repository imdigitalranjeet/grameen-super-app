import React, { useState } from 'react';
import { X, Sprout } from 'lucide-react';
import { Language, PlantationCrop } from '../../types';
import { translations } from '../../utils/translations';
import { VoiceInputButton } from '../VoiceInputButton';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (crop: Omit<PlantationCrop, 'id' | 'fertilizerLogs' | 'sprayLogs' | 'irrigationLogs' | 'harvestRecords'>) => void;
  language: Language;
}

export const AddCropModal: React.FC<AddCropModalProps> = ({
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = translations[language];

  const [plotName, setPlotName] = useState('');
  const [cropName, setCropName] = useState('Wheat (Gehun)');
  const [variety, setVariety] = useState('');
  const [areaValue, setAreaValue] = useState('2.0');
  const [areaUnit, setAreaUnit] = useState<'Acre' | 'Bigha' | 'Hectare' | 'Guntha'>('Acre');
  const [soilType, setSoilType] = useState('Alluvial Loam (DoMat Mitti)');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [status, setStatus] = useState<'sown' | 'growing' | 'flowering' | 'harvest_ready' | 'harvested'>('sown');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim() || !cropName.trim()) return;

    onSave({
      plotName: plotName.trim(),
      cropName: cropName.trim(),
      variety: variety.trim() || undefined,
      areaValue: Number(areaValue) || 1,
      areaUnit,
      soilType: soilType.trim() || 'Standard Loam',
      plantingDate,
      expectedHarvestDate: expectedHarvestDate || new Date(Date.now() + 110 * 86400000).toISOString().slice(0, 10),
      status,
      notes: notes.trim() || undefined,
    });

    setPlotName('');
    setVariety('');
    setNotes('');
    onClose();
  };

  return (
    <div id="add-crop-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="add-crop-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {t.plantation.addNewPlot}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Plot Name + Voice input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                {t.plantation.plotName} *
              </label>
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setPlotName((p) => (p ? `${p} ${text}` : text))}
              />
            </div>
            <input
              type="text"
              required
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. उत्तर वाला 4 बीघा खेत, नहर वाला चक' : 'e.g. North Canal Plot, Tubewell Field 2'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Crop Name & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.cropName} *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. गेहूं, धान, सरसों, आलू, कपास' : 'e.g. Wheat, Mustard, Paddy, Potato, Cotton'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.variety}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. HD-2967, पूसा बोल्ड, कुफरी पुखराज' : 'e.g. HD-2967, Pusa Bold, Hybrid 6444'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Field Area & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.area} *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {language === 'hi' ? 'इकाई (Unit)' : 'Unit'}
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Acre">{language === 'hi' ? 'एकड़ (Acre)' : 'Acre'}</option>
                <option value="Bigha">{language === 'hi' ? 'बीघा (Bigha)' : 'Bigha'}</option>
                <option value="Hectare">{language === 'hi' ? 'हेक्टेयर (Hectare)' : 'Hectare'}</option>
                <option value="Guntha">{language === 'hi' ? 'गुंठा (Guntha)' : 'Guntha'}</option>
              </select>
            </div>
          </div>

          {/* Sowing Date & Expected Harvest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.plantingDate}
              </label>
              <input
                type="date"
                required
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.expectedHarvest}
              </label>
              <input
                type="date"
                value={expectedHarvestDate}
                onChange={(e) => setExpectedHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Soil Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.soilType}
              </label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="DoMat / Sandy Loam / Clay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.plantation.status}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="sown">{language === 'hi' ? 'बुवाई हो गई (Sown)' : 'Sown / Germination'}</option>
                <option value="growing">{language === 'hi' ? 'बढ़वार अवस्था (Growing)' : 'Growing / Tillering'}</option>
                <option value="flowering">{language === 'hi' ? 'फूल / बाली अवस्था (Flowering)' : 'Flowering / Pods'}</option>
                <option value="harvest_ready">{language === 'hi' ? 'कटाई के लिए तैयार (Harvest Ready)' : 'Harvest Ready'}</option>
                <option value="harvested">{language === 'hi' ? 'कटाई पूर्ण (Harvested)' : 'Harvested'}</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {language === 'hi' ? 'खेत का विवरण व टिप्पणी' : 'Notes / Remarks'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. नहर किनारे, लेजर लेवलिंग कराई हुई' : 'e.g. Canal adjacent, laser leveled'}
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
