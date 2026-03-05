import React from 'react';
import { useStore } from '../../../store';

const ResponseError: React.FC = () => {
  const { state } = useStore();
  const { curl } = state;
  const response = curl.response;
  const error = response.error;

  if (!error) {
    return null;
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fff1f0', 
        border: '1px solid #ffccc7', 
        borderRadius: '4px',
        color: '#cf1322'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
          请求异常
        </div>
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
        </div>
      </div>
    </div>
  );
};

export default ResponseError;