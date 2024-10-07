import { auth_user } from "../../_helpers/helper";
import CustomCard from "../../components/Common/CustomCard";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllCompany } from "../../services/companyService";

export const ManageCompany = () => {
  const [companyList, setCompanyList] = useState([]);
  let [authUser, setAuthUser] = useState(auth_user()?.user);


  const fetchData = async () => {
    const response = await getAllCompany();
    if (!response?.status) return;
    setCompanyList(response?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="companySec container wrapperSec">
      <div className="pageTitle">
        <h6>Companies List</h6>
        {authUser?.userRole?.role?.level === 0 && (
          <Link className="btn addOutlineBtn" to={"/company/create"}>Add Company</Link>
        )}
      </div>

      <div className="recommendedSec">
        <Row>
          {Array.isArray(companyList) && companyList?.length ? (
            companyList?.map((item, i) => {
              return (
                <Col lg="3" key={i}>
                  <CustomCard
                    data={item}
                    title={item.shortName}
                    subTitle={item.name}
                    file={item.logo}
                    fullLink={`/company/${item?.id}/user-meeting`}
                    editLink={
                      item.isSuperAdmin ||
                        (item?.UsercompanyAccess?.length > 0 &&
                          item?.UsercompanyAccess[0]?.userRole === "admin")
                        ? `/company/${item?.id}/edit`
                        : false
                    }
                    i={item?.id}
                  />
                </Col>
              );
            })
          ) : (
            <p>No companies...</p>
          )}
        </Row>
      </div>
    </div>
  );
};
