import React, { useState, useEffect } from "react";
import { 
  Globe, 
  MapPin, 
  Shield, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  Laptop, 
  Compass, 
  Wifi, 
  Clock, 
  ExternalLink,
  Navigation,
  Activity,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdsterraNative } from "./AdsterraNative";

interface IpDetails {
  ip: string;
  network?: string;
  version?: string;
  city: string;
  region: string;
  region_code?: string;
  country: string;
  country_name: string;
  country_code: string;
  country_capital?: string;
  country_tld?: string;
  continent_code?: string;
  in_eu?: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset?: string;
  country_calling_code?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  country_area?: number;
  country_population?: number;
  asn?: string;
  org: string;
  error?: boolean;
  reason?: string;
}

interface IpFinderProps {
  adsEnabled: boolean;
}

export const IpFinder: React.FC<IpFinderProps> = ({ adsEnabled }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [myIpData, setMyIpData] = useState<IpDetails | null>(null);
  const [activeData, setActiveData] = useState<IpDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Connection Latency / Ping state
  const [pingData, setPingData] = useState<Array<{ name: string; url: string; time: number | null; status: "idle" | "testing" | "done" | "error" }>>([
    { name: "Cloudflare (1.1.1.1)", url: "https://1.1.1.1/cdn-cgi/trace", time: null, status: "idle" },
    { name: "Google Public DNS", url: "https://dns.google/resolve?name=google.com", time: null, status: "idle" },
    { name: "OpenDNS Gateway", url: "https://fallback-check.eztoolbox.xyz", time: null, status: "idle" } // will ping via lightweight fetch
  ]);

  // Browser / Environment state
  const [systemDetails, setSystemDetails] = useState({
    os: "Detecting...",
    browser: "Detecting...",
    screen: "Detecting...",
    language: "Detecting...",
    useragent: ""
  });

  // Fetch client IP on load
  useEffect(() => {
    fetchMyIp();
    detectSystemDetails();
  }, []);

  const fetchMyIp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Primary API: ipapi.co (HTTPS, returns extensive fields)
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("Primary IP resolver returned non-200");
      const data: IpDetails = await res.json();
      
      setMyIpData(data);
      setActiveData(data);
    } catch (e) {
      console.warn("ipapi.co failed, trying backup...", e);
      try {
        // Backup API: ipinfo.io (standard free tier)
        const backupRes = await fetch("https://ipinfo.io/json");
        if (!backupRes.ok) throw new Error("Backup IP resolver failed");
        const backupData = await backupRes.json();
        const coords = backupData.loc ? backupData.loc.split(",") : [0, 0];
        
        const convertedData: IpDetails = {
          ip: backupData.ip,
          city: backupData.city || "Unknown",
          region: backupData.region || "Unknown",
          country_name: backupData.country || "Unknown",
          country: backupData.country || "Unknown",
          country_code: backupData.country || "Unknown",
          postal: backupData.postal || "Unknown",
          latitude: parseFloat(coords[0]),
          longitude: parseFloat(coords[1]),
          timezone: backupData.timezone || "Unknown",
          org: backupData.org || "Unknown"
        };
        setMyIpData(convertedData);
        setActiveData(convertedData);
      } catch (backupError) {
        // Ultimate fallback: static details just to load something
        setError("Unable to retrieve automatic IP details. Please check your ad blocker or enter an IP address manually.");
      }
    } finally {
      setLoading(false);
    }
  };

  const detectSystemDetails = () => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    if (ua.indexOf("Win") !== -1) os = "Windows";
    else if (ua.indexOf("Mac") !== -1) os = "macOS";
    else if (ua.indexOf("X11") !== -1) os = "UNIX";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";
    else if (ua.indexOf("Android") !== -1) os = "Android";
    else if (ua.indexOf("like Mac") !== -1) os = "iOS";

    if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";
    else if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
    else if (ua.indexOf("MSIE") !== -1 || !!(document as any).documentMode) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") !== -1) browser = "Microsoft Edge";

    setSystemDetails({
      os,
      browser,
      screen: `${window.screen.width} x ${window.screen.height}`,
      language: navigator.language || "en-US",
      useragent: ua
    });
  };

  // Triggers lookup for a user-input IP address
  const handleIpLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Quick regex validation for IPv4/IPv6 format
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    if (!ipv4Regex.test(query) && !ipv6Regex.test(query)) {
      setSearchError("Please enter a valid IPv4 or IPv6 address (e.g. 8.8.8.8).");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`https://ipapi.co/${query}/json/`);
      if (!res.ok) throw new Error("Search IP lookup failed");
      const data: IpDetails = await res.json();
      
      if (data.error) {
        setSearchError(data.reason || "Unable to look up location coordinates for this IP.");
        return;
      }
      
      setActiveData(data);
    } catch (err) {
      setSearchError("Failed to connect to IP locator registry database.");
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Test Connection Latency dynamically
  const runPingTest = async () => {
    const updated = pingData.map(item => ({ ...item, status: "testing" as const }));
    setPingData(updated);

    for (let i = 0; i < updated.length; i++) {
      const startTime = Date.now();
      try {
        // Perform standard lightweight fetch request with timeout support
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        await fetch(updated[i].url, { 
          mode: 'no-cors', 
          cache: 'no-cache',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        updated[i] = {
          ...updated[i],
          time: duration,
          status: "done"
        };
      } catch (err) {
        updated[i] = {
          ...updated[i],
          time: null,
          status: "error"
        };
      }
      setPingData([...updated]);
    }
  };

  // Country Flag Emoji Helper
  const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode === "Unknown" || countryCode.length !== 2) return "🌐";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map(char =>  127397 + char.charCodeAt(0));
    try {
      return String.fromCodePoint(...codePoints);
    } catch {
      return "🌐";
    }
  };

  return (
    <div className="space-y-8" id="ip-finder-container">
      {/* Header Info */}
      <div className="text-center mb-10" id="ip-hero-section">
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-full inline-block animate-bounce-slow">
          🌐 Global IP Geolocation & Network Utilities
        </span>
        <h1 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-gray-950 dark:text-white tracking-tight mt-4 transition-all duration-350">
          EZ IP & <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Location Finder</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto font-medium leading-relaxed">
          Instantly find and analyze your public IP address, map geographic coordinates, check ISP details, and test latency with our premium diagnostic toolkit.
        </p>
      </div>

      {/* Modern Premium Search Bar */}
      <div className="max-w-5xl mx-auto" id="premium-search-container">
        <form 
          onSubmit={handleIpLookup} 
          className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-2 md:p-3 rounded-2xl shadow-md focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-indigo-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchError(null);
              }}
              placeholder="Look up any public IPv4 or IPv6 address... (e.g., 8.8.8.8)"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 rounded-xl text-xs sm:text-sm font-bold focus:outline-none text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 transition-all"
              id="ip-lookup-query-input"
            />
            {searchQuery === "" && (
              <span className="hidden md:inline-absolute right-3 text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-1 rounded font-bold uppercase tracking-wider">
                Auto-Detect Active
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] shrink-0"
            id="ip-lookup-submit-btn"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Compass className="h-4 w-4" />
                <span>Lookup IP</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Search Error Indicator */}
      {searchError && (
        <div className="max-w-5xl mx-auto p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Primary Info Dashboard Box in Beautiful Screenshot-Matching Blue Palette */}
      <div className="bg-[#1c446c] text-white p-5 md:p-8 rounded-2xl shadow-xl space-y-6 max-w-5xl mx-auto relative overflow-hidden border border-blue-900/20" id="ss-ip-box">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-blue-800/40">
          <div>
            <span className="text-xs font-extrabold text-blue-200 uppercase tracking-widest block mb-1">My IP Address is:</span>
            
            {/* IPv4 and IPv6 rows */}
            <div className="space-y-2 w-full min-w-[280px] sm:min-w-[400px]">
              {/* IPv4 row */}
              <div className="flex items-center justify-between p-3.5 bg-[#254b70] rounded-xl border border-blue-900/30 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-blue-100">IPv4:</span>
                  <span 
                    className="bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold cursor-help transition-colors"
                    title="Internet Protocol version 4. Your standard public Internet address."
                  >
                    ?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-black font-mono border-b border-white/40 hover:border-white transition-colors tracking-tight text-white cursor-pointer select-all">
                    {loading ? "Detecting..." : activeData?.ip || "Not detected"}
                  </span>
                  {activeData && (
                    <button
                      onClick={() => copyToClipboard("ipv4", activeData.ip)}
                      className="p-1 rounded hover:bg-white/10 text-blue-200 hover:text-white transition-all cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedField === "ipv4" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* IPv6 row */}
              <div className="flex items-center justify-between p-3.5 bg-[#254b70] rounded-xl border border-blue-900/30 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-blue-100">IPv6:</span>
                  <span 
                    className="bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold cursor-help transition-colors"
                    title="Internet Protocol version 6. Newer routing standard."
                  >
                    ?
                  </span>
                </div>
                <span className="text-sm md:text-base font-bold font-mono text-blue-200/90 tracking-tight">
                  {activeData?.ip && activeData.ip.includes(":") ? activeData.ip : "Not detected"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 self-end lg:self-center">
            <button
              onClick={fetchMyIp}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-50 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              id="refresh-ip-btn"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh IP</span>
            </button>
            {myIpData && activeData?.ip !== myIpData.ip && (
              <button
                onClick={() => setActiveData(myIpData)}
                className="px-4 py-2 bg-blue-900/40 hover:bg-blue-950/40 text-blue-100 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-blue-500/20"
                id="reset-to-my-ip-btn"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>My IP</span>
              </button>
            )}
          </div>
        </div>

        {/* Inner grid layout: exactly replicating columns with rich blue styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 items-stretch" id="ss-columns-wrapper">
          
          {/* Column 1: Grey-Blue IP Information Block */}
          <div className="bg-[#244b70] p-5 rounded-xl border border-blue-900/40 flex flex-col justify-between shadow-inner" id="ss-info-col">
            <div>
              <h4 className="text-xs font-extrabold text-blue-100 border-b border-blue-800/80 pb-2 mb-3.5 tracking-wide uppercase">
                My IP Information:
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px] shrink-0">ISP:</span>
                  <span className="text-white font-black text-right line-clamp-2" title={activeData?.org}>
                    {loading ? "..." : activeData?.org || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px]">City:</span>
                  <span className="text-white font-black">
                    {loading ? "..." : activeData?.city || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px]">Region:</span>
                  <span className="text-white font-black">
                    {loading ? "..." : activeData?.region || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px]">Country:</span>
                  <span className="text-white font-black flex items-center gap-1.5">
                    {loading ? "..." : (
                      <>
                        <span>{getFlagEmoji(activeData?.country_code || "")}</span>
                        <span>{activeData?.country_name || activeData?.country || "Unknown"}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-blue-800/40 flex items-center justify-between text-[9px] text-blue-300 font-bold uppercase tracking-wider">
              <span>ASN: {activeData?.asn || "N/A"}</span>
              <span>Postal: {activeData?.postal || "N/A"}</span>
            </div>
          </div>

          {/* Column 2: Threat Alert & VPN Red Action Button */}
          <div className="flex flex-col justify-center items-center text-center p-5 bg-blue-950/20 rounded-xl border border-blue-900/20 space-y-4 shadow-inner" id="ss-security-col">
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-200 text-[9px] font-black tracking-widest uppercase rounded">
                ⚠️ Exposed
              </span>
              <h4 className="text-xs font-extrabold text-blue-100 mt-2 uppercase tracking-wider">
                Your location may be exposed!
              </h4>
              <p className="text-[11px] text-blue-200/80 max-w-xs leading-relaxed font-medium">
                Third-party sites can easily monitor your exact geographic region, ISP provider, and network properties.
              </p>
            </div>

            {/* Bright Red Action Button */}
            <a 
              href="https://www.google.com/search?q=best+vpn+providers"
              target="_blank" 
              rel="noreferrer"
              className="w-full py-3 bg-[#ff3b30] hover:bg-[#e03126] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              id="hide-ip-btn-ss"
            >
              <Shield className="h-3.5 w-3.5 shrink-0 fill-current" />
              <span>HIDE MY IP ADDRESS NOW</span>
            </a>

            <button 
              onClick={() => {
                const element = document.getElementById("ip-metadata-section");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[11px] font-bold text-blue-300 hover:text-white underline tracking-wide cursor-pointer bg-transparent border-none"
            >
              Show Complete IP Details
            </button>
          </div>

          {/* Column 3: Custom map tracing & pinpoint update details */}
          <div className="flex flex-col space-y-3" id="ss-map-col">
            <div className="flex-1 aspect-square rounded-xl bg-slate-950 overflow-hidden relative border border-blue-900/30 shadow-inner min-h-[160px]">
              {activeData?.latitude && activeData?.longitude ? (
                <>
                  <iframe
                    title="Screenshot Geolocation Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeData.longitude - 0.03}%2C${activeData.latitude - 0.03}%2C${activeData.longitude + 0.03}%2C${activeData.latitude + 0.03}&layer=mapnik&marker=${activeData.latitude}%2C${activeData.longitude}`}
                    className="w-full h-full relative z-10"
                  />
                  {/* Floating click tooltip */}
                  <div className="absolute top-2 left-2 z-20 bg-slate-900/95 text-slate-100 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs border border-slate-800 max-w-[150px] leading-tight pointer-events-none">
                    Pinpoint coordinates of <span className="text-blue-400 font-black">{activeData.ip}</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <MapPin className="h-6 w-6 text-blue-300 animate-bounce" />
                  <p className="text-xs text-blue-200 font-bold">No map coordinates.</p>
                </div>
              )}
            </div>

            {/* Links under map */}
            <div className="text-center space-y-1">
              <span className="text-[10px] text-blue-200 block font-medium">Location not accurate?</span>
              <button 
                onClick={fetchMyIp}
                className="text-[10px] font-extrabold text-teal-300 hover:text-white underline uppercase tracking-wider bg-transparent border-none cursor-pointer"
              >
                Update My IP Location
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Banner Ad Placement */}
      {adsEnabled && (
        <div className="flex justify-center" id="ip-mid-ad-placement">
          <div className="w-full max-w-lg">
            <AdsterraNative id="ip-middle-native" enabled={adsEnabled} />
          </div>
        </div>
      )}

      {/* Secondary grid: Registry metadata & Diagnostic tools arranged cleanly below */}
      <div className="grid lg:grid-cols-12 gap-8 items-start pt-6" id="ip-metadata-section">
        {/* Left Grid: Comprehensive Info Registry */}
        <div className="lg:col-span-6 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white uppercase tracking-wider">
              Detailed Geolocation Database Registry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "IP Address", val: activeData?.ip, id: "active-ip" },
              { label: "Country Name", val: activeData?.country_name || activeData?.country, id: "country" },
              { label: "Country ISO Code", val: activeData?.country_code, id: "country-code" },
              { label: "Region / State", val: activeData?.region, id: "region" },
              { label: "City / Municipality", val: activeData?.city, id: "city" },
              { label: "Postal / Zip Code", val: activeData?.postal || "N/A", id: "postal" },
              { label: "Latitude Coordinates", val: activeData?.latitude?.toString(), id: "lat" },
              { label: "Longitude Coordinates", val: activeData?.longitude?.toString(), id: "lon" },
              { label: "Registry ASN", val: activeData?.asn || "N/A", id: "asn" },
              { label: "ISP Network Provider", val: activeData?.org, id: "org" },
              { label: "Official Timezone", val: activeData?.timezone, id: "timezone" },
              { label: "Capital City", val: activeData?.country_capital || "N/A", id: "capital" },
            ].map((row, i) => {
              if (!row.val) return null;
              return (
                <div 
                  key={i} 
                  className="flex flex-col justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-neutral-950 dark:hover:bg-neutral-900/60 border border-slate-100 dark:border-neutral-850/50 transition-all text-xs"
                  id={`meta-row-${row.id}`}
                >
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1">
                    {row.label}
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-950 dark:text-white font-mono font-bold truncate select-all" title={row.val}>
                      {row.val}
                    </span>
                    <button
                      onClick={() => copyToClipboard(row.id, row.val || "")}
                      className="p-1 text-gray-400 hover:text-emerald-500 rounded transition-all cursor-pointer"
                      title={`Copy ${row.label}`}
                    >
                      {copiedField === row.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Grid: Diagnostics */}
        <div className="lg:col-span-6 space-y-6">
          {/* Latency & CDN ping metrics tool */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white uppercase tracking-wider">
                  Ping Connection Diagnostics
                </h3>
              </div>
              <button
                onClick={runPingTest}
                className="px-3 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-lg text-[10px] font-extrabold text-gray-600 dark:text-neutral-400 uppercase tracking-widest cursor-pointer"
                id="run-latency-ping-btn"
              >
                Start Ping Test
              </button>
            </div>

            <div className="space-y-3">
              {pingData.map((ping, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-xs">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">{ping.name}</span>
                  </div>
                  <div>
                    {ping.status === "idle" && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Idle</span>
                    )}
                    {ping.status === "testing" && (
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Pinging
                      </span>
                    )}
                    {ping.status === "done" && (
                      <span className="font-mono font-extrabold text-[13px] text-emerald-600 dark:text-emerald-400">
                        {ping.time} ms
                      </span>
                    )}
                    {ping.status === "error" && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser System Footprint Environment details */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
              <Laptop className="h-5 w-5 text-emerald-500" />
              <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white uppercase tracking-wider">
                System Environment Diagnostics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-center space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Operating System</span>
                <span className="text-gray-900 dark:text-white font-extrabold block">{systemDetails.os}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-center space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Detected Browser</span>
                <span className="text-gray-900 dark:text-white font-extrabold block">{systemDetails.browser}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-center space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Display Resolution</span>
                <span className="text-gray-900 dark:text-white font-extrabold block font-mono">{systemDetails.screen}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-center space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block">Language Preference</span>
                <span className="text-gray-900 dark:text-white font-extrabold block font-mono">{systemDetails.language}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 text-xs">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold block mb-1">Full User Agent Footprint</span>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed font-mono font-medium truncate select-all" title={systemDetails.useragent}>
                {systemDetails.useragent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
