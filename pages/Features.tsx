import React from 'react';
import { GeminiImageEditor } from '../components/GeminiImageEditor';

export const Features: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Creative Suite</h1>
        <p className="text-gray-600">Power up your creativity with our advanced Gemini-integrated tools.</p>
      </div>
      
      <div className="mb-12">
        <GeminiImageEditor />
      </div>
    </div>
  );
};
