import React, { useState, useEffect } from "react";
import "./profileedit.css";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import user from "../../img/user.png";
import axios from "axios";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

const ProfileEdit = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [email, set_email] = useState(storage.email);
  const [image, set_image] = useState(null);
  const [origin_password, set_origin_password] = useState("");
  const [password, set_password] = useState("");
  const [password2, set_password2] = useState("");
  const [errorText, set_errorText] = useState("");
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    set_image(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  console.log("Image; ", image);
  console.log(origin_password);
  console.log(password);
  console.log(password.length);
  console.log(typeof password);
  console.log(password2);

  // Submit button
  const EditProfile = (e) => {
    e.preventDefault();

    if (!origin_password) {
      alert("Please fill the old password!");
      return;
    }

    if (!password) {
      alert("Please fill the password!");
      return;
    }
    if (!password2) {
      alert("Please fill the confirm password!");
      return;
    }

    if (password != password2) {
      alert("Password do not match!");
      return;
    }
    if (password.length <= 7 || password2.length <= 7) {
      alert("Password must be at least 8 characters!");
      return;
    }

    if (!image) {
      alert("Please select the image!");
      return;
    }

    const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("Authorization", "Bearer " + token);

    const formdata = new FormData();
    formdata.append("origin_password", origin_password);
    formdata.append("password", password);
    formdata.append("password2", password2);
    formdata.append("profile_image", image);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(import.meta.env.VITE_API + "/user/my-page", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);
        if (result.message == "Passwords do not match") {
          // set_errorText("Passwords do not match");
          alert("Old password was wrong.");
          return;
        }

        if (result.message == "Modifications completed!") {
          console.log(result.message);
          alert("Successful update user profile. System is going to restore!");
          localStorage.clear();
          navigate("/loginuser");
        }
      })
      .catch((error) => {
        if (error.response) {
          // set_errorText(error.response.data.message);
          alert(error.response.data.message);
        }
      });
  };

  return (
    <>
      <Header />
      <div className="ProfilePage_edit">
        <div className="boxgoback">
          <Link to="/more" className="box_iconBack">
            <MdArrowBack id="iconBack" />
          </Link>
        </div>
        <div className="box_name">
          <div className="box_image_profile">
            <label htmlFor="profileImage">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" />
              ) : (
                <img src={storage.image || user} alt="Profile Preview" />
              )}

              <p>
                <FaCamera id="icon_camera" />
              </p>
            </label>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p>Name: {storage.nickname || storage.email}</p>
        </div>
        <div className="box_user_profile">
          <p>User</p>
          <FaRegUserCircle id="iconUser" />
        </div>
        <form className="container_form_profileedit" onSubmit={EditProfile}>
          <input type="email" value={email} readOnly />
          <input
            id="origin_password"
            type="password"
            placeholder=" Please enter yourcurrent password "
            value={origin_password}
            onChange={(e) => {
              set_origin_password(e.target.value);
            }}
          />
          <input
            id="password"
            type="password"
            placeholder=" Please enter a new password "
            value={password}
            onChange={(e) => {
              set_password(e.target.value);
            }}
          />
          <input
            id="password2"
            type="password"
            placeholder=" Please confirm your new password "
            value={password2}
            onChange={(e) => {
              set_password2(e.target.value);
            }}
          />

          {/* {errorText && (
            <div id="error_msg" className="error mt20">
              {errorText}
            </div>
          )} */}

          <button type="submit">Confirmation</button>
        </form>
      </div>
      <Menu />
    </>
  );
};

export default ProfileEdit;
