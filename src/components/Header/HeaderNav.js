import logo from "../../Assets/Images/logo1.png";
import Container from "react-bootstrap/Container";
import { Badge, Button, Dropdown, Image, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import UserDefaultPic from "../../Assets/Images/user-default.png";
import "./header.scss";
import { IS_MOBILE, auth_user, fullName } from "../../_helpers/helper";
import { logout } from "../../services/logOutService";
import { logoutUser } from "../../redux/actions/UserActions";
import { connect } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  readNotification,
  userNotification,
} from "../../services/NotificationServices";
import { isLogin, isLoginSuperAdmin } from "../../services/JwtAuthService";
import NotificationListPart from "../../components/NotificationListPart";
import { navLinks } from "./DATA";

function HeaderNav({ removeUserData, role }) {
  const userData = auth_user();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const [notifications, setNotifications] = useState("");

  const getAllUserNotifications = useCallback(async () => {
    let response = await userNotification();
    if (response?.status) {
      setNotifications(response.data);
    }
  }, []);

  useEffect(() => {
    if (isLogin()) {
      getAllUserNotifications();
    }
  }, [getAllUserNotifications, location]);

  const [unreadLength, setUnreadLength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadLength(
      Array.isArray(notifications) &&
        notifications?.filter((d) => {
          return d.readStatus === 0;
        }).length
    );
  }, [notifications]);

  const signOut = (e) => {
    if (removeUserData) removeUserData();
    const res = logout();

    res && navigate(IS_MOBILE() ? "/mobile/auth/login" : "/auth/login");
  };

  // const allNotification =
  //   Array.isArray(notifications) && notifications.length > 0
  //     ? notifications?.map((notification) => {
  //         return notification.id;
  //       })
  //     : null;

  // const handleRead = async (notificationList) => {
  //   const response = await readNotification({
  //     notificationIds: notificationList,
  //   });
  //   if (response?.status) {
  //     getAllUserNotifications();
  //   }
  // };

  const isTabActive = (activeKeys) => {
    const url = location.pathname;
    return activeKeys.some((key) => url.includes(key));
  };
  return (
    <header className="topHeader">
      <Container>
        <div className="d-flex align-items-center justify-content-between">
          <Link to={`/companies`}>
            <img src={logo} className="mainLogo customLogoSize" alt="logo" />
          </Link>
          <Navbar expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                {navLinks.map((link, index) => (
                  <NavLink
                    to={link.path}
                    key={index}
                    className={({ isActive }) =>
                      isTabActive(link.activeKey)
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    {(link?.name == "Users" && isLoginSuperAdmin()) ||
                    link?.name == "Companies"
                      ? link.name
                      : ""}
                  </NavLink>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {auth_user() && (
            <div className="d-flex align-items-center">
              <Dropdown className="headerUserProfile">
                <Dropdown.Toggle>
                  <div className="profileShortInfoSec">
                    <div
                      className="profilePic"
                      style={{
                        border: `2px solid ${isOnline ? "green" : "red"}`,
                        borderRadius: "50px",
                      }}
                    >
                      <Image
                        src={userData?.profilePicture || UserDefaultPic}
                        roundedCircle
                      />
                    </div>
                  </div>
                  <div className="userInfo">
                    <h4>{fullName(userData)}</h4>
                    <span>{userData?.email}</span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate(`/user/view`)}>
                    View User
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate(`/user/edit`)}>
                    Edit User
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => navigate(`/user/change-password`)}
                  >
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item className="logOutLink" onClick={signOut}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}

const mapStateToProps = (state) => ({
  role: state.role.role.role,
});

const mapDispatchToProps = {
  removeUserData: logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNav);
