import FormInputText from "../../components/Form/FormInputText/FormInputText";
import Select from "react-select";
import { useState, useEffect } from "react";
import { Card, Col, Form, Button, Row } from "react-bootstrap";
import { companyFormLabel, initialCompanyForm } from "./DATA";
import { useNavigate, useParams } from "react-router-dom";
import { companyAdmins } from "../../services/UserService/UserService";
import toastr from "toastr";
import {
  createCompany,
  editCompany,
  getCompanyById,
} from "../../services/companyService";
import { uploadFileOnS3New } from "../../services/S3Service";
import {
  AiOutlineClose,
  AiOutlineCloudUpload
} from "react-icons/ai";
import { PARSE_IMG_URL, auth_user } from "../../_helpers/helper";
import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";

const AddEditCompany = () => {
  const { companyId, id, projectId, meetingId } = useParams();
  const [form, setForm] = useState({ ...initialCompanyForm });
  const [error, setError] = useState({});
  const [adminUser, setAdminUsers] = useState([]);
  const [filterAdminUser, setfilterAdminUser] = useState([]);
  const [fileName, setFileName] = useState(""); // State for the file name
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEdit, setIsEdit] = useState(companyId ? false : true);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const onChangeChart = (selectedOptions, name) => {
    setForm((prevForm) => ({ ...prevForm, [name]: selectedOptions }));
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!form?.name) {
      errors.name = "Company name is required.";
    }
    if (!form?.shortName) {
      errors.shortName = "Short name is required.";
    }
    if (form?.companyAdmins.length === 0) {
      errors.companyAdmins = "At least one company admin is required.";
    }
    if (!form?.logo) {
      errors.logo = "logo is required.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    const { name, shortName, companyAdmins, logo } = form;
    const payload = {
      name: name,
      shortName: shortName,
      logo: logo,
      companyAdmins: companyAdmins?.map((el) => el.value),
    };
    const res = isEdit
      ? await createCompany(payload)
      : await editCompany(companyId, payload);
    if (res?.status) {
      toastr.success(res?.message);
      navigate(-1);
    } else {
      toastr.error(res?.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    (async () => {
      const res = await companyAdmins();
      if (res?.status) {
        const formattedData = res?.data?.map((el) => ({
          label: `${el?.firstName} 
          ${el?.lastName}`,
          value: el?.id,
        }));
        setAdminUsers(formattedData);
        setfilterAdminUser(formattedData);
      } else {
        toastr.error(res?.message);
      }
    })();
  }, []);
  const getCompany = async (companyId) => {
    const res = await getCompanyById(companyId);
    if (res?.status) {
      const { name, shortName, companiesAdmins, logo } = res?.data;
      setForm((prev) => {
        const data = {
          ...prev,
          companyAdmins: [],
        };
        return data;
      });

      setForm((prev) => {
        const data = {
          ...prev,
          name: name,
          logo: logo,
          shortName: shortName,
          companyAdmins: companiesAdmins?.map((el) => ({
            label: `${el?.userDetails?.firstName} 
            ${el?.userDetails?.lastName}`,
            value: el?.userDetails?.id,
          })),
        };

        return data;
      });
      setSelectedFile(logo);
    } else {
      toastr.error(res?.message);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      getCompany(companyId);
    }
  }, [isEdit, companyId]);

  const onChangeFile = async ({ target }) => {
    const file = target.files[0];
    if (file) {
      setFileName(file.name);
      const s3UrlData = await uploadFileOnS3New(
        file,
        "image/png",
        "companies",
        "logos"
      );

      setSelectedFile(s3UrlData?.s3Url);
      setForm((prev) => {
        const data = { ...prev, logo: s3UrlData?.s3Url };

        return data;
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
    setForm((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  return (
    <div className="companySec container wrapperSec">
      <div className="formWrapper">
        <Row className="justify-content-center">
          <Col lg={5}>
            <Card>
              <div className="formMainDiv">
                <div className="cardTitle">
                  <h6>{`${companyId ? "Edit" : "Add"} Company`}</h6>
                </div>
                <div className="uploadFileBtn">
                  <label className="form-label-input">Company Logo</label>
                  <div className="uploadLogoSec">                 
                  <input
                    className="uploadFile"
                    onChange={onChangeFile}
                    id="upload-single-file"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }} // hide the default file input
                  />
                  
                  {selectedFile && (
                    <div className="file-info">
                      <img
                        src={PARSE_IMG_URL(URL_CONFIG.DEV_URL, selectedFile)}
                        alt="Company Logo" />
                      <AiOutlineClose
                        onClick={handleRemoveFile}
                        className="file-remove-icon"
                      />
                   
                    </div>
                  )}
                  <div className="uploadBtn">
                    <label htmlFor="upload-single-file" className="companyLogoIcon">
                      <AiOutlineCloudUpload /> Upload Company Logo
                    </label>
                    {error?.logo && (
                <div className="text-danger mt-1">{error?.logo}</div>
              )}
                  </div>
                </div>
                </div>
                <Form className="pt-4" onSubmit={handleSubmit}>
                  <div className="formInnerSec">
                    <FormInputText
                      label={companyFormLabel.name}
                      name="name"
                      value={form?.name}
                      onChange={onChange}
                      error={error?.name}
                    ></FormInputText>

                    <FormInputText
                      label={companyFormLabel.shortName}
                      name="shortName"
                      value={form?.shortName}
                      onChange={onChange}
                      error={error?.shortName}
                    ></FormInputText>

                    <div>
                      <Form.Label className="form-label-input">
                        Company Admins
                      </Form.Label>
                      <span style={{ color: "red" }}>*</span>
                      <Select
                        isMulti
                        name="companyAdmins"
                        value={form?.companyAdmins}
                        onChange={(selectedOptions) =>
                          onChangeChart(selectedOptions, "companyAdmins")
                        }
                        options={filterAdminUser}
                        menuPortalTarget={document.body}
                        isDisabled={
                          auth_user()?.user?.userRole?.role?.level != 0
                        }
                      />

                      {error?.companyAdmins && (
                        <div className="text-danger mt-1">
                          {error.companyAdmins}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="formBtmAction">
                    <Button variant="outline-secondary" onClick={handleBack}>
                      Back
                    </Button>
                    {isEdit ? (
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    ) : (
                      <Button variant="primary" type="submit">
                        Update
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddEditCompany;
