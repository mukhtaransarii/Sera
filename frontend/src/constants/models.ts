export const defaultModel = "gemini-2.5-flash-lite";


// NOTE: do not change values, bcz its model of gemini api not random value
export const MODELS = [
  // Gemma Models
  { label: "Gemma 4 26B",           value: "gemma-4-26b",           rpm: 15, rpd: 1500 }, // Gemma
  { label: "Gemma 3 27B",           value: "gemma-3-27b-it",        rpm: 30, rpd: 14400 }, // Gemma
  { label: "Gemma 3 12B",           value: "gemma-3-12b-it",        rpm: 40, rpd: 19200 }, // Gemma
  { label: "Gemma 2B",               value: "gemma-2b",              rpm: 60, rpd: 28800 }, // Gemma - Faster, smaller
  { label: "Gemma 2B-it",            value: "gemma-2b-it",           rpm: 55, rpd: 26400 }, // Gemma - Italian version

  // Gemini Models
  { label: "Gemini 1.5 Pro",         value: "gemini-1.5-pro",        rpm: 40, rpd: 192000 }, // Gemini - Powerful, but potentially slower
  { label: "Gemini 1.5 Flash",        value: "gemini-1.5-flash",       rpm: 50, rpd: 240000 }, // Gemini - Faster than Pro
  { label: "Gemini 3.1 Flash Lite", value: "gemini-3.1-flash-lite", rpm: 25, rpd: 10000 }, // Gemini
  { label: "Gemini 3 Flash",        value: "gemini-3-flash",        rpm: 30, rpd: 12000 }, // Gemini
  { label: "Gemini 3.0 Pro",          value: "gemini-3.0-pro",         rpm: 35, rpd: 168000 }, // Gemini
  { label: "Gemini 2.5 Flash Lite", value: "gemini-2.5-flash-lite", rpm: 20, rpd: 8000 }, // Gemini
  { label: "Gemini 2.5 Flash",      value: "gemini-2.5-flash",      rpm: 15, rpd: 6000 }, // Gemini
  { label: "Gemini 2.0 Pro",          value: "gemini-2.0-pro",         rpm: 20, rpd: 96000 }, // Gemini
  { label: "Gemini Nano",             value: "gemini-nano",            rpm: 70, rpd: 336000 }, // Gemini - Very fast, smaller model
];