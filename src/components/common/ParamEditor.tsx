import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface Param {
  key: string;
  value: string;
  enabled: boolean;
}

interface ParamEditorProps {
  params: Param[];
  onChange: (params: Param[]) => void;
  title?: string;
  showHeader?: boolean;
  showAddButton?: boolean;
  validateKeyDuplicate?: boolean;
  validateKeyEmpty?: boolean;
}

/**
 * 通用参数编辑组件
 * 基于URL参数的UI效果，可用于URL参数、请求头部、Cookies等
 */
const ParamEditor: React.FC<ParamEditorProps> = ({ 
  params, 
  onChange, 
  title = '参数',
  showHeader = true,
  showAddButton = true,
  validateKeyDuplicate = false,
  validateKeyEmpty = true
}) => {
  // 本地状态管理
  const [localParams, setLocalParams] = useState<Param[]>(params);

  // 同步外部参数变化到本地状态
  useEffect(() => {
    if (JSON.stringify(params) !== JSON.stringify(localParams)) {
      setLocalParams(params);
    }
  }, [params]);

  // 确保始终有一行空参数作为下一行
  useEffect(() => {
    // 避免在初始化时触发
    if (localParams.length === 0) {
      const newParams = [{ key: '', value: '', enabled: false }];
      setLocalParams(newParams);
      onChange(newParams);
    } else {
      // 检查最后一行是否为空参数
      const lastParam = localParams[localParams.length - 1];
      if (lastParam.key.trim() !== '' || lastParam.value.trim() !== '' || lastParam.enabled) {
        // 如果最后一行不为空，添加一行空参数
        const newParams = [...localParams, { key: '', value: '', enabled: false }];
        setLocalParams(newParams);
        // 避免触发无限循环，只有在真正添加了新行时才调用onChange
        if (newParams.length > localParams.length) {
          onChange(newParams);
        }
      }
    }
  }, [localParams, onChange]);

  // 检查key是否重复
  const isKeyDuplicate = (key: string, currentIndex: number) => {
    if (!validateKeyDuplicate) return false;
    
    return localParams.some((param, index) => 
      index !== currentIndex && 
      param.key.trim() === key.trim() && 
      param.key.trim() !== ''
    );
  };

  // 检查key是否为空但启用
  const isKeyEmptyButEnabled = (param: Param) => {
    if (!validateKeyEmpty) return false;
    
    return param.enabled && param.key.trim() === '';
  };

  // 处理参数值变化
  const handleParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...localParams];
    const currentParam = newParams[index];
    
    newParams[index] = {
      ...currentParam,
      [field]: value,
      // 当用户开始输入时，自动启用该参数
      // 当key为空时，保持当前启用状态但不自动启用
      enabled: field === 'key' && value.trim() === '' ? currentParam.enabled : currentParam.enabled || value.trim() !== ''
    };
    
    setLocalParams(newParams);
    onChange(newParams);
  };

  // 处理参数启用/禁用
  const handleParamToggle = (index: number) => {
    const newParams = [...localParams];
    newParams[index] = {
      ...newParams[index],
      enabled: !newParams[index].enabled
    };
    setLocalParams(newParams);
    onChange(newParams);
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    // 检查是否所有非空参数都已选中
    const nonEmptyParams = localParams.filter(p => p.key.trim() !== '' || p.value.trim() !== '');
    const allSelected = nonEmptyParams.every(p => p.enabled);
    // 反转所有非空参数的选中状态
    const newParams = localParams.map(p => {
      if (p.key.trim() !== '' || p.value.trim() !== '') {
        return {
          ...p,
          enabled: !allSelected
        };
      }
      return p;
    });
    setLocalParams(newParams);
    onChange(newParams);
  };

  // 处理删除参数
  const handleDeleteParam = (index: number) => {
    const newParams = localParams.filter((_, i) => i !== index);
    // 确保删除后仍然至少有一行空参数
    const finalParams = newParams.length > 0 ? newParams : [{ key: '', value: '', enabled: false }];
    setLocalParams(finalParams);
    onChange(finalParams);
  };

  // 处理添加参数
  const handleAddParam = () => {
    const newParams = [...localParams, { key: '', value: '', enabled: false }];
    setLocalParams(newParams);
    onChange(newParams);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 参数表格 */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        {/* 表头 */}
        {showHeader && (
          <div style={{ display: 'flex', padding: '8px 12px', backgroundColor: '#f7f8fa', borderBottom: '1px solid #e8e8e8', minHeight: '32px' }}>
            <div style={{ width: '30px', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={localParams.filter(p => p.key.trim() !== '' || p.value.trim() !== '').every(p => p.enabled)}
                onChange={handleSelectAll}
                style={{
                  cursor: 'pointer',
                  width: '12px',
                  height: '12px',
                  accentColor: '#00a870',
                  borderColor: '#d9d9d9',
                  borderRadius: '2px',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
            <div style={{ flex: 2, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#666666' }}>{title}名</span>
            </div>
            <div style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '13px', color: '#999999', lineHeight: '1' }}>=</span>
            </div>
            <div style={{ flex: 2, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#666666' }}>{title}值</span>
            </div>
            <div style={{ width: '30px' }}></div>
          </div>
        )}

        {/* 参数列表 */}
        <div style={{ minHeight: '80px' }}>
          {localParams.length > 0 ? (
            localParams.map((param, index) => {
              // 检查是否是最后一行且为空参数
              const isLastEmptyParam = index === localParams.length - 1 && 
                                     param.key.trim() === '' && 
                                     param.value.trim() === '' && 
                                     !param.enabled;
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                    opacity: param.enabled ? 1 : 0.6,
                    alignItems: 'center'
                  }}
                >
                  {/* 复选框 - 最后一行空参数不显示 */}
                  {!isLastEmptyParam && (
                    <div style={{ width: '30px', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={param.enabled} 
                        onChange={() => handleParamToggle(index)}
                        style={{
                          cursor: 'pointer',
                          width: '14px',
                          height: '14px',
                          accentColor: '#00a870',
                          borderColor: '#d9d9d9',
                          borderRadius: '2px',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </div>
                  )}
                  {isLastEmptyParam && (
                    <div style={{ width: '30px' }}></div>
                  )}
                  {/* 参数名 */}
                  <div style={{ flex: 2, marginLeft: '10px', position: 'relative', minHeight: '32px' }}>
                    <input
                      type="text"
                      value={param.key}
                      onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                      placeholder={param.key === '' ? `添加${title}` : `${title}名`}
                      style={{
                        width: '100%',
                        padding: '8px 30px 8px 10px',
                        borderRadius: '4px',
                        border: isKeyDuplicate(param.key, index) || isKeyEmptyButEnabled(param) ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = isKeyDuplicate(param.key, index) || isKeyEmptyButEnabled(param) ? '#ff4d4f' : '#1890ff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = isKeyDuplicate(param.key, index) || isKeyEmptyButEnabled(param) ? '#ff4d4f' : '#d9d9d9';
                      }}
                      onClick={(e) => {
                        e.target.select();
                      }}
                    />
                    {/* 错误提示 - 在参数校验失败时显示 */}
                    {(isKeyDuplicate(param.key, index) || isKeyEmptyButEnabled(param)) && (
                      <Tooltip title={isKeyEmptyButEnabled(param) ? `请输入${title}名` : `${title}名不能重复`} position="top">
                        <div
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '16px',
                            height: '16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#ff4d4f',
                            fontSize: '16px',
                            lineHeight: '1',
                            cursor: 'default',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            zIndex: 1
                          }}
                        >
                          ×
                        </div>
                      </Tooltip>
                    )}
                  </div>

                  {/* 等号 */}
                  <div style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '32px' }}>
                    <span style={{ fontSize: '13px', color: '#999999', lineHeight: '1' }}>=</span>
                  </div>

                  {/* 参数值 */}
                  <div style={{ flex: 2, marginLeft: '10px', minHeight: '32px' }}>
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                      placeholder={`${title}值`}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#1890ff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d9d9d9';
                      }}
                      onClick={(e) => {
                        e.target.select();
                      }}
                    />
                  </div>

                  {/* 操作 */}
                  {!isLastEmptyParam && (
                    <div style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleDeleteParam(index)}
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '1px solid #d9d9d9',
                          backgroundColor: '#ffffff',
                          color: '#999999',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          borderRadius: '50%',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#ff4d4f';
                          e.target.style.color = '#ff4d4f';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#d9d9d9';
                          e.target.style.color = '#999999';
                        }}
                      >
                        −
                      </button>
                    </div>
                  )}
                  {isLastEmptyParam && (
                    <div style={{ width: '30px' }}></div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', color: '#999999', fontSize: '14px' }}>
              暂无{title}数据
            </div>
          )}
        </div>

        {/* 添加参数按钮 */}
        {showAddButton && (
          <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
            <button
              onClick={handleAddParam}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#1890ff',
                fontSize: '14px',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '4px' }}>+</span>
              添加{title}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParamEditor;
export type { Param };
