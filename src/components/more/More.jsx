import React from "react";
import "./more.css";
import { MdDelete } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { IoKeySharp } from "react-icons/io5";
import { BsBackpack4Fill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdStorefront } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import profile from "../../img/profile.jpg";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

export const More = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

  const storage = JSON.parse(window.localStorage.getItem("user"));
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    return;
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowConfirmation(false);
  };
  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setShowConfirmationDelete(false);
  };
  const handleCancelDelete = () => {
    setShowConfirmationDelete(false);
  };

  const user = localStorage.getItem("user");

  //Function Delete
  const handleDeleteAccount = async () => {
    try {
      const config = {
        method: "delete",
        url: `${import.meta.env.VITE_API}/user/my-page`, // Assuming your API URL is stored in environment variables
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
      };

      const response = await axios(config);
      if (response.status === 204) {
        // Account deleted successfully
        alert("Account deleted successfully");
        console.log("Account deleted successfully");
        localStorage.clear();
        navigate("/");
        // Perform any other actions (e.g., redirect to home page)
      } else {
        console.error("Failed to delete account:", response.data.message);
        alert("Failed to delete account:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <>
      <Header />
      {/* <div className="header_box_management">
      </div> */}
      <h3>Setting Account</h3>
      <div className="MorePage">
        <div className="profile_box">
          <div className="left_box">
            {storage.image != false ? (
              <img src={storage.image} alt="" />
            ) : (
              <img src={profile} alt="" />
            )}
            <div className="user_name">
              Name: {storage.nickname || storage.email}
            </div>
          </div>
          <Link to="/profileedit" className="right_box">
            <button>View</button>
          </Link>
        </div>

        {/* <hr className="hr" /> */}
        <div className="more-menu-list">
          {/* <Link to="/terms" className="menu_icon">
            <BsBackpack4Fill id="icon_more" />
            <p>Terms of use</p>
          </Link>
          <hr className="hr" />
          <Link to="/privacy" className="menu_icon">
            <BsBackpack4Fill id="icon_more" />
            <p>Privay Policy</p>
          </Link>
          <hr className="hr" />
          <Link to="/forgotpassword" className="menu_icon">
            <IoKeySharp id="icon_more" />
            <p>Change password</p>
          </Link> */}

          {storage.store_id === false && (
            <div>
              <hr className="hr" />
              <Link to="/additional-seller" className="menu_icon">
                <MdStorefront id="icon_more" />
                <p className="txtP">Additional seller informaction</p>
              </Link>
            </div>
          )}

          <hr className="hr" />
          <div onClick={() => setShowConfirmation(true)} className="menu_icon">
            <IoLogOutOutline id="icon_more" />
            <p>Log out </p>
          </div>
          {showConfirmation && (
            <div className="confirmation-popup">
              <p>Are you sure you want to logout?</p>
              <div className="btn_ok_on">
                <button onClick={handleCancelLogout} className="btn_on">
                  No
                </button>
                <button onClick={handleConfirmLogout} className="btn_yes">
                  Yes
                </button>
              </div>
            </div>
          )}

          <hr className="hr" />
          <div
            className="menu_icon"
            onClick={() => setShowConfirmationDelete(true)}
          >
            <MdDelete id="icon_more" />
            <p>Delete account</p>
          </div>

          {showConfirmationDelete && (
            <div className="confirmation-popup">
              <p>Are you sure you want to Delete?</p>
              <div className="btn_ok_on">
                <button onClick={handleCancelDelete} className="btn_on">
                  No
                </button>
                <button onClick={handleConfirmDelete} className="btn_yes">
                  Yes
                </button>
              </div>
            </div>
          )}

          <hr className="hr" />
        </div>
      </div>
      <Menu />
    </>
  );
};
export default More;
