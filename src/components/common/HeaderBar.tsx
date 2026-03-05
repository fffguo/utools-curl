import React, { useState } from 'react';
import { useStore } from '../../store';
import { toJsonObject, toNodeFetch } from 'curlconverter';
import fetchToCurl from 'fetch-to-curl';
import Toast from './Toast';
import EnvironmentSelector from '../environment/EnvironmentSelector';
import { parseCurlCommand, parseUrlParams } from '../../utils/curlParser';

/**
 * 顶部导航栏组件
 * 提供提取剪贴板curl、复制curl、还原、替换等功能
 */
const HeaderBar: React.FC = () => {
  const { state, dispatch } = useStore();
  const { curl } = state;
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // 提取剪贴板中的curl
  const extractFromClipboard = () => {
    console.info('开始提取剪贴板中的curl命令');
    if (navigator.clipboard) {
      console.info('浏览器支持剪贴板API');
      navigator.clipboard.readText()
        .then(text => {
          console.info('成功读取剪贴板内容，长度:', text.length, 'bytes');
          if (text) {
            console.info('更新store中的curlText状态');
            dispatch({ type: 'SET_CURL_TEXT', payload: text });

            // 尝试解析curl命令
            try {
              const result = parseCurlCommand(text);
              if (result.success) {
                const curlObj = result.data;
                dispatch({ type: 'INIT_BY_CURL_TEXT', payload: curlObj });
              } else {
                // 显示友好的错误提示
                setToast({ message: '解析curl命令失败，请确保您粘贴的是完整的curl命令，并且以"curl"开头。', type: 'error' });
              }
            } catch (error) {
              console.error('解析curl失败:', error);
              // 显示友好的错误提示
              setToast({ message: '解析curl命令失败，请确保您粘贴的是完整的curl命令，并且以"curl"开头。', type: 'error' });
            }
          }
        })
        .catch(err => {
          console.error('读取剪贴板失败:', err);
        });
    } else {
      console.error('浏览器不支持剪贴板API');
    }
  };

  // 复制curl命令
  const copyCurl = () => {
    console.info('准备复制curl命令');

    // 从当前请求信息生成curl命令
    const { url, method, headers, body } = curl.request;

    if (!url) {
      console.warn('无法复制curl命令，URL为空');
      setToast({ message: '暂无curl命令可复制', type: 'info' });
      return;
    }

    try {
      // 构建fetch选项
      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: {}
      };

      // 处理headers
      if (headers && Array.isArray(headers)) {
        headers.forEach(header => {
          if (header && header.key && header.value && header.enabled !== false) {
            fetchOptions.headers![header.key] = header.value;
          }
        });
      }

      // 添加body（如果不是GET或HEAD请求）
      if (body && body.trim() && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
        // 尝试解析body为JSON，确保格式正确
        let processedBody = body;
        try {
          // 尝试解析body为JSON
          const parsedBody = JSON.parse(body);
          // 重新序列化，确保格式正确
          processedBody = JSON.stringify(parsedBody);
          // 设置Content-Type为application/json
          if (!fetchOptions.headers || !fetchOptions.headers['Content-Type']) {
            fetchOptions.headers = {
              ...fetchOptions.headers,
              'Content-Type': 'application/json'
            };
          }
        } catch (e) {
          // 如果不是JSON，保持原样
        }

        fetchOptions.body = processedBody;
      }

      // 使用fetch-to-curl生成curl命令
      const curlCommand = fetchToCurl(url, fetchOptions);

      console.info('生成的curl命令:', curlCommand);

      if (navigator.clipboard) {
        console.info('浏览器支持剪贴板API，开始复制curl命令');
        navigator.clipboard.writeText(curlCommand)
          .then(() => {
            console.info('curl命令已成功复制到剪贴板');
            setToast({ message: 'curl命令复制成功', type: 'success' });
          })
          .catch(err => {
            console.error('复制失败:', err);
            setToast({ message: '复制失败，请重试', type: 'error' });
          });
      } else {
        console.warn('无法复制curl命令，浏览器不支持剪贴板API');
        setToast({ message: '无法复制，请检查浏览器权限', type: 'warning' });
      }
    } catch (error) {
      console.error('生成curl命令失败:', error);
      setToast({ message: '生成curl命令失败，请重试', type: 'error' });
    }
  };



  return (
    <div>
      {/* 弹框通知 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={extractFromClipboard}
            style={{
              padding: '4px 8px',
              borderRadius: '3px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            提取剪贴板中的curl
          </button>
          <button
            onClick={copyCurl}
            style={{
              padding: '4px 8px',
              borderRadius: '3px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            复制curl
          </button>
        </div>
        <div>
          <EnvironmentSelector />
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;