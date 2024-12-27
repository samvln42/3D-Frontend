import "./addAdmin.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AddAdmin = () => {
  const token = localStorage.getItem("token");
  const [email, set_email] = useState("");
  const [nickname, set_nickname] = useState("");
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    let data = JSON.stringify({
      token: token,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/check-token",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.result != "success") {
          localStorage.clear();
          navigate("/loginuser");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/loginuser");
        return;
      });
  }, [token]);

  console.log(email);
  console.log();

  const handleAddAdmin = (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      email: email,
      password: email,
      nickname: nickname,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/create-superuser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "The new admin has been added successfully.",
          icon: "success",
        });

        set_email("");
        set_nickname("");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          // alert(error.response.data.message);
          MySwal.fire({
            text: `${error.response.data.message}`,
            icon: "question",
          });
        } else {
          MySwal.fire({
            text: "This is an unknown error.",
            icon: "question",
          });
        }
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="addAmin">
        <div className="goback">
          <Link to="/admins" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
        </div>
        <div className="box_addAdmin">
          {/* <h3>{message && message}</h3> */}
          <form onSubmit={handleAddAdmin}>
            <div className="addAdminForm">
              <div className="boxhead_subminandtitle">
                <h2 className="titleaddmin">Add Admin</h2>
                <div>
                  <button type="submit" className="submit">
                    Add
                  </button>
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="email" className="titlelabel">
                  Email:
                </label>
                <div className="boxiconnandinput">
                  <MdOutlineEmail className="iconinput" />
                  <input
                    type="email"
                    id="email"
                    className="input"
                    placeholder="Email address..."
                    value={email}
                    onChange={(e) => set_email(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="nickname" className="titlelabel">
                  Nick name:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <input
                    type="text"
                    id="nickname"
                    className="input"
                    placeholder="Nick name..."
                    value={nickname}
                    onChange={(e) => set_nickname(e.target.value)}
                  />
                </div>
              </div>

              {/* <div className="add-box">
                <label htmlFor="adminImage" className="titlelabel">Profile image:</label>
                <div className="boxiconnandinput">
                  <CiImageOn className="iconinput" />
                  <input type="file" className="input"/>
                </div>
              </div> */}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddAdmin;
