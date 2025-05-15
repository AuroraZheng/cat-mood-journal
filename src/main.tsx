// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home';  // 导入 Home 组件

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />  {/* 渲染 Home 组件 */}
  </StrictMode>,
);

