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
    framework: "Framework",
    vanilla: "Vanilla",
    react: "React",
    vue: "Vue",
    dependencies: "Dependencies",
    install: "Install",
    close: "Close",
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
    framework: "框架",
    vanilla: "原生",
    react: "React",
    vue: "Vue",
    dependencies: "依赖管理",
    install: "安装",
    close: "关闭",
  },
};

// 默认代码模板
export const defaultTemplates = {
  vanilla: {
    html: `
    <div class="container">
      <h1>Hello, CodeEditor!</h1>
      <p>Edit this code and click Run to see changes</p>
      <button id="demo-btn">Click Me</button>
    </div>
  `,
    css: `body {
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
  }`,
    js: `document.getElementById('demo-btn').addEventListener('click', function() {
    alert('Button clicked!');
  });`,
  },
  react: {
    html: `
    <div id="root"></div>
  `,
    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
  }
  
  button {
    background-color: #61dafb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #21a8f3;
  }`,
    js: `// React component
function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <h1>React App</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// Render the App component to the DOM
ReactDOM.render(
  <App />,
  document.getElementById('root')
);`,
  },
  vue: {
    html: `
    <div id="app"></div>
  `,
    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  .vue-app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
  }
  
  button {
    background-color: #42b883;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #36a070;
  }`,
    js: `// Vue application
new Vue({
  el: '#app',
  data: {
    count: 0
  },
  template: \`
    <div class="vue-app">
      <h1>Vue App</h1>
      <p>You clicked {{ count }} times</p>
      <button @click="count++">Click me</button>
    </div>
  \`
});`,
  },
};

// 默认代码 - 使用vanilla模板
export const defaultHtmlCode = defaultTemplates.vanilla.html;
export const defaultCssCode = defaultTemplates.vanilla.css;
export const defaultJsCode = defaultTemplates.vanilla.js;

// 框架CDN链接
export const frameworkCDNs = {
  react: [
    "https://unpkg.com/react@18/umd/react.development.js",
    "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
  ],
  vue: ["https://unpkg.com/vue@2.6.14/dist/vue.js"],
  vanilla: [],
};

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
