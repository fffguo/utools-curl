import { State, ActionType } from './types';

// Reducer 函数
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'SET_CURL_TEXT':
      return {
        ...state,
        curl: {
          ...state.curl,
          curlText: action.payload
        }
      };
    
    case 'SET_CURL_REQUEST':
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        curl: {
          ...state.curl,
          request: {
            url: action.payload.url || state.curl.request.url,
            initUrl: action.payload.url || state.curl.request.initUrl,
            headers: action.payload.headers || action.payload.header || state.curl.request.headers || [],
            method: action.payload.method || state.curl.request.method,
            body: action.payload.body || state.curl.request.body || '',
            urlArgs: action.payload.urlArgs || state.curl.request.urlArgs || []
          }
        }
      };
    
    case 'SET_CURL_RESPONSE':
      return {
        ...state,
        curl: {
          ...state.curl,
          response: action.payload
        }
      };
    
    case 'SET_RESPONSE_ERROR':
      return {
        ...state,
        curl: {
          ...state.curl,
          response: {
            ...state.curl.response,
            error: action.payload
          }
        }
      };
    
    case 'SET_REQUEST_BODY':
      return {
        ...state,
        curl: {
          ...state.curl,
          request: {
            ...state.curl.request,
            body: action.payload
          }
        }
      };
    
    case 'SET_REQUEST_CONTENT_TYPE':
      return {
        ...state,
        curl: {
          ...state.curl,
          request: {
            ...state.curl.request,
            contentType: action.payload
          }
        },
        ace: {
          ...state.ace,
          requestBodyContentType: action.payload,
          requestBodyMode: state.ace.supportedLanguage[action.payload.toLowerCase()] || 'ace/mode/text'
        }
      };
    
    case 'REVERT_RESPONSE_TAB_ACTIVE':
      return {
        ...state,
        dom: {
          ...state.dom,
          response: {
            ...state.dom.response,
            activeTabName: 'responseResult'
          }
        }
      };
    
    case 'REVERT_REQUEST_TAB_ACTIVE':
      return {
        ...state,
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            activeTabName: 'requestBody'
          }
        }
      };
    
    case 'SHOW_RESPONSE_TAB':
      return {
        ...state,
        dom: {
          ...state.dom,
          response: {
            ...state.dom.response,
            show: true
          }
        }
      };
    
    case 'INIT_BY_CURL_TEXT':
      return {
        ...state,
        curl: {
          ...state.curl,
          request: {
            url: action.payload.url,
            initUrl: action.payload.url,
            headers: action.payload.headers || [],
            method: action.payload.method,
            body: action.payload.body || '',
            urlArgs: action.payload.urlArgs || []
          },
          // 清空之前的返回内容，模拟未发送状态
          response: {
            httpStatus: '未知',
            consumeTime: -1,
            headers: [],
            body: ''
          }
        },
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            startInit: true,
            activeTabName: 'requestBody'
          },
          response: {
            ...state.dom.response,
            activeTabName: 'responseResult',
            show: false
          }
        }
      };
    
    case 'SEND_REQUEST':
      return {
        ...state,
        dom: {
          ...state.dom,
          loading: true
        }
      };
    
    case 'CANCEL_REQUEST':
      return {
        ...state,
        dom: {
          ...state.dom,
          loading: false,
          response: {
            ...state.dom.response,
            activeTabName: 'responseResult',
            show: true
          }
        }
      };
    
    case 'SET_REQUEST_BODY_EDITOR':
      return {
        ...state,
        ace: {
          ...state.ace,
          requestBodyEditor: action.payload
        }
      };
    
    case 'SET_RESPONSE_BODY_EDITOR':
      return {
        ...state,
        ace: {
          ...state.ace,
          responseBodyEditor: action.payload
        }
      };
    
    case 'SET_REQUEST_BODY_MODE':
      return {
        ...state,
        ace: {
          ...state.ace,
          requestBodyMode: action.payload
        }
      };
    
    case 'SET_RESPONSE_BODY_MODE':
      return {
        ...state,
        ace: {
          ...state.ace,
          responseBodyContentType: action.payload
        }
      };
    
    case 'SET_REQUEST_TAB_NAME':
      return {
        ...state,
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            activeTabName: action.payload
          }
        }
      };
    
    case 'SET_RESPONSE_TAB_NAME':
      return {
        ...state,
        dom: {
          ...state.dom,
          response: {
            ...state.dom.response,
            activeTabName: action.payload
          }
        }
      };
    
    case 'SET_REQUEST_HEADER_TABLE_REF':
      return {
        ...state,
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            requestHeaderTableRef: action.payload
          }
        }
      };
    
    case 'SET_URL_ARGS_TABLE_REF':
      return {
        ...state,
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            urlArgsTableRef: action.payload
          }
        }
      };
    
    case 'SET_SYNC_WITH_URL_TO_ARGS':
      return {
        ...state,
        dom: {
          ...state.dom,
          request: {
            ...state.dom.request,
            syncWithUrlToArgs: action.payload
          }
        }
      };
    
    case 'SET_URL_ARGS':
      return {
        ...state,
        curl: {
          ...state.curl,
          request: {
            ...state.curl.request,
            urlArgs: action.payload
          }
        }
      };
    
    case 'SET_ENVIRONMENTS':
      return {
        ...state,
        environments: action.payload
      };
    
    case 'ADD_ENVIRONMENT':
      return {
        ...state,
        environments: [...state.environments, action.payload]
      };
    
    case 'UPDATE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.map(env => 
          env.id === action.payload.id ? action.payload : env
        )
      };
    
    case 'DELETE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.filter(env => 
          env.id !== action.payload
        ),
        // 如果删除的是当前环境，切换到第一个环境
        currentEnvironmentId: state.currentEnvironmentId === action.payload 
          ? (state.environments.length > 1 ? state.environments.find(env => env.id !== action.payload)?.id : null)
          : state.currentEnvironmentId
      };
    
    case 'SET_CURRENT_ENVIRONMENT':
      return {
        ...state,
        currentEnvironmentId: action.payload
      };
    
    default:
      return state;
  }
}

export default reducer;