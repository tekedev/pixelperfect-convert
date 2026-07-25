import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are a High-Precision Optical Character Recognition (OCR) and Layout Engine.
Your ONLY goal is to clone the provided image into a single HTML file with embedded CSS.

### STRICT RULES (NO CREATIVITY ALLOWED)
1.  **NO HALLUCINATIONS:** Do not add "LIVE", "+", or any icons unless they are clearly visible in the image.
2.  **EXACT TEXT COPY:** Copy text exactly as it appears. Watch for small details like dates, slashes, and bullet points.
3.  **LAYOUT FIDELITY:**
    - If a header has text on the left and right, use \`flex justify-between\`.
    - If text is centered, use \`text-center\`.
    - Maintain the exact aspect ratio (usually 4:5 for Instagram).
4.  **TYPOGRAPHY SCANNING:**
    - Identify Serif fonts (like Times New Roman, Playfair) -> Use class \`font-serif\`.
    - Identify Sans-Serif fonts (like Arial, Inter) -> Use class \`font-sans\`.
    - Identify Monospace fonts (code style) -> Use class \`font-mono\`.
    - Match font weights (Light, Regular, Bold).

### OUTPUT FORMAT
- Return ONLY valid HTML code.
- Use Tailwind CSS via CDN (assume it is already included).
- The container must be a \`div\` with a fixed aspect ratio (e.g., \`w-full aspect-[4/5]\`) or fixed dimensions relative to the mockup.
- Ensure the background color matches the image exactly (often white \`bg-white\` or off-white \`bg-stone-50\`).
- DO NOT explain your code. DO NOT add markdown blocks like \`\`\`html. Just return the code.

### ANALYSIS STRATEGY
1.  Look at the Header: Is there a date? A category path?
2.  Look at the Main Title: Is it Serif or Sans? Is it big?
3.  Look at the Body: Is it justified? Left-aligned?
4.  Look at the Footer: Pagination numbers? Brand names?

REPRODUCE PIXEL FOR PIXEL.
`;

export const generateCodeFromImage = async (
  imageBase64: string,
  mimeType: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: "Clone this image into HTML/Tailwind CSS with extreme precision.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0, // Zero temperature for maximum determinism (no creativity)
      },
    });

    return response.text || "<!-- Failed to generate code -->";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};