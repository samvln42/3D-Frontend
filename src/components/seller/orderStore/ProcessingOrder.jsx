import React from "react";
import "./orderStore.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";

const ProcessingOrder = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [order_list, set_order_list] = useState([]);

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
    ALlOrders();
  }, []);

  const ALlOrders = () => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/processing/?store_id=${storage.store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_order_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(order_list);

  return (
    <>
      <div className="header_box_management">
        <Link to="/dashboard-seller" className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        <div>
          <h3>Store management</h3>
        </div>
        <div></div>
      </div>
      <div className="container_order_store">
        <h2 className="h2_store">Processing Order</h2>

        {order_list.map((orders) => (
          <div className="heade_productorder_store">
            <Link
              to={`/bill-store/${orders.id}`}
              className="box_item_order_text_Store"
            >
              <p>Order ID: {orders.id}</p>
              <p>Date: {new Date(orders.created_at).toLocaleString()} </p>
            </Link>
            <button className="btn_confirm_orderD nConfrim">
              {orders.status}
            </button>
          </div>
        ))}
        {order_list.length == 0 && (
          <div className="heade_productorder_store">
            <p>No Order</p>
          </div>
        )}

        {/* {order_list.length === 0 ? (
          <p className="no-reviews-message">Loading...</p>
        ) : (
          order_list.map((item) => {
            <div className="heade_productorder_store">
              <Link to="/bill-store" className="box_item_order_text_Store">
                <p>No: {item.id}</p>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Adipisci, qui!
                </p>
                <p>10.1.2024</p>
              </Link>
              <button className="btn_confirm_orderD nConfrim">Pending</button>
            </div>;
          })
        )} */}
      </div>
    </>
  );
};

export default ProcessingOrder;
