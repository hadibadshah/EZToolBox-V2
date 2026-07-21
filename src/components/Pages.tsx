import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, ExternalLink, Shield, FileText, Info, BookOpen, MessageSquare } from "lucide-react";

interface PagesProps {
  currentPage: "about" | "contact" | "privacy" | "terms" | "articles";
  setCurrentPage: (page: "home" | "about" | "contact" | "privacy" | "terms" | "articles") => void;
  subdomainView?: "yt" | "qr" | "compress" | "ip" | "converter" | "tiktok";
}

export const Pages: React.FC<PagesProps> = ({ currentPage, setCurrentPage, subdomainView = "yt" }) => {
  const getArticleIdFromPath = (path: string): number | null => {
    // YouTube Articles
    if (path.includes("/articles/youtube-tag-extractor-seo-optimization")) return 1;
    if (path.includes("/articles/youtube-monetization-cpm-rates-country")) return 2;
    if (path.includes("/articles/social-blade-alternative-track-subscriber-growth")) return 3;
    // QR Articles
    if (path.includes("/articles/how-to-create-custom-qr-codes-with-logo-branding")) return 4;
    if (path.includes("/articles/offline-to-online-marketing-qr-codes-guide")) return 5;
    if (path.includes("/articles/qr-code-formats-static-dynamic-vcard-security")) return 6;
    // Compress Articles
    if (path.includes("/articles/bulk-image-compression-google-pagespeed-seo")) return 7;
    if (path.includes("/articles/webp-vs-png-jpg-ultimate-web-performance-guide")) return 8;
    if (path.includes("/articles/browser-based-image-compression-privacy-speed")) return 9;
    // IP Articles
    if (path.includes("/articles/what-is-my-ip-address-ipv4-vs-ipv6")) return 10;
    if (path.includes("/articles/ip-geolocation-accuracy-gps-wifi-mapping")) return 11;
    if (path.includes("/articles/understanding-internet-isps-asns-routing")) return 12;
    // Converter Articles
    if (path.includes("/articles/currency-exchange-rates-calculation-live-rates")) return 13;
    if (path.includes("/articles/importance-of-accurate-scientific-unit-converters")) return 14;
    if (path.includes("/articles/how-to-use-interactive-financial-calculators")) return 15;
    // TikTok Articles
    if (path.includes("/articles/how-to-download-tiktok-videos-without-watermark")) return 16;
    if (path.includes("/articles/how-to-extract-high-quality-mp3-from-tiktok")) return 17;
    if (path.includes("/articles/best-tiktok-downloader-unlimited-full-hd-saves")) return 18;
    return null;
  };

  const [selectedArticle, setSelectedArticleInternal] = useState<number | null>(() => {
    return getArticleIdFromPath(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setSelectedArticleInternal(getArticleIdFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setSelectedArticle = (id: number | null) => {
    if (id === null) {
      window.history.pushState(null, "", "/articles");
    } else {
      const article = articles.find(a => a.id === id);
      if (article) {
        window.history.pushState(null, "", `/articles/${article.slug}`);
      }
    }
    setSelectedArticleInternal(id);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const youtubeArticles = [
    {
      id: 1,
      title: "How to Use a YouTube Tag Extractor for SEO Optimization & Rank Videos Fast",
      summary: "Unlock the secrets of search algorithms by learning how to find hidden tags on YouTube and integrate them into your descriptions and metadata dynamically.",
      slug: "youtube-tag-extractor-seo-optimization",
      keywords: "YouTube Tag Extractor, how to find hidden tags on youtube, youtube seo tool, optimize youtube description, rank youtube videos fast, youtube keyword research, meta tags extractor",
      date: "July 5, 2026",
      readTime: "6 min read",
      content: `### Why YouTube Tag Extraction is the Ultimate SEO Cheat Code in 2026

Are you struggling to get views on your newly uploaded videos? You are not alone. With over 500 hours of video content uploaded to YouTube every single minute, standing out requires more than just high-quality production—it requires a calculated search engine optimization (SEO) strategy.

One of the most powerful, yet frequently misunderstood, components of video optimization is the use of **meta-keywords** or **hidden tags**. In this guide, we will explore how a professional **YouTube Tag Extractor** can supercharge your visibility, helping you rank on the first page of search results.

---

### What are YouTube Tags and Why Do They Matter?

YouTube tags are hidden descriptive words and phrases that creators add to their video metadata during upload. Although they are no longer visible directly on the watch page to normal users, search engine crawlers (such as the Google Bot and the YouTube Search Indexer) read these tags to understand the exact context, category, and subject matter of your video.

Properly optimized tags help:
1. **Categorize Your Video**: Helps the algorithm place your content in the correct niche.
2. **Increase Recommended Sidebar Appearances**: Places your video next to high-traffic, relevant competitor uploads.
3. **Target Long-Tail Queries**: Matches complex voice search questions and niche search phrases.

---

### Step-by-Step Guide: How to Find Hidden Tags on YouTube with EZ Toolbox

Using our advanced browser-based **YouTube Tag Extractor**, finding competitor keywords is simple:

1. **Find a Top-Ranking Competitor**: Search for your primary keyword on YouTube. Identify a highly successful video with outstanding view counts in the last 7 to 30 days.
2. **Copy the Video URL**: Right-click the video and copy the address, or copy it directly from your browser's address bar.
3. **Paste & Analyze**: Open the **EZ Toolbox Video Analyzer**, paste the URL into our single-view search input, and press **Analyze Video**.
4. **Instant Keyword Retrieval**: Within milliseconds, our tool communicates with the YouTube Data API to pull the exact keywords, secret tags, description lengths, and thumbnail resolutions.
5. **One-Click Copy**: Use our integrated **Copy All Tags** buttons or click individual terms to copy them to your local clipboard.

---

### Best Practices for Tag and Keyword Placement

Do not simply copy-paste tags blindly. Follow this structure to avoid "keyword stuffing" penalties:

* **Primary Keyword (First Tag)**: The absolute main phrase you want to rank for (e.g., *"YouTube Tag Extractor"*).
* **Secondary Variations**: Broad keywords and related search topics (*"how to find hidden tags on youtube"*, *"youtube seo tool"*).
* **Long-Tail Search Terms**: Complete phrases users type when looking for help (*"how to rank youtube videos fast in 2026"*, *"free metadata finder"*).
* **Brand Tag**: A unique tag representing your channel name to keep viewers linked within your recommendation loop.

*Tip: Always weave your extracted primary and secondary keywords naturally into the first 200 characters of your video description to maximize crawler efficiency!*`
    },
    {
      id: 2,
      title: "Understanding YouTube Monetization & Estimating CPM Rates by Country",
      summary: "Learn how the YouTube Partner Program validates channels, check channel monetization status, and calculate ad earnings potential based on regional CPM benchmarks.",
      slug: "youtube-monetization-cpm-rates-country",
      keywords: "YouTube monetization checker, check channel monetization status, youtube CPM calculator, high CPM countries, make money on youtube, youtube partner program requirements, adsense calculator",
      date: "June 28, 2026",
      readTime: "8 min read",
      content: `### Decoding the Ad Revenue Matrix: CPM, RPM, and Monetization Verification

For digital creators, understanding how video views translate into sustainable revenue is critical. If you are aiming to turn video creation into a full-time career, you must understand the mechanics of the **YouTube Partner Program (YPP)**, regional CPM averages, and how to verify channel monetization eligibility.

In this deep-dive article, we will dissect YouTube earnings, explore why certain countries pay up to 20x more than others, and show you how to use a **YouTube Monetization Checker** to audit any channel's financial potential.

---

### YouTube Partner Program (YPP) Requirements in 2026

Before a channel can display advertisements and generate passive revenue, it must pass manual and automated review processes by Google. The core benchmarks are:

1. **1,000 Subscribers**: A solid foundation of recurring active viewers.
2. **4,000 Public Watch Hours** (within the last 365 days) OR **10 Million Shorts Views** (within 90 days).
3. **Active Upload Activity**: At least 5 active, public video uploads on the channel.
4. **AdSense Account Link**: A clean, verified payment profile compliant with Google program rules.

---

### What is CPM and How Does It Dictate Your Earnings?

**CPM** stands for *Cost Per Mille* (Cost Per Thousand Views). It represents the total amount of money advertisers pay Google to show ads on your video 1,000 times. 

It is vital to distinguish between **CPM** and **RPM**:
* **CPM**: Advertisers' cost. Google keeps 45% of this.
* **RPM** (*Revenue Per Mille*): The actual amount the creator takes home per 1,000 views after Google’s revenue split.

#### High CPM Countries vs. Low CPM Countries

Ad revenue is highly localized. Advertisers pay significantly more to show ads to users in wealthy nations with high purchasing power. Below is a realistic baseline CPM guide:

| Country Tier | Typical CPM Range | High-Paying Niche CPM | Example Countries |
|---|---|---|---|
| **Tier 1 (High)** | $6.00 - $18.00 | $25.00+ | United States, Norway, United Kingdom, Canada, Australia |
| **Tier 2 (Medium)**| $2.50 - $5.50 | $10.00+ | Germany, Spain, United Arab Emirates, Brazil, France |
| **Tier 3 (Low)** | $0.20 - $1.80 | $3.50+ | India, Pakistan, Philippines, Egypt, Indonesia |

*Niche Matters Too:* Finance, Technology, Real Estate, and Dropshipping channels enjoy the highest CPM rates, while gaming and compilation channels often see lower averages.

---

### How to Use the EZ Toolbox Monetization Status Tool

Wondering if a channel is truly monetized? We can inspect public ad placements and tag variables:

* **Enter Channel Handle**: Paste the handle (e.g., *@mrbeast*) or channel link into our **Channel Analytics Tool**.
* **Live Audit Verification**: The tool checks the channel’s global grade, subscriber count, and upload frequency to verify if the channel satisfies the Partner Program baseline.
* **Earnings Projection**: If the channel is monetized, our Adsense Calculator estimates daily, monthly, and yearly income potential based on a weighted dynamic scale ($0.25 - $4.00 CPM). If monetization is disabled, we hide the revenue stats and show a clear "----" to maintain data integrity.`
    },
    {
      id: 3,
      title: "Social Blade Alternative: How to Track Channel Subscriber Growth & Predict Future Milestones",
      summary: "Discover why tracking historical daily subscriber growth is critical for digital branding and how to leverage lightweight analytic dashboards to predict channel trends.",
      slug: "social-blade-alternative-track-subscriber-growth",
      keywords: "Social Blade alternative, youtube channel analytics tool, daily subscriber growth tracker, youtube live sub count, youtube channel grade, estimate youtube earnings, video analytics dashboard",
      date: "June 14, 2026",
      readTime: "5 min read",
      content: `### Why Daily Metrics are the Pulse of YouTube Success

Many creators check their subscriber count once a day and call it a day. However, elite creators and marketing agencies understand that **trends, velocity, and daily growth spikes** tell the true story of channel health.

If you are looking for a fast, free, lightweight **Social Blade alternative** that doesn't bombard you with heavy ads or slow loading speeds, the **EZ Toolbox Channel Analytics Engine** is designed for you.

---

### What Metrics Should You Actually Track?

To properly evaluate a competitor's channel or audit your own growth, focus on these three indicators:

1. **Daily Gained Subscribers & Views**: Spot immediate spikes. Did a video go viral on Tuesday? You will see a massive view surge accompanied by subscriber growth.
2. **Channel Grade**: An overall metric grading system (A++, A, B+, C) calculated based on upload consistency and audience engagement ratio.
3. **Monthly and Yearly Projections**: Compounding your current 14-day average to map out where your brand will be in 6 to 12 months.

---

### Predict Your Next YouTube Milestones

With **EZ Toolbox**, we automatically calculate your daily analytics history, charting subscribers and view velocity using a deterministic, seeded seeding matrix that mirrors official Social Blade performance curves:

* **14-Day Performance Table**: A clean breakdown showing daily subscribers gained, total cumulative subscribers, daily views gained, and active uploads.
* **14-Day & 30-Day Sum Totals**: Located at the bottom of the Daily Metrics table, this footer summarizes the cumulative gained subscribers, views, and videos for both 14-day and 30-day intervals, letting you calculate your exact short-term velocity.
* **Sparkline Progress Charts**: Interactive visual SVG areas representing subscriber and view trajectories. Hover over any point to read specific daily increases instantly.

By auditing these statistics weekly, you can fine-tune your content calendar, pivot away from low-performing topics, and double-down on high-velocity content formats.`
    }
  ];

  const qrArticles = [
    {
      id: 4,
      title: "How to Create Custom QR Codes with Embedded Logos for Professional Branding",
      summary: "Discover how incorporating visual logos, custom brand colors, and aesthetic style patterns into QR codes can boost scan rates by up to 200%.",
      slug: "how-to-create-custom-qr-codes-with-logo-branding",
      keywords: "Custom QR Code Generator with logo, brand QR code, free qr generator, custom colors qr, high resolution qr code, boost scan rate",
      date: "July 12, 2026",
      readTime: "6 min read",
      content: `### Why Custom branded QR Codes are the Standard in 2026

Are you still using basic, generic black-and-white square QR codes? If so, you are missing out on a massive branding opportunity. In a digital-first economy, consumers hesitate to scan anonymous codes out of security concerns. Integrating your company logo and matching color themes builds instantaneous trust.

Studies show that custom styled QR codes with embedded brand marks receive up to **200% more scans** than standard industrial templates. In this guide, we will show you how to leverage EZ Toolbox to craft gorgeous, high-trust codes for free.

---

### Choosing the Right Error Correction Level (ECL) for Logo Overlays

When you overlay an image or logo over the center of a QR code, you are technically obstructing a portion of its data grid. To ensure the code remains 100% readable, you must use high error-resilience settings:

* **Level L (Low)**: Reclaims up to 7% of missing data. (Do NOT use with logos).
* **Level M (Medium)**: Reclaims up to 15%. (Acceptable for tiny icons).
* **Level H (High)**: Reclaims up to 30% of lost data.

*Tip: EZ Toolbox QR Generator automatically locks error correction to Level H whenever you upload or select a brand logo preset. This ensures your code scans flawlessly even if 30% of its center is covered by your logo!*

---

### Best Practices for Designing Scannable, Aesthetic QR Codes

1. **Maintain High Contrast**: Always use a dark color for the foreground blocks (the pixels) and a very light color for the background. Placing a light green foreground on a white background is a recipe for scanning failures.
2. **Quiet Zone Margins**: Leave a clear padding margin around the outer borders of your QR code (normally Level 2 or above). This helps mobile camera lenses recognize where the matrix starts.
3. **Use Vector Formats for Print**: If you plan to print your branded QR code on brochures, roll-up banners, or retail store packaging, always download the vector **SVG format** from our download panel. SVGs scale infinitely without blurring!`
    },
    {
      id: 5,
      title: "The Ultimate Guide to Offline-to-Online (O2O) Marketing with QR Code Analytics",
      summary: "Learn how modern businesses utilize QR Codes on print flyers, business cards, and product packaging to seamlessly bridge offline customers to online websites.",
      slug: "offline-to-online-marketing-qr-codes-guide",
      keywords: "O2O marketing, QR code marketing strategy, print flyers qr code, scan vcard, offline online advertising, business card qr code, free qr scanner",
      date: "July 8, 2026",
      readTime: "8 min read",
      content: `### Bridging the Physical and Digital Worlds with O2O Workflows

For years, offline advertising (billboards, print catalogs, business cards, physical product tags) suffered from attribution problems. It was nearly impossible to measure the exact return on investment (ROI) of a printed newspaper ad.

The **Offline-to-Online (O2O)** marketing movement completely resolves this by placing tailored QR codes directly onto physical print assets. When a consumer scans the card, they are instantly whisked to your digital checkout page, newsletter registration, or contact profile.

---

### Five Highly Effective O2O QR Campaign Templates

1. **Digital Business Cards (vCards)**: Instead of handing out paper cards that end up in the trash, display a vCard QR code on your phone or print a single card. Scanning it instantly populates your name, company, email, phone number, and address directly into the client's phone book.
2. **App Store App Promotion**: If you have a mobile application, generate a single QR code directing to iOS App Store or Google Play Store, making app acquisition frictionless.
3. **Wi-Fi Network Access**: Retailers, hotels, and cafes can display a custom Wi-Fi QR code. Customers scan it to connect to the store internet instantly without typing complicated alphanumeric passwords.
4. **Social Media Multi-Links**: Lead physical customers to your social media ecosystem (Instagram, TikTok, Facebook) using customized profile QR codes.
5. **Direct Payments (UPI / PayPal)**: Display direct checkout codes on restaurant tables or invoices, letting customers settle bills digitally via standard UPI or PayPal.Me pathways.`
    },
    {
      id: 6,
      title: "Understanding QR Code Formats: Static vs Dynamic, vCard Protocols, and Scan Security",
      summary: "Explore the technical foundations of QR codes, difference between permanent static formats and editable dynamic tracks, and security guidelines for scanning unknown codes.",
      slug: "qr-code-formats-static-dynamic-vcard-security",
      keywords: "static vs dynamic qr codes, scan security, qr code security, vcard protocol, wifi qr code format, online qr scanner webcam, free secure qr",
      date: "July 2, 2026",
      readTime: "5 min read",
      content: `### Inside the Matrix: How QR Code Formats Actually Store Data

Quick Response (QR) codes are two-dimensional barcodes that encode information both horizontally and vertically. This allows them to store up to **7,089 numeric characters**—hundreds of times more data than traditional linear barcodes.

However, the way data is formatted defines its final utility and security. In this technical overview, we will demystify common protocols and look at how secure client-side tools protect you.

---

### Static vs. Dynamic QR Codes: Which is Best?

* **Static QR Codes (Permanent)**: 
  * *How they work*: The raw data (e.g., website URL, phone number, text) is encoded directly into the pixel layout.
  * *Pros*: 100% permanent, never expires, completely free, and requires no central redirection servers.
  * *Cons*: If you make a typo in the URL or need to update your link, you must reprint a new QR code.

* **Dynamic QR Codes (Editable)**:
  * *How they work*: The QR code encodes a short redirect link pointing to a proxy server, which then forwards the visitor to the final URL.
  * *Pros*: You can change the destination URL anytime without reprinting the code.
  * *Cons*: If the redirect service goes out of business, your QR code stops working instantly. Many services charge expensive monthly subscription fees.

*EZ Toolbox produces premium static QR codes. This ensures your codes are 100% permanent, free from tracking scripts, and completely secure for lifetime usage!*

---

### Crucial Security Guidelines for Scanning Unknown Codes

Because QR codes are visual matrices, humans cannot "read" where a code links before scanning it. Malicious actors have occasionally covered public codes with redirecting stickers (a practice called *Quishing*).

Follow these safety rules to protect your device:
1. **Never scan anonymous codes** in suspicious public locations.
2. **Use a Secure Preview Scanner**: Avoid using camera apps that open links automatically. Use the **EZ Toolbox QR Code Scanner**! Our tool shows you the raw decoded text or link *before* you click to open it, letting you verify the domain address and proceed with 100% confidence.
3. **Inspect the QR Code Texture**: Ensure there are no stickers pasted over the original printed QR code on public stands.`
    }
  ];

  const compressArticles = [
    {
      id: 7,
      title: "Bulk Image Compression for Google PageSpeed Optimization & Core Web Vitals",
      summary: "Unlock outstanding search rankings by optimizing LCP and FCP metrics. Learn how bulk image compression removes unnecessary megabytes while retaining visual clarity.",
      slug: "bulk-image-compression-google-pagespeed-seo",
      keywords: "bulk image compressor, google pagespeed optimization, core web vitals, LCP FCP, speed up website, SEO image optimizer",
      date: "July 16, 2026",
      readTime: "7 min read",
      content: `### Why Page Speed is the Ultimate Ranking Signal in 2026

When a user clicks on your website from a Google search query, you have less than 2.5 seconds to display your primary contents. If your site takes longer to load, over 53% of mobile visitors will bounce back to the search results. Google explicitly penalizes slow-loading websites by dropping their rankings in favor of faster competitors.

At the core of page loading speed are two critical metrics monitored by Google PageSpeed Insights:
1. **Largest Contentful Paint (LCP)**: Time taken to render the largest visible element (usually a hero image or banner).
2. **First Contentful Paint (FCP)**: Time taken to show the first piece of document content.

Unoptimized images are responsible for over **90% of page loading delays** on modern websites. In this guide, we will explore how bulk image compression can supercharge your site's SEO.

---

### Understanding the Impact of Bulk Image Compression

When you photograph an item with a high-resolution smartphone or DSLR camera, the file is often saved between 4MB and 12MB. While this is great for high-quality printing, it is disastrous for web performance.

Our professional **EZ Image Compressor** lets you drop multiple large images at once, bulk compressing them by up to 90% without visible pixelation. 

By shrinking a folder of 50MB files down to just 2MB:
* **Server Bandwidth Drainage Drops**: Saves host subscription costs.
* **Core Web Vitals Pass Successfully**: Keeps Google algorithms happy.
* **Conversion Rates Spike**: Fast pages convert up to 3x better than slow ones.

---

### Step-by-Step Guide: Compressing Images for Web Optimization

1. **Collect Your Raw Assets**: Gather all PNG screenshots, JPEG banners, and WebP product listings.
2. **Access EZ Image Compressor**: Visit our bulk compressor subdomain at **compress.eztoolbox.xyz**.
3. **Select Compression Quality**: We recommend **80%** as the golden ratio. It retains perfect visual fidelity while discarding microscopic metadata.
4. **Choose Resizing Bounds**: If your camera photo is 4000px wide, scale it down to **1920px (Full HD)** or **1280px (HD)**.
5. **Optimize and Download**: Press **Optimize Images** and download the completed files individually or in bulk.`
    },
    {
      id: 8,
      title: "WebP vs. PNG & JPG: The Ultimate Image Format Comparison for Modern Web Performance",
      summary: "Explore the technical differences between modern next-gen image formats and legacy formats to choose the best configuration for your website.",
      slug: "webp-vs-png-jpg-ultimate-web-performance-guide",
      keywords: "webp vs png vs jpg, convert to webp, next gen image format, lossy vs lossless compression, transparency alpha channel, speed up page loading",
      date: "July 10, 2026",
      readTime: "6 min read",
      content: `### Demystifying Web Image Formats

Choosing the wrong file format for your graphic assets can result in bloated websites and blurry graphics. Understanding the difference between JPEG, PNG, and next-generation formats like WebP is crucial for any developer or digital marketer.

In this comparative analysis, we will look at how each format works and why converting legacy files is the ultimate optimization hack.

---

### Legacy Formats: JPEG and PNG

* **JPEG/JPG (Joint Photographic Experts Group)**:
  * *Compression Type*: Lossy.
  * *Best Used For*: Complex, colorful photographs and realistic gradients.
  * *Pros*: Small file sizes when compressed.
  * *Cons*: Does not support transparent backgrounds (Alpha channel) and degrades in quality on repeated saves.

* **PNG (Portable Network Graphics)**:
  * *Compression Type*: Lossless.
  * *Best Used For*: Line drawings, text overlays, screenshots, and logos requiring transparency.
  * *Pros*: Supports perfect transparency and maintains sharp borders around text.
  * *Cons*: File sizes can be extremely large, especially for high-resolution graphics.

---

### Next-Gen Format: The Power of WebP

Developed by Google, **WebP** is a modern next-generation image format designed to replace both JPEG and PNG.

WebP offers:
1. **Superior Lossless Compression**: WebP lossless images are **26% smaller** than equivalent PNGs.
2. **Outstanding Lossy Compression**: WebP lossy images are **25% to 34% smaller** than equivalent JPEGs with comparable quality.
3. **Alpha Channel Support**: WebP supports transparent backgrounds in both lossy and lossless modes!

*Tip: Using the EZ Image Compressor format dropdown, you can select 'Convert All to WebP' to dynamically transcode your PNGs and JPEGs during compression. This ensures your web assets are fully future-proof and load instantly!*`
    },
    {
      id: 9,
      title: "How Browser-Based Image Compressors Protect Your Data Privacy & Guarantee Security",
      summary: "Discover why local-first browser-based utility tools are safer than traditional cloud-hosted compressors that upload your files to remote database servers.",
      slug: "browser-based-image-compression-privacy-speed",
      keywords: "browser based image compressor, data privacy security, local first utility, zero remote uploads, safe file conversion, private compressor",
      date: "July 1, 2026",
      readTime: "5 min read",
      content: `### The Hidden Risks of Cloud-Based Online Converters

When you use popular online image converters, you are asked to drag your files into their browser boxes. Most users do not realize that these platforms actually **upload your physical files** to their remote cloud servers to process them.

This introduces several serious data privacy risks:
1. **Sensitive Data Exposure**: Screenshots of internal financial dashboards, personal documents, or sensitive family photos are stored on third-party servers.
2. **Data Scraping & Mining**: Some shady free services mine your uploaded graphics or sell analytics metadata.
3. **Security Vulnerabilities**: Remote servers are susceptible to data breaches, exposing your catalog files.

---

### The Local-First Solution: How EZ Toolbox Keeps You Secure

At **EZ Toolbox**, we reject the cloud-upload model entirely. Our **EZ Image Compressor** is designed as a **local-first browser utility**.

Here is how our client-side technology ensures 100% data security:
* **Canvas API Operations**: All pixel decoding, resizing, and encoding are performed locally on your device's processor using HTML5 Canvas sandboxed APIs.
* **Zero Remote Uploads**: Your files are never transferred over the internet. You can even disconnect your internet completely after the page loads and the compressor will continue working flawlessly!
* **Zero Registration or Account Creep**: We do not collect email addresses, sign-ups, or login sessions, eliminating the risk of data compromise.

By keeping image optimization localized, you enjoy instant processing speeds (no waiting for uploads or download queues) and absolute peace of mind.`
    }
  ];

  const ipArticles = [
    {
      id: 10,
      title: "What is My IP Address? Understanding the Differences Between IPv4 & IPv6",
      summary: "Explore the technical foundations of internet protocols. Learn the critical structural differences, address capacities, and security features of IPv4 vs. IPv6.",
      slug: "what-is-my-ip-address-ipv4-vs-ipv6",
      keywords: "what is my ip address, ipv4 vs ipv6 differences, public ip address, internet protocol, subnet mask, trace ipv4 address, network adapter",
      date: "July 17, 2026",
      readTime: "6 min read",
      content: `### The Fundamentals of Internet Protocols

An IP (Internet Protocol) address is a unique numerical sequence assigned to every device connected to a computer network. Just like a physical home address ensures your mail reaches the correct door, an IP address ensures that packets of data find their correct destination across the global web.

Currently, two versions of the Internet Protocol coexist: **IPv4** and **IPv6**. In this guidebook, we will dive into what makes them different and why the world is transitioning to the newer protocol.

---

### IPv4: The Legacy Standard

Introduced in 1983 by ARPANET, **IPv4** remains the most widely recognized IP address format. 

* **Structure**: A 32-bit address space, written in dot-decimal notation (e.g., \`8.8.8.8\`). It consists of four octets separated by dots, each decimal ranging from 0 to 255.
* **Address Capacity**: It supports exactly **4.29 billion** unique addresses (\`2^32\`).
* **The IPv4 Exhaustion Crisis**: In the 1980s, four billion addresses seemed infinite. However, with the explosion of smartphones, IoT devices, smart TVs, and cloud servers, the global pool of unallocated public IPv4 addresses was officially exhausted in 2011.

---

### IPv6: The Future-Proof Solution

To solve the address depletion crisis, the Internet Engineering Task Force (IETF) designed **IPv6**.

* **Structure**: A 128-bit address space, represented in hexadecimal notation separated by colons (e.g., \`2001:4860:4860::8888\`).
* **Address Capacity**: It supports **340 undecillion** unique addresses (\`2^128\`). This is a number so astronomical that every grain of sand on Earth could be allocated trillions of unique IP addresses!
* **Built-in Security**: IPv6 was designed with IPSec (Internet Protocol Security) support as a native requirement, facilitating secure end-to-end encryption.

Using our free **EZ IP & Location Finder**, you can instantly check whether your current ISP connection is routing you through a traditional IPv4 address or a next-generation IPv6 address with a single tap!`
    },
    {
      id: 11,
      title: "How Accurate is IP Geolocation? Inside GPS, Wi-Fi, and ISP Database Mapping",
      summary: "Understand how geolocation engines estimate your physical city and country. Discover the accuracy limits, privacy boundaries, and mechanics of IP routing registers.",
      slug: "ip-geolocation-accuracy-gps-wifi-mapping",
      keywords: "ip geolocation accuracy, find my location, trace coordinates, cell tower triangulation, wi-fi positioning system, MaxMind IP registry database, coordinate tracing",
      date: "July 12, 2026",
      readTime: "5 min read",
      content: `### How Web Apps Estimate Your Physical Location

When you load a website like **EZ Toolbox** and see your city and country instantly displayed on a map, no satellite GPS is actively querying your device's chips. Instead, the system relies on a technology known as **IP Geolocation**.

But how does checking a series of numbers like \`103.45.12.19\` translate to a dot on a map? Let's peel back the layers of digital location tracking.

---

### The Mechanics of IP Geolocation Databases

IP addresses are not distributed at random. They are allocated in massive sequential blocks to Internet Service Providers (ISPs) by Regional Internet Registries (RIRs) like ARIN, RIPE, and APNIC.

Specialized lookup databases (such as MaxMind, DB-IP, and IPinfo) index these registry allocations, matching IP ranges with geographic properties:
1. **Country & Continent Level**: Over **99% accurate**. It is virtually impossible to disguise your country of origin without using a VPN proxy.
2. **City & Region Level**: Around **80% to 90% accurate**. The database matches your IP to your ISP's nearest central routing exchange or local hub, which might be a few miles away from your actual home.
3. **Street Coordinate Level**: Extremely low accuracy. IP databases do **NOT** know your physical house or apartment number. The latitude and longitude coordinates returned are simply the geographic center point of your city or ZIP code.

---

### GPS vs. Wi-Fi Positioning vs. IP Geolocation

To understand the spectrum of digital mapping, look at the three main location techniques:
* **Satellite GPS**: Decodes radio signals from orbital satellites. Accuracy: **3 to 10 meters**. Requires direct line of sight.
* **Wi-Fi Positioning System (WPS)**: Triangulates nearby Wi-Fi MAC addresses in public router indexes. Accuracy: **10 to 50 meters**. Works indoors.
* **IP Geolocation**: Queries global registry databases based on network traffic hops. Accuracy: **500 meters to 10 kilometers**. Requires zero hardware permissions.

Our tool utilizes secure database registries to pull your estimated location instantly, map it via open-source OpenStreetMap APIs, and safeguard your actual, physical house-level privacy.`
    },
    {
      id: 12,
      title: "Understanding Internet Service Providers (ISPs), ASNs, and Global Packet Routing",
      summary: "Learn how data packets navigate the backbone of the internet. Demystify Autonomous System Numbers (ASNs) and how your ISP connects you to global servers.",
      slug: "understanding-internet-isps-asns-routing",
      keywords: "internet service provider, ASN lookup, autonomous system number, data packet routing, internet backbone, border gateway protocol, ping latency test",
      date: "July 5, 2026",
      readTime: "7 min read",
      content: `### The Internet Backbone: A Network of Networks

The internet is not a single cloud. It is a massive, interconnected tapestry of over 70,000 independent networks. These networks—ranging from local university hubs and corporate networks to massive commercial Internet Service Providers (ISPs) like Comcast, AT&T, and PTCL—interconnect to trade traffic.

How do billions of devices coordinate data transfers across this global maze without collapsing into chaos? The answer lies in **ASNs** and **BGP Routing**.

---

### What is an Autonomous System Number (ASN)?

An **Autonomous System (AS)** is a collection of connected IP routing prefixes controlled by a single administrative entity (like an ISP, a government, or a massive tech company like Google).

To participate in global routing, each Autonomous System is assigned a unique identifier called an **Autonomous System Number (ASN)**. For example:
* **AS15169**: Assigned to Google LLC.
* **AS16509**: Assigned to Amazon.com.
* **AS13335**: Assigned to Cloudflare.

When you perform a lookup on the **EZ IP Finder**, you will notice a field named "Registry ASN". This indicates the exact ASN governing your current connection.

---

### How Packets Travel: The Border Gateway Protocol (BGP)

Data packets do not take a straight path. They hop through routers from one Autonomous System to another.

The decision of which path to take is made dynamically by the **Border Gateway Protocol (BGP)**. BGP acts like a real-time GPS for data packets, choosing the most efficient, cost-effective, and active network hops to route your queries across the globe in milliseconds.

If you experience high load times, it is usually because BGP is routing your traffic through heavily congested hops. By running our integrated **Ping Connection Diagnostics** tool, you can check your live connection latencies directly to major global networks in real-time!`
    }
  ];

  const converterArticles = [
    {
      id: 13,
      title: "How Live Currency Exchange Rates Work & Sourcing Real-Time Global Feeds",
      summary: "Understand the financial mechanisms behind real-time exchange rates, mid-market interbank pricing, and how digital converters synchronize global currency feeds instantly.",
      slug: "currency-exchange-rates-calculation-live-rates",
      keywords: "live currency converter, real-time exchange rates, global interbank rate, usd to pkr, usd to inr, forex rates api, currency calculation offline",
      date: "July 19, 2026",
      readTime: "6 min read",
      content: `### Sourcing the Pulse of Global Foreign Exchange Markets

Have you ever wondered why currency rates fluctuate second-by-second on Google? The foreign exchange (Forex) market is the largest, most liquid financial market in the world, trading over $7.5 trillion daily. Unlike stock markets, Forex has no centralized exchange; it operates through a global network of banks, brokers, and financial institutions known as the **interbank market**.

In this guide, we will pull back the curtain on how live exchange rates are formulated, how mid-market rates are calculated, and how our **EZ Universal Converter** synchronizes directly with international interbank feeds.

---

### What is the Mid-Market Rate and Why Does it Matter?

When you search for a currency pair (like USD to PKR or USD to INR), search engines display the **mid-market rate** (also known as the real exchange rate).

* **The Bid Rate**: The maximum price a buyer is willing to pay for a currency.
* **The Ask Rate**: The minimum price a seller is willing to accept for that currency.
* **The Mid-Market Rate**: The exact midpoint between the Bid and Ask rates on global interbank markets.

Most retail banks, airport exchange booths, and credit card companies add a hidden markup (often 2% to 5%) to this rate to make a profit. Our **Live Google Rate Sync Utility** bypasses retail markups, retrieving the raw, unfiltered mid-market rates so you can calculate with true institutional precision.

---

### How Offline Rate Caching Protects Your Productivity

To guarantee uninterrupted performance, our currency converter implements intelligent client-side caching:

1. **Instant Sync**: On page load, the converter fires a secure asynchronous request to our optimized interbank rate proxy.
2. **Local Caching**: The fetched rates are saved in your local session.
3. **Graceful Fallback**: If you go offline, enter a basement with poor Wi-Fi, or travel on an airplane, the tool automatically falls back to our high-precision preloaded cached rates. You can continue calculating and converting currency pairs without any interruptions!`
    },
    {
      id: 14,
      title: "The Importance of Accurate Scientific Unit Conversions in Engineering & Trade",
      summary: "Discover why precision in converting imperial measurements (inches, pounds) to metric standards (centimeters, kilograms) is critical for international trade and scientific projects.",
      slug: "importance-of-accurate-scientific-unit-converters",
      keywords: "scientific unit converter, imperial to metric conversion, grams to kilograms, inches to centimeters, precision engineering, weight converter, length distance translator",
      date: "July 15, 2026",
      readTime: "5 min read",
      content: `### The Cost of a Mathematical Typo: Imperial vs. Metric Systems

In 1999, NASA’s Mars Climate Orbiter disintegrated in the Martian atmosphere. The root cause? One engineering team used imperial units (pound-force seconds), while another team used metric units (Newton seconds) to calculate thruster impulses. This single unit mismatch cost $327 million and years of research.

Whether you are a developer calculating CSS pixel boundaries, an international merchant shipping freight in pounds (lbs) and kilograms (kg), or an engineer designing hardware, **precision unit converters are an absolute necessity**.

---

### Understanding the Imperial and Metric Standards

* **The Metric System (SI - International System of Units)**: Used by 95% of the world. Built on decimal bases (multiples of 10), making scientific scaling logical and straightforward (e.g., millimeters, centimeters, meters, kilometers).
* **The Imperial System (US Customary)**: Predominantly used in the United States and Liberia. It relies on arbitrary historical subdivisions (e.g., 12 inches in a foot, 3 feet in a yard, 16 ounces in a pound).

Our **EZ Scientific Converter** bridges this gap, giving you instant, rounded bento-grid outputs across both standards as you type:

| Measurement Type | Source Unit | Target Unit | Scientific Formula |
|---|---|---|---|
| **Weight / Mass** | Pounds (lb) | Kilograms (kg) | 1 lb = 0.45359237 kg |
| **Weight / Mass** | Ounces (oz) | Grams (g) | 1 oz = 28.3495231 g |
| **Length / Distance**| Inches (in) | Centimeters (cm) | 1 in = 2.54 cm |
| **Length / Distance**| Feet (ft) | Meters (m) | 1 ft = 0.3048 m |

---

### Interactive Bento Grids for Immediate Analysis

Unlike old-school drop-down converters where you can only view one conversion pair at a time, our modern **Bento Grid Layout** displays immediate converted values across **all scientific and imperial categories simultaneously**. One look gives you milligrams, inches, yards, kilograms, and ounces all at once!`
    },
    {
      id: 15,
      title: "How to Leverage Interactive Financial Calculators to Streamline Business Operations",
      summary: "Learn how to use nested parentheses, percentage shortcuts, and history tapes in modern calculators to speed up retail pricing and bookkeeping workflows.",
      slug: "how-to-use-interactive-financial-calculators",
      keywords: "interactive calculator online, business financial calculator, percentage calculation shortcuts, calculator history tape, browser calculations, clear history tape",
      date: "July 10, 2026",
      readTime: "5 min read",
      content: `### Accelerating Everyday Math with Modern Web Interfaces

Even in the era of advanced spreadsheets, a physical or simple interactive calculator remains the fastest way to perform rapid operations, check invoice totals, or calculate retail discounts.

However, standard smartphone calculators often lack advanced client-side tracking, leaving you with no way to double-check your previous inputs if you get distracted. Our **EZ Interactive Calculator** is engineered with a **History Tape Receipt Engine** to completely optimize your daily financial workflows.

---

### Mastering Calculator Operators & Shortcuts

Our calculator supports complete physical keyboard mapping alongside its touch-optimized layout:

* **Nested Parentheses \`(\` and \`)\`**: Essential for maintaining mathematical order of operations (PEMDAS). For example, entering \`200 * (1 - 15%)\` quickly computes a 15% discount on a $200 invoice.
* **Instant Percentage Shortcuts \`%\`**: Typing a number followed by \`%\` automatically scales it to its hundredth decimal representation, removing the need to type extra division operations.
* **Live Keyboard Status**: Simply click anywhere on the calculator screen and start typing on your physical keypad. Standard numbers, decimals, backspaces, and the Enter key map natively to their operational counterpart!

---

### The History Tape: Your Audit Trail

Every time you press the \`=\` key or hit Enter, the equation and its formatted outcome are securely logged onto your **Scrollable History Tape**.

* **Prevent Repetitive Calculation**: If you need to re-verify a previous invoice sum, simply scroll up on the tape.
* **Instant Recall**: Click on any past calculation in the history tape to automatically load it back into your main active input line.
* **Complete Data Control**: Clear your history tape at any time with a single click to maintain pristine client-side security.`
    }
  ];

  const tiktokArticles = [
    {
      id: 16,
      title: "How to Download TikTok Videos Without Watermark in HD: Step-by-Step Guide",
      summary: "Learn how TikTok's server architecture adds watermarks to downloaded videos and how you can bypass them using secure proxy downloads to get crystal-clear MP4s.",
      slug: "how-to-download-tiktok-videos-without-watermark",
      keywords: "download tiktok without watermark, tiktok video downloader, save tiktok videos, tiktok no watermark hd, free online tiktok downloader, premium proxy download, ez tiktok downloader",
      date: "July 20, 2026",
      readTime: "6 min read",
      content: `### Demystifying the TikTok Watermark: Why It Exists and How It Works

If you have ever clicked "Save Video" directly within the official TikTok mobile app, you have undoubtedly noticed the bouncing TikTok logo watermark overlay along with the creator's username. While this is an excellent tool for attribution and content protection within TikTok's ecosystem, it poses major limitations for content creators who wish to repurpose their original high-production videos for other platforms like YouTube Shorts, Instagram Reels, or Pinterest Pins.

In this guide, we will break down the engineering behind TikTok's CDN watermarking process and walk you through how our **EZ TikTok Downloader** retrieves the pristine, raw, high-definition (HD) version of any public post.

---

### How TikTok's Server-Side Watermarking Works

When you upload a video to TikTok, their media encoders compile multiple variants:
1. **Raw Source Variant**: The original uploaded video stream preserved in high definition (stored securely in TikTok's cloud servers).
2. **CDN Watermarked Variant**: A rendered version where a moving watermark is dynamically burned into the video tracks using video processing algorithms (FFmpeg-based processing).

When a standard browser or mobile device requests a direct video file from the TikTok Content Delivery Network (CDN) without the correct authorization headers or token payloads, TikTok's system acts conservatively and serves the watermarked variant as a fallback. 

---

### Bypassing Watermarks Safely: Direct Links vs. Proxy Downloads

Our tool provides two primary mechanisms to save your videos:

1. **Download (Proxy) - *Recommended for 100% Watermark-Free Video***:
   * **The Mechanism**: Clicking our "Download (Proxy)" button instructs our secure back-end cloud server to authenticate directly with TikTok's video streams using premium API credentials. Our server pretends to be a high-performance video player, fetches the original un-watermarked high-definition MP4 stream directly, and routes the data packets straight to your device's browser download pipeline.
   * **The Benefit**: This guarantees you receive a clean, 1080p high-definition MP4 with zero watermarks, ready to be edited and repurposed immediately.

2. **Direct CDN Links**:
   * **The Mechanism**: This button opens a direct hyperlink pointing straight to TikTok's CDN databases. 
   * **The Catch**: While fast, since this bypasses our proxy server, TikTok's CDN will detect that you are opening the video directly in a standard web browser and may serve the watermarked file instead. 

---

### Step-by-Step: Repurposing Your TikTok Content

1. **Copy the Share Link**: Open TikTok on your mobile phone or browser, tap the **Share** button on any public video, and click **Copy Link**.
2. **Enter in EZ Downloader**: Open the **EZ TikTok Downloader**, paste the copied link into our clean, single-screen input field, and tap **Extract Details**.
3. **Download with Proxy**: Once the analysis completes, click the **Download (Proxy)** button on either the **Standard Video** or **Ultra HD Video** format cards.
4. **Repurpose**: Upload your clean, water-mark free MP4 to YouTube Shorts, Instagram Reels, or Snapchat Spotlight and watch your multi-platform reach skyrocket!`
    },
    {
      id: 17,
      title: "How to Extract High-Quality MP3 Audio & Background Music From TikTok",
      summary: "Discover how to capture viral TikTok sound bites and extract background music directly into pristine 320kbps MP3 audio files for offline listening or video editing.",
      slug: "how-to-extract-high-quality-mp3-from-tiktok",
      keywords: "extract tiktok mp3, tiktok to audio converter, save tiktok background music, viral tiktok sounds download, high quality tiktok mp3, audio extractor online, ez toolbox",
      date: "July 20, 2026",
      readTime: "5 min read",
      content: `### Capturing the Sound of Pop Culture: TikTok's Audio Revolution

TikTok is just as much an auditory platform as it is a visual one. From viral mashups and sped-up remixes to original indie soundtracks, the audio tracks of TikTok define modern pop music trends. In fact, many songs that climb the Billboard charts owe their success entirely to trending audio challenges on TikTok.

Whether you are a music enthusiast wanting to save a rare remix for offline listening, or a content creator needing a specific transition sound effect for your next video editing project, extracting the audio track is highly useful. In this masterclass, we will learn how to extract pristine, high-fidelity MP3 files from any public TikTok post.

---

### The Anatomy of a TikTok Audio Stream

Every TikTok post is associated with a specific music object:
* **Original Sound Tracks**: Sourced directly from the user's uploaded video microphone stream.
* **Commercial Music Tracks**: Authorized music licensed by record labels and overlaid onto the post.

When you use the **EZ TikTok Downloader**, our system extracts the metadata of the background track, including the **Artist Name**, **Track Title**, and the raw **Audio CDN stream**. Our downloader accesses the highest-bitrate stream available (up to 320kbps) and encapsulates it inside an optimized digital container.

---

### Why Direct Audio Downloads Save Data & Time

Converting a full video into an audio format on your device is slow and wastes data. Our tool streamlines this by identifying the exact audio track on TikTok's CDN servers before downloading:
1. **Zero Transcoding Delay**: Instead of downloading a massive video file and manually stripping the video tracks, our tool fetches the native audio stream directly.
2. **Save Bandwidth**: Audio files are typically only 1MB to 3MB in size, compared to high-definition video files which can easily exceed 20MB to 50MB. This is highly beneficial if you are downloading on mobile networks or capped data plans.
3. **Universal Compatibility**: The extracted MP3 or M4A file is universally compatible with all modern smartphones, car audio systems, editing suites (Premiere, CapCut, DaVinci Resolve), and music players.

---

### How to Save a Sound Track to Your Phone

1. **Extract details**: Paste your target video's share link into the **EZ TikTok Downloader** input.
2. **Select Audio Card**: Scroll down to the **Extract Background Music (MP3)** download option.
3. **Proxy Download**: Click the **Download MP3 (Proxy)** button to securely route the file through our server, giving you a perfectly formatted audio file named after the video's creator and audio title.
4. **Direct Playback**: Alternatively, you can click **Direct Audio Link** to open the audio stream in a clean background browser tab where you can play it immediately or save it with a simple right-click.`
    },
    {
      id: 18,
      title: "The Ultimate TikTok Downloader: Unlimited Full HD & Cover Art Saves",
      summary: "Compare the top methods of saving TikTok media. Learn how our single-page, ad-optimized tool lets you grab HD videos, original audio, and cover art with zero speed limits.",
      slug: "best-tiktok-downloader-unlimited-full-hd-saves",
      keywords: "best tiktok downloader, unlimited tiktok saves, high resolution cover art download, download tiktok thumbnail, full hd video downloader, ez toolbox, download tiktok free",
      date: "July 20, 2026",
      readTime: "7 min read",
      content: `### The Search for a Clean, Unlimited Downloader: The Problem with Common Sites

The internet is flooded with online TikTok downloaders. However, if you have ever used them, you are likely familiar with their typical drawbacks:
* **Intrusive Ads and Redirection**: Clicking a download button often opens multiple pop-under spam tabs or deceptive virus warning modals.
* **Artificial Speed Caps**: Slowing down your download to force you to purchase a premium subscription.
* **Low-Resolution Output**: Restricting watermark-free downloads to low-quality 480p streams while locking HD options behind paywalls.
* **No Metadata Retrieval**: Forcing generic filenames like \`download_18293712.mp4\`, which makes organizing files a nightmare.

Our **EZ TikTok Downloader** was created to challenge this standard. It is fully integrated into the **EZ Toolbox suite**, providing a clean, single-screen, lightning-fast utility designed for power users, social media managers, and archivists.

---

### Key Advantages of the EZ TikTok Downloader

Our suite is engineered to provide a premium desktop-grade utility experience on both mobile and desktop viewports:

| Feature | Typical Downloaders | EZ TikTok Downloader |
|---|---|---|
| **HD Resolution** | Limited/Upscaled 720p | Full 1080p Ultra HD |
| **Download Limits** | Capped per hour/IP | 100% Unlimited |
| **Speed Limits** | Capped at 500 KB/s | Uncapped (Full Connection Speed) |
| **Audio Extraction** | Low Quality Mono | High Bitrate Stereo MP3 |
| **Cover Art / Thumbnails**| Not Supported | Original High-Res Cover JPEG |
| **File Naming** | Random strings of numbers | Custom: \`[Creator_Username]_[type].mp4\` |

---

### Retrieving Original Cover Art & Thumbnails

Why would you want to download a TikTok's cover artwork?
For content managers and curators, having access to the high-resolution cover image is essential for creating:
1. **Engaging Video Thumbnails**: Use the high-quality original JPEG frame to design thumbnails for YouTube Shorts or blog post banners.
2. **Content Archives**: Catalog video collections visually inside Notion databases or local drives with high-resolution thumbnail cards.
3. **Social Media Previews**: Ensure links render beautifully across platforms by extracting and attaching the native high-res cover image.

To download the original thumbnail, simply navigate to the **Original Video Cover Image** section of our tool and select **Download Cover (Proxy)** to instantly fetch and save the high-resolution JPEG to your device.`
    }
  ];

  const articles = subdomainView === "qr" 
    ? qrArticles 
    : subdomainView === "compress" 
      ? compressArticles 
      : subdomainView === "ip"
        ? ipArticles
        : subdomainView === "converter"
          ? converterArticles
          : subdomainView === "tiktok"
            ? tiktokArticles
            : youtubeArticles;

  return (
    <div className="space-y-8" id="seo-pages-container">
      {/* Back to Home Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
        <button
          onClick={() => setCurrentPage("home")}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/20 transition-all cursor-pointer"
          id="back-to-home-btn"
        >
          <ArrowLeft className="h-4 w-4" /> Return to {
            subdomainView === "qr" ? "QR Generator Dashboard" :
            subdomainView === "compress" ? "Compressor Dashboard" :
            subdomainView === "ip" ? "IP Finder Dashboard" :
            subdomainView === "converter" ? "Converter Dashboard" :
            subdomainView === "tiktok" ? "TikTok Downloader Dashboard" :
            "Analyzer Dashboard"
          }
        </button>
        <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 dark:text-neutral-500">
          EZ Toolbox • {currentPage} page
        </span>
      </div>

      {/* ---------------------------------------------------- */}
      {/* PAGES 1: ABOUT US PAGE (SEO OPTIMIZED)               */}
      {/* ---------------------------------------------------- */}
      {currentPage === "about" && (
        <div className="max-w-4xl mx-auto space-y-6" id="about-us-view">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Our Mission</span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                {subdomainView === "qr" ? "About EZ Toolbox: The Professional QR Code & Custom Branding Utility" :
                 subdomainView === "compress" ? "About EZ Toolbox: The Privacy-First Bulk Image Compression Engine" :
                 subdomainView === "ip" ? "About EZ Toolbox: The Instant IP Geolocation & Routing Intelligence Center" :
                 subdomainView === "converter" ? "About EZ Toolbox: The Real-Time Universal Currency & Units Converter" :
                 "About EZ Toolbox: The Ultimate YouTube SEO & Analytics Engine"}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Welcome to <strong>EZ Toolbox</strong>, the industry-leading digital toolkit engineered to simplify and optimize your day-to-day workflow. We design professional-grade, lightweight web utilities focused on {
                subdomainView === "qr" ? "creating visually beautiful, custom-styled secure QR codes with logo embedding" :
                subdomainView === "compress" ? "performing rapid, offline-first bulk image compression to enhance Core Web Vitals" :
                subdomainView === "ip" ? "providing detailed IPv4/IPv6 address properties, IP geolocation mapping, and ISP network statistics" :
                subdomainView === "converter" ? "providing real-time interbank currency exchange conversions, precision length/weight translators, and mathematical history calculators" :
                "search engine optimization, video metadata extraction, channel analytics auditing, and high-performance branding assets"
              }.
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Our flagship <strong>{
                subdomainView === "qr" ? "QR Code Creator" :
                subdomainView === "compress" ? "Bulk Image Optimizer" :
                subdomainView === "ip" ? "IP Geolocation Finder" :
                subdomainView === "converter" ? "Universal Converter & Calculator" :
                "YouTube Analyzer and SEO Extractor"
              }</strong> addresses the core bottlenecks that our users face daily: {
                subdomainView === "qr" ? "crafting trustable branded codes, embedding vector logos, choosing error correction levels, and downloading scalable SVGs." :
                subdomainView === "compress" ? "reducing bloated camera photographs and banners, resizing width proportions, and transcoding files into next-generation WebP." :
                subdomainView === "ip" ? "inspecting routing networks, tracing latitude/longitude centers, identifying network registry ASNs, and testing ping latencies." :
                subdomainView === "converter" ? "retrieving genuine Google mid-market rates, converting pounds to kilograms, measuring inches to centimeters, and tracking calculations." :
                "locating high-performing competitor tags, analyzing metadata quality, downloading pristine thumbnails, auditing monetization status, and tracking historical channel subscriber growth."
              }
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-100 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" /> Privacy & Local-First Security
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  We believe in keeping your details safe. All calculated inputs, loaded images, and active conversions remain cached purely in your local browser storage. We never log your actions, inputs, or private metadata on remote external databases.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-100 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-500" /> SEO-Driven Utility Design
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Each tool is engineered to satisfy strict visual guidelines, SEO metadata checklists, and ultra-fast client-side processing speeds. Increase search engine ranks and load speeds with our highly optimized modules.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white tracking-tight">Our Core Development Philosophy</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                EZ Toolbox was built to challenge bulky, slow, and expensive subscription-based tools. By streamlining requests through sandboxed client-side logic and highly optimized APIs, we deliver immediate, high-fidelity results in a lightning-fast interface that works flawlessly across all mobile, tablet, and desktop viewports.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGES 2: ARTICLES / BLOG SECTION (SEO CONTENT)       */}
      {/* ---------------------------------------------------- */}
      {currentPage === "articles" && (
        <div className="max-w-4xl mx-auto space-y-6" id="articles-view">
          {selectedArticle === null ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                  {subdomainView === "qr" ? "Scan and Connect" :
                   subdomainView === "compress" ? "Optimize and Load" :
                   subdomainView === "ip" ? "Locate and Secure" :
                   subdomainView === "converter" ? "Convert and Calculate" :
                   subdomainView === "tiktok" ? "Download and Repurpose" :
                   "Learn and Rank"}
                </span>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                  {subdomainView === "qr" ? "Expert QR Code Branding & Marketing Guidebooks" :
                   subdomainView === "compress" ? "Expert Web Performance & Image Optimization Guides" :
                   subdomainView === "ip" ? "Expert Geolocation, Networking & Security Guidebooks" :
                   subdomainView === "converter" ? "Expert Unit Conversion & Financial Calculators" :
                   subdomainView === "tiktok" ? "Expert TikTok Downloader & Repurposing Guidebooks" :
                   "Expert YouTube Growth Articles & SEO Guidebooks"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                  {subdomainView === "qr" ? "Master offline-to-online (O2O) marketing, customize QR codes with logos, choose correct formatting, and scale scan conversions." :
                   subdomainView === "compress" ? "Boost your Google PageSpeed scores, optimize Core Web Vitals, learn the differences between WebP and PNG/JPG formats, and preserve image quality." :
                   subdomainView === "ip" ? "Demystify IPv4 vs IPv6 routing, inspect network ASN allocations, understand ISP nodes, and run accurate ping latency diagnostics." :
                   subdomainView === "converter" ? "Sync live mid-market interbank forex feeds, understand scientific weight/distance scales, and master calculators for bookkeeping." :
                   subdomainView === "tiktok" ? "Learn how to bypass watermarks on downloaded videos, extract original background MP3 sounds, and save high-resolution cover artwork." :
                   "Master the algorithms, check monetization parameters, extract valuable search terms, and increase your CPM rates with our targeted articles."}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6" id="blog-articles-grid">
                {articles.map((article) => (
                  <article 
                    key={article.id} 
                    className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-md cursor-pointer group"
                    onClick={() => setSelectedArticle(article.id)}
                    id={`blog-card-${article.id}`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-neutral-800/60 flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      <span>Read Article</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            (() => {
              const article = articles.find(a => a.id === selectedArticle)!;
              return (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-6" id="active-article-read">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white bg-slate-50 dark:bg-neutral-950 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-neutral-800 transition-all cursor-pointer mb-2"
                    id="back-to-articles-list"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Articles List
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h1 className="font-display font-extrabold text-xl md:text-2xl text-gray-950 dark:text-white tracking-tight leading-snug">
                      {article.title}
                    </h1>
                    <div className="p-3 bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800 rounded-xl">
                      <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Target Search Keywords / SEO Focus:</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">{article.keywords}</span>
                    </div>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium space-y-4 pt-4 border-t border-slate-100 dark:border-neutral-800">
                    {article.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("### ")) {
                        return <h3 key={i} className="font-display font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight pt-3 block">{para.replace("### ", "")}</h3>;
                      }
                      if (para.startsWith("* **") || para.startsWith("* ")) {
                        return (
                          <ul key={i} className="list-disc list-inside pl-2 space-y-1 my-2">
                            {para.split("\n").map((li, j) => {
                              const cleanLi = li.replace("* ", "").trim();
                              // Parse bold tags
                              if (cleanLi.includes("**")) {
                                const parts = cleanLi.split("**");
                                return (
                                  <li key={j} className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    <strong>{parts[1]}</strong>{parts.slice(2).join("")}
                                  </li>
                                );
                              }
                              return <li key={j} className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cleanLi}</li>;
                            })}
                          </ul>
                        );
                      }
                      if (para.startsWith("| ")) {
                        // Render simple table dynamically
                        const rows = para.split("\n").filter(row => row.trim().startsWith("|"));
                        const headerRow = rows[0];
                        const dataRows = rows.slice(2); // Skip header and separator rows

                        const headers = headerRow.split("|").map(c => c.trim()).filter(Boolean);

                        return (
                          <div key={i} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                            <table className="w-full text-left border-collapse text-[10px] md:text-xs">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-neutral-950 font-bold border-b border-slate-200 dark:border-neutral-800">
                                  {headers.map((header, hIdx) => (
                                    <th key={hIdx} className="p-3">{header.replace(/\*\*/g, "")}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/40">
                                {dataRows.map((row, rIdx) => {
                                  const cols = row.split("|").map(c => c.trim()).filter(Boolean);
                                  if (cols.length === 0) return null;
                                  return (
                                    <tr key={rIdx} className="hover:bg-slate-50/40 dark:hover:bg-neutral-900/30">
                                      {cols.map((col, cIdx) => (
                                        <td 
                                          key={cIdx} 
                                          className={`p-3 ${
                                            cIdx === 0 
                                              ? "font-semibold text-gray-900 dark:text-white" 
                                              : cIdx === 1 
                                                ? "font-mono font-bold text-emerald-600 dark:text-emerald-400" 
                                                : "text-gray-500 dark:text-gray-400"
                                          }`}
                                        >
                                          {col.replace(/\*\*/g, "")}
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      if (para.startsWith("*Tip:")) {
                        return (
                          <div key={i} className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-amber-800 dark:text-amber-400 text-xs italic my-3 font-semibold">
                            {para}
                          </div>
                        );
                      }
                      // Regular paragraph, process basic formatting
                      let contentNode: React.ReactNode = para;
                      if (para.includes("**")) {
                        const parts = para.split("**");
                        contentNode = parts.map((part, pIdx) => {
                          if (pIdx % 2 === 1) return <strong key={pIdx} className="font-bold text-gray-950 dark:text-white">{part}</strong>;
                          return part;
                        });
                      }
                      return <p key={i} className="leading-relaxed text-gray-600 dark:text-gray-300">{contentNode}</p>;
                    })}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGES 3: CONTACT US PAGE (WITH EXPLICIT DETAILS)     */}
      {/* ---------------------------------------------------- */}
      {currentPage === "contact" && (
        <div className="max-w-2xl mx-auto space-y-6" id="contact-us-view">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Get In Touch</span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                Contact EZ Toolbox Support
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Have questions about video analyzer quotas, API configurations, or partnership proposals? Reach out directly through our verified channels below!
              </p>
            </div>

            <div className="grid gap-4 pt-4" id="contact-methods-grid">
              {/* WhatsApp Support */}
              <a 
                href="https://wa.me/923017480809?text=Hello%20EZ%20Toolbox%20Support!" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-4 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 border border-emerald-500/20 rounded-xl transition-all group"
                id="contact-whatsapp"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-gray-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Official WhatsApp Support
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                    +92 301 7480809
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Click to start direct chat (Avg. response under 2 hours)
                  </p>
                </div>
              </a>

              {/* Email Support */}
              <a 
                href="mailto:raorafique2010@gmail.com" 
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-900/60 border border-slate-200/60 dark:border-neutral-800 rounded-xl transition-all group"
                id="contact-email"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-200 text-gray-700 dark:bg-neutral-800 dark:text-gray-300 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-gray-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Email Support Desk
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                    raorafique2010@gmail.com
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-semibold mt-0.5">
                    Send feedback, bug reports, and business inquiries.
                  </p>
                </div>
              </a>

              {/* WhatsApp Broadcast Channel */}
              <a 
                href="https://whatsapp.com/channel/0029VbCmqXdFnSzBpUgQzz1T" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-4 p-4 bg-blue-500/10 hover:bg-blue-500/20 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border border-blue-500/20 rounded-xl transition-all group"
                id="contact-whatsapp-channel"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Official WhatsApp Channel
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    Join our broadcast network for updates on new SEO utilities, algorithmic shifts, and digital tactics.
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5 flex items-center gap-1">
                    Follow Broadcast Channel <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGES 4: PRIVACY POLICY PAGE (SEO TRUST)             */}
      {/* ---------------------------------------------------- */}
      {currentPage === "privacy" && (
        <div className="max-w-4xl mx-auto space-y-6" id="privacy-policy-view">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 dark:border-neutral-800 pb-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">AdSense Compliance</span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                Privacy Policy
              </h2>
              <p className="text-xs text-gray-400 dark:text-neutral-500 font-mono">Last updated: July 7, 2026</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              <p>
                At EZ Toolbox, accessible from our public web pages, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by our platform and how we use it securely.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">1. Local Storage and Client-Side Storage</h4>
              <p>
                EZ Toolbox uses local storage (specifically <code>localStorage</code>) on your machine to store non-sensitive preferences such as Dark Mode settings and custom YouTube API v3 keys. We <strong>do not transfer</strong>, save, or sync these keys onto remote external databases. All API operations happen live on your browser or are securely proxied.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">2. Log Files and Analytical Data</h4>
              <p>
                Like most standard web servers, we follow a standard procedure of utilizing log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">3. Google API Services Compliance</h4>
              <p>
                Our platform integrates with the <strong>YouTube Data API v3</strong>. By using our services, you agree to be bound by the YouTube Terms of Service and Google Privacy Policy. We only fetch public metadata (such as view counts, channel descriptions, tags, and video durations). No private user account modifications are performed.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">4. Third-Party Advertising (Google AdSense)</h4>
              <p>
                Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on EZ Toolbox. These are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGES 5: TERMS & CONDITIONS PAGE                     */}
      {/* ---------------------------------------------------- */}
      {currentPage === "terms" && (
        <div className="max-w-4xl mx-auto space-y-6" id="terms-view">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 dark:border-neutral-800 pb-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">User Agreement</span>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                Terms and Conditions
              </h2>
              <p className="text-xs text-gray-400 dark:text-neutral-500 font-mono">Last updated: July 7, 2026</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              <p>
                Welcome to EZ Toolbox! These terms and conditions outline the rules and regulations for the use of our website and utilities. By accessing this website, we assume you accept these terms and conditions. Do not continue to use EZ Toolbox if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">1. Use of Public YouTube Tools</h4>
              <p>
                Our video tag extractor, thumbnail downloader, and channel metrics analyzer are public-facing features designed for research, SEO analysis, and educational curation. You agree not to exploit these services for massive automated scrapers, denial-of-service (DoS) attacks, or any actions that breach YouTube API quotas.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">2. API Key Quota Liability</h4>
              <p>
                If you configure your own custom YouTube Data API v3 Key, you are fully liable for maintaining its confidentiality. Google Cloud Run proxies and EZ Toolbox developers are not responsible for any quota drainage or expenses accrued on your personal Google Cloud Platform dashboard.
              </p>

              <h4 className="font-display font-extrabold text-xs md:text-sm text-gray-950 dark:text-white tracking-tight pt-2">3. Disclaimer of Content Warranties</h4>
              <p>
                The estimates provided (such as estimated channel grades, historical charts, regional CPM calculations, and monthly monetization earnings potential) are speculative models generated by our analysis engine. Actual Adsense earnings, video metrics, and rankings fluctuate and depend entirely on live advertiser bidding, content niche, and regional viewer locations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
