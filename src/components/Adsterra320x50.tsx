import React from "react";

interface Adsterra320x50Props {
  id: string;
  enabled: boolean;
  subdomainView?: "yt" | "qr" | "compress" | "ip" | "converter" | "tiktok";
}

export const Adsterra320x50: React.FC<Adsterra320x50Props> = ({ id, enabled, subdomainView }) => {
  if (!enabled) return null;

  // Detect subdomain dynamically if prop is not supplied
  const getSubdomain = (): "yt" | "qr" | "compress" | "ip" | "converter" | "tiktok" => {
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
    if (hostname.includes("tiktok.eztoolbox.xyz") || hostname.includes("tiktok.")) {
      return "tiktok";
    }
    if (hostname.includes("speed.eztoolbox.xyz") || hostname.includes("speed.") || hostname.includes("converter.")) {
      return "converter";
    }
    return "yt";
  };

  const subdomain = getSubdomain();

  // Keys provided by the user for each subdomain
  const keys: Record<"yt" | "qr" | "compress" | "ip" | "converter" | "tiktok", string> = {
    yt: "4c9a72ecc1945050df1c685db5ad1f46",
    qr: "3021690b027b63131950c55585b3e871",
    compress: "fec6a1716171a197192b70e3bf7351e1",
    ip: "28fa5b133d1e8c669ee3eeb7efa5667f",
    converter: "33995635c87250fab03e2e29d59bb2f3",
    tiktok: "6d41b66048743423de0f8a61888c4a1d"
  };

  const adKey = keys[subdomain] || keys.yt;

  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 320px;
            height: 50px;
            overflow: hidden;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `.trim();

  return (
    <div 
      className="flex justify-center items-center overflow-hidden mx-auto" 
      style={{ minWidth: "320px", minHeight: "50px" }}
      id={`adsterra-320-container-${id}`}
    >
      <iframe
        title={`adsterra-320x50-ad-${id}`}
        srcDoc={adHtml}
        width="320"
        height="50"
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden" }}
      />
    </div>
  );
};
