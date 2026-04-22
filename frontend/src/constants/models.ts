export const MODELS = [
  { label: "Llama 3.1 8B",  value: "llama-3.1-8b-instant",                      about: "fastest",            alias: "BBS/3P1/8B" },
  { label: "Llama 3.3 70B", value: "llama-3.3-70b-versatile",                   about: "best overall",       alias: "BBS/3P3/70B" },
  { label: "Llama 4 Scout", value: "meta-llama/llama-4-scout-17b-16e-instruct", about: "vision + 512K ctx",  alias: "BBS/4/17B" },
  { label: "GPT-OSS 20B",   value: "openai/gpt-oss-20b",                        about: "fast reasoning",     alias: "DDG/20B" },
  { label: "GPT-OSS 120B",  value: "openai/gpt-oss-120b",                       about: "best reasoning",     alias: "DDG/120B" },
  { label: "Qwen3 32B",     value: "qwen/qwen3-32b",                            about: "strong coder",       alias: "SIM/32B" },
]

export const defaultModel = "llama-3.3-70b-versatile";