// NOTE: do not change values, bcz its model of gemini api not random value
export const MODELS = [
  // Fast & Efficient
  { label: "Llama 3.1 8B",      value: "llama-3.1-8b-instant",                      rpm: 30, rpd: 14400 }, // fastest
  { label: "GPT-OSS 20B",       value: "openai/gpt-oss-20b",                        rpm: 30, rpd: 14400 }, // fast reasoning
  // { label: "Mixtral 8x7B",      value: "mixtral-8x7b-32768",                        rpm: 30, rpd: 14400 }, // multilingual

  // Balanced
  { label: "Llama 3.3 70B",     value: "llama-3.3-70b-versatile",                   rpm: 30, rpd: 1000  }, // best overall
  { label: "Llama 4 Scout",     value: "meta-llama/llama-4-scout-17b-16e-instruct", rpm: 30, rpd: 1000  }, // vision + 512K ctx
  { label: "Qwen3 32B",         value: "qwen/qwen3-32b",                            rpm: 30, rpd: 1000  }, // strong coder

  // Reasoning
  // { label: "DeepSeek R1 70B",   value: "deepseek-r1-distill-llama-70b",             rpm: 30, rpd: 1000  }, // reasoning
  { label: "GPT-OSS 120B",      value: "openai/gpt-oss-120b",                       rpm: 30, rpd: 1000  }, // best reasoning
];

export const defaultModel = "llama-3.3-70b-versatile";