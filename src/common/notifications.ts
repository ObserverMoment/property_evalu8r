import { MessageInstance } from "antd/es/message/interface";
import {
  NotificationInstance,
  NotificationPlacement,
} from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

interface OpenNotificationProps {
  message: string;
  descriptionText?: string;
  placement: NotificationPlacement;
  api: NotificationInstance;
  type?: NotificationType;
}

export const openNotification = ({
  message,
  descriptionText,
  placement,
  api,
  type = "info",
}: OpenNotificationProps) => {
  api[type]({
    message: message,
    description: descriptionText,
    placement,
  });
};

type MessageType = "success" | "error" | "warning";

interface ShowMessageProps {
  content?: string;
  type?: MessageType;
  messageApi: MessageInstance;
}

export const showMessage = ({
  content,
  type = "success",
  messageApi,
}: ShowMessageProps) => {
  messageApi.open({
    type: type || "Success!",
    content: content,
  });
};

export const showErrorMessage = ({
  content = "Something went wrong",
  type = "error",
  messageApi,
}: ShowMessageProps) => {
  messageApi.open({
    type: type,
    content: content,
  });
};
