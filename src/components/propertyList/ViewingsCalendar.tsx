import { Calendar } from "antd";
import { Property } from "../../types/types";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { PropertyCardInfoFields } from "./PropertyCardInfoFields";
import { MyCard } from "../styled/styled";
import Title from "antd/es/typography/Title";
import styled from "@emotion/styled";

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

  return (
    <div>
      <Title level={4}>Viewings</Title>
      <Calendar fullscreen={false} onChange={handleDateSelect} />
      {viewingsOnSelectedDay.length > 0 &&
        viewingsOnSelectedDay
          .sort((a, b) => (dayjs(a.view_date).isBefore(b.view_date) ? -1 : 1))
          .map((p) => (
            <div style={{ padding: "4px" }}>
              <MyCard>
                <DateDisplay>
                  {dayjs(p.view_date).format("h:mm A D MMM")}
                </DateDisplay>
                <PropertyCardInfoFields property={p} deviceSize={"small"} />
              </MyCard>
            </div>
          ))}
    </div>
  );
};

const DateDisplay = styled.div`
  font-size: 0.9em;
  padding: 4px 2px;
`;
