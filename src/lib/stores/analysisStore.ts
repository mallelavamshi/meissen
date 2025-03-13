import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  results: Array<{
    title: string;
    price?: string;
    source?: string;
    url?: string;
    extracted_price?: string;
    analysis?: {
      estimated_value?: string;
      value_range?: string;
      confidence?: string;
      condition?: string;
      era?: string;
      material?: string;
      style?: string;
      description?: string;
    };
  }>;
  timestamp: string;
}

interface AnalysisState {
  results: AnalysisResult[];
  isProcessing: boolean;
  currentBatch: string[];
  error: string | null;
  
  setProcessing: (isProcessing: boolean) => void;
  setCurrentBatch: (urls: string[]) => void;
  updateResult: (id: string, updatedResult: Partial<AnalysisResult>) => void;
  addResult: (result: AnalysisResult) => void;
  updateResult: (id, updatedResult) => set((state) => ({
    results: state.results.map((result) =>
      result.id === id ? { ...result, ...updatedResult } : result
    ),
  })),
  clearResults: () => void;
  setError: (error: string | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  results: [],
  isProcessing: false,
  currentBatch: [],
  error: null,
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  setCurrentBatch: (urls) => set({ currentBatch: urls }),
  
  addResult: (result) => set((state) => ({ 
    results: [...state.results, result] 
  })),
  
  clearResults: () => set({ results: [] }),
  
  setError: (error) => set({ error })
}));