import { Database } from "./__database.types__";

export type DeviceSize = "small" | "medium" | "large";

export interface SelectInputOption {
  label: string;
  value: string;
}

export type UserProfile = {
  [s: string]: any;
} & Database["public"]["Tables"]["user_profiles"]["Row"];

export type Project = {
  [s: string]: any;
  id: number;
  name: string;
};

export type ProjectCommuteSetting = {
  [s: string]: any;
} & Database["public"]["Tables"]["project_commute_settings"]["Row"];

export type Property = {
  [s: string]: any;
} & Database["public"]["Tables"]["properties"]["Row"];

export type PropertyCommuteScore = {
  [s: string]: any;
} & Database["public"]["Tables"]["property_commute_scores"]["Row"];

export type CommuteScoresByProperty = {
  [id: number]: PropertyCommuteScore | undefined;
};

export interface PropertyScores {
  [key: number]: PropertyScore;
}

export interface PropertyScore {
  propertyId: number;
  cost: number;
  points: number;
  score: number; // points - cost
  sqMtrCost: number | null;
}

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
