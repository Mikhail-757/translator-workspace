import React from 'react';
import ReactDOM from 'react-dom/client';
import { App, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { WorkspaceProvider } from './app/store';
import 'antd/dist/reset.css';
import './app/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#24695b',
          colorInfo: '#24695b',
          colorText: '#25352f',
          colorTextSecondary: '#7b8580',
          colorBorder: '#e0e6e1',
          colorBgLayout: '#f7f9f7',
          borderRadius: 8,
          fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
          controlHeight: 40,
        },
        components: {
          Button: { primaryShadow: 'none' },
          Table: { headerBg: '#f9faf8', headerColor: '#7b8580', cellPaddingBlock: 19 },
          Menu: { itemSelectedBg: '#eaf1e9' },
        },
      }}
    >
      <App>
        <WorkspaceProvider>
          <RouterProvider router={router} />
        </WorkspaceProvider>
      </App>
    </ConfigProvider>
  </React.StrictMode>,
);
