import React, { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "./common/supabase";
import { Session } from "@supabase/supabase-js";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import {
  PageContent,
  PageFooter,
  PageLayout,
} from "./components/styled/layout";

import cityArtSvg from "./assets/city_art.svg";
import { MyTheme } from "./components/styled/theme";
import { message } from "antd";

function App() {
  // Ant Design message hook.
  const [messageApi, contextHolder] = message.useMessage();
  const supabase = useContext(SupabaseContext);

  // For auth.
  const [session, setSession] = useState<Session | undefined | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [supabase.auth]);

  return (
    <PageLayout>
      {contextHolder}
      <PageContent style={{ backgroundImage: `url(${cityArtSvg})` }}>
        {!session ? (
          <Auth messageApi={messageApi} />
        ) : (
          <Home
            signOut={() => supabase.auth.signOut()}
            messageApi={messageApi}
          />
        )}
      </PageContent>

      <PageFooter
        style={{
          fontSize: "0.8em",
          padding: "10px",
          background: MyTheme.colors.footer,
        }}
      >
        A Quarksoup Technology. Built by RB in 2023 for the Rich & Jue Property
        Co.
      </PageFooter>
    </PageLayout>
  );
}

export default App;
