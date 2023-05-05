import { Database } from "./__database.types__";

export type Property = {
  [s: string]: any;
} & Database["public"]["Tables"]["properties"]["Row"];
