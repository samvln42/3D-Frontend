import { useState, useEffect } from "react";
import "./userRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";

const UserRegister = () => {
  const [data, setData] = useState({
    email: "",
    code: "",
    nickname: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [timer, set_timer] = useState({
    minute: 0,
    second: 0,
  });
  const { minute, second } = timer;
  const navigate = useNavigate();

  // const email = data.email;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const Register = () => {
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
      .then((res) => {
        navigate("/loginuser", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="box_forgot">
        <Link to="/registeruser" className="box_iconBack">
          <MdArrowBack id="iconBack" />
        </Link>

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
              onChange={handleChange}
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
                className='verification'
              >
                Verify
              </div>
            )}
          
          </div>
          <input
            type="text"
            name="code"
            onChange={handleChange}
            value={data.code}
            placeholder="Certication Number"
            required
          />
          <input
            type="text"
            name="nickname"
            onChange={handleChange}
            value={data.nickname}
            placeholder="Nickname (maximun 10 characters)"
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={data.password}
            placeholder="passwords"
            required
          />
          <input
            type="password"
            name="password2"
            onChange={handleChange}
            value={data.password2}
            placeholder="Confirm password"
            required
          />
          {/* {!passwordMatch && (
            <p className="error-text">Passwords do not match.</p>
          )} */}
          <button type="button" onClick={Register}>
            Register
          </button>
        </form>
        {/* {message && <p>{message}</p>} */}
      </div>
    </>
  );
};

export default UserRegister;