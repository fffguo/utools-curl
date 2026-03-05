import React, { useState, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  style = {},
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className={`custom-select-container ${className}`} style={{ position: 'relative', ...style }}>
      {/* 选择器按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid #d0d0d0',
          backgroundColor: '#ffffff',
          fontSize: '12px',
          cursor: 'pointer',
          height: '28px',
          minWidth: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#00a870';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d0d0d0';
        }}
      >
        <span>{selectedOption?.label || ''}</span>
        <span style={{ fontSize: '10px', color: '#666666', marginLeft: '4px' }}>
          ▼
        </span>
      </button>
      
      {/* 下拉菜单 */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '2px',
          backgroundColor: '#ffffff',
          border: '1px solid #d0d0d0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          overflow: 'hidden',
          minWidth: '80px'
        }}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(option.value);
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                color: option.value === value ? '#00a870' : '#333333',
                backgroundColor: option.value === value ? '#f6ffed' : '#ffffff',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;