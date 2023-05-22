import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Project,
  Property,
  SelectInputOption,
  UserProfile,
} from "../../types/types";
import { checkPropertyCompleteInfo } from "../../common/propertyUtils";
import moment from "moment";
import { PropertyCard } from "./PropertyCard";
import SortingFilters, { SortByEnum } from "./SortingFilters";
import { Empty, Spin } from "antd";
import { useMediaSize } from "../../common/useMediaSize";
import { MessageInstance } from "antd/es/message/interface";
import { MyModal } from "../styled/Modal";
import { ResponsiveDrawer } from "../styled/Drawer";
import UpdateNotes from "../../forms/UpdateNotes";
import UpdateProperty from "../../forms/property/UpdateProperty";
import AddNewProperty from "../../forms/property/AddNewProperty";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { FlexRow, MySpacer } from "../styled/layout";
import { MyTheme } from "../styled/theme";
import { PlusOutlined } from "@ant-design/icons";
import { usePropertiesStore } from "../../common/stores/propertiesStore";

interface PropertyListProps {
  activeProject: Project;
  authedUserProfile: UserProfile;
  messageApi: MessageInstance;
}

/// Constants
const STANDARD_SHOW_TYPES = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "awaitingInfo", label: "Awaiting Info" },
  { value: "viewingBooked", label: "Viewing Booked" },
  { value: "offerMade", label: "Offer Made" },
];
const SHOW_USER_LIKES_PREFIX_STRING = "Liked by ";

