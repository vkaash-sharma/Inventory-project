import Dashboard from "../_pages/Dashboard/Dashboard";
import ChangePassword from "../_pages/Login/ChangePassword";
import AddEditCompany from "../_pages/ManageCompany/AddEditCompany";
import { CompanyView } from "../_pages/ManageCompany/CompanyView";
import { ManageCompany } from "../_pages/ManageCompany/ManageCompany";
import AddEditMeeting from "../_pages/ManageMeeting/AddEditMeeting";
import ViewMeeting from "../_pages/ManageMeeting/ViewMeeting";
import AddEditProject from "../_pages/ManageProject/AddEditProject";
import { ManageProject } from "../_pages/ManageProject/ManageProject";
import { ManageProjectView } from "../_pages/ManageProject/ManageProjectView";
import { TabsComponent } from "../_pages/ManageMeeting/MeetingView/MeetingViewTabs";
import EditUserProfile from "../_pages/User/EditUserProfile";
import UserProfileView from "../_pages/User/UserProfileView";
import { MeetingEditTabs } from "../_pages/ManageMeeting/MeetingEdit/MeetingEditTabs";
import { ManageUserMeeting } from "../_pages/ManageUserMeeting/ManageUserMeeting";
import { UserView } from "../_pages/UserList/UserView";
import { Users } from "../_pages/UserList/users";

const RoutePermission = [
  {
    path: "/users",
    element: <Users />,
    isAdminAccess: true,
  },
  {
    path: "/user/view",
    element: <UserProfileView />,
    isAdminAccess: false,
  },
  {
    path: "/user/change-password",
    element: <ChangePassword />,
    isAdminAccess: false,
  },
  {
    path: "/companies",
    element: <ManageCompany />,
    isAdminAccess: false,
  },
  {
    path: "/user/edit",
    element: <EditUserProfile />,
    isAdminAccess: false,
  },
  {
    path: "/company/create",
    element: <AddEditCompany />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/edit/",
    element: <AddEditCompany />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project",
    element: <AddEditCompany />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/view/",
    element: <CompanyView />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/add",
    element: <AddEditProject />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/edit/:id",
    element: <AddEditProject />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/view/:projectId",
    element: <ManageProjectView />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/:projectId/meeting/add",
    element: <AddEditMeeting />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/:projectId/meeting/view/:meetingId",
    element: <TabsComponent />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/project/:projectId/meeting/edit/:meetingId",
    element: <MeetingEditTabs />,
    isAdminAccess: false,
  },
  {
    path: "/company/:companyId/user-meeting",
    element: <ManageUserMeeting />,
    isAdminAccess: false,
  },
  {
    path: "/user/views/:userId",
    element: <UserView />,
    isAdminAccess: false,
  },
];

export default RoutePermission;
