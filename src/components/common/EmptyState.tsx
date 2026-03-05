import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

/**
 * 空状态组件
 * 用于显示暂无数据的现代化效果
 */
const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description = '',
  icon = '📭'
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '200px', 
      padding: '24px', 
      backgroundColor: '#fafafa', 
      borderRadius: '8px',
      border: '1px dashed #e8e8e8'
    }}>
      <div style={{ 
        fontSize: '48px', 
        marginBottom: '16px',
        opacity: 0.7
      }}>
        {icon}
      </div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '500', 
        color: '#333333', 
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {title}
      </div>
      {description && (
        <div style={{ 
          fontSize: '14px', 
          color: '#999999', 
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          {description}
        </div>
      )}
    </div>
  );
};

export default EmptyState;