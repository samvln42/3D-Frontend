import React, { useState } from "react";
import "./registerUser.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

const Signup1 = () => {
  const [signup, setSignup] = useState("");
  const [user_type, set_user_type] = useState("");

  const navigate = useNavigate();

  const selectSignup = (event) => {
    const { id } = event.target;
    setSignup(id);
  };

  //   const handleNextClick = () => {
  //     if (signup == "user") {
  //       navigate('/userregister')
  //     }else if (signup == "seller"){
  //       navigate('/sellerregister')
  //     }

  function onChange(e) {
    set_user_type(e.target.value);
  }

  return (
    <>
    <Header/>
      <div className="signup_page">
        <div className="signup_page">
          <div className="box_back">
            <Link to="/loginuser" className="box_iconBack_user">
              <MdArrowBack id="iconBack" />
            </Link>
          </div>

          <h3 className="title_mt20">Join the membership</h3>
          <p>Please sign up to use the service!</p>
          <div className="box_form_register">
            <div className="input_wrap">
              <ul>
                <li>
                  <input type="radio" id="user" name="user_type" value="1" onChange={onChange} />
                  <label htmlFor="user" className="user_type02">
                    <FaUsers id="icon_user_sell" />
                    User
                  </label>
                </li>
              </ul>
              <ul>
                <li>
                  <input
                    name="user_type"
                    type="radio"
                    id="seller"
                    value="2"
                    onChange={onChange}
                  />
                  <label htmlFor="seller" className="user_type02">
                    <FaUsers id="icon_user_sell" />
                    Seller
                  </label>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                if (user_type.length > 0) {
                  navigate("/signup2", { state: user_type });
                } else {
                  window.alert(
                    "Please select the type you wish to sign up for."
                  );
                }
              }}
              className="btn_register_next"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Menu/>
    </>
  );
};

export default Signup1;
