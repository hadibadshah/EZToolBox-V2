import React, { useState, useEffect } from "react";

interface AdsterraNativeProps {
  id: string;
  enabled: boolean;
  subdomainView?: "yt" | "qr" | "compress" | "ip" | "converter";
}

export const AdsterraNative: React.FC<AdsterraNativeProps> = ({ id, enabled, subdomainView }) => {
  if (!enabled) return null;

  const [iframeHeight, setIframeHeight] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIframeHeight(1200); // Vertically stacked list on mobile to show all 4 ads fully with text
      } else {
        setIframeHeight(280); // Horizontal row on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detect subdomain dynamically if prop is not supplied
  const getSubdomain = (): "yt" | "qr" | "compress" | "ip" | "converter" => {
    if (subdomainView) return subdomainView;
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
  };

  const subdomain = getSubdomain();

  // Native ad configs provided by the user for each subdomain
  const nativeConfigs: Record<
    "yt" | "qr" | "compress" | "ip" | "converter",
    { containerId: string; scriptUrl: string }
  > = {
    yt: {
      containerId: "0d2df435ee648850aaf11365a3d9d6f6",
      scriptUrl: "https://pl30372464.effectivecpmnetwork.com/0d2df435ee648850aaf11365a3d9d6f6/invoke.js"
    },
    qr: {
      containerId: "1f8917f609560790912707af682dc8df",
      scriptUrl: "https://pl30372030.effectivecpmnetwork.com/1f8917f609560790912707af682dc8df/invoke.js"
    },
    compress: {
      containerId: "bf7fe6b2a5bec0c8b4472cf43884b23c",
      scriptUrl: "https://pl30435865.effectivecpmnetwork.com/bf7fe6b2a5bec0c8b4472cf43884b23c/invoke.js"
    },
    ip: {
      containerId: "d8b86e8ce6f25b07fea5a24b5b89ea66",
      scriptUrl: "https://pl30435875.effectivecpmnetwork.com/d8b86e8ce6f25b07fea5a24b5b89ea66/invoke.js"
    },
    converter: {
      containerId: "685cbfd3fd5cd63623af078148fd7048",
      scriptUrl: "https://pl30435883.effectivecpmnetwork.com/685cbfd3fd5cd63623af078148fd7048/invoke.js"
    }
  };

  const currentConfig = nativeConfigs[subdomain] || nativeConfigs.yt;

  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: hidden;
            background: transparent;
          }
          #container-${currentConfig.containerId} {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="${currentConfig.scriptUrl}"></script>
        <div id="container-${currentConfig.containerId}"></div>
      </body>
    </html>
  `.trim();

  return (
    <div 
      className="w-full mx-auto my-6"
      id={`adsterra-native-container-${id}`}
    >
      <div className="mb-3 flex items-center justify-between pb-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
          Recommended For You
        </h4>
        <span className="text-[10px] text-gray-400 dark:text-neutral-600 bg-transparent px-2 py-0.5 rounded font-mono">
          Sponsored Content
        </span>
      </div>
      <iframe
        title={`adsterra-native-widget-${id}`}
        srcDoc={adHtml}
        width="100%"
        height={iframeHeight}
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden", display: "block" }}
      />
    </div>
  );
};
