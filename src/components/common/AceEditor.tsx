import React, { useEffect, useRef } from 'react';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

interface AceEditorProps {
  value?: string;
  language?: string;
  editorName?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onEditorDidMount?: (editor: any) => void;
  className?: string;
  height?: number;
  minLines?: number;
  maxLines?: number;
  editorRef?: React.RefObject<any>;
  wordWrap?: boolean;
}

/**
 * 自动识别文本格式
 * 优先顺序：json > xml > html > 文本
 */
const detectLanguage = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return 'text';
  }
  
  const trimmedText = text.trim();
  
  // 检查是否为JSON
  try {
    JSON.parse(trimmedText);
    return 'json';
  } catch (e) {
    // 不是JSON，继续检查
  }
  
  // 检查是否为XML
  if (trimmedText.startsWith('<') && trimmedText.endsWith('>')) {
    // 简单检查是否包含XML标签
    const xmlTagRegex = /<[^>]+>/;
    if (xmlTagRegex.test(trimmedText)) {
      return 'xml';
    }
  }
  
  // 检查是否为HTML
  if (trimmedText.startsWith('<!DOCTYPE html>') || 
      trimmedText.startsWith('<html') || 
      trimmedText.includes('<html') && trimmedText.includes('</html>')) {
    return 'html';
  }
  
  // 无法识别，默认为文本
  return 'text';
}

/**
 * Ace 编辑器组件
 */
const AceEditor: React.FC<AceEditorProps> = ({
  value = '',
  language = 'auto',
  editorName = 'aceEditor',
  readOnly = false,
  onChange,
  onEditorDidMount,
  className = '',
  height = 200,
  minLines = 5,
  maxLines = 32,
  editorRef,
  wordWrap = true
}) => {
  const localEditorRef = useRef<HTMLDivElement>(null);
  const aceEditorRef = useRef<any>(null);

  useEffect(() => {
    if (localEditorRef.current && !aceEditorRef.current) {
      // 初始化 Ace 编辑器
      const ace = (window as any).ace;
      
      // 配置 Ace 编辑器的基础路径
      // 开发环境指向 node_modules，生产环境指向构建输出的 ace-builds 目录
      const isDev = import.meta.env.DEV;
      const basePath = isDev ? '/node_modules/ace-builds/src-noconflict' : '/ace-builds';
      ace.config.set('basePath', basePath);
      
      const editor = ace.edit(localEditorRef.current);
      
      // 自动检测语言
      const detectedLanguage = language === 'auto' ? detectLanguage(value) : language;
      
      // 设置编辑器配置
      const mode = detectedLanguage === 'json' ? 'ace/mode/json5' : 
                  detectedLanguage === 'xml' ? 'ace/mode/xml' : 
                  detectedLanguage === 'html' ? 'ace/mode/html' : 
                  detectedLanguage === 'javascript' ? 'ace/mode/javascript' : 'ace/mode/text';
      
      editor.setOptions({
        mode,
        theme: 'ace/theme/kuroir',
        readOnly,
        fontSize: 14,
        tabSize: 4,
        useSoftTabs: true,
        showPrintMargin: false,
        highlightActiveLine: true,
        enableBasicAutocompletion: false,
        enableSnippets: false,
        enableLiveAutocompletion: false,
        minLines,
        maxLines,
        useWrapMode: wordWrap,
        // 禁用工作器功能，确保离线场景下正常工作
        useWorker: false
      });

      // 根据编辑器名称设置不同的最大行数
      if (editorName === 'requestBodyEditor') {
        editor.setOption('maxLines', 12);
      } else if (editorName === 'responseBodyEditor') {
        editor.setOption('maxLines', 24);
      }

      // 设置初始内容
      editor.setValue(value, 1);

      // 绑定内容变化事件
      editor.on('change', () => {
        if (onChange) {
          onChange(editor.getValue());
        }
      });

      // 保存编辑器实例
      aceEditorRef.current = editor;
      
      // 更新外部 ref
      if (editorRef) {
        (editorRef as any).current = editor;
      }

      // 编辑器挂载完成回调
      if (onEditorDidMount) {
        onEditorDidMount(editor);
      }

      // 清理函数
      return () => {
        if (aceEditorRef.current) {
          aceEditorRef.current.destroy();
          aceEditorRef.current = null;
        }
      };
    }
  }, []);

  // 更新编辑器内容
  useEffect(() => {
    if (aceEditorRef.current && aceEditorRef.current.getValue() !== value) {
      aceEditorRef.current.setValue(value, 1);
    }
  }, [value]);

  // 更新编辑器模式
  useEffect(() => {
    if (aceEditorRef.current) {
      // 自动检测语言
      const detectedLanguage = language === 'auto' ? detectLanguage(value) : language;
      
      const mode = detectedLanguage === 'json' ? 'ace/mode/json5' : 
                  detectedLanguage === 'xml' ? 'ace/mode/xml' : 
                  detectedLanguage === 'html' ? 'ace/mode/html' : 
                  detectedLanguage === 'javascript' ? 'ace/mode/javascript' : 'ace/mode/text';
      aceEditorRef.current.getSession().setMode(mode);
    }
  }, [language, value]);

  // 更新编辑器只读状态
  useEffect(() => {
    if (aceEditorRef.current) {
      aceEditorRef.current.setReadOnly(readOnly);
    }
  }, [readOnly]);

  // 更新编辑器自动换行设置
  useEffect(() => {
    if (aceEditorRef.current) {
      aceEditorRef.current.getSession().setUseWrapMode(wordWrap);
    }
  }, [wordWrap]);

  // 根据编辑器名称设置固定高度
  const getEditorHeight = () => {
    if (height) {
      return `${height}px`;
    }
    if (editorName === 'requestBodyEditor') {
      return '200px'; // 请求体编辑器固定高度
    } else if (editorName === 'responseBodyEditor') {
      return '300px'; // 响应体编辑器固定高度
    }
    return '200px'; // 默认固定高度
  };

  return (
    <div 
      ref={localEditorRef}
      id={editorName}
      className={`ace-editor ${className}`}
      style={{
        height: getEditorHeight(),
        minHeight: '100px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    />
  );
};

export default AceEditor;