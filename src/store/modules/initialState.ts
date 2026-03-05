import { State } from './types';

// 初始状态
export const initialState: State = {
  // curl参数
  curl: {
    curlText: '',
    request: {
        url: '',
        initUrl: '',
        method: 'GET',
        headers: [],
        body: '',
        urlArgs: []
      },
    response: {
      httpStatus: '未知',
      consumeTime: -1,
      headers: [],
      body: '',
      rawBody: ''
    }
  },
  // ace编辑器
  ace: {
    supportedLanguage: {
      json: 'ace/mode/json5',
      xml: 'ace/mode/xml',
      text: 'ace/mode/text'
    },
    responseBodyEditor: undefined,
    requestBodyEditor: undefined,
    requestBodyContentType: 'JSON',
    responseBodyContentType: 'JSON',
    requestBodyMode: 'ace/mode/json5'
  },
  // request dom节点
  dom: {
    loading: false,
    request: {
      startInit: false,
      activeTabName: 'requestBody',
      requestHeaderTableRef: null,
      urlArgsTableRef: null,
      syncWithUrlToArgs: false
    },
    response: {
      show: false,
      activeTabName: 'responseResult'
    }
  },
  // 环境管理
  environments: [
    {
      id: 'local-dev',
      name: '本地开发-8080',
      baseUrl: 'http://127.0.0.1:8080',
      variables: []
    }
  ],
  currentEnvironmentId: 'local-dev'
};

export default initialState;