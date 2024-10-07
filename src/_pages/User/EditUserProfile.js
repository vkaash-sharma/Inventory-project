import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../Assets/Styles/profile.scss";
import { IS_MOBILE, auth_user, fullName } from "../../_helpers/helper";
import { UserService } from "../../services/UserService/UserService";
import { isEmptyObject } from "jquery";
import { Validation } from "../../_helpers/Validation/Validation";
import toastr from "toastr";

import InputError from "../../components/Form/InputError/InputError";
import { setUserData } from "../../redux/actions/UserActions";
import JwtAuthService from "../../services/JwtAuthService";
import CropImage from "../../components/CropImage";
import { connect } from "react-redux";

export const rules = [
  {
    field_name: "firstName",
    label: "First name",
    type: "string",
    maxLength: 32,
    isRequired: true,
  },
  {
    field_name: "lastName",
    label: "Last name",
    type: "string",
    maxLength: 32,
    isRequired: true,
  },
 
  {
    field_name: "mobile",
    label: "Mobile Number",
    type: "tel",
    minLength: 10,
    isRequired: true,
  },
];
function EditProfile({
  filter,
  register,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });

  //
  const [charCount, setCharCount] = useState(0);
  const totalCount = 2024;
  const [user, setUser] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [image, setImage] = useState({ preview: "", data: "" });
  const [imgCrop, setImgCrop] = useState({
    src: "",
    showImage: false,
    cropImage: false,
    crop: {
      unit: "%",
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    },
  });
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();
  const goBack = async (e) => {
    e.preventDefault();
    if (register) {
      const data = await UserService.skipById(auth_user().id);
      if (data?.status) {
        navigate("/companies");
      }
    } else navigate(-1);
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (
        e.target.files[0]?.name &&
        !e.target.files[0]?.name?.match(
          /\.(jpg|jpeg|png|gif|svg|webp|bmp|xpm|BMP)$/
        )
      ) {
        setImageError("Please upload an image file");
        return;
      }
      setImageError("");
      const img = {
        preview: e.target.files[0]
          ? URL.createObjectURL(e.target.files[0])
          : "",
        data: e.target.files[0],
      };
      setImage(img);
      if (img?.preview) {
        setImgCrop((prev) => ({
          ...prev,
          src: img.preview,
          showImage: true,
          cropImage: true,
        }));
      } else {
        setImgCrop({
          src: "",
          showImage: false,
          cropImage: false,
        });
      }
    }
  };

  const getuser = async () => {
    const response = await UserService.loggedUser();
    if (response?.status) {
      setUser(response?.data);
    }
  };
  useEffect(() => {
    // if (!register) {
    getuser();
    // }
  }, []);

  useEffect(() => {
    if (!isEmptyObject(user)) {
      setForm({
        firstName: user.firstName ? user.firstName : "",
        lastName: user.lastName ? user.lastName : "",
        mobile: user.mobile ? user.mobile : "",
      });
      setCharCount(user.profile_desc ? user.profile_desc?.length : 0);
    }
  }, [user]);
  const onChange = ({ target: { name, value } }) => {
    if (name === "time_availability") {
      value = parseInt(value, 10);
    }

    if (name === "profile_desc") {
      setCharCount(value?.length);
    }
    setForm((prev) => {
      const data = { ...prev, [name]: value };

      return data;
    });
  };

  const checkValidation = useCallback(
    (form) => {
      /**call validation file for validation */

      let errorObj = Validation(form, rules);

      return errorObj;
    },
    [form]
  );

  const onCropImage = (src, fileName) => {
    setImgCrop((prev) => ({
      ...prev,
      src: src,
      fileName: "profile.jpg",
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const errorObj = checkValidation(form);
    setError(errorObj);
    let flag = 0;
    if (errorObj)
      Object.keys(errorObj).forEach((index) => {
        if (errorObj[index] !== "") {
          flag = 1;
        }
      });

    if (
      image?.data?.name &&
      !image?.data?.name?.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|xpm|BMP)$/)
    ) {
      toastr.error("Please select valid image.");
      flag = 1;
    }
    let errorMsg = 1;
    Object.values(errorObj)
      .filter((d) => d)
      .forEach((d, i) => {
        if (i === 0 && errorMsg && typeof d !== "object") {
          toastr.error(d);
          errorMsg = 0;
        } else if (typeof d === "object") {
          Object.values(d)
            .filter((d) => d && typeof d !== "object")
            .forEach((d, i) => {
              if (i === 0 && errorMsg) {
                toastr.error(d);
                errorMsg = 0;
              }
            });
        }
      });
    if (flag !== 0) return false;
    setIsLoading(true);
    let data1;
    if (imgCrop.src) {
      const dataImage = new FormData();
      console.log(imgCrop);
      let blob = await fetch(imgCrop.src).then((r) => r.blob());
      dataImage.append("file", blob, imgCrop.fileName);
      data1 = await UserService.userImage(dataImage);
    }
    if (imgCrop.src && !data1?.status && data1?.message) {
      toastr.warning(data1.message);
    } else if (data1?.status || !imgCrop.src) {
      let data = await UserService.updateLoggedUser({
        ...form,
      });
      if (data) {
        if (data.status) {
          setUser(data?.data);
          // JwtAuthService.setUser(data?.data);
          toastr.success(data?.message || "Profile Saved");
          navigate(`${IS_MOBILE() ? "/mobile" : ""}/companies`);
        } else if (data && data.message) {
          toastr.warning(data.message);
        }
      }
    }
    setIsLoading(false);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    delete form.firstName;
    delete form.lastName;
    delete form.profilePicture;
    const errorObj = checkValidation(form);
    setError(errorObj);
    let flag = 0;
    if (errorObj)
      Object.keys(errorObj).forEach((index) => {
        if (errorObj[index] !== "") {
          flag = 1;
        }
      });

    if (flag !== 0) return false;

    setIsLoading(true);

    let data = await UserService.createUserCompleteDetails({
      ...form,
      id: auth_user().id,
    });
    if (data) {
      if (data.status) {
        setUser(data?.data);
        // JwtAuthService.setUser(data?.data);
        toastr.success("Success");
        navigate(`/companies`);
      } else if (data && data.message) {
        toastr.warning(data.message);
      }
    }

    setIsLoading(false);
  };
  return (
    <div
      className={
        register ? "signupScreen wrapper" : "editProfileScreen wrapper"
      }
    >
      <Container>
        <Row>
          {!register && (
            <Col lg="3">
              <div className="viewProfileShortInfo">
                {/* <div className="profilePic editProfilePic"> */}
                <div
                  className={
                    image?.preview ? "w-100" : "profilePic editProfilePic"
                  }
                >
                  <CropImage
                    selectedFile={
                      user?.profilePicture ||
                      require("../../Assets/Images/user-default.png")
                    }
                    onCropImage={onCropImage}
                    imgCrop={imgCrop}
                    setImgCrop={setImgCrop}
                    handleFileSelect={handleFileChange}
                  />
                </div>
                <div className="userInfo">
                  {imageError && <p className="text-danger">{imageError}</p>}
                  <h6>{fullName(user)}</h6>
                  <span>{user?.profile_title}</span>
                  <div className="pt-4">
                    <Link to="/user/view" className="btn btn-secondary-outline">
                      View profile
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          )}
          <Col lg={register ? "" : "9"}>
            <Card>
              <div className="profileFormSec">
                {register ? (
                  <h1>Complete details</h1>
                ) : (
                  <h1>{fullName(user)}</h1>
                )}
                <Form className="pt-3 whoopForm">
                  <div className="formInnerSec">
                    {!register && (
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        {/* =====================firstName======================*/}
                        <div className="row row-cols-2 g-2">
                          <div className="col">
                            <Form.Control
                              placeholder="First name"
                              name="firstName"
                              onChange={onChange}
                              value={form?.firstName}
                            />
                            <InputError
                              submitted={submitted}
                              error={error}
                              name="firstName"
                            />
                          </div>
                          <div className="col">
                            {/* ================lastName======================== */}
                            <Form.Control
                              placeholder="Last name"
                              name="lastName"
                              onChange={onChange}
                              value={form?.lastName}
                            />
                            <InputError
                              submitted={submitted}
                              error={error}
                              name="lastName"
                            />
                          </div>
                        </div>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your mobile number"
                        name="mobile"
                        onChange={onChange}
                        value={form?.mobile}
                      />
                      <InputError
                        submitted={submitted}
                        error={error}
                        name="mobile"
                      />
                    </Form.Group>
                  </div>
                  <div className="formBtnGroup">
                    <Button
                      variant="primary"
                      className="tickIcon completeProfileButton"
                      disabled={isLoading}
                      onClick={register ? onRegister : onSubmit}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    filter: state.filter,
  };
};

export default connect(mapStateToProps, { setUserData })(EditProfile);
