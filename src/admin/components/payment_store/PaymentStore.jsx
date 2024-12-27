import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import "./paymentStore.css";
import { CiImageOn } from "react-icons/ci";
import QRCODE from "../../../img/QRCODE.png";
import { useState, useEffect } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";

function PaymentStore() {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const user = localStorage.getItem("user");
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const [dataPayment, setDataPayment] = useState([]);

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
      url:
        import.meta.env.VITE_API +
        `/store/bank-accounts/detail/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDataPayment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id]);

  console.log(dataPayment);

  return (
    <>
      <AdminMenu /> <br />
      <div className="header_box_managements">
        <Link to="/stores" className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        <div>
          <h3>Store: {storage.origin_store_name}</h3>
        </div>
        <div></div>
      </div>
      {dataPayment.length === 0 ? (
        
        <form className="box_container_review1">
          <div className="add_payment_box">
            <h3>Payment</h3> <br />
            <p className="no-reviews-message">You don't have Back account. Please add it!</p>
            <Link
              to="/add-payment-store"
              type="submit"
              className="btn_save_productUser"
            >
              Add/Edit
            </Link>
          </div>
        </form>
      ) : (
        <form className="box_container_review1">
          <div className="add_payment_box">
            <h3>Payment</h3>
            <div>
              <div className="inputproduct_box_dplay">
                <p>Bank: {dataPayment[0].name}</p>
              </div>
              <div className="inputproduct_box_dplay">
                <p>Account name: {dataPayment[0].account_name}</p>
              </div>
              <div className="inputproduct_box_dplay">
                <p>Account number: {dataPayment[0].account_number}</p>
              </div>
              <div className="add_img_product_box">
                <p>QR Code:</p>
                <div className="imag_qrcode_store">
                  <img src={dataPayment[0].image} alt="" />
                </div>
              </div>
            </div>
            <Link
              to="/add-payment-store"
              type="submit"
              className="btn_save_productUser"
            >
              Add/Edit
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

export default PaymentStore;
