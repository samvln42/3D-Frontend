import "./userRegister.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Header from "../header/Header";
import axios from "axios";

const AdditionalSeller = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }
  const navigate = useNavigate();

  const [name, set_name] = useState("");
  const [phone, set_phone] = useState("");
  const [address, set_address] = useState("");
  const [sub_address, set_sub_address] = useState("");
  const [company_number, set_company_number] = useState("");
  const [introduce, set_introduce] = useState("");

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

  console.log(user_id);

  const ChangeSeller = (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      user_id: user_id,
      name: name,
      phone: phone,
      address: address,
      sub_address: sub_address,
      company_number: company_number,
      introduce: introduce,
    });

    console.log(data)

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/user/seller-signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const update_data = { ...storage, ...response.data };
        window.localStorage.setItem("user", JSON.stringify(update_data));
        console.log(JSON.stringify(response.data));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <>
      <Header />
      <div className="box_forgot">
        {/* <Link to="#" className="box_iconBack">
          <MdArrowBack id="iconBack" />
        </Link> */}
        <h2>Additional seller information</h2>
        <div className="title">
          Please enter additional information to register as a seller!
        </div>
        <form className="container_form_seller" onSubmit={ChangeSeller}>
          <>
            <div className="box_titles">Enter additional information</div>
            <input
              className="input_form"
              type="text"
              name="name"
              placeholder="Store name (required)"
              required
              value={name}
              onChange={(e) => {
                set_name(e.target.value);
              }}
            />
            <input
              className="input_form"
              type="text"
              name="address"
              placeholder="Address (optional) "
              required
              value={address}
              onChange={(e) => {
                set_address(e.target.value);
              }}
            />
            <input
              className="input_form"
              type="text"
              name="sub_address"
              placeholder="Detailed address (optional)"
              required
              value={sub_address}
              onChange={(e) => {
                set_sub_address(e.target.value);
              }}
            />
            <input
              className="input_form"
              type="text"
              name="phone"
              placeholder="Contact information (optional)"
              value={phone}
              onChange={(e) => {
                set_phone(e.target.value);
              }}
            />
            <input
              className="input_form"
              type="text"
              name="company_number"
              placeholder="Business registration number (optional)"
              required
              value={company_number}
              onChange={(e) => {
                set_company_number(e.target.value);
              }}
            />

            <textarea
              className="box_text"
              name="introduce"
              placeholder="Store introduction (optional/maximum 300 characters)"
              maxLength="300"
              value={introduce}
              onChange={(e) => {
                set_introduce(e.target.value);
              }}
            ></textarea>
          </>
          <button type="submit">Check</button>
        </form>
      </div>
    </>
  );
};

export default AdditionalSeller;
