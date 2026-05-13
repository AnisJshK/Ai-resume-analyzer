export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    // Prevent SSR execution
    if (typeof window === "undefined") {
      return {
        imageUrl: "",
        file: null,
        error: "PDF conversion only works in browser",
      };
    }

    // Dynamically import pdfjs only in browser
    const pdfjsLib = await import("pdfjs-dist");
    const pdfWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

    // Convert PDF to array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    // Get first page
    const page = await pdf.getPage(1);

    // Create viewport
    const viewport = page.getViewport({ scale: 3 });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context not found");
    }

    // Set canvas dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Improve quality
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // Render page
    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    // Convert canvas to image
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });

            return;
          }

          const imageFile = new File(
            [blob],
            file.name.replace(/\.pdf$/i, ".png"),
            {
              type: "image/png",
            },
          );

          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        },
        "image/png",
        1.0,
      );
    });
  } catch (err) {
    console.error("PDF Conversion Error:", err);

    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${String(err)}`,
    };
  }
}
