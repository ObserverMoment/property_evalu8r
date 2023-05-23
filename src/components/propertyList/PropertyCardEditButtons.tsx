import { Property } from "../../types/types";
import { FlexRow } from "../styled/layout";
import { EllipsisOutlined } from "@ant-design/icons";
import { SecondaryButton } from "../styled/styled";
import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";
import { DatePicker, Dropdown, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useProjectDataStore } from "../../common/stores/projectDataStore";
import dayjs, { Dayjs } from "dayjs";

interface PropertyCardEditButtonsProps {
  property: Property;
  authedUserId: string;
  handleRequestUpdate: () => void;
  handleRequestDelete: () => void;
  handleRequestNoteUpdate: () => void;
  handleOpenCommuteAnalysis: () => void;
  noteCount: number;
}

export const PropertyCardEditButtons = ({
  property,
  authedUserId,
  handleRequestUpdate,
  handleRequestDelete,
  handleRequestNoteUpdate,
  handleOpenCommuteAnalysis,
  noteCount,
}: PropertyCardEditButtonsProps) => {
  const { api } = useProjectDataStore();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>();
  const [activeOfferAmount, setActiveOfferAmount] = useState<number | null>(
    null
  );
  const { user_id } = property;

  useEffect(() => setActiveOfferAmount(property.offered), [property.offered]);

  const updateAmountOffered = async () => {
    if (activeOfferAmount) {
      await api.updateProperty({
        ...property,
        offered: activeOfferAmount,
      });
    }
  };

  const updateViewingDate = async (date: Dayjs) => {
    await api.updateProperty({
      ...property,
      view_date: date.toISOString(),
    });
  };

  return (
    <FlexRow gap="8px" style={{ alignItems: "center" }}>
      {authedUserId === user_id && (
        <div style={{ fontSize: "0.6em" }}>Added by You</div>
      )}

      <SecondaryButton
        style={{ position: "relative" }}
        size="micro"
        onClick={handleOpenCommuteAnalysis}
      >
        Commute Analysis
      </SecondaryButton>

      <SecondaryButton
        style={{ position: "relative" }}
        size="micro"
        onClick={handleRequestNoteUpdate}
      >
        Notes
        {noteCount > 0 && <NoteCountBadge>{noteCount}</NoteCountBadge>}
      </SecondaryButton>

      {authedUserId === user_id && (
        <Dropdown
          open={dropdownOpen}
          onOpenChange={(b) => setDropdownOpen(b)}
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <InputNumber
                    min={0}
                    max={999999999}
                    addonBefore={"£"}
                    addonAfter={
                      <SecondaryButton
                        size="micro"
                        disabled={!activeOfferAmount}
                        onClick={() => updateAmountOffered()}
                      >
                        Save
                      </SecondaryButton>
                    }
                    placeholder="Enter offer amount"
                    onChange={(a) => setActiveOfferAmount(a)}
                    value={activeOfferAmount}
                  />
                ),
              },
              {
                key: "2",
                label: (
                  <FlexRow justifyContent="center" alignItems="center">
                    <div
                      style={{
                        paddingRight: "10px",
                        color: MyTheme.colors.secondary,
                      }}
                    >
                      Viewing on:{" "}
                    </div>
                    <DatePicker
                      value={
                        property.view_date ? dayjs(property.view_date) : null
                      }
                      onClick={(e) => e.preventDefault()}
                      placeholder="Viewing Date / Time"
                      format={"h:mm A DD/MM/YY"}
                      showTime={{ format: "HH:mm" }}
                      onOk={(d) => updateViewingDate(d)}
                    />
                  </FlexRow>
                ),
              },
              {
                key: "3",
                label: (
                  <SecondaryButton size="micro" onClick={handleRequestUpdate}>
                    Edit Property Details
                  </SecondaryButton>
                ),
              },
              {
                key: "4",
                label: (
                  <SecondaryButton size="micro" onClick={handleRequestDelete}>
                    Delete
                  </SecondaryButton>
                ),
              },
            ],
          }}
          placement="topRight"
        >
          <EllipsisOutlined />
        </Dropdown>
      )}
    </FlexRow>
  );
};

const NoteCountBadge = styled.span`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${MyTheme.colors.linkText};
  top: -7px;
  left: -4px;
  padding: 5px;
  text-align: center;
  border-radius: 50%;
  font-size: 0.85em;
  height: 15px;
  color: ${MyTheme.colors.primary};
`;
