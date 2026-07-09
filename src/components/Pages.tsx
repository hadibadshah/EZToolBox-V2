import React, { useState } from "react";
import { ArrowLeft, Mail, Phone, ExternalLink, Shield, FileText, Info, BookOpen, MessageSquare } from "lucide-react";

interface PagesProps {
  currentPage: "about" | "contact" | "privacy" | "terms" | "articles";
  setCurrentPage: (page: "home" | "about" | "contact" | "privacy" | "terms" | "articles") => void;
}

export const Pages: React.FC<PagesProps> = ({ currentPage, setCurrentPage }) => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const articles = [
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

  return (
    <div className="space-y-8" id="seo-pages-container">
      {/* Back to Home Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
        <button
          onClick={() => setCurrentPage("home")}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/20 transition-all cursor-pointer"
          id="back-to-home-btn"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Analyzer Dashboard
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
                About EZ Toolbox: The Ultimate YouTube SEO & Analytics Engine
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Welcome to <strong>EZ Toolbox</strong>, the industry-leading digital toolkit engineered to simplify and optimize your digital creator journey. We design professional-grade, lightweight web utilities focused on search engine optimization, video metadata extraction, channel analytics auditing, and high-performance branding assets.
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Our flagship <strong>YouTube Analyzer and SEO Extractor</strong> addresses the core bottlenecks that creators face daily: locating high-performing competitor tags, analyzing metadata quality, downloading pristine thumbnails, auditing monetization status, and tracking historical channel subscriber growth.
            </p>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-100 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" /> Privacy & Local-First Security
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  We believe in keeping your credentials safe. All personal YouTube API Keys remain cached purely in your local browser storage. We never log your search queries, channel investigations, or private metadata on remote external databases.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-100 dark:border-neutral-800 space-y-2">
                <h4 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-500" /> SEO-Driven Keyword Extraction
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  By extracting hidden tags and evaluating title densities, our tools let you build search-friendly video descriptions and copy-paste high-relevance terms in seconds. Rank higher in search results with verified competitor data.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white tracking-tight">Our Core Development Philosophy</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                EZ Toolbox was built to challenge bulky, slow, and expensive analytics platforms. By streamlining requests through sandboxed secure APIs, we deliver immediate Social Blade style channel projections, fast AdSense CPM calculations, and robust metadata diagnostic stats in a lightning-fast interface that works flawlessly across all mobile, tablet, and desktop viewports.
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
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Learn and Rank</span>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight">
                  Expert YouTube Growth Articles & SEO Guidebooks
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                  Master the algorithms, check monetization parameters, extract valuable search terms, and increase your CPM rates with our targeted articles.
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
                        // Render simple table
                        return (
                          <div key={i} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-neutral-800">
                            <table className="w-full text-left border-collapse text-[10px] md:text-xs">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-neutral-950 font-bold border-b border-slate-200 dark:border-neutral-800">
                                  <th className="p-3">Country Tier</th>
                                  <th className="p-3">CPM Range</th>
                                  <th className="p-3">High-Paying CPM</th>
                                  <th className="p-3">Examples</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/40">
                                {para.split("\n").slice(2).map((row, rIdx) => {
                                  const cols = row.split("|").map(c => c.trim()).filter(Boolean);
                                  if (cols.length < 4) return null;
                                  return (
                                    <tr key={rIdx} className="hover:bg-slate-50/40 dark:hover:bg-neutral-900/30">
                                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{cols[0]}</td>
                                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{cols[1]}</td>
                                      <td className="p-3 font-mono">{cols[2]}</td>
                                      <td className="p-3 text-gray-500 dark:text-gray-400">{cols[3]}</td>
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
