<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Geist Mono', monospace;
    background: #0a0a0a;
    color: #e8e4d9;
    min-height: 100vh;
    padding: 48px 32px;
    line-height: 1.6;
  }

  .container { max-width: 780px; margin: 0 auto; }

  .header { margin-bottom: 48px; border-bottom: 0.5px solid #2a2a2a; padding-bottom: 36px; }

  .logo-row { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 12px; }

  .logo-name {
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 64px;
    color: #e8e4d9;
    letter-spacing: -2px;
    line-height: 1;
  }

  .version-badge {
    font-size: 11px;
    background: #1e1e1e;
    border: 0.5px solid #333;
    color: #888;
    padding: 3px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
  }

  .tagline {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
    letter-spacing: 0.3px;
  }

  .links { display: flex; gap: 12px; flex-wrap: wrap; }

  .link-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 4px;
    text-decoration: none;
    letter-spacing: 0.5px;
    border: 0.5px solid #2a2a2a;
    color: #888;
    background: #111;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .link-chip:hover { border-color: #555; color: #ccc; }
  .link-chip.primary { border-color: #c8b97a; color: #c8b97a; }
  .link-chip.primary:hover { background: #c8b97a18; }

  .dot { width: 6px; height: 6px; border-radius: 50%; background: #3fb950; display: inline-block; }

  section { margin-bottom: 40px; }

  .section-label {
    font-size: 10px;
    color: #444;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::after { content: ''; flex: 1; height: 0.5px; background: #1e1e1e; }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1px;
    background: #1a1a1a;
    border: 0.5px solid #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
  }

  .feature-card {
    background: #0f0f0f;
    padding: 18px 20px;
    transition: background 0.15s;
  }
  .feature-card:hover { background: #141414; }

  .feature-icon {
    font-size: 16px;
    margin-bottom: 8px;
    display: block;
  }

  .feature-title {
    font-size: 12px;
    color: #e8e4d9;
    font-weight: 500;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }

  .feature-desc {
    font-size: 11px;
    color: #555;
    line-height: 1.5;
  }

  .tech-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tech-pill {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    background: #111;
    border: 0.5px solid #222;
    color: #999;
    letter-spacing: 0.3px;
  }
  .tech-pill.fe { border-color: #1a3a5c; color: #5b9bd5; }
  .tech-pill.be { border-color: #1a3a28; color: #3fb950; }

  .stack-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  .stack-group-label { font-size: 10px; color: #444; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }

  .code-block {
    background: #0d0d0d;
    border: 0.5px solid #1e1e1e;
    border-radius: 6px;
    padding: 20px;
    font-size: 12px;
    color: #666;
    line-height: 1.8;
    position: relative;
  }

  .code-block .comment { color: #3d3d3d; }
  .code-block .key { color: #c8b97a; }
  .code-block .val { color: #5b9bd5; }
  .code-block .str { color: #3fb950; }

  .steps { display: flex; flex-direction: column; gap: 0; }

  .step {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 16px;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 0.5px solid #141414;
  }
  .step:last-child { border-bottom: none; }

  .step-num {
    font-size: 11px;
    color: #333;
    padding-top: 2px;
    font-family: 'Geist Mono', monospace;
  }

  .step-title { font-size: 13px; color: #ccc; margin-bottom: 4px; }
  .step-body { font-size: 11px; color: #555; line-height: 1.6; }

  .inline-code {
    background: #141414;
    border: 0.5px solid #222;
    border-radius: 3px;
    padding: 1px 6px;
    font-size: 11px;
    color: #c8b97a;
    font-family: 'Geist Mono', monospace;
  }

  .footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 0.5px solid #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: gap;
  }

  .author { font-size: 11px; color: #444; }
  .author a { color: #666; text-decoration: none; }
  .author a:hover { color: #999; }

  .license-tag {
    font-size: 10px;
    color: #333;
    border: 0.5px solid #1e1e1e;
    padding: 3px 8px;
    border-radius: 3px;
    letter-spacing: 1px;
  }
</style>
</head>
<body>
<div class="container">

  <div class="header">
    <div class="logo-row">
      <span class="logo-name">Sera</span>
      <span class="version-badge">v2.0</span>
    </div>
    <p class="tagline">Full-stack AI chat · Gemini-powered · Per-chat routing · Custom keys · Streaming</p>
    <div class="links">
      <span class="dot" style="margin-top:2px"></span>
      <a class="link-chip primary" href="https://sera-blue.vercel.app">Live Demo ↗</a>
      <a class="link-chip" href="https://github.com/mukhtaransarii/Sera">GitHub</a>
      <span class="link-chip">TypeScript</span>
      <span class="link-chip">MIT-pending</span>
    </div>
  </div>

  <section>
    <div class="section-label">Features</div>
    <div class="features-grid">
      <div class="feature-card">
        <span class="feature-icon">⌗</span>
        <div class="feature-title">Per-chat routing</div>
        <div class="feature-desc">Each conversation gets its own <span class="inline-code">/chat/:id</span> route — shareable, navigable, state-isolated.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">✦</span>
        <div class="feature-title">AI-generated titles</div>
        <div class="feature-desc">On first message, Gemini auto-generates a 3–5 word title streamed back inline with the response.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">⬡</span>
        <div class="feature-title">System prompt</div>
        <div class="feature-desc">Customise AI persona per session. Prebuilt suggestions included — or write your own instruction.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">⏹</span>
        <div class="feature-title">Abort / stop</div>
        <div class="feature-desc">Cancel any in-flight generation mid-stream. Input reverts to send mode immediately.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">⌘</span>
        <div class="feature-title">Custom API key</div>
        <div class="feature-desc">Paste your own Gemini key via dialog. Falls back to system key. Includes direct link to create one.</div>
      </div>
      <div class="feature-card">
        <span class="feature-icon">◈</span>
        <div class="feature-title">New user homescreen</div>
        <div class="feature-desc">First-visit onboarding screen shown only to new users — skips directly to chat on return.</div>
      </div>
    </div>
  </section>

  <section>
    <div class="section-label">Tech stack</div>
    <div class="stack-cols">
      <div>
        <div class="stack-group-label">Frontend</div>
        <div class="tech-row">
          <span class="tech-pill fe">React</span>
          <span class="tech-pill fe">TypeScript</span>
          <span class="tech-pill fe">Zustand</span>
          <span class="tech-pill fe">Tailwind CSS</span>
          <span class="tech-pill fe">Vite</span>
        </div>
      </div>
      <div>
        <div class="stack-group-label">Backend</div>
        <div class="tech-row">
          <span class="tech-pill be">Node.js</span>
          <span class="tech-pill be">Express</span>
          <span class="tech-pill be">TypeScript</span>
          <span class="tech-pill be">Gemini API</span>
          <span class="tech-pill be">Zod</span>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="section-label">Project structure</div>
    <div class="code-block">
      <span class="comment"># Sera/</span><br>
      ├── <span class="key">backend/</span><br>
      │&nbsp;&nbsp;&nbsp;├── <span class="val">src/controllers/</span>&nbsp;&nbsp;<span class="comment"># chatController, validateKey</span><br>
      │&nbsp;&nbsp;&nbsp;├── <span class="val">src/validation/</span>&nbsp;&nbsp;&nbsp;<span class="comment"># zod schemas</span><br>
      │&nbsp;&nbsp;&nbsp;└── <span class="val">src/routes/</span><br>
      ├── <span class="key">frontend/</span><br>
      │&nbsp;&nbsp;&nbsp;├── <span class="val">src/components/</span>&nbsp;&nbsp;&nbsp;<span class="comment"># chat, dialog, homescreen</span><br>
      │&nbsp;&nbsp;&nbsp;├── <span class="val">src/store/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment"># zustand state</span><br>
      │&nbsp;&nbsp;&nbsp;└── <span class="val">src/pages/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment"># /chat, /chat/:id</span><br>
      └── <span class="str">README.md</span>
    </div>
  </section>

  <section>
    <div class="section-label">Getting started</div>
    <div class="steps">
      <div class="step">
        <span class="step-num">01</span>
        <div>
          <div class="step-title">Clone the repo</div>
          <div class="step-body"><span class="inline-code">git clone https://github.com/mukhtaransarii/Sera.git && cd Sera</span></div>
        </div>
      </div>
      <div class="step">
        <span class="step-num">02</span>
        <div>
          <div class="step-title">Backend setup</div>
          <div class="step-body">
            <span class="inline-code">cd backend && npm install</span><br><br>
            Create <span class="inline-code">.env</span> — add <span class="inline-code">GEMINI_API_KEY=your_key</span> and <span class="inline-code">PORT=3000</span><br><br>
            Run with <span class="inline-code">npm run dev</span>
          </div>
        </div>
      </div>
      <div class="step">
        <span class="step-num">03</span>
        <div>
          <div class="step-title">Frontend setup</div>
          <div class="step-body">
            <span class="inline-code">cd frontend && npm install</span><br><br>
            Create <span class="inline-code">.env</span> — add <span class="inline-code">VITE_BACKEND_URI=http://localhost:3000</span><br><br>
            Run with <span class="inline-code">npm run dev</span> · opens at <span class="inline-code">localhost:5173</span>
          </div>
        </div>
      </div>
      <div class="step">
        <span class="step-num">04</span>
        <div>
          <div class="step-title">Deploy</div>
          <div class="step-body">Frontend → Vercel / Netlify &nbsp;·&nbsp; Backend → Render / Railway / VPS</div>
        </div>
      </div>
    </div>
  </section>

  <div class="footer">
    <span class="author">Built by <a href="https://github.com/mukhtaransarii">Mukhtar Ansari</a></span>
    <span class="license-tag">NO LICENSE</span>
  </div>

</div>
</body>
</html>
