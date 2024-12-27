import React from "react";
import { useState, useEffect } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [errorText, set_errorText] = useState("");
  const goBack = () => {
    window.history.back();
  };
  const [data, set_data] = useState({
    email: "",
    code: "",
    password: "",
    password2: "",
  });
  const [timer, set_timer] = useState({
    minute: 0,
    second: 0,
  });
  const { minute, second } = timer;
  const { email, code, password, password2 } = data;

  function onChange(e) {
    const { name, value } = e.target;
    set_data({
      ...data,
      [name]: value,
    });
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      if (second > 0) {
        set_timer({
          ...timer,
          second: second - 1,
        });
      }
      if (second === 0) {
        if (minute === 0) {
          clearInterval(countdown);
        } else {
          set_timer({
            minute: minute - 1,
            second: 59,
          });
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!data.email){
      alert("Please fill the email!")
      return
    }
    if(!data.code){
      alert("Please fill the Verification number from your email!")
      return
    }
    if(!data.password){
      alert("Please fill the password!")
      return
    }
    if(!data.password2){
      alert("Please fill the confirm password!")
      return
    }
    if(data.password != data.password2){
      alert("Password do not match!")
      return
    }
    if(data.password.length <= 7 || data.password2.length <= 7){
      alert("Password must be at least 8 characters!")
      return
    }

    axios
      .post(`${import.meta.env.VITE_API}/user/my-page`, data)
      .then((response) => {
        console.log(response.data);
        alert("Your password has been changed.");
        navigate("/loginuser");
      })
      .catch((error) => {
        console.error(error.response.data.message);
        
        if(error.response.data.message == "Email does not exist."){
          alert("Email does not exist. Please register first!")
          navigate("/signup", { replace: true });
        } else {
          alert(error.response.data.message)
        }
      });
  };

  return (
    <>
    <Header/>
      <div className="box_forgot">
        <div className="box_back">
          <div onClick={goBack} className="box_iconBack">
          <MdArrowBack id="iconBack" />
        </div>
        </div>
        
        <h2>Find password</h2>
        <div className="title">
          Please change your password after verifying your email!
        </div>
        <form className="container_form_forgot">
          <div className="box_infor">Enter basic information</div>

          <div className="container_form_forgot2">
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={onChange}
            />

            {minute > 0 || second > 0 ? (
              <div id="email_send_btn" className="verification">
                {minute < 10 ? `0${minute}` : minute}:
                {second < 10 ? `0${second}` : second}
              </div>
            ) : (
              <div
                onClick={() => {
                  if (data.email.length > 0) {
                    set_timer({ minute: 3, second: 0 });
                    let config = {
                      method: "post",
                      maxBodyLength: Infinity,
                      url: import.meta.env.VITE_API + "/user/send-email",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      data: data,
                    };

                    axios
                      .request(config)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    set_errorText("Please enter your e-mail.");
                  }
                }}
                id="email_send_btn"
                className="verification"
              >
                Verify
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Verification number"
            required
            name="code"
            value={code}
            onChange={onChange}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="New passwords"
            required
            value={password}
            onChange={onChange}
            name="password"
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
            value={password2}
            onChange={onChange}
            name="password2"
          />
          <button type="submit" onClick={handleSubmit}>
            Confirmation
          </button>
        </form>
        {errorText.length > 0 && (
          <div id="error_msg" className="error mt20">
            {errorText}
          </div>
        )}
      </div>
      <Menu/>
    </>
  );
};

export default ForgotPassword;
