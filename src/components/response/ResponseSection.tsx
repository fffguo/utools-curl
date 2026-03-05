import React, { useState } from 'react';
import { useStore } from '../../store';
import EmptyState from '../common/EmptyState';
import Tab from '../common/Tab';
import ResponseBody from './tabs/ResponseBody';
import ResponseCookie from './tabs/ResponseCookie';
import ResponseHeader from './tabs/ResponseHeader';
import ResponseRequest from './tabs/ResponseRequest';
import ResponseError from './tabs/ResponseError';

const ResponseSection: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const response = curl.response;
  const [activeTab, setActiveTab] = useState<string>('body');
  const hasResponseData = response.consumeTime !== -1;
  const hasError = !!response.error;

  // 计算响应体大小
  const getResponseSize = () => {
    if (!response.rawBody) return '0 B';
    const size = new Blob([response.rawBody]).size;

    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  // 计算响应时间
  const getResponseTime = () => {
    if (!hasResponseData) return '0 ms';
    const time = response.consumeTime || 0;

    if (time < 1000) {
      return `${time} ms`;
    } else if (time < 60000) {
      return `${(time / 1000).toFixed(2)} s`;
    } else if (time < 3600000) {
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${minutes}m${seconds}s`;
    } else {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      return `${hours}h${minutes}m${seconds}s`;
    }
  };

  return (
    <div style={{ marginTop: '16px', border: '1px solid #e8e8e8', borderRadius: '4px', backgroundColor: '#ffffff' }}>
      {/* 标签页导航 */}
      <Tab
        activeTab={hasError ? 'error' : activeTab}
        tabs={hasError ? [
          { key: 'error', label: '请求异常' }
        ] : [
          { key: 'body', label: '响应体' },
          { key: 'cookie', label: '响应Cookie' },
          { key: 'header', label: '响应标头', count: hasResponseData && response.headers ? (Array.isArray(response.headers) ? response.headers.length : Object.keys(response.headers).length) : 0 },
          { key: 'request', label: '实际请求' }
        ]}
        onTabChange={setActiveTab}
        rightContent={!hasError && hasResponseData ? (
          <div style={{
            paddingRight: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: {
                200: '#00a870',
                201: '#00a870',
                202: '#00a870',
                203: '#00a870',
                204: '#00a870',
                205: '#00a870',
                206: '#00a870',
                300: '#1890ff',
                301: '#1890ff',
                302: '#1890ff',
                303: '#1890ff',
                304: '#1890ff',
                305: '#1890ff',
                307: '#1890ff',
                308: '#1890ff',
                400: '#faad14',
                401: '#faad14',
                402: '#faad14',
                403: '#faad14',
                404: '#faad14',
                405: '#faad14',
                406: '#faad14',
                407: '#faad14',
                408: '#faad14',
                409: '#faad14',
                410: '#faad14',
                411: '#faad14',
                412: '#faad14',
                413: '#faad14',
                414: '#faad14',
                415: '#faad14',
                416: '#faad14',
                417: '#faad14',
                418: '#faad14',
                421: '#faad14',
                422: '#faad14',
                423: '#faad14',
                424: '#faad14',
                425: '#faad14',
                426: '#faad14',
                428: '#faad14',
                429: '#faad14',
                431: '#faad14',
                451: '#faad14',
                500: '#ff4d4f',
                501: '#ff4d4f',
                502: '#ff4d4f',
                503: '#ff4d4f',
                504: '#ff4d4f',
                505: '#ff4d4f',
                506: '#ff4d4f',
                507: '#ff4d4f',
                508: '#ff4d4f',
                510: '#ff4d4f',
                511: '#ff4d4f'
              }[Number(response.httpStatus)] || '#ff4d4f',
              whiteSpace: 'nowrap'
            }}>
              {response.httpStatus || '未知'}
            </div>
            <div style={{ fontSize: '14px', color: '#666666', whiteSpace: 'nowrap' }}>
              {getResponseTime()}
            </div>
            <div style={{ fontSize: '14px', color: '#666666', whiteSpace: 'nowrap' }}>
              {getResponseSize()}
            </div>
          </div>
        ) : undefined}
      />

      {/* 标签页内容 */}
      <div style={{ padding: 0 }}>
        {hasError ? (
          /* 请求异常标签页 */
          <div>
            <ResponseError />
          </div>
        ) : (
          <>
            {/* Body标签页 */}
            <div style={{ display: activeTab === 'body' ? 'block' : 'none' }}>
              <div>
                {hasResponseData && response.rawBody ? (
                  <ResponseBody />
                ) : (
                  <div style={{ padding: '16px' }}>
                    <EmptyState
                      title="暂无响应数据"
                      description="发送请求后，响应内容将显示在这里"
                      icon="📡"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cookie标签页 */}
            <div style={{ display: activeTab === 'cookie' ? 'block' : 'none' }}>
              <ResponseCookie />
            </div>

            {/* Header标签页 */}
            <div style={{ display: activeTab === 'header' ? 'block' : 'none' }}>
              <ResponseHeader />
            </div>

            {/* 实际请求标签页 */}
            <div style={{ display: activeTab === 'request' ? 'block' : 'none' }}>
              <ResponseRequest />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseSection;