import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  LikesByProperty,
  NoteCountByProperty,
  Project,
  Property,
  UserLikesInProperty,
  UserNotesCountInProperty,
  UserProfile,
} from "../../types/types";
import {
  calculateAllPropertyScores,
  checkPropertyCompleteInfo,
} from "../../common/propertyUtils";
import moment from "moment";
import { PropertyCard } from "./PropertyCard";
import SortingFilters, { ShowTypeEnum, SortByEnum } from "./SortingFilters";
import { Empty, Spin } from "antd";
import {
  addPropertyLike,
  deleteProperty,
  deletePropertyLike,
  getProjectLikes,
  getProjectPropertyData,
} from "../../common/supabase";
import { useMediaSize } from "../../common/useMediaSize";
import { MessageInstance } from "antd/es/message/interface";
import { mapReplaceArray } from "../../common/utils";
import { MyModal } from "../styled/Modal";
import { ResponsiveDrawer } from "../styled/Drawer";
import UpdateNotes from "../../forms/UpdateNotes";
import UpdateProperty from "../../forms/property/UpdateProperty";
import AddNewProperty from "../../forms/property/AddNewProperty";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { showErrorMessage, showMessage } from "../../common/notifications";
import { FlexRow, MySpacer } from "../styled/layout";
import { MyTheme } from "../styled/theme";
import { PlusOutlined } from "@ant-design/icons";

interface PropertyListProps {
  activeProject: Project;
  authedUserProfile: UserProfile;
  messageApi: MessageInstance;
}

export function PropertyList({
  activeProject,
  authedUserProfile,
  messageApi,
}: PropertyListProps) {
  const deviceSize = useMediaSize();

  // ChakraUI modal hook.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Core property data
  /// Property Data
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [projectProperties, setProjectProperties] = useState<Property[]>([]);
  /// Object indexed by property ID which contains user profiles of users who have liked / disliked the property.
  const [likesByProperty, setLikesByProperty] = useState<LikesByProperty>({});
  const [notesCountByProperty, setNotesCountByProperty] =
    useState<NoteCountByProperty>({});

  // Sort, search and filter
  const [searchText, setSearchText] = useState<string>("");
  const [showType, setShowType] = useState<ShowTypeEnum>("all");
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
  useEffect(() => {
    const getInitialData = async () => {
      setLoadingProperties(true);
      try {
        const { data: projectProperties, error: propertiesError } =
          await getProjectPropertyData(activeProject.id);

        const { data: projectLikesNotes, error: projectLikesNotesError } =
          await getProjectLikes(activeProject.id);

        if (propertiesError || projectLikesNotesError) {
          console.error(propertiesError);
          console.error(projectLikesNotesError);
          throw new Error("Problem initialising data");
        }

        const likesDislikesByProperty =
          projectLikesNotes.reduce<LikesByProperty>((acum, nextProperty) => {
            acum[nextProperty.id] =
              (nextProperty.user_likes_properties as UserLikesInProperty[])!.flatMap(
                (ulp) => ulp.user_profiles
              );
            return acum;
          }, {});

        const noteCountByProperty =
          projectLikesNotes.reduce<NoteCountByProperty>(
            (acum, nextProperty) => {
              acum[nextProperty.id] =
                // Count object will be the first and only object returned under user_property_notes.
                (
                  (nextProperty.user_property_notes as any[]).at(
                    0
                  ) as UserNotesCountInProperty
                ).count;
              return acum;
            },
            {}
          );

        setProjectProperties(projectProperties!);
        setLikesByProperty(likesDislikesByProperty);
        setNotesCountByProperty(noteCountByProperty);
      } catch (e: any) {
        messageApi.error("Problem initialising data");
        console.error(e.toString());
      }
      setLoadingProperties(false);
    };
    getInitialData();
  }, [messageApi, activeProject.id]);

  /// Data CRUD
  /// Create New Property
  const handleSaveProperty = (data: Property | undefined) => {
    if (data) {
      setProjectProperties((prev) => [data, ...prev]);
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
      setProjectProperties((prev) =>
        mapReplaceArray({ modified: data, previous: prev })
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
        setProjectProperties((prev) =>
          prev.filter((p) => p.id !== propertyToBeDeleted.id)
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

  /// Likes ///
  const handleAddPropertyLike = async (propertyId: number) => {
    const { error } = await addPropertyLike(propertyId);
    if (error) {
      showErrorMessage({
        messageApi: messageApi,
      });
    } else {
      setLikesByProperty((prev) => ({
        ...prev,
        [propertyId]: [...prev[propertyId], authedUserProfile],
      }));
    }
  };

  const handleRemovePropertyLike = async (propertyId: number) => {
    const { error } = await deletePropertyLike(propertyId);
    if (error) {
      showMessage({
        content: "Something went wrong...",
        messageApi: messageApi,
        type: "error",
      });
    } else {
      setLikesByProperty((prev) => ({
        ...prev,
        [propertyId]: prev[propertyId].filter(
          (u) => u.id !== authedUserProfile.id
        ),
      }));
    }
  };

  /// Process data for display
  const propertyScores = calculateAllPropertyScores(projectProperties);

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

  const searchFiltered = [...projectProperties].filter((p) =>
    p.listing_title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const typeFiltered =
    showType === "completed"
      ? checkPropertyCompleteInfo(searchFiltered).completed
      : showType === "awaitingInfo"
      ? checkPropertyCompleteInfo(searchFiltered).awaitingInfo
      : showType === "likes"
      ? searchFiltered.filter((p) =>
          likesByProperty[p.id].some((u) => u.id === authedUserProfile.id)
        )
      : searchFiltered;

  const sortedProperties = sortProperties(typeFiltered);

  if (loadingProperties) {
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
        Showing {sortedProperties.length} properties
      </div>
      {deviceSize !== "large" && (
        <AddPropertyButton setOpenAddPanel={setOpenAddPanel} />
      )}

      <FlexRow alignItems="center">
        <SortingFilters
          searchText={searchText}
          setSearchText={setSearchText}
          showType={showType}
          setShowType={setShowType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        {deviceSize === "large" && (
          <AddPropertyButton setOpenAddPanel={setOpenAddPanel} />
        )}
      </FlexRow>

      {sortedProperties.length > 0 ? (
        sortedProperties.map((p) => (
          <div key={p.id} style={{ marginBottom: "8px" }}>
            <PropertyCard
              key={p.id}
              property={p}
              propertyScore={propertyScores[p.id]}
              openUpdateProperty={() => handleOpenUpdateProperty(p)}
              handleRequestDeleteProperty={handleRequestDeleteProperty}
              handleRequestNoteUpdate={() => handleOpenUpdateNotes(p)}
              likes={likesByProperty[p.id]}
              handleAddPropertyLike={handleAddPropertyLike}
              handleRemovePropertyLike={handleRemovePropertyLike}
              noteCount={notesCountByProperty[p.id]}
              authedUserId={authedUserProfile.id}
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
            onSaveProperty={handleSaveProperty}
            onCancel={() => setOpenAddPanel(false)}
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
            authedUserId={authedUserProfile.id}
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
