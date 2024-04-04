import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../assets/js/AuthContext";

const Validate = ({ children }) => {
  const location = useLocation();
  const { accessToken } = useContext(AuthContext);
  const navigation = useNavigate(); // Obtén la función history

  useEffect(() => {
    if (!accessToken) {
      navigation("/");
    }
  }, [location.pathname]);

  return children;
};

export default Validate;
