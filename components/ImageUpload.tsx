import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onClear: () => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, onClear, isProcessing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Extract base64 data and mime type
      const match = result.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        onImageSelected(match[2], match[1]);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onClear();
  };

  if (preview) {
    return (
      <div className="relative w-full h-full min-h-[400px] bg-surface rounded-xl overflow-hidden border border-surfaceHighlight group">
        <img 
          src={preview} 
          alt="Upload preview" 
          className="w-full h-full object-contain bg-black/50"
        />
        <button
          onClick={handleClear}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
        >
          <X size={20} />
        </button>
        {isProcessing && (
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
             <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
               <p className="text-secondary font-mono text-sm animate-pulse">Analyzing Pixels...</p>
             </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 ${
        dragActive ? 'border-accent bg-accent/5' : 'border-surfaceHighlight bg-surface hover:border-secondary/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center gap-4 pointer-events-none p-6 text-center">
        <div className={`p-4 rounded-full ${dragActive ? 'bg-accent/20 text-accent' : 'bg-surfaceHighlight text-secondary'}`}>
          {dragActive ? <ImageIcon size={32} /> : <Upload size={32} />}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-primary">Drop your Instagram post here</p>
          <p className="text-sm text-secondary">or click to browse</p>
        </div>
        <div className="text-xs text-secondary/60 mt-4 px-3 py-1 bg-surfaceHighlight rounded-full">
          Support: JPG, PNG, WEBP (Max 5MB)
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;