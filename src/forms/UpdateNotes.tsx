import React, { useState } from "react";
import { Property } from "../types/types";
import { updateProperty } from "../common/supabase";
import { MessageInstance } from "antd/es/message/interface";
import TextArea from "antd/es/input/TextArea";
import { PrimaryButton } from "../components/styled/styled";
import { MySpacer } from "../components/styled/layout";

function UpdateNotes({
  property,
  closeDrawer,
  messageApi,
}: {
  property: Property;
  closeDrawer: (updated?: Property) => void;
  messageApi: MessageInstance;
}) {
  const originalNotes = property.notes;
  const [notes, setNotes] = useState<string | null>(property.notes);

  const handleSave = async () => {
    if (originalNotes !== notes) {
      const { data, error } = await updateProperty({
        ...property,
        notes,
      });
      if (data !== null && data.length && !error) {
        messageApi.success("Notes updated");
        closeDrawer(data.at(0));
      } else {
        messageApi.error("Something went wrong...");
        console.log(error);
      }
    } else {
      closeDrawer();
    }
  };

  return (
    <div style={{ paddingTop: "16px" }}>
      <TextArea
        value={notes || undefined}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes..."
        autoSize
      />
      <MySpacer height={20} />
      <PrimaryButton onClick={handleSave} size="sm">
        Done
      </PrimaryButton>
    </div>
  );
}

export default UpdateNotes;
