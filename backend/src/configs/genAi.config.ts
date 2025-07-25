import { GoogleGenAI } from "@google/genai";
import configs from "./index";

const genAI = new GoogleGenAI({
  apiKey: configs.general.GOOGLE_AI_KEY,
});

export { genAI };
