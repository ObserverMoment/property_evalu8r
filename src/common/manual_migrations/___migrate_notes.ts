// import { createClient } from "@supabase/supabase-js";
// import { Database } from "../types/__database.types__";

// // Create a single supabase client for interacting with your database
// const supabase = createClient<Database>(
//   process.env.REACT_APP_SUPABASE_URL || "",
//   process.env.REACT_APP_SUPABASE_KEY || ""
// );

// export const migrateNotes = async () => {
//   const { data: properties, error: selectError } = await supabase
//     .from(PROPERTIES_TABLE_NAME)
//     .select();

//   console.log(selectError);

//   if (properties) {
//     const insertData = properties
//       .filter((p) => p.notes)
//       .map((p) => ({
//         property_id: p.id,
//         user_id: my_user_id,
//         note: p.notes!,
//       }));

//     const { data, error } = await supabase
//       .from(NOTES_TABLE_NAME)
//       .insert(insertData)
//       .select();

//     console.log(data);
//     console.log(error);
//   }
// };
