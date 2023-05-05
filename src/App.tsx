import "antd/dist/reset.css";
import React, { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "./common/supabase";
import { Session } from "@supabase/supabase-js";
import { ReactSVG } from "react-svg";
import { Spacer } from "./common/styled";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { Layout, Typography } from "antd";
import { Content } from "antd/es/layout/layout";

const { Title } = Typography;

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
    <Layout
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Spacer height={20} />
      <ReactSVG src="logo.svg" style={{ width: 80 }} />
      <Spacer height={12} />
      <Title>House Calc0matic</Title>
      <Content>{!session ? <Auth /> : <Home />}</Content>
    </Layout>
  );
}

export default App;
