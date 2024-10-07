import { useEffect, useState } from "react";
import { Card, Col, Row, Form, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import toastr from "toastr";

import { projectInitalForm } from "./DATA";
import { ManageMeeting } from "../../_pages/ManageMeeting/ManageMeeting";
import { getCompanyById } from "../../services/companyService";
import { projectById } from "../../services/projectService";
import CustomBreadcrumb from "../../_pages/ManageCompany/CustomBreadcrumb";
import { PARSE_IMG_URL } from "../../_helpers/helper";
import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";

export const ManageProjectView = () => {
  const { companyId, projectId } = useParams();
  const [form, setForm] = useState({ ...projectInitalForm });

  useEffect(() => {
    (async () => {
      await fetchCompanyDetails(companyId);
      await fetchProjectDetails(projectId);
    })();
  }, [companyId, projectId]);

  const fetchCompanyDetails = async (companyId) => {
    const res = await getCompanyById(companyId);
    if (res?.status) {
      const { name, shortName, companiesAdmins } = res?.data;
      setForm((prev) => ({
        ...prev,
        name,
        shortName,
        companyAdmins: companiesAdmins,
        logo: "",
      }));
    } else {
      toastr.error(`Failed to load company details: ${res?.message}`);
    }
  };

  const fetchProjectDetails = async (projectId) => {
    if (!projectId) return;
    const res = await projectById(projectId, `companyId=${companyId}`);
    if (res?.status) {
      setForm((prev) => ({ ...prev, ...res.data }));
    } else {
      toastr.error(`Failed to load project details: ${res?.message}`);
    }
  };

  return (
    <>
      <CustomBreadcrumb
        backLink={`/company/${companyId}/view`}
        items={[
          { label: 'Companies List', link: '/companies' },
          { label: 'Projects List', link: `/company/${companyId}/view` },
          { label: 'Meetings', active: true }
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
                          src={PARSE_IMG_URL(
                            URL_CONFIG.DEV_URL,
                            form?.projectCompany?.logo
                          )}
                          className="companyLogoImage"
                          // roundedCircle={true}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Form.Group className="mb-4">
                        <Form.Label required>Project Name</Form.Label>
                        <p>{form?.projectName || "N/A"}</p>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label required>Company Name</Form.Label>
                        <p>{form?.projectCompany?.name || "N/A"}</p>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label required>Short Name</Form.Label>
                        <p>{form?.projectCompany?.shortName || "N/A"}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={9}>
            <ManageMeeting projectId={projectId} companyId={companyId} />
          </Col>
        </Row>
      </div>
    </>
  );
};
