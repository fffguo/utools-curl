import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { parseCurlCommand, parseUrlParams } from '../utils/curlParser';
import HeaderBar from './common/HeaderBar';
import RequestSection from './request/RequestSection';
import UrlInput from './request/UrlInput';
import ResponseSection from './response/ResponseSection';

const isUtools = typeof window.utools !== 'undefined';
/**
 * Curl 工具主组件
 * 整合所有功能模块，提供完整的 Curl 请求测试工具
 */
const CurlTool: React.FC = () => {
  const { state, dispatch, sendRequest, getRealTimeHeaders, getRealTimeBody, cancelRequest } = useStore();
  const { curl, dom } = state;
  const [isLoading, setIsLoading] = useState(false);


  // 处理文本的函数
  const processText = (text: string) => {
    console.info('开始处理文本:', text);
    // 更新store中的curlText状态
    dispatch({ type: 'SET_CURL_TEXT', payload: text });

    // 尝试解析curl命令
    try {
      const result = parseCurlCommand(text);
      if (result.success) {
        const curlObj = result.data;
        console.info('解析curl成功，设置curlObj:', curlObj);
        dispatch({ type: 'INIT_BY_CURL_TEXT', payload: curlObj });
      } else {
        // 尝试直接作为URL处理
        if (text.startsWith('http://') || text.startsWith('https://')) {
          console.log('直接作为URL处理:', text);
          // 解析URL中的参数
          const urlArgs = parseUrlParams(text);
          console.info('从URL中解析参数:', urlArgs);
          const curlObj = {
            url: text,
            method: 'GET',
            headers: [],
            body: '',
            urlArgs: urlArgs
          };
          console.info('创建curlObj:', curlObj);
          dispatch({ type: 'INIT_BY_CURL_TEXT', payload: curlObj });
        }
      }
    } catch (error) {
      console.error('解析curl失败:', error);
      // 尝试直接作为URL处理
      if (text.startsWith('http://') || text.startsWith('https://')) {
        console.log('直接作为URL处理:', text);
        // 解析URL中的参数
        const urlArgs = parseUrlParams(text);
        console.info('从URL中解析参数:', urlArgs);
        const curlObj = {
          url: text,
          method: 'GET',
          headers: [],
          body: '',
          urlArgs: urlArgs
        };
        console.info('创建curlObj:', curlObj);
        dispatch({ type: 'INIT_BY_CURL_TEXT', payload: curlObj });
      }
    }
  }

  const initByEnterPayload = (code: string, type: string, payload: string) => {
    console.log('utools 插件启动:', code, type, payload);
    // 处理从搜索框进入的情况
    if (type === 'regex' || type === 'text') {
      const inputText = payload;
      console.log('搜索框输入内容:', inputText);
      // 尝试解析输入内容
      if (inputText && inputText != "curl") {
        processText(inputText);
      }
    }
  }

  useEffect(() => {
    // 处理 utools 启动时的初始化
    if (isUtools) {
      console.log('utools 环境检测通过');
      // 重置进入插件事件
      utools.onPluginEnter(({ code, type, payload }) => {
        initByEnterPayload(code, type, payload);
      })
      const { code, type, payload } = utools.dbStorage.getItem("__enterPayload") || {};
      initByEnterPayload(code, type, payload);
      utools.dbStorage.setItem("__enterPayload", {});
    }
  }, []);


  // 处理发送请求
  const handleSendRequest = () => {
    if (isLoading) {
      // 如果正在加载，取消请求
      cancelRequest();
      setIsLoading(false);
      return;
    }

    console.info('准备发送请求');
    const headers = getRealTimeHeaders();
    console.info('获取实时请求头部:', headers);
    const body = getRealTimeBody();
    console.info('获取实时请求体:', body);

    // 应用环境的baseUrl
    let finalUrl = curl.request.url;
    const currentEnvironment = state.environments.find(
      env => env.id === state.currentEnvironmentId
    );

    if (currentEnvironment && currentEnvironment.baseUrl) {
      // 如果URL是相对路径，添加baseUrl
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        // 确保baseUrl末尾没有斜杠，URL开头没有斜杠
        const baseUrl = currentEnvironment.baseUrl.replace(/\/$/, '');
        const relativeUrl = finalUrl.replace(/^\//, '');
        finalUrl = `${baseUrl}/${relativeUrl}`;
      }
    }

    // 不再手动添加urlArgs到URL，因为urlArgs已经通过UrlInput组件同步到URL中

    console.info('应用环境后的最终URL:', finalUrl);

    const curlArgs = {
      url: finalUrl,
      method: curl.request.method,
      headers: headers,
      body: body,
      onStart: () => setIsLoading(true),
      onEnd: () => setIsLoading(false)
    };

    console.info('调用sendRequest函数发送请求');
    sendRequest(curlArgs);
    console.info('请求发送完成，结果会通过回调和状态更新处理');
  };

  return (
    <div style={{ padding: '0px', minHeight: '100vh' }}>
      <div style={{ padding: '0px' }}>
        {/* 顶部导航栏 */}
        <HeaderBar />

        {/* URL 输入区域 */}
        <UrlInput onSend={handleSendRequest} isLoading={isLoading} />

        {/* 请求部分 */}
        <RequestSection />

        {/* 响应部分 */}
        <ResponseSection />
      </div>
    </div>
  );
};

export default CurlTool;