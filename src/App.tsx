import React, { useState, useEffect } from "react";
import { Pages } from "./components/Pages";
import { Adsterra160x600 } from "./components/Adsterra160x600";
import { Adsterra320x50 } from "./components/Adsterra320x50";
import { AdsterraNative } from "./components/AdsterraNative";
import { QrGenerator } from "./components/QrGenerator";
import { ImageCompressor } from "./components/ImageCompressor";
import { IpFinder } from "./components/IpFinder";
import { UniversalConverter } from "./components/UniversalConverter";
import { 
  Youtube, 
  Search, 
  Download, 
  Copy, 
  Moon, 
  Sun, 
  ExternalLink, 
  Settings, 
  Key, 
  Check, 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  Video, 
  Users, 
  Award, 
  Globe, 
  Clock, 
  Heart, 
  MessageSquare, 
  Grid, 
  FileText, 
  Info, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  QrCode, 
  Sliders, 
  FileCode, 
  Palette, 
  RefreshCw,
  Eye,
  Phone,
  Calculator
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoData, ChannelData, FreeTool, FAQItem } from "./types";
import { generateSocialBladeStats } from "./utils";
import { DollarSign, Tv } from "lucide-react";

// Format numbers into clean representations like 1.5M or 250K
function formatCount(count: number): string {
  if (count >= 1_000_000_000) {
    return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Format UTC time nicely
function formatUTCTime(dateString: string): string {
  const date = new Date(dateString);
  try {
    const formatted = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
      hour12: true
    });
    return `${formatted} UTC`;
  } catch (e) {
    return date.toUTCString();
  }
}

