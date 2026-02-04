
import { GoogleGenAI, Type } from "@google/genai";
import { MedicineInfo, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMedicineDetails = async (medicineName: string, lang: Language = Language.EN): Promise<MedicineInfo> => {
  const languagePrompt = lang === Language.EN ? "" : `IMPORTANT: Provide all text field values in ${lang} language script.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide detailed medical information for the medicine: ${medicineName}. 
    Include primary uses, common side effects, safer alternatives if applicable, and important precautions.
    ${languagePrompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          uses: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          sideEffects: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          precautions: { type: Type.STRING }
        },
        required: ["name", "uses", "sideEffects", "alternatives", "precautions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as MedicineInfo;
};
