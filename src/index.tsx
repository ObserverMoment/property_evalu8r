import * as React from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SupabaseProvider } from "./common/supabase";
import { ConfigProvider } from "antd";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#a911a9",
          borderRadius: 30,
          colorBgBase: "#e1e9f5",
          colorText: "#521e3a",
        },
      }}
    >
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
