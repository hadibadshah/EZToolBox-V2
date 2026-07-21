import React, { useState } from "react";
import { 
  Download, 
  Video, 
  Music, 
  Image as ImageIcon,
  Check, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  Heart,
  MessageSquare,
  Eye,
  Share2,
  Lock,
  User,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TiktokVideoData {
  code: number;
  msg: string;
  processed_time: number;
  data?: {
    id: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: number;
    play: string;
    wmplay: string;
    hdplay?: string;
    size?: number;
    wm_size?: number;
    hd_size?: number;
    music: string;
    music_info: {
      id: string;
      title: string;
      play: string;
      author: string;
      cover: string;
      duration: number;
    };
    author: {
      id: string;
      uniqueId: string;
      nickname: string;
      avatar: string;
      signature?: string;
    };
    play_count: number;
    digg_count: number;
    comment_count: number;
    share_count: number;
    download_count: number;
    create_time: number;
  };
}

interface TiktokDownloaderProps {
  adsEnabled: boolean;
}

export const TiktokDownloader: React.FC<TiktokDownloaderProps> = ({ adsEnabled }) => {
  const [urlInput, setUrlInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<TiktokVideoData["data"] | null>(null);
  const [downloadingField, setDownloadingField] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setVideoData(null);

    // Basic TikTok URL check
    const normalizedUrl = urlInput.trim();
    if (!normalizedUrl.includes("tiktok.com")) {
      setError("Please enter a valid TikTok video URL (e.g., https://www.tiktok.com/@user/video/...)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/tiktok/info?url=${encodeURIComponent(normalizedUrl)}`);
      
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        throw new Error("IFRAME_COOKIE_RESTRICTION");
      }

      if (!res.ok) {
        throw new Error("Failed to communicate with TikTok API proxy server.");
      }

      const responseText = await res.text();
      let json: TiktokVideoData;
      try {
        json = JSON.parse(responseText);
      } catch (parseErr) {
        if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
          throw new Error("IFRAME_COOKIE_RESTRICTION");
        }
        throw new Error("Invalid response format received from server.");
      }

      if (json.code !== 0 || !json.data) {
        throw new Error(json.msg || "Invalid response from TikTok API. Check the URL.");
      }

      setVideoData(json.data);
    } catch (err: any) {
      console.error(err);
      if (err.message === "IFRAME_COOKIE_RESTRICTION") {
        setError("IFRAME_COOKIE_RESTRICTION");
      } else {
        setError(err.message || "An unexpected error occurred. Please verify your internet connection or try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async (directUrl: string, filename: string, fieldKey: string) => {
    try {
      setDownloadingField(fieldKey);
      
      // Open direct high-speed CDN link in a new tab to bypass server proxy and protect Hostinger hosting limits
      window.open(directUrl, "_blank");
    } catch (err) {
      console.error("Failed to open download link:", err);
    } finally {
      // Simulate click feedback delay
      setTimeout(() => setDownloadingField(null), 1500);
    }
  };

  // Helper to format large stats
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toLocaleString();
  };

  // Helper to format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-1 py-2" id="tiktok-downloader-root">
      {/* ---------------------------------------------------- */}
      {/* Title & Badge                                        */}
      {/* ---------------------------------------------------- */}
      <div className="text-center mb-8" id="tiktok-downloader-header">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-3 border border-neutral-800 shadow-md"
        >
          <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
          <span>EZ TikTok Pro Downloader</span>
        </motion.div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-gray-950 dark:text-white tracking-tight leading-tight">
          TikTok Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">Downloader</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto font-semibold">
          Extract and download TikTok videos without watermark in HD, fetch MP3 background music, and download covers instantly with zero ads or tracking!
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Input / Form Section                                 */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-5 rounded-2xl shadow-xl max-w-3xl mx-auto mb-8 relative overflow-hidden" id="tiktok-search-box">
        {/* Accent light decoration */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
        
        <form onSubmit={handleExtract} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
              <Video className="h-5 w-5 text-pink-500" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste TikTok video URL (e.g., https://www.tiktok.com/@creator/video/...)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-xs md:text-sm rounded-xl font-medium text-gray-900 dark:text-white transition-all"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !urlInput.trim()}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 disabled:opacity-50 text-xs md:text-sm font-bold rounded-xl transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Video</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 font-semibold text-center md:text-left">
          💡 Pro-Tip: You can paste mobile links (vt.tiktok.com / vm.tiktok.com) directly from the share menu.
        </p>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full mt-4"
            >
              {error === "IFRAME_COOKIE_RESTRICTION" ? (
                <div className="flex flex-col gap-3.5 p-4 bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300 rounded-xl text-xs md:text-sm font-medium shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500 animate-pulse" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Iframe Browser Block Active</p>
                      <p className="mt-1 text-slate-600 dark:text-neutral-400 leading-relaxed font-semibold">
                        Due to modern browser security guidelines (preventing cross-origin session storage/cookies inside iframes), the TikTok proxy needs a quick session initialization.
                      </p>
                      <p className="mt-1 text-slate-500 dark:text-neutral-500 font-semibold text-xs">
                        Please open the app in a new tab once to authorize the connection, then you can download any video immediately!
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open in New Tab & Authorize</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 rounded-xl text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Video Data Output / Download Action Dashboard        */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {videoData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-12 gap-6 bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800/80 p-6 rounded-2xl shadow-2xl relative mb-12"
            id="tiktok-result-dashboard"
          >
            {/* Visual Media Preview (Left 5 columns) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[9/16] max-h-[480px] bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-neutral-800">
                <video 
                  src={videoData.play} 
                  poster={videoData.cover}
                  controls 
                  className="w-full h-full object-cover"
                  playsInline
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {formatDuration(videoData.duration)} Mins
                </div>
              </div>
            </div>

            {/* Downloader Operations Block (Right 7 columns) */}
            <div className="md:col-span-7 flex flex-col justify-between gap-5">
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4 mb-4">
                  <img 
                    src={videoData.author.avatar} 
                    alt={videoData.author.nickname} 
                    className="h-11 w-11 rounded-full border border-slate-200 dark:border-neutral-800 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white truncate flex items-center gap-1.5">
                      {videoData.author.nickname}
                      <span className="text-[10px] bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
                        Creator
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold truncate">
                      @{videoData.author.uniqueId}
                    </p>
                  </div>
                </div>

                {/* Video Description */}
                <p className="text-xs md:text-sm text-gray-700 dark:text-neutral-300 font-medium leading-relaxed mb-4">
                  {videoData.title || "TikTok Video Extracted Successfully"}
                </p>

                {/* Engagement Numbers Bento Grid */}
                <div className="grid grid-cols-5 gap-2 bg-slate-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-slate-200/40 dark:border-neutral-800/40 mb-5">
                  <div className="text-center">
                    <Eye className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                    <span className="block text-[11px] font-extrabold text-gray-950 dark:text-white">
                      {formatNumber(videoData.play_count)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                      Views
                    </span>
                  </div>
                  <div className="text-center">
                    <Heart className="h-4 w-4 text-pink-500 mx-auto mb-1 fill-pink-500" />
                    <span className="block text-[11px] font-extrabold text-gray-950 dark:text-white">
                      {formatNumber(videoData.digg_count)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                      Likes
                    </span>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
                    <span className="block text-[11px] font-extrabold text-gray-950 dark:text-white">
                      {formatNumber(videoData.comment_count)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                      Comments
                    </span>
                  </div>
                  <div className="text-center">
                    <Share2 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-[11px] font-extrabold text-gray-950 dark:text-white">
                      {formatNumber(videoData.share_count)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                      Shares
                    </span>
                  </div>
                  <div className="text-center">
                    <Download className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                    <span className="block text-[11px] font-extrabold text-gray-950 dark:text-white">
                      {formatNumber(videoData.download_count)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                      Downloads
                    </span>
                  </div>
                </div>

                {/* Direct File Download Call to Action List */}
                <div className="flex flex-col gap-3">
                  {/* Safe Hostinger Download Compliance Guide */}
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                        ⚡ 100% Safe Direct High-Speed Download
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mt-1">
                        To protect your hosting from CPU/bandwidth suspension risks on Hostinger shared servers, videos are served directly from TikWM's high-speed CDN.
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-1.5">
                        <strong>How to Save:</strong> Click the <strong>"Open & Save"</strong> button. The video will open. Simply tap the three dots <strong>(⋮)</strong> and select <strong>"Download"</strong> (or right-click the video and choose <strong>"Save Video As..."</strong>).
                      </p>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-slate-100 dark:border-neutral-800 pb-1.5 mb-1">
                    Download Options
                  </h4>

                  {/* 1. Normal Video (No Watermark) */}
                  <div className="bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800/50 rounded-2xl p-3.5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center rounded-lg shrink-0">
                          <Video className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-950 dark:text-white">
                            Standard Video (No Watermark)
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {videoData.size ? `${(videoData.size / (1024 * 1024)).toFixed(1)} MB` : "Ready"} • MP4
                          </span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        MP4 Video
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => triggerDownload(videoData.play, `${videoData.author.uniqueId}_no_watermark.mp4`, 'play')}
                        disabled={downloadingField !== null}
                        className="px-3 py-2 bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 disabled:opacity-50 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {downloadingField === 'play' ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Open & Save Video</span>
                          </>
                        )}
                      </button>

                      <a
                        href={videoData.play}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 border border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Direct CDN Link</span>
                      </a>
                    </div>
                  </div>

                  {/* 2. HD Video No Watermark (If available) */}
                  {videoData.hdplay && (
                    <div className="bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800/50 rounded-2xl p-3.5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-pink-500/10 dark:bg-pink-400/10 text-pink-500 dark:text-pink-400 flex items-center justify-center rounded-lg shrink-0">
                            <Sparkles className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-gray-950 dark:text-white">
                              Ultra HD Video (No Watermark)
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {videoData.hd_size ? `${(videoData.hd_size / (1024 * 1024)).toFixed(1)} MB` : "Ready"} • Premium 1080p
                            </span>
                          </div>
                        </div>
                        <div className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 rounded-md text-[9px] font-bold uppercase tracking-wider animate-pulse">
                          Ultra HD
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => triggerDownload(videoData.hdplay, `${videoData.author.uniqueId}_hd_no_watermark.mp4`, 'hdplay')}
                          disabled={downloadingField !== null}
                          className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 disabled:opacity-50 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {downloadingField === 'hdplay' ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Opening HD...</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Open & Save HD</span>
                            </>
                          )}
                        </button>

                        <a
                          href={videoData.hdplay}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 border border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Direct HD Link</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 3. Audio / MP3 Extraction */}
                  <div className="bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800/50 rounded-2xl p-3.5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center rounded-lg shrink-0">
                          <Music className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-gray-950 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                            Extract Background Music (MP3)
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px] sm:max-w-xs block">
                            {videoData.music_info.title} • {videoData.music_info.author}
                          </span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        MP3 Audio
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => triggerDownload(videoData.music, `${videoData.author.uniqueId}_audio.mp3`, 'music')}
                        disabled={downloadingField !== null}
                        className="px-3 py-2 bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 disabled:opacity-50 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {downloadingField === 'music' ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Open & Save MP3</span>
                          </>
                        )}
                      </button>

                      <a
                        href={videoData.music}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 border border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Direct Audio Link</span>
                      </a>
                    </div>
                  </div>

                  {/* 4. Cover Artwork Image */}
                  <div className="bg-slate-50/50 dark:bg-neutral-950/20 border border-slate-200/50 dark:border-neutral-800/50 rounded-2xl p-3.5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center rounded-lg shrink-0">
                          <ImageIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-950 dark:text-white">
                            Original Video Cover Image
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            High resolution JPEG artwork
                          </span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                        Cover JPG
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => triggerDownload(videoData.origin_cover || videoData.cover, `${videoData.author.uniqueId}_cover.jpg`, 'cover')}
                        disabled={downloadingField !== null}
                        className="px-3 py-2 bg-black text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100 disabled:opacity-50 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {downloadingField === 'cover' ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Open & Save Cover</span>
                          </>
                        )}
                      </button>

                      <a
                        href={videoData.origin_cover || videoData.cover}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 border border-slate-200 hover:border-slate-300 dark:border-neutral-800 dark:hover:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Direct Image Link</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Secure Download Disclaimer */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold bg-slate-50 dark:bg-neutral-950/40 p-3 rounded-xl border border-slate-100 dark:border-neutral-800 mt-4">
                <Lock className="h-3.5 w-3.5 text-cyan-500" />
                <span>Files are opened directly from official high-speed CDNs with no speed caps.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* Informative Value Prop Section                       */}
      {/* ---------------------------------------------------- */}
      <div className="grid sm:grid-cols-3 gap-4 mt-4" id="tiktok-features-pitch">
        <div className="bg-slate-50/80 dark:bg-neutral-950/40 border border-slate-200/30 dark:border-neutral-800/50 p-4 rounded-xl">
          <h4 className="text-xs font-extrabold text-gray-950 dark:text-white mb-1 uppercase tracking-tight flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> No Watermarks
          </h4>
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            Get pristine original video files directly without annoying logos or overlays.
          </p>
        </div>
        <div className="bg-slate-50/80 dark:bg-neutral-950/40 border border-slate-200/30 dark:border-neutral-800/50 p-4 rounded-xl">
          <h4 className="text-xs font-extrabold text-gray-950 dark:text-white mb-1 uppercase tracking-tight flex items-center gap-1.5">
            <Music className="h-3.5 w-3.5 text-pink-500" /> Extract MP3
          </h4>
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            Instantly isolate and grab background audio tracks as highly compatible stereo MP3s.
          </p>
        </div>
        <div className="bg-slate-50/80 dark:bg-neutral-950/40 border border-slate-200/30 dark:border-neutral-800/50 p-4 rounded-xl">
          <h4 className="text-xs font-extrabold text-gray-950 dark:text-white mb-1 uppercase tracking-tight flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-400" /> Absolute Privacy
          </h4>
          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            No registration, no cookies, and no retention logs. Completely anonymous extractions.
          </p>
        </div>
      </div>
    </div>
  );
};
