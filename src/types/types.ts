import { Database } from "./__database.types__";

export type Property = {
  [s: string]: any;
} & Database["public"]["Tables"]["properties"]["Row"];

export type Favourite = {
  [s: string]: any;
} & Database["public"]["Tables"]["user_favourite_properties"]["Row"];
