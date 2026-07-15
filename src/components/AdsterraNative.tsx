import React, { useState, useEffect } from "react";

interface AdsterraNativeProps {
  id: string;
  enabled: boolean;
}

export const AdsterraNative: React.FC<AdsterraNativeProps> = ({ id, enabled }) => {
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
          #container-0d2df435ee648850aaf11365a3d9d6f6 {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="https://pl30372464.effectivecpmnetwork.com/0d2df435ee648850aaf11365a3d9d6f6/invoke.js"></script>
        <div id="container-0d2df435ee648850aaf11365a3d9d6f6"></div>
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
