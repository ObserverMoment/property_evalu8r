import { Calendar } from "antd";
import { Property } from "../../types/types";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { PropertyCardInfoFields } from "./PropertyCardInfoFields";
import { MyCard } from "../styled/styled";
import Title from "antd/es/typography/Title";
import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";

interface ViewingsCalendarProps {
  properties: Property[];
}
export const ViewingsCalendar = ({ properties }: ViewingsCalendarProps) => {
  const [viewingsOnSelectedDay, setViewingsOnSelectedDay] = useState<
    Property[]
  >([]);

  const handleDateSelect = (date: Dayjs) => {
    setViewingsOnSelectedDay(
      properties.filter(
        (p) => p.view_date && dayjs(p.view_date).isSame(date, "d")
      )
    );
  };

  const cachedHandleDateSelect = useCallback(handleDateSelect, [properties]);

  useEffect(() => cachedHandleDateSelect(dayjs()), [cachedHandleDateSelect]);

  return (
    <div>
      <Title level={4}>Viewings</Title>
      <Calendar
        fullscreen={false}
        onChange={handleDateSelect}
        cellRender={(date, info) => {
          if (
            info.type === "date" &&
            properties.some((p) => dayjs(p.view_date).isSame(date, "d"))
          ) {
            return (
              <DateCellDotContainer>
                <DateCellDot />
              </DateCellDotContainer>
            );
          }
        }}
      />
      {viewingsOnSelectedDay.length > 0 &&
        viewingsOnSelectedDay
          .sort((a, b) => (dayjs(a.view_date).isBefore(b.view_date) ? -1 : 1))
          .map((p) => (
            <div key={p.id} style={{ padding: "4px" }}>
              <MyCard>
                <DateTextDisplay>
                  {dayjs(p.view_date).format("h:mm A D MMM")}
                </DateTextDisplay>
                <PropertyCardInfoFields property={p} deviceSize={"small"} />
              </MyCard>
            </div>
          ))}
    </div>
  );
};

const DateCellDotContainer = styled.div`
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
  position: absolute;
`;

const DateCellDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${MyTheme.colors.linkText};
  border-radius: 50%;
`;

const DateTextDisplay = styled.div`
  font-size: 0.9em;
  padding: 4px 2px;
`;
