// generate title with gemini

    // const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });
    // const data = await ai.models.generateContent({
    //   model: model ?? "gemini-2.5-flash-lite",
    //   contents: [{ role: "user", parts: [{ text: `Create a short 3-5 word title for this message. Return only the title, no extra words: ${message}` }] }]
    // })
    // const title = (data.text ?? "").trim().replace(/["']/g, '').replace(/^(title:|here.*?:)/i, '').split('\n')[0].trim();


// gemini ai res generateContentStream

    // const ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY });
    
    // let config = {};
    // if (model?.startsWith("gemini")) config = { systemInstruction: systemPrompt, tools: [{ googleSearch: {} }] }
    
    // // await stream FIRST before flushing headers
    // const stream = await ai.models.generateContentStream({
    //   model: model ?? "gemini-2.5-flash-lite",
    //   config,
    //   contents: [
    //     ...history.slice(-5).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
    //     { role: "user", parts: [{ text: message }] },
    //   ],
    // });

    // // only flush after stream is ready — errors above can still return JSON
    // res.setHeader("Content-Type", "text/plain; charset=utf-8");
    // res.flushHeaders();

    // for await (const chunk of stream) if (chunk.text) res.write(chunk.text);