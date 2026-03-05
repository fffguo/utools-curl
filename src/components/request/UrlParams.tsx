import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import ParamEditor from '../common/ParamEditor';

type Param = {
  key: string;
  value: string;
  enabled: boolean;
};

/**
 * 解析URL中的查询参数
 */
const parseUrlParams = (url: string): Param[] => {
  const params: Param[] = [];
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

/**
 * URL参数组件
 * 用于编辑和管理URL查询参数
 */
const UrlParams: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  
  // 本地状态管理
  const [params, setParams] = useState<Param[]>(() => {
    const urlParams = curl.request.urlArgs || [];
    return [...urlParams, { key: '', value: '', enabled: false }];
  });
  
  // 用于跟踪是否是用户手动编辑参数
  const isUserEditingRef = useRef(false);

  // 当urlArgs变化时，更新参数（仅当不是用户手动编辑参数时）
  useEffect(() => {
    // 如果是用户手动编辑参数，跳过同步
    // 这样当用户禁用参数时，参数行不会被删除，只是显示为灰色
    if (isUserEditingRef.current) {
      return;
    }
    
    // 从urlArgs中获取参数
    const urlParams = curl.request.urlArgs || [];
    const finalParams = [...urlParams, { key: '', value: '', enabled: false }];
    setParams(finalParams);
  }, [curl.request.urlArgs]);

  // 确保始终有一行空参数作为下一行
  useEffect(() => {
    if (params.length === 0) {
      setParams([{ key: '', value: '', enabled: false }]);
    } else {
      const lastParam = params[params.length - 1];
      // 检查最后一个参数是否有值，且确保不会重复添加
      if ((lastParam.key.trim() !== '' || lastParam.value.trim() !== '' || lastParam.enabled) && 
          !isUserEditingRef.current) {
        setParams(prev => [...prev, { key: '', value: '', enabled: false }]);
      }
    }
  }, [params]);

  // 处理参数变化
  const handleParamsChange = (newParams: Param[]) => {
    console.log('handleParamsChange called with:', newParams);
    isUserEditingRef.current = true;
    console.log('isUserEditingRef set to:', isUserEditingRef.current);
    setParams(newParams);
    
    // 过滤掉空参数
    const validParams = newParams.filter(p => !(p.key.trim() === '' && p.value.trim() === '' && !p.enabled));
    
    // 直接更新urlArgs
    dispatch({ 
      type: 'SET_URL_ARGS', 
      payload: validParams
    });
    
    // 短暂延迟后重置标志
    setTimeout(() => {
      isUserEditingRef.current = false;
      console.log('isUserEditingRef reset to:', isUserEditingRef.current);
    }, 300);
  };

  return (
    <div style={{ width: '100%' }}>
      <ParamEditor
        params={params}
        onChange={handleParamsChange}
        title="参数"
        showAddButton={false}
        validateKeyDuplicate={false}
        validateKeyEmpty={true}
      />
    </div>
  );
};

export default UrlParams;