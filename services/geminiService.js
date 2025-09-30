// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function resumirConGemini(metrics) {
  if (!KEY) return null;
  const genAI = new GoogleGenerativeAI(KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = [
    'Eres SRE. Resume salud de la API en español y sugiere 2-3 acciones.',
    `Métricas: ${JSON.stringify(metrics)}`
  ].join('\n');

  const resp = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }]}], generationConfig: { temperature: 0.3 } });
  return resp?.response?.text?.() || null;
}
