import React from "react";
import TimeAgo from "react-timeago";
import UserDefaultPic from "../Assets/Images/user-default.png";
import { Image } from "react-bootstrap";

const NotificationListPart = ({ handleRead, notifications }) => {
  return (
    <ul>
      {Array.isArray(notifications) && notifications.length > 0 ? (
        notifications?.map((notification) => (
          <li
            className={notification?.readStatus ? "" : "unreadMsg"}
            onMouseEnter={(e) =>
              !notification?.readStatus && handleRead(notification?.id)
            }
            key={notification.id}
          >
            <div className="userPicSec">
              <Image src={UserDefaultPic} alt="user-default" />
            </div>
            <div className="userDataSec">
              <h6>{notification.message}</h6>
              <span className="dateTime">
                <TimeAgo date={notification.createdAt} minPeriod={1} />
              </span>
            </div>
          </li>
        ))
      ) : (
        <p>No Notifications...</p>
      )}
    </ul>
  );
};

export default NotificationListPart;
