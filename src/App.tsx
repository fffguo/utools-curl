import './App.css';
import CurlTool from './components/CurlTool';
import { StoreProvider } from './store';

/**
 * 应用入口组件
 * 提供 StoreProvider 包裹整个应用，确保所有组件都能访问状态管理
 */
function App() {
  return (
    <StoreProvider>
      <div className="App" style={{ border: 'none' }}>
        <CurlTool />
      </div>
    </StoreProvider>
  );
}

export default App;