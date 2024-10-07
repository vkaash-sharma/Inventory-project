import { RestMethod } from "../_helpers/ApiConfig/RestMethod";

export const getAllProject = async (filter) => {
  try {
    let url = "/projects/all-projects";
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

export const getAllProjectByCompanyId = async (id) => {
  try {
    let url = "/projects/all-projects-companyId/" + id;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

export const projectById = async (id , filter) => {
  try {
    let url = "/projects/project-by-id/" + id;
    if (filter) url += "?" + filter;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

export const createProject = async (data) => {
  try {
    let url = "/projects/create";
    const response = await RestMethod.POST(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

export const editProject = async (id, data) => {
  try {
    let url = "/projects/edit-project/" + id;
    const response = await RestMethod.PUT(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

//Meeting Service

export const getAllProjectMeetingByProjectId = async (filter) => {
  try {
    let url = "/meetings/meeting-by-companyId";
    if (filter) url += "?" + filter;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const createMeetings = async (data) => {
  try {
    let url = "/meetings/create";
    const response = await RestMethod.POST(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const viewMeetingById = async (id , filter) => {
  try {
    let url = "/meetings/meeting-by-id/" + id;
    if(filter) url = url + '?' + filter;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

export const upateMeetingById = async (id, data) => {
  try {
    let url = "/meetings/edit/" + id;
    const response = await RestMethod.PUT(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const upateMeetingTaskById = async (data) => {
  try {
    let url = "/meetingTask/create";
    const response = await RestMethod.POST(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getMeetingTaskById = async (id) => {
  try {
    let url = "/meetingTask/getAllTask/" + id;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getUserSuggestById = async (id) => {
  try {
    let url = "/meetings/suggestedUser/" + id;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getFAQByMeetingId = async (id) => {
  try {
    let url = "/meetingFAQs/faq/" + id;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getAllUserMeeting = async (id) => {
  try {
    let url = "/meetings/all-user-meetings/" + id;
    const response = await RestMethod.GET(url);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const UpdateSpeakerInMeeting = async (id, data) => {
  try {
    let url = "/meetingdoc-facts/speaker-details/" + id;
    const response = await RestMethod.PUT(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const QueryMeetingChat = async (id, data) => {
  try {
    let url = "/meetingFAQs/create-faq/" + id;
    const response = await RestMethod.POST(url, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};