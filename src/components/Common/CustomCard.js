import { URL_CONFIG } from "../../_contants/config/URL_CONFIG";
import { PARSE_IMG_URL } from "../../_helpers/helper";
import React from "react";
import { Card, Dropdown, Image } from "react-bootstrap";
import { FiEdit3, FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdModeEdit, MdRemoveRedEye } from "react-icons/md";
const admin =
  "https://codefiretesting.s3.ap-south-1.amazonaws.com/companies/6cdf481f4204d626f0fa53b493000b17_20240903T110440613Z.jpg";
const CustomCard = ({
  data,
  title,
  subTitle,
  fullLink,
  file,
  editLink,
  i,
  isAdmin,
  isSuperAdminUSer,
}) => {
  return (
    <Card
      className="companyCards "
      style={{ backgroundColor: isAdmin ? "#f1ebff" : "" }}
    >
      <Link to={fullLink} className="cardLink">
        <div className="companyInfoSec">
          <div className="compLogo">
            <Image
              crossOrigin="anonymous"
              src={PARSE_IMG_URL(URL_CONFIG.DEV_URL, isAdmin ? admin : file)}
            />
          </div>
          <div className="dataSec">
            <h6>{`${title} ${isAdmin ? "(Super Admin)" : ""}`}</h6>
            <p>{subTitle}</p>
          </div>
        </div>
      </Link>

      <div className="cardActionIconBtns">
        {(data?.isSuperAdmin ||
          (data?.UsercompanyAccess?.length > 0 &&
            data?.UsercompanyAccess[0]?.userRole === "admin")) && (
          <Dropdown className="customDropDownMenu">
            <Dropdown.Toggle variant="light">
              <FiMoreVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {isSuperAdminUSer ? (
                <>
                  <Link
                    className="dropdown-item"
                    to={{
                      pathname: `/user/edit/${i}`,
                    }}
                  >
                    <MdModeEdit /> Edit
                  </Link>
                </>
              ) : (
                <>
                  {editLink && (
                    <Link
                      className="dropdown-item"
                      to={{
                        pathname: editLink,
                      }}
                    >
                      <MdModeEdit /> Edit
                    </Link>
                  )}
                  <Link
                    className="dropdown-item"
                    to={{
                      pathname: `/company/${i}/view`,
                    }}
                  >
                    <MdRemoveRedEye /> View
                  </Link>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </Card>
  );
};

export default CustomCard;
