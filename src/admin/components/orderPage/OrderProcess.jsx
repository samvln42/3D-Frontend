import React from "react";
import "./orderpage.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import AdminMenu from "../adminMenu/AdminMenu";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const OrderProcess = () => {
  const token = localStorage.getItem("token");
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const [order_list, set_order_list] = useState([]);

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
          navigate("/login");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/login");
        return;
      });
  }, [token]);

  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/processing/?store_id=${store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data.orders));
        set_order_list(response.data.orders);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  console.log(order_list);

  return (
    <>
      <AdminMenu />
      <section id="menager">
        <div className="container_box_orderpage">
          <div className="box_head_search">
            <h3>Orders Processing</h3>
            {/* <form className="search">
              <div className="search-box_menageruser">
                <input type="text" placeholder="Search ..." />
                <button type="submit">
                  <IoSearchOutline />
                </button>
              </div>
            </form> */}
          </div>

          {order_list.map((order) => (
            <div className="box_users_order">
              <div className="box_order_text">
                <p>No: {order.id}</p>
                <div>
                <p>Name: {order.user.nickname || order.user.email}</p>
                </div>
              </div>
              <div className="box_container_time">
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="container_order_icon">
                <div className="btn_pending">{order.status}</div>
                <Link to={`/orderbill-admin/${order.id}`} className="btn_view">
                  View
                </Link>
              </div>
            </div>
          ))}

          {order_list.length == 0 && (
            <div className="heade_productorder_store">
              <p>No Order</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default OrderProcess;
