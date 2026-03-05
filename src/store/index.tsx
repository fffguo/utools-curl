import { createContext, useContext, useEffect, useReducer } from 'react';
import { initialState } from './modules/initialState';
import { reducer } from './modules/reducer';
import { Environment, StoreContextType, StoreProviderProps } from './modules/types';

// 创建 Context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// 自定义 Hook，用于获取 store
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

const isUtools = typeof window.utools !== 'undefined';

// Store Provider 组件
export function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 检查是否为 utools 环境
  // 发送请求的函数
  const sendRequest = (curlArgs: any) => {
    console.log('开始发送请求:', curlArgs);
    dispatch({ type: 'SEND_REQUEST' });

    // 清空之前的响应内容
    dispatch({
      type: 'SET_CURL_RESPONSE',
      payload: {
        httpStatus: '未知',
        consumeTime: -1,
        headers: [],
        body: '',
        error: undefined
      }
    });

    // 调用onStart回调
    if (curlArgs.onStart) {
      curlArgs.onStart();
    }

    // 请求失败回调
    const errorCallback = (error: any) => {
      console.error('请求失败:', error);
      dispatch({ type: 'CANCEL_REQUEST' });

      // 设置响应错误信息
      dispatch({
        type: 'SET_RESPONSE_ERROR',
        payload: error.toString()
      });

      // 调用onEnd回调
      if (curlArgs.onEnd) {
        curlArgs.onEnd();
      }

      // 显示响应标签页
      dispatch({ type: 'SHOW_RESPONSE_TAB' });

      if (state.ace.responseBodyEditor && typeof state.ace.responseBodyEditor.getSession === 'function') {
        try {
          state.ace.responseBodyEditor.setValue(error.toString(), 1);
          state.ace.responseBodyEditor.getSession().setMode('ace/mode/text');
        } catch (error) {
          console.error('更新编辑器内容失败:', error);
        }
      }
    };

    const startMs = new Date().valueOf();

    // 检查window.sendRequest是否存在
    console.log('window.sendRequest是否存在:', typeof window.sendRequest);

    // 调用外部的 sendRequest 函数（由 utools 提供）
    if (window.sendRequest) {
      console.log('调用window.sendRequest发送请求');
      window.sendRequest(
        curlArgs,
        (response: any) => {
          console.log('收到响应对象:', response);
          let body = '';

          // 响应结束回调
          response.on('end', () => {
            const consumeTime = new Date().valueOf() - startMs;
            console.log('响应结束，总耗时:', consumeTime, 'ms');
            // 当body过大时，只打印长度和部分内容
            let responseBodyLog = body;
            if (body && body.length > 1000) {
              responseBodyLog = `${body.substring(0, 200)}... (${body.length} 字符)`;
            }
            console.log('响应体内容:', responseBodyLog);

            // 构建原始大小写的响应头
            let headers = response.headers || {};
            if (response.rawHeaders && response.rawHeaders.length > 0) {
              headers = {};
              for (let i = 0; i < response.rawHeaders.length; i += 2) {
                const key = response.rawHeaders[i];
                const value = response.rawHeaders[i + 1];
                if (headers[key]) {
                  if (Array.isArray(headers[key])) {
                    headers[key].push(value);
                  } else {
                    headers[key] = [headers[key], value];
                  }
                } else {
                  headers[key] = value;
                }
              }
            }

            // 构建响应对象
            const responseData = {
              httpStatus: response.statusCode || '未知',
              consumeTime: consumeTime,
              headers: headers,
              rawBody: body,
              error: undefined
            };
            console.log('构建的响应对象:', responseData);

            // 更新store中的响应状态
            dispatch({ type: 'SET_CURL_RESPONSE', payload: responseData });
            console.log('更新store中的响应状态成功');

            // 调用onEnd回调
            if (curlArgs.onEnd) {
              curlArgs.onEnd();
            }

            // 更新编辑器内容
            if (state.ace.responseBodyEditor && typeof state.ace.responseBodyEditor.getSession === 'function') {
              try {
                state.ace.responseBodyEditor.setValue(body, 1);
                state.ace.responseBodyEditor.getSession().setMode('ace/mode/text');
                console.log('更新编辑器内容成功');
              } catch (error) {
                console.error('更新编辑器内容失败:', error);
              }
            }

            // 显示响应标签页
            dispatch({ type: 'SHOW_RESPONSE_TAB' });
            console.log('显示响应标签页成功');
          });

          // 接收响应数据
          response.on('data', (data: any) => {
            body += data.toString();
            console.log('收到响应数据片段，当前总长度:', body.length);
          });

          // 响应错误回调
          response.on('error', errorCallback);
        },
        errorCallback
      );
    } else {
      // 直接使用fetch API发送请求
      console.log('window.sendRequest不存在，直接使用fetch API发送请求');

      try {
        // 构建并执行fetch请求
        console.log('执行fetch请求');
        const startMs = new Date().valueOf();

        // 创建一个函数来执行fetch请求
        const executeFetch = async () => {
          try {
            const url = curlArgs.url;
            const method = curlArgs.method || 'GET';
            const headers = curlArgs.headers || {};
            const body = curlArgs.body || '';

            // 当body过大时，只打印长度和部分内容
            let requestBodyLog = body;
            if (body && body.length > 1000) {
              requestBodyLog = `${body.substring(0, 200)}... (${body.length} 字符)`;
            }
            console.log('使用fetch API发送请求:', {
              url,
              method,
              headers,
              body: requestBodyLog
            });

            // 构建fetch选项
            const fetchOptions: RequestInit = {
              method,
              headers,
            };

            // 如果有body且不是GET或HEAD请求，添加body
            if (body && method !== 'GET' && method !== 'HEAD') {
              fetchOptions.body = body;
            }

            // 执行fetch请求
            const response = await fetch(url, fetchOptions);
            console.log('收到fetch响应:', response);

            const consumeTime = new Date().valueOf() - startMs;

            // 构建原始大小写的响应头
            // 注意：fetch API 的 Headers 对象会将所有键转换为小写，无法获取原始大小写
            // 这里我们使用小写键，但在显示时可以尝试还原首字母大写的格式
            const responseHeaders = Object.fromEntries(response.headers.entries());

            // 尝试将响应头键转换为首字母大写的格式
            const formattedHeaders: Record<string, string> = {};
            for (const [key, value] of Object.entries(responseHeaders)) {
              // 将每个单词的首字母大写
              const formattedKey = key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
              formattedHeaders[formattedKey] = value;
            }

            // 获取原始二进制响应体数据
            const responseBodyBuffer = await response.arrayBuffer();
            // 默认解码为 UTF-8 字符串
            const responseBody = new TextDecoder('utf-8').decode(responseBodyBuffer);

            console.log('响应状态:', response.status);
            console.log('响应头:', formattedHeaders);
            // 当body过大时，只打印长度和部分内容
            let responseBodyLog = responseBody;
            if (responseBody && responseBody.length > 1000) {
              responseBodyLog = `${responseBody.substring(0, 200)}... (${responseBody.length} 字符)`;
            }
            console.log('响应体内容:', responseBodyLog);
            console.log('响应体长度:', responseBody.length);

            const responseData = {
              httpStatus: response.status,
              consumeTime: consumeTime,
              headers: formattedHeaders,
              rawBody: responseBody,
              rawBodyBuffer: responseBodyBuffer,
              error: undefined
            };
            console.log('构建的响应对象:', responseData);

            // 更新store中的响应状态
            dispatch({ type: 'SET_CURL_RESPONSE', payload: responseData });
            console.log('更新store中的响应状态成功');

            // 调用onEnd回调
            if (curlArgs.onEnd) {
              curlArgs.onEnd();
            }

            // 更新编辑器内容
            if (state.ace.responseBodyEditor && typeof state.ace.responseBodyEditor.getSession === 'function') {
              try {
                state.ace.responseBodyEditor.setValue(responseBody, 1);
                state.ace.responseBodyEditor.getSession().setMode('ace/mode/text');
                console.log('更新编辑器内容成功');
              } catch (error) {
                console.error('更新编辑器内容失败:', error);
              }
            }

            // 显示响应标签页
            dispatch({ type: 'SHOW_RESPONSE_TAB' });
            console.log('显示响应标签页成功');
          } catch (error) {
            console.error('执行fetch请求失败:', error);
            errorCallback(error);
          }
        };

        executeFetch().catch((error: any) => {
          console.error('fetch请求失败:', error);
          errorCallback(error);
        });
      } catch (error) {
        console.error('发送fetch请求失败:', error);
        errorCallback(error);
      }
    }
  };

  // 取消请求的函数
  const cancelRequest = () => {
    dispatch({ type: 'CANCEL_REQUEST' });

    if (state.ace.responseBodyEditor) {
      state.ace.responseBodyEditor.setValue('', 1);
      state.ace.responseBodyEditor.getSession().setMode('ace/mode/json5');
    }
  };

  // 获取实时 headers
  const getRealTimeHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    // 从curl.request.headers获取headers，只包含启用的headers
    if (state.curl.request.headers) {
      state.curl.request.headers
        .filter((header: any) => header && header.key && header.key !== '' && header.value && header.enabled !== false)
        .forEach((header: any) => {
          headers[header.key] = header.value;
        });
    }

    return headers;
  };

  // 获取实时 body
  const getRealTimeBody = (): string => {
    let body = state.ace.requestBodyEditor ? state.ace.requestBodyEditor.getValue() : '';
    if (state.ace.requestBodyMode === state.ace.supportedLanguage.json) {
      if (body && body !== '') {
        try {
          body = JSON.stringify(JSON.parse(body));
        } catch (e) {
          // 保持原始 body
        }
      }
    }
    return body;
  };

  // 环境管理方法

  // 获取默认环境
  const getDefaultEnvironment = (): Environment => ({
    id: 'local-dev',
    name: '本地开发-8080',
    baseUrl: 'http://127.0.0.1:8080',
    variables: [],
    isDefault: true,
    isBuiltIn: true
  });

  // 保存数据到存储
  const saveToStorage = (key: string, value: any): void => {
    try {
      if (isUtools && window.utools.dbStorage) {
        window.utools.dbStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      // 静默处理错误，避免影响用户体验
    }
  };

  // 从存储加载数据
  const loadFromStorage = (key: string): string | null => {
    try {
      if (isUtools && window.utools.dbStorage) {
        return window.utools.dbStorage.getItem(key);
      } else {
        return localStorage.getItem(key);
      }
    } catch (error) {
      // 静默处理错误，避免影响用户体验
      return null;
    }
  };

  // 添加环境
  const addEnvironment = async (env: Omit<Environment, 'id'>) => {
    const newEnv: Environment = {
      ...env,
      id: Date.now().toString()
    };
    const updatedEnvironments = [...state.environments, newEnv];
    dispatch({ type: 'ADD_ENVIRONMENT', payload: newEnv });
    console.log('添加环境:', newEnv, updatedEnvironments);
    saveEnvironments(updatedEnvironments);
  };

  // 更新环境
  const updateEnvironment = async (env: Environment) => {
    const updatedEnvironments = state.environments.map(e => 
      e.id === env.id ? env : e
    );
    dispatch({ type: 'UPDATE_ENVIRONMENT', payload: env });
    console.log('更新环境:', env, updatedEnvironments);
    saveEnvironments(updatedEnvironments);
  };

  // 删除环境
  const deleteEnvironment = async (envId: string) => {
    const updatedEnvironments = state.environments.filter(e => e.id !== envId);
    dispatch({ type: 'DELETE_ENVIRONMENT', payload: envId });
    console.log('删除环境:', envId, updatedEnvironments);
    saveEnvironments(updatedEnvironments);
  };

  // 设置当前环境
  const setCurrentEnvironment = async (envId: string | null) => {
    dispatch({ type: 'SET_CURRENT_ENVIRONMENT', payload: envId });
    saveToStorage('curl_tool_currentEnvironmentId', envId || '');
  };

  // 加载环境
  const loadEnvironments = async (): Promise<void> => {
    try {
      let environments: Environment[] = [];
      let currentEnvId: string | null = null;

      // 加载环境数据
      const storedEnvironments = loadFromStorage('curl_tool_environments');
      console.log('从存储加载到环境:', storedEnvironments);
      if (storedEnvironments) {
        try {
          environments = JSON.parse(storedEnvironments);
        } catch {
          // 解析失败，使用默认环境
          environments = [getDefaultEnvironment()];
        }
      } else {
        // 没有存储的环境数据，使用默认环境
        environments = [getDefaultEnvironment()];
      }

      // 加载当前环境ID
      const storedCurrentEnvId = loadFromStorage('curl_tool_currentEnvironmentId');
      currentEnvId = storedCurrentEnvId || 'local-dev';

      // 确保环境数据不为空
      if (!environments || environments.length === 0) {
        environments = [getDefaultEnvironment()];
        currentEnvId = 'local-dev';
      }

      // 更新环境状态
      dispatch({ type: 'SET_ENVIRONMENTS', payload: environments });
      dispatch({ type: 'SET_CURRENT_ENVIRONMENT', payload: currentEnvId });
      console.log('设置当前环境:', currentEnvId, environments, state.environments);
      // 保存环境数据（确保数据持久化）
      saveEnvironments(environments);

      // 保存当前环境ID
      saveToStorage('curl_tool_currentEnvironmentId', currentEnvId);
    } catch {
      // 发生错误时，使用默认环境
      const defaultEnvironment = getDefaultEnvironment();
      dispatch({ type: 'SET_ENVIRONMENTS', payload: [defaultEnvironment] });
      dispatch({ type: 'SET_CURRENT_ENVIRONMENT', payload: 'local-dev' });
    }
  };

  // 保存环境
  const saveEnvironments = async (environments?: Environment[]): Promise<void> => {
    try {
      const userEnvironments = environments || state.environments;
      const environmentsJson = JSON.stringify(userEnvironments);
      saveToStorage('curl_tool_environments', environmentsJson);
      console.log('保存环境到存储:', userEnvironments);
    } catch {
      // 静默处理错误，避免影响用户体验
    }
  };

  // 初始化时加载环境和处理 utools 启动
  useEffect(() => {
    loadEnvironments();
  }, []);

  const value: StoreContextType = {
    state,
    dispatch,
    sendRequest,
    cancelRequest,
    getRealTimeHeaders,
    getRealTimeBody,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setCurrentEnvironment,
    loadEnvironments,
    saveEnvironments
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export default initialState;