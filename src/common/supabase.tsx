import { PostgrestError, createClient } from "@supabase/supabase-js";
import { ReactNode, createContext } from "react";
import { Database } from "../types/__database.types__";
import React from "react";
import { Property, PropertyCommuteScore } from "../types/types";
import { MessageInstance } from "antd/es/message/interface";

const USER_PROFILES_TABLE_NAME = "user_profiles";
const PROJECTS_TABLE_NAME = "projects";
const PROJECT_COMMUTE_SETTINGS_TABLE_NAME = "project_commute_settings";
// const PROJECTS_MEMBERS_TABLE_NAME = "project_members";
const PROPERTIES_TABLE_NAME = "properties";
const PROPERTY_COMMUTE_SCORES_TABLE_NAME = "property_commute_scores";
const LIKES_TABLE_NAME = "user_likes_properties";
const DISLIKES_TABLE_NAME = "user_dislikes_properties";
const NOTES_TABLE_NAME = "user_property_notes";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL || "",
  process.env.REACT_APP_SUPABASE_KEY || ""
);

export const SupabaseContext = createContext(supabase);

type SupabaseProviderProps = {
  children: ReactNode;
};

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => (
  <SupabaseContext.Provider value={supabase}>
    {children}
  </SupabaseContext.Provider>
);

/// Check supabase response
interface CheckSupabaseApiResponseProps {
  data: any | any[] | null;
  error: PostgrestError | null;
  messageApi: MessageInstance;
  onSuccess: () => void;
}

export const checkSupabaseApiResponse = ({
  data,
  error,
  messageApi,
  onSuccess,
}: CheckSupabaseApiResponseProps): void => {
  if (error) {
    messageApi.error("Something went wrong...");
    console.error(error.message);
  } else if (!data) {
    messageApi.error("Something went wrong...");
    console.error("There was not data returned.");
  } else {
    onSuccess();
  }
};

/// Supabase DB calls
//// Authed User ////
export const getSessionUserId = async (): Promise<string | undefined> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id;
};

export const getAuthedUserProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return await supabase
    .from(USER_PROFILES_TABLE_NAME)
    .select()
    .eq("id", session?.user.id)
    .single();
};

export const updateAuthedUserName = async (newUsername: string) => {
  const userId = await getSessionUserId();
  return await supabase
    .from(USER_PROFILES_TABLE_NAME)
    .update({
      username: newUsername,
    })
    .eq("id", userId)
    .select()
    .single();
};

/// Authed User Projects ///
export const getProjects = async () =>
  await supabase
    .from(PROJECTS_TABLE_NAME)
    .select(`*, project_commute_settings (*)`);

export const getProjectCommuteSettings = async (projectId: number) =>
  await supabase
    .from(PROJECT_COMMUTE_SETTINGS_TABLE_NAME)
    .select()
    .eq("project_id", projectId)
    .single();

// Creates a project and adds the creator to the project_members table, then returns the new project in a single transaction.
export const createProject = async (name: string, password: string) => {
  /// Using RPC function with 'security definer' to avoid RLS blocking select before user is added to project_members (after creating project)
  return await supabase
    .rpc("insert_project_create_defaults_and_add_member", {
      project_name: name,
      project_password: password,
    })
    .single();
};

// Users can joing an existing project with the username and password.
export const joinExistingProject = async (name: string, password: string) => {
  // Finds a project in the DB that matches username and password. If it exists user is added to project_members and the project is returned.
  return await supabase
    .rpc("add_user_to_project_members", {
      project_name: name,
      project_password: password,
    })
    .single();
};

/// Properties ////
export const getProjectProperties = async (projectId: number) =>
  await supabase
    .from(PROPERTIES_TABLE_NAME)
    .select()
    .eq("project_id", projectId);

export const createProperty = async (data: Property, projectId: number) => {
  const userId = await getSessionUserId();

  return await supabase
    .from(PROPERTIES_TABLE_NAME)
    .insert({
      ...data,
      user_id: userId,
      project_id: projectId,
    })
    .select()
    .single();
};

export const updateProperty = async (data: Property) => {
  return await supabase
    .from(PROPERTIES_TABLE_NAME)
    .update(data)
    .eq("id", data.id)
    .select()
    .single();
};

export const deleteProperty = async (propertyId: number) => {
  return await supabase
    .from(PROPERTIES_TABLE_NAME)
    .delete()
    .eq("id", propertyId);
};

//// Likes, Notes and Commute Score Related ////
export const getProjectLikesNotesAndCommuteSettings = async (
  projectId: number
) =>
  await supabase
    .from(PROPERTIES_TABLE_NAME)
    .select(
      `
    id,
    user_profiles!user_likes_properties (
      id,
      username
    ),
    property_commute_scores ( * ),
    user_property_notes(count)
    `
    )
    .eq("project_id", projectId);

export const createPropertyCommuteScore = async (
  propertyId: number,
  commuteScore: PropertyCommuteScore
) => {
  return await supabase
    .from(PROPERTY_COMMUTE_SCORES_TABLE_NAME)
    .insert({
      ...commuteScore,
      property_id: propertyId,
    })
    .select()
    .single();
};

export const updatePropertyCommuteScore = async (
  commuteScore: PropertyCommuteScore
) => {
  return await supabase
    .from(PROPERTY_COMMUTE_SCORES_TABLE_NAME)
    .update(commuteScore)
    .eq("id", commuteScore.id)
    .select()
    .single();
};

export const addPropertyLike = async (propertyId: number) => {
  const userId = await getSessionUserId();
  return await supabase
    .from(LIKES_TABLE_NAME)
    .insert({
      user_id: userId!,
      property_id: propertyId,
    })
    .select()
    .single();
};

export const deletePropertyLike = async (propertyId: number) => {
  const userId = await getSessionUserId();
  return await supabase.from(LIKES_TABLE_NAME).delete().match({
    property_id: propertyId,
    user_id: userId,
  });
};

//// Dislikes ////
export const addPropertyDislike = async (propertyId: number) => {
  const userId = await getSessionUserId();
  return await supabase
    .from(DISLIKES_TABLE_NAME)
    .insert({
      user_id: userId!,
      property_id: propertyId,
    })
    .select()
    .single();
};

export const deletePropertyDislike = async (propertyId: number) => {
  const userId = await getSessionUserId();
  return await supabase.from(DISLIKES_TABLE_NAME).delete().match({
    property_id: propertyId,
    user_id: userId,
  });
};

//// Property Notes ////
const NOTE_AND_USERNAME_SELECT = `id, note, created_at, user_id (id, username)`;

export const getPropertyNotes = async (propertyId: number) =>
  await supabase
    .from(NOTES_TABLE_NAME)
    .select(NOTE_AND_USERNAME_SELECT)
    .eq("property_id", propertyId);

export const createNewPropertyNote = async ({
  propertyId,
  note,
}: {
  propertyId: number;
  note: string;
}) => {
  const userId = await getSessionUserId();
  return await supabase
    .from(NOTES_TABLE_NAME)
    .insert({
      note: note,
      user_id: userId!,
      property_id: propertyId,
    })
    .select(NOTE_AND_USERNAME_SELECT)
    .single();
};

export const deletePropertyNote = async ({ noteId }: { noteId: string }) => {
  return await supabase.from(NOTES_TABLE_NAME).delete().eq("id", noteId);
};
