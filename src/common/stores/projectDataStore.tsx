import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  addPropertyLike,
  createProperty,
  createPropertyCommuteScore,
  deleteProperty,
  deletePropertyLike,
  getProjectCommuteSettings,
  getProjectLikesNotesAndCommuteSettings,
  getProjectProperties,
  updateProperty,
  updatePropertyCommuteScore,
} from "../supabase";
import { MessageInstance } from "antd/es/message/interface";
import { PostgrestError } from "@supabase/supabase-js";
import {
  CommuteScoresByProperty,
  LikesByProperty,
  NoteCountByProperty,
  ProjectCommuteSetting,
  Property,
  PropertyCommuteScore,
  PropertyScores,
  UserNotesCountInProperty,
  UserProfile,
} from "../../types/types";
import { mapReplaceArray } from "../utils";
import { calculateAllPropertyScores } from "../propertyUtils";

/// Data for a single (the active) project.
const ProjectDataStoreContext = createContext<ProjectDataStore | null>(null);

interface ProjectDataStoreProviderProps {
  messageApi: MessageInstance;
  authedUserProfile: UserProfile;
}

//// State properties are READ ONLY ////
interface ProjectDataStore {
  projectCommuteSetting: ProjectCommuteSetting | null;
  properties: Property[];
  // Objects indexed by property ID which contains user profiles of users who have liked / disliked properties + note count.
  likesByProperty: LikesByProperty;
  noteCountByProperty: NoteCountByProperty;
  propertyScores: PropertyScores;
  commuteScoresByProperty: CommuteScoresByProperty;
  api: ProjectDataStoreApi;
  isLoading: boolean;
}

interface ProjectDataStoreApi {
  getInitialProjectData: (projectId: number) => Promise<PostgrestError | void>;
  getPropertiesByProject: (projectId: number) => Promise<PostgrestError | void>;
  getProjectCommuteSettings: (
    projectId: number
  ) => Promise<PostgrestError | void>;
  getProjectLikesNotesAndCommuteScores: (
    projectId: number
  ) => Promise<PostgrestError | void>;
  createProperty: (
    property: Property,
    projectId: number
  ) => Promise<PostgrestError | void>;
  updateProperty: (property: Property) => Promise<PostgrestError | void>;
  deleteProperty: (propertyId: number) => Promise<PostgrestError | void>;
  createPropertyCommuteScore: (
    propertyId: number,
    commuteScore: PropertyCommuteScore
  ) => Promise<PostgrestError | void>;
  updatePropertyCommuteScore: (
    propertyId: number,
    commuteScore: PropertyCommuteScore
  ) => Promise<PostgrestError | void>;
  addPropertyLike: (propertyId: number) => Promise<PostgrestError | void>;
  removePropertyLike: (propertyId: number) => Promise<PostgrestError | void>;
}

interface LikesNotesCommuteScoresByProperty {
  likesByProperty: LikesByProperty;
  commuteScoresByProperty: CommuteScoresByProperty;
  noteCountByProperty: NoteCountByProperty;
}

export const ProjectDataStoreProvider = ({
  children,
  messageApi,
  authedUserProfile,
}: PropsWithChildren<ProjectDataStoreProviderProps>) => {
  const [properties, setProperties] = useState<Property[]>([]);

  const [projectCommuteSetting, setProjectCommuteSetting] =
    useState<ProjectCommuteSetting | null>(null);

  const [commuteScoresByProperty, setCommuteScoresByProperty] =
    useState<CommuteScoresByProperty>({});

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

  const api: ProjectDataStoreApi = {
    getInitialProjectData: async (projectId) => {
      setIsLoading(true);
      const projectCommuteSettingError = await api.getProjectCommuteSettings(
        projectId
      );

      if (projectCommuteSettingError) {
        handleError(projectCommuteSettingError);
      }

      const propertiesError = await api.getPropertiesByProject(projectId);

      if (propertiesError) {
        handleError(propertiesError);
      }

      const likesNotesScoresError =
        await api.getProjectLikesNotesAndCommuteScores(projectId);

      if (likesNotesScoresError) {
        handleError(likesNotesScoresError);
      }

      setIsLoading(false);
    },
    getProjectCommuteSettings: async (projectId) => {
      const { data, error } = await getProjectCommuteSettings(projectId);
      if (error) {
        handleError(error);
        return error;
      } else {
        setProjectCommuteSetting(data);
      }
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
    getProjectLikesNotesAndCommuteScores: async (projectId) => {
      const { data, error } = await getProjectLikesNotesAndCommuteSettings(
        projectId
      );
      if (error) {
        handleError(error);
        return error;
      } else {
        /// Format the data for the property indexed likes, note count and scores objects.

        const likesNotesCommuteScoresByProperty =
          data.reduce<LikesNotesCommuteScoresByProperty>(
            (acum, nextProperty) => {
              acum.likesByProperty[nextProperty.id] =
                (nextProperty.user_profiles || []) as UserProfile[];

              if (nextProperty.property_commute_scores) {
                acum.commuteScoresByProperty[nextProperty.id] =
                  nextProperty.property_commute_scores! as PropertyCommuteScore;
              }

              // Count object will be the first and only object returned under user_property_notes.
              acum.noteCountByProperty[nextProperty.id] = (
                (nextProperty.user_property_notes as any[]).at(
                  0
                ) as UserNotesCountInProperty
              ).count;

              return acum;
            },
            {
              likesByProperty: {},
              commuteScoresByProperty: {},
              noteCountByProperty: {},
            }
          );

        setLikesByProperty(likesNotesCommuteScoresByProperty.likesByProperty);
        setCommuteScoresByProperty(
          likesNotesCommuteScoresByProperty.commuteScoresByProperty
        );
        setNoteCountByProperty(
          likesNotesCommuteScoresByProperty.noteCountByProperty
        );
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
    createPropertyCommuteScore: async (propertyId, commuteScore) => {
      const { data, error } = await createPropertyCommuteScore(
        propertyId,
        commuteScore
      );
      if (error) {
        handleError(error);
      } else {
        setCommuteScoresByProperty((prev) => ({
          ...prev,
          [propertyId]: data,
        }));
        handleSuccess("Commute Score Saved");
      }
    },
    updatePropertyCommuteScore: async (propertyId, commuteScore) => {
      const { data, error } = await updatePropertyCommuteScore(commuteScore);
      if (error) {
        handleError(error);
      } else {
        setCommuteScoresByProperty((prev) => ({
          ...prev,
          [propertyId]: data,
        }));
        handleSuccess("Commute Score Updated");
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
    <ProjectDataStoreContext.Provider
      value={{
        projectCommuteSetting,
        properties,
        propertyScores,
        likesByProperty,
        noteCountByProperty,
        commuteScoresByProperty,
        isLoading,
        api,
      }}
    >
      {children}
    </ProjectDataStoreContext.Provider>
  );
};

// https://stackoverflow.com/questions/49949099/react-createcontext-point-of-defaultvalue
export const useProjectDataStore = (): ProjectDataStore => {
  const propertiesContext = useContext(ProjectDataStoreContext);
  if (!propertiesContext)
    throw new Error(
      "No ProjectDataStoreContext.Provider found when calling useProjectDataStore. Ensure you have set it up correctly."
    );
  return propertiesContext;
};
