import React, { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "./common/supabase";
import { Session } from "@supabase/supabase-js";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageLayout,
} from "./components/styled/layout";
import { Header1 } from "./components/styled/styled";
import { ReactSVG } from "react-svg";

import cityArtSvg from "./assets/city_art.svg";
import { MyTheme } from "./components/styled/theme";

function App() {
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
      <PageHeader>
        <div style={{ width: "28px" }}>
          <ReactSVG src="logo.svg" />
        </div>
        <Header1>Property Evalu8R</Header1>
      </PageHeader>

      <PageContent style={{ backgroundImage: `url(${cityArtSvg})` }}>
        {!session ? (
          <Auth />
        ) : (
          <Home
            signOut={supabase.auth.signOut}
            authedUserId={session.user.id}
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
