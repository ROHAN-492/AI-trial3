
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { EmotionDisplay } from './components/EmotionDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { analyzeImageEmotion } from './services/geminiService';
import { MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from './constants';

interface AppState {
  selectedFile: File | null;
  imagePreviewUrl: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
  detectedEmotion: string | null;
  isLoading: boolean;
  error: string | null;
}

const InitialAppState: AppState = {
  selectedFile: null,
  imagePreviewUrl: null,
  imageBase64: null,
  imageMimeType: null,
  detectedEmotion: null,
  isLoading: false,
  error: null,
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(InitialAppState);

  const resetState = useCallback(() => {
    setAppState(InitialAppState);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setAppState(prev => ({ ...prev, error: `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`, selectedFile: null, imagePreviewUrl: null }));
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAppState(prev => ({ ...prev, error: `Invalid file type. Accepted types: ${ACCEPTED_IMAGE_TYPES.join(', ')}.`, selectedFile: null, imagePreviewUrl: null }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64String = dataUrl.substring(dataUrl.indexOf(',') + 1);
      const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      
      setAppState({
        ...InitialAppState, // Reset other fields like emotion/error
        selectedFile: file,
        imagePreviewUrl: dataUrl,
        imageBase64: base64String,
        imageMimeType: mimeType,
      });
    };
    reader.onerror = () => {
      setAppState(prev => ({ ...prev, error: 'Failed to read file.', isLoading: false }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyzeEmotion = useCallback(async () => {
    if (!appState.imageBase64 || !appState.imageMimeType) {
      setAppState(prev => ({ ...prev, error: 'No image data to analyze.' }));
      return;
    }

    setAppState(prev => ({ ...prev, isLoading: true, error: null, detectedEmotion: null }));

    try {
      const emotion = await analyzeImageEmotion(appState.imageBase64, appState.imageMimeType);
      setAppState(prev => ({ ...prev, detectedEmotion: emotion, isLoading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setAppState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, [appState.imageBase64, appState.imageMimeType]);

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Emotion Detector AI
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Upload an image to see the magic!</p>
      </header>

      <main className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 space-y-6">
        <ImageUploader
          onFileSelect={handleFileSelect}
          imagePreviewUrl={appState.imagePreviewUrl}
          disabled={appState.isLoading}
        />

        {(appState.selectedFile || appState.detectedEmotion || appState.error) && (
            <div className="flex flex-col sm:flex-row gap-4">
                 {appState.selectedFile && !appState.isLoading && (
                    <button
                        onClick={handleAnalyzeEmotion}
                        disabled={appState.isLoading || !appState.selectedFile}
                        className="w-full sm:w-auto flex-grow bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {appState.isLoading ? 'Analyzing...' : 'Analyze Emotion'}
                    </button>
                )}
                <button
                    onClick={resetState}
                    className="w-full sm:w-auto flex-grow bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out"
                >
                    Clear
                </button>
            </div>
        )}


        {appState.isLoading && (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        )}

        {appState.error && !appState.isLoading && (
          <ErrorAlert message={appState.error} onClose={() => setAppState(prev => ({ ...prev, error: null }))} />
        )}

        {appState.detectedEmotion && !appState.isLoading && !appState.error && (
          <EmotionDisplay emotion={appState.detectedEmotion} />
        )}
      </main>

      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Emotion Detector AI. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