export function PropertyList({
  activeProject,
  authedUserProfile,
  messageApi,
}: PropertyListProps) {
  const {
    api,
    properties,
    propertyScores,
    likesByProperty,
    noteCountByProperty,
    isLoading,
  } = usePropertiesStore();
  const deviceSize = useMediaSize();

  // ChakraUI modal hook.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Sort, search and filter
  const [searchText, setSearchText] = useState<string>("");
  // User can filter by property data status or by other project member likes. The likes are formed programatically and added to this list.

  const [showTypeOptions, setShowTypeOptions] =
    useState<SelectInputOption[]>(STANDARD_SHOW_TYPES);
  const [showTypeValue, setShowTypeValue] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortByEnum>("recentlyAdded");

  // Panel control state
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

  // Get new property data whenever active property changes
  const { getInitialProjectData } = api;
  useEffect(() => {
    getInitialProjectData(activeProject.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject.id]);

  /// Whenever [likesByProperty] is updated re-run and update the show type filters (with the correct options for seeing project member likes)
  useEffect(() => {
    const projectMembersWithLikes = Object.values(likesByProperty).reduce<
      UserProfile[]
    >((acum, next) => {
      const uniqueUserProfiles = next.filter((up) =>
        acum.every((u) => up.id !== u.id)
      );
      return [...acum, ...uniqueUserProfiles];
    }, []);

    setShowTypeOptions(
      STANDARD_SHOW_TYPES.concat(
        projectMembersWithLikes.map((m) => ({
          label: `${SHOW_USER_LIKES_PREFIX_STRING}${m.username}`,
          value: m.id,
        }))
      )
    );
  }, [likesByProperty]);

  /// Update Property
  const handleOpenUpdateProperty = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenUpdatePanel(true);
  };

  /// Update Notes
  const handleOpenUpdateNotes = (p: Property) => {
    setPropertyToUpdate(p);
    setOpenNotesPanel(true);
  };

  /// Like / Unlike
  const handleAddPropertyLike = async (propertyId: number) => {
    await api.addPropertyLike(propertyId);
  };

  const handleRemovePropertyLike = async (propertyId: number) => {
    await api.removePropertyLike(propertyId);
  };

  /// Delete Property
  const handleRequestDeleteProperty = (data: Property) => {
    setPropertyToBeDeleted(data);
    onOpen();
  };

  const handleConfirmDeleteProperty = async () => {
    if (propertyToBeDeleted) {
      await api.deleteProperty(propertyToBeDeleted.id);
      setPropertyToBeDeleted(null);
      onClose();
    }
  };

  const handleCancelDeleteProperty = () => {
    setPropertyToBeDeleted(null);
    onClose();
  };

  /// Search and sorting methods. Run text search first as this is likely to exclude the most.
  const textSearchFilterProperties = (properties: Property[]) =>
    properties.filter((p) =>
      p.listing_title?.toLowerCase().includes(searchText.toLowerCase())
    );

  const filterPropertiesByCategoryOrLikes = (properties: Property[]) =>
    showTypeValue === "completed"
      ? checkPropertyCompleteInfo(properties).completed
      : showTypeValue === "awaitingInfo"
      ? checkPropertyCompleteInfo(properties).awaitingInfo
      : showTypeValue === "viewingBooked"
      ? properties.filter((p) => p.view_date)
      : showTypeValue === "offerMade"
      ? properties.filter((p) => p.offered)
      : showTypeValue.length === 36 // Users UID length in characters
      ? properties.filter((p) =>
          likesByProperty[p.id].some((u) => u.id === showTypeValue)
        )
      : properties;

  const sortProperties = (properties: Property[]) =>
    properties.sort((a, b) => {
      if (sortBy === "highestScore") {
        return propertyScores[b.id].score - propertyScores[a.id].score;
      } else if (sortBy === "lowestCost") {
        return propertyScores[a.id].cost - propertyScores[b.id].cost;
      } else if (sortBy === "highestPoints") {
        return propertyScores[b.id].points - propertyScores[a.id].points;
      } else if (sortBy === "sqrMtrCost") {
        // Abitrarily high number to ensure incomplete entries go to the bottom.
        const ac = propertyScores[a.id].sqMtrCost;
        const bc = propertyScores[b.id].sqMtrCost;
        return !bc ? -1 : !ac ? 1 : ac - bc;
      } else {
        const da = moment(a.created_at.toString());
        const db = moment(b.created_at.toString());
        return db.diff(da);
      }
    });

  const filteredSortedProperties = sortProperties(
    filterPropertiesByCategoryOrLikes(textSearchFilterProperties(properties))
  );

  if (isLoading) {
    return <Spin size="small" />;
  }

  return (
    <PropertyListContainer>
      <div
        style={{
          color: MyTheme.colors.primary,
          fontSize: "0.8em",
          paddingBottom: "8px",
        }}
      >
        Showing {filteredSortedProperties.length} properties
      </div>
      {deviceSize !== "large" && (
        <AddPropertyButton setOpenAddPanel={setOpenAddPanel} />
      )}

      <FlexRow alignItems="center">
        <SortingFilters
          searchText={searchText}
          setSearchText={setSearchText}
          showType={showTypeValue}
          setShowType={setShowTypeValue}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showTypeOptions={showTypeOptions}
        />
        {deviceSize === "large" && (
          <AddPropertyButton setOpenAddPanel={setOpenAddPanel} />
        )}
      </FlexRow>

      {filteredSortedProperties.length > 0 ? (
        filteredSortedProperties.map((p) => (
          <div key={p.id} style={{ marginBottom: "8px" }}>
            <PropertyCard
              key={p.id}
              property={p}
              propertyScore={propertyScores[p.id]}
              openUpdateProperty={() => handleOpenUpdateProperty(p)}
              handleRequestDeleteProperty={handleRequestDeleteProperty}
              handleRequestNoteUpdate={() => handleOpenUpdateNotes(p)}
              likes={likesByProperty[p.id]}
              noteCount={noteCountByProperty[p.id]}
              authedUserId={authedUserProfile.id}
              handleAddPropertyLike={handleAddPropertyLike}
              handleRemovePropertyLike={handleRemovePropertyLike}
            />
          </div>
        ))
      ) : (
        <Empty
          description={
            <span style={{ color: MyTheme.colors.primary }}>
              No properties to display...
            </span>
          }
        />
      )}

      <ResponsiveDrawer
        closable={false}
        maskClosable={false}
        onClose={() => setOpenAddPanel(false)}
        open={openAddPanel}
        drawerKey="Add"
      >
        {openAddPanel && (
          <AddNewProperty
            onComplete={() => setOpenAddPanel(false)}
            messageApi={messageApi}
            activeProjectId={activeProject.id}
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
            key={Date.now()}
            property={propertyToUpdate}
            closeDrawer={() => setOpenUpdatePanel(false)}
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
            authedUserId={authedUserProfile.id}
          />
        )}
      </ResponsiveDrawer>

      <MyModal
        onConfirm={handleConfirmDeleteProperty}
        onCancel={handleCancelDeleteProperty}
        onClose={onClose}
        title="Delete this property?"
        message="This cannot be undone!"
        isOpen={isOpen}
        icon={<WarningTwoIcon color="red" />}
      />
    </PropertyListContainer>
  );
}

const PropertyListContainer = styled.div`
  max-width: 95vw;
  flex-direction: column;
  display: flex;
  align-items: center;
`;

const AddPropertyButtonContainer = styled.button`
  display: flex;
  align-items: center;
  height: 35px;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${MyTheme.colors.primary};
  color: ${MyTheme.colors.secondary};
  font-weight: bold;
  text-align: center;
  font-size: 0.9em;
  text-decoration: none;
  outline: none;
  border: none;
  transition: all 350ms ease;
  :hover {
    cursor: pointer;
    background-color: ${MyTheme.colors.linkText};
    color: ${MyTheme.colors.primary};
  }
  :disabled {
    opacity: 0.1;
  }
`;

const AddPropertyButton = ({
  setOpenAddPanel,
}: {
  setOpenAddPanel: (v: boolean) => void;
}) => (
  <AddPropertyButtonContainer onClick={() => setOpenAddPanel(true)}>
    <PlusOutlined />
    <MySpacer width={4} />
    Add Property
  </AddPropertyButtonContainer>
);
