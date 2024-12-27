import React from 'react'
import { useState } from "react";
import "./sigupGoogle.css";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const SigupGoogle = () => {

  const [sellerData, setSellerData] = useState({
    storeName: '',
    address: '',
    contactInformation: '',
    businessRegistration: '',
    storeIntroduction: '',
  });

  const handleSellerStoreSubmit = async (e) => {
    e.preventDefault();
    try {
    console.log(sellerData)

    setSellerData({
      storeName: '',
      address: '',
      contactInformation: '',
      businessRegistration: '',
      storeIntroduction: '',
    });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSellerChange = (e) => {
    const { name, value } = e.target;
    setSellerData({ ...sellerData, [name]: value });
  };

  return (
    <>
      <div className="box_google">
            <Link to="/registeruser" className="box_iconBack">
                <MdArrowBack id='iconBack'/>
            </Link>
            <h2>Seller registratio</h2>
            <div className="title">
                Please enter additional information to register as a seller!
            </div>

            <form className='container_form_google' onSubmit={handleSellerStoreSubmit}>

              <div className='title_google'>
                  Enter additional informatiom
              </div>
              <input 
                type="text"
                name='storeName' 
                placeholder="Store name (required)" 
                onChange={handleSellerChange}
              />
              <input 
                type="text" 
                name='address'
                placeholder="Address (required) " 
                onClick={handleSellerChange}
              />
              <input 
                type="text" 
                name='contactInformation'
                placeholder="Contact information (optional)" 
                onClick={handleSellerChange}
              />
              <input 
                type="text"
                name='businessRegistration'
                placeholder="Business registration number (optional)" 
                onClick={handleSellerChange}
              />
              <textarea
                className="box_text"
                name='storeIntroduction'
                placeholder="Store introduction (optional/maximum 300 characters)"
                maxLength="300"
                onClick={handleSellerChange}
              ></textarea>
              <button type="submit">Check</button>
            </form>
      </div>
    </>
  )
}

export default SigupGoogle