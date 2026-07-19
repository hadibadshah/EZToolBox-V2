import React, { useState, useRef } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Sliders, 
  Check, 
  AlertCircle, 
  FileCode, 
  ArrowRight, 
  CheckCircle2,
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompressedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  originalFormat: string;
  targetFormat: string;
  width: number;
  height: number;
  status: "idle" | "compressing" | "done" | "error";
  progress: number;
  error?: string;
}

interface ImageCompressorProps {
  adsEnabled: boolean;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ adsEnabled }) => {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<string>("original");
  const [resizeOption, setResizeOption] = useState<string>("original"); // original, 1920, 1280, 800, 640
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format utility
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (selectedFiles: File[]) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    const newFiles: CompressedFile[] = [];

    selectedFiles.forEach((file) => {
      if (!validImageTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image format. Please upload JPG, PNG, WebP or SVG.`);
        return;
      }

      const id = Math.random().toString(36).substring(2, 9);
      const url = URL.createObjectURL(file);

      newFiles.push({
        id,
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
        originalUrl: url,
        compressedUrl: "",
        originalFormat: file.type.replace("image/", ""),
        targetFormat: targetFormat === "original" ? file.type.replace("image/", "") : targetFormat,
        width: 0,
        height: 0,
        status: "idle",
        progress: 0
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        if (fileToRemove.originalUrl) URL.revokeObjectURL(fileToRemove.originalUrl);
        if (fileToRemove.compressedUrl) URL.revokeObjectURL(fileToRemove.compressedUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((file) => {
      if (file.originalUrl) URL.revokeObjectURL(file.originalUrl);
      if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
    });
    setFiles([]);
  };

  // The actual compression routine
  const compressImage = async (fileItem: CompressedFile): Promise<CompressedFile> => {
    return new Promise((resolve) => {
      // SVG bypass - SVGs can't be compressed via Canvas pixels without losing vector nature
      if (fileItem.originalFormat.includes("svg")) {
        resolve({
          ...fileItem,
          compressedSize: fileItem.originalSize,
          compressedUrl: fileItem.originalUrl,
          targetFormat: "svg",
          status: "done",
          progress: 100
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        let targetWidth = img.naturalWidth;
        let targetHeight = img.naturalHeight;

        // Resize option application
        if (resizeOption !== "original") {
          const maxDim = parseInt(resizeOption, 10);
          if (img.naturalWidth > maxDim || img.naturalHeight > maxDim) {
            if (img.naturalWidth > img.naturalHeight) {
              targetWidth = maxDim;
              targetHeight = Math.round((img.naturalHeight * maxDim) / img.naturalWidth);
            } else {
              targetHeight = maxDim;
              targetWidth = Math.round((img.naturalWidth * maxDim) / img.naturalHeight);
            }
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({
            ...fileItem,
            status: "error",
            error: "Failed to initialize canvas context."
          });
          return;
        }

        // Draw image with scaling
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Determine output MIME type
        const outputMime = targetFormat === "original" 
          ? `image/${fileItem.originalFormat}` 
          : `image/${targetFormat}`;

        // Get compression ratio
        const qualityParam = quality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                ...fileItem,
                status: "error",
                error: "Image compression failed."
              });
              return;
            }

            const compressedUrl = URL.createObjectURL(blob);
            resolve({
              ...fileItem,
              compressedSize: blob.size,
              compressedUrl,
              targetFormat: targetFormat === "original" ? fileItem.originalFormat : targetFormat,
              width: targetWidth,
              height: targetHeight,
              status: "done",
              progress: 100
            });
          },
          outputMime === "image/png" ? "image/png" : outputMime, // canvas.toBlob format supports image/jpeg, image/webp, image/png
          outputMime === "image/png" ? undefined : qualityParam // PNG uses lossless compression quality parameter ignored
        );
      };

      img.onerror = () => {
        resolve({
          ...fileItem,
          status: "error",
          error: "Failed to load image file."
        });
      };

      img.src = fileItem.originalUrl;
    });
  };

  const triggerBulkCompression = async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);

    const updatedFiles = [...files];
    
    // Set all idle/error status to compressing
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status !== "done") {
        updatedFiles[i] = {
          ...updatedFiles[i],
          status: "compressing",
          progress: 20
        };
      }
    }
    setFiles([...updatedFiles]);

    // Compress sequentially
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === "compressing") {
        try {
          const result = await compressImage(updatedFiles[i]);
          updatedFiles[i] = result;
          setFiles([...updatedFiles]);
        } catch (e) {
          updatedFiles[i] = {
            ...updatedFiles[i],
            status: "error",
            error: "An unexpected error occurred during processing."
          };
          setFiles([...updatedFiles]);
        }
      }
    }

    setIsProcessing(false);
  };

  const handleDownloadSingle = (file: CompressedFile) => {
    if (file.status !== "done" || !file.compressedUrl) return;
    const link = document.createElement("a");
    link.href = file.compressedUrl;
    
    // Extract name base and attach suffix
    const dotIndex = file.name.lastIndexOf(".");
    const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
    const ext = file.targetFormat === "jpeg" ? "jpg" : file.targetFormat;
    
    link.download = `${baseName}_ezcompressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const doneFiles = files.filter(f => f.status === "done");
    if (doneFiles.length === 0) return;

    // Trigger downloads with a slight delay to ensure browser handles them in bulk cleanly
    doneFiles.forEach((file, index) => {
      setTimeout(() => {
        handleDownloadSingle(file);
      }, index * 250);
    });
  };

  // Calculate totals
  const totalOriginalSize = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedSize = files.reduce((acc, f) => acc + (f.compressedSize || f.originalSize), 0);
  const totalSavings = totalOriginalSize > 0 
    ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 
    : 0;

  return (
    <div className="space-y-8" id="image-compressor-container">
      {/* Dynamic Header Section */}
      <div className="text-center mb-8" id="compressor-hero-section">
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-150 dark:border-purple-900/30 px-3 py-1 rounded-full inline-block">
          ⚡ Ultra Fast Local Compressor
        </span>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-950 dark:text-white tracking-tight mt-3">
          Free Bulk Image Compressor
        </h1>
        <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-lg mx-auto font-medium">
          Optimize PNG, JPG, WebP and SVG images locally in seconds. Max privacy, unlimited files, zero remote uploads.
        </p>
      </div>

      {/* Main Grid: Left Controls, Right File List */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Advanced Controls Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
            <Sliders className="h-5 w-5 text-purple-500" />
            <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white uppercase tracking-wider">
              Optimization Settings
            </h3>
          </div>

          {/* Slider for Quality */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
              <span>Compression Quality</span>
              <span className="text-purple-600 dark:text-purple-400 font-mono text-[13px] font-extrabold">
                {quality}%
              </span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
              id="compressor-quality-slider"
            />
            <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Max Compress</span>
              <span>Balanced (Recommended)</span>
              <span>Lossless</span>
            </div>
          </div>

          {/* Format Converter Select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Output Convert Format
            </label>
            <select
              value={targetFormat}
              onChange={(e) => {
                setTargetFormat(e.target.value);
                // Update format of all idle files dynamically
                setFiles(prev => prev.map(f => f.status === "idle" ? {
                  ...f,
                  targetFormat: e.target.value === "original" ? f.originalFormat : e.target.value
                } : f));
              }}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 dark:bg-neutral-950 dark:border-neutral-800 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              id="compressor-format-select"
            >
              <option value="original">Keep Original Formats</option>
              <option value="webp">Convert All to WebP (Recommended)</option>
              <option value="jpeg">Convert All to JPEG (Universal)</option>
              <option value="png">Convert All to PNG (Lossless)</option>
            </select>
            <p className="text-[10px] text-gray-400 dark:text-neutral-500 leading-relaxed font-semibold">
              Converting heavy PNG screenshots to WebP often reduces file sizes by up to 90%!
            </p>
          </div>

          {/* Max Dimensions Resizing */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Maximum Image Resizing
            </label>
            <select
              value={resizeOption}
              onChange={(e) => setResizeOption(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 dark:bg-neutral-950 dark:border-neutral-800 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              id="compressor-resize-select"
            >
              <option value="original">Keep Original Dimensions</option>
              <option value="1920">Scale Down to Full HD (Max 1920px)</option>
              <option value="1280">Scale Down to HD (Max 1280px)</option>
              <option value="800">Optimize for Web/Mobile (Max 800px)</option>
              <option value="640">Small Compressed Icons (Max 640px)</option>
            </select>
            <p className="text-[10px] text-gray-400 dark:text-neutral-500 leading-relaxed font-semibold">
              Downscaling massive 4K DSLR photos reduces data volume instantly before the compression loop!
            </p>
          </div>

          {/* Summary Box */}
          {files.length > 0 && (
            <div className="bg-slate-50 dark:bg-neutral-950 p-4 rounded-xl border border-slate-200/50 dark:border-neutral-800/60 space-y-3">
              <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Live Savings Overview</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <div>Original Sum:</div>
                <div className="text-right font-mono font-bold text-gray-900 dark:text-white">{formatBytes(totalOriginalSize)}</div>
                <div>Optimized Sum:</div>
                <div className="text-right font-mono font-bold text-gray-900 dark:text-white">{formatBytes(totalCompressedSize)}</div>
              </div>
              <div className="border-t border-slate-200/50 dark:border-neutral-850 pt-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Net Compression:</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  -{totalSavings.toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {/* Core Action Button Group */}
          <div className="space-y-2">
            <button
              onClick={triggerBulkCompression}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              id="bulk-compress-btn"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sliders className="h-4 w-4" />
                  <span>Optimize {files.length > 0 ? `${files.length} Image(s)` : "Images"}</span>
                </>
              )}
            </button>

            {files.some(f => f.status === "done") && (
              <button
                onClick={handleDownloadAll}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                id="bulk-download-btn"
              >
                <Download className="h-4 w-4" />
                <span>Download All Saved</span>
              </button>
            )}

            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-red-500 hover:text-white text-gray-500 dark:bg-neutral-800 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                id="clear-all-compress-btn"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All Workspace</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Drag-Drop Area and File Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* File Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? "border-purple-500 bg-purple-500/[0.04]" 
                : "border-slate-250 hover:border-purple-500/50 bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:dark:border-purple-500/30"
            }`}
            id="compressor-dropzone"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden" 
            />
            <div className="max-w-md mx-auto space-y-3 pointer-events-none">
              <div className="mx-auto h-12 w-12 bg-purple-100 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-gray-950 dark:text-white">
                  Drag and drop files here, or <span className="text-purple-600 dark:text-purple-400 underline decoration-dotted">browse local files</span>
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">
                  Supports JPEG, PNG, WEBP, SVG • Bulk Uploads Allowed
                </p>
              </div>
            </div>
          </div>
          {/* File Queue List */}
          <AnimatePresence>
            {files.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
                id="compress-file-queue"
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest pl-1">
                  <span>Queued Images ({files.length})</span>
                  <span>Status</span>
                </div>

                {files.map((file) => {
                  const savings = file.compressedSize > 0 
                    ? ((file.originalSize - file.compressedSize) / file.originalSize) * 100 
                    : 0;

                  return (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3.5 md:p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      id={`queue-card-${file.id}`}
                    >
                      {/* Image Preview & Details */}
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-150 dark:border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                          <img 
                            src={file.originalUrl} 
                            alt="preview" 
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1 right-1 text-[8px] font-bold px-1 py-0.2 bg-black/60 text-white uppercase rounded font-mono">
                            {file.originalFormat}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-gray-950 dark:text-white truncate max-w-[200px] sm:max-w-[300px]" title={file.name}>
                            {file.name}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold">
                            <span className="text-gray-400 font-mono">Original: {formatBytes(file.originalSize)}</span>
                            {file.status === "done" && (
                              <>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                                <span className="text-purple-600 dark:text-purple-400 font-mono">Optimized: {formatBytes(file.compressedSize)}</span>
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md font-mono">
                                  -{savings.toFixed(1)}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-100 dark:border-neutral-800/60 pt-3 sm:pt-0 shrink-0">
                        {/* Status badging */}
                        <div>
                          {file.status === "idle" && (
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                              <Clock className="h-3.5 w-3.5" /> Queued
                            </span>
                          )}
                          {file.status === "compressing" && (
                            <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1 bg-purple-100/50 dark:bg-purple-950/30 px-2.5 py-1 rounded-lg">
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Compressing
                            </span>
                          )}
                          {file.status === "done" && (
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Optimised
                            </span>
                          )}
                          {file.status === "error" && (
                            <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1 bg-red-100 dark:bg-red-950/30 px-2.5 py-1 rounded-lg" title={file.error}>
                              <AlertCircle className="h-3.5 w-3.5" /> Failed
                            </span>
                          )}
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-1.5">
                          {file.status === "done" && (
                            <button
                              onClick={() => handleDownloadSingle(file)}
                              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                              title="Download compressed image"
                              id={`queue-download-single-${file.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1.5 rounded-lg bg-slate-55 hover:bg-red-500 hover:text-white text-gray-400 dark:bg-neutral-850 dark:hover:bg-red-950 transition-colors cursor-pointer"
                            title="Remove image from workspace"
                            id={`queue-remove-single-${file.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-xs" id="empty-queue-alert">
                <ImageIcon className="h-10 w-10 text-slate-350 dark:text-neutral-700 mx-auto mb-3" />
                <h4 className="font-display font-bold text-gray-500 dark:text-neutral-400 text-sm">
                  Workspace is completely empty
                </h4>
                <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
                  Queue files by dragging and dropping them or browsing local file directories above.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
