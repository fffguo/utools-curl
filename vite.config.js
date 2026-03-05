const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const { resolve } = require('path')
const { viteStaticCopy } = require('vite-plugin-static-copy')
const fs = require('fs')
const path = require('path')
// https://vite.dev/config/
module.exports = defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'fix-wasm-path',
      writeBundle: (options, bundle) => {
        // 修改生成的 JavaScript 文件，将 locateFile 函数的返回值从 "/" + s 改为 s
        const assetsDir = path.join(options.dir, 'assets')
        if (fs.existsSync(assetsDir)) {
          const files = fs.readdirSync(assetsDir)
          files.forEach(file => {
            if (file.endsWith('.js')) {
              const filePath = path.join(assetsDir, file)
              let content = fs.readFileSync(filePath, 'utf8')
              // 修改 locateFile 函数
              if (content.includes('locateFile')) {
                content = content.replace(/locateFile\(s,e\)\{return"\/"\+s\}/g, 'locateFile(s,e){return s}')
                fs.writeFileSync(filePath, content)
                console.log(`已修改 ${file} 中的 locateFile 函数`)
              }
              // 修改 Language.load 中的绝对路径为相对路径
              if (content.includes('Language.load')) {
                content = content.replace(/Language\.load\("\/tree-sitter-bash\.wasm"\)/g, 'Language.load("tree-sitter-bash.wasm")')
                fs.writeFileSync(filePath, content)
                console.log(`已修改 ${file} 中的 Language.load 路径`)
              }
            }
          })
        }
      }
    },
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/web-tree-sitter/tree-sitter.wasm',
          dest: '.'
        },
        {
          src: 'node_modules/curlconverter/dist/tree-sitter-bash.wasm',
          dest: '.'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/ace.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/mode-json5.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/mode-xml.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/mode-text.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/mode-html.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/theme-kuroir.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/ext-language_tools.js',
          dest: 'ace-builds'
        },
        {
          src: 'node_modules/ace-builds/src-noconflict/ext-searchbox.js',
          dest: 'ace-builds'
        },
        {
          src: 'utools/*',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      // 排除utools目录下的文件
      external: [
        resolve(__dirname, 'utools')
      ],
      // 优化chunk分割
      output: {
        format: 'es',
        manualChunks: (id) => {
          if (id.includes('@codemirror') || id.includes('codemirror')) {
            return 'codemirror';
          }
          if (id.includes('curlconverter') || id.includes('parse-curl')) {
            return 'curlconverter';
          }
          if (id.includes('web-tree-sitter')) {
            return 'web-tree-sitter';
          }

        }
      }
    },
    // 调整chunk大小警告阈值
    chunkSizeWarningLimit: 1000
  },
  // 配置WebAssembly支持
  optimizeDeps: {
    include: ['web-tree-sitter'],
    esbuildOptions: {
      target: 'es2022'
    }
  },
  server: {
    // 配置MIME类型
    mimeTypes: {
      'application/wasm': ['wasm']
    },
    esbuild: {
      target: 'es2022'
    }
  },
  esbuild: {
    target: 'es2022'
  }
})
