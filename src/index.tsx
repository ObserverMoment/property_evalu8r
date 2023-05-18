import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SupabaseProvider } from "./common/supabase";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "./fonts/Kanit/Kanit-Medium.ttf";
import { ConfigProvider } from "antd";
import { MyTheme } from "./components/styled/theme";
import { MediaSizeProvider } from "./common/useMediaSize";

const theme = extendTheme({
  /// TODO
});

const root = createRoot(document.getElementById("root")!);

/// ConfigProvider for ant design form components
root.render(
  <React.StrictMode>
    <MediaSizeProvider>
      <ChakraBaseProvider theme={theme}>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 8,
              colorBgBase: MyTheme.colors.background,
              colorPrimary: MyTheme.colors.primary,
              colorText: MyTheme.colors.text,
              colorTextPlaceholder: MyTheme.colors.border,
              colorBorder: "none",
            },
            components: {
              Input: {
                colorBgContainer: MyTheme.colors.primary,
              },
              InputNumber: {
                colorBgContainer: MyTheme.colors.primary,
              },
              Select: {
                colorBgContainer: MyTheme.colors.primary,
              },
              Radio: {
                colorBgContainer: MyTheme.colors.background,
              },
            },
          }}
        >
          <SupabaseProvider>
            <App />
          </SupabaseProvider>
        </ConfigProvider>
      </ChakraBaseProvider>
    </MediaSizeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
