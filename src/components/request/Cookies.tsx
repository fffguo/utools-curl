import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import ParamEditor, { Param } from '../common/ParamEditor';

/**
 * Cookies组件
 * 解析和展示Cookie内容
 */
const Cookies: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const isUpdatingFromHeader = useRef(false);

  // 从header中提取cookie
  const getCookieString = () => {
    const headers = curl.request.headers || [];
    const cookieHeader = headers.find(header => header.key.toLowerCase() === 'cookie');
    return cookieHeader ? cookieHeader.value : '';
  };

  // 解析cookie字符串为对象
  const parseCookies = (cookieString: string) => {
    const cookies: Param[] = [];
    if (!cookieString) return cookies;
    
    const cookiePairs = cookieString.split(';');
    cookiePairs.forEach(pair => {
      const [key, ...rest] = pair.trim().split('=');
      const value = rest.join('='); // 处理值中包含等号的情况
      if (key) {
        cookies.push({ key, value, enabled: true });
      }
    });
    
    return cookies;
  };

  // 生成cookie字符串
  const generateCookieString = (cookies: Param[]) => {
    return cookies
      .filter(cookie => cookie.enabled && cookie.key.trim() !== '')
      .map(cookie => `${cookie.key}=${cookie.value}`)
      .join('; ');
  };

  // 初始化cookies状态
  const [cookies, setCookies] = useState<Param[]>(() => {
    const cookieString = getCookieString();
    let initialCookies = parseCookies(cookieString);
    
    // 确保添加一个空行作为最后一行（与ParamEditor保持一致）
    if (initialCookies.length === 0) {
      initialCookies = [{ key: '', value: '', enabled: false }];
    } else {
      const lastParam = initialCookies[initialCookies.length - 1];
      if (lastParam.key.trim() !== '' || lastParam.value.trim() !== '' || lastParam.enabled) {
        initialCookies = [...initialCookies, { key: '', value: '', enabled: false }];
      }
    }
    
    return initialCookies;
  });

  // 当header中的cookie变化时，重新提取cookie
  useEffect(() => {
    // 避免在更新header时触发的无限循环
    if (isUpdatingFromHeader.current) {
      return;
    }
    
    const cookieString = getCookieString();
    
    let newCookies: Param[] = [];
    if (cookieString) {
      newCookies = parseCookies(cookieString);
    }
    
    // 确保添加一个空行作为最后一行（与ParamEditor保持一致）
    if (newCookies.length === 0) {
      newCookies = [{ key: '', value: '', enabled: false }];
    } else {
      const lastParam = newCookies[newCookies.length - 1];
      if (lastParam.key.trim() !== '' || lastParam.value.trim() !== '' || lastParam.enabled) {
        newCookies = [...newCookies, { key: '', value: '', enabled: false }];
      }
    }
    
    // 只有当解析后的cookies与当前状态不同时才更新，避免无限循环
    // 比较时忽略最后一个空参数
    const currentCookiesWithoutEmpty = cookies.filter(cookie => cookie.key.trim() !== '' || cookie.value.trim() !== '' || cookie.enabled);
    const newCookiesWithoutEmpty = newCookies.filter(cookie => cookie.key.trim() !== '' || cookie.value.trim() !== '' || cookie.enabled);
    
    const cookiesChanged = newCookiesWithoutEmpty.length !== currentCookiesWithoutEmpty.length || 
      newCookiesWithoutEmpty.some((cookie, index) => {
        const currentCookie = currentCookiesWithoutEmpty[index];
        return currentCookie && (cookie.key !== currentCookie.key || cookie.value !== currentCookie.value);
      });
    
    if (cookiesChanged) {
      setCookies(newCookies);
    }
  }, [curl.request.headers]);

  // 处理cookies变化
  const handleCookiesChange = (newCookies: Param[]) => {
    // 准备用于更新header的cookies（过滤掉空key和最后一个空行）
    const cookiesForHeader = newCookies.filter(cookie => 
      cookie.key.trim() !== '' || (cookie.value.trim() !== '' && cookie.enabled)
    );
    
    // 只有当cookies与当前状态不同时才更新，避免无限循环
    // 比较时忽略空行
    const currentCookiesWithoutEmpty = cookies.filter(cookie => cookie.key.trim() !== '' || cookie.value.trim() !== '' || cookie.enabled);
    const newCookiesWithoutEmpty = newCookies.filter(cookie => cookie.key.trim() !== '' || cookie.value.trim() !== '' || cookie.enabled);
    
    const cookiesChanged = newCookiesWithoutEmpty.length !== currentCookiesWithoutEmpty.length || 
      newCookiesWithoutEmpty.some((cookie, index) => {
        const currentCookie = currentCookiesWithoutEmpty[index];
        return currentCookie && (cookie.key !== currentCookie.key || cookie.value !== currentCookie.value || cookie.enabled !== currentCookie.enabled);
      });
    
    if (cookiesChanged) {
      setCookies(newCookies); // 保留所有行，包括空key的行，以显示错误信息
      updateCookieHeader(cookiesForHeader); // 只将非空key的cookies用于header
    }
  };

  // 更新header中的cookie
  const updateCookieHeader = (newCookies: Param[]) => {
    // 设置标志，避免触发useEffect中的无限循环
    isUpdatingFromHeader.current = true;
    
    try {
      const cookieString = generateCookieString(newCookies);
      const headers = curl.request.headers || [];
      
      // 查找现有的cookie头部
      const cookieHeaderIndex = headers.findIndex(header => header.key.toLowerCase() === 'cookie');
      
      // 只有当需要实际修改headers时才dispatch，避免无限循环
      if (cookieString) {
        if (cookieHeaderIndex >= 0) {
          // 更新现有cookie头部
          const existingCookieHeader = headers[cookieHeaderIndex];
          if (existingCookieHeader.value !== cookieString) {
            const updatedHeaders = [...headers];
            updatedHeaders[cookieHeaderIndex] = { key: 'Cookie', value: cookieString };
            dispatch({
              type: 'SET_CURL_REQUEST',
              payload: {
                ...curl.request,
                headers: updatedHeaders
              }
            });
          }
        } else {
          // 添加新的cookie头部
          dispatch({
            type: 'SET_CURL_REQUEST',
            payload: {
              ...curl.request,
              headers: [...headers, { key: 'Cookie', value: cookieString }]
            }
          });
        }
      } else {
        // 如果没有cookie，只有当存在cookie头部时才删除
        if (cookieHeaderIndex >= 0) {
          const updatedHeaders = headers.filter((_, index) => index !== cookieHeaderIndex);
          dispatch({
            type: 'SET_CURL_REQUEST',
            payload: {
              ...curl.request,
              headers: updatedHeaders
            }
          });
        }
      }
    } finally {
      // 重置标志
      setTimeout(() => {
        isUpdatingFromHeader.current = false;
      }, 0);
    }
  };

  return (
    <div>
      <ParamEditor
        params={cookies}
        onChange={handleCookiesChange}
        title="参数"
        showAddButton={false}
        validateKeyDuplicate={false}
        validateKeyEmpty={true}
      />
    </div>
  );
};

export default Cookies;