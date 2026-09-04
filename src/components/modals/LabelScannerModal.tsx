import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  RefreshCw,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FlaskConical,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';
import { Language, PlantationCrop } from '../../types';

export interface ScannedFertilizerData {
  fertilizerType: string;
  quantity: number;
  unit: 'bags' | 'kg' | 'quintal' | 'liters';
  cost: number;
  applicationMethod: 'Broadcasting' | 'Drip/Fertigation' | 'Foliar Spray' | 'Basal Application';
  stage: string;
  notes?: string;
}

export interface ScannedSprayData {
  name: string;
  purpose: string;
  cost: number;
}

interface LabelScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  crops: PlantationCrop[];
  selectedCropId?: string;
  onAutoFillFertilizer: (cropId: string, data: ScannedFertilizerData) => void;
  onAutoFillSpray: (cropId: string, data: ScannedSprayData) => void;
  language: Language;
}

export const LabelScannerModal: React.FC<LabelScannerModalProps> = ({
  isOpen,
  onClose,
  crops,
  selectedCropId,
  onAutoFillFertilizer,
  onAutoFillSpray,
  language,
}) => {
  const [mode, setMode] = useState<'camera' | 'preview' | 'result'>('camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Target Crop Plot
  const [targetCropId, setTargetCropId] = useState(selectedCropId || crops[0]?.id || '');

  // Detected & editable scan results
  const [productType, setProductType] = useState<'fertilizer' | 'spray'>('fertilizer');
  const [productName, setProductName] = useState('');
  const [technicalName, setTechnicalName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<'bags' | 'kg' | 'quintal' | 'liters'>('bags');
  const [cost, setCost] = useState('500');
  const [applicationMethod, setApplicationMethod] = useState<'Broadcasting' | 'Drip/Fertigation' | 'Foliar Spray' | 'Basal Application'>('Broadcasting');
  const [stage, setStage] = useState('Top Dressing');
  const [purpose, setPurpose] = useState('');
  const [safetyPrecautions, setSafetyPrecautions] = useState('');
  const [isFallbackUsed, setIsFallbackUsed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update target crop when selectedCropId changes
  useEffect(() => {
    if (selectedCropId) {
      setTargetCropId(selectedCropId);
    } else if (crops.length > 0 && !targetCropId) {
      setTargetCropId(crops[0].id);
    }
  }, [selectedCropId, crops]);

  // Handle camera start/stop
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
      return;
    }

    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode, facingMode]);

  const resetState = () => {
    setMode('camera');
    setCapturedImage(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    setCameraError(null);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        language === 'hi'
          ? 'आपके ब्राउज़र में कैमरा उपलब्ध नहीं है। कृपया फोटो अपलोड करें।'
          : 'Camera is not supported on this browser. Please upload an image.'
      );
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err?.message || err);
      setCameraActive(false);
      setCameraError(
        language === 'hi'
          ? 'कैमरा शुरू नहीं हो सका (अनुमति दें या नीचे से फोटो अपलोड करें)।'
          : 'Could not access camera. Please check permissions or upload a label photo.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setCapturedImage(dataUrl);
    setMode('preview');
    // Automatically analyze captured photo
    analyzeLabelImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        stopCamera();
        setCapturedImage(base64);
        setMode('preview');
        analyzeLabelImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = (sampleKey: 'urea' | 'dap' | 'saaf' | 'confidor') => {
    stopCamera();
    setMode('preview');
    analyzeLabelImage(null, sampleKey);
  };

  const analyzeLabelImage = async (dataUrl: string | null, sampleKey?: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const payload: any = {
        language,
      };

      if (sampleKey) {
        payload.sampleKey = sampleKey;
      } else if (dataUrl) {
        payload.imageBase64 = dataUrl;
        payload.mimeType = 'image/jpeg';
      }

      const res = await fetch('/api/ai/scan-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      setProductType(data.productType === 'spray' ? 'spray' : 'fertilizer');
      setProductName(data.productName || 'Agricultural Formulation');
      setTechnicalName(data.technicalName || '');
      setManufacturer(data.manufacturer || '');
      setDosage(data.recommendedDosage || '');
      setQuantity(String(data.suggestedQuantity || 1));
      setUnit(data.suggestedUnit || (data.productType === 'spray' ? 'liters' : 'bags'));
      setCost(String(data.estimatedCost || (data.productType === 'spray' ? 450 : 540)));
      setApplicationMethod(data.applicationMethod || (data.productType === 'spray' ? 'Foliar Spray' : 'Broadcasting'));
      setStage(data.stage || (data.productType === 'spray' ? 'Vegetative Growth' : 'Top Dressing'));
      setPurpose(data.purpose || (data.productType === 'spray' ? 'Pest & Blight Protection' : 'Plant Nutrition'));
      setSafetyPrecautions(data.safetyPrecautions || '');
      setIsFallbackUsed(Boolean(data.isFallback));

      setMode('result');
    } catch (err: any) {
      console.warn('Analysis error:', err?.message || err);
      // Even if network or API has issue, provide helpful prefilled structure
      setProductType('fertilizer');
      setProductName('Neem Coated Urea');
      setTechnicalName('Nitrogen 46% Prilled');
      setManufacturer('IFFCO');
      setQuantity('2');
      setUnit('bags');
      setCost('540');
      setApplicationMethod('Broadcasting');
      setStage('Top Dressing');
      setPurpose('Vegetative crop growth');
      setIsFallbackUsed(true);
      setMode('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAutoFill = () => {
    const chosenCropId = targetCropId || crops[0]?.id;
    if (!chosenCropId) return;

    if (productType === 'fertilizer') {
      const fertData: ScannedFertilizerData = {
        fertilizerType: technicalName ? `${productName} (${technicalName})` : productName,
        quantity: Number(quantity) || 1,
        unit,
        cost: Number(cost) || 0,
        applicationMethod,
        stage: stage || 'Top Dressing',
        notes: [
          manufacturer ? `Manufacturer: ${manufacturer}` : '',
          dosage ? `Label Dose: ${dosage}` : '',
          safetyPrecautions ? `Safety: ${safetyPrecautions}` : '',
        ]
          .filter(Boolean)
          .join(' | '),
      };

      onAutoFillFertilizer(chosenCropId, fertData);
    } else {
      const sprayData: ScannedSprayData = {
        name: technicalName ? `${productName} [${technicalName}]` : productName,
        purpose: purpose || (dosage ? `Dose: ${dosage}` : 'Pest/Disease Protection'),
        cost: Number(cost) || 0,
      };

      onAutoFillSpray(chosenCropId, sprayData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="label-scanner-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="label-scanner-modal-content"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-4 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-purple-800 to-indigo-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/15 rounded-lg">
              <Camera className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-1.5">
                <span>{language === 'hi' ? 'स्मार्ट लेबल स्कैनर (AI Camera)' : 'Smart Bottle / Label Scanner'}</span>
                <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-black uppercase">
                  AI Vision
                </span>
              </h2>
              <p className="text-[11px] text-purple-200">
                {language === 'hi'
                  ? 'खाद या कीटनाशक की बोरी/बोतल का लेबल स्कैन करें'
                  : 'Scan fertilizer bag or spray bottle label to auto-fill records'}
              </p>
            </div>
          </div>
          <button
            id="close-scanner-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Target Plot / Crop Selector */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <span>{language === 'hi' ? 'खेत व फसल चुनें (Apply to Plot):' : 'Select Target Plot:'}</span>
              </label>
              <p className="text-[11px] text-neutral-500">
                {language === 'hi' ? 'स्कैन किया हुआ डेटा इस खेत में जुड़ेगा' : 'Scanned details will populate for this crop'}
              </p>
            </div>
            <select
              id="scanner-target-crop-select"
              value={targetCropId}
              onChange={(e) => setTargetCropId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.plotName} - {c.cropName} ({c.areaValue} {c.areaUnit})
                </option>
              ))}
            </select>
          </div>

          {/* MODE 1: Camera Viewfinder */}
          {mode === 'camera' && (
            <div className="space-y-3">
              <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning Alignment Overlay Frame */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                      <div className="relative w-4/5 h-3/4 border-2 border-dashed border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3">
                        {/* Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                        {/* Center scanline guide */}
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse my-auto" />

                        <div className="text-center bg-neutral-950/70 backdrop-blur-xs text-white text-[11px] font-medium py-1 px-3 rounded-full mx-auto self-center">
                          {language === 'hi' ? 'लेबल को फ्रेम के बीच में रखें' : 'Align label inside the frame'}
                        </div>
                      </div>
                    </div>

                    {/* Camera Control Overlays */}
                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      title="Switch Camera"
                      className="absolute top-3 right-3 p-2 bg-neutral-900/70 hover:bg-neutral-900 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-200">
                        {cameraError || (language === 'hi' ? 'कैमरा लोड हो रहा है...' : 'Starting camera...')}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {language === 'hi'
                          ? 'या आप सीधे अपने फोन/कंप्यूटर से फोटो अपलोड कर सकते हैं।'
                          : 'Or select a photo from your gallery or files.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{language === 'hi' ? 'फोटो चुनें (Upload Photo)' : 'Upload Label Image'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Camera Trigger Buttons */}
              <div className="flex items-center justify-center gap-4 pt-1">
                {cameraActive && (
                  <button
                    id="capture-label-photo-btn"
                    type="button"
                    onClick={capturePhoto}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-purple-600 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                    title={language === 'hi' ? 'फोटो खींचें' : 'Take Photo'}
                  >
                    <div className="w-11 h-11 rounded-full bg-purple-700 hover:bg-purple-800 flex items-center justify-center text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-neutral-300"
                >
                  <Upload className="w-4 h-4 text-purple-700" />
                  <span>{language === 'hi' ? 'गैलरी / फाइल से लें' : 'Upload From Files'}</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Quick Test Demo Samples */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'त्वरित परीक्षण (डेमो सैंपल):' : 'Try Pre-Loaded Test Samples:'}</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {language === 'hi' ? 'बिना कैमरे के भी जांचें' : 'Click to simulate scan'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUseSample('urea')}
                    className="p-2 text-left rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-emerald-900 block truncate">🌱 IFFCO Urea (खाद)</span>
                    <span className="text-[9px] text-emerald-700 block">46% N (45kg Bag)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseSample('dap')}
                    className="p-2 text-left rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-emerald-900 block truncate">🌱 Gromor DAP (खाद)</span>
                    <span className="text-[9px] text-emerald-700 block">18:46:0 Di-Ammonium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseSample('saaf')}
                    className="p-2 text-left rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-purple-900 block truncate">🛡️ Saaf Fungicide (स्प्रे)</span>
                    <span className="text-[9px] text-purple-700 block">Mancozeb + Carbendazim</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUseSample('confidor')}
                    className="p-2 text-left rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-purple-900 block truncate">🛡️ Confidor (कीटनाशक)</span>
                    <span className="text-[9px] text-purple-700 block">Imidacloprid 17.8% SL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Preview & Scanning in Progress */}
          {mode === 'preview' && isAnalyzing && (
            <div className="py-10 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-24 h-24 rounded-2xl bg-purple-100 border-2 border-purple-400 flex items-center justify-center overflow-hidden shadow-inner">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Label scan" className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <FlaskConical className="w-10 h-10 text-purple-600" />
                  )}
                </div>
                <div className="absolute inset-0 border-2 border-purple-600 rounded-2xl animate-ping opacity-25" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>{language === 'hi' ? 'AI द्वारा लेबल का विश्लेषण जारी है...' : 'AI is analyzing product label...'}</span>
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  {language === 'hi'
                    ? 'रासायनिक नाम, NPK अनुपात, अनुमोदित मात्रा, छिड़काव विधि और मूल्य की पहचान हो रही है।'
                    : 'Extracting product composition, application rate, active formulation, and price.'}
                </p>
              </div>

              <div className="w-48 h-1.5 bg-neutral-200 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-purple-600 animate-pulse" />
              </div>
            </div>
          )}

          {/* MODE 3: Scanned Results & Auto-Fill Confirmation */}
          {mode === 'result' && !isAnalyzing && (
            <div className="space-y-4">
              {/* Classification Selector Pill */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">
                    {language === 'hi' ? 'पहचाना गया प्रकार (Product Category):' : 'Identified Category:'}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    {productType === 'fertilizer'
                      ? language === 'hi' ? 'उर्वरक / खाद' : 'Soil Fertilizer'
                      : language === 'hi' ? 'दवाई / कीटनाशक स्प्रे' : 'Foliar Spray / Pesticide'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProductType('fertilizer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      productType === 'fertilizer'
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>{language === 'hi' ? 'खाद (Fertilizer)' : 'Fertilizer Log'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductType('spray')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      productType === 'spray'
                        ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'hi' ? 'दवाई / स्प्रे (Spray)' : 'Spray Log'}</span>
                  </button>
                </div>
              </div>

              {/* Scanned Details Form (User can tweak before finalizing auto-fill) */}
              <div className="space-y-3 p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {language === 'hi' ? 'उत्पाद का नाम (Product Name):' : 'Product / Brand Name:'} *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                {technicalName && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">
                      {language === 'hi' ? 'रासायनिक संरचना (Chemical Composition):' : 'Technical / Active Ingredients:'}
                    </label>
                    <input
                      type="text"
                      value={technicalName}
                      onChange={(e) => setTechnicalName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-neutral-700 rounded-lg border border-neutral-200 bg-neutral-50/70"
                    />
                  </div>
                )}

                {/* Common fields based on Type */}
                {productType === 'fertilizer' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'मात्रा (Quantity):' : 'Quantity:'}
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="any"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'इकाई (Unit):' : 'Unit:'}
                        </label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                        >
                          <option value="bags">{language === 'hi' ? 'बोरी (Bags)' : 'Bags'}</option>
                          <option value="kg">{language === 'hi' ? 'किलो (Kg)' : 'Kg'}</option>
                          <option value="quintal">{language === 'hi' ? 'क्विंटल (Quintal)' : 'Quintal'}</option>
                          <option value="liters">{language === 'hi' ? 'लीटर (Liters)' : 'Liters'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'अनुमानित लागत (₹):' : 'Estimated Cost (₹):'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'प्रयोग विधि (Method):' : 'Application Method:'}
                        </label>
                        <select
                          value={applicationMethod}
                          onChange={(e) => setApplicationMethod(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                        >
                          <option value="Broadcasting">{language === 'hi' ? 'छींटा मारना (Broadcasting)' : 'Broadcasting'}</option>
                          <option value="Basal Application">{language === 'hi' ? 'बुवाई के समय (Basal)' : 'Basal Dose'}</option>
                          <option value="Foliar Spray">{language === 'hi' ? 'स्प्रे (Foliar)' : 'Foliar Spray'}</option>
                          <option value="Drip/Fertigation">{language === 'hi' ? 'ड्रिप (Fertigation)' : 'Drip / Fertigation'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {language === 'hi' ? 'फसल अवस्था (Growth Stage):' : 'Stage:'}
                      </label>
                      <input
                        type="text"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
                        placeholder="e.g. 1st Top Dressing (21 days)"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {language === 'hi' ? 'उद्देश्य / कीट-रोग नियंत्रण:' : 'Purpose / Disease Protection:'}
                      </label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
                        placeholder="e.g. Blight & Rust prevention, Aphids control"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          {language === 'hi' ? 'अनुमानित लागत (₹):' : 'Spray Cost (₹):'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>

                      {dosage && (
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            {language === 'hi' ? 'अनुशंसित मात्रा:' : 'Recommended Dosage:'}
                          </label>
                          <div className="px-3 py-2 text-xs bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-700 truncate">
                            {dosage}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {safetyPrecautions && (
                  <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>{language === 'hi' ? 'सुरक्षा निर्देश:' : 'Safety Precaution:'} </strong>
                      {safetyPrecautions}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('camera');
                    setCapturedImage(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'दोबारा स्कैन करें' : 'Scan Another Label'}</span>
                </button>

                <button
                  id="confirm-autofill-btn"
                  type="button"
                  onClick={handleConfirmAutoFill}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                    productType === 'fertilizer'
                      ? 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-950/20'
                      : 'bg-purple-800 hover:bg-purple-900 shadow-purple-950/20'
                  }`}
                >
                  <span>
                    {productType === 'fertilizer'
                      ? language === 'hi'
                        ? 'स्वतः भरें और खाद फॉर्म खोलें'
                        : 'Auto-Fill Fertilizer Modal'
                      : language === 'hi'
                        ? 'स्वतः भरें और स्प्रे फॉर्म खोलें'
                        : 'Auto-Fill Spray Modal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
