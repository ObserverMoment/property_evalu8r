import React, { useEffect, useState } from "react";
import { Property } from "../types/types";
import {
  addFavourite,
  deleteProperty,
  getFavourites,
  getProperties,
  removeFavourite,
} from "../common/supabase";
import { PropertyList } from "../components/propertyList/PropertyList";
import AddNewProperty from "../forms/AddNewProperty";
import { mapReplaceArray } from "../common/utils";
import UpdateProperty from "../forms/UpdateProperty";
import { showErrorMessage, showMessage } from "../common/notifications";
import { HomeContent, MySpacer, PageHeader } from "../components/styled/layout";
import {
  LogoTitle,
  PrimaryButton,
  SecondaryButton,
} from "../components/styled/styled";
import styled from "@emotion/styled";
import { useDisclosure } from "@chakra-ui/react";
import { message } from "antd";
import { MyModal } from "../components/styled/modal";
import { WarningTwoIcon } from "@chakra-ui/icons";
import UpdateNotes from "../forms/UpdateNotes";
import { DEVICES } from "../components/styled/theme";
import { ResponsiveDrawer } from "../components/styled/drawer";

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

  /// Property Data
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  // Array of property IDs.
  const [favourites, setFavourites] = useState<number[]>([]);

  /// Panel state.
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [openUpdatePanel, setOpenUpdatePanel] = useState(false);
  const [openNotesPanel, setOpenNotesPanel] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<Property | null>(
    null
  );

  /// Delete
  const [propertyToBeDeleted, setPropertyToBeDeleted] =
    useState<Property | null>(null);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const { data: properties } = await getProperties();
        const { data: favourites } = await getFavourites();
        setAllProperties(properties!);
        setFavourites(favourites!.map((f) => f.property_id));
      } catch (e: any) {
        messageApi.error("Something went wrong...");
        console.log(e.toString());
      }
    };
    getInitialData();
  }, [messageApi]);

  /// Create New Property
  const handleSaveProperty = (data: Property | undefined) => {
    if (data) {
      setAllProperties([data, ...allProperties]);
    }
    setOpenAddPanel(false);
  };

  /// Update Property
  const handleOpenUpdateProperty = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenUpdatePanel(true);
  };

  const handleCloseUpdateProperty = (data: Property | undefined) => {
    setPropertyToUpdate(null);
    setOpenUpdatePanel(false);
    if (data) {
      setAllProperties(
        mapReplaceArray({ modified: data, previous: allProperties })
      );
    }
  };

  /// Update Notes
  const handleOpenUpdateNotes = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenNotesPanel(true);
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
        showErrorMessage({
          messageApi: messageApi,
        });
      } else {
        showMessage({
          content: "Property deleted.",
          messageApi: messageApi,
          type: "success",
        });
        setAllProperties(
          allProperties.filter((p) => p.id !== propertyToBeDeleted.id)
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

  const handleAddFavourite = async (propertyId: number) => {
    const { error } = await addFavourite(propertyId);
    if (error) {
      showErrorMessage({
        messageApi: messageApi,
      });
    } else {
      setFavourites([...favourites, propertyId]);
    }
  };

  const handleRemoveFavourite = async (propertyId: number) => {
    const { error } = await removeFavourite(propertyId);
    if (error) {
      showMessage({
        content: "Something went wrong...",
        messageApi: messageApi,
        type: "error",
      });
    } else {
      setFavourites(favourites.filter((f) => f !== propertyId));
    }
  };

  return (
    <HomeContent>
      {contextHolder}
      <PageHeader>
        <LogoTitle />
        <ButtonsContainer>
          <PrimaryButton onClick={() => setOpenAddPanel(true)}>
            Add Property
          </PrimaryButton>
          <MySpacer width={16} />
          <SecondaryButton onClick={signOut}>Sign Out</SecondaryButton>
        </ButtonsContainer>
      </PageHeader>

      <PropertyList
        properties={allProperties}
        openUpdateProperty={handleOpenUpdateProperty}
        handleRequestDeleteProperty={handleRequestDeleteProperty}
        handleRequestNoteUpdate={handleOpenUpdateNotes}
        favourites={favourites}
        handleAddFavourite={handleAddFavourite}
        handleRemoveFavourite={handleRemoveFavourite}
        authedUserId={authedUserId}
      />

      <ResponsiveDrawer
        closable={false}
        maskClosable={false}
        onClose={() => setOpenAddPanel(false)}
        open={openAddPanel}
        drawerKey="Add"
      >
        {openAddPanel && (
          <AddNewProperty
            onSaveProperty={handleSaveProperty}
            onCancel={() => setOpenAddPanel(false)}
            messageApi={messageApi}
          />
        )}
      </ResponsiveDrawer>

      <ResponsiveDrawer
        closable={false}
        maskClosable={false}
        onClose={() => setOpenUpdatePanel(false)}
        open={openUpdatePanel}
        drawerKey="Update"
      >
        {propertyToUpdate && (
          <UpdateProperty
            key={propertyToUpdate.id}
            property={propertyToUpdate}
            closeDrawer={handleCloseUpdateProperty}
            messageApi={messageApi}
          />
        )}
      </ResponsiveDrawer>

      <ResponsiveDrawer
        closable={true}
        maskClosable={true}
        onClose={() => setOpenNotesPanel(false)}
        open={openNotesPanel}
        drawerKey="Note"
      >
        {propertyToUpdate && (
          <UpdateNotes
            property={propertyToUpdate}
            messageApi={messageApi}
            authedUserId={authedUserId}
          />
        )}
      </ResponsiveDrawer>

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
  padding: 8px;
  display: flex;
  justify-items: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  @media ${DEVICES.tablet} {
    padding: 0;
  }
`;

export default Home;
