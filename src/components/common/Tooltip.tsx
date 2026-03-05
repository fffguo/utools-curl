import React, { useState } from 'react';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * 公共悬浮提示组件
 * 用于统一项目中所有悬浮弹框的样式
 */
const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  position = 'top'
}) => {
  const [visible, setVisible] = useState(false);

  // 根据位置计算样式
  const getTooltipStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      backgroundColor: '#ffffff',
      color: '#333333',
      fontSize: '12px',
      padding: '8px 12px',
      borderRadius: '6px',
      whiteSpace: 'nowrap' as const,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e8e8e8',
      zIndex: 9999,
      pointerEvents: 'none' as const,
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s, visibility 0.2s'
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px'
        };
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px'
        };
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px'
        };
      default:
        return baseStyle;
    }
  };

  // 获取尖嘴样式
  const getArrowStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderStyle: 'solid' as const,
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s, visibility 0.2s'
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0',
          borderColor: '#ffffff transparent transparent',
          zIndex: 10000
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 6px 6px',
          borderColor: 'transparent transparent #ffffff',
          zIndex: 10000
        };
      case 'left':
        return {
          ...baseStyle,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 0 6px 6px',
          borderColor: 'transparent transparent transparent #ffffff',
          zIndex: 10000
        };
      case 'right':
        return {
          ...baseStyle,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 6px 6px 0',
          borderColor: 'transparent #ffffff transparent transparent',
          zIndex: 10000
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div style={getTooltipStyle()}>
        {title}
        <div style={getArrowStyle()} />
      </div>
    </div>
  );
};

export default Tooltip;