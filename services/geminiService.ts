import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Converts a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1]; 
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Sends an image and a text prompt to Gemini 2.5 Flash Image to generate an edited version.
 */
export const generateEditedImage = async (
  base64Image: string, 
  mimeType: string, 
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
        ],
      },
      // Configuration for image generation/editing
      config: {
        // We do not set responseMimeType for image models unless we want JSON metadata, 
        // but here we expect the model to return an image in the response parts.
      }
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct a data URL for the returned image
          // Note: The API usually returns the mimeType, defaulting to png if missing
          const returnMimeType = part.inlineData.mimeType || 'image/png';
          return `data:${returnMimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};