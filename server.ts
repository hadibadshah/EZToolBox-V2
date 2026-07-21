import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const PORT = 3000;

// Local YouTube category mapping
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

// Helper: Extract Video ID
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

// Helper: Parse Channel Input
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

// Helper: Parse ISO 8601 Duration
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

async function startServer() {
  const app = express();
  app.use(express.json());

  // ----------------------------------------------------
  // API Endpoint: Check backend configuration
  // ----------------------------------------------------
  app.get("/api/config", (req, res) => {
    res.json({
      hasServerKey: !!process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== "MY_GEMINI_API_KEY"
    });
  });

  // ----------------------------------------------------
  // API Endpoint: Video Analyzer Proxy
  // ----------------------------------------------------
  app.get("/api/youtube/video", async (req, res) => {
    try {
      const { url, key } = req.query;
      if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter." });
      }

      const videoId = extractVideoId(url as string);
      if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube Video URL or ID format." });
      }

      const apiKey = (key as string) || process.env.YOUTUBE_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(401).json({
          error: "API_KEY_REQUIRED",
          message: "YouTube Data API Key is required. Please set it in your environment variables as YOUTUBE_API_KEY, or configure it in the dashboard settings."
        });
      }

      const youtubeUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;
      const response = await fetch(youtubeUrl);
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMessage = errData?.error?.message || `YouTube API responded with status ${response.status}`;
        return res.status(response.status).json({ error: errMessage });
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ error: "Video not found. Please verify the URL or ID." });
      }

      const item = data.items[0];
      const categoryId = item.snippet.categoryId || "";
      const categoryName = YOUTUBE_CATEGORIES[categoryId] || "Entertainment";

      const result = {
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

      return res.json(result);
    } catch (error: any) {
      console.error("Error fetching video details:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // ----------------------------------------------------
  // API Endpoint: Channel Analyzer Proxy
  // ----------------------------------------------------
  app.get("/api/youtube/channel", async (req, res) => {
    try {
      const { url, key } = req.query;
      if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter." });
      }

      const parsed = parseChannelInput(url as string);
      const apiKey = (key as string) || process.env.YOUTUBE_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        return res.status(401).json({
          error: "API_KEY_REQUIRED",
          message: "YouTube Data API Key is required. Please set it in your environment variables as YOUTUBE_API_KEY, or configure it in the dashboard settings."
        });
      }

      let channelDetails: any = null;

      // 1. Direct retrieval if ID is parsed
      if (parsed.type === "id") {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${parsed.value}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl);
        if (channelRes.ok) {
          const channelData = await channelRes.json();
          if (channelData.items && channelData.items.length > 0) {
            channelDetails = channelData.items[0];
          }
        }
      }

      // 2. Direct retrieval if handle is parsed (using YouTube's official forHandle API)
      if (!channelDetails && parsed.type === "handle") {
        const handleVal = parsed.value.startsWith("@") ? parsed.value : `@${parsed.value}`;
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&forHandle=${encodeURIComponent(handleVal)}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl);
        if (channelRes.ok) {
          const channelData = await channelRes.json();
          if (channelData.items && channelData.items.length > 0) {
            channelDetails = channelData.items[0];
          }
        }
      }

      // 3. Fallback to Search API if not retrieved or if input is a query
      if (!channelDetails) {
        const searchQuery = parsed.value;
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`;
        const searchRes = await fetch(searchUrl);

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.items && searchData.items.length > 0) {
            const foundChannelId = searchData.items[0].id.channelId;
            if (foundChannelId) {
              const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${foundChannelId}&key=${apiKey}`;
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
        return res.status(404).json({ error: `No channel found matching "${parsed.value}". If this is a valid channel, please check if your YouTube API key is active or has exceeded its quota.` });
      }

      const item = channelDetails;
      const subscriberCount = parseInt(item.statistics.subscriberCount || "0", 10);
      const videoCount = parseInt(item.statistics.videoCount || "0", 10);
      const channelId = item.id;

      // Check monetization status inline
      let isMonetized = false;
      let latestVideoId = "";

      // Try to get latest video upload from playlist
      const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploadsPlaylistId) {
        try {
          const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`;
          const playlistRes = await fetch(playlistUrl);
          if (playlistRes.ok) {
            const playlistData = await playlistRes.json();
            if (playlistData.items && playlistData.items.length > 0) {
              latestVideoId = playlistData.items[0].resourceId?.videoId || playlistData.items[0].snippet?.resourceId?.videoId || "";
            }
          }
        } catch (err) {
          console.error("Error fetching uploads playlist in analytics:", err);
        }
      }

      // Fallback search for latest video
      if (!latestVideoId) {
        try {
          const searchVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`;
          const searchVideoRes = await fetch(searchVideoUrl);
          if (searchVideoRes.ok) {
            const searchVideoData = await searchVideoRes.json();
            if (searchVideoData.items && searchVideoData.items.length > 0) {
              latestVideoId = searchVideoData.items[0].id?.videoId || "";
            }
          }
        } catch (err) {
          console.error("Error fetching latest video via search in analytics:", err);
        }
      }

      if (latestVideoId) {
        try {
          const watchPageUrl = `https://www.youtube.com/watch?v=${latestVideoId}`;
          const watchRes = await fetch(watchPageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
          });

          if (watchRes.ok) {
            const html = await watchRes.text();
            const hasMetaTrue = html.includes('yt:is-monetized" content="true"') || 
                                 html.includes("yt:is-monetized' content='true'") || 
                                 html.includes('name="yt:is-monetized" content="true"') ||
                                 html.includes('property="yt:is-monetized" content="true"');
                                 
            const hasJsonTrue = html.includes('"is_monetized":true') || 
                                 html.includes('"is_monetized": true') || 
                                 html.includes('"isMonetized":true') || 
                                 html.includes('"isMonetized": true');

            if (hasMetaTrue || hasJsonTrue) {
              isMonetized = true;
            } else {
              const metaRegex = /<meta\s+name=["']yt:is-monetized["']\s+content=["'](true|false)["']/i;
              const match = html.match(metaRegex);
              
              const jsonRegex = /["']is_?monetized["']\s*:\s*(true|false)/i;
              const matchJson = html.match(jsonRegex);

              if (match && match[1] === "true") {
                isMonetized = true;
              } else if (matchJson && matchJson[1] === "true") {
                isMonetized = true;
              }
            }
          }
        } catch (fetchErr) {
          console.error("Error scraping video page in analytics:", fetchErr);
        }
      }

      // Apply authority threshold overrides
      if (!isMonetized && subscriberCount > 100000 && latestVideoId) {
        isMonetized = true;
      }
      if (subscriberCount < 500) {
        isMonetized = false;
      }

      const result = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        customUrl: item.snippet.customUrl || `@${item.snippet.title.toLowerCase().replace(/\s+/g, "")}`,
        publishedAt: item.snippet.publishedAt,
        country: item.snippet.country || "Global",
        profileImage: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
        bannerImage: item.brandingSettings?.image?.bannerExternalUrl || "",
        viewCount: parseInt(item.statistics.viewCount || "0", 10),
        subscriberCount,
        videoCount,
        hiddenSubscriberCount: item.statistics.hiddenSubscriberCount || false,
        isMonetized
      };

      return res.json(result);
    } catch (error: any) {
      console.error("Error fetching channel details:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // ----------------------------------------------------
  // API Endpoint: Forced Download Proxy
  // ----------------------------------------------------
  app.get("/api/download/thumbnail", async (req, res) => {
    try {
      const { url, filename } = req.query;
      if (!url) {
        return res.status(400).send("Missing 'url' query parameter.");
      }

      const targetUrl = url as string;
      const downloadFilename = (filename as string) || "thumbnail.jpg";

      const response = await fetch(targetUrl);
      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch thumbnail: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Sanitize the filename to make sure it only contains highly compatible safe characters
      const safeFilename = downloadFilename.replace(/[^a-zA-Z0-9_.-]/g, "_");

      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
      res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
      res.setHeader("Content-Length", buffer.length);
      return res.send(buffer);
    } catch (error: any) {
      console.error("Download helper error:", error);
      return res.status(500).send("Internal server error downloading image.");
    }
  });

  // ----------------------------------------------------
  // API Endpoint: TikTok Downloader Proxy (Disabled)
  // ----------------------------------------------------
  app.get("/api/tiktok/info", async (req, res) => {
    return res.status(403).json({ error: "TikTok Downloader service has been completely disabled on this hosting server to comply with terms and prevent account suspension." });
  });

  // Helper: Fetch with manual redirect handling to preserve Referer and User-Agent headers
  async function fetchWithHeadersAndRedirects(urlStr: string, headers: Record<string, string>, maxRedirects = 5): Promise<Response> {
    let currentUrl = urlStr;
    let redirects = 0;

    while (redirects < maxRedirects) {
      const res = await fetch(currentUrl, {
        method: "GET",
        headers: headers,
        redirect: "manual" // Stop auto-following redirects to prevent header stripping
      });

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) {
          return res; // No location header, return redirect response as is
        }
        
        // Resolve relative redirect URLs if any
        currentUrl = new URL(location, currentUrl).toString();
        redirects++;
        continue;
      }

      return res;
    }

    throw new Error("Too many redirects");
  }

  app.get("/api/download/tiktok", async (req, res) => {
    return res.status(403).send("TikTok Downloader service has been completely disabled on this hosting server to comply with terms and prevent account suspension.");
  });

  // API Endpoint: Get user's actual client IP, ISP, and Location
  app.get("/api/client-info", async (req, res) => {
    try {
      let clientIp = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
      
      // Clean up IPv6 loopback or local IPs for testing
      if (clientIp === "::1" || clientIp === "127.0.0.1" || clientIp.startsWith("::ffff:127.0.0.1") || !clientIp) {
        clientIp = "182.180.120.10"; // Plausible real IP for development testing
      }

      const geoRes = await fetch(`https://ipwho.is/${clientIp}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.success) {
          return res.json({
            ip: geoData.ip,
            isp: geoData.connection?.isp || geoData.connection?.org || "Local Internet Service Provider",
            location: `${geoData.city || ""}, ${geoData.region || ""}, ${geoData.country || ""}`.replace(/^,\s*/, "").replace(/,\s*$/, "")
          });
        }
      }

      // Secondary fallback
      const dbIpRes = await fetch(`https://api.db-ip.com/v2/free/${clientIp}`);
      if (dbIpRes.ok) {
        const dbIpData = await dbIpRes.json();
        return res.json({
          ip: clientIp,
          isp: "Local Internet Service Provider",
          location: `${dbIpData.city || ""}, ${dbIpData.countryName || ""}`
        });
      }

      return res.json({
        ip: clientIp,
        isp: "Local Network Provider",
        location: "Detected Client Location"
      });
    } catch (err) {
      console.error("Error fetching client IP info:", err);
      return res.json({
        ip: "127.0.0.1",
        isp: "Local Network Provider",
        location: "Detected Client Location"
      });
    }
  });

  // API Endpoint: Speed Test Upload Target (streams & discards payload on-the-fly)
  app.post("/api/upload", (req, res) => {
    let receivedBytes = 0;
    req.on("data", (chunk) => {
      receivedBytes += chunk.length;
    });
    req.on("end", () => {
      res.json({ success: true, receivedBytes });
    });
    req.on("error", (err) => {
      console.error("Upload stream error:", err);
      res.status(500).json({ error: "Upload failed" });
    });
  });

  // Pre-allocate a 4MB random buffer once on server startup to serve extremely fast, uncompressible content
  const speedTestBuffer = Buffer.alloc(4 * 1024 * 1024);
  for (let i = 0; i < speedTestBuffer.length; i++) {
    speedTestBuffer[i] = Math.floor(Math.random() * 256);
  }

  // API Endpoint: Speed Test Download Target (generates uncompressible random chunks dynamically)
  app.get("/api/download", (req, res) => {
    // Set headers to absolutely prevent any caching or compression
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Content-Encoding", "identity");

    let isAborted = false;
    
    req.on("close", () => {
      isAborted = true;
    });
    
    req.on("error", () => {
      isAborted = true;
    });

    let bytesSent = 0;
    const maxBytes = 150 * 1024 * 1024; // 150 MB limit
    const chunkSize = 256 * 1024; // 256 KB chunks

    const writeData = () => {
      if (isAborted || req.destroyed || res.writableEnded) return;

      try {
        while (bytesSent < maxBytes) {
          if (isAborted || req.destroyed || res.writableEnded) return;

          const offset = bytesSent % (speedTestBuffer.length - chunkSize);
          const chunk = speedTestBuffer.subarray(offset, offset + chunkSize);

          const ok = res.write(chunk);
          bytesSent += chunkSize;

          if (!ok) {
            res.once("drain", writeData);
            return;
          }
        }
        res.end();
      } catch (err) {
        console.warn("Speed test download stream interrupted safely:", err);
      }
    };

    writeData();
  });

  // Explicit, high-priority routes for Google Search Console and SEO crawlers
  app.get("/sitemap.xml", (req, res) => {
    const host = req.hostname.toLowerCase();
    let sitemapFilename = "sitemap.xml";

    if (host.includes("qr.eztoolbox.xyz") || host.includes("qr.")) {
      sitemapFilename = "sitemap-qr.xml";
    } else if (host.includes("compress.eztoolbox.xyz") || host.includes("compress.")) {
      sitemapFilename = "sitemap-compress.xml";
    } else if (host.includes("ip.eztoolbox.xyz") || host.includes("ip.")) {
      sitemapFilename = "sitemap-ip.xml";
    } else if (host.includes("tiktok.eztoolbox.xyz") || host.includes("tiktok.")) {
      sitemapFilename = "sitemap-tiktok.xml";
    } else if (host.includes("speed.eztoolbox.xyz") || host.includes("speed.")) {
      sitemapFilename = "sitemap-speed.xml";
    }

    const distFile = path.join(process.cwd(), "dist", sitemapFilename);
    const publicFile = path.join(process.cwd(), "public", sitemapFilename);
    const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

    if (fs.existsSync(targetFile)) {
      res.setHeader("Content-Type", "application/xml");
      return res.sendFile(targetFile);
    }

    // Fallback to default sitemap.xml if specific sitemap isn't found
    const fallbackDist = path.join(process.cwd(), "dist", "sitemap.xml");
    const fallbackPublic = path.join(process.cwd(), "public", "sitemap.xml");
    const fallbackFile = fs.existsSync(fallbackDist) ? fallbackDist : fallbackPublic;
    if (fs.existsSync(fallbackFile)) {
      res.setHeader("Content-Type", "application/xml");
      return res.sendFile(fallbackFile);
    }

    return res.status(404).send("Sitemap not found");
  });

  app.get("/robots.txt", (req, res) => {
    const distFile = path.join(process.cwd(), "dist", "robots.txt");
    const publicFile = path.join(process.cwd(), "public", "robots.txt");
    const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

    if (fs.existsSync(targetFile)) {
      res.setHeader("Content-Type", "text/plain");
      return res.sendFile(targetFile);
    }
    return res.status(404).send("Robots.txt not found");
  });

  app.get("/googleb53210ff3f96f54d.html", (req, res) => {
    const distFile = path.join(process.cwd(), "dist", "googleb53210ff3f96f54d.html");
    const publicFile = path.join(process.cwd(), "public", "googleb53210ff3f96f54d.html");
    const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

    if (fs.existsSync(targetFile)) {
      res.setHeader("Content-Type", "text/html");
      return res.sendFile(targetFile);
    }
    return res.status(404).send("Verification file not found");
  });

  // Serve static assets in production or use Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files but don't serve index.html automatically (index: false)
    app.use(express.static(distPath, { index: false }));

    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        
        if (!fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }

        let html = fs.readFileSync(indexPath, "utf-8");
        const reqPath = req.path;
        const host = req.hostname.toLowerCase();
        
        // Subdomain detection
        const isQrSubdomain = host.includes("qr.eztoolbox.xyz") || host.includes("qr.") || host.startsWith("qr-");
        const isCompressSubdomain = host.includes("compress.eztoolbox.xyz") || host.includes("compress.") || host.startsWith("compress-");
        const isIpSubdomain = host.includes("ip.eztoolbox.xyz") || host.includes("ip.") || host.startsWith("ip-");
        const isTiktokSubdomain = host.includes("tiktok.eztoolbox.xyz") || host.includes("tiktok.") || host.startsWith("tiktok-");
        const isConverterSubdomain = host.includes("converter.eztoolbox.xyz") || host.includes("converter.") || host.includes("speed.eztoolbox.xyz") || host.includes("speed.") || host.startsWith("converter-") || host.startsWith("speed-");

        // Default Meta Tags (YouTube Analyzer - Home Page)
        let title = "EZ Toolbox 🛠️ — YouTube SEO Analyzer & Thumbnail Downloader";
        let description = "Analyze any YouTube video or channel instantly. Get real-time views, upload date, hidden tags, categories, subscriber milestones, estimated earnings, and download thumbnails in HD for free!";
        let keywords = "youtube video analyzer, youtube tag extractor, channel growth analytics, download youtube thumbnails hd, ez toolbox, free youtube tools, social blade alternative";
        let url = `https://eztoolbox.xyz${reqPath}`;
        let ogImage = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&h=630&q=80";
        let siteName = "EZ Toolbox";

        if (isQrSubdomain) {
          title = "EZ Custom QR Code Generator & Scanner 🎯 — EZToolBox";
          description = "Generate custom high-resolution QR codes with your brand logo, custom colors, and styled presets. Decode and scan QR codes instantly from image files or live webcam streams for free!";
          keywords = "qr code generator, free qr generator, custom qr code with logo, qr scanner online, scan qr code webcam, ez qr code, ez toolbox";
          url = `https://qr.eztoolbox.xyz${reqPath}`;
          ogImage = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&h=630&q=80";
          siteName = "EZ QR Code";
        } else if (isCompressSubdomain) {
          title = "EZ Bulk Image Compressor 🖼️ — Offline-First File Compression";
          description = "Compress JPEG, PNG, WEBP, and SVG images in bulk. Reduce file size up to 90% while keeping high visual quality. Runs entirely locally and privately in your browser!";
          keywords = "bulk image compressor, free image compression, compress jpeg online, compress webp in bulk, reduce image size, private image optimization, ez toolbox";
          url = `https://compress.eztoolbox.xyz${reqPath}`;
          ogImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=630&q=80";
          siteName = "EZ Image Compressor";
        } else if (isIpSubdomain) {
          title = "EZ What Is My IP & Geolocation Checker 🌐 — EZToolBox";
          description = "Check your public IP address, ISP provider, country, city, and exact coordinates on a live interactive map. Run network speed tests, DNS lookups, and diagnostic pings for free!";
          keywords = "what is my ip, ip address lookup, ip location tracker, public ip address, network isp diagnostic, geolocation coordinates, dns lookup, ping tester, ez toolbox";
          url = `https://ip.eztoolbox.xyz${reqPath}`;
          ogImage = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&h=630&q=80";
          siteName = "EZ IP Finder";
        } else if (isTiktokSubdomain) {
          title = "EZ TikTok Downloader 🎬 — No Watermark TikTok Video & MP3 Downloader";
          description = "Download TikTok videos without watermark in HD, extract background MP3 audio files, and download cover images instantly. Free, fast, and secure with no limitations!";
          keywords = "tiktok downloader, download tiktok without watermark, tiktok video downloader, save tiktok mp3, extract tiktok music, ez tiktok downloader, ez toolbox";
          url = `https://tiktok.eztoolbox.xyz${reqPath}`;
          ogImage = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&h=630&q=80";
          siteName = "EZ TikTok Downloader";
        } else if (isConverterSubdomain) {
          title = "EZ Universal Unit Converter & Calculator 🧮 — EZToolBox";
          description = "Convert units of length, area, volume, mass, temperature, speed, time, and data storage instantly. Use custom calculators and equation solvers online for free!";
          keywords = "universal units converter, free conversion calculator, metric to imperial, math calculation widgets, weight and distance converter, ez toolbox";
          url = `https://converter.eztoolbox.xyz${reqPath}`;
          ogImage = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&h=630&q=80";
          siteName = "EZ Universal Converter";
        }

        // Match sub-pages and override specific metadata as needed (mainly for YouTube sub-pages and blog posts)
        if (reqPath === "/about") {
          title = `About Us — ${siteName} 🛠️`;
          description = `Learn about ${siteName}: the ultimate, professional-grade digital tool engineered to simplify and optimize your productivity journey.`;
        } else if (reqPath === "/contact") {
          title = `Contact Us & Helpdesk — ${siteName} 🛠️`;
          description = `Get in touch with the official support helpdesk for ${siteName} for inquiries, custom assistance, or feedback.`;
        } else if (reqPath === "/privacy") {
          title = `Privacy Policy — ${siteName} 🛠️`;
          description = `Review the official Privacy Policy for ${siteName}. Learn how we ensure local-first data processing and user privacy.`;
        } else if (reqPath === "/terms") {
          title = `Terms of Service — ${siteName} 🛠️`;
          description = `Review the user agreement and general Terms & Conditions for utilizing our digital utilities safely.`;
        } else if (reqPath === "/articles") {
          title = "SEO Growth Articles & Creators Blog — EZ Toolbox 🛠️";
          description = "Master the YouTube algorithm, rank videos higher, learn search engine optimization (SEO) tactics, and decode monetization RPM/CPM rates by country.";
          keywords = "youtube seo articles, creators blog, rank youtube videos, high cpm countries, youtube algorithm guide";
        } else if (reqPath.includes("/articles/youtube-tag-extractor-seo-optimization")) {
          title = "How to Use a YouTube Tag Extractor for SEO — EZ Toolbox";
          description = "Unlock search algorithms by finding hidden tags on YouTube and integrating them into your descriptions and metadata dynamically to rank videos fast.";
          keywords = "YouTube Tag Extractor, how to find hidden tags on youtube, youtube seo tool, rank youtube videos fast";
        } else if (reqPath.includes("/articles/youtube-monetization-cpm-rates-country")) {
          title = "YouTube Monetization & CPM Rates by Country — EZ Toolbox";
          description = "Learn how the YouTube Partner Program validates channels, check channel monetization status, and calculate ad earnings potential based on regional CPM.";
          keywords = "YouTube monetization checker, check channel monetization status, youtube CPM calculator, high CPM countries";
        } else if (reqPath.includes("/articles/social-blade-alternative-track-subscriber-growth")) {
          title = "Social Blade Alternative: Track Subscriber Growth — EZ Toolbox";
          description = "Discover why tracking historical daily subscriber growth is critical for digital branding and how to leverage lightweight analytic dashboards to predict channel trends.";
          keywords = "Social Blade alternative, youtube channel analytics tool, daily subscriber growth tracker, estimate youtube earnings";
        }

        // Dynamically check if a custom uploaded PNG/JPG is placed inside public/assets directory
        let localOgPath = "";
        if (isQrSubdomain) {
          localOgPath = "og-image-qr.png";
        } else if (isCompressSubdomain) {
          localOgPath = "og-image-compress.png";
        } else if (isIpSubdomain) {
          localOgPath = "og-image-ip.png";
        } else if (isTiktokSubdomain) {
          localOgPath = "og-image-tiktok.png";
        } else if (isConverterSubdomain) {
          localOgPath = "og-image-converter.png";
        } else {
          localOgPath = "og-image-yt.png";
        }

        const absoluteLocalOg = path.join(distPath, "assets", localOgPath);
        if (fs.existsSync(absoluteLocalOg)) {
          const domainUrl = isQrSubdomain ? "https://qr.eztoolbox.xyz" :
                            isCompressSubdomain ? "https://compress.eztoolbox.xyz" :
                            isIpSubdomain ? "https://ip.eztoolbox.xyz" :
                            isTiktokSubdomain ? "https://tiktok.eztoolbox.xyz" :
                            isConverterSubdomain ? "https://converter.eztoolbox.xyz" :
                            "https://eztoolbox.xyz";
          ogImage = `${domainUrl}/assets/${localOgPath}`;
        }

        // Construct complete, standard SEO & Open Graph Tags for WhatsApp / Facebook / Telegram
        const seoTags = `
    <!-- Primary SEO Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${siteName}" />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${siteName}" />

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
        `;

        // Replace the default title tag with the dynamically generated SEO tags block
        if (html.includes("<title>EZ Toolbox — YouTube Analyzer & Downloader</title>")) {
          html = html.replace("<title>EZ Toolbox — YouTube Analyzer & Downloader</title>", seoTags);
        } else {
          html = html.replace(/<title>[^<]*<\/title>/i, seoTags);
        }

        res.setHeader("Content-Type", "text/html");
        return res.send(html);
      } catch (err) {
        console.error("Dynamic SEO metadata rendering error:", err);
        return res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
