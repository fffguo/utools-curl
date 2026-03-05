import React from 'react';

interface TabProps {
  activeTab: string;
  tabs: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
  onTabChange: (key: string) => void;
  rightContent?: React.ReactNode;
}

/**
 * 公共标签页组件
 * 用于请求信息和返回信息的标签页导航
 */
const Tab: React.FC<TabProps> = ({ activeTab, tabs, onTabChange, rightContent }) => {
  return (

    <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', borderBottom: '1px solid #d9d9d9' }}>
      <div style={{ display: 'flex', backgroundColor: '#fafafa', alignItems: 'center', padding: 0, margin: 0, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flex: 1 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: activeTab === tab.key ? '#ffffff' : '#fafafa',
                borderBottom: activeTab === tab.key ? '2px solid #00a870' : '2px solid transparent',
                zIndex: 1,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.key ? '500' : 'normal',
                color: activeTab === tab.key ? '#00a870' : '#333333',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                outline: 'none',
                boxSizing: 'border-box',
                height: '38px',
                margin: 0
              }}
            >
              <span style={{ display: 'inline-block', position: 'relative' }}>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{
                    color: '#00a870',
                    fontSize: '10px',
                    fontWeight: '600',
                    lineHeight: '1',
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    whiteSpace: 'nowrap'
                  }}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
        {rightContent && (
          <div style={{ marginLeft: 'auto', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;