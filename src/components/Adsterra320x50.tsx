import React from "react";

interface Adsterra320x50Props {
  id: string;
  enabled: boolean;
}

export const Adsterra320x50: React.FC<Adsterra320x50Props> = ({ id, enabled }) => {
  if (!enabled) return null;

  const adKey = "56222dd59991e5de105ab5da66cbb0b8";
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 300px;
            height: 250px;
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
            'height' : 250,
            'width' : 300,
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
      style={{ minWidth: "300px", minHeight: "250px" }}
      id={`adsterra-320-container-${id}`}
    >
      <iframe
        title={`adsterra-300x250-ad-${id}`}
        srcDoc={adHtml}
        width="300"
        height="250"
        scrolling="no"
        frameBorder="0"
        style={{ border: "none", overflow: "hidden" }}
      />
    </div>
  );
};
