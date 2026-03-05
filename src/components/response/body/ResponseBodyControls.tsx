import React from 'react';
import Tooltip from '../../common/Tooltip';
import SvgIcon from '../../common/SvgIcon';
import CustomSelect from '../../common/CustomSelect';

interface ResponseBodyControlsProps {
  contentType: string;
  encoding: string;
  wordWrap: boolean;
  onContentTypeChange: (value: string) => void;
  onEncodingChange: (value: string) => void;
  onWordWrapToggle: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onSearch: () => void;
}

const ResponseBodyControls: React.FC<ResponseBodyControlsProps> = ({
  contentType,
  encoding,
  wordWrap,
  onContentTypeChange,
  onEncodingChange,
  onWordWrapToggle,
  onCopy,
  onDownload,
  onSearch
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
      {/* 内容类型 */}
      <CustomSelect
        value={contentType}
        options={[
          { value: 'json', label: 'JSON' },
          { value: 'xml', label: 'XML' },
          { value: 'html', label: 'HTML' },
        ]}
        onChange={onContentTypeChange}
        style={{
          minWidth: '80px'
        }}
      />
      
      {/* 编码 */}
      <CustomSelect
        value={encoding}
        options={[
          { value: 'utf-8', label: 'UTF-8' },
          { value: 'GBK', label: 'GBK' },
          { value: 'GB2312', label: 'GB2312' },
          { value: 'ISO-8859-1', label: 'ISO-8859-1' }
        ]}
        onChange={onEncodingChange}
        style={{
          minWidth: '80px'
        }}
      />
      
      {/* 自动换行 */}
      <Tooltip title="自动换行">
        <button
          onClick={onWordWrapToggle}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            cursor: 'pointer',
            height: '32px',
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <SvgIcon 
            name="wordWrap" 
            size={20} 
            color={wordWrap ? '#55BC8A' : '#d0d0d0'} 
          />
        </button>
      </Tooltip>
      
      {/* 复制按钮 */}
      <Tooltip title="复制">
        <button
          onClick={onCopy}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            cursor: 'pointer',
            height: '32px',
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <SvgIcon name="copy" size={20} />
        </button>
      </Tooltip>
      
      {/* 下载按钮 */}
      <Tooltip title="下载">
        <button
          onClick={onDownload}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            cursor: 'pointer',
            height: '32px',
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <SvgIcon name="download" size={20} />
        </button>
      </Tooltip>
      
      {/* 搜索按钮 */}
      <Tooltip title="搜索">
        <button
          onClick={onSearch}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            cursor: 'pointer',
            height: '32px',
            width: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <SvgIcon name="search" size={20} />
        </button>
      </Tooltip>
    </div>
  );
};

export default ResponseBodyControls;