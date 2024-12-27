import { FaAngleLeft } from "react-icons/fa6";
import Header from "../header/Header";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./address.css";

const Address = () => {
  return (
    <>
      <Header />
      <section className="address_box_conattiner">
        <div className="gobackaddress">
          <div className="header-box">
            <Link to="/payment" className="guopIconbAck">
              <FaAngleLeft className="iconnBack" />
              Back
            </Link>
          </div>
        </div>
        <form className="box_address_input">
          <div className="box">
            <label htmlFor="prov">Province:</label>
            <input
              type="text"
              id="prov"
            />
          </div>
          <div className="box">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"

            />
          </div>
          <div className="box">
            <label htmlFor="companny">Companny:</label>
            <input
              type="text"
              id="companny"

            />
          </div>
          <div className="box">
            <label htmlFor="branch">Branch:</label>
            <input
              type="text"
              id="branch"

            />
          </div>
          
          <Link to="/payment" className="submit">
            <div className="save">

              Confirm
            </div>
          </Link>
        </form>
      </section>
    </>
  );
};

export default Address;
