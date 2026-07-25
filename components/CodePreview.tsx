import React, { useState, useEffect, useMemo } from 'react';
import { Code2, Eye, Copy, Check, Terminal, RefreshCw } from 'lucide-react';

interface CodePreviewProps {
  rawResponse: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ rawResponse }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  
  // State for editable code
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState('');

  // Initialize code from rawResponse when it changes
  useEffect(() => {
    // Extract HTML content from the response
    let html = "<!-- No valid HTML found -->";
    const htmlMatch = rawResponse.match(/```html([\s\S]*?)```/);
    if (htmlMatch) {
        html = htmlMatch[1].trim();
    } else {
        const doctypeMatch = rawResponse.match(/<!DOCTYPE html>[\s\S]*?(?=```|$)/i);
        if (doctypeMatch) html = doctypeMatch[0].trim();
        // If raw response is just code without markdown
        else if (rawResponse.trim().startsWith('<')) html = rawResponse.trim();
    }
    
    setCode(html);

    // Extract Analysis if present (usually removed in new prompt, but kept for safety)
    const analysisText = rawResponse.replace(/```[\s\S]*?```/g, '').replace(/<!DOCTYPE html>[\s\S]*/i, '').trim();
    setAnalysis(analysisText);
  }, [rawResponse]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl overflow-hidden border border-surfaceHighlight shadow-2xl">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-surfaceHighlight">
        <div className="flex items-center gap-1 bg-surfaceHighlight/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'preview' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'code' 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Code2 size={16} />
            Source / Edit
          </button>
        </div>

        <div className="flex items-center gap-2">
           {activeTab === 'code' && (
             <>
               <span className="text-xs text-secondary hidden md:block mr-2">You can edit the code below</span>
               <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-secondary hover:text-primary hover:bg-surfaceHighlight transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
             </>
           )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex items-center justify-center bg-dots p-8">
             {/* Device Mockup Wrapper */}
             <div className="relative w-full max-w-[400px] aspect-[4/5] shadow-2xl rounded-sm overflow-hidden bg-white mx-auto ring-1 ring-white/10">
                <iframe
                  title="Live Preview"
                  srcDoc={code}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
             </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col">
            {analysis && (
                <div className="p-2 bg-blue-900/10 border-b border-blue-500/20">
                     <div className="flex items-center gap-2 text-blue-400 px-2">
                        <Terminal size={14} />
                        <span className="text-xs font-mono uppercase">AI Note</span>
                     </div>
                     <p className="text-xs text-blue-200/80 font-mono px-2 truncate">{analysis}</p>
                </div>
            )}
            <div className="flex-1 relative">
                <textarea 
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 resize-none outline-none border-none custom-scrollbar"
                    spellCheck="false"
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;