import "./store_management.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoCameraSharp } from "react-icons/io5";
import banner_no from "../../../img/banner_no.jpg";
import { useState, useEffect } from "react";
import productImage from "../../../img/productImage.png";
import { FaPen } from "react-icons/fa6";
import axios from "axios";

function Store_management() {
  const token = localStorage.getItem("token");
  const [store_id, set_store_id] = useState(
    JSON.parse(window.localStorage.getItem("user")).store_id
  );

  const [category, set_category] = useState(6);
  const [goods_list, set_goods_list] = useState([]);

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

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/api/store/?category=${category}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);

  //PopUp box add banner
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <>
      <div className="box_store">
        <div className="store_container_management">
          <div className="store_item_head">
            <Link to="/stores" className="back_icons_back">
              <IoIosArrowBack />
              <p>Back</p>
            </Link>
            <div className="title_nameStore">
              <h3>online shop</h3>
            </div>
            <div></div>
          </div>
          <div className="banner_no_box">
            <div className="banner_no_box_img">
              <img src={banner_no} alt="" />
            </div>
            <div className="edit_image">
              <a className="trigger_popup_fricc" onClick={togglePopup}>
                <IoCameraSharp />
              </a>
              {/* PopUp box add banner */}
              {isPopupVisible && (
                <form className="hover_bkgr_fricc">
                  <p>Image banner</p>
                  <div className="popupCloseButton" onClick={togglePopup}>
                    &times;
                  </div>
                  <label className="popup_txt_Boximagae">
                    <input type="file" name="image" />
                  </label>
                  <button className="banner_confirm_btn">Confirm</button>
                </form>
              )}
            </div>
          </div>

          <div className="group_container_product">
            {goods_list.map(
              (i, index) =>
                i.category !== "Food" && (
                  <div className="box-product">
                    <div className="editproduct_boxIocno">
                      <Link
                        to={`/edit-product/${i.id}`}
                        className="iconn_pendit_product"
                      >
                        <FaPen />
                      </Link>
                      <div className="img">
                        <img src={i.image} alt="image" />
                      </div>
                      <ul className="txtOFproduct2">
                        <li className="name">{i.name}</li>
                        <li className="price">{i.price}</li>
                      </ul>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
        <Link to="/add-product" className="btn_addProdcut">
          Add Product
        </Link>
      </div>
    </>
  );
}

export default Store_management;
