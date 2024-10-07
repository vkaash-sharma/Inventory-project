import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Form, Image, Breadcrumb, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCompany, getCompanyById } from "../../services/companyService";
import logo from "../../Assets/Images/logo2.png";
import { IoIosArrowBack, IoMdArrowRoundBack } from "react-icons/io";

import toastr from "toastr";
import { initialCompanyForm } from "./DATA";
import { ManageProject } from "../../_pages/ManageProject/ManageProject";
import { PARSE_IMG_URL } from "../../_helpers/helper";
import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";
import CustomBreadcrumb from "./CustomBreadcrumb";

export const CompanyView = () => {
  const { companyId } = useParams();
  const [companyList, setCompanyList] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initialCompanyForm });

  const getCompany = async (companyId) => {
    const res = await getCompanyById(companyId);
    if (res?.status) {
      const { name, shortName, companiesAdmins, logo } = res?.data;
      setForm((prev) => {
        const data = {
          ...prev,
          name: name,
          shortName: shortName,
          companyAdmins: companiesAdmins,
          logo: logo,
        };

        return data;
      });
      setCompanyList(res.data)
    } else {
      toastr.error(res?.message);
    }
  };

  useEffect(() => {
    getCompany(companyId);
  }, [companyId]);
  return (
    <>
      <CustomBreadcrumb
        backLink="/companies"
        items={[
          { label: 'Companies List', link: '/companies' },
          { label: 'Details', active: true }
        ]}
      />

      <div className="companySec container">
        <Row>
          <Col md={3}>
            <Card className="companySortInfo">
              <div className="companySortInfoInner">
                <div className="recommendedSec">
                  <Row>
                    <Col lg={12}>
                      <div className="imageCont">
                        <Image
                          crossOrigin="anonymous"
                          src={PARSE_IMG_URL(URL_CONFIG.DEV_URL, form.logo)}
                          className="companyLogoImage"
                        // roundedCircle={true}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Form.Group className="mb-4">
                        <Form.Label required>
                          Company Name
                        </Form.Label>
                        <p>{form?.name}</p>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label required>
                          Short Name
                        </Form.Label>
                        <p>{form?.shortName}</p>
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label required>
                          Company Admins
                        </Form.Label>
                        <p>
                          {form?.companyAdmins?.map((el, index) => (
                            <span key={el.companyId}>
                              {el.userDetails?.firstName} {el.userDetails?.lastName}
                              {index < form.companyAdmins.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={9}>
            <ManageProject companyList={companyList} />
          </Col>
        </Row>
      </div>
    </>
  );
};
