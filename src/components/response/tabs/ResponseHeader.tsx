import React, { useState } from 'react';
import { useStore } from '../../../store';
import EmptyState from '../../common/EmptyState';

const ResponseHeader: React.FC = () => {
  const { state } = useStore();
  const { curl } = state;
  const response = curl.response;
  const hasResponseData = response.consumeTime !== -1;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (!hasResponseData || !response.headers) {
    return (
      <div style={{ padding: '16px' }}>
        <EmptyState 
          title="暂无响应标头"
          description="发送请求后，响应标头信息将显示在这里"
          icon="📋"
        />
      </div>
    );
  }

  const hasHeaders = Array.isArray(response.headers) ? response.headers.length > 0 : Object.keys(response.headers).length > 0;

  if (!hasHeaders) {
    return (
      <div style={{ padding: '16px' }}>
        <EmptyState 
          title="暂无响应标头"
          description="服务器未返回任何响应标头"
          icon="📋"
        />
      </div>
    );
  }

  // 处理排序
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 对响应标头进行排序
  const sortedHeaders = Array.isArray(response.headers) ? 
    [...response.headers].sort((a, b) => {
      const keyA = a.key.toLowerCase();
      const keyB = b.key.toLowerCase();
      return sortOrder === 'asc' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
    }) : 
    Object.entries(response.headers)
      .sort(([keyA], [keyB]) => {
        const lowerKeyA = keyA.toLowerCase();
        const lowerKeyB = keyB.toLowerCase();
        return sortOrder === 'asc' ? lowerKeyA.localeCompare(lowerKeyB) : lowerKeyB.localeCompare(lowerKeyA);
      });

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ 
                padding: '8px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e0e0e0', 
                minWidth: '150px', 
                maxWidth: '250px',
                cursor: 'pointer'
              }} onClick={handleSort}>
                名称 {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th style={{ 
                padding: '8px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e0e0e0' 
              }}>
                值
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(response.headers) ? (
              sortedHeaders.map((header, index) => (
                <tr 
                  key={index} 
                  style={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <td style={{ 
                    padding: '8px', 
                    fontSize: '14px', 
                    color: '#333333', 
                    minWidth: '150px', 
                    maxWidth: '250px' 
                  }}>
                    {header.key}
                  </td>
                  <td style={{ 
                    padding: '8px', 
                    fontSize: '14px', 
                    color: '#333333', 
                    wordBreak: 'break-all' 
                  }}>
                    {header.value}
                  </td>
                </tr>
              ))
            ) : (
              sortedHeaders.map(([key, value], index) => (
                <tr 
                  key={index} 
                  style={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <td style={{ 
                    padding: '8px', 
                    fontSize: '14px', 
                    color: '#333333', 
                    minWidth: '150px', 
                    maxWidth: '250px' 
                  }}>
                    {key}
                  </td>
                  <td style={{ 
                    padding: '8px', 
                    fontSize: '14px', 
                    color: '#333333', 
                    wordBreak: 'break-all' 
                  }}>
                    {value}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseHeader;