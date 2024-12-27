import { useState, useEffect } from "react";
import "./userRegister.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";

const ChangeSeller = () => {
  const locataion = useLocation();
  const navigate = useNavigate();
  const [errorText, set_errorText] = useState("");

  const [data, set_data] = useState({
    category: "",
    email: "",
    code: "",
    nickname: "",
    password: "",
    password2: "",
    name: "",
    phone: "",
    address: "",
    sub_address: "",
    company_number: "",
    introduce: "",
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
      url: import.meta.env.VITE_API + "/user/seller-signup",
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
      .catch((err) => {
        if (err.response && err.response.data.message) {
          set_errorText(err.response.data.message);
        } else {
          set_errorText("This is an unknown error.");
        }
      });
    console.log(data);
  };

  return (
    <>
      <div className="box_forgot">
        <Link
          onClick={() => {
            window.history.back();
          }}
          className="box_iconBack"
        >
          <MdArrowBack id="iconBack" />
        </Link>

        <h2>Seller registration</h2>

        <div className="title">
          You are in the process of signing up as a user!
        </div>
        <form className="container_form_user">
          <div className="box_title">Enter basic information</div>
          <>
            <input
              type="text"
              name="category"
              placeholder="category"
              value={(data.category = "2")}
              onChange={onChange}
              required
              hidden
            />
            <input
              type="text"
              name="name"
              placeholder="Store name (required)"
              value={data.name}
              onChange={onChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address (required) "
              value={data.address}
              onChange={onChange}
              required
            />
            <input
              type="text"
              name="sub_address"
              placeholder="Detailed address (optional)"
              value={data.sub_address}
              onChange={onChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone number (optional)"
              value={data.phone}
              onChange={onChange}
            />
            <input
              type="text"
              name="company_number"
              placeholder="Business registration number (optional)"
              value={data.company_number}
              onChange={onChange}
            />

            <textarea
              className="box_text"
              name="introduce"
              placeholder="Store introduction (optional/maximum 300 characters)"
              maxLength="300"
              value={data.introduce}
              onChange={onChange}
            ></textarea>
          </>
          {/* {!passwordMatch && (
            <p className="error-text">Passwords do not match.</p>
          )} */}
          <button type="button" onClick={SignUp}>
            Register
          </button>
        </form>
        {errorText.length > 0 && <div>{errorText}</div>}
      </div>
    </>
  );
};

export default ChangeSeller;
