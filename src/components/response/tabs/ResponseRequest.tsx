import React, { useState } from 'react';
import { useStore } from '../../../store';
import EmptyState from '../../common/EmptyState';
import AceEditor from '../../common/AceEditor';

const ResponseRequest: React.FC = () => {
  const { state } = useStore();
  const { curl } = state;
  const response = curl.response;
  const hasResponseData = response.consumeTime !== -1;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (!hasResponseData) {
    return (
      <div style={{ padding: '16px' }}>
        <EmptyState 
          title="暂无请求信息"
          description="请先发送请求获取实际请求详情"
          icon="🚀"
        />
      </div>
    );
  }

  const handleEditorChange = (value: string) => {
    // 只读模式，不需要处理变化
  };

  // 处理排序
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 对请求标头进行排序
  const sortedHeaders = state.curl.request.headers ? 
    [...state.curl.request.headers].sort((a, b) => {
      const keyA = a.key.toLowerCase();
      const keyB = b.key.toLowerCase();
      return sortOrder === 'asc' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
    }) : [];

  return (
    <div style={{ padding: '16px' }}>
      {/* 请求URL */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
          请求 URL:
        </div>
        <div style={{ backgroundColor: '#f9f9f9', borderRadius: '4px', padding: '8px' }}>
          <span style={{ color: '#ff7700', fontWeight: '500', marginRight: '8px' }}>
            {curl.request.method}
          </span>
          <span style={{ fontSize: '14px', color: '#333333' }}>
            {curl.request.url}
          </span>
        </div>
      </div>
      
      {/* 请求头部 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
          请求标头:
        </div>
        {state.curl.request.headers && state.curl.request.headers.length > 0 ? (
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
                    borderRight: '1px solid #f0f0f0',
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
                {sortedHeaders.map((header, index) => (
                  <tr 
                    key={index} 
                    style={{ 
                      borderBottom: index < sortedHeaders.length - 1 ? '1px solid #f0f0f0' : 'none' 
                    }}
                  >
                    <td style={{ 
                      padding: '8px', 
                      fontSize: '14px', 
                      color: '#333333', 
                      minWidth: '150px', 
                      maxWidth: '250px', 
                      borderRight: '1px solid #f0f0f0' 
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="无请求标头"
            description="该请求没有设置任何请求标头信息"
            icon="📋"
          />
        )}
      </div>
      
      {/* 请求体 */}
      {curl.request.method !== 'GET' && curl.request.method !== 'HEAD' && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
            请求体
            {curl.request.headers && curl.request.headers.some(h => h.key.toLowerCase() === 'content-type') && (
              <span style={{ fontSize: '12px', color: '#999999', marginLeft: '8px' }}>
                {curl.request.headers.find(h => h.key.toLowerCase() === 'content-type')?.value}
              </span>
            )}
          </div>
          {curl.request.body ? (
            <AceEditor
              value={curl.request.body}
              onChange={handleEditorChange}
              language="auto"
              readOnly={true}
              minLines={5}
              maxLines={20}
            />
          ) : (
            <EmptyState 
              title="无请求体"
              description="该请求方法不需要请求体"
              icon="📝"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseRequest;