import React, { useState } from 'react';
import { generateCodeFromImage } from './services/geminiService';
import ImageUpload from './components/ImageUpload';
import CodePreview from './components/CodePreview';
import { AppState } from './types';
import { Sparkles, ArrowRight, Github, Code } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setImageData({ base64, mimeType });
    // Reset output when new image is selected
    setAppState(AppState.IDLE);
    setRawResponse('');
  };

  const handleClear = () => {
    setImageData(null);
    setRawResponse('');
    setAppState(AppState.IDLE);
  };

  const handleConvert = async () => {
    if (!imageData) return;

    setAppState(AppState.PROCESSING);
    try {
      const result = await generateCodeFromImage(imageData.base64, imageData.mimeType);
      setRawResponse(result);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary selection:bg-accent/30">
      {/* Navbar */}
      <header className="h-16 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Code className="text-accent" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">InstaCode</h1>
              <p className="text-[10px] text-secondary font-mono uppercase tracking-widest">Pixel-Perfect Converter</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surfaceHighlight/50 border border-surfaceHighlight">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-secondary font-medium">System Online</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Input */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6">
          <div className="bg-surface rounded-2xl p-6 border border-surfaceHighlight shadow-sm">
             <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1">Source Image</h2>
                <p className="text-sm text-secondary">Upload an Instagram post to extract its HTML structure.</p>
             </div>
             
             <div className="aspect-[4/5] w-full">
               <ImageUpload 
                 onImageSelected={handleImageSelected} 
                 onClear={handleClear}
                 isProcessing={appState === AppState.PROCESSING}
               />
             </div>

             <div className="mt-6">
               <button
                 onClick={handleConvert}
                 disabled={!imageData || appState === AppState.PROCESSING}
                 className="w-full py-4 rounded-xl bg-accent hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 group"
               >
                 {appState === AppState.PROCESSING ? (
                    <>
                      <span className="animate-spin text-xl">◌</span>
                      <span>Processing...</span>
                    </>
                 ) : (
                    <>
                      <Sparkles size={20} className="group-hover:text-yellow-200 transition-colors" />
                      <span>Convert to Code</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                 )}
               </button>
             </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-surfaceHighlight">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">How it works</h3>
            <ul className="space-y-3 text-sm text-secondary/80">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surfaceHighlight text-[10px] font-mono mt-0.5">1</span>
                <span>Upload a screenshot of an Instagram post (4:5 ratio recommended).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surfaceHighlight text-[10px] font-mono mt-0.5">2</span>
                <span>AI analyzes layout, typography, and spacing without making aesthetic changes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surfaceHighlight text-[10px] font-mono mt-0.5">3</span>
                <span>Get a raw, static HTML/CSS template ready for use.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="w-full lg:w-[60%] h-[800px] lg:h-auto min-h-[600px] flex flex-col">
          {appState === AppState.IDLE && !rawResponse ? (
            <div className="flex-1 bg-surface rounded-2xl border border-surfaceHighlight flex flex-col items-center justify-center text-secondary p-8 text-center border-dashed">
              <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6">
                <Code size={40} className="opacity-20" />
              </div>
              <h3 className="text-xl font-medium text-primary mb-2">Ready to Generate</h3>
              <p className="max-w-md mx-auto">Upload an image and click convert to see the generated code and live preview here.</p>
            </div>
          ) : (
            <CodePreview rawResponse={rawResponse} />
          )}
        </div>

      </main>
    </div>
  );
};

export default App;