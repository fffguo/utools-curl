import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store';
import AceEditor from '../../common/AceEditor';
import Tooltip from '../../common/Tooltip';
import Toast from '../../common/Toast';
import SvgIcon from '../../common/SvgIcon';
import { beautify, beautifyHtml } from 'js-beautify';

const ResponseBody: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const response = curl.response;
  const [contentType, setContentType] = useState<string>('json');
  const [activeSubTab, setActiveSubTab] = useState<string>('pretty');
  const [encoding, setEncoding] = useState<string>('utf-8');
  const [wordWrap, setWordWrap] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [encodingSearch, setEncodingSearch] = useState<string>('');
  const [showEncodingDropdown, setShowEncodingDropdown] = useState<boolean>(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState<boolean>(false);
  const prettyEditorRef = useRef<any>(null);
  const rawEditorRef = useRef<any>(null);
  const encodingDropdownRef = useRef<HTMLDivElement>(null);
  const contentTypeDropdownRef = useRef<HTMLDivElement>(null);

  const hasResponseData = response.consumeTime !== -1;

  // 支持的编码列表（浏览器 TextDecoder 支持的编码）
  const encodings = [
    'utf-8',
    'utf-16',
    'utf-16be',
    'utf-16le',
    'ascii',
    'ISO-8859-1'
  ];

  // 过滤编码列表
  const filteredEncodings = encodings.filter(enc => 
    enc.toLowerCase().includes(encodingSearch.toLowerCase())
  );

  // 处理内容类型选择
  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContentType(e.target.value);
  };

  // 处理自动换行切换
  const handleWordWrapToggle = () => {
    const newWordWrap = !wordWrap;
    setWordWrap(newWordWrap);
    // 根据当前激活的标签页使用正确的编辑器引用
    if (activeSubTab === 'pretty' && prettyEditorRef.current) {
      prettyEditorRef.current.getSession().setUseWrapMode(newWordWrap);
    } else if (activeSubTab === 'raw' && rawEditorRef.current) {
      rawEditorRef.current.getSession().setUseWrapMode(newWordWrap);
    }
  };

  // 处理编辑器内容变化
  const handleEditorChange = (value: string) => {
    // 响应内容是只读的，这里不需要更新状态
  };

  // 根据内容类型美化rawBody
  const beautifyRawBody = (rawBody: string, contentType: string) => {
    if (!rawBody) return '';
    
    try {
      switch (contentType) {
        case 'json':
          const parsedJson = JSON.parse(rawBody);
          return JSON.stringify(parsedJson, null, 2);
        case 'xml':
          return beautifyHtml(rawBody, {
            indent_size: 2,
            max_preserve_newlines: 1
          });
        case 'html':
          return beautifyHtml(rawBody, {
            indent_size: 2,
            max_preserve_newlines: 1
          });
        default:
          return rawBody;
      }
    } catch (error) {
      return rawBody;
    }
  };

  // 处理编码搜索变化
  const handleEncodingSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEncodingSearch(e.target.value);
  };

  // 处理编码选择
  const handleEncodingSelect = (enc: string) => {
    setEncoding(enc);
    setEncodingSearch('');
    setShowEncodingDropdown(false);
    
    if (response.rawBodyBuffer) {
      try {
        let decodedBody = response.rawBody;
        
        try {
          const decoder = new TextDecoder(enc, { fatal: false });
          decodedBody = decoder.decode(response.rawBodyBuffer);
        } catch (e) {
          console.warn('编码转换失败，使用默认编码:', enc, e);
        }
        
        // 更新状态中的rawBody，确保beautify模式使用解码后的内容
        dispatch({ 
          type: 'SET_CURL_RESPONSE', 
          payload: {
            ...response,
            rawBody: decodedBody
          }
        });
        
        // 根据当前激活的标签页更新对应的编辑器
        if (activeSubTab === 'pretty' && prettyEditorRef.current) {
          prettyEditorRef.current.setValue(beautifyRawBody(decodedBody, contentType), 1);
        } else if (activeSubTab === 'raw' && rawEditorRef.current) {
          rawEditorRef.current.setValue(decodedBody, 1);
        }
      } catch (error) {
        console.error('编码转换失败:', error);
        setToast({ message: '编码转换失败，请尝试其他编码', type: 'error' });
      }
    }
  };

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (encodingDropdownRef.current && !encodingDropdownRef.current.contains(event.target as Node)) {
        setShowEncodingDropdown(false);
      }
      if (contentTypeDropdownRef.current && !contentTypeDropdownRef.current.contains(event.target as Node)) {
        setShowContentTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 当有响应数据时，自动检测内容类型
  useEffect(() => {
    if (hasResponseData && response.rawBody) {
      try {
        JSON.parse(response.rawBody);
        setContentType('json');
      } catch (e) {
        try {
          const isXml = response.rawBody.trim().startsWith('<');
          if (isXml) {
            setContentType('xml');
          } else {
            const isHtml = response.rawBody.toLowerCase().includes('<!doctype html>') || response.rawBody.toLowerCase().includes('<html');
            if (isHtml) {
              setContentType('html');
            } else {
              setContentType('text');
            }
          }
        } catch (e) {
          setContentType('text');
        }
      }
    }
  }, [hasResponseData, response.rawBody]);

  // 处理下载响应体
  const handleDownload = () => {
    if (response.rawBody) {
      try {
        const blob = new Blob([response.rawBody], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `response-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToast({ message: '响应体下载成功', type: 'success' });
      } catch (error) {
        console.error('Failed to download: ', error);
        setToast({ message: '下载失败，请重试', type: 'error' });
      }
    }
  };

  // 处理复制响应体
  const handleCopy = () => {
    if (response.rawBody) {
      navigator.clipboard.writeText(response.rawBody)
        .then(() => {
          setToast({ message: '响应体复制成功', type: 'success' });
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setToast({ message: '复制失败，请重试', type: 'error' });
        });
    }
  };

  // 处理搜索
  const handleSearch = () => {
    if (activeSubTab === 'pretty' && prettyEditorRef.current) {
      prettyEditorRef.current.execCommand('find');
    } else if (activeSubTab === 'raw' && rawEditorRef.current) {
      rawEditorRef.current.execCommand('find');
    }
  };

  if (!hasResponseData || !response.rawBody) {
    return null;
  }

  return (
    <div style={{padding:'4px 16px 16px 16px'}}>
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
          overflow: 'hidden'
        }}>
          {/* 激活指示器 - 用于左右移动的动画效果 */}
          <div 
            style={{
              position: 'absolute',
              top: '2px',
              bottom: '2px',
              left: activeSubTab === 'pretty' ? '2px' : activeSubTab === 'raw' ? '60px' : activeSubTab === 'preview' ? '110px' : '0px',
              width: '54px',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              transition: 'left 0.3s ease-in-out'
            }}
          />
          
          <button
            onClick={() => setActiveSubTab('pretty')}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '11px',
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
              minWidth: '54px'
            }}
          >
            美化
          </button>
          
          <button
            onClick={() => setActiveSubTab('raw')}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '11px',
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
              minWidth: '54px'
            }}
          >
            原文
          </button>
          
          <button
            onClick={() => setActiveSubTab('preview')}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666666',
              fontSize: '11px',
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
              minWidth: '54px'
            }}
          >
            预览
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          {/* 格式下拉框 - 仅在 pretty 模式显示 */}
          {activeSubTab === 'pretty' && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                style={{
                  padding: '2px 12px',
                  borderRadius: '4px',
                  border: '1px solid #d0d0d0',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  minWidth: '72px',
                  outline: 'none',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <span style={{ whiteSpace: 'nowrap', fontSize: '14px' }}>
                  {contentType === 'json' ? 'JSON' : 
                   contentType === 'xml' ? 'XML' : 
                   contentType === 'html' ? 'HTML' : 'Text'}
                </span>
                <span style={{ marginLeft: '8px', fontSize: '10px', flexShrink: 0 }}>▼</span>
              </button>
              {showContentTypeDropdown && (
                <div
                  ref={contentTypeDropdownRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '72px',
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000
                  }}
                >
                  <div>
                    {['json', 'xml', 'html', 'text'].map((type) => (
                      <div
                        key={type}
                        onClick={() => {
                          setContentType(type);
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: contentType === type ? '#00a870' : '#333333',
                          backgroundColor: contentType === type ? '#f6ffed' : 'transparent',
                          transition: 'background-color 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (contentType !== type) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (contentType !== type) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {type === 'json' ? 'JSON' : 
                         type === 'xml' ? 'XML' : 
                         type === 'html' ? 'HTML' : 'Text'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 编码转换 - 在 pretty 和 raw 模式显示 */}
          {(activeSubTab === 'pretty' || activeSubTab === 'raw') && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowEncodingDropdown(!showEncodingDropdown)}
                style={{
                  padding: '2px 12px',
                  borderRadius: '4px',
                  border: '1px solid #d0d0d0',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '50px',
                  outline: 'none',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>{encoding}</span>
                <span style={{ marginLeft: '8px', fontSize: '10px', flexShrink: 0 }}>▼</span>
              </button>
              {showEncodingDropdown && (
                <div
                  ref={encodingDropdownRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '120px',
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  <input
                    type="text"
                    placeholder="搜索编码..."
                    value={encodingSearch}
                    onChange={handleEncodingSearchChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      borderBottom: '1px solid #f0f0f0',
                      outline: 'none',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  />
                  <div>
                    {filteredEncodings.map((enc) => (
                      <div
                        key={enc}
                        onClick={() => handleEncodingSelect(enc)}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: encoding === enc ? '#00a870' : '#333333',
                          backgroundColor: encoding === enc ? '#f6ffed' : 'transparent',
                          transition: 'background-color 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (encoding !== enc) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (encoding !== enc) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {enc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 自动换行 - 仅在 pretty 模式显示 */}
          {activeSubTab === 'pretty' && (
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
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip title="下载响应体">
            <button
              onClick={handleDownload}
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
              <SvgIcon name="download" size={20} />
            </button>
          </Tooltip>
          
          <Tooltip title="复制响应体">
            <button
              onClick={handleCopy}
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
              <SvgIcon name="copy" size={20} />
            </button>
          </Tooltip>
          
          {/* 搜索 - 仅在 pretty 和 raw 模式显示 */}
          {(activeSubTab === 'pretty' || activeSubTab === 'raw') && (
            <Tooltip title="搜索">
              <button
                onClick={handleSearch}
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
                <SvgIcon name="search" size={20} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      
      <div style={{ padding: 0 }}>
        <div style={{ display: activeSubTab === 'pretty' ? 'block' : 'none' }}>
          <AceEditor
            value={beautifyRawBody(response.rawBody || '', contentType)}
            onChange={handleEditorChange}
            language={contentType as 'json' | 'xml' | 'html' | 'javascript' | 'text'}
            editorName="responseBodyEditorPretty"
            readOnly={true}
            editorRef={prettyEditorRef}
            wordWrap={wordWrap}
          />
        </div>
        
        <div style={{ display: activeSubTab === 'raw' ? 'block' : 'none' }}>
          <AceEditor
            value={response.rawBody || ''}
            onChange={handleEditorChange}
            language="text"
            editorName="responseBodyEditorRaw"
            readOnly={true}
            editorRef={rawEditorRef}
            wordWrap={false}
          />
        </div>
        
        <div style={{ display: activeSubTab === 'preview' ? 'block' : 'none' }}>
          <div style={{ minHeight: '260px', overflow: 'auto', backgroundColor: '#fafafa', padding: 16, border: '1px dashed #d9d9d9' }}>
            <iframe
              srcDoc={response.rawBody || ''}
              style={{ width: '100%', height: '100%', minHeight: '260px', border: 'none' }}
              title="HTML Preview"
              sandbox="allow-scripts allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseBody;