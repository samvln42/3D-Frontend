import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./loginUser.css";
import { MdArrowBack } from "react-icons/md";
// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

const LoginUser = () => {
  const login_en = "Login";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorText, set_errorText] = useState("");
  const MySwal = withReactContent(Swal);

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePass = (e) => {
    const value = e.target.value;
    setPass(value);
  };

  const Login = (e) => {
    if (!email) {
      MySwal.fire({
        text: "Please fill the email!",
        icon: "question",
      });
      return;
    }
    if (!pass) {
      MySwal.fire({
        text: "Please fill the password!",
        icon: "question",
      });
      return;
    }

    e.preventDefault(); // Prevent the default form submission behavsior
    let data = JSON.stringify({
      email: email,
      password: pass,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/user/signin",

      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((res) => {
        const result = res.data;
        const user = {
          email: result.email,
          image: result.image,
          is_admin: result.is_admin,
          store_id: result.store_id,
          origin_store_name: result.origin_store_name,
          user_id: result.user_id,
          user_name: result.user_name,
          is_first: result.is_first,
        };
        const token = result.token.access;
        if (token) {
          window.localStorage.setItem("token", token);
        }
        window.localStorage.setItem("user", JSON.stringify(user));
        navigate("/", { replace: true });
      })
      .catch((error) => {
        // console.error(error.response.data.message);
        MySwal.fire({
          text: `${error.response.data.message}`,
          icon: "question",
        });

        if (error.response.data.message == "Email does not exist.") {
          MySwal.fire({
            text: "Email does not exist. Please register first!",
            icon: "question",
          });
          navigate("/loginuser", { replace: true });
          MySwal.fire({
            text: `${error.response.data.message} `,
            icon: "question",
          });
        }
      });
  };

  const [authUrl, setAuthUrl] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API + "/user/social/url/",
        {
          code: "your_code_here", // Replace 'your_code_here' with the actual code
        }
      );
      setAuthUrl(response.data.url);
    } catch (error) {
      console.error("Error fetching Google auth URL:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="login_footer">
        <form className="box_container_login2">
          <div className="cover">
            <div className="box_back">
              <Link to="/" className="box_iconBack">
                <MdArrowBack id="iconBack" />
              </Link>
            </div>

            <h2 className="box_container_login_text">{login_en}</h2>
            <p className="box_pleaselogin">Please Log in to use the service!</p>
            <div className="input">
              <label>Email</label>
              <input
                className="input_form"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={handleEmail}
              />
              <label>Password</label>
              <input
                className="input_form"
                type="password"
                placeholder="Enter your password"
                required
                value={pass}
                onChange={handlePass}
              />
            </div>

            {/* {errorText.length > 0 && (
            <div id="error_msg" className="error mt20">
              {errorText}
            </div>
          )} */}

            <div className="forgot_password">
              Forgot your password?{" "}
              <Link to={"/forgotPassword"} className="findpassword">
                Find password
              </Link>
            </div>

            <div className="loginbtn_login">
              <Link type="submit" className="login_btn" onClick={Login}>
                Login
              </Link>
            </div>
            <div className="googlebtn_btn">
              <p className="box_dont">
                Is this your first time?
                <Link to={"/signup"} className="loginmoreLink">
                  Join the membership
                </Link>
              </p>
              {/* <div className="google_account">
                Sign up with your social media account
              </div>
              <div className="google-login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </div> */}
            </div>
          </div>
        </form>

        <Menu />
      </div>
    </>
  );
};

export default LoginUser;
