import React from "react";

interface Adsterra160x600Props {
  id: string;
  enabled: boolean;
  subdomainView?: "yt" | "qr" | "compress" | "ip" | "converter" | "tiktok";
}

export const Adsterra160x600: React.FC<Adsterra160x600Props> = ({ id, enabled, subdomainView }) => {
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
    yt: "0c8e47ca0a8ba92313c682d25488b03a",
    qr: "3f36335f0794b17bcb52d7cfb8eeb3df",
    compress: "2919ac53312294d1d6302fc8e17ae34a",
    ip: "4f3dcf1c94b6178e9c95904601d27e0c",
    converter: "b2ee6ff48bc09dc8d8dc324e6d1e760f",
    tiktok: "9de2f9d9cb74a63afeefff5cdb6bc440"
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
            width: 160px;
            height: 600px;
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
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `.trim();

  return (
    <div 
      className="flex justify-center items-center overflow-hidden" 
      style={{ width: "160px", height: "600px" }}
      id={`adsterra-160-container-${id}`}
    >
      <iframe
        title={`adsterra-160-ad-${id}`}
        srcDoc={adHtml}
        width="160"
        height="600"
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden" }}
      />
    </div>
  );
};
