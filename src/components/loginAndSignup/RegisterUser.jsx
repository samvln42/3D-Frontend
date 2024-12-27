import React, { useState } from "react";
import "./registerUser.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";


const RegisterUser = () => {
  const [signup, setSignup] = useState('');

  const navigate = useNavigate()

  const selectSignup = (event) => {
    const { id } = event.target;
    setSignup(id);
  };

  const handleNextClick = () => {
    if (signup == "user") {
      navigate('/userregister')
    }else if (signup == "seller"){
      navigate('/sellerregister')
    }
  };

  return (
    <>
        <div className="signup_page">
          <div className="box_back">
            <Link to="/loginuser" className="box_iconBack_user">
              <MdArrowBack id='iconBack'/>
            </Link>
          </div>

          <h3 className="title_mt20">
            Join the membership
          </h3>
          <p>Please sign up to use the service!</p>
          <div className="box_form_register">
            <div className="input_wrap">
              <ul>
                <li>
                  <input
                    type="radio"
                    id="user"
                    checked={"user" == signup}
                    onChange={selectSignup}
                  />
                  <label htmlFor="user" className="user_type02">
                    <FaUsers id="icon_user_sell"/>
                    User
                  </label>
                </li>
              </ul>
              <ul>
                <li>
                  <input
                    type="radio"
                    id="seller"
                    checked={"seller" == signup}
                    onChange={selectSignup}
                  />
                  <label htmlFor="seller" className="user_type02">
                    <FaUsers id="icon_user_sell"/>
                    Seller
                  </label>
                </li>
              </ul>
            </div>
            <button onClick={handleNextClick} className="btn_register_next">Next</button>
          </div>
        </div>
    </>
  );
};

export default RegisterUser;
