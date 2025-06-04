export const pageTemplate = ` <div class="container">
    <header>
      <div class="logo">CodeEditor</div>
      <div class="controls">
        <button id="run-btn" class="btn primary">Run</button>
        <button id="format-btn" class="btn">Format</button>
        <button id="download-btn" class="btn">Download</button>
        <button id="new-window-btn" class="btn">New Window</button>
        <button id="add-dependency-btn" class="btn">Dependencies</button>
        <div class="dropdown" id="framework-dropdown">
          <button class="btn dropdown-toggle">Framework</button>
          <div class="dropdown-menu">
            <a href="#" data-framework="vanilla">Vanilla</a>
            <a href="#" data-framework="react">React</a>
            <a href="#" data-framework="vue">Vue</a>
          </div>
        </div>
        <div class="dropdown" id="theme-dropdown">
          <button class="btn dropdown-toggle">Theme</button>
          <div class="dropdown-menu">
            <a href="#" data-theme="vs">Light</a>
            <a href="#" data-theme="vs-dark">Dark</a>
            <a href="#" data-theme="hc-black">High Contrast</a>
          </div>
        </div>
        <div class="dropdown" id="layout-dropdown">
          <button class="btn dropdown-toggle">Layout</button>
          <div class="dropdown-menu">
            <a href="#" data-layout="horizontal">Horizontal</a>
            <a href="#" data-layout="vertical">Vertical</a>
            <a href="#" data-layout="preview-right">Preview Right</a>
            <a href="#" data-layout="preview-bottom">Preview Bottom</a>
          </div>
        </div>
        <div class="dropdown" id="language-dropdown">
          <button class="btn dropdown-toggle">Language</button>
          <div class="dropdown-menu">
            <a href="#" data-lang="en">English</a>
            <a href="#" data-lang="zh">中文</a>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div id="editor-container" class="panel">
        <div class="tabs">
          <button id="html-tab" class="tab-btn active" data-tab="html">HTML</button>
          <button id="css-tab" class="tab-btn" data-tab="css">CSS</button>
          <button id="js-tab" class="tab-btn" data-tab="js">JavaScript</button>
        </div>
        <div id="html-editor" class="editor-pane active">
          <div id="html-loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        </div>
        <div id="css-editor" class="editor-pane">
          <div id="css-loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        </div>
        <div id="js-editor" class="editor-pane">
          <div id="js-loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        </div>
      </div>
      <div id="preview-container" class="panel">
        <iframe id="preview-frame"></iframe>
        <div id="dependency-manager" class="dependency-panel">
          <div class="dependency-header">
            <h3>Dependencies</h3>
            <button id="install-btn" class="btn">Install</button>
            <button id="close-dependency-btn" class="btn">Close</button>
          </div>
          <div class="dependency-content">
            <input type="text" id="dependency-input" placeholder="Package name (e.g. react@18.2.0)" />
            <div id="dependency-list"></div>
          </div>
          <div id="dependency-loading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        </div>
      </div>
      <div id="global-loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </main>
  </div>`;
