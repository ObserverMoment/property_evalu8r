import { createClient } from "@supabase/supabase-js";
import { ReactNode, createContext } from "react";
import { Database } from "../types/__database.types__";
import React from "react";
import { Property } from "../types/types";

const PROPERTIES_TABLE_NAME = "properties";
const FAVOURITES_TABLE_NAME = "user_favourite_properties";

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
