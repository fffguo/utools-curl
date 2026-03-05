import { toJsonObject } from 'curlconverter';

// 解析URL中的查询参数，支持key重复的场景
export const parseUrlParams = (url: string): Array<{ key: string; value: string; enabled: boolean }> => {
  const params: Array<{ key: string; value: string; enabled: boolean }> = [];
  try {
    // 尝试使用URL构造函数解析
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    // 使用forEach方法遍历所有参数，包括重复的key
    searchParams.forEach((value, key) => {
      params.push({ key, value, enabled: true });
    });
  } catch (error) {
    // URL解析失败，尝试手动解析
    try {
      // 提取查询字符串部分
      const queryStringStart = url.indexOf('?');
      if (queryStringStart !== -1) {
        const queryString = url.substring(queryStringStart + 1);
        // 分割查询参数
        const paramPairs = queryString.split('&');
        paramPairs.forEach(pair => {
          if (pair) {
            const [key, value] = pair.split('=');
            // 即使key为空，也添加参数，这样参数行不会被删除
            params.push({ 
              key: key ? decodeURIComponent(key) : '', 
              value: value ? decodeURIComponent(value) : '', 
              enabled: true 
            });
          }
        });
      }
    } catch (e) {
      // 手动解析也失败，返回空数组
    }
  }
  return params;
};

// 解析curl命令为请求对象
export const parseCurlCommand = (text: string) => {
  try {
    console.info('使用curlconverter库解析curl命令');
    // 使用curlconverter库将curl命令直接转换为JSON格式
    const curlJson = toJsonObject(text);
    console.info('转换后的JSON:', curlJson);
    
    // 从JSON中提取信息
    const url = curlJson.raw_url || curlJson.url || '';
    const method = curlJson.method || 'GET';
    const headers = curlJson.headers || {};
    // 处理body，支持data字段
    let body = '';
    if (curlJson.body) {
      body = curlJson.body;
    } else if (curlJson.data) {
      body = JSON.stringify(curlJson.data);
    }
    
    console.info('提取到的信息:');
    console.info('URL:', url);
    console.info('Method:', method);
    console.info('Headers:', headers);
    console.info('Body:', body);
    
    // 处理headers，确保它是一个数组
    let headersArray: Array<{ key: string; value: string; enabled: boolean }> = [];
    if (headers && typeof headers === 'object') {
      // 如果headers是一个对象，转换为数组格式
      headersArray = Object.entries(headers).map(([key, value]) => ({
        key,
        value: String(value),
        enabled: true
      }));
      console.info('将headers对象转换为数组:', headersArray);
    } else if (Array.isArray(headers)) {
      // 如果headers已经是一个数组，直接使用
      headersArray = headers.map(item => ({
        ...item,
        enabled: true
      }));
    }
    
    // 处理查询参数，从URL中解析，支持key重复的场景
    const urlArgs = parseUrlParams(url);
    console.info('从URL中解析参数:', urlArgs);
    
    // 创建curlObj对象
    const curlObj = {
      url: url,
      method: method,
      headers: headersArray,
      body: body,
      urlArgs: urlArgs
    };
    console.info('创建curlObj对象:', curlObj);
    
    return { success: true, data: curlObj };
  } catch (error) {
    console.error('解析curl失败:', error);
    return { success: false, error: error };
  }
};
