import React, { useCallback, useEffect, useState } from "react";
import { Property, PropertyNoteWithAuthor } from "../types/types";
import {
  checkSupabaseApiResponse,
  createNewPropertyNote,
  deletePropertyNote,
  getPropertyNotes,
} from "../common/supabase";
import { MessageInstance } from "antd/es/message/interface";
import TextArea from "antd/es/input/TextArea";
import { PrimaryButton } from "../components/styled/styled";
import { FlexRow, MySpacer } from "../components/styled/layout";
import moment from "moment";
import styled from "@emotion/styled";
import { MyTheme } from "../components/styled/theme";
import { DeleteOutlined } from "@ant-design/icons";
import { showMessage } from "../common/notifications";

function UpdateNotes({
  property,
  messageApi,
  authedUserId,
}: {
  property: Property;
  messageApi: MessageInstance;
  authedUserId: string;
}) {
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [notes, setNotes] = useState<PropertyNoteWithAuthor[]>([]);

  /// setTimeout needed for text area to autofocus correctly.
  const textAreaInput = useCallback((inputElement: any) => {
    setTimeout(() => {
      if (inputElement) {
        inputElement.focus();
      }
    }, 500);
  }, []);

  useEffect(() => {
    const getNotesForProperty = async () => {
      const { data, error } = await getPropertyNotes(property.id);

      checkSupabaseApiResponse({
        data,
        error,
        messageApi,
        onSuccess(data) {
          setNotes(data);
          setNewNoteText("");
        },
      });
    };
    getNotesForProperty();
  }, [messageApi, property.id]);

  const handleCreateNewNote = async () => {
    if (newNoteText) {
      const { data, error } = await createNewPropertyNote({
        propertyId: property.id,
        note: newNoteText,
      });

      checkSupabaseApiResponse({
        data,
        error,
        messageApi,
        onSuccess(data) {
          setNotes([data.at(0), ...notes]);
          setNewNoteText("");
        },
      });
    }
  };

  const handleDeleteNote = async (note: PropertyNoteWithAuthor) => {
    if (note.user_id.id === authedUserId) {
      const { error } = await deletePropertyNote({
        noteId: note.id,
      });

      if (error) {
        showMessage({
          content: "Something went wrong...",
          messageApi: messageApi,
          type: "error",
        });
      } else {
        showMessage({
          content: "Note deleted",
          messageApi: messageApi,
          type: "success",
        });
        setNotes(notes.filter((n) => n.id !== note.id));
      }
    }
  };

  return (
    <div style={{ paddingTop: "16px" }}>
      <TextArea
        value={newNoteText}
        onChange={(e) => setNewNoteText(e.target.value)}
        placeholder="Add a new note..."
        autoSize
        ref={textAreaInput}
        autoFocus
      />
      <MySpacer height={20} />
      <PrimaryButton onClick={() => handleCreateNewNote()} size="sm">
        Submit
      </PrimaryButton>
      <MySpacer height={20} />

      {notes
        .sort((a, b) =>
          moment(b.created_at.toString()).diff(moment(a.created_at.toString()))
        )
        .map((note) => (
          <SingleNote
            key={note.id}
            data={note}
            userIsAuthor={note.user_id.id === authedUserId}
            handleDeleteNote={() => handleDeleteNote(note)}
          />
        ))}
    </div>
  );
}

interface SingleNoteContainerProps {
  userIsAuthor: boolean;
}

const SingleNoteContainer = styled.div<SingleNoteContainerProps>`
  display: flex;
  justify-content: ${(p) => (p.userIsAuthor ? "end" : "start")};
  margin: 6px;
`;

const SingleNoteContent = styled.div<SingleNoteContainerProps>`
  border-radius: 12px;
  background: ${(p) =>
    p.userIsAuthor ? MyTheme.colors.authorNote : MyTheme.colors.notAuthorNote};
  text-align: ${(p) => (p.userIsAuthor ? "right" : "left")};
  padding: 4px 8px;
  font-size: 0.9em;
`;

const UsernameTag = styled.div`
  color: ${MyTheme.colors.secondary};
  font-size: 0.55em;
  padding: 1px;
`;

interface SingleNoteProps {
  data: PropertyNoteWithAuthor;
  userIsAuthor: boolean;
  handleDeleteNote: () => void;
}

const SingleNote = ({
  data,
  userIsAuthor,
  handleDeleteNote,
}: SingleNoteProps) => (
  <div>
    <FlexRow justifyContent={userIsAuthor ? "end" : "start"}>
      <UsernameTag>
        {data.user_id.username} ({moment(data.created_at).format("MMM Do")})
      </UsernameTag>
    </FlexRow>

    <SingleNoteContainer userIsAuthor={userIsAuthor}>
      {userIsAuthor && (
        <div
          style={{ paddingRight: "8px", display: "flex", alignItems: "center" }}
        >
          <DeleteOutlined
            onClick={handleDeleteNote}
            style={{ fontSize: "0.9em" }}
          />
        </div>
      )}
      <SingleNoteContent userIsAuthor={userIsAuthor}>
        {data.note}
      </SingleNoteContent>
    </SingleNoteContainer>
  </div>
);

export default UpdateNotes;
