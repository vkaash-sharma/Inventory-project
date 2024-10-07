import React, { useEffect, useState } from "react";
import { Card, Nav, Tab } from "react-bootstrap";
import { fullName } from "../../_helpers/helper";

function UserProfileData({
  userData,
}) {
  const currentLocation = window.location.pathname;
  const [activeButton, setActiveButton] = useState(1);
  const [opportunityId, setOpportunityId] = useState();

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("opportunityDetailsModal");
    } else {
      document.body.classList.remove("opportunityDetailsModal");
    }

    return () => {
      document.body.classList.remove("opportunityDetailsModal");
    };
  }, [isVisible]);

  const showOpportunityDetails = (id) => {
    setIsVisible(!isVisible);
    setOpportunityId(id);
  };
  useEffect(() => {
    window.scrollTo({
      top: window.scrollY + 170,
      behavior: "smooth",
    });
  }, [isVisible]);

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const pathWithoutId = url.pathname.replace(/\/\d+$/, "");
  return (
    <Tab.Container defaultActiveKey="Profile">
      <Card>
        <div className="profileDetailsSec">
          <div className="profileCover">
            <div className="profilePic">
              <img
                src={
                  userData?.profilePicture
                    ? userData?.profilePicture
                    : require("../../Assets/Images/user-default.png")
                }
                alt="profile-pic"
              />
            </div>
          </div>
          <h2>{fullName(userData)}</h2>
          <h4>{userData?.profile_title}</h4>
          <p>{userData?.profile_desc}</p>
        </div>
        {currentLocation === "/manager/profile" ||
        pathWithoutId === "/applicant/profile" ||
        pathWithoutId === "/manager/profile" ? (
          <div className="whoopCustomTab mt-4">
            <Nav variant="pills" justify>
              <Nav.Item>
                <Nav.Link eventKey="Profile">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Opportunities">Opportunities</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Reviews">Reviews</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        ) : (
          ""
        )}
      </Card>
      <Card>
        <Tab.Content>
          <Tab.Pane eventKey="Profile">
            <div className="profileOtherInfoSec">
              <hr className="divider" />
              <div className="otherInfoSec">
                <h5>Email</h5>
                <div>{userData?.email}</div>
              </div>
              <hr className="divider" />
              <div className="otherInfoSec">
                <h5>Mobile</h5>
                <div>{userData?.mobile}</div>
              </div>
              <hr className="divider" />
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Card>
    </Tab.Container>
  );
}

export default UserProfileData;
