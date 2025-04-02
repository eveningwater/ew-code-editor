export const translations: Record<string, Record<string, string>> = {
  en: {
    run: "Run",
    format: "Format",
    download: "Download",
    newWindow: "New Window",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    highContrast: "High Contrast",
    layout: "Layout",
    horizontal: "Horizontal",
    vertical: "Vertical",
    previewRight: "Preview Right",
    previewBottom: "Preview Bottom",
    language: "Language",
    english: "English",
    chinese: "中文",
    logo: "CodeEditor",
  },
  zh: {
    run: "运行",
    format: "格式化",
    download: "下载",
    newWindow: "新窗口预览",
    theme: "主题",
    light: "明亮",
    dark: "暗黑",
    highContrast: "高对比度",
    layout: "布局",
    horizontal: "水平",
    vertical: "垂直",
    previewRight: "预览在右",
    previewBottom: "预览在下",
    language: "语言",
    english: "English",
    chinese: "中文",
    logo: "代码编辑器",
  },
};

export const defaultHtmlCode = `
    <div class="container">
      <h1>Hello, CodeEditor!</h1>
      <p>Edit this code and click Run to see changes</p>
      <button id="demo-btn">Click Me</button>
    </div>
  `;

export const defaultCssCode = `body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
  }
  
  .container {
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }`;

export const defaultJsCode = `document.getElementById('demo-btn').addEventListener('click', function() {
    alert('Button clicked!');
  });`;

export const baseEditorOptions = {
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  fontSize: 14,
  tabSize: 2,
};

export const editorEnvPathPrefix = "monaco-editor/esm/vs";

export const workerPaths: Record<string, string> = {
  json: `${editorEnvPathPrefix}/language/json/json.worker.js`,
  css: `${editorEnvPathPrefix}/language/css/css.worker.js`,
  html: `${editorEnvPathPrefix}/language/html/html.worker.js`,
  javascript: `${editorEnvPathPrefix}/language/typescript/ts.worker.js`,
  editor: `${editorEnvPathPrefix}/editor/editor.worker.js`,
};
