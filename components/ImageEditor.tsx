import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { fileToBase64, generateEditedImage } from '../services/geminiService';
import { ImageUploader } from './ImageUploader';

export const ImageEditor: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggestions for users
  const suggestions = [
    "Make it a starry night with a full moon",
    "Add a retro cyberpunk filter",
    "Turn it into a pencil sketch",
    "Add fireworks in the background"
  ];

  const handleImageSelect = async (file: File) => {
    setSourceImage(file);
    const base64 = await fileToBase64(file);
    // Add the data prefix back for preview
    setSourcePreview(`data:${file.type};base64,${base64}`);
    setResultImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const handleGenerate = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      const base64Data = await fileToBase64(sourceImage);
      const generatedImageBase64 = await generateEditedImage(base64Data, sourceImage.type, prompt);
      
      setResultImage(generatedImageBase64);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to generate image. Please try again.");
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setSourcePreview(null);
    setResultImage(null);
    setPrompt('');
    setAppState(AppState.IDLE);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Input Section */}
      {!sourcePreview ? (
        <div className="max-w-xl mx-auto mt-12 px-4 animate-fade-in-up">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Reimagine your photos
            </h2>
            <p className="text-slate-400 text-lg">
              Upload an image and use natural language to edit it instantly with Gemini.
            </p>
          </div>
          <ImageUploader onImageSelected={handleImageSelect} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in">
          
          {/* Left Column: Controls & Source */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Original</h3>
                <button 
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 relative">
                <img 
                  src={sourcePreview} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl">
               <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Vision</h3>
               <textarea
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe your edit... (e.g. 'Add a neon sign that says Hello')"
                 className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32 mb-4"
               />
               
               <div className="flex flex-wrap gap-2 mb-6">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs py-1 px-3 rounded-full bg-slate-700/50 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-300 border border-transparent hover:border-indigo-500/30 transition-all text-left truncate max-w-full"
                    >
                      {suggestion}
                    </button>
                  ))}
               </div>

               <button
                 onClick={handleGenerate}
                 disabled={appState === AppState.PROCESSING || !prompt.trim()}
                 className={`
                   w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                   flex items-center justify-center gap-2
                   ${appState === AppState.PROCESSING 
                     ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                     : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
                   }
                 `}
               >
                 {appState === AppState.PROCESSING ? (
                   <>
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>Generating...</span>
                   </>
                 ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                     </svg>
                     <span>Generate Magic</span>
                   </>
                 )}
               </button>
               {errorMsg && (
                 <p className="mt-4 text-sm text-red-400 text-center bg-red-900/20 p-2 rounded-lg border border-red-900/50">{errorMsg}</p>
               )}
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-8">
            <div className="h-full bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 flex flex-col relative min-h-[500px]">
               <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                 <span>Result</span>
                 {resultImage && (
                    <a 
                      href={resultImage} 
                      download={`nanoedit-${Date.now()}.png`}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs normal-case"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                 )}
               </h3>
               
               <div className="flex-1 rounded-xl bg-slate-900/50 border border-slate-700/50 overflow-hidden flex items-center justify-center relative group">
                 {appState === AppState.PROCESSING && (
                   <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-300 animate-pulse">Dreaming up your image...</p>
                   </div>
                 )}

                 {resultImage ? (
                   <img 
                     src={resultImage} 
                     alt="Generated result" 
                     className="max-w-full max-h-[70vh] object-contain shadow-2xl"
                   />
                 ) : (
                    <div className="text-center p-8 opacity-40">
                      {appState === AppState.PROCESSING ? null : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-slate-400">Your masterpiece will appear here</p>
                        </>
                      )}
                    </div>
                 )}
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};