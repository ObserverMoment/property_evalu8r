import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  addPropertyLike,
  createProperty,
  deleteProperty,
  deletePropertyLike,
  getProjectLikes,
  getProjectProperties,
  updateProperty,
} from "../supabase";
import { MessageInstance } from "antd/es/message/interface";
import { PostgrestError } from "@supabase/supabase-js";
import {
  LikesByProperty,
  NoteCountByProperty,
  Property,
  PropertyScores,
  UserLikesInProperty,
  UserNotesCountInProperty,
  UserProfile,
} from "../../types/types";
import { mapReplaceArray } from "../../common/utils";
import { calculateAllPropertyScores } from "../propertyUtils";

const PropertiesStoreContext = createContext<PropertiesStore | null>(null);

interface PropertiesStoreProviderProps {
  messageApi: MessageInstance;
  authedUserProfile: UserProfile;
}

//// State properties are READ ONLY ////
interface PropertiesStore {
  properties: Property[];
  // Objects indexed by property ID which contains user profiles of users who have liked / disliked properties + note count.
  likesByProperty: LikesByProperty;
  noteCountByProperty: NoteCountByProperty;
  propertyScores: PropertyScores;
  api: PropertiesStoreApi;
  isLoading: boolean;
}

interface PropertiesStoreApi {
  getInitialProjectData: (projectId: number) => Promise<PostgrestError | void>;
  getPropertiesByProject: (projectId: number) => Promise<PostgrestError | void>;
  getProjectLikesAndNotes: (
    projectId: number
  ) => Promise<PostgrestError | void>;
  createProperty: (
    property: Property,
    projectId: number
  ) => Promise<PostgrestError | void>;
  updateProperty: (property: Property) => Promise<PostgrestError | void>;
  deleteProperty: (propertyId: number) => Promise<PostgrestError | void>;
  addPropertyLike: (propertyId: number) => Promise<PostgrestError | void>;
  removePropertyLike: (propertyId: number) => Promise<PostgrestError | void>;
}

export const PropertiesStoreProvider = ({
  children,
  messageApi,
  authedUserProfile,
}: PropsWithChildren<PropertiesStoreProviderProps>) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [likesByProperty, setLikesByProperty] = useState<LikesByProperty>({});
  const [noteCountByProperty, setNoteCountByProperty] =
    useState<NoteCountByProperty>({});
  const [propertyScores, setPropertyScores] = useState<PropertyScores>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // First call should be to [getInitialProjectData]

  const handleError = (error: PostgrestError) => {
    console.error(error.code);
    console.error(error.hint);
    console.error(error.message);
    console.error(error.details);
    messageApi.error(`Sorry, ${error.message}`);
  };

  const handleSuccess = (message: string) => messageApi.success(message);

  /// Also updates the property scores object.
  const handleSetProperties = (properties: Property[]) => {
    setProperties(properties);
    setPropertyScores(calculateAllPropertyScores(properties));
  };

  const api: PropertiesStoreApi = {
    getInitialProjectData: async (projectId) => {
      setIsLoading(true);
      const propertiesError = await api.getPropertiesByProject(projectId);
      const likesNotesError = await api.getProjectLikesAndNotes(projectId);
      if (propertiesError) {
        handleError(propertiesError);
      }
      if (likesNotesError) {
        handleError(likesNotesError);
      }
      setIsLoading(false);
    },
    getPropertiesByProject: async (projectId) => {
      const { data, error } = await getProjectProperties(projectId);
      if (error) {
        handleError(error);
        return error;
      } else {
        handleSetProperties(data);
      }
    },
    getProjectLikesAndNotes: async (projectId) => {
      const { data, error } = await getProjectLikes(projectId);
      if (error) {
        handleError(error);
        return error;
      } else {
        const likesByProperty = data.reduce<LikesByProperty>(
          (acum, nextProperty) => {
            acum[nextProperty.id] =
              (nextProperty.user_likes_properties as UserLikesInProperty[])!.flatMap(
                (ulp) => ulp.user_profiles
              );
            return acum;
          },
          {}
        );
        const noteCountByProperty = data.reduce<NoteCountByProperty>(
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
        setLikesByProperty(likesByProperty);
        setNoteCountByProperty(noteCountByProperty);
      }
    },
    createProperty: async (property, projectId) => {
      const { data, error } = await createProperty(property, projectId);
      if (error) {
        handleError(error);
      } else {
        handleSetProperties([data, ...properties]);
        setLikesByProperty((prev) => ({
          ...prev,
          [data.id]: [],
        }));
        setNoteCountByProperty((prev) => ({
          ...prev,
          [data.id]: 0,
        }));
        handleSuccess("New property added");
      }
    },
    updateProperty: async (property) => {
      const { data, error } = await updateProperty(property);
      if (error) {
        handleError(error);
      } else {
        handleSetProperties(
          mapReplaceArray({ modified: data, previous: properties })
        );

        setPropertyScores(calculateAllPropertyScores(properties));
        handleSuccess("Property updated");
      }
    },
    deleteProperty: async (propertyId) => {
      const { error } = await deleteProperty(propertyId);
      if (error) {
        handleError(error);
      } else {
        handleSetProperties(properties.filter((p) => p.id !== propertyId));
        setPropertyScores(calculateAllPropertyScores(properties));
      }
    },
    addPropertyLike: async (propertyId) => {
      const { error } = await addPropertyLike(propertyId);
      if (error) {
        handleError(error);
      } else {
        setLikesByProperty((prev) => ({
          ...prev,
          [propertyId]: [...prev[propertyId], authedUserProfile],
        }));
      }
    },
    removePropertyLike: async (propertyId) => {
      const { error } = await deletePropertyLike(propertyId);
      if (error) {
        handleError(error);
      } else {
        setLikesByProperty((prev) => ({
          ...prev,
          [propertyId]: prev[propertyId].filter(
            (u) => u.id !== authedUserProfile.id
          ),
        }));
      }
    },
  };

  return (
    <PropertiesStoreContext.Provider
      value={{
        properties,
        likesByProperty,
        noteCountByProperty,
        propertyScores,
        isLoading,
        api,
      }}
    >
      {children}
    </PropertiesStoreContext.Provider>
  );
};

// https://stackoverflow.com/questions/49949099/react-createcontext-point-of-defaultvalue
export const usePropertiesStore = (): PropertiesStore => {
  const propertiesContext = useContext(PropertiesStoreContext);
  if (!propertiesContext)
    throw new Error(
      "No PropertiesStoreContext.Provider found when calling usePropertiesStore. Ensure you have set it up correctly."
    );
  return propertiesContext;
};
