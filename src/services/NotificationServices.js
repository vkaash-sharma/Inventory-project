import { RestMethod } from "../_helpers/ApiConfig/RestMethod";

export const userNotification = async (id, filter) => {
  let url = "/notification/notification-list";

  if (filter) url += "?" + filter;

  try {
    // const response = await RestMethod.GET(url);
    // return response.data;
    return {status : 1,message:"success",data:[]}
  } catch (error) {
    return null;
  }
};

export const readNotification = async (data) => {
  let url = "/notification/read-notification";
  // if (filter) url += '?' + filter;
  try {
    const response = await RestMethod.POST(url, data);
    return response.data;
  } catch (error) {
    return null;
  }
};
