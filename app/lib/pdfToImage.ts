export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    // Use unpkg which has every version including 5.x
    lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    // Fix: reduced scale from 4 to 2 to avoid canvas memory limits
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Fix: check context before rendering, fail early with clear error
    const context = canvas.getContext("2d");
    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to get canvas 2D context",
      };
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });
            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob — canvas may be too large",
            });
          }
        },
        "image/png",
        1.0,
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err); // so you can see the real error
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
