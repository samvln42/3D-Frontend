import React, { useEffect, useState } from "react";
import "./accountAdmin.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { IoKeyOutline } from "react-icons/io5";
import { IoBusinessOutline } from "react-icons/io5";
import { MdAddLocationAlt } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AccountAdmin() {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const [image, set_image] = useState(null);
  const [email, set_email] = useState("");
  const [name, set_name] = useState("");
  const [address, set_address] = useState("");
  const [sub_address, set_sub_address] = useState("");
  const [phone, set_phone] = useState("");
  const [company_number, set_company_number] = useState("");
  const [introduce, set_introduce] = useState("");
  const [origin_password, set_origin_password] = useState("");
  const [password, set_password] = useState("");
  const [password2, set_password2] = useState("");
  const MySwal = withReactContent(Swal);

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
        console.log(response.data);
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

  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}`,
      headers: {},
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_email(response.data.seller.email);
        set_name(response.data.name);
        set_address(response.data.address);
        set_sub_address(response.data.sub_address);
        set_phone(response.data.phone);
        set_company_number(response.data.company_number);
        set_introduce(response.data.introduce);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const EditProfile = (e) => {
    e.preventDefault();

    let data = new FormData();
    data.append("name", name);
    data.append("address", address);
    data.append("sub_address", sub_address);
    data.append("phone", phone);
    data.append("company_number", company_number);
    data.append("introduce", introduce);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "Your Profile has been updated.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="addAmin">
        <div className="goback">
          <Link to="/dashboard" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
        </div>
        <div className="box_addAdmin">
          {/* <h3>{message && message}</h3> */}
          <form onSubmit={EditProfile}>
            <div className="addAdminForm">
              <div className="boxhead_subminandtitle">
                <h2 className="titleaddmin">Admin Account</h2>
                <div className="btn_boxAcouunt">
                  {/* <button type="submit" className="submit_delete">
                    Delete
                  </button> */}
                  <button type="submit" className="submit_add">
                    Update
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
                    onChange={(e) => {
                      set_email(e.target.value);
                    }}
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="fname" className="titlelabel">
                  Name:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <input
                    type="text"
                    id="fname"
                    className="input"
                    placeholder="Name..."
                    value={name}
                    onChange={(e) => {
                      set_name(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Address:
                </label>
                <div className="boxiconnandinput">
                  <MdAddLocationAlt className="iconinput" />
                  <input
                    type="text"
                    name="address"
                    className="input"
                    placeholder="Address (required) "
                    value={address}
                    onChange={(e) => {
                      set_address(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Detailed address:
                </label>
                <div className="boxiconnandinput">
                  <MdAddLocationAlt className="iconinput" />
                  <input
                    type="text"
                    name="sub_address"
                    className="input"
                    placeholder="Detailed address (optional)"
                    value={sub_address}
                    onChange={(e) => {
                      set_sub_address(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Phone number:
                </label>
                <div className="boxiconnandinput">
                  <FiPhone className="iconinput" />
                  <input
                    type="text"
                    id="phone"
                    className="input"
                    placeholder="Phone number..."
                    value={phone}
                    onChange={(e) => {
                      set_phone(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Business:
                </label>
                <div className="boxiconnandinput">
                  <IoBusinessOutline className="iconinput" />
                  <input
                    type="text"
                    name="company_number"
                    className="input"
                    placeholder="Business registration number (optional)"
                    value={company_number}
                    onChange={(e) => {
                      set_company_number(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Descriptions:
                </label>
                <div className="boxiconnandinput">
                  <textarea
                    className="box_text"
                    name="introduce"
                    placeholder="Store introduction (optional/maximum 300 characters)"
                    maxLength="300"
                    value={introduce}
                    onChange={(e) => {
                      set_introduce(e.target.value);
                    }}
                    required
                  ></textarea>
                </div>
              </div>

              {/* <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Current password:
                </label>
                <div className="boxiconnandinput">
                  <IoKeyOutline className="iconinput" />
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Current password"
                    value={origin_password}
                    onChange={(e) => {
                      set_origin_password(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  New password:
                </label>
                <div className="boxiconnandinput">
                  <IoKeyOutline className="iconinput" />
                  <input
                    type="password"
                    name="password2"
                    className="input"
                    placeholder="New passwords"
                    value={password}
                    onChange={(e) => {
                      set_password(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone" className="titlelabel">
                  Confirm password:
                </label>
                <div className="boxiconnandinput">
                  <IoKeyOutline className="iconinput" />
                  <input
                    type="password"
                    name="password3"
                    className="input"
                    placeholder="Confirm password"
                    value={password2}
                    onChange={(e) => {
                      set_password2(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="adminImage" className="titlelabel">
                  Profile image:
                </label>
                <div className="boxiconnandinput">
                  <CiImageOn className="iconinput" />
                  <input type="file" className="input" />
                </div>
              </div> */}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AccountAdmin;
