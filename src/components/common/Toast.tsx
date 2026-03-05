import React, { useEffect, useState } from 'react';
import SvgIcon from './SvgIcon';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

/**
 * 公共弹框通知组件
 * 用于显示顶部的操作结果提示
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 500,
  onClose
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // 根据类型获取不同的样式和图标
  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '400' as const,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '8px',
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s, visibility 0.2s'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          color: '#52c41a',
          border: '1px solid #e6f7e1'
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          color: '#ff4d4f',
          border: '1px solid #fff1f0'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          color: '#333333',
          border: '1px solid #f0f0f0'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SvgIcon name="success" size={20} />;
      case 'error':
        return <SvgIcon name="error" size={20} />;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div style={getToastStyle()}>
      {getIcon()}
      {decodeURIComponent(encodeURIComponent(message))}
    </div>
  );
};

export default Toast;