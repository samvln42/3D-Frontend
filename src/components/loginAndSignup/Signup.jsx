import { useState, useEffect } from "react";
import "./userRegister.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";

const Signup = () => {
  const locataion = useLocation();
  const navigate = useNavigate();
  const [errorText, set_errorText] = useState("");

  const [timer, set_timer] = useState({
    minute: 0,
    second: 0,
  });
  const { minute, second } = timer;
  const [data, set_data] = useState({
    email: "",
    code: "",
    nickname: "",
    password: "",
    password2: "",
    is_client: true,
    is_staff: false,
    is_seller: false,
    is_superuser: false,
  });

  function onChange(e) {
    const { name, value } = e.target;
    set_data({
      ...data,
      [name]: value,
    });
  }

  const SignUp = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigate("/loginuser");
        return;
      })
      .catch((error) => {
        let errorMessage;
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          set_errorText(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          set_errorText("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an error
          set_errorText("An error occurred while sending the request");
        }
      });
    console.log(response);
  };

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

  return (
    <>
      <div className="box_forgot">
        <div className="box_back">
          <Link to="/loginuser" className="box_iconBack">
            <MdArrowBack id="iconBack" />
          </Link>
        </div>

        <h2>User registration</h2>

        <div className="title">
          You are in the process of signing up as a user!
        </div>
        <form className="container_form_user">
          <div className="box_title">Enter basic information</div>
          <div className="container_form_user2">
            <input
              type="email"
              name="email"
              onChange={onChange}
              value={data.email}
              placeholder="Email"
              required
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
            name="code"
            onChange={onChange}
            value={data.code}
            placeholder="Certication Number"
            required
          />
          <input
            type="text"
            name="nickname"
            onChange={onChange}
            value={data.nickname}
            placeholder="Nickname (maximun 10 characters)"
            required
          />

          <input
            type="password"
            name="password"
            onChange={onChange}
            value={data.password}
            placeholder="passwords"
            required
          />
          <input
            type="password"
            name="password2"
            onChange={onChange}
            value={data.password2}
            placeholder="Confirm password"
            required
          />
          <button type="button" onClick={SignUp}>
            Register
          </button>
        </form>
        {errorText.length > 0 && <div>{errorText}</div>}
      </div>
    </>
  );
};

export default Signup;
