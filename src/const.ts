import { handleClassName } from "./utils";

export const translations: Record<string, Record<string, string>> = {
  en: {
    run: "Run",
    format: "Format",
    tsCheck: "TS Check",
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
    tsCheck: "TS检查",
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
    html: `<div class="container">
    <h1>Hello, Vanilla JS!</h1>
    <p>This is a simple Vanilla JavaScript example.</p>
    <button id="demo-btn">Click Me</button>
  </div>`,
    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  .container {
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
  typescript: {
    html: `<div class="container">
    <h1>Hello, TypeScript!</h1>
    <p>This is a simple TypeScript example.</p>
    <button id="demo-btn">Click Me</button>
  </div>`,
    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
  }
  
  .container {
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
    background-color: #007acc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #005a9c;
  }`,
    js: `// TypeScript code
class Greeter {
  greeting;

  constructor(message) {
    this.greeting = message;
  }

  greet(person) {
    return \`Hello, \${person.name}! You are \${person.age} years old. \${this.greeting}\`;
  }
}

const greeter = new Greeter('Welcome to TypeScript!');
const user = { name: 'User', age: 25 };

document.getElementById('demo-btn')?.addEventListener('click', function() {
  alert(greeter.greet(user));
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
const React = window.React;
const ReactDOM = window.ReactDOM;
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
  "react-ts": {
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
    js: `
const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState } = React;

const App = () => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'User', age: 25 });

  const handleClick = () => {
    setCount(count + 1);
  };

  return React.createElement('div', { className: 'app' },
    React.createElement('h1', null, 'React TypeScript App'),
    React.createElement('p', null, 'Hello, ', user.name, '!'),
    React.createElement('p', null, 'You clicked ', count, ' times'),
    React.createElement('button', { onClick: handleClick }, 'Click me')
  );
};

ReactDOM.render(
  React.createElement(App),
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
  vue3: {
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
    js: `
import { createApp, ref } from 'vue';
const App = {
  setup() {
    const count = ref(0);
    
    return {
      count
    };
  },
  template: \`
    <div class="vue-app">
      <h1>Vue 3 App</h1>
      <p>You clicked {{ count }} times</p>
      <button @click="count++">Click me</button>
    </div>
  \`
};

createApp(App).mount('#app');`,
  },
  "vue-ts": {
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
    js: `
const Vue = window.Vue;

new Vue({
  el: '#app',
  data() {
    return {
      count: 0,
      user: {
        name: 'User',
        age: 25
      }
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    greet() {
      return 'Hello, ' + this.user.name + '!';
    }
  },
  template: \`
    <div class="vue-app">
      <h1>Vue 2 TypeScript App</h1>
      <p>{{ greet() }}</p>
      <p>You clicked {{ count }} times</p>
      <button @click="increment">Click me</button>
    </div>
  \`
});`,
  },
  "vue3-ts": {
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
    js: `
const { createApp, ref } = window.Vue;

const App = {
  setup() {
    const count = ref(0);
    const user = ref({ name: 'User', age: 25 });
    
    const increment = () => {
      count.value++;
    };
    
    const greet = () => {
      return 'Hello, ' + user.value.name + '!';
    };
    
    return {
      count,
      user,
      increment,
      greet
    };
  },
  template: \`
    <div class="vue-app">
      <h1>Vue 3 TypeScript App</h1>
      <p>{{ greet() }}</p>
      <p>You clicked {{ count }} times</p>
      <button @click="increment">Click me</button>
    </div>
  \`
};

createApp(App).mount('#app');`,
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
  "react-ts": [
    "https://unpkg.com/react@18/umd/react.development.js",
    "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "https://unpkg.com/typescript@latest/lib/typescript.js",
  ],
  vue: ["https://unpkg.com/vue@2.6.14/dist/vue.js"],
  vue3: ["https://unpkg.com/vue@3.3.4/dist/vue.global.js"],
  "vue-ts": [
    "https://unpkg.com/vue@2.6.14/dist/vue.js",
    "https://unpkg.com/typescript@latest/lib/typescript.js",
  ],
  "vue3-ts": [
    "https://unpkg.com/vue@3.3.4/dist/vue.global.js",
    "https://unpkg.com/typescript@latest/lib/typescript.js",
  ],
  typescript: ["https://unpkg.com/typescript@latest/lib/typescript.js"],
  vanilla: [],
};

export const baseEditorOptions = {
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  fontSize: 14,
  tabSize: 2,
};

export const closeIcon = (className?: string) =>
  `<svg t="1690189203554" class="close-icon${handleClassName(className)}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2272" fill="currentColor"><path d="M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z" p-id="2273"></path></svg>`;
