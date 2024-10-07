import { CommmonService } from "./CommonService/CommonService";

export const uploadFileOnS3 = async (file, fileType) => {
  const { fileName, data } = await CommmonService.getSingleSignedUrl({
    fileName: file.name,
    fileType: "xlx/xlsx",
  });
  const result = await fetch(data, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  return {
    s3Url: result.url.split("?")[0],
    originalname: file.name,
    filename: fileName,
    size: file.size,
    type: file.type,
  };
};
export const uploadFileOnS3New = async (file, fileType , folder, groupId) => {
  const {data:{data,fileName}} = await CommmonService.getSingleSignedUrl({
    fileName: file?.name,
    fileType:  file?.type,
    folder: folder,
    groupID : groupId
  });
  const result = await fetch(data, {
    method: "PUT",
    headers: {
      "ContentType": file?.type,
    },
    body: file,
  });
  return {
    s3Url: result?.url.split("?")[0],
    originalname: file?.name,
    filename: fileName,
    size: file.size,
    type: file.type,
  };
};
