import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyByUserId } from "../../services/companyService";
import toastr from "toastr";
import CustomBreadcrumb from "../../_pages/ManageCompany/CustomBreadcrumb";
import { ManageUserProjectAndCompany } from "./ManageUserProjectAndCompany";
import { initialUserDetailsForm } from "./DATA";
import UserProfile from "./UserProfile";
import { viewUserById } from "../../services/UserService/UserService";
import { isLoginSuperAdmin } from "../../services/JwtAuthService";
import { ActionLog } from "../../components/Common/ActionLog/ActionLog";

export const UserView = () => {
  const { userId } = useParams();
  const [companyList, setCompanyList] = useState([]);
  const [form, setForm] = useState({ ...initialUserDetailsForm });

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await getCompanyByUserId(
        userId,
        form?.UserCompanyAccess?.length > 0
          ? form?.UserCompanyAccess?.map((el) => el?.companyId)
          : []
      );
      if (response.status) {
        setCompanyList(response?.data);
      }
    };

    fetchCompanies();
  }, [form, form.UserCompanyAccess]);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const response = await viewUserById(+userId);
      if (response?.status) {
        setForm(response?.data?.user);
      }
    };
    fetchLoggedUser();
  }, [userId]);

  return (
    <>
      <CustomBreadcrumb
        backLink="/companies"
        items={[
          { label: "Users List", link: "/users" },
          { label: "Details", active: true },
        ]}
      />
      <div className="companySec container">
        <Row>
          <UserProfile id={userId} form={form} setForm={setForm} />
          <Col md={9}>
            <ManageUserProjectAndCompany companyList={companyList} />
            {isLoginSuperAdmin() && (
              <div style={{ marginTop: "21px" }}>
                <ActionLog />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
