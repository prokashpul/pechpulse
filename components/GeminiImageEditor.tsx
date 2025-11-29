import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { Upload, Wand2, Loader2, Download } from 'lucide-react';

export const GeminiImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null); // Reset edited image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;
    setLoading(true);
    try {
      const result = await GeminiService.editImage(originalImage, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        alert("Could not generate image. Try a different prompt.");
      }
    } catch (e) {
      console.error(e);
      alert("Error editing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <Wand2 className="w-5 h-5 mr-2 text-indigo-600" />
              Nano Banana Editor
            </h3>
            <p className="text-sm text-gray-500">
              Upload an image and use AI to transform it. Ask to "add sunglasses", "make it sketch style", or "remove background".
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">1. Upload Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Click to upload (PNG/JPG)</span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700">2. Describe Changes</label>
             <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Make it look like a cyberpunk city, add a cat in the corner..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-24 resize-none"
             />
          </div>

          <button 
            onClick={handleEdit}
            disabled={!originalImage || !prompt || loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium flex items-center justify-center transition ${!originalImage || !prompt || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Generate Edit'}
          </button>
        </div>

        {/* Preview */}
        <div className="w-full md:w-2/3 bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center min-h-[400px]">
           {!originalImage && <div className="text-gray-400 text-sm">No image uploaded</div>}
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {originalImage && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 text-center uppercase">Original</p>
                  <img src={originalImage} alt="Original" className="w-full h-auto rounded-md shadow-sm border border-gray-200" />
                </div>
              )}
              {editedImage ? (
                <div className="space-y-2">
                   <p className="text-xs font-semibold text-indigo-600 text-center uppercase flex items-center justify-center">
                     <Wand2 className="w-3 h-3 mr-1" /> Edited
                   </p>
                   <div className="relative group">
                     <img src={editedImage} alt="Edited" className="w-full h-auto rounded-md shadow-sm border border-gray-200" />
                     <a href={editedImage} download="nano-edit.png" className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Download className="w-4 h-4" />
                     </a>
                   </div>
                </div>
              ) : (originalImage && loading) ? (
                 <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed border-indigo-200 rounded-md bg-indigo-50/50">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                 </div>
              ) : null}
           </div>
        </div>

      </div>
    </div>
  );
};
