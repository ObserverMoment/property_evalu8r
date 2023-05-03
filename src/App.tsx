import "./App.css";
import { Button, Drawer } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "./common/supabase";
import { PropertyList } from "./propertyList";
import { Space } from "antd";
import { SupabaseClient } from "@supabase/supabase-js";
import { CreateProperty, Property } from "./types/types";
import { Database } from "./types/database.types";
import { ReactSVG } from "react-svg";
import AddNewProperty from "./forms/AddNewProperty";
import { Spacer } from "./common/styled";

async function getProperties(
  supabaseClient: SupabaseClient<Database>
): Promise<Property[]> {
  const { data, error } = await supabaseClient.from("houses").select();
  if (error) {
    throw new Error("Data coud not be fetched!");
  } else {
    // Remove ID, url_link and created_at
    const remove = ["id", "created_at"];

    return (data as Property[]).map((p) =>
      Object.entries(p)
        .filter(([k]) => !remove.includes(k))
        .reduce((acum, [k, v]) => {
          acum[k] = v;
          return acum;
        }, {} as Property)
    );
  }
}

function App() {
  const supabase = useContext(SupabaseContext);
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [openAdjustPanel, setOpenAdjustPanel] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties(supabase)
      .then((res) => {
        setProperties(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [supabase]);

  const onSave = (data: CreateProperty) => {
    console.log(data);
    setOpenAddPanel(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Spacer height={16} />
        <ReactSVG src="logo.svg" style={{ width: 100 }} />
        <h1>House Calc0matic</h1>
        <Space direction="vertical" size={12}>
          <div>Billy Big Bobs Property Co.</div>
          <div>{properties.length} properties</div>
          <Space direction="horizontal" size={16}>
            <Button onClick={() => setOpenAdjustPanel(true)}>
              Adjust Algorithmn
            </Button>
            <Button onClick={() => setOpenAddPanel(true)}>Add Property</Button>
          </Space>

          {properties.length > 0 && <PropertyList properties={properties} />}

          <Drawer
            placement="right"
            closable={false}
            maskClosable={false}
            onClose={() => setOpenAddPanel(false)}
            open={openAddPanel}
            key="Add"
          >
            <AddNewProperty closeDrawer={() => setOpenAddPanel(false)} />
          </Drawer>
          <Drawer
            title="Edit Property"
            placement="bottom"
            closable={false}
            maskClosable={false}
            onClose={() => setOpenEditPanel(false)}
            open={openEditPanel}
            key="Edit"
            extra={
              <Space>
                <Button onClick={() => console.log("cancel")}>Cancel</Button>
                <Button onClick={() => console.log("save")} type="primary">
                  Submit
                </Button>
              </Space>
            }
          ></Drawer>
          <Drawer
            title="Adjust Algorithm"
            placement="right"
            closable={false}
            onClose={() => setOpenAdjustPanel(false)}
            open={openAdjustPanel}
            key="Adjust"
          >
            <div>Coming soon...</div>
          </Drawer>
        </Space>
      </header>
    </div>
  );
}

export default App;
