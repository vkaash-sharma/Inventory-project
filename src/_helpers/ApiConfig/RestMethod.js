import API_AUTH from '../ApiConfig/API_AUTH'

export const RestMethod = {
    GET,
    POST,
    PUT,
    DELETE
};

/**
 * 
 * @GET {*} url 
 * @param {*} options 
 */

async function GET(url, options = {}) {
    
    const response = await API_AUTH.get(url, { ...options });
    return response;
}

/**
 * 
 * @POST {*} url 
 * @param {*} data 
 * @param {*} options 
 */
async function POST(url, data, options = {}) {
    const response = await API_AUTH.post(url, data, { ...options });
    return response;
}

/**
 * 
 * @PUT {*} url 
 * @param {*} data 
 * @param {*} options 
 */
async function PUT(url, data, options = {}) {
    const response = await API_AUTH.put(url, data, { ...options });
    return response;
}

/**
 * 
 * @DELETE {*} url 
 * @param {*} options 
 */

async function DELETE(url, options = {}) {
    const response = await API_AUTH.delete(url, { ...options });
    return response;
}

