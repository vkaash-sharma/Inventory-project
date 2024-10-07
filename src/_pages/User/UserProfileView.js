import { Container } from "react-bootstrap";
import "../../Assets/Styles/profile.scss";
import UserProfileData1 from "./UserProfileData1";
import { useEffect, useState } from "react";
import { UserService } from "../../services/UserService/UserService";

function UserProfileView() {
  const [userData, setUserData] = useState("");
  const [endorsement, setEndorsement] = useState("");
  //getCurrentLoggedInUser
  const getCurrentLoggedInUser = async () => {
    const response = await UserService.loggedUser();

    if (response?.status) {
      setUserData(response?.data);
      setEndorsement(response?.endorsement);
    }
  };
  useEffect(() => {
    getCurrentLoggedInUser();
  }, []);
  return (
    <>
      <div className="profileScreen wrapper">
        <Container>
          <div className="profileWrapper">
            <UserProfileData1 userData={userData} endorsement={endorsement} />
          </div>
        </Container>
      </div>
    </>
  );
}

export default UserProfileView;
