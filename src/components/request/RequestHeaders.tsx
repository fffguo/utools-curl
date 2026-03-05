import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import ParamEditor from '../common/ParamEditor';

interface Header {
  id: string;
  key: string;
  value: string;
}

type Param = {
  key: string;
  value: string;
  enabled: boolean;
};

/**
 * 请求头部组件
 * 用于管理请求头部信息
 */
const RequestHeaders: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  
  // 初始化headers状态，转换为Param类型
  const [headers, setHeaders] = useState<Param[]>(() => {
    const initialHeaders = curl.request.headers || [];
    return initialHeaders.map(header => ({
      key: header.key || '',
      value: header.value || '',
      enabled: true
    }));
  });

  // 监听store中headers的变化，确保从curl提取数据时能更新
  useEffect(() => {
    const initialHeaders = curl.request.headers || [];
    const newHeaders = initialHeaders.map(header => ({
      key: header.key || '',
      value: header.value || '',
      enabled: header.enabled !== false // 保留原有enabled状态，默认为true
    }));
    
    // 确保添加一个空行作为最后一行（与ParamEditor保持一致）
    if (newHeaders.length === 0) {
      setHeaders([{ key: '', value: '', enabled: false }]);
    } else {
      const lastParam = newHeaders[newHeaders.length - 1];
      if (lastParam.key.trim() !== '' || lastParam.value.trim() !== '' || lastParam.enabled) {
        setHeaders([...newHeaders, { key: '', value: '', enabled: false }]);
      } else {
        setHeaders(newHeaders);
      }
    }
  }, [curl.request.headers]);

  // 处理头部变化
  const handleHeadersChange = (newHeaders: Param[]) => {
    // 准备用于更新store的headers（过滤掉空key和最后一个空行）
    const headersForStore = newHeaders.filter(header => 
      header.key.trim() !== '' || (header.value.trim() !== '' && header.enabled)
    );
    
    // 只有当headers与当前状态不同时才更新，避免无限循环
    // 比较时忽略空行
    const currentHeadersWithoutEmpty = headers.filter(header => header.key.trim() !== '' || header.value.trim() !== '' || header.enabled);
    const newHeadersWithoutEmpty = newHeaders.filter(header => header.key.trim() !== '' || header.value.trim() !== '' || header.enabled);
    
    const headersChanged = newHeadersWithoutEmpty.length !== currentHeadersWithoutEmpty.length || 
      newHeadersWithoutEmpty.some((header, index) => {
        const currentHeader = currentHeadersWithoutEmpty[index];
        return currentHeader && (header.key !== currentHeader.key || header.value !== currentHeader.value || header.enabled !== currentHeader.enabled);
      });
    
    if (headersChanged) {
      setHeaders(newHeaders); // 保留所有行，包括空key的行，以显示错误信息
      updateStoreHeaders(headersForStore); // 只将非空key的headers用于store
    }
  };

  // 更新store中的头部
  const updateStoreHeaders = (newHeaders: Param[]) => {
    // 构建当前的完整headers（用于比较）
    const currentHeaders = curl.request.headers || [];
    
    // 只有当新的headers与当前的headers确实不同时，才更新store中的headers
    if (newHeaders.length !== currentHeaders.length || 
        JSON.stringify(newHeaders) !== JSON.stringify(currentHeaders)) {
      dispatch({ 
        type: 'SET_CURL_REQUEST', 
        payload: {
          ...curl.request,
          headers: newHeaders
        }
      });
    }
  };

  return (
    <div>
      <ParamEditor
        params={headers}
        onChange={handleHeadersChange}
        title="参数"
        showAddButton={false}
        validateKeyDuplicate={true}
        validateKeyEmpty={true}
      />
    </div>
  );
};

export default RequestHeaders;