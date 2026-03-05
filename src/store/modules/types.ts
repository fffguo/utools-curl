// 类型定义
export interface Header {
  key: string;
  value: string;
  enabled?: boolean;
}

export interface Request {
  url: string;
  initUrl: string;
  method: string;
  headers: Header[];
  body: string;
  contentType?: string;
  urlArgs?: Header[];
}

export interface Response {
  httpStatus: string | number;
  consumeTime: number;
  headers: Header[] | Record<string, string>;
  body: string;
  rawBody?: string;
  rawBodyBuffer?: ArrayBuffer;
  error?: string;
}

export interface Curl {
  curlText: string;
  request: Request;
  response: Response;
}

export interface Ace {
  supportedLanguage: Record<string, string>;
  responseBodyEditor: any;
  requestBodyEditor: any;
  requestBodyContentType: string;
  responseBodyContentType: string;
  requestBodyMode: string;
}

export interface RequestDom {
  startInit: boolean;
  activeTabName: string;
  requestHeaderTableRef: any;
  urlArgsTableRef: any;
  syncWithUrlToArgs: boolean;
}

export interface ResponseDom {
  show: boolean;
  activeTabName: string;
}

export interface Dom {
  loading: boolean;
  request: RequestDom;
  response: ResponseDom;
}

export interface State {
  curl: Curl;
  ace: Ace;
  dom: Dom;
  environments: Environment[];
  currentEnvironmentId: string | null;
}

export type ActionType = 
  | { type: 'SET_CURL_TEXT'; payload: string }
  | { type: 'SET_CURL_REQUEST'; payload: any }
  | { type: 'SET_CURL_RESPONSE'; payload: Response }
  | { type: 'SET_RESPONSE_ERROR'; payload: string }
  | { type: 'SET_REQUEST_BODY'; payload: string }
  | { type: 'SET_REQUEST_CONTENT_TYPE'; payload: string }
  | { type: 'REVERT_RESPONSE_TAB_ACTIVE' }
  | { type: 'REVERT_REQUEST_TAB_ACTIVE' }
  | { type: 'SHOW_RESPONSE_TAB' }
  | { type: 'INIT_BY_CURL_TEXT'; payload: any }
  | { type: 'SEND_REQUEST' }
  | { type: 'CANCEL_REQUEST' }
  | { type: 'SET_REQUEST_BODY_EDITOR'; payload: any }
  | { type: 'SET_RESPONSE_BODY_EDITOR'; payload: any }
  | { type: 'SET_REQUEST_TAB_NAME'; payload: string }
  | { type: 'SET_RESPONSE_TAB_NAME'; payload: string }
  | { type: 'SET_REQUEST_HEADER_TABLE_REF'; payload: any }
  | { type: 'SET_URL_ARGS_TABLE_REF'; payload: any }
  | { type: 'SET_URL_ARGS'; payload: any }
  | { type: 'SET_SYNC_WITH_URL_TO_ARGS'; payload: boolean }
  | { type: 'SET_REQUEST_BODY_MODE'; payload: string }
  | { type: 'SET_RESPONSE_BODY_MODE'; payload: string }
  | { type: 'SET_ENVIRONMENTS'; payload: Environment[] }
  | { type: 'ADD_ENVIRONMENT'; payload: Environment }
  | { type: 'UPDATE_ENVIRONMENT'; payload: Environment }
  | { type: 'DELETE_ENVIRONMENT'; payload: string }
  | { type: 'SET_CURRENT_ENVIRONMENT'; payload: string | null };

export interface StoreContextType {
  state: State;
  dispatch: React.Dispatch<ActionType>;
  sendRequest: (curlArgs: any) => void;
  cancelRequest: () => void;
  getRealTimeHeaders: () => Record<string, string>;
  getRealTimeBody: () => string;
  // 环境管理方法
  addEnvironment: (env: Omit<Environment, 'id'>) => void;
  updateEnvironment: (env: Environment) => void;
  deleteEnvironment: (envId: string) => void;
  setCurrentEnvironment: (envId: string | null) => void;
  loadEnvironments: () => Promise<void>;
  saveEnvironments: () => Promise<void>;
}

// 环境变量接口
export interface EnvironmentVariable {
  name: string;
  value: string;
  description?: string;
}

// 环境接口
export interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  variables: EnvironmentVariable[];
  isDefault?: boolean;
  isBuiltIn?: boolean;
}

export interface StoreProviderProps {
  children: React.ReactNode;
}