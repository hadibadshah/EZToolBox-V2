import express from "express";
import path from "path";
import dotenv from "dotenv";
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

      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadFilename)}"`);
      res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
      res.setHeader("Content-Length", buffer.length);
      return res.send(buffer);
    } catch (error: any) {
      console.error("Download helper error:", error);
      return res.status(500).send("Internal server error downloading image.");
    }
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
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
