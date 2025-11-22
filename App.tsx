import React from 'react';
import { Header } from './components/Header';
import { ImageEditor } from './components/ImageEditor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow p-4 md:p-8">
          <ImageEditor />
        </main>

        <footer className="w-full py-6 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} NanoEdit AI. Built with Gemini 2.5 Flash.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;