import "./addAdmin.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IoKeySharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EditAdmin = () => {
  const id = useParams().id;
  const [email, set_email] = useState("");
  const [nickname, set_nickname] = useState("");
  const [image, set_image] = useState(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/user/admin-users/${id}/get`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_email(response.data.email);
        set_nickname(response.data.nickname);
        set_image(response.data.profile_image);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ ]);

  const handleEditAdmin = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("nickname", nickname);
    formdata.append("profile_image", image);

    try {
      const requestOptions = {
        method: "PUT",
        body: formdata,
        headers: {
          // 'Content-Type': 'multipart/form-data', // Remove this line
        },
        redirect: "follow",
      };

      const response = await fetch(`${import.meta.env.VITE_API}/user/admin-users/${id}/update`, {
        ...requestOptions,
        headers: {
          'Accept': 'application/json',
        },
      });

      const result = await response.json();
      console.log(result);
      MySwal.fire({
        text: "Admin has been updated.",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
    }
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
          <form onSubmit={handleEditAdmin}>
            <div className="addAdminForm">
              <div className="boxhead_subminandtitle">
                <h2 className="titleaddmin">Edit Admin</h2>
                <div>
                  <button type="submit" className="submit">
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

              <div className="add-box">
                <label htmlFor="adminImage" className="titlelabel">
                  Profile image:
                </label>
                <div className="boxiconnandinput">
                  <CiImageOn className="iconinput" />
                  <input
                    type="file"
                    className="input"
                    onChange={(e) => set_image(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditAdmin;
