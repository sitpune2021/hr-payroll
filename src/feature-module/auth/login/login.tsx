import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useDispatch } from "react-redux";
import { setAllFeatures, setAllowedFeatures } from "../../../core/data/redux/featureSlice";
import axiosClient from "../../../axiosConfig/axiosClient";
import { AUTH_LOGIN, FETCH_ALL_FEATURES, FETCH_ROLE_FEATURES } from "../../../axiosConfig/apis";
import { setUser } from "../../../core/data/redux/authSlice";
import { toast } from "../../../utils/toastUtil";
type PasswordField = "password";

const Login = () => {
  const routes = all_routes;
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState({
    "emailOrContact": "",
    "password": ""
  })

  const fetchFeatures = async () => {

    console.log("@@@@@@@@@@@@");

    try {
      const response = await axiosClient.get(FETCH_ALL_FEATURES);
      const response2 = await axiosClient.get(FETCH_ROLE_FEATURES);
      console.log(response.data);
      console.log(response2.data);
      if (response.status === 200 && response2.status === 200) {
        console.log("!!!!!!!!!!!!!!!!!!");

        dispatch(setAllFeatures(response.data));
        dispatch(setAllowedFeatures(response2.data));
      }
    } catch (error) {
      console.log(error);
    }
  }


  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [loginData, setLoginData] = useState(
    {
      "emailOrContact": "",
      "password": ""
    }
  )

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errors: any = {}
    const { emailOrContact, password } = loginData;
    const emailOrContactRegex = /^(?:\d{10}|[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})$/;

    if (!emailOrContact.trim()) {
      errors.emailOrContact = "Enter email or contact number";
    } else if (!emailOrContactRegex.test(emailOrContact.trim())) {
      errors.emailOrContact = "Enter a valid email or 10-digit contact number";
    }

    if (!password.trim()) {
      errors.password = "Enter password"
    }
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors)
      return;
    }
    try {
      const response = await axiosClient.post(AUTH_LOGIN, loginData);
      if (response.status === 200) {

        console.log(response.data, "@@@@@@@@@@@@@@@@@@@@@");
        toast('Info', 'Logged in successfully!', 'success');
        dispatch(setUser(response.data.user));

        await fetchFeatures();

        navigation(routes.adminDashboard);
      }
    } catch (error: any) {
      toast('Info', error?.response?.data?.message, 'danger'); 
      console.log(error);
    }


  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          <div className="col-lg-5">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
              <div className="bg-overlay-img">
                {/* <ImageWithBasePath src="assets/img/bg/bg-01.png" className="bg-1" alt="Img" /> */}
                {/* <ImageWithBasePath src="assets/img/bg/bg-02.png" className="bg-2" alt="Img" /> */}
                {/* <ImageWithBasePath src="assets/img/bg/bg-03.png" className="bg-3" alt="Img" /> */}
              </div>
              <div className="authentication-card w-100">
                <div className="authen-overlay-item border w-100">
                  <h1 className="text-white display-1">
                    Empowering people <br /> through seamless HR <br /> management.
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <ImageWithBasePath src="assets/img/bg/authentication-bg-01.png" alt="Img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100">
                <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
                  <div className=" mx-auto text-center">
                    <img
                    style={{height:'100px',borderRadius:'998px'}}
                      src="assets/img/logo.svg"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </div>
                  <div className="">
                    <div className="text-center mb-3">
                      <h2 className="mb-2">Sign In</h2>
                      <p className="mb-0">Please enter your details to sign in</p>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                      <div className="mb-3">
                        <label className="form-label">Email/Contact</label>
                        <div className="input-group">
                          <input
                            type="text"
                            value={loginData.emailOrContact}
                            onChange={(e) =>
                              setLoginData({ ...loginData, emailOrContact: e.target.value })
                            }
                            className={`form-control border-end-0 ${errorMessage.emailOrContact ? 'is-invalid' : ''}`}
                          />
                          <span className="input-group-text border-start-0">
                            <i className="ti ti-mail" />
                          </span>
                        </div>
                        {errorMessage.emailOrContact && <div className="text-danger mt-1">{errorMessage.emailOrContact}</div>}


                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="pass-group">
                          <input
                            type={
                              passwordVisibility.password
                                ? "text"
                                : "password"
                            }
                            className={`form-control border-end-0 ${errorMessage.password ? 'is-invalid' : ''}`}
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData({ ...loginData, password: e.target.value })
                            }
                          />
                          <span
                            className={`ti toggle-passwords ${passwordVisibility.password
                              ? "ti-eye"
                              : "ti-eye-off"
                              }`}
                            onClick={() =>
                              togglePasswordVisibility("password")
                            }
                          ></span>
                        </div>
                        {errorMessage.password && <div className="text-danger mt-1">{errorMessage.password}</div>}
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className="form-check form-check-md mb-0">
                            <input
                              className="form-check-input"
                              id="remember_me"
                              type="checkbox"
                            />
                            <label
                              htmlFor="remember_me"
                              className="form-check-label mt-0"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <div className="text-end">
                          <Link to={all_routes.forgotPassword} className="link-danger">
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                      <div className="mb-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>

                    <div className="text-center">
                      <h6 className="fw-normal text-dark mb-0">
                        Don’t have an account?
                        <Link to={all_routes.register} className="hover-a">
                          {" "}
                          Create Account
                        </Link>
                      </h6>
                    </div>
                    <div className="login-or">
                      <span className="span-or">Or</span>
                    </div>
                    <div className="mt-2">
                      <div className="d-flex align-items-center justify-content-center flex-wrap">
                        <div className="text-center me-2 flex-fill">
                          <Link
                            to="#"
                            className="br-10 p-2 btn btn-info d-flex align-items-center justify-content-center"
                          >
                            <ImageWithBasePath
                              className="img-fluid m-1"
                              src="assets/img/icons/facebook-logo.svg"
                              alt="Facebook"
                            />
                          </Link>
                        </div>
                        <div className="text-center me-2 flex-fill">
                          <Link
                            to="#"
                            className="br-10 p-2 btn btn-outline-light border d-flex align-items-center justify-content-center"
                          >
                            <ImageWithBasePath
                              className="img-fluid m-1"
                              src="assets/img/icons/google-logo.svg"
                              alt="Facebook"
                            />
                          </Link>
                        </div>
                        <div className="text-center flex-fill">
                          <Link
                            to="#"
                            className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
                          >
                            <ImageWithBasePath
                              className="img-fluid m-1"
                              src="assets/img/icons/apple-logo.svg"
                              alt="Apple"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pb-4 text-center">
                    <p className="mb-0 text-gray-9">Copyright © 2024 - Smarthr</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* toast message */}
    </div>

  );
};

export default Login;
