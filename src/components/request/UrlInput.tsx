import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import SvgIcon from '../common/SvgIcon';
import EnvironmentSelector from '../environment/EnvironmentSelector';

// 解析URL中的查询参数
const parseUrlParams = (url: string): Array<{ key: string; value: string; enabled: boolean }> => {
  const params: Array<{ key: string; value: string; enabled: boolean }> = [];
  try {
    // 尝试使用URL构造函数解析
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    searchParams.forEach((value, key) => {
      params.push({ key, value, enabled: true });
    });
  } catch (error) {
    // URL解析失败，尝试手动解析
    try {
      // 提取查询字符串部分
      const queryStringStart = url.indexOf('?');
      if (queryStringStart !== -1) {
        const queryString = url.substring(queryStringStart + 1);
        // 分割查询参数
        const paramPairs = queryString.split('&');
        paramPairs.forEach(pair => {
          if (pair) {
            const [key, value] = pair.split('=');
            // 即使key为空，也添加参数，这样参数行不会被删除
            params.push({ 
              key: key ? decodeURIComponent(key) : '', 
              value: value ? decodeURIComponent(value) : '', 
              enabled: true 
            });
          }
        });
      }
    } catch (e) {
      // 手动解析也失败，返回空数组
    }
  }
  return params;
};

interface UrlInputProps {
  onSend: () => void;
  isLoading: boolean;
}

/**
 * URL输入组件
 * 包含请求方法选择、URL输入和发送按钮
 */
const UrlInput: React.FC<UrlInputProps> = ({ onSend, isLoading }) => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  // 用于跟踪是否是用户手动编辑URL
  const isUserEditingUrlRef = useRef(false);
  // 使用状态变量存储URL，而不是ref
  const [url, setUrl] = useState(curl.request.url);

  // 支持的HTTP方法
  const httpMethods = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE'
  ];

  // 处理请求方法变化
  const handleMethodChange = (method: string) => {
    dispatch({ 
      type: 'SET_CURL_REQUEST', 
      payload: {
        ...curl.request,
        method
      }
    });
    setIsMethodDropdownOpen(false);
  };

  // 处理URL变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    // 更新状态变量
    setUrl(newUrl);
    // 设置标志，表示用户正在手动编辑URL
    isUserEditingUrlRef.current = true;
    
    // 解析URL中的参数
    const urlArgs = parseUrlParams(newUrl);
    
    // 同时更新URL和urlArgs
    dispatch({ 
      type: 'SET_CURL_REQUEST', 
      payload: {
        ...curl.request,
        url: newUrl,
        urlArgs
      }
    });
    
    // 短暂延迟后重置标志
    setTimeout(() => {
      isUserEditingUrlRef.current = false;
    }, 100);
  };

  // 处理点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.method-dropdown-container')) {
        setIsMethodDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 监听外部URL变化，只在用户没有手动编辑时更新
  useEffect(() => {
    // 强制更新URL，确保即使是空字符串也能被正确设置
    if (!isUserEditingUrlRef.current) {
      setUrl(curl.request.url);
    }
  }, [curl.request.url]);

  // 监听urlArgs变化，更新URL
  useEffect(() => {
    // 如果是用户手动编辑URL，跳过同步
    if (isUserEditingUrlRef.current) {
      return;
    }
    
    // 从当前URL中提取基础URL（不含查询参数）
    let baseUrl = curl.request.url;
    const queryIndex = baseUrl.indexOf('?');
    if (queryIndex !== -1) {
      baseUrl = baseUrl.substring(0, queryIndex);
    }
    
    // 构建参数字符串
    const enabledArgs = curl.request.urlArgs?.filter(arg => arg.enabled !== false) || [];
    const searchParams = new URLSearchParams();
    enabledArgs.forEach(arg => {
      if (arg.key.trim() !== '') {
        searchParams.append(arg.key, arg.value);
      }
    });
    const queryString = searchParams.toString();
    
    // 构建完整URL
    const newUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    
    // 如果新URL与当前URL不同，更新URL
    if (newUrl !== curl.request.url) {
      setUrl(newUrl);
      dispatch({ 
        type: 'SET_CURL_REQUEST', 
        payload: {
          ...curl.request,
          url: newUrl
        }
      });
    }
  }, [curl.request.urlArgs, curl.request.url, dispatch]);

  return (
    <>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {/* 请求方法选择器 */}
        <div className="method-dropdown-container" style={{ position: 'relative' }}>
          {/* 当前选中的方法 */}
          <button
            onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
            style={{
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRight: '1px solid #d9d9d9',
            borderRadius: '4px 0 0 4px',
            fontSize: '14px',
            width: '100px',
            backgroundColor: '#fafafa',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '36px'
          }}
          >
            <span>{curl.request.method.toUpperCase()}</span>
            <span style={{ fontSize: '12px', color: '#999999' }}>▼</span>
          </button>

          {/* 下拉菜单 */}
          {isMethodDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              width: '100px',
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e8',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 9999
            }}>
              {httpMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => handleMethodChange(method)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: method === curl.request.method ? '#f0f0f0' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: method === curl.request.method ? '#00a870' : '#333333'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = method === curl.request.method ? '#f0f0f0' : '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = method === curl.request.method ? '#f0f0f0' : '#ffffff';
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* URL输入框 */}
        <input
          type="text"
          placeholder="请输入测试地址~"
          style={{
            flex: 1,
            minWidth: '400px',
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderLeft: 'none',
            borderRight: 'none',
            fontSize: '14px',
            outline: 'none',
            height: '36px'
          }}
          value={url}
          onChange={handleUrlChange}
        />

        {/* 发送按钮 */}
        <button
          onClick={onSend}
          style={{
            backgroundColor: isLoading ? '#faad14' : '#00a870',
            border: `1px solid ${isLoading ? '#faad14' : '#00a870'}`,
            color: '#ffffff',
            padding: '8px 24px',
            borderRadius: '0 4px 4px 0',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading && (
            <SvgIcon 
              name="loading" 
              size={16} 
              style={{ animation: 'spin 1s linear infinite' }} 
            />
          )}
          {isLoading ? '取消' : '发送'}
        </button>
        
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default UrlInput;