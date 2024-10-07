import { URL_CONFIG } from "../_contants/config/URL_CONFIG";
import { createBrowserHistory } from "history";
import moment from "moment";
import { useEffect, useState } from "react";
import { companyAdmins } from "../services/UserService/UserService";
import { getAllActionLogById } from "../services/actionLog";

export const isLogin = () => {
  return !!localStorage.getItem("jwt_token");
};

export const auth_user = () => {
  const auth_user = JSON.parse(localStorage.getItem("auth_user"));
  return auth_user ? auth_user : false;
};

export const getPermission = () => {
  const authUser = localStorage.getItem("auth_user");
  return authUser && JSON.parse(authUser)?.permissions
    ? JSON.parse(authUser)?.permissions
    : {};
};

export const permissionCheck = (permission) => {
  const permissions = getPermission();
  if (Array.isArray(permission)) {
    let flag = false;
    for (const iterator of permission) {
      if (permissions?.[iterator]) {
        flag = true;
        break;
      }
    }
    return flag;
  } else {
    return true;
  }
};

export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const IS_MOBILE = () => {
  const { pathname } = createBrowserHistory().location;
  return !!pathname.includes("mobile");
};
export const capitalizeName = (name = "") => {
  const arr = name?.split(" ");

  if (arr?.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const newName = arr.join(" ");
    return newName;
  } else return "";
};
export const validateEmailList = (raw) => {
  var emails = raw ? raw.split(",") : [];

  var valid = true;
  var regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  for (var i = 0; i < emails.length; i++) {
    if (emails[i] === "" || !regex.test(emails[i].replace(/\s/g, ""))) {
      valid = false;
    }
  }
  return valid;
};
export const parseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const fullName = (user) => {
  try {
    return (
      <>
        {" "}
        {`${user?.firstName ? capitalizeName(user?.firstName) : ""} ${
          user?.lastName ? capitalizeName(user?.lastName) : ""
        }`}
      </>
    );
  } catch (error) {
    return null;
  }
};
export const DDMMYYYYFormat = (date) => {
  return date
    ? moment(date).format("DD-MM-YYYY")
    : moment().format("DD-MM-YYYY"); // true
};
export const DDMMMYYYYFormat = (date) => {
  return date
    ? moment(date).format("DDMMM YYYY")
    : moment().format("DDMMM YYYY"); // true
};
export const MonthYearFormat = (date) => {
  return moment(date, "YYYY-MM-DD").format("MMM YYYY");
};

export const YYYYMMDDHHMMSSFormat = (date) => {
  return moment(date).format("YYYY-MM-DD hh:mm:ss"); // true
};
export const IS_DEFAULT_PASSWORD = () => {
  return auth_user()?.isDefaultPassword;
};

export function getTimeDifference(date) {
  // Assuming that 'date' is provided in a specific format, update the format accordingly
  const dateMoment = moment(date, "DD/MM/YYYY HH:mm:ss");
  const now = moment();

  const differenceInSeconds = now.diff(dateMoment, "seconds");

  if (differenceInSeconds < 60)
    return `${Math.floor(differenceInSeconds)} seconds`;
  else if (differenceInSeconds < 3600)
    return `${Math.floor(differenceInSeconds / 60)} minutes`;
  else if (differenceInSeconds < 86400)
    return `${Math.floor(differenceInSeconds / 3600)} hours`;
  else if (differenceInSeconds < 86400 * 30)
    return `${Math.floor(differenceInSeconds / 86400)} days`;
  else if (differenceInSeconds < 86400 * 30 * 12)
    return `${Math.floor(differenceInSeconds / 86400 / 30)} months`;
  else return `${(differenceInSeconds / 86400 / 30 / 12).toFixed(1)} years`;
}

export const getSkillHelper = (skillKey, opportunity) => {
  const skillSet = opportunity?.opportunitySkill
    ?.filter((value) => value?.type === skillKey)
    ?.map((skill) => skill?.skill?.name);
  return skillSet;
};

/* GetOpportunity Commit Time */
export const getOpportunityCommitTime = (commit_time) => {
  if ([undefined, null, ""].includes(commit_time) || commit_time < 5) {
    return <span>&lt;5%</span>;
  } else {
    return <span>{commit_time}%</span>;
  }
};

export const isString = (str) => {
  try {
    return typeof str === "string";
  } catch (e) {
    return false;
  }
};

export const PARSE_IMG_URL = (baseUrl, link) => {
  if (isString(link) && (link.includes("http") || link.includes("https"))) {
    if (link.includes("amazonaws.com")) {
      const token = localStorage.getItem("jwt_token");

      return `${URL_CONFIG.DEV_URL}upload/image?url=${link}&token=${token}`;
    }
    return link;
  }

  return baseUrl + link;
};

export const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const isSupportedFileType = (mimeType) => {
  const supportedMimeTypes = {
    "audio/mpeg": "mp3",
    "video/mp4": "mp4",
  };

  return Object.keys(supportedMimeTypes).includes(mimeType);
};

export const formatTimeInMin = (seconds) => {
  // Ensure the input is a non-negative number
  if (typeof seconds !== "number" || seconds < 0) {
    throw new Error("Input must be a non-negative number");
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Use Math.floor to discard milliseconds

  // Pad seconds with a leading zero if necessary
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // Return the formatted time
  return `${minutes}:${formattedSeconds}`;
};
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const getAllActionByParams = async (params) => {
  const { companyId, projectId, meetingId, userId } = params;

  let id = null;
  let type = null;

  if (companyId && projectId && meetingId) {
    id = meetingId;
    type = "meetings";
  } else if (companyId && projectId) {
    id = projectId;
    type = "projects";
  } else if (companyId) {
    id = companyId;
    type = "companies";
  } else if (userId) {
    id = userId;
    type = "users";
  }
  if (id && type) {
    return await getAllActionLogById(`${id}?type=${type}`);
  } else {
    return {
      status: 1,
      message: "Data Fetch SuccessFully.",
      data: [],
    };
  }
};

export const fetchAdminUsers = async () => {
  const res = await companyAdmins();
  if (res?.status) {
    const adminUsers = res?.data?.reduce((acc, user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      acc[user.id] = fullName;
      return acc;
    }, {});

    return adminUsers;
  } else {
    return {};
  }
};
