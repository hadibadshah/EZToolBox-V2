import React, { useState, useRef, useEffect } from "react";
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Camera, 
  RefreshCw, 
  Globe, 
  Wifi, 
  Mail, 
  Phone, 
  Type, 
  Sparkles, 
  Trash2,
  AlertCircle,
  Maximize2,
  VideoOff,
  MessageSquare,
  MessageCircle,
  MapPin,
  User,
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  Twitter,
  Coins,
  Wallet,
  CreditCard,
  Calendar,
  Video,
  Apple,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Adsterra320x50 } from "./Adsterra320x50";
import { AdsterraNative } from "./AdsterraNative";

type QRType = 
  | "url" 
  | "text" 
  | "email" 
  | "phone" 
  | "sms" 
  | "whatsapp" 
  | "wifi" 
  | "location" 
  | "vcard" 
  | "facebook" 
  | "instagram" 
  | "linkedin" 
  | "youtube" 
  | "tiktok" 
  | "twitter" 
  | "bitcoin" 
  | "ethereum" 
  | "upi" 
  | "paypal" 
  | "event" 
  | "zoom" 
  | "spotify" 
  | "appstore" 
  | "googleplay";

interface QrGeneratorProps {
  adsEnabled: boolean;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ adsEnabled }) => {
  // --- Generator States ---
  const [qrType, setQrType] = useState<QRType>("url");
  const [typeCategory, setTypeCategory] = useState<"utility" | "social" | "finance" | "apps">("utility");
  const [inputValue, setInputValue] = useState("https://eztoolbox.xyz");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  // --- Expanded Type States ---
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [lat, setLat] = useState("37.7749");
  const [lng, setLng] = useState("-122.4194");
  const [vFirstName, setVFirstName] = useState("");
  const [vLastName, setVLastName] = useState("");
  const [vOrg, setVOrg] = useState("");
  const [vTitle, setVTitle] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vUrl, setVUrl] = useState("");
  const [vAddress, setVAddress] = useState("");
  const [socialUser, setSocialUser] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoNote, setCryptoNote] = useState("");
  const [upiVpa, setUpiVpa] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [upiNote, setUpiNote] = useState("");
  const [paypalUser, setPaypalUser] = useState("");
  const [paypalAmount, setPaypalAmount] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [zoomPassword, setZoomPassword] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [appStoreId, setAppStoreId] = useState("");
  const [playStorePackage, setPlayStorePackage] = useState("");
  
  // Customization States
  const [fgColor, setFgColor] = useState("#0f172a"); // Slate 900
  const [bgColor, setBgColor] = useState("#ffffff"); // White
  const [qrSize, setQrSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(60); // Logo width/height inside QR

  // Outputs
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [activeTab, setActiveTab] = useState<"generate" | "scan">("generate");

  // --- Scanner States ---
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerCopied, setScannerCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger QR Generation when inputs or custom styles change
  useEffect(() => {
    if (activeTab === "generate") {
      generateQRCode();
    }
  }, [
    qrType, 
    inputValue, 
    wifiSsid, 
    wifiPassword, 
    wifiEncryption, 
    emailAddress, 
    emailSubject, 
    emailBody, 
    phoneNo, 
    smsPhone,
    smsMessage,
    whatsappPhone,
    whatsappMessage,
    lat,
    lng,
    vFirstName,
    vLastName,
    vOrg,
    vTitle,
    vPhone,
    vEmail,
    vUrl,
    vAddress,
    socialUser,
    cryptoAddress,
    cryptoAmount,
    cryptoNote,
    upiVpa,
    upiName,
    upiAmount,
    upiNote,
    paypalUser,
    paypalAmount,
    eventName,
    eventLocation,
    eventStart,
    eventEnd,
    zoomMeetingId,
    zoomPassword,
    spotifyUrl,
    appStoreId,
    playStorePackage,
    fgColor, 
    bgColor, 
    qrSize, 
    margin,
    logoImage,
    logoSize
  ]);

  // Construct data based on type
  const getQRValue = (): string => {
    switch (qrType) {
      case "url":
        return inputValue.trim().startsWith("http") ? inputValue.trim() : `https://${inputValue.trim()}`;
      case "text":
        return inputValue;
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNo.trim()}`;
      case "sms":
        return `SMSTO:${smsPhone.trim()}:${smsMessage}`;
      case "whatsapp": {
        // Strip everything that isn't a digit from the input phone to prevent reversal/formatting errors
        const cleaned = whatsappPhone.replace(/\D/g, "");
        return `https://wa.me/${cleaned}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""}`;
      }
      case "location":
        return `https://www.google.com/maps/search/?api=1&query=${lat.trim()},${lng.trim()}`;
      case "vcard": {
        return `BEGIN:VCARD
VERSION:3.0
N:${vLastName.trim()};${vFirstName.trim()};;;
FN:${vFirstName.trim()} ${vLastName.trim()}
ORG:${vOrg.trim()}
TITLE:${vTitle.trim()}
TEL;TYPE=CELL:${vPhone.trim()}
EMAIL;TYPE=PREF,INTERNET:${vEmail.trim()}
URL:${vUrl.trim()}
ADR;TYPE=WORK:;;${vAddress.trim()}
END:VCARD`;
      }
      case "facebook":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://facebook.com/${socialUser.trim()}`;
      case "instagram":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://instagram.com/${socialUser.trim()}`;
      case "linkedin":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://linkedin.com/in/${socialUser.trim()}`;
      case "youtube":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://youtube.com/@${socialUser.trim().replace("@", "")}`;
      case "tiktok":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://tiktok.com/@${socialUser.trim().replace("@", "")}`;
      case "twitter":
        return socialUser.trim().startsWith("http") ? socialUser.trim() : `https://twitter.com/${socialUser.trim()}`;
      case "bitcoin": {
        const query = cryptoAmount ? `?amount=${cryptoAmount}${cryptoNote ? `&message=${encodeURIComponent(cryptoNote)}` : ""}` : "";
        return `bitcoin:${cryptoAddress.trim()}${query}`;
      }
      case "ethereum": {
        const query = cryptoAmount ? `?value=${cryptoAmount}` : "";
        return `ethereum:${cryptoAddress.trim()}${query}`;
      }
      case "upi": {
        const query = `pa=${upiVpa.trim()}&pn=${encodeURIComponent(upiName.trim())}${upiAmount ? `&am=${upiAmount}` : ""}${upiNote ? `&tn=${encodeURIComponent(upiNote)}` : ""}`;
        return `upi://pay?${query}`;
      }
      case "paypal": {
        const amtStr = paypalAmount ? `/${paypalAmount}` : "";
        return `https://paypal.me/${paypalUser.trim()}${amtStr}`;
      }
      case "event": {
        const start = eventStart.replace(/[-:]/g, "");
        const end = eventEnd.replace(/[-:]/g, "");
        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName.trim()}
LOCATION:${eventLocation.trim()}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR`;
      }
      case "zoom":
        return zoomMeetingId.trim().startsWith("http") 
          ? zoomMeetingId.trim() 
          : `https://zoom.us/j/${zoomMeetingId.trim()}${zoomPassword ? `?pwd=${encodeURIComponent(zoomPassword)}` : ""}`;
      case "spotify":
        return spotifyUrl.trim();
      case "appstore":
        return appStoreId.trim().startsWith("http") ? appStoreId.trim() : `https://apps.apple.com/app/id${appStoreId.trim()}`;
      case "googleplay":
        return playStorePackage.trim().startsWith("http") ? playStorePackage.trim() : `https://play.google.com/store/apps/details?id=${playStorePackage.trim()}`;
      default:
        return inputValue;
    }
  };

  const generateQRCode = async () => {
    try {
      setGenerateError("");
      const value = getQRValue();
      if (!value) {
        setQrDataUrl("");
        return;
      }

      // Generate standard QR code structure using canvas
      const options = {
        width: qrSize,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: "H" as const, // High error correction level needed to allow logo embedding
      };

      // Create raw QR image URL
      const rawUrl = await QRCode.toDataURL(value, options);

      // If there is an embedded logo, we must draw it over the QR code
      if (logoImage) {
        const canvas = document.createElement("canvas");
        canvas.width = qrSize;
        canvas.height = qrSize;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          const qrImg = new Image();
          qrImg.src = rawUrl;
          await new Promise((resolve) => {
            qrImg.onload = resolve;
          });

          // Draw base QR
          ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

          // Draw Logo
          const logoImg = new Image();
          logoImg.src = logoImage;
          await new Promise((resolve) => {
            logoImg.onload = resolve;
          });

          // Calculate center and draw white background card for the logo
          const logoX = (qrSize - logoSize) / 2;
          const logoY = (qrSize - logoSize) / 2;
          
          // Outer background border for logo
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, 8) : ctx.rect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
          ctx.fill();

          // Draw actual logo image inside the border
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          setQrDataUrl(canvas.toDataURL("image/png"));
        }
      } else {
        setQrDataUrl(rawUrl);
      }
    } catch (err: any) {
      console.error(err);
      setGenerateError(err.message || "Could not generate QR Code.");
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Action
  const downloadQR = (format: "png" | "svg") => {
    if (!qrDataUrl) return;
    
    if (format === "png") {
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `ez-qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // SVG generator fallback
      QRCode.toString(getQRValue(), {
        type: "svg",
        width: qrSize,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor
        }
      }, (err, string) => {
        if (err) return console.error(err);
        const blob = new Blob([string], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ez-qr-code-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }
  };

  // Copy Image to Clipboard
  const copyQRToClipboard = async () => {
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Fallback
      setCopySuccess(false);
    }
  };

  // Preset Logos Helper
  const setPresetLogo = (type: "none" | "ez" | "yt" | "wa" | "fb" | "ig" | "ln" | "tw" | "tt" | "sp" | "link" | "wifi") => {
    if (type === "none") {
      setLogoImage(null);
    } else if (type === "ez") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981' width='100' height='100'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/></svg>");
    } else if (type === "yt") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff0000' width='100' height='100'><path d='M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/></svg>");
    } else if (type === "wa") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2325d366' width='100' height='100'><path d='M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.457 3.483 1.328 5l-1.411 5.15 5.271-1.383c1.467.8 3.1 1.226 4.805 1.23h.004c5.51 0 9.993-4.483 9.993-9.993C22 6.483 17.514 2 12.004 2zm6.986 14.168c-.29.818-1.436 1.504-1.996 1.6-1.57.268-3.5-.386-5.842-1.353-2.342-.967-4.141-2.91-5.111-4.225-1.127-1.531-1.638-3.085-1.472-4.157.166-1.072.766-1.688 1.15-1.942.384-.254.767-.32.993-.32h.494c.16 0 .385-.013.565.378.18.39.726 1.766.793 1.902.066.137.112.296.02.483-.09.186-.14.295-.276.452-.136.157-.29.35-.413.472-.137.135-.28.283-.122.553.158.27.702 1.155 1.505 1.87 1.033.917 1.901 1.203 2.172 1.338.271.135.43.113.589-.068.16-.182.68-.79 1.033-1.196.353-.406.495-.34.79-.225.295.113 1.872.88 2.19.1.318-.045.341-.453.227-.68a1.31 1.31 0 0 0-.25-.338c-.114-.136-.25-.226-.136-.452s.583-.974.79-1.334c.207-.36.318-.679.16-.948s-.681-.453-.886-.498z'/></svg>");
    } else if (type === "fb") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231877f2' width='100' height='100'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>");
    } else if (type === "ig") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e1306c' width='100' height='100'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'/></svg>");
    } else if (type === "ln") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230077b5' width='100' height='100'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>");
    } else if (type === "tw") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000' width='100' height='100'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>");
    } else if (type === "tt") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000' width='100' height='100'><path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.17-.15-.29-.29-.43-.45v6.38c.02 2.57-.86 5.14-2.65 7-1.9 2.01-4.73 2.99-7.44 2.78-2.63-.19-5.18-1.64-6.61-3.9-1.49-2.3-1.74-5.35-.65-7.79 1.05-2.42 3.42-4.18 6.06-4.52V12c-1.44.13-2.88.94-3.66 2.18-.84 1.29-.93 2.97-.4 4.39.51 1.41 1.79 2.47 3.28 2.67 1.45.23 3.03-.33 3.86-1.54.49-.69.69-1.54.67-2.38l-.01-17.3z'/></svg>");
    } else if (type === "sp") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231db954' width='100' height='100'><path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.311c-.213.347-.667.46-.101.247-2.772-1.692-6.262-2.076-10.373-.977-.396.113-.805-.119-.918-.515-.113-.396.119-.805.515-.918 4.5-1.029 8.356-.583 11.488 1.332.346.213.46.666.247 1.011zm1.464-3.264c-.269.438-.844.581-1.282.312-3.172-1.95-8.01-2.515-11.758-1.377-.492.149-1.01-.132-1.159-.624-.149-.492.132-1.01.624-1.159 4.29-1.302 9.624-.668 13.293 1.589.438.269.581.844.312 1.282zm.126-3.41c-3.805-2.26-10.07-2.47-13.682-1.372-.584.177-1.196-.156-1.373-.74-.177-.584.156-1.196.74-1.373 4.154-1.261 11.082-1.016 15.465 1.587.525.312.697.994.385 1.52-.312.526-.994.697-1.52.385z'/></svg>");
    } else if (type === "link") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1' width='100' height='100'><path d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'/></svg>");
    } else if (type === "wifi") {
      setLogoImage("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6' width='100' height='100'><path d='M12 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4.8 13.8a10 10 0 0 1 14.4 0m-11.5-3a14 14 0 0 1 18.6 0M1 7.6a18 18 0 0 1 22 0'/></svg>");
    }
  };

  // --- CAMERA DECODER LOGIC ---
  const startCamera = async () => {
    setScanResult(null);
    setScanError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScanner);
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setScanError("Camera access was denied or is not available. Please upload a QR code image instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const tickScanner = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      if (streamRef.current) {
        requestAnimationFrame(tickScanner);
      }
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setScanResult(code.data);
          stopCamera();
          // Vibrate if supported
          if ("vibrate" in navigator) {
            navigator.vibrate(100);
          }
          return;
        }
      }
    }

    if (streamRef.current) {
      requestAnimationFrame(tickScanner);
    }
  };

  // --- FILE UPLOAD DECODER LOGIC ---
  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanResult(null);
    setScanError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            setScanResult(code.data);
          } else {
            setScanError("No QR Code detected in this image. Make sure it is clear and high quality.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8" id="qr-toolkit-root">
      
      {/* Dynamic Header Section matching eztoolbox branding */}
      <div className="text-center mb-8" id="qr-hero-title-section">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold mb-3 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> High Trust Custom QR Tool
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-gray-950 dark:text-white tracking-tight leading-tight" id="qr-main-title">
          Custom <span className="text-emerald-600 dark:text-emerald-500 drop-shadow-[0_2px_12px_rgba(16,185,129,0.15)]">QR Code Generator</span> & Scanner
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto font-medium">
          Generate beautiful custom branded QR codes with embedded logos, custom colors, size, and style. Decode QR codes from image uploads or live webcam stream instantly for free!
        </p>
      </div>

      {/* Adsterra Top Leaderboard Placement */}
      <div className="flex justify-center" id="qr-top-ad-container">
        <Adsterra320x50 id="qr-top-leaderboard" enabled={adsEnabled} />
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-neutral-800" id="qr-tool-tabs">
        <button
          onClick={() => {
            setActiveTab("generate");
            stopCamera();
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-extrabold tracking-tight border-b-2 cursor-pointer transition-all ${
            activeTab === "generate" 
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black" 
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
          id="tab-btn-generate"
        >
          <QrCode className="h-4 w-4" /> Custom QR Generator
        </button>
        <button
          onClick={() => {
            setActiveTab("scan");
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-extrabold tracking-tight border-b-2 cursor-pointer transition-all ${
            activeTab === "scan" 
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black" 
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
          id="tab-btn-scan"
        >
          <Camera className="h-4 w-4" /> QR Code Scanner / Reader
        </button>
      </div>

      {activeTab === "generate" ? (
        /* ======================================================== */
        /* GENERATOR VIEW                                           */
        /* ======================================================== */
        <div className="grid lg:grid-cols-12 gap-8" id="qr-generator-grid">
          
          {/* Controls Form (8 Cols) */}
          <div className="lg:col-span-7 space-y-6" id="qr-generator-inputs">
            
            {/* 1. Select QR Data Type */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xs animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-neutral-800/80 pb-3">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Step 1: Choose QR Content Type</span>
                {/* Category Selector Tabs */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth" id="type-category-selector">
                  {[
                    { id: "utility", label: "Utility & Web" },
                    { id: "social", label: "Social Networks" },
                    { id: "finance", label: "Finance & Crypto" },
                    { id: "apps", label: "Apps & Events" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTypeCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        typeCategory === cat.id
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-50 dark:bg-neutral-950 text-gray-500 hover:text-gray-900 dark:hover:text-neutral-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Type Select Grid depending on Category */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="content-type-selector">
                {typeCategory === "utility" && (
                  <>
                    <button
                      onClick={() => { setQrType("url"); setInputValue("https://eztoolbox.xyz"); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "url" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Globe className="h-4 w-4 text-sky-500" /> URL / Website
                    </button>
                    <button
                      onClick={() => { setQrType("text"); setInputValue("Welcome to EZ Toolbox!"); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "text" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Type className="h-4 w-4 text-indigo-500" /> Plain Text
                    </button>
                    <button
                      onClick={() => { setQrType("wifi"); setWifiSsid(""); setWifiPassword(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "wifi" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Wifi className="h-4 w-4 text-emerald-500" /> Wi-Fi Network
                    </button>
                    <button
                      onClick={() => { setQrType("vcard"); setVFirstName(""); setVLastName(""); setVOrg(""); setVTitle(""); setVPhone(""); setVEmail(""); setVUrl(""); setVAddress(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "vcard" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <User className="h-4 w-4 text-teal-500" /> vCard Contact
                    </button>
                    <button
                      onClick={() => { setQrType("email"); setEmailAddress(""); setEmailSubject(""); setEmailBody(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "email" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Mail className="h-4 w-4 text-amber-500" /> Email Form
                    </button>
                    <button
                      onClick={() => { setQrType("location"); setLat("37.7749"); setLng("-122.4194"); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "location" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <MapPin className="h-4 w-4 text-rose-500" /> GPS Location
                    </button>
                  </>
                )}

                {typeCategory === "social" && (
                  <>
                    <button
                      onClick={() => { setQrType("whatsapp"); setWhatsappPhone(""); setWhatsappMessage(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "whatsapp" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp Link
                    </button>
                    <button
                      onClick={() => { setQrType("facebook"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "facebook" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                    </button>
                    <button
                      onClick={() => { setQrType("instagram"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "instagram" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                    </button>
                    <button
                      onClick={() => { setQrType("linkedin"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "linkedin" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
                    </button>
                    <button
                      onClick={() => { setQrType("youtube"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "youtube" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Youtube className="h-4 w-4 text-red-600" /> YouTube
                    </button>
                    <button
                      onClick={() => { setQrType("tiktok"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "tiktok" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Music className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> TikTok
                    </button>
                    <button
                      onClick={() => { setQrType("twitter"); setSocialUser(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "twitter" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Twitter className="h-4 w-4 text-sky-400" /> Twitter / X
                    </button>
                    <button
                      onClick={() => { setQrType("spotify"); setSpotifyUrl(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "spotify" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Music className="h-4 w-4 text-emerald-500" /> Spotify URL
                    </button>
                  </>
                )}

                {typeCategory === "finance" && (
                  <>
                    <button
                      onClick={() => { setQrType("upi"); setUpiVpa(""); setUpiName(""); setUpiAmount(""); setUpiNote(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "upi" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <CreditCard className="h-4 w-4 text-emerald-600" /> UPI Pay
                    </button>
                    <button
                      onClick={() => { setQrType("paypal"); setPaypalUser(""); setPaypalAmount(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "paypal" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Wallet className="h-4 w-4 text-sky-500" /> PayPal.me
                    </button>
                    <button
                      onClick={() => { setQrType("bitcoin"); setCryptoAddress(""); setCryptoAmount(""); setCryptoNote(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "bitcoin" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Coins className="h-4 w-4 text-amber-500" /> Bitcoin (BTC)
                    </button>
                    <button
                      onClick={() => { setQrType("ethereum"); setCryptoAddress(""); setCryptoAmount(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "ethereum" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Wallet className="h-4 w-4 text-indigo-500" /> Ethereum (ETH)
                    </button>
                  </>
                )}

                {typeCategory === "apps" && (
                  <>
                    <button
                      onClick={() => { setQrType("event"); setEventName(""); setEventLocation(""); setEventStart(""); setEventEnd(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "event" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Calendar className="h-4 w-4 text-rose-500" /> Event / Calendar
                    </button>
                    <button
                      onClick={() => { setQrType("zoom"); setZoomMeetingId(""); setZoomPassword(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "zoom" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Video className="h-4 w-4 text-sky-500" /> Zoom Meeting
                    </button>
                    <button
                      onClick={() => { setQrType("appstore"); setAppStoreId(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "appstore" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Apple className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> iOS App Store
                    </button>
                    <button
                      onClick={() => { setQrType("googleplay"); setPlayStorePackage(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "googleplay" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Play className="h-4 w-4 text-emerald-600" /> Google Play
                    </button>
                    <button
                      onClick={() => { setQrType("phone"); setPhoneNo(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "phone" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <Phone className="h-4 w-4 text-cyan-500" /> Phone Call
                    </button>
                    <button
                      onClick={() => { setQrType("sms"); setSmsPhone(""); setSmsMessage(""); }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] md:text-xs font-bold transition-all cursor-pointer ${qrType === "sms" ? "bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 dark:bg-neutral-950 border-slate-200/50 dark:border-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-slate-100"}`}
                    >
                      <MessageSquare className="h-4 w-4 text-violet-500" /> SMS Text
                    </button>
                  </>
                )}
              </div>

              {/* Dynamic Input Forms for all 24 Types */}
              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/60" id="qr-input-form-container">
                {qrType === "url" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Website Destination URL</label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g. https://eztoolbox.xyz"
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      id="input-qr-url"
                    />
                  </div>
                )}

                {qrType === "text" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Your Text / Message</label>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Write any secret notes, greeting codes, or instructions here..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      id="input-qr-text"
                    />
                  </div>
                )}

                {qrType === "wifi" && (
                  <div className="grid md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">SSID / Network Name</label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="Home Wi-Fi"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        id="input-wifi-ssid"
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Network Password</label>
                      <input
                        type="password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Password123"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        id="input-wifi-pass"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Security Type</label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 transition-all text-gray-950 dark:text-white cursor-pointer"
                        id="input-wifi-enc"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No Password (Open)</option>
                      </select>
                    </div>
                  </div>
                )}

                {qrType === "vcard" && (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">First Name</label>
                        <input
                          type="text"
                          value={vFirstName}
                          onChange={(e) => setVFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Last Name</label>
                        <input
                          type="text"
                          value={vLastName}
                          onChange={(e) => setVLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Organization / Company</label>
                        <input
                          type="text"
                          value={vOrg}
                          onChange={(e) => setVOrg(e.target.value)}
                          placeholder="EZ Toolbox inc."
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Job Title</label>
                        <input
                          type="text"
                          value={vTitle}
                          onChange={(e) => setVTitle(e.target.value)}
                          placeholder="Technical Lead"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Phone Number</label>
                        <input
                          type="tel"
                          value={vPhone}
                          onChange={(e) => setVPhone(e.target.value)}
                          placeholder="+92 301 7480809"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={vEmail}
                          onChange={(e) => setVEmail(e.target.value)}
                          placeholder="john@eztoolbox.xyz"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Website URL</label>
                      <input
                        type="text"
                        value={vUrl}
                        onChange={(e) => setVUrl(e.target.value)}
                        placeholder="https://eztoolbox.xyz"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Work Address</label>
                      <input
                        type="text"
                        value={vAddress}
                        onChange={(e) => setVAddress(e.target.value)}
                        placeholder="Street 10, Lahore, Pakistan"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {qrType === "email" && (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Recipient Email</label>
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="hello@eztoolbox.xyz"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                          id="input-email-to"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Email Subject</label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Partnership Offer"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                          id="input-email-sub"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Message Body</label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Write your email template message here..."
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        id="input-email-body"
                      />
                    </div>
                  </div>
                )}

                {qrType === "location" && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Latitude</label>
                      <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="37.7749"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Longitude</label>
                      <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="-122.4194"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {qrType === "whatsapp" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">WhatsApp Phone (With Country Code)</label>
                      <input
                        type="tel"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="e.g. 923017480809 (NO leading + or zeros)"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Pre-filled Message (Optional)</label>
                      <input
                        type="text"
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        placeholder="Hello, I want to inquire about..."
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {["facebook", "instagram", "linkedin", "youtube", "tiktok", "twitter"].includes(qrType) && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">
                      {qrType.toUpperCase()} Username or URL
                    </label>
                    <input
                      type="text"
                      value={socialUser}
                      onChange={(e) => setSocialUser(e.target.value)}
                      placeholder={
                        qrType === "youtube" ? "e.g. @GeekyAmeer" :
                        qrType === "linkedin" ? "e.g. john-doe" : "e.g. geekyameer"
                      }
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                    />
                  </div>
                )}

                {qrType === "spotify" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Spotify Track / Artist / Playlist URL</label>
                    <input
                      type="text"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      placeholder="e.g. https://open.spotify.com/track/..."
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                    />
                  </div>
                )}

                {qrType === "upi" && (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Payee UPI VPA (ID)</label>
                        <input
                          type="text"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="e.g. name@upi"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Payee Name</label>
                        <input
                          type="text"
                          value={upiName}
                          onChange={(e) => setUpiName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Amount (INR, Optional)</label>
                        <input
                          type="number"
                          value={upiAmount}
                          onChange={(e) => setUpiAmount(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Transaction Note / Message</label>
                        <input
                          type="text"
                          value={upiNote}
                          onChange={(e) => setUpiNote(e.target.value)}
                          placeholder="e.g. Dinner share"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {qrType === "paypal" && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">PayPal.me Username</label>
                      <input
                        type="text"
                        value={paypalUser}
                        onChange={(e) => setPaypalUser(e.target.value)}
                        placeholder="e.g. johndoe"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Amount (Optional)</label>
                      <input
                        type="number"
                        value={paypalAmount}
                        onChange={(e) => setPaypalAmount(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {(qrType === "bitcoin" || qrType === "ethereum") && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">{qrType.toUpperCase()} Address</label>
                      <input
                        type="text"
                        value={cryptoAddress}
                        onChange={(e) => setCryptoAddress(e.target.value)}
                        placeholder={qrType === "bitcoin" ? "e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" : "e.g. 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"}
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Amount / Value (Optional)</label>
                        <input
                          type="text"
                          value={cryptoAmount}
                          onChange={(e) => setCryptoAmount(e.target.value)}
                          placeholder="e.g. 0.05"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      {qrType === "bitcoin" && (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Memo / Message (Optional)</label>
                          <input
                            type="text"
                            value={cryptoNote}
                            onChange={(e) => setCryptoNote(e.target.value)}
                            placeholder="e.g. Server hosting"
                            className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {qrType === "event" && (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Event Title</label>
                        <input
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="Annual General Meeting"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Location / Online Link</label>
                        <input
                          type="text"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="Lahore Head Office / Zoom"
                          className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Start Date & Time (UTC)</label>
                        <input
                          type="datetime-local"
                          value={eventStart}
                          onChange={(e) => setEventStart(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">End Date & Time (UTC)</label>
                        <input
                          type="datetime-local"
                          value={eventEnd}
                          onChange={(e) => setEventEnd(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {qrType === "zoom" && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Zoom Meeting ID or Join URL</label>
                      <input
                        type="text"
                        value={zoomMeetingId}
                        onChange={(e) => setZoomMeetingId(e.target.value)}
                        placeholder="e.g. 8452179830"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Meeting Password (Optional)</label>
                      <input
                        type="password"
                        value={zoomPassword}
                        onChange={(e) => setZoomPassword(e.target.value)}
                        placeholder="Pass123"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {qrType === "appstore" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Apple App Store App ID or URL</label>
                    <input
                      type="text"
                      value={appStoreId}
                      onChange={(e) => setAppStoreId(e.target.value)}
                      placeholder="e.g. 154125896"
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                    />
                  </div>
                )}

                {qrType === "googleplay" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Google Play Package Name or URL</label>
                    <input
                      type="text"
                      value={playStorePackage}
                      onChange={(e) => setPlayStorePackage(e.target.value)}
                      placeholder="e.g. com.eztoolbox.app"
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                    />
                  </div>
                )}

                {qrType === "phone" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Dialer Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      placeholder="+92 301 7480809"
                      className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      id="input-phone-no"
                    />
                  </div>
                )}

                {qrType === "sms" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">Recipient Phone Number</label>
                      <input
                        type="tel"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="e.g. +923017480809"
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-400 dark:text-neutral-500 uppercase">SMS Text Message</label>
                      <input
                        type="text"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="Write your SMS text template here..."
                        className="w-full bg-slate-50 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Custom Styling Options */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Step 2: Customize Brand Theme</span>
              
              <div className="grid md:grid-cols-2 gap-6" id="style-customization-options">
                
                {/* Color Pickers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Color Palette</span>
                    <button 
                      onClick={() => { setFgColor("#0f172a"); setBgColor("#ffffff"); }}
                      className="text-[10px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold transition-all cursor-pointer"
                    >
                      Reset Colors
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200/50 dark:border-neutral-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Dots (Dark)</span>
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">{fgColor.toUpperCase()}</span>
                      </div>
                      <input 
                        type="color" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)} 
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-neutral-700" 
                      />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200/50 dark:border-neutral-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Canvas (Light)</span>
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">{bgColor.toUpperCase()}</span>
                      </div>
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)} 
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-neutral-700" 
                      />
                    </div>
                  </div>
                </div>

                {/* Sizing & Margins */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Sizing Constraints</span>
                  <div className="space-y-3 bg-slate-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-slate-200/50 dark:border-neutral-800">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500">
                      <span>Quiet Zone Margin: {margin}</span>
                      <span>Resolution: {qrSize}px</span>
                    </div>
                    
                    <div className="space-y-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="8" 
                        value={margin} 
                        onChange={(e) => setMargin(parseInt(e.target.value))} 
                        className="w-full accent-emerald-500 h-1 bg-gray-200 rounded-lg cursor-pointer" 
                      />
                      <input 
                        type="range" 
                        min="200" 
                        max="600" 
                        step="50"
                        value={qrSize} 
                        onChange={(e) => setQrSize(parseInt(e.target.value))} 
                        className="w-full accent-emerald-500 h-1 bg-gray-200 rounded-lg cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Logo Overlay Branding */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Step 3: Embed Center Logo (High Brand Trust)</span>
              
              <div className="space-y-4" id="logo-branding-section">
                
                {/* Preset Brand Logos */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block font-sans tracking-tight">Select Quick Preset Logo</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <button 
                      onClick={() => setPresetLogo("none")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${!logoImage ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      None
                    </button>
                    <button 
                      onClick={() => setPresetLogo("ez")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%2310b981') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      EZ Tool
                    </button>
                    <button 
                      onClick={() => setPresetLogo("yt")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%23ff0000') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      YouTube
                    </button>
                    <button 
                      onClick={() => setPresetLogo("wa")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%2325d366') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => setPresetLogo("fb")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%231877f2') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Facebook
                    </button>
                    <button 
                      onClick={() => setPresetLogo("ig")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%23e1306c') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Instagram
                    </button>
                    <button 
                      onClick={() => setPresetLogo("ln")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%230077b5') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      LinkedIn
                    </button>
                    <button 
                      onClick={() => setPresetLogo("tw")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('fill=%22%23000000%22') || (logoImage?.includes('%23000000') && !logoImage?.includes('tiktok') && !logoImage?.includes('12.525')) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Twitter/X
                    </button>
                    <button 
                      onClick={() => setPresetLogo("tt")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('tiktok') || (logoImage?.includes('%23000000') && logoImage?.includes('12.525')) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      TikTok
                    </button>
                    <button 
                      onClick={() => setPresetLogo("sp")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%231db954') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Spotify
                    </button>
                    <button 
                      onClick={() => setPresetLogo("link")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%236366f1') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Web Link
                    </button>
                    <button 
                      onClick={() => setPresetLogo("wifi")}
                      className={`py-2 px-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer transition-all ${logoImage?.includes('%233b82f6') ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400':'border-slate-200 dark:border-neutral-800 hover:bg-slate-50'}`}
                    >
                      Wi-Fi
                    </button>
                  </div>
                </div>

                {/* Upload Custom Logo */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800/60">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block font-sans">Or Upload Brand Logo (.png, .jpg)</span>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      ref={fileInputRef}
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-gray-700 dark:text-neutral-300 transition-all cursor-pointer"
                    >
                      <Upload className="h-4 w-4" /> Upload Custom Logo
                    </button>
                    {logoImage && (
                      <button 
                        onClick={() => setLogoImage(null)}
                        className="bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl transition-all cursor-pointer"
                        title="Delete logo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {logoImage && (
                <div className="pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between gap-4" id="logo-size-slider">
                  <span className="text-xs font-bold text-gray-600 dark:text-neutral-400">Logo Scale Width: {logoSize}px</span>
                  <input 
                    type="range" 
                    min="30" 
                    max="100" 
                    step="5"
                    value={logoSize} 
                    onChange={(e) => setLogoSize(parseInt(e.target.value))} 
                    className="w-1/2 accent-emerald-500 h-1 bg-gray-200 rounded-lg cursor-pointer" 
                  />
                </div>
              )}
            </div>

          </div>

          {/* Realtime Result Panel (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start" id="qr-generator-preview">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sticky top-6 space-y-6 shadow-md text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Live Output Rendering</span>
                <h3 className="font-display font-extrabold text-sm md:text-base text-gray-950 dark:text-white tracking-tight">Your Custom Branded QR Code</h3>
              </div>

              {/* QR Render Container */}
              <div className="bg-slate-50 dark:bg-neutral-950/40 p-6 rounded-2xl border border-slate-100 dark:border-neutral-800 flex flex-col items-center justify-center min-h-[300px]">
                {generateError ? (
                  <div className="text-rose-600 dark:text-rose-400 flex flex-col items-center gap-2 p-4 text-center">
                    <AlertCircle className="h-8 w-8 stroke-[2.5]" />
                    <p className="text-xs font-bold leading-relaxed">{generateError}</p>
                  </div>
                ) : qrDataUrl ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-white rounded-xl shadow-xs border border-slate-200/50"
                  >
                    <img 
                      src={qrDataUrl} 
                      alt="Generated Branded QR Code" 
                      className="mx-auto rounded-lg"
                      style={{ maxWidth: "260px", width: "100%", height: "auto" }}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ) : (
                  <div className="text-gray-400 dark:text-neutral-500 flex flex-col items-center gap-2 text-center p-4">
                    <QrCode className="h-10 w-10 stroke-[1.5] animate-pulse" />
                    <p className="text-xs font-semibold">Ready to generate. Input some parameters on the left side to compile your custom QR.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {qrDataUrl && (
                <div className="grid grid-cols-2 gap-3" id="qr-action-buttons">
                  <button
                    onClick={() => downloadQR("png")}
                    className="flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold tracking-tight cursor-pointer transition-all shadow-md active:scale-95"
                    id="download-png-btn"
                  >
                    <Download className="h-4 w-4" /> Download PNG
                  </button>
                  
                  <button
                    onClick={copyQRToClipboard}
                    className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-extrabold tracking-tight cursor-pointer transition-all border active:scale-95 ${
                      copySuccess 
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-400" 
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-neutral-950 dark:border-neutral-800 text-gray-700 dark:text-neutral-300"
                    }`}
                    id="copy-image-btn"
                  >
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copySuccess ? "Copied!" : "Copy Image"}
                  </button>
                </div>
              )}

              {/* SVG vector alternative */}
              {qrDataUrl && (
                <button
                  onClick={() => downloadQR("svg")}
                  className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white transition-all cursor-pointer"
                  id="download-vector-btn"
                >
                  <Sparkles className="h-3 w-3 text-amber-500" /> Download Vector SVG (Infinite Scale)
                </button>
              )}
              
            </div>
          </div>

        </div>
      ) : (
        /* ======================================================== */
        /* SCANNER VIEW                                             */
        /* ======================================================== */
        <div className="max-w-3xl mx-auto space-y-6" id="qr-scanner-view">
          
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Instant QR Decoder</span>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-gray-950 dark:text-white tracking-tight">Scan or Upload Any QR Code</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Our client-side decoder allows you to use your live device webcam or simply drag and drop a screenshot/image to extract hidden strings immediately.
              </p>
            </div>

            {/* Main Interactive Scanner Grid */}
            <div className="grid md:grid-cols-2 gap-6" id="scanner-controls-grid">
              
              {/* Option A: Live Camera */}
              <div className="bg-slate-50 dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Camera className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs md:text-sm text-gray-950 dark:text-white">Option A: Live Webcam</h4>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-500 max-w-[200px] mx-auto">Decode barcodes and QRs instantly in real-time from your camera feed.</p>
                </div>
                
                {cameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                  >
                    Stop Camera Feed
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                  >
                    Activate Camera
                  </button>
                )}
              </div>

              {/* Option B: Image File Upload */}
              <div className="bg-slate-50 dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 flex flex-col items-center justify-center text-center space-y-4 relative group">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Upload className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs md:text-sm text-gray-950 dark:text-white">Option B: Image Upload</h4>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-500 max-w-[220px] mx-auto">Drop screenshots, photo attachments, or local image downloads.</p>
                </div>

                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleScanUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload QR Code"
                />
                <button className="py-2 px-4 bg-slate-200 dark:bg-neutral-800 hover:bg-slate-300 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-extrabold transition-all pointer-events-none">
                  Choose Image File
                </button>
              </div>

            </div>

            {/* Active Camera Viewport Container */}
            {cameraActive && (
              <div className="relative max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border border-emerald-500 shadow-md bg-black">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Visual Camera Scan Target Guide Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-4 border-emerald-500/70 border-dashed rounded-xl relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">Align QR Inside Box</span>
                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  </div>
                </div>

                {/* Cancel Camera Stream Button overlay */}
                <button 
                  onClick={stopCamera}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
                  title="Close Camera"
                >
                  <VideoOff className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Error Indicators */}
            {scanError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-r-xl max-w-xl mx-auto flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-rose-950 dark:text-rose-400">Scanner Processing Failed</h5>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{scanError}</p>
                </div>
              </div>
            )}

            {/* Scan Output Results Viewport */}
            {scanResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl max-w-xl mx-auto space-y-4"
                id="scanner-success-result"
              >
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-5 w-5 stroke-[2.5]" />
                  <span className="text-xs font-extrabold uppercase tracking-widest">QR Code Decoded Successfully</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Decoded Text Content:</span>
                  <div className="p-3.5 bg-slate-100 dark:bg-neutral-950 rounded-xl border border-slate-200/50 dark:border-neutral-800 font-mono text-xs md:text-sm font-bold text-gray-950 dark:text-white break-all leading-relaxed whitespace-pre-wrap">
                    {scanResult}
                  </div>
                </div>

                {/* Scan Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scanResult);
                      setScannerCopied(true);
                      setTimeout(() => setScannerCopied(false), 2000);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      scannerCopied 
                        ? "bg-emerald-100 border border-emerald-500/30 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 text-gray-700 dark:text-neutral-300"
                    }`}
                  >
                    {scannerCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {scannerCopied ? "Copied text!" : "Copy to Clipboard"}
                  </button>

                  {scanResult.trim().startsWith("http") && (
                    <a
                      href={scanResult}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      <Globe className="h-3.5 w-3.5" /> Open Link in New Tab
                    </a>
                  )}

                  <button
                    onClick={() => { setScanResult(null); setScanError(null); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset / Clear Output
                  </button>
                </div>

              </motion.div>
            )}

          </div>

        </div>
      )}

      {/* Adsterra Native Recommendation Feed */}
      <div className="mt-12" id="qr-bottom-native-ad">
        <AdsterraNative id="qr-bottom-native" enabled={adsEnabled} />
      </div>

    </div>
  );
};
