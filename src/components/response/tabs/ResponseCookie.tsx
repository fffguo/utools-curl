import React from 'react';
import { useStore } from '../../../store';
import EmptyState from '../../common/EmptyState';

const ResponseCookie: React.FC = () => {
  const { state } = useStore();
  const { curl } = state;
  const response = curl.response;
  const hasResponseData = response.consumeTime !== -1;

  if (!hasResponseData || !response.headers) {
    return (
      <div style={{ padding: '16px' }}>
        <EmptyState 
          title="暂无Cookie数据"
          description="发送请求后，Cookie信息将显示在这里"
          icon="🍪"
        />
      </div>
    );
  }

  const cookieHeaders = Object.entries(response.headers).filter(
    ([key]) => key.toLowerCase() === 'set-cookie'
  );

  if (cookieHeaders.length === 0) {
    return (
      <div style={{ padding: '16px' }}>
        <EmptyState 
          title="暂无Cookie数据"
          description="服务器未返回Cookie信息"
          icon="🍪"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      {cookieHeaders.map(([key, value], index) => (
        <div 
          key={`${key}-${index}`} 
          style={{
            marginBottom: '8px', 
            padding: '8px', 
            border: '1px solid #e8e8e8', 
            borderRadius: '4px'
          }}
        >
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#333333', 
            marginBottom: '4px'
          }}>
            {key}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#666666', 
            wordBreak: 'break-all'
          }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponseCookie;