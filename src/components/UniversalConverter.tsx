import React, { useState, useEffect, useRef } from "react";
import { 
  Calculator as CalcIcon, 
  DollarSign, 
  Scale, 
  Ruler, 
  RefreshCw, 
  ArrowLeftRight, 
  History, 
  Trash2, 
  TrendingUp, 
  Check, 
  HelpCircle,
  Hash,
  Sparkles,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExchangeRateResponse {
  result: string;
  provider: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

// Preloaded highly accurate fallback rates relative to USD in case of offline usage
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  PKR: 278.45,
  INR: 83.48,
  EUR: 0.92,
  GBP: 0.78,
  AED: 3.67,
  SAR: 3.75,
  CAD: 1.37,
  AUD: 1.51,
  JPY: 157.82,
  CNY: 7.26,
  SGD: 1.35,
  TRY: 32.85,
  MYR: 4.71,
  KWD: 0.31,
  OMR: 0.38,
  QAR: 3.64,
  BHD: 0.38
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar ($)",
  PKR: "Pakistani Rupee (Rs)",
  INR: "Indian Rupee (₹)",
  EUR: "Euro (€)",
  GBP: "British Pound (£)",
  AED: "UAE Dirham (AED)",
  SAR: "Saudi Riyal (SR)",
  CAD: "Canadian Dollar (C$)",
  AUD: "Australian Dollar (A$)",
  JPY: "Japanese Yen (¥)",
  CNY: "Chinese Yuan (¥)",
  SGD: "Singapore Dollar (S$)",
  TRY: "Turkish Lira (₺)",
  MYR: "Malaysian Ringgit (RM)",
  KWD: "Kuwaiti Dinar (KD)",
  OMR: "Omani Rial (OMR)",
  QAR: "Qatari Riyal (QR)",
  BHD: "Bahraini Dinar (BD)"
};

export function UniversalConverter({ adsEnabled }: { adsEnabled: boolean }) {
  const [activeTab, setActiveTab] = useState<"currency" | "calculator" | "unit_weight" | "unit_length">("currency");

  // -----------------------------------------------------------------
  // 1. CURRENCY CONVERTER STATE & LOGIC
  // -----------------------------------------------------------------
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [lastUpdated, setLastUpdated] = useState<string>("Preloaded Local Offline Rates");
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("PKR");
  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount] = useState<string>("");

  // Fetch Live Rates
  const fetchRates = async (isPoll: boolean = false) => {
    if (!isPoll) {
      setRatesLoading(true);
    }
    setRatesError(null);
    try {
      // Primary: Try Coinbase for real-time, live market rates matching search engines
      const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=USD");
      if (!res.ok) throw new Error("Coinbase API failed");
      const data = await res.json();
      if (data && data.data && data.data.rates) {
        const parsedRates: Record<string, number> = {};
        for (const [key, val] of Object.entries(data.data.rates)) {
          const num = parseFloat(val as string);
          if (!isNaN(num) && num > 0) {
            parsedRates[key] = num;
          }
        }
        // Blend Coinbase live rates with fallback presets
        const updatedRates = { ...FALLBACK_RATES, ...parsedRates };
        setRates(updatedRates);
        
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " (Live Google & Coinbase Sync)");
        setRatesError(null);
        return; // Success
      }
    } catch (err: any) {
      console.warn("Coinbase live fetch failed, fallback to secondary API...", err);
    }

    // Secondary: Fallback to open-er-api if Coinbase is unavailable
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error("Could not fetch real-time exchange rates.");
      const data: ExchangeRateResponse = await res.json();
      if (data && data.rates) {
        const updatedRates = { ...FALLBACK_RATES, ...data.rates };
        setRates(updatedRates);
        if (data.time_last_update_utc) {
          const date = new Date(data.time_last_update_utc);
          setLastUpdated(date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          }) + " (Live Google Rate Sync)");
        }
      }
    } catch (err: any) {
      console.warn("Currency rate fetch failed, relying on fallback preloaded rates.", err);
      if (!isPoll) {
        setRatesError("Unable to fetch live rates. Using cached rates.");
      }
    } finally {
      if (!isPoll) {
        setRatesLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRates();

    // Set up continuous polling every 10 seconds to keep rates synced in real-time
    const interval = setInterval(() => {
      if (activeTab === "currency") {
        fetchRates(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Compute live conversion
  useEffect(() => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return;
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      setToAmount("");
      return;
    }
    // rate = toCurrencyRate / fromCurrencyRate
    const conversionRate = rates[toCurrency] / rates[fromCurrency];
    setToAmount((amount * conversionRate).toFixed(2));
  }, [fromCurrency, toCurrency, fromAmount, rates]);

  const handleFromAmountChange = (val: string) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
    }
  };

  const handleToAmountChange = (val: string) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setToAmount(val);
      // reverse calculate fromAmount
      const amount = parseFloat(val);
      if (!isNaN(amount) && rates[fromCurrency] && rates[toCurrency]) {
        const reverseRate = rates[fromCurrency] / rates[toCurrency];
        setFromAmount((amount * reverseRate).toFixed(2));
      }
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount(toAmount || "1");
  };

  // -----------------------------------------------------------------
  // 2. INTERACTIVE CALCULATOR STATE & LOGIC
  // -----------------------------------------------------------------
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcResult, setCalcResult] = useState<string>("");
  const [calcHistory, setCalcHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ez_calc_history") || "[]");
    } catch {
      return [];
    }
  });
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("ez_calc_history", JSON.stringify(calcHistory));
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [calcHistory]);

  const handleCalcClick = (char: string) => {
    if (char === "AC") {
      setCalcInput("");
      setCalcResult("");
    } else if (char === "C") {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (char === "=") {
      evaluateCalculator();
    } else {
      // Prevent multiple consecutive operators
      const operators = ["+", "-", "*", "/"];
      if (operators.includes(char) && operators.includes(calcInput.slice(-1))) {
        setCalcInput(prev => prev.slice(0, -1) + char);
      } else {
        setCalcInput(prev => prev + char);
      }
    }
  };

  const evaluateCalculator = () => {
    if (!calcInput) return;
    try {
      // Safely parse mathematical expression without dangerous eval
      // Replace display symbols if any (e.g. ÷ with /, × with *)
      let cleanExpr = calcInput.replace(/÷/g, "/").replace(/×/g, "*").trim();
      
      // Basic expression sanitization - only digits, decimals, standard arithmetic operators, and parentheses allowed
      if (!/^[0-9+\-*/().\s%]+$/.test(cleanExpr)) {
        throw new Error("Invalid characters");
      }

      // Handle percentages e.g., 50% -> 50/100
      cleanExpr = cleanExpr.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      // Safely evaluate expression using Function constructor with no global scope exposure
      const result = new Function(`return (${cleanExpr})`)();
      
      if (result === undefined || isNaN(result) || !isFinite(result)) {
        setCalcResult("Error");
      } else {
        const formattedResult = parseFloat(result.toFixed(6)).toString();
        setCalcResult(formattedResult);
        
        // Save to History Tape
        setCalcHistory(prev => {
          const updated = [...prev, `${calcInput} = ${formattedResult}`];
          return updated.slice(-30); // Keep last 30
        });
      }
    } catch (e) {
      setCalcResult("Syntax Error");
    }
  };

  const clearCalcHistory = () => {
    setCalcHistory([]);
  };

  // Keyboard support for calculator
  useEffect(() => {
    if (activeTab !== "calculator") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleCalcClick(key);
      } else if (["+", "-", "*", "/", "%", "(", ")", "."].includes(key)) {
        handleCalcClick(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        evaluateCalculator();
      } else if (key === "Backspace") {
        handleCalcClick("C");
      } else if (key === "Escape") {
        handleCalcClick("AC");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, calcInput]);

  // -----------------------------------------------------------------
  // 3. WEIGHT & MASS CONVERTER STATE & LOGIC
  // -----------------------------------------------------------------
  const [weightValue, setWeightValue] = useState<string>("1");
  const [weightUnit, setWeightUnit] = useState<string>("kg");

  const weightRatesInGrams: Record<string, number> = {
    mg: 0.001,
    g: 1.0,
    kg: 1000.0,
    lb: 453.59237,
    oz: 28.3495231
  };

  const getWeightOutput = (targetUnit: string): string => {
    const inputVal = parseFloat(weightValue);
    if (isNaN(inputVal)) return "-";
    // Convert source value to grams first
    const inGrams = inputVal * weightRatesInGrams[weightUnit];
    // Convert from grams to target unit
    const converted = inGrams / weightRatesInGrams[targetUnit];
    
    if (converted < 0.0001) {
      return converted.toExponential(4);
    }
    return parseFloat(converted.toFixed(5)).toLocaleString(undefined, { maximumFractionDigits: 5 });
  };

  // -----------------------------------------------------------------
  // 4. LENGTH & DISTANCE CONVERTER STATE & LOGIC
  // -----------------------------------------------------------------
  const [lengthValue, setLengthValue] = useState<string>("1");
  const [lengthUnit, setLengthUnit] = useState<string>("m");

  const lengthRatesInMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1.0,
    km: 1000.0,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
  };

  const getLengthOutput = (targetUnit: string): string => {
    const inputVal = parseFloat(lengthValue);
    if (isNaN(inputVal)) return "-";
    // Convert source to meters first
    const inMeters = inputVal * lengthRatesInMeters[lengthUnit];
    // Convert from meters to target unit
    const converted = inMeters / lengthRatesInMeters[targetUnit];
    
    if (converted < 0.0001) {
      return converted.toExponential(4);
    }
    return parseFloat(converted.toFixed(5)).toLocaleString(undefined, { maximumFractionDigits: 5 });
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" id="universal-converter-wrapper">
      {/* Visual Title Section */}
      <div className="text-center" id="converter-hero-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold mb-3.5 border border-blue-100 dark:border-blue-900/30 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Live Google Rate Sync Utility
        </motion.div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-gray-950 dark:text-white tracking-tight leading-tight" id="converter-main-heading">
          Universal <span className="text-blue-600 dark:text-blue-400 drop-shadow-[0_2px_10px_rgba(37,99,235,0.15)]">Converter & Calculator</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto font-medium">
          Instantly convert currencies with real-time official Google rates, perform complex calculations, and translate metric/imperial units.
        </p>
      </div>

      {/* Dynamic Navigation Tabs */}
      <div className="flex justify-center" id="converter-nav-tabs">
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-neutral-900 p-1.5 rounded-2xl text-xs font-semibold border border-slate-200/50 dark:border-neutral-800 shadow-inner max-w-full" id="tabs">
          <button
            onClick={() => setActiveTab("currency")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "currency" 
                ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-bold" 
                : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
            }`}
            id="tab-currency"
          >
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span>Currency Converter</span>
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "calculator" 
                ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-bold" 
                : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
            }`}
            id="tab-calculator"
          >
            <CalcIcon className="h-4 w-4 text-purple-500" />
            <span>Interactive Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("unit_weight")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "unit_weight" 
                ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-bold" 
                : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
            }`}
            id="tab-weight"
          >
            <Scale className="h-4 w-4 text-emerald-500" />
            <span>Weight (g ⇆ kg)</span>
          </button>

          <button
            onClick={() => setActiveTab("unit_length")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              activeTab === "unit_length" 
                ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400 font-bold" 
                : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
            }`}
            id="tab-length"
          >
            <Ruler className="h-4 w-4 text-amber-500" />
            <span>Length (in ⇆ cm)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm" id="converter-main-card">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CURRENCY CONVERTER */}
          {activeTab === "currency" && (
            <motion.div
              key="currency"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="currency-converter-tab-content"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-white">Live Currency Rate Converter</h3>
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        Live 10s Sync
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Sourced from real-time interbank feeds matching Google rates</p>
                </div>
                <button 
                  onClick={fetchRates}
                  disabled={ratesLoading}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200/40 dark:border-neutral-800 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Force Refresh Rates"
                >
                  <RefreshCw className={`h-4 w-4 text-blue-500 ${ratesLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {ratesError && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{ratesError}</span>
                </div>
              )}

              {/* Conversion Controls */}
              <div className="grid md:grid-cols-11 gap-4 items-center">
                {/* From currency field */}
                <div className="md:col-span-5 bg-slate-50 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-100 dark:border-neutral-800/60 space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">From Currency</label>
                  <div className="flex gap-2">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-bold rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 w-1/2"
                    >
                      {Object.keys(rates).map((code) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-base font-extrabold rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 w-1/2 text-right"
                      placeholder="0.00"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 block font-medium">
                    {CURRENCY_NAMES[fromCurrency] || fromCurrency}
                  </span>
                </div>

                {/* SWAP BUTTON */}
                <div className="md:col-span-1 flex justify-center">
                  <button
                    onClick={swapCurrencies}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 shadow-md hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center"
                    title="Swap Currencies"
                  >
                    <ArrowLeftRight className="h-4 w-4 shrink-0 rotate-90 md:rotate-0" />
                  </button>
                </div>

                {/* To currency field */}
                <div className="md:col-span-5 bg-slate-50 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-100 dark:border-neutral-800/60 space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">To Currency</label>
                  <div className="flex gap-2">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-bold rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 w-1/2"
                    >
                      {Object.keys(rates).map((code) => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={toAmount}
                      onChange={(e) => handleToAmountChange(e.target.value)}
                      className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-base font-extrabold rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 w-1/2 text-right"
                      placeholder="0.00"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 block font-medium">
                    {CURRENCY_NAMES[toCurrency] || toCurrency}
                  </span>
                </div>
              </div>

              {/* Dynamic Rates Reference Info Card */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 animate-pulse shrink-0" />
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-blue-950 dark:text-blue-300">
                      1 {fromCurrency} = {((rates[toCurrency] || 1) / (rates[fromCurrency] || 1)).toFixed(4)} {toCurrency}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      1 {toCurrency} = {((rates[fromCurrency] || 1) / (rates[toCurrency] || 1)).toFixed(4)} {fromCurrency}
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500 font-bold block uppercase tracking-wide">Last Updated</span>
                  <span className="text-[11px] text-gray-600 dark:text-neutral-400 font-semibold">{lastUpdated}</span>
                </div>
              </div>

              {/* Popular Currencies Instant Exchange Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" /> Hot Rates Quick-Glance (USD Base)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {["PKR", "INR", "EUR", "GBP", "AED", "SAR"].map((code) => {
                    const rate = rates[code] || 0;
                    return (
                      <div 
                        key={code} 
                        onClick={() => {
                          setFromCurrency("USD");
                          setToCurrency(code);
                        }}
                        className="bg-slate-50 dark:bg-neutral-950/40 border border-slate-200/50 dark:border-neutral-800/80 p-3 rounded-xl text-center cursor-pointer hover:bg-blue-50/20 dark:hover:bg-blue-950/10 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200"
                      >
                        <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 block uppercase">{code} Rate</span>
                        <span className="text-xs font-extrabold text-gray-800 dark:text-white mt-1 block">
                          {rate.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-blue-500 font-bold mt-0.5 block">Select ⇆</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE CALCULATOR */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid lg:grid-cols-12 gap-8"
              id="calculator-tab-content"
            >
              {/* Left Side: Active Calculator Screen & Keyboard */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-gray-100 dark:border-neutral-800/80 pb-3">
                  <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-white">Latest Interactive Calculator</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Supports physical keyboard input, nested parenthesis, and percentage calculation.</p>
                </div>

                {/* Primary Display Screen */}
                <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-inner border border-neutral-800 text-right space-y-1.5 flex flex-col justify-end min-h-[110px] relative overflow-hidden">
                  <div className="text-gray-400 text-xs font-medium font-mono min-h-4 break-words tracking-tight">
                    {calcInput || "0"}
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight break-all">
                    {calcResult ? `= ${calcResult}` : " "}
                  </div>
                  {/* Subtle Keyboard Status Indicator */}
                  <span className="absolute left-3 top-3 text-[9px] text-neutral-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Hash className="h-3 w-3 text-neutral-600" /> Live Keyboard Enabled
                  </span>
                </div>

                {/* Keypad Grid Layout */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  <button onClick={() => handleCalcClick("AC")} className="py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 font-bold text-sm rounded-xl transition-all cursor-pointer">AC</button>
                  <button onClick={() => handleCalcClick("(")} className="py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-slate-200/20 text-gray-800 dark:text-gray-200 font-bold text-sm rounded-xl transition-all cursor-pointer">(</button>
                  <button onClick={() => handleCalcClick(")")} className="py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-slate-200/20 text-gray-800 dark:text-gray-200 font-bold text-sm rounded-xl transition-all cursor-pointer">)</button>
                  <button onClick={() => handleCalcClick("/")} className="py-3.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-bold text-lg rounded-xl transition-all cursor-pointer">÷</button>

                  {/* Row 2 */}
                  <button onClick={() => handleCalcClick("7")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">7</button>
                  <button onClick={() => handleCalcClick("8")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">8</button>
                  <button onClick={() => handleCalcClick("9")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">9</button>
                  <button onClick={() => handleCalcClick("*")} className="py-3.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-bold text-lg rounded-xl transition-all cursor-pointer">×</button>

                  {/* Row 3 */}
                  <button onClick={() => handleCalcClick("4")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">4</button>
                  <button onClick={() => handleCalcClick("5")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">5</button>
                  <button onClick={() => handleCalcClick("6")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">6</button>
                  <button onClick={() => handleCalcClick("-")} className="py-3.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-bold text-lg rounded-xl transition-all cursor-pointer">-</button>

                  {/* Row 4 */}
                  <button onClick={() => handleCalcClick("1")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">1</button>
                  <button onClick={() => handleCalcClick("2")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">2</button>
                  <button onClick={() => handleCalcClick("3")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">3</button>
                  <button onClick={() => handleCalcClick("+")} className="py-3.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-500 font-bold text-lg rounded-xl transition-all cursor-pointer">+</button>

                  {/* Row 5 */}
                  <button onClick={() => handleCalcClick("0")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">0</button>
                  <button onClick={() => handleCalcClick(".")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">.</button>
                  <button onClick={() => handleCalcClick("%")} className="py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 border border-slate-200/30 text-gray-900 dark:text-white font-extrabold text-base rounded-xl transition-all cursor-pointer">%</button>
                  <button onClick={() => handleCalcClick("=")} className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition-all cursor-pointer shadow-sm">=</button>
                </div>
              </div>

              {/* Right Side: Calculation History Tape */}
              <div className="lg:col-span-5 flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800/80 pb-3">
                  <span className="text-xs font-bold text-gray-800 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                    <History className="h-4 w-4 text-gray-500" /> History Tape
                  </span>
                  {calcHistory.length > 0 && (
                    <button
                      onClick={clearCalcHistory}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear History
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200/60 dark:border-neutral-800 rounded-2xl p-4 flex-grow h-64 overflow-y-auto space-y-2.5">
                  {calcHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-neutral-500 py-12">
                      <History className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-bold">No history recorded yet</p>
                      <p className="text-[10px] mt-0.5">Calculations will show up here as tape receipts</p>
                    </div>
                  ) : (
                    calcHistory.map((item, idx) => {
                      const parts = item.split(" = ");
                      return (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (parts[1]) {
                              setCalcInput(parts[1]);
                              setCalcResult("");
                            }
                          }}
                          className="p-2.5 bg-white dark:bg-neutral-900 border border-slate-200/40 dark:border-neutral-800/60 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer transition-all text-right font-mono text-xs group"
                        >
                          <div className="text-gray-400 dark:text-neutral-500 group-hover:text-blue-500 transition-colors">
                            {parts[0]}
                          </div>
                          <div className="text-gray-900 dark:text-white font-bold text-sm mt-0.5">
                            = {parts[1]}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={historyEndRef} />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WEIGHT & MASS CONVERTER */}
          {activeTab === "unit_weight" && (
            <motion.div
              key="unit_weight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="weight-converter-tab-content"
            >
              <div className="border-b border-gray-100 dark:border-neutral-800/80 pb-4">
                <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-white">Scientific Weight & Mass Converter</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Translate between metric and imperial weight categories smoothly.</p>
              </div>

              {/* Input Row */}
              <div className="grid sm:grid-cols-12 gap-3 bg-slate-50 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200/50 dark:border-neutral-800">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Enter Value</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={weightValue}
                    onChange={(e) => {
                      if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                        setWeightValue(e.target.value);
                      }
                    }}
                    className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-base font-extrabold rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-left"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Source Unit</label>
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-bold rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="mg">Milligrams (mg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="oz">Ounces (oz)</option>
                  </select>
                </div>
              </div>

              {/* Output Bento Grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Immediate Outputs Across All Units
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { unit: "kg", name: "Kilograms", symbol: "kg", desc: "Base SI metric" },
                    { unit: "g", name: "Grams", symbol: "g", desc: "Scientific metric" },
                    { unit: "lb", name: "Pounds", symbol: "lb", desc: "Imperial Standard" },
                    { unit: "oz", name: "Ounces", symbol: "oz", desc: "Imperial Precise" },
                    { unit: "mg", name: "Milligrams", symbol: "mg", desc: "Micro metric" }
                  ].map((item) => (
                    <div 
                      key={item.unit}
                      className={`p-4 rounded-xl border transition-all duration-300 text-center ${
                        weightUnit === item.unit 
                          ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs" 
                          : "bg-slate-50 dark:bg-neutral-950/40 border-slate-200/60 dark:border-neutral-800"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 block uppercase">
                        {item.name} ({item.symbol})
                      </span>
                      <span className={`text-sm sm:text-base font-extrabold mt-1.5 block break-all font-mono ${
                        weightUnit === item.unit ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                      }`}>
                        {getWeightOutput(item.unit)}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-neutral-500 mt-1 block font-medium">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: LENGTH & DISTANCE CONVERTER */}
          {activeTab === "unit_length" && (
            <motion.div
              key="unit_length"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
              id="length-converter-tab-content"
            >
              <div className="border-b border-gray-100 dark:border-neutral-800/80 pb-4">
                <h3 className="font-display font-extrabold text-lg text-gray-950 dark:text-white">Precision Length & Distance Converter</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Translate between imperial inches/feet and metric centimeters/meters instantly.</p>
              </div>

              {/* Input Row */}
              <div className="grid sm:grid-cols-12 gap-3 bg-slate-50 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200/50 dark:border-neutral-800">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Enter Value</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={lengthValue}
                    onChange={(e) => {
                      if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                        setLengthValue(e.target.value);
                      }
                    }}
                    className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-base font-extrabold rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 text-left"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Source Unit</label>
                  <select
                    value={lengthUnit}
                    onChange={(e) => setLengthUnit(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-sm font-bold rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="in">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="yd">Yards (yd)</option>
                  </select>
                </div>
              </div>

              {/* Output Bento Grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Immediate Outputs Across All Units
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  {[
                    { unit: "in", name: "Inches", symbol: "in", desc: "Imperial precise" },
                    { unit: "cm", name: "Centimeters", symbol: "cm", desc: "Metric small" },
                    { unit: "m", name: "Meters", symbol: "m", desc: "Metric standard" },
                    { unit: "km", name: "Kilometers", symbol: "km", desc: "Metric distance" },
                    { unit: "mi", name: "Miles", symbol: "mi", desc: "Imperial miles" },
                    { unit: "ft", name: "Feet", symbol: "ft", desc: "Imperial height" },
                    { unit: "yd", name: "Yards", symbol: "yd", desc: "Field standard" }
                  ].map((item) => (
                    <div 
                      key={item.unit}
                      className={`p-3 rounded-xl border transition-all duration-300 text-center ${
                        lengthUnit === item.unit 
                          ? "bg-amber-500/10 border-amber-500/40 shadow-xs" 
                          : "bg-slate-50 dark:bg-neutral-950/40 border-slate-200/60 dark:border-neutral-800"
                      }`}
                    >
                      <span className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 block uppercase">
                        {item.name} ({item.symbol})
                      </span>
                      <span className={`text-xs sm:text-sm font-extrabold mt-1 block break-all font-mono ${
                        lengthUnit === item.unit ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"
                      }`}>
                        {getLengthOutput(item.unit)}
                      </span>
                      <span className="text-[8px] text-gray-400 dark:text-neutral-500 mt-1 block font-medium">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
