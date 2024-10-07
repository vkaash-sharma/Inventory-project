import { RestMethod } from "../_helpers/ApiConfig/RestMethod";

export const getAllCompany = async (filter) => {
  try {
    const response = await RestMethod.GET(
      "/companies/all-companies" + (filter || "")
    );
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const createCompany = async (data) => {
  try {
    const response = await RestMethod.POST("/companies/create", data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const getCompanyById = async (id) => {
  try {
    const response = await RestMethod.GET("/companies/company-by-id/" + id);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
export const editCompany = async (id, data) => {
  try {
    const response = await RestMethod.PUT("/companies/update/" + id, data);
    return response.data;
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};

export const getCompanyByUserId = async (id, companiesAccess) => {
  try {
    const response = await getAllCompany();
    return {
      status: 1,
      statusType: "success",
      message: "Companies Found Successfully",
      data: response?.data?.filter((el) => {
        const id = el?.id;
        return id && companiesAccess.includes(id);
      }),
    };
  } catch (error) {
    console.error("Error detected while fetching data from api");
    return null;
  }
};
