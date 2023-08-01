import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "../components/auth/signup";
import LoginForm from "../components/auth/login";
import Error404Page from "../components/errors/error404Page";
import Cookies from "universal-cookie";
import MainLayoutRoutes from "./mainLayoutRoutes.js";
const cookies = new Cookies();

function AuthLayoutRoutes() {
  const [jwtToken, setJwtToken] = useState(cookies.get("token"));

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              <Signup
                token={jwtToken}
                onChangeToken={(newToken) => setJwtToken(newToken)}
              />
            }
          />
          <Route
            path="/"
            element={
              <LoginForm
                token={jwtToken}
                onChangeToken={(newToken) => setJwtToken(newToken)}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginForm
                token={jwtToken}
                onChangeToken={(newToken) => setJwtToken(newToken)}
              />
            }
          />
          <Route path="/404" element={<Error404Page />} />
          <Route path="*" element={<MainLayoutRoutes token={jwtToken} />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default AuthLayoutRoutes;
