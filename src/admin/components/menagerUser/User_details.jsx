import "./user_details.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { FaAngleLeft } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { useEffect, useState } from "react";
import profile from "../../../img/profile.jpg";
import axios from "axios";

const User_details = () => {
  const token = localStorage.getItem("token");
  const id = useParams().id;
  const navigate = useNavigate();
  const [user, set_user] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/client-users",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        set_user(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/user/client-users/${id}/get`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_user(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    let data = "";

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/user/client-users/${id}`,
      headers: {},
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        alert("Delete user successful.");
        navigate("/users");
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
          <Link to="/users" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
        </div>
        <div className="box_addAdmin">
          <form>
            <div className="addAdminForm">
              <h3>User Details</h3>
              <div
                className="del-update"
                onClick={() => {
                  handleDelete(user.id);
                }}
              >
                <div className="del">
                  <AiOutlineDelete />
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="fname" className="titlelabel">
                  User ID:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <div className="input">
                    <p>{user.id}</p>
                  </div>
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="fname" className="titlelabel">
                  Nick Name:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <div className="input">
                    <p>{user.nickname}</p>
                  </div>
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="email" className="titlelabel">
                  Email:
                </label>
                <div className="boxiconnandinput">
                  <MdOutlineEmail className="iconinput" />
                  <div className="input">
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="add-box">
                <label htmlFor="adminImage" className="titlelabel">
                  Profile image:
                </label>
                <div className="BorderinputThenImage">
                  <div className="input">
                    <img
                      src={user.profile_image || profile}
                      alt="admin profile"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default User_details;
