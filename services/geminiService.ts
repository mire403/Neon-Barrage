import { GoogleGenAI, Type } from "@google/genai";
import { PatternConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePattern = async (theme: string): Promise<PatternConfig> => {
  const modelId = "gemini-2.5-flash"; // Good balance of speed and logic for JSON

  const prompt = `
    Design a "Danmaku" (Bullet Hell) game pattern configuration based on the theme: "${theme}".
    The output must be a valid JSON object matching the provided schema.
    
    IMPORTANT: The 'name' and 'description' fields in the JSON response MUST be in Chinese (Simplified).

    Think about how the theme translates to movement. 
    - "Ice": slow, freezing, crystal shapes, blue/white colors.
    - "Fire": fast, spreading, red/orange colors.
    - "Cyberpunk": neon colors, geometric patterns, high speed.
    - "Flower": rotating spirals, pink/green.

    Emitter Types:
    - 'ring': Shoots bullets in a circle.
    - 'spiral': Shoots while rotating.
    - 'spread': Shotgun spread.
    - 'aimed': Aimed at player (bottom center).
    - 'flower': Complex multi-arm spiral.
    - 'random': Random directions.

    Difficulty should be one of: Easy, Normal, Hard, Lunatic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Creative name of the spell card/pattern in Chinese" },
            description: { type: Type.STRING, description: "Flavor text describing the pattern in Chinese" },
            difficulty: { type: Type.STRING, enum: ["Easy", "Normal", "Hard", "Lunatic"] },
            emitters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["ring", "spiral", "spread", "aimed", "flower", "random"] },
                  frequency: { type: Type.NUMBER, description: "Frames between shots (lower is faster). 5-60 range." },
                  bulletCount: { type: Type.NUMBER, description: "Bullets per shot. 1-50 range." },
                  speed: { type: Type.NUMBER, description: "Bullet speed. 2-10 range." },
                  speedVariance: { type: Type.NUMBER, description: "Randomness in speed. 0-2." },
                  angleOffset: { type: Type.NUMBER, description: "Initial angle in degrees." },
                  angleIncrement: { type: Type.NUMBER, description: "Rotation per frame (spin). -10 to 10." },
                  color: { type: Type.STRING, description: "Hex color code e.g. #FF00FF" },
                  shape: { type: Type.STRING, enum: ["circle", "diamond", "star", "rect"] },
                  size: { type: Type.NUMBER, description: "Bullet radius. 3-10 range." },
                  lifetime: { type: Type.NUMBER, description: "Optional: frames this emitter stays active. 0 for infinite." },
                  delay: { type: Type.NUMBER, description: "Optional: frames to wait before starting." }
                },
                required: ["type", "frequency", "bulletCount", "speed", "angleOffset", "angleIncrement", "color", "shape", "size"]
              }
            }
          },
          required: ["name", "description", "difficulty", "emitters"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");
    
    return JSON.parse(jsonText) as PatternConfig;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback pattern if API fails
    return {
      name: "紧急防御协议",
      description: "AI 核心连接失败。启动备用循环防御模式。",
      difficulty: "Normal",
      emitters: [
        {
          type: "spiral",
          frequency: 5,
          bulletCount: 2,
          speed: 4,
          angleOffset: 0,
          angleIncrement: 13,
          color: "#00FF00",
          shape: "rect",
          size: 4
        }
      ]
    };
  }
};