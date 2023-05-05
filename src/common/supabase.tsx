import { createClient } from "@supabase/supabase-js";
import { ReactNode, createContext } from "react";
import { Database } from "../types/__database.types__";
import React from "react";
import { Property } from "../types/types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  "https://biibfeljultiwqmsnkse.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaWJmZWxqdWx0aXdxbXNua3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMwNDY5ODIsImV4cCI6MTk5ODYyMjk4Mn0.Rs2lSQaDk3wmypxkSjl8rDYqLEobEq5CBaNt22cntCE"
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

export const getProperties = async () => {
  const userId = await getSessionUserId();

  return await supabase.from("properties").select().eq("user_id", userId);
};

export const createProperty = async (data: Property) => {
  const userId = await getSessionUserId();

  return await supabase
    .from("properties")
    .insert({
      ...data,
      user_id: userId,
    })
    .select();
};

export const updateProperty = async (data: Property) => {
  return await supabase
    .from("properties")
    .update(data)
    .eq("id", data.id)
    .select();
};

export const deleteProperty = async (data: Property) => {
  return await supabase.from("properties").delete().eq("id", data.id);
};
