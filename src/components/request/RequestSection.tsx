import React, { useEffect, useState } from 'react';
import { useStore } from '../../store';
import Tab from '../common/Tab';
import Cookies from './Cookies';
import RequestBody from './RequestBody';
import RequestHeaders from './RequestHeaders';
import UrlParams from './UrlParams';

/**
 * 请求部分组件
 * 包含请求头部、请求体和URL参数三个标签页
 */
const RequestSection: React.FC = () => {
  const { state, dispatch } = useStore();
  const { dom } = state;

  // 处理标签页变化
  const handleTabChange = (key: string) => {
    dispatch({ type: 'SET_REQUEST_TAB_NAME', payload: key });
  };

  // 获取各部分的计数
  const { curl } = state;

  // 状态用于存储计算的计数
  const [counts, setCounts] = useState({
    urlArgs: 0,
    requestHeaders: 0,
    cookies: 0
  });

  // 从URL中解析参数数量
  const parseUrlParams = (url: string): number => {
    let count = 0;
    try {
      const urlObj = new URL(url);
      count = urlObj.searchParams.size;
    } catch (error) {
      try {
        const queryStringStart = url.indexOf('?');
        if (queryStringStart !== -1) {
          const queryString = url.substring(queryStringStart + 1);
          const paramPairs = queryString.split('&');
          count = paramPairs.filter(pair => pair && pair.split('=')[0]).length;
        }
      } catch (e) {
      }
    }
    return count;
  };

  // 解析cookie值中的key-value数量
  const parseCookieCount = (headers: any[]): number => {
    let count = 0;
    headers.forEach(header => {
      if (header.key.toLowerCase() === 'cookie' && header.enabled !== false && header.value) {
        // 解析cookie值中的key-value对
        const cookiePairs = header.value.split(';');
        count += cookiePairs.filter(pair => pair && pair.trim() && pair.includes('=')).length;
      }
    });
    return count;
  };

  // 当curl.request变化时，重新计算计数
  useEffect(() => {
    // 只计算启用的项目
    const urlArgsCount = curl.request.urlArgs ? curl.request.urlArgs.filter(arg => arg.enabled !== false).length : 0;
    const requestHeadersCount = curl.request.headers.filter(h => h.enabled !== false).length;
    const cookiesCount = parseCookieCount(curl.request.headers);
    console.log("urlArgsCount", curl.request.urlArgs, urlArgsCount);
    setCounts({
      urlArgs: urlArgsCount,
      requestHeaders: requestHeadersCount,
      cookies: cookiesCount
    });
  }, [curl.request]);

  // 标签页配置
  const tabs = [
    { key: 'urlArgs', label: '请求参数', count: counts.urlArgs > 0 ? counts.urlArgs : undefined },
    { key: 'requestBody', label: '请求体', count: undefined },
    { key: 'requestHeaders', label: '请求标头', count: counts.requestHeaders > 0 ? counts.requestHeaders : undefined },
    { key: 'cookies', label: 'Cookies', count: counts.cookies > 0 ? counts.cookies : undefined }
  ];

  return (
    <div style={{ marginBottom: '20px', border: '1px solid #e8e8e8', borderRadius: '4px', backgroundColor: '#ffffff' }}>
      {/* 标签页导航 */}
      <Tab
        activeTab={dom.request.activeTabName}
        tabs={tabs}
        onTabChange={handleTabChange}
      />
      {/* 标签页内容 */}
      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{ display: dom.request.activeTabName === 'urlArgs' ? 'block' : 'none' }}>
          <UrlParams />
        </div>
        <div style={{ display: dom.request.activeTabName === 'requestBody' ? 'block' : 'none' }}>
          <RequestBody />
        </div>
        <div style={{ display: dom.request.activeTabName === 'requestHeaders' ? 'block' : 'none' }}>
          <RequestHeaders />
        </div>
        <div style={{ display: dom.request.activeTabName === 'cookies' ? 'block' : 'none' }}>
          <Cookies />
        </div>
      </div>
    </div>
  );
};

export default RequestSection;