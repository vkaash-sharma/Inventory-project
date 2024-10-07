/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import jwtAuthService from "../../services/JwtAuthService";
import { AwsCognitoServices } from "../../services/AwsCognitoServices/AwsCognitoServices";
import toastr from "toastr";

const AwsCognito = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {


      if (!searchParams.get("code")) return;

      const response = await AwsCognitoServices.login({
        code: searchParams.get("code"),
        isMobile: 0,
      });
      if (!response?.status) {
        toastr.error(response?.message || "unauthorized");
        navigate("/");
      }

      let data = response?.data;
      if (data) {
        jwtAuthService.setSession(data.accessToken);
        jwtAuthService.setUser(data);
      }
      navigate("/companies");
    })();
  }, [searchParams]);

  return <></>;
};

export default AwsCognito;
