import { GoogleGenAI } from "@google/genai";

// CAUTION: In a real production app, never expose keys on the client.
// This is for demonstration purposes within a client-side only context.
const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  // Ideally this comes from env, but if it's missing in this specific sandbox 
  // environment, we handle it gracefully or prompt the user. 
  // For this code gen, we assume process.env.API_KEY is available.
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  // 1. Fast Generation
  generateTitle: async (topic: string): Promise<string> => {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using 2.5 Flash for reliable low latency
        contents: `Generate a catchy, SEO-friendly blog post title about: ${topic}. Return only the title text.`,
      });
      return response.text?.trim() || "Untitled Post";
    } catch (error) {
      console.error("Gemini Title Error:", error);
      return `New Post about ${topic}`;
    }
  },

  // 2. Complex Generation with Search Grounding (Flash)
  generateBlogPost: async (topic: string): Promise<{content: string, sources: string[]}> => {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a comprehensive, engaging blog post about "${topic}". 
        IMPORTANT: Return the content in HTML format. Use <h1>, <h2>, <p>, <ul>, <li>, <strong> tags for formatting. 
        Do not use Markdown fences. Ensure information is up to date.`,
        config: {
          tools: [{ googleSearch: {} }], // Grounding
        }
      });
      
      const content = response.text || "";
      
      // Extract sources if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .map((c: any) => c.web?.uri)
        .filter((uri: string) => uri !== undefined);

      return { content, sources };
    } catch (error) {
      console.error("Gemini Content Error:", error);
      return { content: "<p>Failed to generate content. Please try again.</p>", sources: [] };
    }
  },

  // 3. Image Editing (Nano Banana - Gemini 2.5 Flash Image)
  editImage: async (imageBase64: string, prompt: string): Promise<string | null> => {
    try {
      const ai = getClient();
      // Important: Ensure base64 string doesn't have the data URL prefix for the payload if the SDK handles it, 
      // but usually standard is raw base64. The SDK helper might want raw.
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/png', // Assuming PNG or converting logic elsewhere
                data: cleanBase64
              }
            },
            {
              text: prompt
            }
          ]
        }
      });

      // Iterate to find image part
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      return null;
    }
  },

  // 4. Image Generation (using Gemini 2.5 Flash Image for generation)
  generateThumbnail: async (prompt: string): Promise<string | null> => {
    try {
      const ai = getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt || "A futuristic digital art representation of technology"
            }
          ]
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Gen Error:", error);
      return null;
    }
  }
};