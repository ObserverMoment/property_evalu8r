import {
  Badge,
  Button,
  Drawer,
  Empty,
  Modal,
  Space,
  Tabs,
  Typography,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Property } from "../types/types";
import {
  SupabaseContext,
  deleteProperty,
  getProperties,
} from "../common/supabase";
import { PropertyList } from "../components/propertyList";
import AddNewProperty from "../forms/AddNewProperty";
import { mapReplaceArray } from "../common/utils";
import UpdateProperty from "../forms/UpdateProperty";
import { checkPropertyCompleteInfo } from "../common/propertyUtils";
import Paragraph from "antd/es/typography/Paragraph";
import { showMessage } from "../common/notifications";

const { Text, Title } = Typography;

function Home() {
  const supabase = useContext(SupabaseContext);
  const [messageApi, contextHolder] = message.useMessage();

  /// Panels
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [openUpdatePanel, setOpenUpdatePanel] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<Property | null>(
    null
  );
  const [openAdjustPanel, setOpenAdjustPanel] = useState(false);

  /// Delete
  const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [propertyToBeDeleted, setPropertyToBeDeleted] =
    useState<Property | null>(null);

  /// Property Data
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties()
      .then((res) => {
        setProperties(res.data!);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const handleCloseAddProperty = (data: Property | undefined) => {
    if (data) {
      setProperties([data, ...properties]);
    }
    setOpenAddPanel(false);
  };

  const handleOpenUpdateProperty = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenUpdatePanel(true);
  };

  const handleCloseUpdateProperty = (data: Property | undefined) => {
    if (data) {
      setProperties(mapReplaceArray({ modified: data, previous: properties }));
    }
    setOpenUpdatePanel(false);
    setPropertyToUpdate(null);
  };

  const handleRequestDeleteProperty = (data: Property) => {
    setPropertyToBeDeleted(data);
    setDeleteConfirmModalOpen(true);
  };

  const handleDeleteProperty = async () => {
    if (propertyToBeDeleted) {
      const { error } = await deleteProperty(propertyToBeDeleted);
      if (error) {
        showMessage({
          content: "Something went wrong...",
          messageApi: messageApi,
          type: "error",
        });
      } else {
        showMessage({
          content: "Property deleted.",
          messageApi: messageApi,
          type: "success",
        });
        setProperties(
          properties.filter((p) => p.id !== propertyToBeDeleted.id)
        );
      }
    }
    setPropertyToBeDeleted(null);
    setDeleteConfirmModalOpen(false);
  };

  const handleCancelDeleteProperty = () => {
    setPropertyToBeDeleted(null);
    setDeleteConfirmModalOpen(false);
  };

  // Properties that do not have full info cannot be put through the score calculating algo.
  // If any fields are missing then property is classed as [awaitingInfo]
  const { completed, awaitingInfo } = checkPropertyCompleteInfo(properties);

  return (
    <Space direction="vertical" size={12} align="center">
      {contextHolder}
      <Title level={4}>A Rich & Jue Property Co.</Title>
      <Text>{properties.length} saved properties</Text>
      <Space direction="horizontal" size={16}>
        <Button onClick={() => setOpenAdjustPanel(true)}>
          Adjust Algorithmn
        </Button>
        <Button onClick={() => setOpenAddPanel(true)}>Add Property</Button>
        <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
      </Space>

      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            key: "1",
            label: (
              <TabLabelWithCount title="Completed" count={completed.length} />
            ),
            children: completed.length ? (
              <PropertyList
                key="completed"
                properties={completed}
                openUpdateProperty={handleOpenUpdateProperty}
                handleRequestDeleteProperty={handleRequestDeleteProperty}
              />
            ) : (
              <Empty description="No completed properties yet..." />
            ),
          },
          {
            key: "2",
            label: (
              <TabLabelWithCount
                title="Awaiting Info"
                count={awaitingInfo.length}
              />
            ),
            children: awaitingInfo.length ? (
              <PropertyList
                key="awaitingInfo"
                properties={awaitingInfo}
                openUpdateProperty={handleOpenUpdateProperty}
                handleRequestDeleteProperty={handleRequestDeleteProperty}
              />
            ) : (
              <Empty description="No completed properties yet..." />
            ),
          },
        ]}
      />

      <Drawer
        placement="right"
        closable={false}
        maskClosable={false}
        onClose={() => setOpenAddPanel(false)}
        open={openAddPanel}
        key="Add"
      >
        <AddNewProperty
          closeDrawer={handleCloseAddProperty}
          messageApi={messageApi}
        />
      </Drawer>
      <Drawer
        placement="right"
        closable={false}
        maskClosable={false}
        onClose={() => setOpenUpdatePanel(false)}
        open={openUpdatePanel}
        key="Update"
      >
        {propertyToUpdate && (
          <UpdateProperty
            property={propertyToUpdate}
            closeDrawer={handleCloseUpdateProperty}
            messageApi={messageApi}
          />
        )}
      </Drawer>
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

      <Modal
        title="Delete this property?"
        open={isDeleteConfirmModalOpen}
        onOk={handleDeleteProperty}
        onCancel={handleCancelDeleteProperty}
      >
        <Paragraph>This cannot be undone!</Paragraph>
      </Modal>
    </Space>
  );
}

const TabLabelWithCount = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => (
  <Badge
    showZero
    offset={[6, -5]}
    size="small"
    count={count}
    style={{ backgroundColor: "#000000" }}
  >
    <div>{title}</div>
  </Badge>
);

export default Home;
