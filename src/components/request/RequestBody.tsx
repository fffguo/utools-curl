import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import AceEditor from '../common/AceEditor';
import SvgIcon from '../common/SvgIcon';
import Toast from '../common/Toast';
import Tooltip from '../common/Tooltip';

/**
 * 请求体组件
 * 用于编辑和管理请求体内容
 */
const RequestBody: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const [content, setContent] = useState(curl.request.body || '');
  const [contentType, setContentType] = useState(curl.request.contentType || 'json');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const editorRef = useRef<any>(null);

  // 尝试自动格式化内容
  const autoFormatContent = (content: string) => {
    if (!content) return content;

    try {
      // 尝试解析为JSON
      const parsed = JSON.parse(content);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // 不是JSON，尝试解析为XML
      try {
        const isXml = content.trim().startsWith('<');
        if (isXml) {
          return formatXml(content);
        }
      } catch (e) {
        // 不是XML，保持原样
      }
    }
    return content;
  };

  // 当外部状态变化时，更新本地状态
  useEffect(() => {
    // 只有当外部状态变化时才更新本地状态，避免与用户输入冲突
    if (curl.request.body !== content) {
      const formattedContent = autoFormatContent(curl.request.body || '');
      setContent(formattedContent);
      setContentType(curl.request.contentType || 'json');
      // 更新store中的请求体，确保实际请求标签页也能显示格式化后的内容
      if (formattedContent !== curl.request.body) {
        dispatch({ type: 'SET_REQUEST_BODY', payload: formattedContent });
      }
    }
  }, [curl.request.body, curl.request.contentType, dispatch, content]);

  // 当编辑器实例获取后，更新到 store
  useEffect(() => {
    if (editorRef.current) {
      dispatch({ type: 'SET_REQUEST_BODY_EDITOR', payload: editorRef.current });
      // 设置初始自动换行状态
      editorRef.current.getSession().setUseWrapMode(wordWrap);
    }
  }, [editorRef.current, dispatch, wordWrap]);

  // 处理内容类型变化
  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    dispatch({ type: 'SET_REQUEST_CONTENT_TYPE', payload: type });
  };

  // 处理内容变化
  const handleContentChange = (value: string) => {
    setContent(value);
    dispatch({ type: 'SET_REQUEST_BODY', payload: value });
  };

  // 处理格式化
  const handleFormat = () => {
    try {
      if (contentType === 'json') {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        setContent(formatted);
        dispatch({ type: 'SET_REQUEST_BODY', payload: formatted });
        setToast({ message: 'JSON 格式化成功', type: 'success' });
      } else if (contentType === 'xml') {
        // 简单的 XML 格式化
        const formatted = formatXml(content);
        setContent(formatted);
        dispatch({ type: 'SET_REQUEST_BODY', payload: formatted });
        setToast({ message: 'XML 格式化成功', type: 'success' });
      } else if (editorRef.current) {
        // 使用 Ace 编辑器的内置美化功能
        editorRef.current.execCommand('beautify');
        setToast({ message: '格式化成功', type: 'success' });
      }
    } catch (error) {
      setToast({ message: '格式化失败，请检查内容格式', type: 'error' });
    }
  };

  // 最终版 XML 格式化函数
  const formatXml = (xml: string): string => {
    try {
      let result = '';
      let indent = '';
      const tab = '  ';
      let stack: string[] = [];
      let inTag = false;
      let inText = false;
      let tagBuffer = '';
      let textBuffer = '';
      let currentOpenTag: string | null = null;

      for (let i = 0; i < xml.length; i++) {
        const char = xml[i];

        if (char === '<') {
          // 处理文本内容
          if (textBuffer.trim()) {
            if (currentOpenTag) {
              // 如果有当前打开的标签且只有文本内容，直接在同一行展示
              result += tagBuffer + textBuffer.trim();
              tagBuffer = '';
              currentOpenTag = null;
            } else {
              result += indent + textBuffer.trim() + '\n';
            }
            textBuffer = '';
            inText = false;
          }
          // 开始标签
          inTag = true;
          tagBuffer = '<';
        } else if (char === '>') {
          // 结束标签
          tagBuffer += '>';
          inTag = false;

          // 处理标签
          if (tagBuffer.startsWith('</')) {
            // 关闭标签
            if (stack.length > 0) {
              const closedTag = stack.pop();
              indent = tab.repeat(stack.length);

              // 检查是否是对应开始标签的关闭标签
              if (currentOpenTag && tagBuffer === `</${currentOpenTag}>`) {
                // 如果是同一标签的关闭，直接在同一行结束
                result += tagBuffer + '\n';
                currentOpenTag = null;
              } else {
                // 否则正常缩进
                result += indent + tagBuffer + '\n';
              }
            } else {
              result += indent + tagBuffer + '\n';
            }
          } else if (tagBuffer.endsWith('/>')) {
            // 自闭合标签
            result += indent + tagBuffer + '\n';
          } else if (tagBuffer.startsWith('<?') || tagBuffer.startsWith('<!')) {
            // 处理指令或注释
            result += indent + tagBuffer + '\n';
          } else {
            // 打开标签
            // 提取标签名
            const tagMatch = tagBuffer.match(/<([a-zA-Z][a-zA-Z0-9_:-]*)/);
            if (tagMatch) {
              const tagName = tagMatch[1];
              // 检查下一个字符是否是关闭标签的开始
              let nextChar = xml[i + 1];
              let hasChildTags = false;
              let j = i + 1;
              let tempBuffer = '';

              // 简单检查是否有子标签
              while (j < xml.length) {
                nextChar = xml[j];
                tempBuffer += nextChar;

                if (nextChar === '<' && !tempBuffer.trim().startsWith('</')) {
                  // 找到子标签开始
                  hasChildTags = true;
                  break;
                } else if (nextChar === '<' && tempBuffer.trim() === `</${tagName}>`) {
                  // 找到对应关闭标签
                  break;
                }
                j++;
              }

              if (!hasChildTags) {
                // 如果没有子标签，暂时不添加换行，等待文本内容
                currentOpenTag = tagName;
                result += indent;
              } else {
                // 有子标签，正常添加并缩进
                result += indent + tagBuffer + '\n';
                stack.push(tagName);
                indent = tab.repeat(stack.length);
              }
            } else {
              result += indent + tagBuffer + '\n';
            }
          }
        } else if (inTag) {
          // 标签内容
          tagBuffer += char;
        } else {
          // 文本内容
          textBuffer += char;
          inText = true;
        }
      }

      // 处理剩余文本
      if (textBuffer.trim()) {
        result += indent + textBuffer.trim() + '\n';
      }

      return result.trim();
    } catch (error) {
      console.error('XML 格式化失败:', error);
      return xml; // 失败时返回原始内容
    }
  };



  // 处理自动换行切换
  const handleWordWrapToggle = () => {
    const newWordWrap = !wordWrap;
    setWordWrap(newWordWrap);
    if (editorRef.current) {
      editorRef.current.getSession().setUseWrapMode(newWordWrap);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '36px',
        marginBottom: '4px',
      }}>
        <div style={{
          display: 'flex',
          gap: '0px',
          marginRight: '12px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          padding: '2px',
          position: 'relative',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          {/* 激活指示器 - 用于左右移动的动画效果 */}
          <div
            style={{
              position: 'absolute',
              top: '2px',
              bottom: '2px',
              left: contentType === 'json' ? '290px' : contentType === 'xml' ? '350px' : contentType === 'text' ? '400px' : '0px',
              width: contentType === 'json' ? '60px' : contentType === 'xml' ? '50px' : contentType === 'text' ? '50px' : '0px',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out'
            }}
          />

          {/* Unsupported tabs - greyed out */}
          <Tooltip title="暂不支持">
            <button
              disabled
              style={{
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#d0d0d0',
                fontSize: '12px',
                fontWeight: 'normal',
                cursor: 'not-allowed',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                zIndex: 10,
                outline: 'none',
                minWidth: '50px'
              }}
            >
              none
            </button>
          </Tooltip>

          <Tooltip title="暂不支持">
            <button
              disabled
              style={{
                padding: '0px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#d0d0d0',
                fontSize: '12px',
                fontWeight: 'normal',
                cursor: 'not-allowed',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                zIndex: 10,
                outline: 'none',
                minWidth: '80px'
              }}
            >
              form-data
            </button>
          </Tooltip>

          <Tooltip title="暂不支持">
            <button
              disabled
              style={{
                padding: '0px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#d0d0d0',
                fontSize: '12px',
                fontWeight: 'normal',
                cursor: 'not-allowed',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                zIndex: 10,
                outline: 'none',
                minWidth: '160px'
              }}
            >
              x-www-form-urlencoded
            </button>
          </Tooltip>

          {/* Supported tabs */}
          <button
            onClick={() => handleContentTypeChange('json')}
            style={{
              padding: '0px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '12px',
              fontWeight: 'normal',
              cursor: 'pointer',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              zIndex: 10,
              outline: 'none',
              width: '60px',
              textAlign: 'center'
            }}
          >
            json
          </button>

          <button
            onClick={() => handleContentTypeChange('xml')}
            style={{
              padding: '0px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '12px',
              fontWeight: 'normal',
              cursor: 'pointer',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              zIndex: 10,
              outline: 'none',
              width: '50px',
              textAlign: 'center'
            }}
          >
            xml
          </button>

          <button
            onClick={() => handleContentTypeChange('text')}
            style={{
              padding: '0px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '12px',
              fontWeight: 'normal',
              cursor: 'pointer',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              zIndex: 10,
              outline: 'none',
              width: '50px',
              textAlign: 'center'
            }}
          >
            text
          </button>

          {/* More unsupported tabs */}
          <Tooltip title="暂不支持">
            <button
              disabled
              style={{
                padding: '0px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#d0d0d0',
                fontSize: '12px',
                fontWeight: 'normal',
                cursor: 'not-allowed',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                zIndex: 10,
                outline: 'none',
                minWidth: '64px'
              }}
            >
              binary
            </button>
          </Tooltip>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          {/* 留空以保持布局一致 */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip title="格式化">
            <button
              onClick={handleFormat}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '16px',
                cursor: 'pointer',
                height: '32px',
                width: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <SvgIcon
                name="format"
                size={20}
                color="#666666"
              />
            </button>
          </Tooltip>



          <Tooltip title="自动换行">
            <button
              onClick={handleWordWrapToggle}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '16px',
                cursor: 'pointer',
                height: '32px',
                width: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <SvgIcon
                name="wordWrap"
                size={20}
                color={wordWrap ? '#55BC8A' : '#d0d0d0'}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      <div style={{ padding: 0 }}>
        <AceEditor
          value={content}
          onChange={handleContentChange}
          language={contentType === 'json' ? 'json' : contentType === 'xml' ? 'xml' : contentType === 'html' ? 'html' : 'text'}
          minLines={5}
          maxLines={20}
          editorRef={editorRef}
        />
      </div>
    </div>
  );
};

export default RequestBody;