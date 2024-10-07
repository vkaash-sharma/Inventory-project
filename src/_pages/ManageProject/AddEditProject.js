import FormInputText from "../../components/Form/FormInputText/FormInputText";
import { useState, useEffect } from "react";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import { projectFormLabel, projectInitalForm } from "./DATA";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";

import {
  createProject,
  editProject,
  projectById,
} from "../../services/projectService";
import { getCompanyById } from "../../services/companyService";

const AddEditProject = () => {
  const { companyId, id } = useParams();
  const [form, setForm] = useState({ ...projectInitalForm });
  const [companyData, setCompanyData] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const fetchData = async () => {
    if (id) {
      let resp = await projectById(id ,`companyId=${companyId}`);
      setForm(resp.data);
    }
  };
  const getCompanyByIdFn = async () => {
    let res = await getCompanyById(companyId);
    setCompanyData(res.data);
  };

  useEffect(() => {
    fetchData();
    getCompanyByIdFn();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!form?.projectName) {
      errors.projectName = "Project Name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    let obj = {
      projectName: form?.projectName,
      companyId: companyId,
    };

    let response = id ? await editProject(id, obj) : await createProject(obj);
    if (response?.status) {
      toastr.success(response?.message);
      navigate(-1);
    } else {
      toastr.error(response?.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container wrapperSec">
      <Row className="justify-content-center">
        <Col sm={8} md={5}>
          <Card>
            <div className="formMainDiv">
              <div className="cardTitle">
                 <h6>{`${id ? "Edit" : "Add"} Project`}</h6>
              </div>
          
            <Form onSubmit={handleSubmit}>
              <div className="formInnerSec">
                <FormInputText
                  label="Company Name"
                  name="projectName"
                  disabled
                  value={companyData?.name}
                ></FormInputText>
                <FormInputText
                  label={projectFormLabel.name}
                  name="projectName"
                  value={form?.projectName}
                  onChange={onChange}
                  error={error?.projectName}
                  required
                ></FormInputText>
              </div>
              <div className="formBtmAction pt-1">
                <Button variant="outline-secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" type="submit">
                  {!id ? "Create " : "Update"}
                </Button>
              </div>
            </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddEditProject;