// Format local time nicely
function formatLocalTime(dateString: string): string {
  const date = new Date(dateString);
  try {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch (e) {
    return date.toLocaleString();
  }
}

interface SvgAreaChartProps {
  data: { day: string; value: number }[];
  color: string;
  title: string;
  yFormatter?: (val: number) => string;
}

const SvgAreaChart: React.FC<SvgAreaChartProps> = ({ data, color, title, yFormatter }) => {
  const formatter = yFormatter || formatCount;
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal;

  const width = 500;
  const height = 150;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, day: d.day, value: d.value };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : "";

  const strokeColor = color === "emerald" ? "#10b981" : "#3b82f6";
  const fillColor = color === "emerald" ? "url(#grad-emerald)" : "url(#grad-blue)";

  const [hoveredPoint, setHoveredPoint] = useState<typeof points[0] | null>(null);

  return (
    <div className="bg-slate-50 dark:bg-neutral-950/60 border border-slate-200/60 dark:border-neutral-800/60 p-4 rounded-xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {title}
        </h4>
        {hoveredPoint && (
          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
            Day {hoveredPoint.day}: +{formatter(hoveredPoint.value)}
          </span>
        )}
      </div>
      <div className="relative w-full h-[120px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            const val = maxVal - ratio * range;
            return (
              <g key={i}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="currentColor" 
                  className="text-gray-200 dark:text-neutral-800/50" 
                  strokeWidth="0.5" 
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 5} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="text-[8px] font-mono font-medium fill-gray-400 dark:fill-neutral-600"
                >
                  {formatter(val)}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {areaD && <path d={areaD} fill={fillColor} />}

          {/* Curve stroke */}
          {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

          {/* Point hot-spots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === p ? "5" : "3"}
                fill={strokeColor}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Network tools data
const NETWORK_TOOLS: FreeTool[] = [
  {
    name: "EZ QR Code Generator",
    description: "Generate beautiful custom QR codes with custom logos, branding, and colors instantly.",
    icon: "QrCode",
    url: "https://qr.eztoolbox.xyz",
    colorClass: "bg-emerald-500"
  },
  {
    name: "EZ PDF Toolkit",
    description: "Merge, split, compress, unlock, and convert PDF documents in your browser securely.",
    icon: "FileText",
    url: "https://pdf.eztoolbox.xyz",
    colorClass: "bg-blue-500",
    comingSoon: true
  },
  {
    name: "EZ Image Compressor",
    description: "Optimize and compress PNG, JPG, WebP, and SVG images with perfect quality retention.",
    icon: "Sliders",
    url: "https://compress.eztoolbox.xyz",
    colorClass: "bg-purple-500"
  },
  {
    name: "EZ Color Palette Generator",
    description: "Generate and curate aesthetic color schemes, custom shades, and CSS color tokens.",
    icon: "Palette",
    url: "https://color.eztoolbox.xyz",
    colorClass: "bg-amber-500",
    comingSoon: true
  },
  {
    name: "EZ IP & Location Finder",
    description: "Instantly check your public IP address, detect country location, trace map, and test ping latency.",
    icon: "Globe",
    url: "https://ip.eztoolbox.xyz",
    colorClass: "bg-indigo-500"
  },
  {
    name: "EZ Universal Converter & Calculator",
    description: "Convert currency with live Google rates, calculate standard operations, and convert weight, length, & distance units instantly.",
    icon: "Calculator",
    url: "https://converter.eztoolbox.xyz",
    colorClass: "bg-blue-600"
  }
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I find hidden tags and keywords of a YouTube video?",
    answer: "Simply paste any YouTube video URL into our Video Analyzer. The tool automatically communicates with the YouTube API to extract metadata, including all hidden tags and SEO keywords. You can click individual tags to copy them, or copy the entire list with a single click."
  },
  {
    question: "How can I download YouTube thumbnails in maximum resolution?",
    answer: "Our advanced Thumbnail Downloader checks for the absolute highest resolution available (Maxres 1080p, High 480p, and Medium 360p) on YouTube's content servers. We route these files through a proxy to force a direct local file download onto your computer or mobile device with a custom formatted filename."
  },
  {
    question: "What channel metrics are shown in the Channel Analytics section?",
    answer: "Our Social-Blade style dashboard fetches channel summaries from the official YouTube API. You'll instantly see total subscribers, lifetime video views, total videos uploaded, country registration, establishing creation date, and high-resolution channel banners and avatars."
  },
  {
    question: "Is this YouTube downloader and analyzer free to use?",
    answer: "Yes, it is completely free! EZ Toolbox utilities run directly in your browser without tracking your personal data, video queries, or search queries. No sign-ups or subscription fees are ever required."
  },
  {
    question: "How do I get a YouTube Data API v3 Key?",
    answer: "You can easily acquire a personal YouTube API Key from the Google Cloud Console for free. Simply create a project, search for 'YouTube Data API v3' in the API Library, enable it, and go to the 'Credentials' tab to create an API Key. Paste it into our dashboard settings, and it will be stored securely in your local browser cache."
  }
];

const QR_FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I add an official brand logo to my custom QR Code?",
    answer: "With EZ Toolbox, adding a logo is simple! Scroll to the 'Customization' section under 'Step 2', upload your own PNG/JPG file, or select one of our premium preset icons (like YouTube, WhatsApp, Facebook, or Spotify) with a single click. We generate high-resolution custom canvas frames with a high error correction rate (Level H) to ensure the code remains perfectly scannable even with a custom image in the center."
  },
  {
    question: "Are these QR Codes static or dynamic?",
    answer: "EZ Toolbox generates highly secure, premium static QR Codes. Static QR Codes embed the raw text, Wi-Fi configuration, or URL link directly into the matrix itself. Since there is no redirect server in between, these codes are 100% permanent, never expire, contain no hidden tracking redirects, and are completely free forever."
  },
  {
    question: "Why did my scanned WhatsApp QR Code display incorrect numbers?",
    answer: "Normally, if you input numbers with spaces, dashes, or a leading plus sign (+), some scanners might misinterpret the link. To resolve this, EZ Toolbox automatically cleanses your phone input, stripping non-digit symbols and correctly compiling a clean, standard international 'wa.me' format (e.g., wa.me/923017480809). This ensures 100% scanning trust and instant contact connection across all devices."
  },
  {
    question: "How does the webcam QR scanner work and is it safe?",
    answer: "Our QR Scanner uses standard HTML5 media APIs to process video frames locally in your browser. We integrate jsQR (a light, high-speed parsing library) to decode codes on-the-fly. No video feeds or scanned contents are ever sent to any remote server—it is 100% client-side, making it completely private and secure."
  },
  {
    question: "Can I download my customized QR Code in vector SVG format?",
    answer: "Yes! Once you are happy with your custom QR colors, size, margins, and layouts, you can download it as a standard high-resolution PNG image, or click the 'SVG' button to download a pristine vector file. Vector SVGs are perfect for print banners, brochures, flyers, and business cards because they scale infinitely without losing quality."
  }
];

const COMPRESS_FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does the EZ Image Compressor work and is it safe?",
    answer: "Our image compressor runs 100% locally in your browser using high-performance Canvas APIs. No files are uploaded to remote servers, ensuring 100% data security, privacy, and speed."
  },
  {
    question: "Which image formats are supported?",
    answer: "We support all major web formats, including PNG, JPEG/JPG, WebP, and SVG images. You can compress multiple files in bulk and convert them between formats."
  },
  {
    question: "What is the difference between lossy and lossless compression?",
    answer: "Lossy compression reduces file size by discarding minor visual details, yielding tiny file sizes (perfect for web optimization). Lossless compression retains 100% original pixel data but results in larger file sizes. Our tool lets you adjust the compression quality to find the perfect balance."
  },
  {
    question: "Can I use compressed images for Google PageSpeed optimization?",
    answer: "Absolutely! Compressing images reduces page weight, improving your Google PageSpeed Insights core web vitals (LCP/FCP), leading to significantly higher SEO search engine rankings."
  },
  {
    question: "Is there a file size limit or daily quota?",
    answer: "No! Since all compression is executed client-side on your device, there are zero size limits, zero queues, and zero daily compression limits. It is completely free forever."
  }
];

const IP_FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does the EZ IP & Location Finder detect my public IP address?",
    answer: "Our tool queries highly secure global IP registries via client-side API requests when the page loads. It instantly retrieves your active IPv4 or IPv6 public routing address, matching it against public allocation block databases to identify your estimated location, ISP provider, and ASN information."
  },
  {
    question: "How accurate is the location pinpointed on the interactive map?",
    answer: "IP geolocation is designed to estimate your location at the country, region, or city level with extremely high accuracy (99% for countries, 85%+ for cities). It does not pinpoint your physical street address or GPS location, thereby safeguarding your exact household privacy while providing necessary geographical data."
  },
  {
    question: "Can I lookup geographic location coordinates for other IP addresses?",
    answer: "Yes! Simply type any valid IPv4 or IPv6 address into the lookup search bar above, and click 'Geolocate IP'. The tool queries public registry registries to instantly retrieve estimated geographic data, ISP networks, and map tracing for that target address."
  },
  {
    question: "What is an Autonomous System Number (ASN) and why is it shown?",
    answer: "An Autonomous System Number (ASN) is a unique identifier allocated to large network operators and Internet Service Providers (ISPs) that participate in the internet's global routing infrastructure. Showing the ASN lets network professionals trace data packet owners and check routing properties."
  },
  {
    question: "How does the connection ping test measure latency?",
    answer: "Our built-in Ping diagnostics tool triggers rapid, real-time client-side requests directly to global cloud server CDNs (like Cloudflare and Google). It calculates the precise round-trip duration in milliseconds (ms), giving you an accurate benchmark of your active ISP connection speed and latency."
  }
];

const CONVERTER_FAQ_ITEMS: FAQItem[] = [
  {
    question: "Where are the currency exchange rates sourced from?",
    answer: "Our Currency Converter fetches real-time, live accurate exchange rates directly from global markets, identical to what is displayed on search engines like Google. Rates update continuously to ensure precise financial conversions."
  },
  {
    question: "Does the converter support offline usage?",
    answer: "Yes! The Calculator and Unit Converter functions (weight, length, distance) are 100% client-side and work completely offline. For currency conversions, the tool caches the last fetched exchange rates so you can continue using it even without an active internet connection."
  },
  {
    question: "What unit conversions are available in this tool?",
    answer: "You can convert between a wide variety of standard scientific and everyday units: Weight/Mass (grams, kilograms, pounds, ounces), Length/Distance (inches, centimeters, meters, kilometers, miles, feet, yards), and Temperature or Volume. All calculations happen instantly as you type."
  },
  {
    question: "How do I view my calculation history in the calculator?",
    answer: "Our modern interactive calculator displays a scrollable history tape above the primary numbers. You can see your previous operations, click to reuse past results, or clear the history tape at any time."
  }
];

// Local YouTube category mapping for client fallback
const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers"
};

// Helper: Extract Video ID on client
function extractVideoId(input: string): string | null {
  const cleaned = input.trim();
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const regex of regexes) {
    const match = cleaned.match(regex);
    if (match) return match[1];
  }
  return null;
}

// Helper: Parse Channel Input on client
function parseChannelInput(input: string): { type: "id" | "handle" | "query"; value: string } {
  const cleaned = input.trim();
  
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(cleaned)) {
    return { type: "id", value: cleaned };
  }

  const idMatch = cleaned.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/);
  if (idMatch) {
    return { type: "id", value: idMatch[1] };
  }

  const handleUrlMatch = cleaned.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/);
  if (handleUrlMatch) {
    return { type: "handle", value: "@" + handleUrlMatch[1] };
  }

  const legacyMatch = cleaned.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9_.-]+)/);
  if (legacyMatch) {
    return { type: "query", value: legacyMatch[1] };
  }

  if (cleaned.startsWith("@")) {
    return { type: "handle", value: cleaned };
  }

  return { type: "query", value: cleaned };
}

// Helper: Parse ISO 8601 Duration on client
function parseISO8601Duration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Direct client fetch fallback for video data (e.g. for Hostinger static deployments)
async function clientFetchVideo(url: string, keyToUse: string): Promise<VideoData> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube Video URL or ID format.");
  }

  const youtubeUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${keyToUse}`;
  const response = await fetch(youtubeUrl);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `YouTube API responded with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found. Please verify the URL or ID.");
  }

  const item = data.items[0];
  const categoryId = item.snippet.categoryId || "";
  const categoryName = YOUTUBE_CATEGORIES[categoryId] || "Entertainment";

  return {
    id: videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    tags: item.snippet.tags || [],
    durationRaw: item.contentDetails.duration,
    durationFormatted: parseISO8601Duration(item.contentDetails.duration),
    viewCount: parseInt(item.statistics.viewCount || "0", 10),
    likeCount: parseInt(item.statistics.likeCount || "0", 10),
    commentCount: parseInt(item.statistics.commentCount || "0", 10),
    category: categoryName,
    thumbnails: {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  };
}

// Direct client fetch fallback for channel analytics (e.g. for Hostinger static deployments)
async function clientFetchChannel(url: string, keyToUse: string): Promise<ChannelData> {
  const parsed = parseChannelInput(url);
  let channelDetails: any = null;

  // 1. Direct ID fetch
  if (parsed.type === "id") {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${parsed.value}&key=${keyToUse}`;
    const res = await fetch(channelUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        channelDetails = data.items[0];
      }
    }
  }

  // 2. Handle fetch
  if (!channelDetails && parsed.type === "handle") {
    const handleVal = parsed.value.startsWith("@") ? parsed.value : `@${parsed.value}`;
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&forHandle=${encodeURIComponent(handleVal)}&key=${keyToUse}`;
    const res = await fetch(channelUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        channelDetails = data.items[0];
      }
    }
  }

  // 3. Search fallback
  if (!channelDetails) {
    const searchQuery = parsed.value;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${keyToUse}`;
    const searchRes = await fetch(searchUrl);
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.items && searchData.items.length > 0) {
        const foundChannelId = searchData.items[0].id.channelId;
        if (foundChannelId) {
          const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${foundChannelId}&key=${keyToUse}`;
          const channelRes = await fetch(channelUrl);
          if (channelRes.ok) {
            const channelData = await channelRes.json();
            if (channelData.items && channelData.items.length > 0) {
              channelDetails = channelData.items[0];
            }
          }
        }
      }
    }
  }

  if (!channelDetails) {
    throw new Error(`No channel found matching "${parsed.value}". Please check your connection or try another handle/name.`);
  }

  const item = channelDetails;
  const subscriberCount = parseInt(item.statistics.subscriberCount || "0", 10);
  const videoCount = parseInt(item.statistics.videoCount || "0", 10);
  const viewCount = parseInt(item.statistics.viewCount || "0", 10);

  // Accurate client-side heuristic for monetization status (over 1000 subs and active views/videos)
  const isMonetized = subscriberCount >= 1000 && viewCount >= 4000;

  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    customUrl: item.snippet.customUrl || `@${item.snippet.title.toLowerCase().replace(/\s+/g, "")}`,
    publishedAt: item.snippet.publishedAt,
    country: item.snippet.country || "Global",
    profileImage: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
    bannerImage: item.brandingSettings?.image?.bannerExternalUrl || "",
    viewCount,
    subscriberCount,
    videoCount,
    hiddenSubscriberCount: item.statistics.hiddenSubscriberCount || false,
    isMonetized
  };
}



export default function App() {
  // Automatic Subdomain & Domain detection
  const [subdomainView, setSubdomainView] = useState<"yt" | "qr" | "compress" | "ip" | "converter">(() => {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes("qr.eztoolbox.xyz") || hostname.includes("qr.")) {
      return "qr";
    }
    if (hostname.includes("compress.eztoolbox.xyz") || hostname.includes("compress.")) {
      return "compress";
    }
    if (hostname.includes("ip.eztoolbox.xyz") || hostname.includes("ip.")) {
      return "ip";
    }
    if (hostname.includes("speed.eztoolbox.xyz") || hostname.includes("speed.") || hostname.includes("converter.")) {
      return "converter";
    }
    return "yt";
  });

  const currentNetworkTools: FreeTool[] = (() => {
    const ytTool: FreeTool = {
      name: "EZ YouTube Analytics Engine",
      description: "Analyze channel subscriber growth, check monetization status, and download high-res thumbnails instantly.",
      icon: "Youtube",
      url: "https://eztoolbox.xyz",
      colorClass: "bg-red-500"
    };
    const qrTool = NETWORK_TOOLS[0];
    const pdfTool = NETWORK_TOOLS[1];
    const compressTool = NETWORK_TOOLS[2];
    const colorTool = NETWORK_TOOLS[3];
    const ipTool = NETWORK_TOOLS[4];
    const speedTool = NETWORK_TOOLS[5];

    if (subdomainView === "yt") {
      return [speedTool, qrTool, compressTool, ipTool, pdfTool];
    } else if (subdomainView === "qr") {
      return [ytTool, speedTool, compressTool, ipTool, pdfTool];
    } else if (subdomainView === "compress") {
      return [ytTool, speedTool, qrTool, ipTool, pdfTool];
    } else if (subdomainView === "ip") {
      return [ytTool, speedTool, qrTool, compressTool, pdfTool];
    } else { // converter
      return [ytTool, qrTool, compressTool, ipTool, pdfTool];
    }
  })();

  const currentFaqItems = subdomainView === "qr" 
    ? QR_FAQ_ITEMS 
    : subdomainView === "compress"
      ? COMPRESS_FAQ_ITEMS
      : subdomainView === "ip"
        ? IP_FAQ_ITEMS
        : subdomainView === "converter"
          ? CONVERTER_FAQ_ITEMS
          : FAQ_ITEMS;

  // Check if running in development sandbox environment (e.g. AI Studio preview)
  const isDevelopment = (() => {
    const hostname = window.location.hostname.toLowerCase();
    return (
      hostname === "localhost" ||
      hostname.includes("127.0.0.1") ||
      hostname.includes("ais-dev-") ||
      hostname.includes("ais-pre-") ||
      hostname.includes(".run.app")
    );
  })();

  const [activeTab, setActiveTab] = useState<"video" | "channel">("video");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [channelUrlInput, setChannelUrlInput] = useState("");
  const [currentPage, setCurrentPageInternal] = useState<"home" | "about" | "contact" | "privacy" | "terms" | "articles">(() => {
    const path = window.location.pathname;
    if (path === "/about") return "about";
    if (path === "/contact") return "contact";
    if (path === "/privacy") return "privacy";
    if (path === "/terms") return "terms";
    if (path.startsWith("/articles")) return "articles";
    return "home";
  });

  const setCurrentPage = (page: "home" | "about" | "contact" | "privacy" | "terms" | "articles") => {
    let path = "/";
    if (page !== "home") {
      path = `/${page}`;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    setCurrentPageInternal(page);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/about") setCurrentPageInternal("about");
      else if (path === "/contact") setCurrentPageInternal("contact");
      else if (path === "/privacy") setCurrentPageInternal("privacy");
      else if (path === "/terms") setCurrentPageInternal("terms");
      else if (path.startsWith("/articles")) setCurrentPageInternal("articles");
      else setCurrentPageInternal("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Dynamically update document.title for seamless SEO indexing across main and subdomains
  useEffect(() => {
    let suffix = " | EZ Toolbox";
    if (currentPage === "about") suffix = "About Us" + suffix;
    else if (currentPage === "contact") suffix = "Contact Us" + suffix;
    else if (currentPage === "privacy") suffix = "Privacy Policy" + suffix;
    else if (currentPage === "terms") suffix = "Terms & Conditions" + suffix;
    else if (currentPage === "articles") suffix = "SEO Articles & Guides" + suffix;
    else {
      if (subdomainView === "qr") {
        suffix = "EZ Toolbox — Free Custom QR Code Generator & Scanner (With Logos)";
      } else if (subdomainView === "compress") {
        suffix = "EZ Toolbox — Free Bulk Image Compressor (PNG, JPG, WebP, SVG)";
      } else if (subdomainView === "ip") {
        suffix = "EZ Toolbox — What Is My IP & Geolocation Location Finder";
      } else if (subdomainView === "converter") {
        suffix = "EZ Toolbox — Free Live Google Rate Universal Converter & Calculator (VIP)";
      } else {
        suffix = "EZ Toolbox — YouTube Analyzer & Downloader (High-Res Thumbnails)";
      }
    }
    document.title = suffix;
  }, [subdomainView, currentPage]);
  
  // App states
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedChannelDesc, setCopiedChannelDesc] = useState(false);

  // UTC Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Settings states
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("yt_api_key") || "AIzaSyAEUmPIRFmLVR4D4DhnYrpGsdrr9uZG3-I");
  const [hasServerKey, setHasServerKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedTagText, setCopiedTagText] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("yt_dark_mode") === "true");

  // Adsterra Monetization states
  const [adsEnabled, setAdsEnabled] = useState(() => {
    // Check if running in development sandbox environment (e.g. AI Studio preview)
    const hostname = window.location.hostname.toLowerCase();
    const isDev = (
      hostname === "localhost" ||
      hostname.includes("127.0.0.1") ||
      hostname.includes("ais-dev-") ||
      hostname.includes("ais-pre-") ||
      hostname.includes(".run.app")
    );
    if (isDev) return false; // Force disabled in developer preview mode to prevent click blocks & iframe overlays!

    const saved = localStorage.getItem("yt_ads_enabled");
    return saved === null ? true : saved === "true"; // Default to true on first-load for live site visitors!
  });
  const [adsterraBannerKey, setAdsterraBannerKey] = useState(() => {
    return localStorage.getItem("yt_adsterra_banner_key") || "4c9a72ecc1945050df1c685db5ad1f46";
  });
  const [adsterraSocialBarUrl, setAdsterraSocialBarUrl] = useState(() => {
    return localStorage.getItem("yt_adsterra_social_bar_url") || "https://pl30252585.effectivecpmnetwork.com/94/47/9b/94479bdb2acf4104d1a18b7942b19b96.js";
  });

  // Sync the adsterra keys and social bar urls when the subdomainView changes
  useEffect(() => {
    const bannerKeys: Record<"yt" | "qr" | "compress" | "ip" | "converter", string> = {
      yt: "4c9a72ecc1945050df1c685db5ad1f46",
      qr: "3021690b027b63131950c55585b3e871",
      compress: "fec6a1716171a197192b70e3bf7351e1",
      ip: "28fa5b133d1e8c669ee3eeb7efa5667f",
      converter: "33995635c87250fab03e2e29d59bb2f3"
    };

    const socialUrls: Record<"yt" | "qr" | "compress" | "ip" | "converter", string> = {
      yt: "https://pl30252585.effectivecpmnetwork.com/94/47/9b/94479bdb2acf4104d1a18b7942b19b96.js",
      qr: "https://pl30254129.effectivecpmnetwork.com/6c/0b/72/6c0b7269d73d4e59bbca9b6547f1046d.js",
      compress: "https://pl30435866.effectivecpmnetwork.com/8a/11/2f/8a112f3aa228748d641d161bf78f216c.js",
      ip: "https://pl30435876.effectivecpmnetwork.com/c5/d4/25/c5d42549abdfc4c8b71bd0a7b5780260.js",
      converter: "https://pl30435884.effectivecpmnetwork.com/c3/5a/e6/c35ae6798df727b9077069e2f8698b59.js"
    };

    const currentBannerKey = bannerKeys[subdomainView] || bannerKeys.yt;
    const currentSocialUrl = socialUrls[subdomainView] || socialUrls.yt;

    setAdsterraBannerKey(currentBannerKey);
    setAdsterraSocialBarUrl(currentSocialUrl);
  }, [subdomainView]);

  // Dynamically inject/remove Adsterra Social Bar script (Desktop only to prevent blocking mobile header/clicks)
  useEffect(() => {
    const handleSocialBar = () => {
      const isLargeScreen = window.innerWidth >= 1024; // Only load on screen widths of 1024px or above (Desktop)

      const existing = document.getElementById("adsterra-social-bar");
      if (!adsEnabled || !adsterraSocialBarUrl || !isLargeScreen || isDevelopment) {
        if (existing) {
          document.body.removeChild(existing);
        }
        return;
      }

      // If existing script has a different src, remove it first to load the new one
      if (existing) {
        if (existing.getAttribute("src") !== adsterraSocialBarUrl) {
          document.body.removeChild(existing);
        } else {
          return;
        }
      }

      // Inject if it doesn't exist or was just removed due to src change
      const script = document.createElement("script");
      script.src = adsterraSocialBarUrl;
      script.type = "text/javascript";
      script.async = true;
      script.id = "adsterra-social-bar";
      document.body.appendChild(script);
    };

    handleSocialBar();
    window.addEventListener("resize", handleSocialBar);

    return () => {
      window.removeEventListener("resize", handleSocialBar);
      const existing = document.getElementById("adsterra-social-bar");
      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, [adsEnabled, adsterraSocialBarUrl, isDevelopment]);

  // FAQ active indexes
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  // Check server configuration for API Key
  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => {
        setHasServerKey(data.hasServerKey);
      })
      .catch(err => {
        console.warn("Backend configuration endpoint not available. Falling back to built-in client-side API engine.", err);
        // On static hosting like Hostinger, set hasServerKey to true because we have the pre-loaded fallback key active!
        setHasServerKey(true);
      });
  }, []);

  // Sync Dark Mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("yt_dark_mode", String(darkMode));
  }, [darkMode]);

  // Handle API Key save
  const saveApiKey = (key: string) => {
    const cleaned = key.trim();
    setApiKey(cleaned);
    if (cleaned) {
      localStorage.setItem("yt_api_key", cleaned);
      setSuccessMsg("API key saved to browser storage!");
    } else {
      localStorage.removeItem("yt_api_key");
      setSuccessMsg("API key cleared. Utilizing fallback key.");
    }
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Analyze Video API Call with client fallback
  const handleAnalyzeVideo = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || videoUrlInput;
    if (!targetUrl.trim()) {
      setError("Please enter a valid YouTube Video URL or ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);

    const activeKey = apiKey.trim() || "AIzaSyAEUmPIRFmLVR4D4DhnYrpGsdrr9uZG3-I";

    try {
      const urlParam = encodeURIComponent(targetUrl.trim());
      const keyParam = `&key=${encodeURIComponent(activeKey)}`;
      
      const response = await fetch(`/api/youtube/video?url=${urlParam}${keyParam}`);
      
      if (!response.ok) {
        // Fallback to direct client-side fetching if backend is a 404/5xx (e.g. Hostinger static hosting)
        if (response.status === 404 || response.status === 502 || response.status === 504) {
          console.log("Local server returned 404/5xx; falling back to client-side fetch...");
          const clientData = await clientFetchVideo(targetUrl.trim(), activeKey);
          setVideoData(clientData);
          return;
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to fetch video statistics.");
      }

      const data = await response.json();
      setVideoData(data);
    } catch (err: any) {
      console.warn("Express proxy failed. Attempting client-side fetch fallback...", err);
      try {
        const clientData = await clientFetchVideo(targetUrl.trim(), activeKey);
        setVideoData(clientData);
      } catch (fallbackErr: any) {
        console.error("Client fallback fetch failed:", fallbackErr);
        setError(fallbackErr.message || "An unexpected error occurred while analyzing the video.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load default video and channel on mount to showcase analytics and thumbnails nicely
  useEffect(() => {
    handleAnalyzeVideo(undefined, "https://www.youtube.com/watch?v=dIl_x9GNmG8");
    handleAnalyzeChannel(undefined, "https://www.youtube.com/@ChroniclesReborn-736");
  }, []);

  // Analyze Channel API Call with client fallback
  const handleAnalyzeChannel = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = customUrl || channelUrlInput;
    if (!targetUrl.trim()) {
      setError("Please enter a YouTube Channel handle, name, URL, or Channel ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setChannelData(null);

    const activeKey = apiKey.trim() || "AIzaSyAEUmPIRFmLVR4D4DhnYrpGsdrr9uZG3-I";

    try {
      const urlParam = encodeURIComponent(targetUrl.trim());
      const keyParam = `&key=${encodeURIComponent(activeKey)}`;

      const response = await fetch(`/api/youtube/channel?url=${urlParam}${keyParam}`);
      
      if (!response.ok) {
        // Fallback to direct client-side fetching if backend is 404/5xx (e.g. Hostinger static hosting)
        if (response.status === 404 || response.status === 502 || response.status === 504) {
          console.log("Local server returned 404/5xx; falling back to client-side fetch...");
          const clientData = await clientFetchChannel(targetUrl.trim(), activeKey);
          setChannelData(clientData);
          return;
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to fetch channel analytics.");
      }

      const data = await response.json();
      setChannelData(data);
    } catch (err: any) {
      console.warn("Express proxy failed. Attempting client-side fetch fallback...", err);
      try {
        const clientData = await clientFetchChannel(targetUrl.trim(), activeKey);
        setChannelData(clientData);
      } catch (fallbackErr: any) {
        console.error("Client fallback fetch failed:", fallbackErr);
        setError(fallbackErr.message || "An unexpected error occurred while analyzing the channel.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Copy all tags helper
  const copyAllTags = () => {
    if (!videoData || !videoData.tags || videoData.tags.length === 0) return;
    const tagString = videoData.tags.join(", ");
    navigator.clipboard.writeText(tagString);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  // Copy single tag helper
  const copySingleTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTagText(tag);
    setTimeout(() => setCopiedTagText(null), 1500);
  };

  // Toggle FAQ accordion
  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Download thumbnail helper (handles static host fallback gracefully)
  const handleDownloadThumbnail = async (url: string, filename: string) => {
    try {
      // First, attempt downloading through local express proxy endpoint if running
      const response = await fetch(`/api/download/thumbnail?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`);
      const contentType = response.headers.get("content-type") || "";
      
      // Ensure the response is successful and is actually an image (prevents downloading index.html on static hosts)
      if (response.ok && contentType.startsWith("image/")) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return;
      } else {
        console.warn("Proxy did not return a valid image. Falling back to direct browser download.");
      }
    } catch (err) {
      console.warn("Proxy download failed, trying direct browser download", err);
    }

    // Direct browser fallback if proxy endpoint fails or returns error (e.g., on Hostinger static deployments)
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (directErr) {
      console.warn("CORS blocked direct client blob download. Opening image in new tab instead.", directErr);
      // Final resilient UX: open high-res image directly in a new tab so they can right-click and save
      window.open(url, "_blank");
    }
  };

  // Helper to render network icons
  const renderIconComponent = (iconName: string, className = "h-6 w-6 text-white") => {
    switch (iconName) {
      case "QrCode": return <QrCode className={className} id="icon-qr" />;
      case "FileText": return <FileText className={className} id="icon-pdf" />;
      case "Sliders": return <Sliders className={className} id="icon-compress" />;
      case "Palette": return <Palette className={className} id="icon-color" />;
      case "RefreshCw": return <RefreshCw className={className} id="icon-convert" />;
      case "Globe": return <Globe className={className} id="icon-globe" />;
      case "Calculator": return <Calculator className={className} id="icon-converter" />;
      case "Youtube": return <Youtube className={className} id="icon-youtube" />;
      case "Video": return <Video className={className} id="icon-tiktok" />;
      default: return <Grid className={className} id="icon-default" />;
    }
  };

  const formattedUTCTimeString = currentTime.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 transition-colors duration-300 dark:bg-neutral-950 dark:text-gray-100 flex flex-col relative" id="app-root">
      
      {/* ⚙️ Developer Preview Switcher - Only visible in development sandbox */}
      {isDevelopment && (
        <div className="w-full bg-emerald-600 text-white py-2 px-4 flex items-center justify-between text-xs font-bold border-b border-emerald-700 shadow-sm relative z-50 animate-fade-in" id="dev-switcher-bar">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>⚙️ AI Studio Developer Sandbox Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-100 hidden lg:inline">Choose Domain Preview:</span>
            <div className="flex bg-emerald-700 p-0.5 rounded-lg border border-emerald-500/30 overflow-x-auto max-w-full">
              <button
                onClick={() => setSubdomainView("yt")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "yt"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                eztoolbox (YT Engine)
              </button>
              <button
                onClick={() => setSubdomainView("qr")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "qr"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                qr (QR Gen)
              </button>
              <button
                onClick={() => setSubdomainView("compress")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "compress"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                compress (Image Comp)
              </button>
              <button
                onClick={() => setSubdomainView("ip")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "ip"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                ip (IP Geolocation)
              </button>
              <button
                onClick={() => setSubdomainView("converter")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "converter"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                converter (Universal Converter)
              </button>
              <button
                onClick={() => setSubdomainView("tiktok")}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer shrink-0 ${
                  subdomainView === "tiktok"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                tiktok (TikTok Downloader)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Website Background Layer (Full-screen decorative layout) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" id="global-website-background">
        {/* Full screen micro-dot matrix pattern - elegant premium dots in green, red, and grey with wider 80px spacing */}
        <div className="absolute inset-0 premium-multi-dots opacity-90" />
        
        {/* Left Side: Soft and rich modern mesh gradient glowing orbs */}
        <div className="absolute top-1/12 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.07] dark:bg-emerald-500/[0.05] blur-[120px] -translate-x-1/3" />
        <div className="absolute top-2/3 left-0 w-[600px] h-[600px] rounded-full bg-red-500/[0.06] dark:bg-red-500/[0.04] blur-[140px] -translate-x-1/2" />
        
        {/* Right Side: Soft and rich modern mesh gradient glowing orbs */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-red-500/[0.07] dark:bg-red-500/[0.05] blur-[130px] translate-x-1/3" />
        <div className="absolute top-3/4 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] dark:bg-emerald-500/[0.04] blur-[120px] translate-x-1/2" />
      </div>

      {/* Floating Skyscraper Sidebars - Fixed & Hidden on viewports below 2xl */}
      <div className="hidden 2xl:block fixed left-4 top-[180px] z-30" id="adsterra-skyscraper-left">
        <Adsterra160x600 id="floating-sidebar-left" enabled={adsEnabled} subdomainView={subdomainView} />
      </div>

      <div className="hidden 2xl:block fixed right-4 top-[180px] z-30" id="adsterra-skyscraper-right">
        <Adsterra160x600 id="floating-sidebar-right" enabled={adsEnabled} subdomainView={subdomainView} />
      </div>
      
      {/* ---------------------------------------------------- */}
      {/* HEADER BAR                                           */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90" id="main-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => setCurrentPage("home")} 
            className="flex items-center space-x-3 cursor-pointer select-none active:scale-95 transition-transform shrink-0" 
            id="header-brand-container"
          >
            <div className="bg-emerald-600 dark:bg-emerald-500 p-2 rounded-xl text-white flex items-center justify-center shadow-sm" id="logo-badge">
              {subdomainView === "qr" ? (
                <QrCode className="h-6 w-6" id="brand-qrcode-icon" />
              ) : subdomainView === "compress" ? (
                <Sliders className="h-6 w-6" id="brand-compress-icon" />
              ) : subdomainView === "ip" ? (
                <Globe className="h-6 w-6" id="brand-ip-icon" />
              ) : subdomainView === "converter" ? (
                <Calculator className="h-6 w-6" id="brand-converter-icon" />
              ) : subdomainView === "tiktok" ? (
                <Video className="h-6 w-6" id="brand-tiktok-icon" />
              ) : (
                <Youtube className="h-6 w-6" id="brand-youtube-icon" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white" id="brand-logo-text">
                  EZ Toolbox
                </span>
                <span className="text-sm px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 font-mono rounded font-medium" id="brand-utility-logo">
                  {subdomainView === "qr" ? "🎯" : subdomainView === "compress" ? "⚡" : subdomainView === "ip" ? "🌐" : subdomainView === "converter" ? "🧮" : subdomainView === "tiktok" ? "🎥" : "🛠️"}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase" id="brand-subtext">
                {subdomainView === "qr" ? "QR Generator & Scanner" : subdomainView === "compress" ? "Bulk Image Compressor" : subdomainView === "ip" ? "What is My IP & Location" : subdomainView === "converter" ? "Universal Converter & Calc" : subdomainView === "tiktok" ? "TikTok Pro Downloader" : "YT Analytics Engine"}
              </p>
            </div>
          </div>
 
          {/* Desktop Navigation Links (Green & White Contrast Button-style) */}
          <nav className="hidden lg:flex items-center space-x-1.5 px-4" id="desktop-header-nav">
            {[
              { id: "home", label: "Dashboard" },
              { id: "about", label: "About Us" },
              { id: "articles", label: "SEO Articles" },
              { id: "contact", label: "Contact Us" },
              { id: "privacy", label: "Privacy" },
              { id: "terms", label: "Terms" }
            ].map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm border border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-neutral-800 border border-transparent"
                  }`}
                  id={`nav-btn-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3 shrink-0" id="header-right-meta">
            {/* Live Ticking UTC Clock */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-neutral-950 border border-slate-150 dark:border-neutral-800 px-3 py-1.5 rounded-xl font-mono text-[10px] md:text-xs font-bold text-gray-700 dark:text-gray-300 shadow-xs shrink-0" id="live-utc-timer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-gray-400 dark:text-neutral-500 font-sans font-bold uppercase tracking-wider text-[9px]">UTC</span>
              <span className="tabular-nums">{formattedUTCTimeString}</span>
            </div>

            <div className="flex items-center space-x-2 shrink-0" id="header-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
              title="Toggle Theme"
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation Scroller */}
        <div className="md:hidden border-t border-gray-100 dark:border-neutral-800/60 bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-md py-2 px-4 overflow-x-auto flex items-center space-x-1.5 scrollbar-none" id="mobile-sub-nav">
          {[
            { id: "home", label: "Dashboard" },
            { id: "about", label: "About Us" },
            { id: "articles", label: "SEO Articles" },
            { id: "contact", label: "Contact Us" },
            { id: "privacy", label: "Privacy" },
            { id: "terms", label: "Terms" }
          ].map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs border border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                    : "bg-white text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-200 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:text-emerald-400 dark:hover:bg-neutral-800 dark:border-neutral-800"
                }`}
                id={`mobile-nav-btn-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* SETTINGS DRAWER / PANELS                            */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 overflow-hidden"
            id="settings-drawer"
          >
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-4 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="h-4 w-4 text-emerald-500" /> YouTube Data API Credentials
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Configure your YouTube Data API v3 Key. Your key remains client-side in browser local storage.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono font-medium px-2 py-1 rounded-full flex items-center gap-1.5 ${hasServerKey ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}`} id="api-status">
                    <span className={`h-1.5 w-1.5 rounded-full ${hasServerKey ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {hasServerKey ? "Server Key Active" : "No Server Key Available"}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Custom YouTube API v3 Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={hasServerKey ? "Using active server API key (optional to override)" : "Enter your AI / YouTube API Key..."}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 text-sm rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-900 dark:text-white"
                      id="api-key-input"
                    />
                    <button
                      onClick={() => saveApiKey(apiKey)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-1"
                      id="save-key-btn"
                    >
                      <Check className="h-4 w-4" /> Save
                    </button>
                  </div>
                  {successMsg && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1" id="success-message">
                      <Check className="h-3.5 w-3.5" /> {successMsg}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-neutral-950 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 text-xs">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-blue-500" /> How to get a free YouTube API Key?
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline dark:text-emerald-400">Google Cloud Console</a>.</li>
                    <li>Create a free project & enable the <strong>YouTube Data API v3</strong>.</li>
                    <li>Generate an API Key under the <strong>Credentials</strong> menu.</li>
                    <li>Copy and paste your credentials into the input field above!</li>
                  </ol>
                </div>
              </div>

              {/* Adsterra Monetization Controls */}
              <div className="border-t border-gray-100 dark:border-neutral-800/80 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <Tv className="h-4.5 w-4.5 text-emerald-500" />
                  <h4 className="font-display font-extrabold text-sm text-gray-950 dark:text-white uppercase tracking-tight">
                    Adsterra Monetization Engine
                  </h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                  Configure real-time ad placements for your site. Pause ads or customize Adsterra script keys dynamically. All settings remain saved in local storage.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-neutral-950 p-4 rounded-xl border border-slate-200/40 dark:border-neutral-800/60">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                      Monetization Status
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newVal = !adsEnabled;
                        setAdsEnabled(newVal);
                        localStorage.setItem("yt_ads_enabled", String(newVal));
                        setSuccessMsg(`Ad placements successfully ${newVal ? "activated" : "paused"}!`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        adsEnabled
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400"
                          : "bg-white border-slate-300 text-gray-500 hover:text-gray-700 dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-400"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${adsEnabled ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                      {adsEnabled ? "Ads Displaying" : "Ads Paused"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                      728x90 Banner Tag ID (Key)
                    </label>
                    <input
                      type="text"
                      value={adsterraBannerKey}
                      onChange={(e) => {
                        setAdsterraBannerKey(e.target.value);
                        localStorage.setItem("yt_adsterra_banner_key", e.target.value);
                      }}
                      placeholder="e.g. 7e08b74965e5580393a5461cede22083"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                      Social Bar Script URL
                    </label>
                    <input
                      type="text"
                      value={adsterraSocialBarUrl}
                      onChange={(e) => {
                        setAdsterraSocialBarUrl(e.target.value);
                        localStorage.setItem("yt_adsterra_social_bar_url", e.target.value);
                      }}
                      placeholder="e.g. https://pl30252585.effectivecpmnetwork.com/94/47/9b/94479bdb2acf4104d1a18b7942b19b96.js"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-xs rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* API KEY WARNING BANNER                               */}
      {/* ---------------------------------------------------- */}
      {!hasServerKey && !apiKey && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-400 py-3 px-4 relative z-10" id="api-warning-banner">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs font-medium">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              YouTube Data API v3 key is required. Without it, search analytics will fail. Please add a key.
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5"
              id="warn-set-key-btn"
            >
              <Key className="h-3 w-3" /> Set API Key
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTAINER                                       */}
      {/* ---------------------------------------------------- */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 relative z-10" id="main-content">
        {currentPage === "home" ? (
          <>
            {subdomainView === "qr" ? (
              <QrGenerator adsEnabled={adsEnabled} />
            ) : subdomainView === "compress" ? (
              <ImageCompressor adsEnabled={adsEnabled} />
            ) : subdomainView === "ip" ? (
              <IpFinder adsEnabled={adsEnabled} />
            ) : subdomainView === "converter" ? (
              <UniversalConverter adsEnabled={adsEnabled} />
            ) : (
              <>
        
        {/* Title Display Area */}
        <div className="text-center mb-8" id="hero-title-section">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold mb-3 border border-emerald-100 dark:border-emerald-900/30 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Complete YT SEO Toolkit
          </motion.div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-gray-950 dark:text-white tracking-tight leading-tight" id="main-heading-title">
            All-in-One <span className="text-red-700 dark:text-red-500 drop-shadow-[0_2px_12px_rgba(185,28,28,0.15)]">YouTube Analyzer</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto font-medium">
            Analyze, audit, and extract metadata from YouTube videos and channels instantly. Download 1080p high-resolution thumbnails.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB CONTROLS                                         */}
        {/* ---------------------------------------------------- */}
        <div className="flex justify-center mb-6" id="tab-controls-container">
          <div className="flex gap-1 bg-slate-100 dark:bg-neutral-900 p-1 rounded-full text-xs font-semibold border border-slate-200/50 dark:border-neutral-800 shadow-inner" id="tabs">
            <button
              onClick={() => {
                setActiveTab("video");
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${activeTab === "video" ? "bg-white text-emerald-600 shadow-sm dark:bg-neutral-800 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"}`}
              id="tab-video"
            >
              <Video className="h-3.5 w-3.5" /> Video Analyzer
            </button>
            <button
              onClick={() => {
                setActiveTab("channel");
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${activeTab === "channel" ? "bg-white text-emerald-600 shadow-sm dark:bg-neutral-800 dark:text-emerald-400" : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"}`}
              id="tab-channel"
            >
              <Users className="h-3.5 w-3.5" /> Channel Analytics
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* INPUT FORM SECTION                                   */}
        {/* ---------------------------------------------------- */}
        <div className="max-w-2xl mx-auto mb-8" id="input-search-panel">
          <form 
            onSubmit={
              activeTab === "video" 
                ? handleAnalyzeVideo 
                : handleAnalyzeChannel
            } 
            className="flex gap-2 p-1.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl emerald-glow" 
            id="search-form"
          >
            <div className="pl-3 flex items-center text-gray-400 dark:text-neutral-500 pointer-events-none" id="input-decorator-icon">
              {activeTab === "video" ? (
                <Youtube className="h-5 w-5 text-red-600 dark:text-red-500 fill-red-600 dark:fill-red-500" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
            <input
              type="text"
              value={
                activeTab === "video" 
                  ? videoUrlInput 
                  : channelUrlInput
              }
              onChange={(e) => {
                if (activeTab === "video") setVideoUrlInput(e.target.value);
                else setChannelUrlInput(e.target.value);
              }}
              placeholder={
                activeTab === "video" 
                  ? "Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=dIl_x9GNmG8)..." 
                  : "Paste YouTube Channel URL, handle, or name (e.g., @mrbeast)..."
              }
              className="flex-grow bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-medium px-2 py-2"
              id="search-input-box"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              id="search-submit-btn"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" id="btn-spinner" />
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>
                    {activeTab === "video" 
                      ? "Analyze Video" 
                      : "Analyze Channel"}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs text-gray-500 dark:text-neutral-400" id="search-examples">
            <span className="font-semibold">Try Examples:</span>
            {activeTab === "video" ? (
              <>
                <button 
                  onClick={() => { setVideoUrlInput("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted"
                  type="button"
                >
                  Rick Astley
                </button>
                <span>•</span>
                <button 
                  onClick={() => { setVideoUrlInput("https://www.youtube.com/watch?v=9bZkp7q19f0"); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted"
                  type="button"
                >
                  PSY - Gangnam Style
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setChannelUrlInput("@mrbeast"); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted"
                  type="button"
                >
                  MrBeast
                </button>
                <span>•</span>
                <button 
                  onClick={() => { setChannelUrlInput("https://www.youtube.com/channel/UCbCmjCuTUz7hsVUM-qgYWhA"); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 underline decoration-dotted"
                  type="button"
                >
                  Y Combinator
                </button>
              </>
            )}
          </div>
        </div>

        {/* Responsive Mobile Banner placement - displayed below search card on mobile viewports */}
        <div className="block 2xl:hidden my-6 text-center" id="global-upper-mobile-banner">
          <Adsterra320x50 id="global-upper" enabled={adsEnabled} subdomainView={subdomainView} />
        </div>

        {/* ---------------------------------------------------- */}
        {/* STATUS ALERTS                                        */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 rounded-2xl flex items-start gap-3"
              id="error-alert"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <span className="font-semibold">Analysis Failed:</span> {error}
                {error.includes("API_KEY_REQUIRED") && (
                  <button 
                    onClick={() => setShowSettings(true)} 
                    className="block font-semibold underline text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mt-1.5"
                    id="fix-api-key-link"
                  >
                    Click here to enter your API Key to fix this
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* LOADING SKELETON                                     */}
        {/* ---------------------------------------------------- */}
        {loading && (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16" id="loading-skeleton">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-full border-4 border-red-100 border-t-red-600 dark:border-neutral-800 dark:border-t-red-500 animate-spin" />
              <Youtube className="h-6 w-6 text-red-600 dark:text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
              Communicating with YouTube Data API servers...
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
              Extracting counts, channel metrics, and tags
            </p>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 1 CONTENT: VIDEO ANALYZER VIEW                  */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {activeTab === "video" && videoData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
              id="video-analyzer-results"
            >
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left side: Video info & Tags */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Title and metadata overview */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-wider">
                        {videoData.category}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="font-display font-extrabold text-lg md:text-xl text-gray-900 dark:text-white tracking-tight leading-snug" id="video-title">
                        {videoData.title}
                      </h2>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(videoData.title);
                          setCopiedTitle(true);
                          setTimeout(() => setCopiedTitle(false), 2000);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 shrink-0 flex items-center justify-center border border-slate-100 dark:border-neutral-700 cursor-pointer"
                        title="Copy Video Title"
                      >
                        {copiedTitle ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-neutral-800/60 pt-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-950 dark:text-gray-100">{videoData.channelTitle}</span>
                        </div>
                        <span className="text-gray-300 dark:text-neutral-700">•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>Published: {formatDate(videoData.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-neutral-950 p-2.5 rounded-xl border border-slate-100 dark:border-neutral-800/50 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span><strong>Local Time:</strong> {formatLocalTime(videoData.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span><strong>UTC Time:</strong> {formatUTCTime(videoData.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="video-stats-grid">
                    {/* Views Card */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm text-center">
                      <div className="mx-auto h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                        <Eye className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Views</p>
                      <p className="text-lg font-display font-bold text-gray-900 dark:text-white mt-0.5">
                        {formatCount(videoData.viewCount)}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{videoData.viewCount.toLocaleString()}</p>
                    </div>

                    {/* Likes Card */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm text-center">
                      <div className="mx-auto h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
                        <Heart className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Likes</p>
                      <p className="text-lg font-display font-bold text-gray-900 dark:text-white mt-0.5">
                        {formatCount(videoData.likeCount)}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{videoData.likeCount.toLocaleString()}</p>
                    </div>

                    {/* Comments Card */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm text-center">
                      <div className="mx-auto h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Comments</p>
                      <p className="text-lg font-display font-bold text-gray-900 dark:text-white mt-0.5">
                        {formatCount(videoData.commentCount)}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{videoData.commentCount.toLocaleString()}</p>
                    </div>

                    {/* Engagement Card */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm text-center">
                      <div className="mx-auto h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Engagement</p>
                      <p className="text-lg font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {(videoData.viewCount > 0 ? (((videoData.likeCount + videoData.commentCount) / videoData.viewCount) * 100) : 0).toFixed(2)}%
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">Likes + Comments</p>
                    </div>
                  </div>

                  {/* Video Description Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        Video Description
                      </h3>
                      <div className="flex items-center gap-2">
                        {videoData.description && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(videoData.description);
                              setCopiedDescription(true);
                              setTimeout(() => setCopiedDescription(false), 2000);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 text-[10px] font-bold transition-all duration-200 flex items-center gap-1 border border-slate-100 dark:border-neutral-700 cursor-pointer"
                            title="Copy Description"
                          >
                            {copiedDescription ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy
                              </>
                            )}
                          </button>
                        )}
                        {videoData.description && videoData.description.length > 250 && (
                          <button
                            onClick={() => setShowFullDesc(!showFullDesc)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {showFullDesc ? (
                              <>
                                Show Less <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {!videoData.description ? (
                      <p className="text-xs text-gray-400 dark:text-neutral-500 italic">No description provided for this video.</p>
                    ) : (
                      <div className="relative">
                        <div 
                          className={`text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-wrap overflow-hidden transition-all duration-300 ${
                            showFullDesc ? "max-h-[600px] overflow-y-auto pr-1" : "max-h-24"
                          }`}
                          id="video-desc-content"
                        >
                          {videoData.description}
                        </div>
                        {!showFullDesc && videoData.description.length > 250 && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hidden Tags Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
                          Video Tags / Meta-Keywords
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          These keywords are hidden from normal users but help with YouTube SEO.
                        </p>
                      </div>
                      {videoData.tags.length > 0 && (
                        <button
                          onClick={copyAllTags}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${copiedTags ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/20"}`}
                          id="copy-all-tags-btn"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedTags ? "Copied All!" : "Copy All Tags"}
                        </button>
                      )}
                    </div>

                    {videoData.tags.length === 0 ? (
                      <div className="bg-gray-50 dark:bg-neutral-950 rounded-xl p-5 text-center text-xs text-gray-500 dark:text-gray-400 font-medium border border-dashed border-slate-200 dark:border-neutral-800">
                        No hidden tags/keywords found in this video.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-hide" id="tags-scroller">
                        {videoData.tags.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => copySingleTag(tag)}
                            className="group relative px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-gray-700 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:text-emerald-400 rounded-lg text-xs font-semibold transition-all border border-slate-200/50 dark:border-neutral-700 flex items-center gap-1.5"
                            title="Click to copy tag"
                          >
                            <span>{tag}</span>
                            <Copy className="h-2.5 w-2.5 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                            {copiedTagText === tag && (
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-lg whitespace-nowrap">
                                Copied!
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Thumbnail Downloader Engine */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-5">
                    <div>
                      <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
                        Thumbnail Downloader
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Extract and force download YouTube thumbnail previews.
                      </p>
                    </div>

                    {/* Preview Screen */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-50 border border-slate-200 dark:bg-neutral-950 dark:border-neutral-800 shadow-inner group">
                      <img
                        src={videoData.thumbnails.maxres || videoData.thumbnails.high}
                        alt="Video Thumbnail Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 text-emerald-400" />
                        {videoData.durationFormatted}
                      </div>
                    </div>

                    {/* Resolution Downloads Grid */}
                    <div className="space-y-2" id="downloads-container">
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Available Resolutions
                      </h4>

                      {/* Maxres */}
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 dark:bg-neutral-950 dark:hover:bg-neutral-900/40 rounded-xl border border-slate-200/60 dark:border-neutral-800 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Maximum Resolution (1080p / 720p)</p>
                          <p className="text-[10px] text-gray-400 font-medium">Ideal for high-quality banners and prints</p>
                        </div>
                        <button
                          onClick={() => handleDownloadThumbnail(videoData.thumbnails.maxres, `EZ_YT_MAX_${videoData.id}.jpg`)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          id="dl-maxres"
                        >
                          <Download className="h-3 w-3" /> Download
                        </button>
                      </div>

                      {/* High */}
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 dark:bg-neutral-950 dark:hover:bg-neutral-900/40 rounded-xl border border-slate-200/60 dark:border-neutral-800 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">High Resolution (HQ 480p)</p>
                          <p className="text-[10px] text-gray-400 font-medium">Standard clear quality thumbnail</p>
                        </div>
                        <button
                          onClick={() => handleDownloadThumbnail(videoData.thumbnails.high, `EZ_YT_HIGH_${videoData.id}.jpg`)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-300 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                          id="dl-hq"
                        >
                          <Download className="h-3 w-3" /> Download
                        </button>
                      </div>

                      {/* Medium */}
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 dark:bg-neutral-950 dark:hover:bg-neutral-900/40 rounded-xl border border-slate-200/60 dark:border-neutral-800 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Medium Quality (MQ 360p)</p>
                          <p className="text-[10px] text-gray-400 font-medium">Lightweight preview size</p>
                        </div>
                        <button
                          onClick={() => handleDownloadThumbnail(videoData.thumbnails.medium, `EZ_YT_MED_${videoData.id}.jpg`)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-gray-300 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                          id="dl-mq"
                        >
                          <Download className="h-3 w-3" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* TAB 2 CONTENT: CHANNEL ANALYTICS VIEW               */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {activeTab === "channel" && channelData && !loading && (() => {
            const stats = generateSocialBladeStats(
              channelData.id,
              channelData.subscriberCount,
              channelData.viewCount,
              channelData.videoCount,
              channelData.country || "Global"
            );

            const totalSubs14Days = stats.dailyMetrics.reduce((sum, d) => sum + d.subscribersGained, 0);
            const totalViews14Days = stats.dailyMetrics.reduce((sum, d) => sum + d.viewsGained, 0);
            const totalVideos14Days = stats.dailyMetrics.reduce((sum, d) => sum + d.videosGained, 0);
            const totalMinEarnings14Days = stats.dailyMetrics.reduce((sum, d) => sum + d.minEarnings, 0);
            const totalMaxEarnings14Days = stats.dailyMetrics.reduce((sum, d) => sum + d.maxEarnings, 0);

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
                id="channel-analytics-results"
              >
                {/* Header Box: Banner & Profile */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm" id="channel-banner-card">
                  {/* Banner Banner */}
                  {channelData.bannerImage ? (
                    <div className="h-36 md:h-44 w-full relative">
                      <img
                        src={channelData.bannerImage}
                        alt="Channel Banner"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-28 md:h-32 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 relative" />
                  )}

                  {/* Profile overlap section */}
                  <div className="px-6 pb-6 relative flex flex-col md:flex-row items-center md:items-end md:space-x-5 -mt-12 md:-mt-10" id="channel-profile-section">
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl border-4 border-white dark:border-neutral-900 overflow-hidden shadow-md shrink-0 bg-white dark:bg-neutral-800">
                      <img
                        src={channelData.profileImage}
                        alt={channelData.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="mt-3 md:mt-0 text-center md:text-left flex-grow space-y-1">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                        <h2 className="font-display font-extrabold text-lg md:text-xl text-gray-900 dark:text-white tracking-tight" id="channel-name-title">
                          {channelData.title}
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md font-semibold border border-emerald-100 dark:border-emerald-900/30">
                          {stats.categoryName} Creator
                        </span>
                        {channelData.isMonetized !== undefined && (
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-extrabold border flex items-center gap-1 shadow-xs ${
                            channelData.isMonetized 
                              ? "bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700" 
                              : "bg-red-500 text-white border-red-600 dark:bg-red-600 dark:border-red-700"
                          }`} id="channel-monetization-badge">
                            {channelData.isMonetized ? (
                              <>
                                <Check className="h-3 w-3 stroke-[3px]" />
                                <span>Monetization ON</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 stroke-[3px]" />
                                <span>Monetization OFF</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        {channelData.customUrl}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-1 gap-x-3 text-xs font-semibold text-gray-500 dark:text-neutral-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-gray-400" />
                          Registered: {channelData.country || "Global"}
                        </span>
                        <span className="text-gray-300 dark:text-neutral-700 hidden md:inline">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          Created: {formatDate(channelData.publishedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Stats Fast Glance */}
                    <div className="hidden lg:flex items-center gap-6 border-l border-slate-200 dark:border-neutral-800 pl-6 shrink-0 h-14">
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Subscribers</span>
                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">{channelData.hiddenSubscriberCount ? "Hidden" : formatCount(channelData.subscriberCount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Views</span>
                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">{formatCount(channelData.viewCount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Videos</span>
                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">{channelData.videoCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grade & Rankings Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" id="channel-rankings-row">
                  {/* Grade Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 relative overflow-hidden group hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block">Total Grade</span>
                    <span className={`text-3xl font-extrabold bg-gradient-to-br ${stats.gradeColor} bg-clip-text text-transparent block tracking-tight`}>
                      {stats.grade}
                    </span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Social Grade</span>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                  </div>

                  {/* SB Rank Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block">SB Rank</span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight">{stats.sbRank}</span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Social Blade Rank</span>
                  </div>

                  {/* Subscribers Rank Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block underline decoration-dotted decoration-gray-300">Subscribers Rank</span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight">{stats.subscribersRank}</span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Subscriber Rank</span>
                  </div>

                  {/* Views Rank Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block underline decoration-dotted decoration-gray-300">Views Rank</span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight">{stats.viewsRank}</span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Video Views Rank</span>
                  </div>

                  {/* Country Rank Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block">
                      {channelData.country && channelData.country !== "Global" ? `${channelData.country} Rank` : "Country Rank"}
                    </span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight">{stats.countryRank}</span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Geographical Rank</span>
                  </div>

                  {/* Category Rank Card */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-4 rounded-xl shadow-xs text-center flex flex-col justify-between h-24 hover:shadow-md transition-all">
                    <span className="text-[9px] text-gray-400 dark:text-neutral-500 font-extrabold uppercase tracking-wider block">{stats.categoryName} Rank</span>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight">{stats.categoryRank}</span>
                    <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-widest">Category Genre Rank</span>
                  </div>
                </div>

                {/* Creator Statistics Overview Row (4 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="creator-statistics-row">
                  {/* Subs 30 Days */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Subscribers (Last 30 Days)</span>
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 block tracking-tight">
                        {stats.subsLast30Days === 0 ? "0" : `+${formatCount(stats.subsLast30Days)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/60">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5 font-mono">
                        <TrendingUp className="h-3 w-3" />
                        +{stats.subsLast30DaysPercent}%
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">Subscriber Growth</span>
                    </div>
                  </div>

                  {/* Views 30 Days */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Views (Last 30 Days)</span>
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 block tracking-tight">
                        {stats.viewsLast30Days === 0 ? "0" : formatCount(stats.viewsLast30Days)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/60">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5 font-mono">
                        <TrendingUp className="h-3 w-3" />
                        +{stats.viewsLast30DaysPercent}%
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">View Volume</span>
                    </div>
                  </div>

                  {/* Monthly Earnings */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Monthly Earnings</span>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 block tracking-tight font-mono">
                        {channelData.isMonetized === false ? "----" : `$${formatCount(stats.monthlyMinEarnings)} - $${formatCount(stats.monthlyMaxEarnings)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/60">
                      <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium">
                        {channelData.isMonetized === false ? "Monetization is disabled for this channel" : "Based on $0.25 - $4.00 CPM estimates"}
                      </span>
                    </div>
                  </div>

                  {/* Yearly Earnings */}
                  <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Yearly Earnings</span>
                        <Tv className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 block tracking-tight font-mono">
                        {channelData.isMonetized === false ? "----" : `$${formatCount(stats.yearlyMinEarnings)} - $${formatCount(stats.yearlyMaxEarnings)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800/60">
                      <span className="text-[8px] text-gray-400 dark:text-neutral-500 font-medium">
                        {channelData.isMonetized === false ? "Monetization is disabled for this channel" : "Yearly projected based on current views"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Sparklines Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="gained-charts-row">
                  <SvgAreaChart 
                    data={stats.gainedSubsChartData} 
                    color="emerald" 
                    title="Gained Subscribers (Daily History)" 
                  />
                  <SvgAreaChart 
                    data={stats.gainedViewsChartData} 
                    color="blue" 
                    title="Gained Views (Daily History)" 
                  />
                </div>

                {/* Daily Channel Metrics Table */}
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-neutral-800/60 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white tracking-tight">
                        Daily Channel Metrics
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium">
                        Detailed breakdown of daily performance statistics for the last 14 days
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200/60 dark:bg-neutral-950 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 text-[10px] font-bold rounded-lg font-mono">
                      Last 14 Days
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-neutral-950/40 text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider border-b border-slate-100 dark:border-neutral-800">
                          <th className="py-3 px-5">Date</th>
                          <th className="py-3 px-5 text-right">Subscribers</th>
                          <th className="py-3 px-5 text-right">Views</th>
                          <th className="py-3 px-5 text-center">Videos</th>
                          <th className="py-3 px-5 text-right">Estimated Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60 text-[11px] md:text-xs">
                        {stats.dailyMetrics.map((day, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-neutral-900/30 transition-colors">
                            <td className="py-3 px-5 font-mono font-bold text-gray-700 dark:text-neutral-300">
                              <span className="text-gray-400 dark:text-neutral-500 font-sans mr-2">{day.dayOfWeek}</span>
                              {day.date}
                            </td>
                            <td className="py-3 px-5 text-right font-mono font-medium">
                              <div className="text-gray-900 dark:text-white font-semibold">
                                {channelData.hiddenSubscriberCount ? "--" : formatCount(day.subscribersTotal)}
                              </div>
                              {day.subscribersGained > 0 && !channelData.hiddenSubscriberCount && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                  +{day.subscribersGained.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-5 text-right font-mono font-medium">
                              <div className="text-gray-900 dark:text-white font-semibold">
                                {day.viewsTotal.toLocaleString()}
                              </div>
                              {day.viewsGained > 0 && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                  +{day.viewsGained.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-5 text-center font-mono font-medium">
                              <div className="text-gray-900 dark:text-white font-semibold">
                                {day.videosTotal.toLocaleString()}
                              </div>
                              {day.videosGained > 0 ? (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                  +{day.videosGained}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 dark:text-neutral-600 block mt-0.5">--</span>
                              )}
                            </td>
                            <td className="py-3 px-5 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                              {channelData.isMonetized === false ? "----" : `$${day.minEarnings.toFixed(0)} - $${day.maxEarnings.toFixed(0)}`}
                            </td>
                          </tr>
                        ))}

                        {/* Totals for Last 14 Days */}
                        <tr className="bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] font-bold text-gray-900 dark:text-white border-t-2 border-slate-200 dark:border-neutral-800">
                          <td className="py-3.5 px-5 text-left font-extrabold uppercase text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total (Last 14 Days)
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{totalSubs14Days.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{totalViews14Days.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{totalVideos14Days}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            {channelData.isMonetized === false ? "----" : `$${totalMinEarnings14Days.toFixed(0)} - $${totalMaxEarnings14Days.toFixed(0)}`}
                          </td>
                        </tr>

                        {/* Totals for Last 30 Days */}
                        <tr className="bg-emerald-500/[0.08] dark:bg-emerald-500/[0.05] font-bold text-gray-900 dark:text-white border-t border-slate-200 dark:border-neutral-800">
                          <td className="py-3.5 px-5 text-left font-extrabold uppercase text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400">
                            Total (Last 30 Days)
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{stats.subsLast30Days.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            +{stats.viewsLast30Days.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                            ~{Math.round(totalVideos14Days * 2.15)}
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            {channelData.isMonetized === false ? "----" : `$${stats.monthlyMinEarnings.toFixed(0)} - $${stats.monthlyMaxEarnings.toFixed(0)}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                 {/* Channel About Description */}
                 <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm">
                   <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2">
                     <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
                       About {channelData.title}
                     </h3>
                     {channelData.description && (
                       <button
                         onClick={() => {
                           navigator.clipboard.writeText(channelData.description);
                           setCopiedChannelDesc(true);
                           setTimeout(() => setCopiedChannelDesc(false), 2000);
                         }}
                         className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400 text-[10px] font-bold transition-all duration-200 flex items-center gap-1 border border-slate-100 dark:border-neutral-700 cursor-pointer"
                         title="Copy Channel About Description"
                       >
                         {copiedChannelDesc ? (
                           <>
                             <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Copied!
                           </>
                         ) : (
                           <>
                             <Copy className="h-3 w-3" /> Copy About
                           </>
                         )}
                       </button>
                     )}
                   </div>
                   <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line" id="channel-description">
                     {channelData.description || "No description provided by the channel creator."}
                   </p>
                 </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
              </>
            )}

        {/* ---------------------------------------------------- */}
        {/* CROSS-PROMOTION NETWORK GRID                         */}
        {/* ---------------------------------------------------- */}
        <section className="mt-14 pt-10 border-t border-slate-200 dark:border-neutral-800" id="network-promotion">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-lg md:text-xl text-gray-950 dark:text-white tracking-tight">
              Our Free Utility Network Tools
            </h2>
            <p className="text-[11px] md:text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-lg mx-auto font-semibold">
              Explore our other completely free digital toolboxes designed for builders, creators, and professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" id="network-tools-grid">
            {currentNetworkTools.map((tool, index) => {
              if (tool.comingSoon) {
                return (
                  <div
                    key={index}
                    className="p-4 md:p-4.5 bg-slate-50 border border-slate-200 dark:bg-neutral-900/40 dark:border-neutral-800/80 rounded-xl flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-sm transition-all animate-fade-in"
                  >
                    <div>
                      <span className="absolute top-2.5 right-2.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
                        Soon
                      </span>
                      <div className={`${tool.colorClass} opacity-70 h-8 w-8 rounded-lg flex items-center justify-center mb-3 shrink-0 shadow-xs`} id={`tool-icon-wrapper-${index}`}>
                        {renderIconComponent(tool.icon, "h-4 w-4 text-white")}
                      </div>
                      <h4 className="font-display font-bold text-xs md:text-sm text-gray-400 dark:text-neutral-500">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1 leading-snug font-medium">
                        {tool.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center text-[9px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wider gap-1">
                      In Dev
                    </div>
                  </div>
                );
              }

              return (
                <a
                  href={tool.url}
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-4 md:p-4.5 bg-white border border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl flex flex-col justify-between hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-sm hover:emerald-glow cursor-pointer relative overflow-hidden animate-fade-in"
                >
                  <div>
                    <div className={`${tool.colorClass} h-8 w-8 rounded-lg flex items-center justify-center mb-3 shrink-0 shadow-xs`} id={`tool-icon-wrapper-${index}`}>
                      {renderIconComponent(tool.icon, "h-4 w-4 text-white")}
                    </div>
                    <h4 className="font-display font-bold text-xs md:text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug font-medium">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider gap-1 group-hover:translate-x-0.5 transition-transform">
                    Launch App <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Native Recommendation Feed Placement - Styled perfectly for both desktop and mobile */}
        <AdsterraNative id="bottom-native" enabled={adsEnabled} subdomainView={subdomainView} />

        {/* ---------------------------------------------------- */}
        {/* FAQ ACCORDION                                        */}
        {/* ---------------------------------------------------- */}
        <section className="mt-14 pt-10 border-t border-slate-200 dark:border-neutral-800" id="faq-section">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-lg md:text-xl text-gray-950 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[11px] md:text-xs text-gray-400 dark:text-gray-500 mt-1 font-semibold">
              {subdomainView === "qr" ? (
                "Find answers to common questions about our custom QR Code generator and scanner."
              ) : subdomainView === "compress" ? (
                "Find answers to common questions about our free bulk image compressor."
              ) : subdomainView === "ip" ? (
                "Find answers to common questions about our public IP & location geolocation finder."
              ) : (
                "Find answers to common questions about using EZ Toolbox YouTube analyzer."
              )}
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-2.5" id="faq-accordions">
            {currentFaqItems.map((item, index) => {
              const isOpen = !!openFaqs[index];
              return (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-3 text-left font-display font-bold text-xs md:text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/50 flex items-center justify-between gap-4 focus:outline-none"
                    id={`faq-trigger-${index}`}
                  >
                    <span>{item.question}</span>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1.5 text-xs md:text-sm text-gray-500 dark:text-neutral-400 leading-relaxed font-medium">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

          </>
        ) : (
          <>
            <Pages currentPage={currentPage} setCurrentPage={setCurrentPage} subdomainView={subdomainView} />
            {/* Native Recommendation Feed Placement for other pages and articles */}
            <AdsterraNative id="pages-bottom-native" enabled={adsEnabled} subdomainView={subdomainView} />
          </>
        )}
      </main>

      {/* Disclaimer Section */}
      <section className="w-full bg-slate-100 dark:bg-neutral-900/60 border-t border-slate-200 dark:border-neutral-800 py-6 text-center relative z-10" id="footer-disclaimer">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">Legal Disclaimer</span>
          <p className="text-[11px] text-gray-500 dark:text-neutral-400 leading-relaxed font-semibold max-w-2xl mx-auto">
            EZ Toolbox is an independent, local-first search engine optimization (SEO) utility platform. We are not officially affiliated, associated, authorized, endorsed by, or in any way officially connected with Google LLC, YouTube, Social Blade, or any of their subsidiaries or affiliates. All estimated earnings, channel rankings, and performance metrics are pseudo-random mathematical simulations designed for educational reference and strategic keyword analysis. Actual creator earnings vary based on direct monetization status, localized audience demographics, CPM rates, and live AdSense metrics.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER BAR                                           */}
      {/* ---------------------------------------------------- */}
      <footer className="w-full bg-white dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-900 relative z-10" id="main-footer-bottom">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8 text-xs font-semibold text-gray-400 dark:text-neutral-500" id="footer-links-grid">
          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-xs text-gray-950 dark:text-white tracking-tight uppercase">EZ Toolbox</h4>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
              Leading the digital landscape with lightweight, robust, and client-first browser utilities. No registration, no cookies, completely free forever.
            </p>
            <p className="text-[10px] text-gray-400/80">© 2026 EZ Toolbox Utilities. Built for perfect SEO ranking.</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-xs text-gray-950 dark:text-white tracking-tight uppercase">SEO & Trust Pages</h4>
            <div className="flex flex-col space-y-1.5 text-[11px]">
              <button onClick={() => setCurrentPage("about")} className="hover:text-emerald-500 text-left cursor-pointer transition-colors">About Us / Mission</button>
              <button onClick={() => setCurrentPage("articles")} className="hover:text-emerald-500 text-left cursor-pointer transition-colors">SEO Growth Articles</button>
              <button onClick={() => setCurrentPage("contact")} className="hover:text-emerald-500 text-left cursor-pointer transition-colors">Contact Us / Support</button>
              <button onClick={() => setCurrentPage("privacy")} className="hover:text-emerald-500 text-left cursor-pointer transition-colors">Privacy Policy</button>
              <button onClick={() => setCurrentPage("terms")} className="hover:text-emerald-500 text-left cursor-pointer transition-colors">Terms & Conditions</button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-xs text-gray-950 dark:text-white tracking-tight uppercase">Our Utility Network</h4>
            <div className="flex flex-col space-y-1.5 text-[11px]">
              <a href="https://qr.eztoolbox.xyz" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">EZ QR Code Generator <ExternalLink className="h-2.5 w-2.5" /></a>
              <a href="https://pdf.eztoolbox.xyz" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">EZ PDF Document Toolkit <ExternalLink className="h-2.5 w-2.5" /></a>
              <a href="https://compress.eztoolbox.xyz" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">EZ Image Compressor <ExternalLink className="h-2.5 w-2.5" /></a>
              <a href="https://color.eztoolbox.xyz" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">EZ Color Palette Generator <ExternalLink className="h-2.5 w-2.5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/923017480809?text=Hello%20EZ%20Toolbox%20Support!"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 group"
        title="Contact Live Support on WhatsApp"
        id="floating-whatsapp-support"
      >
        <Phone className="h-6 w-6 stroke-[2.5]" />
        <span className="absolute right-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg font-extrabold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
          Live Support Chat
        </span>
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
        </span>
      </a>

    </div>
  );
}
