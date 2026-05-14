"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import { cn, formatSize } from "../app/lib/utils"; // adjust path as needed

// ─── Animation variants (from Aceternity) ────────────────────────────────────
const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

// ─── Grid background (from Aceternity) ───────────────────────────────────────
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        }),
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const handleFileChange = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      onFileSelect?.(newFiles[0] ?? null);
    },
    [onFileSelect],
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    onFileSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
    onDropRejected: (errors) => console.warn("File rejected:", errors),
  });

  return (
    <div className="w-full border bg-slate-300 rounded-2xl items-center mx-auto my-auto " {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
      >
        {/* Hidden native input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files ?? []))}
          className="hidden"
        />

        {/* Animated grid background */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload file
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
            Drag and drop your file here or click to upload
          </p>
          <p className="relative z-20 text-sm text-gray-400 mt-1">
            PDF only · max {formatSize(maxFileSize)}
          </p>

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.length > 0 ? (
              /* ── File card ── */
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : `file-upload-${idx}`}
                  className={cn(
                    "relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 md:h-24 dark:bg-neutral-900",
                    "shadow-sm",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    {/* File name */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300"
                    >
                      {file.name}
                    </motion.p>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* File size */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="shadow-input rounded-lg px-2 py-1 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white"
                      >
                        {formatSize(file.size)}
                      </motion.p>

                      {/* Remove button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        type="button"
                        aria-label="Remove file"
                        onClick={handleRemove}
                        className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                      >
                        {/* Inline X icon — swap for IconX from @tabler/icons-react if available */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* File meta */}
                  <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800"
                    >
                      {file.type}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))
            ) : (
              /* ── Empty state: floating card + dashed border ── */
              <>
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center text-neutral-600"
                    >
                      Drop it
                      {/* Upload icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                        />
                      </svg>
                    </motion.p>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-neutral-600 dark:text-neutral-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
                      />
                    </svg>
                  )}
                </motion.div>

                {/* Dashed blue border that fades in on hover */}
                <motion.div
                  variants={secondaryVariant}
                  className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploader;
