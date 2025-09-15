// stores/authStore.ts
import { create } from "zustand";

type ImageReportResult = {
  riskLevel: string;
  title: string;
  detectedKeywords: string[];
  summary: string;
  guide: string;
  extractedText: string;
};

type ImageReportState = {
  imageReportResult: ImageReportResult | null;
  setImageReportResult: (result: ImageReportResult | null) => void;
};

export const useImageReportStore = create<ImageReportState>((set) => ({
  imageReportResult: null,
  setImageReportResult: (result) => set({ imageReportResult: result }),
}));
