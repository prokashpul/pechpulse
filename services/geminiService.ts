import { GoogleGenAI } from "@google/genai";

// Helper to get client with priority: User Key > Env Key
const getClient = (userApiKey?: string) => {
  const apiKey = userApiKey || process.env.API_KEY || ''; 
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Gemini API Key in Profile settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  // 1. Fast Generation
  generateTitle: async (topic: string, apiKey?: string): Promise<string> => {
    try {
      const ai = getClient(apiKey);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        contents: `Generate a catchy, SEO-friendly blog post title about: ${topic}. Return only the title text.`,
      });
      return response.text?.trim() || "Untitled Post";
    } catch (error) {
      console.error("Gemini Title Error:", error);
      return `New Post about ${topic}`;
    }
  },

  // 2. Complex Generation with Search Grounding (Flash)
  generateBlogPost: async (topic: string, apiKey?: string): Promise<{content: string, sources: string[]}> => {
    try {
      const ai = getClient(apiKey);
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
      return { content: "<p>Failed to generate content. Please check your API Key or try again.</p>", sources: [] };
    }
  },

  // 3. Image Editing (Nano Banana - Gemini 2.5 Flash Image)
  editImage: async (imageBase64: string, prompt: string, apiKey?: string): Promise<string | null> => {
    try {
      const ai = getClient(apiKey);
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/png', 
                data: cleanBase64
              }
            },
            {
              text: prompt
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
      console.error("Gemini Image Edit Error:", error);
      return null;
    }
  },

  // 4. Image Generation
  generateThumbnail: async (prompt: string, apiKey?: string): Promise<string | null> => {
    try {
      const ai = getClient(apiKey);
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