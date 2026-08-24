import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language, VillageSuperAppState } from '../../types';
import { translations } from '../../utils/translations';
import { exportExpensesToCSV, exportGiftsToCSV, exportStateToJson } from '../../utils/storage';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: VillageSuperAppState;
  onRestore: (newState: VillageSuperAppState) => void;
  onResetDemo: () => void;
  language: Language;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  state,
  onRestore,
  onResetDemo,
  language,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.expenses && parsed.crops) {
          onRestore(parsed);
          setMsg(language === 'hi' ? 'डेटा सफलतापूर्वक रीस्टोर हो गया!' : 'Data restored successfully!');
          setTimeout(() => {
            setMsg(null);
            onClose();
          }, 1500);
        } else {
          alert(language === 'hi' ? 'अमान्य बैकअप फाइल फॉर्मेट।' : 'Invalid backup JSON file format.');
        }
      } catch (err) {
        alert(language === 'hi' ? 'फाइल पढ़ने में त्रुटि।' : 'Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="backup-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
      <div id="backup-modal-content" className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-200" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'डेटा बैकअप व एक्सेल डाउनलोड' : 'Backup & Data Export'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {msg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{msg}</span>
            </div>
          )}

          {/* Backup Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'hi' ? '1. पूरा डेटा सुरक्षित डाउनलोड करें' : '1. Full Application Backup (JSON)'}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {language === 'hi'
                ? 'अपने सभी खर्चे, खेत की फसलें, खाद रिकॉर्ड, रिमाइंडर और शगुन का एक क्लिक में बैकअप लें।'
                : 'Download all expenses, crop plantation logs, fertilizers, reminders, and shagun records.'}
            </p>
            <button
              id="download-json-backup-btn"
              type="button"
              onClick={() => exportStateToJson(state)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'संपूर्ण बैकअप फाइल डाउनलोड करें (.JSON)' : 'Download Full Backup (.JSON)'}</span>
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* CSV Exports */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'hi' ? '2. एक्सेल व स्प्रेडशीट (CSV) डाउनलोड' : '2. Excel / CSV Spreadsheet Downloads'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="export-expenses-csv-btn"
                type="button"
                onClick={() => exportExpensesToCSV(state.expenses)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'खर्चा पर्ची (CSV)' : 'Expenses (CSV)'}</span>
              </button>

              <button
                id="export-gifts-csv-btn"
                type="button"
                onClick={() => exportGiftsToCSV(state.gifts)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                <span>{language === 'hi' ? 'शगुन बही (CSV)' : 'Shagun Gifts (CSV)'}</span>
              </button>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Restore from JSON */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'hi' ? '3. पहले से ली गई बैकअप फाइल अपलोड करें' : '3. Restore from Backup File'}
            </h3>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              id="upload-json-backup-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors"
            >
              <Upload className="w-4 h-4 text-neutral-600" />
              <span>{language === 'hi' ? 'बैकअप फाइल चुनें (.JSON)' : 'Choose Backup JSON File'}</span>
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* Reset Demo Data */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                {language === 'hi' ? 'शुरुआती नमूना डेटा लोड करें:' : 'Reset sample village data:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm(language === 'hi' ? 'क्या आप नमूना डेटा रीसेट करना चाहते हैं?' : 'Reset to default sample village data?')) {
                    onResetDemo();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1 text-xs text-rose-700 font-semibold hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.common.resetDemoData}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
