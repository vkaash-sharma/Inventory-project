import "bootstrap/dist/css/bootstrap.min.css";
import "toastr/build/toastr.min.css";
import "./Assets/Styles/App.scss";
import "react-image-crop/dist/ReactCrop.css";
import "react-datepicker/dist/react-datepicker.css";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./_pages/Login/Login";
import EditProfile from "./_pages/User/EditUserProfile";
import AwsCognito from "./_pages/AwsCognito/AwsCongnito";
import PrivateRoute from "./routes/PrivateRoute";
import { Suspense } from "react";
import Register from "./_pages/Login/Register";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-loading-skeleton/dist/skeleton.css";
import ChangePassword from "./_pages/Login/ChangePassword";
import ForgotPassword from "./_pages/Login/ForgotPassword";
import AccountVerification from "./_pages/Login/AccountVerification";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/callback" element={<AwsCognito />} />
          <Route
            path="/auth/reset-password/:resetToken"
            element={<ChangePassword reset />}
          />
          <Route
            path="/auth/account-verify/:verifyToken"
            element={<AccountVerification />}
          />

          <Route path="/" element={<Login />} />

          <Route
            path="/register/complete-profile"
            element={<EditProfile register completeProfile />}
          />

          <Route path="/register" element={<Register />} />

          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          <Route path="/*" element={<PrivateRoute />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
