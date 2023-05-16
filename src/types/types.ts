import { Database } from "./__database.types__";

export type DeviceSize = "small" | "medium" | "large";

export type UserProfile = {
  [s: string]: any;
} & Database["public"]["Tables"]["user_profiles"]["Row"];

export type Project = {
  [s: string]: any;
  id: number;
  name: string;
};

export type Property = {
  [s: string]: any;
} & Database["public"]["Tables"]["properties"]["Row"];

export type LikesByProperty = {
  [id: number]: UserProfile[];
};

export type UserLikesDislikesInProperties = {
  user_profiles: UserProfile[];
};

export type PropertyNoteWithAuthor = {
  [s: string]: any;
  id: string;
  note: string;
  created_at: Date;
  user_id: {
    id: string | null;
    username: string | null;
  };
};
