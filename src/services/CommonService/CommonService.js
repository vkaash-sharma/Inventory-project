import { RestMethod } from "../../_helpers/ApiConfig/RestMethod";

export const CommmonService = {
  uploadDocument,
  getSingleSignedUrl,
  uploadDocumentOnS3,
  getQueryParam,
};

async function uploadDocument(data) {
  try {
    const response = await RestMethod.POST("/common/document", data);
    return response.data;
  } catch (error) {
    console.log("error detected while fetching data from api");
    return null;
  }
}
async function getSingleSignedUrl(data) {
  try {
    const response = await RestMethod.POST("upload/s3UploadUrl", data);
    return response.data;
  } catch (error) {
    console.log("error detected while fetching data from api");
    return null;
  }
}
async function uploadDocumentOnS3({ url, data }) {
  try {
    const response = await RestMethod.PUT(url, data);
    return response.data;
  } catch (error) {
    console.log("error detected while fetching data from api");
    return null;
  }
}


function getQueryParam(key) {
  const query = new URLSearchParams(window.location.search);

  return decodeURIComponent(query.get(key));
}
