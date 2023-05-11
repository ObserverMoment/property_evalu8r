import { PostgrestError, createClient } from "@supabase/supabase-js";
import { ReactNode, createContext } from "react";
import { Database } from "../types/__database.types__";
import React from "react";
import { Property } from "../types/types";
import { MessageInstance } from "antd/es/message/interface";

const PROPERTIES_TABLE_NAME = "properties";
const FAVOURITES_TABLE_NAME = "user_favourite_properties";
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
  data: any[] | null;
  error: PostgrestError | null;
  messageApi: MessageInstance;
  onSuccess: (data: any[]) => void;
}
export const checkSupabaseApiResponse = ({
  data,
  error,
  messageApi,
  onSuccess,
}: CheckSupabaseApiResponseProps): void => {
  if (error) {
    messageApi.error("Something went wrong...");
    console.log(error.message);
  } else if (!data) {
    messageApi.error("Something went wrong...");
    console.log("There was not data returned.");
  } else {
    onSuccess(data);
  }
};

/// Supabase DB calls
export const getSessionUserId = async (): Promise<string | undefined> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id;
};

/// Properties ////
export const getProperties = async () =>
  await supabase.from(PROPERTIES_TABLE_NAME).select();

export const createProperty = async (data: Property) => {
  const userId = await getSessionUserId();

  return await supabase
    .from(PROPERTIES_TABLE_NAME)
    .insert({
      ...data,
      user_id: userId,
    })
    .select();
};

export const updateProperty = async (data: Property) => {
  return await supabase
    .from(PROPERTIES_TABLE_NAME)
    .update(data)
    .eq("id", data.id)
    .select();
};

export const deleteProperty = async (data: Property) => {
  return await supabase.from(PROPERTIES_TABLE_NAME).delete().eq("id", data.id);
};

//// Favourites ////
export const getFavourites = async () => {
  const userId = await getSessionUserId();
  return await supabase
    .from(FAVOURITES_TABLE_NAME)
    .select()
    .eq("user_id", userId);
};

export const addFavourite = async (propertyId: number) => {
  const userId = await getSessionUserId();
  return await supabase
    .from(FAVOURITES_TABLE_NAME)
    .insert({
      user_id: userId!,
      property_id: propertyId,
    })
    .select();
};

export const removeFavourite = async (propertyId: number) =>
  await supabase
    .from(FAVOURITES_TABLE_NAME)
    .delete()
    .eq("property_id", propertyId);

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
    .select(NOTE_AND_USERNAME_SELECT);
};

export const deletePropertyNote = async ({ noteId }: { noteId: string }) => {
  return await supabase.from(NOTES_TABLE_NAME).delete().eq("id", noteId);
};
