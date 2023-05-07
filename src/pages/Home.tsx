import React, { useEffect, useState } from "react";
import { Property } from "../types/types";
import { deleteProperty, getProperties } from "../common/supabase";
import {
  PropertyList,
  SortByEnum,
} from "../components/propertyList/PropertyList";
import AddNewProperty from "../forms/AddNewProperty";
import { mapReplaceArray } from "../common/utils";
import UpdateProperty from "../forms/UpdateProperty";
import { checkPropertyCompleteInfo } from "../common/propertyUtils";
import { showMessage } from "../common/notifications";
import { HomeContent, MySpacer } from "../components/styled/layout";
import { PrimaryButton, SecondaryButton } from "../components/styled/styled";
import styled from "@emotion/styled";
import {
  Badge,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { Drawer, Empty, Select, message } from "antd";
import { MyTheme } from "../components/styled/theme";
import { MyModal } from "../components/styled/modal";
import { WarningTwoIcon } from "@chakra-ui/icons";
import UpdateNotes from "../forms/UpdateNotes";

function Home({
  signOut,
  authedUserId,
}: {
  signOut: () => void;
  authedUserId: string;
}) {
  // ChakraUI modal hook.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Ant Design message hook.
  const [messageApi, contextHolder] = message.useMessage();

  const [sortBy, setSortBy] = useState<SortByEnum>("highestScore");

  /// Panels
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [openUpdatePanel, setOpenUpdatePanel] = useState(false);
  const [openNotesPanel, setOpenNotesPanel] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<Property | null>(
    null
  );
  const [openAdjustPanel, setOpenAdjustPanel] = useState(false);

  /// Delete
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

  /// Create New Property
  const handleSaveProperty = (data: Property | undefined) => {
    if (data) {
      setProperties([data, ...properties]);
    }
    setOpenAddPanel(false);
  };

  /// Update Property
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

  /// Update Notes
  const handleOpenUpdateNotes = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenNotesPanel(true);
  };

  const handleCloseNotes = (data: Property | undefined) => {
    if (data) {
      setProperties(mapReplaceArray({ modified: data, previous: properties }));
    }
    setOpenNotesPanel(false);
    setPropertyToUpdate(null);
  };

  /// Delete Property
  const handleRequestDeleteProperty = (data: Property) => {
    setPropertyToBeDeleted(data);
    onOpen();
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
    onClose();
  };

  const handleCancelDeleteProperty = () => {
    setPropertyToBeDeleted(null);
    onClose();
  };

  // Properties that do not have full info cannot be put through the score calculating algo.
  // If any fields are missing then property is classed as [awaitingInfo]
  const { completed, awaitingInfo } = checkPropertyCompleteInfo(properties);

  return (
    <HomeContent>
      {contextHolder}
      <ButtonsContainer>
        <PrimaryButton onClick={() => setOpenAddPanel(true)}>
          Add Property
        </PrimaryButton>

        <MySpacer width={20} />

        <PrimaryButton onClick={() => setOpenAdjustPanel(true)}>
          Adjust Algorithmn
        </PrimaryButton>

        <MySpacer width={20} />

        <SecondaryButton onClick={signOut}>Sign Out</SecondaryButton>
      </ButtonsContainer>

      <Tabs variant="enclosed" defaultIndex={0} align="center">
        <TabList>
          <Tab
            _selected={{
              background: MyTheme.colors.secondary,
            }}
          >
            Completed
            <Badge position="relative" top={-2} right={-1} fontSize="0.6em">
              {completed.length}
            </Badge>
          </Tab>
          <Tab
            _selected={{
              background: MyTheme.colors.secondary,
            }}
          >
            Awaiting Info
            <Badge position="relative" top={-2} right={-1} fontSize="0.6em">
              {awaitingInfo.length}
            </Badge>
          </Tab>

          <Select
            defaultValue="dateAdded"
            style={{ width: 180, position: "absolute", right: 100 }}
            onChange={setSortBy}
            options={[
              { value: "highestScore", label: "Highest Score" },
              { value: "highestPoints", label: "Highest Points" },
              { value: "lowestCost", label: "Lowest Cost" },
              { value: "dateAdded", label: "Latest Added" },
            ]}
          />
        </TabList>

        <TabPanels>
          <TabPanel>
            {completed.length ? (
              <PropertyList
                key="completed"
                sortBy={sortBy}
                properties={completed}
                openUpdateProperty={handleOpenUpdateProperty}
                handleRequestDeleteProperty={handleRequestDeleteProperty}
                handleRequestNoteUpdate={handleOpenUpdateNotes}
                authedUserId={authedUserId}
              />
            ) : (
              <Empty description="No completed properties yet..." />
            )}
          </TabPanel>
          <TabPanel>
            {awaitingInfo.length ? (
              <PropertyList
                key="awaitingInfo"
                sortBy={sortBy}
                properties={awaitingInfo}
                openUpdateProperty={handleOpenUpdateProperty}
                handleRequestDeleteProperty={handleRequestDeleteProperty}
                handleRequestNoteUpdate={handleOpenUpdateNotes}
                authedUserId={authedUserId}
              />
            ) : (
              <Empty description="No completed properties yet..." />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Drawer
        placement="right"
        closable={false}
        maskClosable={false}
        onClose={() => setOpenAddPanel(false)}
        open={openAddPanel}
        key="Add"
      >
        {openAddPanel && (
          <AddNewProperty
            onSaveProperty={handleSaveProperty}
            onCancel={() => setOpenAddPanel(false)}
            messageApi={messageApi}
          />
        )}
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
        placement="right"
        closable={false}
        maskClosable={false}
        onClose={() => setOpenNotesPanel(false)}
        open={openNotesPanel}
        key="Note"
      >
        {propertyToUpdate && (
          <UpdateNotes
            property={propertyToUpdate}
            closeDrawer={handleCloseNotes}
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

      <MyModal
        onConfirm={handleDeleteProperty}
        onCancel={handleCancelDeleteProperty}
        onClose={onClose}
        title="Delete this property?"
        message="This cannot be undone!"
        isOpen={isOpen}
        icon={<WarningTwoIcon color="red" />}
      />
    </HomeContent>
  );
}

const ButtonsContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  padding: 0 0 16px 0;
  flex-wrap: wrap;
  flex-direction: row;
`;

export default Home;
