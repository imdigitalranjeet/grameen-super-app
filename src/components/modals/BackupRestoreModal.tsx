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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setMsg(null);

    // Limit backup file size to 10MB to prevent browser crash / memory exhaustion
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(language === 'hi' ? 'फाइल बहुत बड़ी है (अधिकतम 10MB)।' : 'File is too large (max 10MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target?.result;
        if (typeof rawContent !== 'string') {
          setErrorMsg(language === 'hi' ? 'फाइल पढ़ने में त्रुटि।' : 'Failed to read file content.');
          return;
        }

        const parsed = JSON.parse(rawContent);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          setErrorMsg(language === 'hi' ? 'अमान्य बैकअप फाइल फॉर्मेट।' : 'Invalid backup JSON file format.');
          return;
        }

        // Defensive schema normalization
        const sanitizedState: VillageSuperAppState = {
          currency: '₹',
          language: parsed.language === 'hi' ? 'hi' : 'en',
          expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
          crops: Array.isArray(parsed.crops) ? parsed.crops : [],
          reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
          gifts: Array.isArray(parsed.gifts) ? parsed.gifts : [],
          bahiKhata: Array.isArray(parsed.bahiKhata) ? parsed.bahiKhata : [],
          mandiPrices: Array.isArray(parsed.mandiPrices) && parsed.mandiPrices.length > 0 ? parsed.mandiPrices : state.mandiPrices,
        };

        if (sanitizedState.expenses.length === 0 && sanitizedState.crops.length === 0 && sanitizedState.gifts.length === 0) {
          setErrorMsg(language === 'hi' ? 'बैकअप फाइल में कोई वैध डेटा नहीं मिला।' : 'No valid village data found in backup file.');
          return;
        }

        onRestore(sanitizedState);
        setMsg(language === 'hi' ? 'डेटा सफलतापूर्वक रीस्टोर हो गया!' : 'Data restored successfully!');
        setTimeout(() => {
          setMsg(null);
          onClose();
        }, 1500);
      } catch (err) {
        setErrorMsg(language === 'hi' ? 'अमान्य JSON फाइल। कृपया सही बैकअप फाइल चुनें।' : 'Invalid JSON file format. Please upload a valid backup.');
      }
    };

    reader.onerror = () => {
      setErrorMsg(language === 'hi' ? 'फाइल पढ़ने में त्रुटि।' : 'Error reading backup file.');
    };

    reader.readAsText(file);
    // Reset file input value so user can re-upload if needed
    e.target.value = '';
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
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {msg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-100 text-rose-900 rounded-xl text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'संपूर्ण बैकअप फाइल डाउनलोड करें (.JSON)' : 'Download Full Backup (.JSON)'}</span>
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* Excel / CSV Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'hi' ? '2. एक्सेल / स्प्रेडशीट रिपोर्ट' : '2. Excel / Spreadsheet Export (CSV)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                id="export-expenses-csv-btn"
                type="button"
                onClick={() => exportExpensesToCSV(state.expenses)}
                className="flex items-center justify-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'खर्चा बही (CSV)' : 'Expenses (CSV)'}</span>
              </button>

              <button
                id="export-gifts-csv-btn"
                type="button"
                onClick={() => exportGiftsToCSV(state.gifts)}
                className="flex items-center justify-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                <span>{language === 'hi' ? 'शगुन व न्योता (CSV)' : 'Shagun / Gifts (CSV)'}</span>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-neutral-600" />
              <span>{language === 'hi' ? 'बैकअप फाइल चुनें (.JSON)' : 'Choose Backup JSON File'}</span>
            </button>
          </div>

          <hr className="border-neutral-200" />

          {/* Reset Demo Data */}
          <div className="space-y-2 pt-1">
            {!confirmReset ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  {language === 'hi' ? 'शुरुआती नमूना डेटा लोड करें:' : 'Reset sample village data:'}
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1 text-xs text-rose-700 font-semibold hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.common.resetDemoData}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <p className="text-xs text-rose-800 font-medium">
                  {language === 'hi' ? 'क्या आप सचमुच डेटा रीसेट करके डिफ़ॉल्ट सैंपल डेटा लाना चाहते हैं?' : 'Are you sure you want to reset all data back to default sample records?'}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemo();
                      setConfirmReset(false);
                      setMsg(language === 'hi' ? 'डेटा रीसेट हो गया!' : 'Data reset to sample defaults!');
                      setTimeout(() => {
                        setMsg(null);
                        onClose();
                      }, 1000);
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                  >
                    {language === 'hi' ? 'हाँ, रीसेट करें' : 'Yes, Reset'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
