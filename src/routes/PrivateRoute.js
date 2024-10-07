// PrivateRoute.js
import React, { useRef } from 'react';
import { useLocation, useRoutes } from "react-router-dom";
import RoutePermission from "./RoutePermission";
import { RequireAuth } from "../Auth/RequireAuth";
import HeaderNav from "../components/Header/HeaderNav";
import { LocomotiveScrollProvider } from 'react-locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { isLoginSuperAdmin } from "../services/JwtAuthService";

function PrivateRoute() {
  const containerRef = useRef(null);
  const location = useLocation();
  const current_path = location.pathname.split("/")[1] || "";
  const filteredRoutes = RoutePermission?.filter((route) => {
    if (route.isAdminAccess && !isLoginSuperAdmin()) {
      return isLoginSuperAdmin();
    }
    return true;
  });
  return (
    <RequireAuth routes={RoutePermission}>
      <HeaderNav />

      <LocomotiveScrollProvider
        options={{
          smooth: true,
          // ... Locomotive Scroll options
        }}
        watch={[]}
        containerRef={containerRef}
      >
        <main data-scroll-container ref={containerRef}>
          <div data-scroll-section className={`contentWrapper ${current_path}`}>
            <main className="contentSection main-content simple-scrollbar">
              <div className="contentSectionInner">
                {useRoutes(RoutePermission)}
              </div>
            </main>
          </div>
        </main>
      </LocomotiveScrollProvider>


    </RequireAuth>
  );
}

export default PrivateRoute;
