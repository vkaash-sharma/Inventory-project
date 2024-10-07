import { RestMethod } from "../../_helpers/ApiConfig/RestMethod";

export const AwsCognitoServices = {
  login,
};

async function login(data) {
  try {
    const response = await RestMethod.POST("/auth/login", data);
    return response.data;
  } catch (error) {
    console.log("error detected while fetching data from api");
    return null;
  }
}