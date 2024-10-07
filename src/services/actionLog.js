import { RestMethod } from "../_helpers/ApiConfig/RestMethod";

export const getAllActionLogById = async (filter) => {
  try {
    console.log("getAllActionLogByIdAsdsad", filter);
    let url = "/actions/actionLogs/";
    if (filter) {
      url += filter;
    }
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getAllActionLog = async (id, filter) => {
  try {
    let url = "/actions/logs/" + id;
    if (filter) {
      url += filter?.trim();
    }
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
