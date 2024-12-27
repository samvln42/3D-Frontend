import "./Dashboard_seller.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { BsHandbagFill } from "react-icons/bs";
import { TbShoppingCartStar } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import { colors } from "@mui/material";

const Dashboard_seller = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const [product_list, set_product_list] = useState([]);
  const [new_order, set_new_order] = useState([]);
  const [processing_order, set_processing_order_order] = useState([]);
  const [shipped_order, set_shipped_order] = useState([]);
  const [delivered_order, set_delivered_order] = useState([]);

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
    NewOrders();
    ProcessingOrders();
    ShippedOrders();
    DeliveredOrders();

  }, []);

  const NewOrders = () => {

    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/pending/?store_id=${storage.store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        set_new_order(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ProcessingOrders = () => {

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
        console.log(JSON.stringify(response.data));
        set_processing_order_order(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ShippedOrders = () => {

    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/shipped/?store_id=${storage.store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        set_shipped_order(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeliveredOrders = () => {

    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/delivered/?store_id=${storage.store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        set_delivered_order(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(new_order.status);

  return (
    <>
      <div className="box_store">
        <div className="store_container">
          <div className="store_item_head">
            <Link to="/stores" className="back_icons_back">
              <IoIosArrowBack />
              <p>Back</p>
            </Link>
            <div className="title_nameStore">
            <h3>Store: {storage.origin_store_name}</h3>
            </div>
            <div></div>
          </div>

          <div className="link_btn_store">
            <Link to="/stores" className="btn_link_store ">
              Sale items
            </Link>
            <Link
              to="/dashboard-seller"
              className="btn_link_store link_store_active"
            >
              Dashboard
            </Link>
            <Link to="/payment-store" className="btn_link_store">
              Payment
            </Link>
          </div>

          <div className="dasboard_box_container">
            <h3>Dashboard</h3>
            <div className="box_dasb_content">
              <Link to="/order-pending" className="box_item_dasb box_bgColor1">
                <p>New Order</p>
                <p>{new_order.length}</p>
                <div className="view_moreLink">View</div>
              </Link>
              <Link to="/order-processing" className="box_item_dasb box_bgColor3">
                <p>Order Processing</p>
                <p>{processing_order.length}</p>
                <div className="view_moreLink">View</div>
              </Link>
              <Link to="/order-shipped" className="box_item_dasb box_bgColor4">
                <p>Order Shipped</p>
                <p>{shipped_order.length}</p>
                <div className="view_moreLink">View</div>
              </Link>
              <Link to="/order-delivered" className="box_item_dasb box_bgColor5">
                <p>Order Delivered</p>
                <p>{delivered_order.length}</p>
                <div className="view_moreLink">View</div>
              </Link>
              {/* <Link to="/eview-store" className="box_item_dasb box_bgColor4">
                <p>Order Calcelled</p>
                <p>5</p>
                <div className="view_moreLink">View</div>
              </Link> */}
            </div>
            <div className="box_sales_payment">
              <div className="box_sales_payment_filer">
                <form className="boxfilterseach">
                  <select className="filter_priceProduct">
                    <option value="default">Month</option>
                    <option value="higherPrice">Week</option>
                    <option value="lowerPrice">Day</option>
                  </select>
                </form>
              </div>
              <div className="box_monney_display">
                <div className="monney_display_item">
                  <p>This month's sales:</p>
                  <p className="number_item_dpc">2,000$</p>
                </div>
                <div className="monney_display_item">
                  <p>All quantity:</p>
                  <p className="number_item_dpc">100</p>
                </div>
              </div>
              <div className="products-visit">
                <div className="visit">
                  <h3>Visitor insights</h3>
                  <div className="visitor-graph">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1000"
                      height="71"
                      viewBox="0 0 700 71"
                      fill="none"
                    >
                      <path
                        d="M-4.06934 49.5096C7.93066 24.1762 47.3307 -18.1904 108.931 15.0096C185.931 56.5096 200.931 84.0096 274.931 49.5096C348.931 15.0096 382.931 7.50957 440.931 49.5096C487.331 83.1096 513.931 63.5096 521.431 49.5096"
                        stroke="#3CD856"
                        strokeWidth="4"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="420"
                        height="115"
                        viewBox="0 0 420 115"
                        fill="none"
                      >
                        <path
                          d="M-4.06934 53.9577C20.9307 25.4577 45.3307 51.7577 106.931 84.9577C183.931 126.458 184.903 51.324 257.931 14.8103C324.931 -18.6897 382.931 22.3103 440.931 64.3103C487.331 97.9103 515.431 121.958 522.931 107.958"
                          stroke="#EF4444"
                          strokeWidth="4"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="420"
                        height="90"
                        viewBox="0 0 420 90"
                        fill="none"
                      >
                        <path
                          d="M-4.06934 14.8105C20.9307 -13.6895 45.3307 12.6105 106.931 45.8105C183.931 87.3105 189.403 60.8242 262.431 24.3105C329.431 -9.18951 381.431 26.8105 439.431 68.8105C485.831 102.41 515.431 82.8105 522.931 68.8105"
                          stroke="#A700FF"
                          strokeWidth="4"
                        />
                      </svg>
                    </svg>
                  </div>
                  <div className="detial">
                    <span>
                      <p className="blue"></p>blue
                    </span>
                    <span>
                      <p className="red"></p>red
                    </span>
                    <span>
                      <p className="green"></p>green
                    </span>
                  </div>
                </div>
                <div className="products">
                  <h3>Top products</h3>
                  <div className="item_guopBox">
                    <div className="items">
                      <h4>#</h4>
                      <h4>name</h4>
                      <h4>Quantity</h4>
                      <h4>Sales</h4>
                    </div>
                    <div className="items">
                      <span>1</span>
                      <span>Product1</span>
                      <p>23</p>
                      <span className="sales_persian sales_an1">100$</span>
                    </div>
                    <div className="items">
                      <span>2</span>
                      <span>Product2</span>
                      <p>17</p>
                      <span className="sales_persian sales_an2">100$</span>
                    </div>
                    <div className="items">
                      <span>3</span>
                      <span>Product3</span>
                      <p>15</p>
                      <span className="sales_persian sales_an3">100$</span>
                    </div>
                    <div className="items">
                      <span>4</span>
                      <span>Product4</span>
                      <p>12</p>
                      <span className="sales_persian sales_an4">100$</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard_seller;
