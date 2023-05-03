import { createClient } from "@supabase/supabase-js";
import { ReactNode, createContext } from "react";
import { Database } from "../types/database.types";
import React from "react";
import { CreateProperty } from "../types/types";

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
export const createProperty = async (createData: CreateProperty) => {
  const { data, error } = await supabase
    .from("houses")
    .insert(createData)
    .select();

  return { data, error };
};
