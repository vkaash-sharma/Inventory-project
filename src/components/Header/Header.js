import logo from "../../Assets/Images/logo.png";
import Container from "react-bootstrap/Container";
import { Badge, Button, Dropdown, Figure, Image } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import UserPic from "../../Assets/Images/user-pic.jpg";
import "./header.scss";
import { useEffect, useState } from "react";

function Header() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState([]);
  const [profilePic, setProfilePic] = useState([]);

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("auth_user"));
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setEmail(currentUser.email);
    setProfilePic(currentUser.profilePic);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <header className="topHeader">
      <Container>
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/">
            <img src={logo} className="mainLogo" alt="logo" />
          </Link>

          <div className="d-flex align-items-center"> 
            <Link to="/create-opportunity" className="btn btn-secondary-outline addIcon">Create opportunity</Link>
            <div className="notification">
              <Button variant="outline-dark">
                <Badge>9</Badge>
              </Button>  
            </div>  
            <Dropdown className="headerUserProfile">
              <Dropdown.Toggle>
                <Figure>
                  <Image src={profilePic} roundedCircle />
                </Figure>
                <div className="userInfo">
                  <h4>
                    {firstName} {lastName}
                  </h4>
                  <span>{email}</span>
                 </div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
