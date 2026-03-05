import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Environment } from '../../store/modules/types';
import EnvironmentManager from './EnvironmentManager';

const EnvironmentSelector: React.FC = () => {
  const { state, setCurrentEnvironment, dispatch } = useStore();
  const [showManager, setShowManager] = useState(false);
  const [originalDomain, setOriginalDomain] = useState<string | null>(null);
  const [hasReplaced, setHasReplaced] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 提取URL中的域名
  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}`;
    } catch {
      // 尝试从字符串中提取域名部分，支持 http、https 和 wss 协议
      const match = url.match(/^((https?|wss):\/\/[^/]+)/i);
      return match ? match[1] : url;
    }
  };
  
  // 提取URL中的路径部分
  const extractPath = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      // 尝试从字符串中提取路径部分，支持 http、https 和 wss 协议
      const match = url.match(/^((https?|wss):\/\/[^/]+)(.*)$/i);
      return match ? match[3] : url;
    }
  };
  
  // 检查是否进行过替换
  useEffect(() => {
    if (state.curl.request.url) {
      const currentDomain = extractDomain(state.curl.request.url);
      const currentEnv = state.environments.find(env => env.id === state.currentEnvironmentId);
      
      if (currentEnv && currentEnv.baseUrl) {
        const envDomain = extractDomain(currentEnv.baseUrl);
        setHasReplaced(currentDomain === envDomain);
      } else {
        setHasReplaced(false);
      }
    } else {
      setHasReplaced(false);
    }
  }, [state.curl.request.url, state.currentEnvironmentId, state.environments]);
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.environment-selector-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 处理环境选择
  const handleEnvironmentChange = (envId: string) => {
    if (envId === 'manage') {
      setShowManager(true);
    } else {
      setCurrentEnvironment(envId);
      // 切换环境时，重置hasReplaced状态
      const currentEnv = state.environments.find(env => env.id === envId);
      if (currentEnv && currentEnv.baseUrl) {
        const currentDomain = extractDomain(state.curl.request.url);
        const envDomain = extractDomain(currentEnv.baseUrl);
        setHasReplaced(currentDomain === envDomain);
      } else {
        setHasReplaced(false);
      }
    }
    // 关闭下拉菜单
    setIsDropdownOpen(false);
  };
  
  // 处理管理器关闭
  const handleManagerClose = () => {
    setShowManager(false);
  };
  
  // 处理替换按钮点击
  const handleReplace = () => {
    const currentEnv = state.environments.find(env => env.id === state.currentEnvironmentId);
    if (currentEnv && currentEnv.baseUrl) {
      const url = state.curl.request.url;
      if (url) {
        // 保存原始域名（仅在第一次替换时保存）
        if (!originalDomain) {
          setOriginalDomain(extractDomain(url));
        }
        
        // 提取URL路径
        const path = extractPath(url);
        
        // 构建新URL
        const newUrl = currentEnv.baseUrl.replace(/\/$/, '') + path;
        
        // 更新URL
        dispatch({ 
          type: 'SET_CURL_REQUEST', 
          payload: {
            ...state.curl.request,
            url: newUrl
          }
        });
        
        // 更新状态
        setHasReplaced(true);
      }
    }
  };
  
  // 处理还原按钮点击
  const handleRestore = () => {
    if (originalDomain) {
      const url = state.curl.request.url;
      if (url) {
        // 提取URL路径
        const path = extractPath(url);
        
        // 构建新URL
        const newUrl = originalDomain.replace(/\/$/, '') + path;
        
        // 更新URL
        dispatch({ 
          type: 'SET_CURL_REQUEST', 
          payload: {
            ...state.curl.request,
            url: newUrl
          }
        });
        
        // 更新状态
        setHasReplaced(false);
      }
    }
  };
  
  return (
    <div className="environment-selector-container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'flex-end',
      border: '1px solid #d9d9d9',
      borderRadius: '3px',
      height: '26px'
    }}>
      {/* 还原按钮 */}
      <button
        onClick={handleRestore}
        disabled={!hasReplaced}
        style={{
          padding: '0 8px',
          border: 'none',
          borderRight: '1px solid #d9d9d9',
          backgroundColor: hasReplaced ? '#ffffff' : '#f5f5f5',
          color: hasReplaced ? '#333333' : '#999999',
          fontSize: '12px',
          cursor: hasReplaced ? 'pointer' : 'not-allowed',
          opacity: hasReplaced ? 1 : 0.6,
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        还原
      </button>
      
      {/* 环境选择下拉框 - 自定义 */}
      <div style={{ position: 'relative', height: '100%' }}>
        {/* 下拉框按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          style={{
            padding: '0 8px 0 8px',
            border: 'none',
            borderRight: '1px solid #d9d9d9',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            cursor: 'pointer',
            minWidth: '100px',
            outline: 'none',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            {state.environments.find(env => env.id === state.currentEnvironmentId)?.name || '选择环境'}
          </span>
          <span style={{ fontSize: '10px', color: '#666666', marginLeft: '4px' }}>
            ▼
          </span>
        </button>
        
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '2px',
            backgroundColor: '#ffffff',
            border: '1px solid #d9d9d9',
            borderRadius: '3px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            overflow: 'hidden',
            // 确保下拉菜单可见
            minWidth: '120px',
            padding: '4px 0'
          }}>
            {state.environments.map((env: Environment) => (
              <div
                key={env.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnvironmentChange(env.id);
                }}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: env.id === state.currentEnvironmentId ? '#00a870' : '#333333',
                  backgroundColor: env.id === state.currentEnvironmentId ? '#f6ffed' : '#ffffff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (env.id !== state.currentEnvironmentId) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (env.id !== state.currentEnvironmentId) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {env.name}
              </div>
            ))}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleEnvironmentChange('manage');
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                color: '#00a870',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                borderTop: '1px solid #f0f0f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f6ffed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              ⚙️ 管理环境
            </div>
          </div>
        )}
      </div>
      
      {/* 替换按钮 */}
      <button
        onClick={handleReplace}
        disabled={hasReplaced}
        style={{
          padding: '0 8px',
          border: 'none',
          backgroundColor: hasReplaced ? '#f5f5f5' : '#00a870',
          color: hasReplaced ? '#999999' : '#ffffff',
          fontSize: '12px',
          cursor: hasReplaced ? 'not-allowed' : 'pointer',
          opacity: hasReplaced ? 0.6 : 1,
          height: '26px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        替换
      </button>
      
      {showManager && (
        <EnvironmentManager onClose={handleManagerClose} />
      )}
    </div>
  );
};

export default EnvironmentSelector;