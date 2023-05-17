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

export type NoteCountByProperty = {
  [id: number]: number;
};

/// Shape of [user_likes_properties] field of property when data successfully returned from [getProjectLikes]
export type UserLikesInProperty = {
  user_profiles: UserProfile[];
};

/// Shape of [user_property_notes] field of property when data successfully returned from [getProjectLikes]
export type UserNotesCountInProperty = {
  count: number;
};

export type PropertyNoteWithAuthor = {
  [s: string]: any;
  id: string;
  note: string;
  created_at: string;
  user_id: {
    id: string | null;
    username: string | null;
  };
};
