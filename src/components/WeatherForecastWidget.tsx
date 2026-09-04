import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  CloudRain,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Language, WeatherForecastData, DayForecast } from '../types';

interface WeatherForecastWidgetProps {
  language: Language;
}

const PRESET_LOCATIONS = [
  { en: "Indore, Madhya Pradesh", hi: "इंदौर, मध्य प्रदेश" },
  { en: "Karnal, Haryana", hi: "करनाल, हरियाणा" },
  { en: "Nashik, Maharashtra", hi: "नासिक, महाराष्ट्र" },
  { en: "Varanasi, Uttar Pradesh", hi: "वाराणसी, उत्तर प्रदेश" },
  { en: "Ludhiana, Punjab", hi: "लुधियाना, पंजाब" },
];

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [locationInput, setLocationInput] = useState<string>(
    isHi ? "इंदौर, मध्य प्रदेश" : "Indore, Madhya Pradesh"
  );
  const [activeLocation, setActiveLocation] = useState<string>(
    isHi ? "इंदौर, मध्य प्रदेश" : "Indore, Madhya Pradesh"
  );
  const [data, setData] = useState<WeatherForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showSources, setShowSources] = useState<boolean>(false);

  const fetchWeather = useCallback(async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/weather/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc, language })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const result = await res.json();
      setData(result);
      setSelectedDayIndex(0);
    } catch (err: any) {
      console.warn("Weather forecast fetch notice:", err?.message || err);
      setError(
        isHi
          ? "मौसम पूर्वानुमान लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Could not retrieve live forecast. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [language, isHi]);

  // Initial fetch and on language change
  useEffect(() => {
    fetchWeather(activeLocation);
  }, [fetchWeather, activeLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    setActiveLocation(locationInput.trim());
  };

  const handleSelectPreset = (loc: string) => {
    setLocationInput(loc);
    setActiveLocation(loc);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const query = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
        setLocationInput(query);
        setActiveLocation(query);
      },
      (geoErr) => {
        console.warn("Geolocation denied or error:", geoErr);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const getWeatherIcon = (condition: string, className = "w-6 h-6") => {
    const c = condition.toLowerCase();
    if (c.includes("thunder") || c.includes("storm") || c.includes("आंधी") || c.includes("तूफान")) {
      return <CloudLightning className={`${className} text-amber-500`} />;
    }
    if (c.includes("rain") || c.includes("shower") || c.includes("बारिश") || c.includes("वर्षा") || c.includes("बूंदाबांदी")) {
      return <CloudRain className={`${className} text-blue-500`} />;
    }
    if (c.includes("cloud") || c.includes("बादल")) {
      return <CloudSun className={`${className} text-teal-600`} />;
    }
    if (c.includes("wind") || c.includes("हवा")) {
      return <Wind className={`${className} text-cyan-600`} />;
    }
    return <Sun className={`${className} text-amber-500`} />;
  };

  const renderSuitabilityBadge = (
    label: string,
    status?: 'favorable' | 'caution' | 'unfavorable' | 'recommended' | 'not_needed' | 'pause' | 'good' | 'risky'
  ) => {
    if (!status) return null;

    let colorClass = "bg-neutral-100 text-neutral-700 border-neutral-200";
    let icon = <HelpCircle className="w-3 h-3" />;
    let text: string = status;

    if (status === 'favorable' || status === 'recommended' || status === 'good') {
      colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
      icon = <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
      text = isHi ? "अनुकूल" : "Favorable";
    } else if (status === 'caution') {
      colorClass = "bg-amber-50 text-amber-800 border-amber-300";
      icon = <AlertTriangle className="w-3 h-3 text-amber-600" />;
      text = isHi ? "सावधानी" : "Caution";
    } else if (status === 'unfavorable' || status === 'pause' || status === 'risky') {
      colorClass = "bg-rose-50 text-rose-800 border-rose-300";
      icon = <XCircle className="w-3 h-3 text-rose-600" />;
      text = isHi ? "टालें / जोखिम" : "Avoid";
    } else if (status === 'not_needed') {
      colorClass = "bg-blue-50 text-blue-800 border-blue-200";
      icon = <Droplets className="w-3 h-3 text-blue-600" />;
      text = isHi ? "आवश्यक नहीं" : "Not Needed";
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${colorClass}`}>
        {icon}
        <span>{label}: <strong>{text}</strong></span>
      </span>
    );
  };

  const selectedDay: DayForecast | undefined = data?.forecast?.[selectedDayIndex] || data?.forecast?.[0];

  return (
    <div
      id="seven-day-weather-forecast-widget"
      className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5"
    >
      {/* Widget Header & Grounding Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <CloudSun className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              {isHi ? "7-दिवसीय मौसम व कृषि योजना (Farm Forecast)" : "7-Day Farm Weather Forecast"}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isHi
              ? "Google Search ग्राउंडिंग द्वारा वास्तविक समय मौसम डेटा व खेती सलाह (छिड़काव, सिंचाई व कटाई)"
              : "Live meteorology grounded via Google Search for field planning (spraying, irrigation & harvesting)"}
          </p>
        </div>

        {/* Google Grounding Status & Refresh */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/70"
            title="Verified against live Google Search meteorological sources"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHi ? "गूगल सर्च द्वारा सत्यापित" : "Google Search Grounded"}</span>
          </div>

          <button
            id="refresh-weather-btn"
            type="button"
            onClick={() => fetchWeather(activeLocation)}
            disabled={loading}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors disabled:opacity-50 cursor-pointer"
            title={isHi ? "ताजा मौसम अपडेट करें" : "Refresh Live Forecast"}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Location Search Bar & Preset Chips */}
      <div className="space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="weather-location-input"
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder={isHi ? "गांव या जिला दर्ज करें (जैसे: करनाल, हरियाणा)..." : "Enter village or district (e.g. Karnal, Haryana)..."}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-neutral-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              id="weather-search-submit-btn"
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isHi ? "पूर्वानुमान देखें" : "Get Forecast"}</span>
            </button>

            <button
              id="weather-detect-location-btn"
              type="button"
              onClick={handleDetectLocation}
              disabled={loading}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title={isHi ? "मेरा स्थान पता करें" : "Use GPS"}
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">{isHi ? "मेरा स्थान" : "GPS"}</span>
            </button>
          </div>
        </form>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-neutral-400">
            {isHi ? "सुझाव:" : "Presets:"}
          </span>
          {PRESET_LOCATIONS.map((preset) => {
            const label = isHi ? preset.hi : preset.en;
            const isSelected = activeLocation.toLowerCase().includes(preset.en.split(',')[0].toLowerCase()) ||
              activeLocation.toLowerCase().includes(preset.hi.split(',')[0].toLowerCase());
            return (
              <button
                key={preset.en}
                type="button"
                onClick={() => handleSelectPreset(label)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                {label.split(',')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state skeleton */}
      {loading && !data && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-700" />
          <p className="text-xs sm:text-sm font-medium">
            {isHi
              ? "गूगल सर्च ग्राउंडिंग से 7 दिनों का मौसम व कृषि पूर्वानुमान प्राप्त हो रहा है..."
              : "Retrieving 7-day meteorological data and farm advice via Google Search..."}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchWeather(activeLocation)}
            className="underline font-semibold cursor-pointer"
          >
            {isHi ? "पुनः प्रयास करें" : "Retry"}
          </button>
        </div>
      )}

      {/* Main Content Display when Data is present */}
      {data && (
        <div className="space-y-5">
          {/* Top Overview & Farm Planning Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overview Card */}
            <div className="md:col-span-2 bg-linear-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/70 rounded-2xl p-4 sm:p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{data.location}</span>
                </span>
                <span className="text-[11px] text-emerald-800/80 font-medium">
                  {isHi ? "दिनांक:" : "Updated:"} {data.asOf}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-900 leading-relaxed">
                {data.overview}
              </p>
              <div className="pt-2 border-t border-emerald-200/60">
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  <strong className="font-bold text-emerald-900">
                    {isHi ? "🌾 किसान कार्य योजना (Week Advice): " : "🌾 7-Day Action Plan: "}
                  </strong>
                  {data.farmPlanningSummary}
                </p>
              </div>
            </div>

            {/* Quick Farm Operation Summary Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {isHi ? "कार्य अनुकूलता सूचकांक" : "Operation Windows"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 font-medium">🧪 {isHi ? "दवा छिड़काव:" : "Spraying:"}</span>
                  {selectedDay?.suitability?.spraying ? (
                    renderSuitabilityBadge(isHi ? "दवा" : "Spray", selectedDay.suitability.spraying)
                  ) : (
                    <span className="text-emerald-700 font-semibold">{isHi ? "अनुकूल" : "Favorable"}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 font-medium">💧 {isHi ? "सिंचाई (ट्यूबवेल):" : "Irrigation:"}</span>
                  {selectedDay?.suitability?.irrigation ? (
                    renderSuitabilityBadge(isHi ? "सिंचाई" : "Water", selectedDay.suitability.irrigation)
                  ) : (
                    <span className="text-blue-700 font-semibold">{isHi ? "आवश्यकतानुसार" : "Normal"}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 font-medium">🌾 {isHi ? "कटाई/थ्रेशिंग:" : "Harvest:"}</span>
                  {selectedDay?.suitability?.harvesting ? (
                    renderSuitabilityBadge(isHi ? "कटाई" : "Harvest", selectedDay.suitability.harvesting)
                  ) : (
                    <span className="text-amber-700 font-semibold">{isHi ? "सुरक्षित" : "Good"}</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-neutral-400">
                {isHi ? "*चुने गए दिन के अनुसार स्थिति" : "*Reflects selected day condition"}
              </p>
            </div>
          </div>

          {/* 7-Day Horizontal Card Deck / Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{isHi ? "7 दिनों का दैनिक विवरण (क्लिक करके सलाह देखें)" : "7-Day Timeline (Click day to view details)"}</span>
              </h3>
              <span className="text-[11px] text-emerald-800 font-medium">
                {isHi ? "7 दिन" : "7 Days"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {data.forecast?.map((day, idx) => {
                const isSelected = idx === selectedDayIndex;
                const rainValue = typeof day.rainProb === 'number' ? `${day.rainProb}%` : String(day.rainProb);
                const hasHighRain = parseInt(rainValue, 10) >= 50;

                return (
                  <button
                    key={`${day.day}-${day.date}-${idx}`}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs"
                        : "bg-white border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-neutral-800'}`}>
                          {day.day}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {day.date}
                        </span>
                      </div>

                      <div className="my-2 flex items-center justify-center py-1">
                        {getWeatherIcon(day.condition, "w-8 h-8")}
                      </div>

                      <p className="text-[11px] font-medium text-neutral-600 line-clamp-1 mb-2 text-center">
                        {day.condition}
                      </p>
                    </div>

                    <div className="space-y-1.5 border-t border-neutral-100 pt-2">
                      <div className="flex items-baseline justify-center gap-1.5 text-neutral-900">
                        <span className="text-sm font-bold">{day.tempMax}°</span>
                        <span className="text-xs text-neutral-400 font-medium">{day.tempMin}°</span>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[10px]">
                        <Droplets className={`w-3 h-3 ${hasHighRain ? 'text-blue-600' : 'text-neutral-400'}`} />
                        <span className={hasHighRain ? 'font-bold text-blue-700' : 'text-neutral-500'}>
                          {rainValue}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Deep-Dive Advisory Box */}
          {selectedDay && (
            <div
              id="selected-day-farm-advisory"
              className="p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700">
                    {getWeatherIcon(selectedDay.condition, "w-7 h-7 text-amber-400")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {selectedDay.day} • {selectedDay.date}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium border border-neutral-700">
                        {selectedDay.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                      <span>{isHi ? "अधिकतम:" : "High:"} <strong className="text-white">{selectedDay.tempMax}°C</strong></span>
                      <span>{isHi ? "न्यूनतम:" : "Low:"} <strong className="text-neutral-300">{selectedDay.tempMin}°C</strong></span>
                      <span>{isHi ? "बारिश:" : "Rain:"} <strong className="text-blue-300">{selectedDay.rainProb}</strong></span>
                      {selectedDay.humidity && <span>{isHi ? "नमी:" : "Humidity:"} {selectedDay.humidity}</span>}
                      {selectedDay.wind && <span>{isHi ? "हवा:" : "Wind:"} {selectedDay.wind}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedDay.suitability?.spraying && renderSuitabilityBadge(isHi ? "छिड़काव" : "Spray", selectedDay.suitability.spraying)}
                  {selectedDay.suitability?.irrigation && renderSuitabilityBadge(isHi ? "सिंचाई" : "Water", selectedDay.suitability.irrigation)}
                  {selectedDay.suitability?.harvesting && renderSuitabilityBadge(isHi ? "कटाई" : "Harvest", selectedDay.suitability.harvesting)}
                </div>
              </div>

              {/* Actionable Farm Advisory */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isHi ? "इस दिन के लिए किसान सलाह (Field Operations):" : "Agronomic Recommendation for this Day:"}</span>
                </p>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  {selectedDay.farmAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Grounding Attribution & Verified Meteorological Sources */}
          {data.sources && data.sources.length > 0 && (
            <div className="border border-neutral-200/80 rounded-xl p-3 bg-neutral-50/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    {isHi
                      ? "सत्यापित मौसम स्रोत (गूगल सर्च ग्राउंडिंग):"
                      : "Verified Meteorological Sources (Google Search Grounding):"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSources(!showSources)}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer underline"
                >
                  {showSources
                    ? (isHi ? "छुपाएं" : "Hide")
                    : `${data.sources.length} ${isHi ? "स्रोत देखें" : "sources"}`}
                </button>
              </div>

              {showSources && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200/70">
                  {data.sources.map((src, i) => (
                    <a
                      key={`${src.uri}-${i}`}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-emerald-400 text-neutral-700 hover:text-emerald-800 text-[11px] transition-colors"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
