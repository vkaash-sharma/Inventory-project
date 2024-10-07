import React, { useCallback, useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  readNotification,
  userNotification,
} from "services/NotificationServices";
import NotificationListPart from "./NotificationListPart";

function Notifications() {
  const [notifications, setNotifications] = useState("");

  const getAllUserNotifications = useCallback(async () => {
    let response = await userNotification();
    if (response && response?.status) {
      setNotifications(response.data);
    }
  }, []);
  useEffect(() => {
    getAllUserNotifications();
  }, [getAllUserNotifications]);

  const allNotification =
    Array.isArray(notifications) && notifications.length > 0
      ? notifications?.map((notification) => {
          return notification.id;
        })
      : null;
  const handleRead = async (notificationList) => {
    const response = await readNotification({
      notificationIds: notificationList,
    });
    if (response && response?.status) {
      getAllUserNotifications();
    }
  };
  return (
    <>
      <div className="notificationsScreen wrapper">
        <Container>
          <div className="allNotificationSec">
            <div className="notificationTitleSec">
              <h2>All Notifications</h2>
              <Link
                className="btn btnlinkPrimary mark-read-btn"
                onClick={() => handleRead(allNotification)}
              >
                Mark all as read
              </Link>
            </div>
            <ul>
              <NotificationListPart
                handleRead={handleRead}
                notifications={notifications}
              />
            </ul>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Notifications;
