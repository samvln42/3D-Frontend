import React, { useState, useEffect } from "react";
import "./orderBill.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import imageicon from "../../../img/imageicon.jpg";
import { CiCamera } from "react-icons/ci";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const OrderBill = () => {
  const token = localStorage.getItem("token");
  const order_id = useParams().bill_id;
  const [order_list, setOrderList] = useState([]);
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [china_url, set_china_url] = useState("");
  const [lao_url, set_lao_url] = useState("");
  const [order_bill, set_order_bill] = useState(null);
  const MySwal = withReactContent(Swal);

  const goBack = () => {
    window.history.back();
  };

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
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setOrderList(response.data);
        set_name(response.data.user.name);
        set_email(response.data.user.email);
        set_china_url(response.data.china_url);
        set_lao_url(response.data.lao_url);
        set_order_bill(response.data.order_bill);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id, order_bill]);

  const ConfirmOrder = (e) => {
    e.preventDefault();

    let data = "";
    if (order_list.status == "Pending") {
      data = JSON.stringify({
        status: "Processing",
      });
    } else if (order_list.status == "Processing") {
      data = JSON.stringify({
        status: "Shipped",
      });
    } else if (order_list.status == "Shipped") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else if (order_list.status == "Delivered") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else {
      data = JSON.stringify({
        status: "Delivered",
      });
    }

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (order_list.status == "Pending") {
          MySwal.fire({
            text: "This order has been received.",
            icon: "success",
          });
          navigate("/order/processing");
        } else if (order_list.status == "Processing") {
          MySwal.fire({
            text: "This order has been processed",
            icon: "success",
          });
          navigate("/order/shipped");
        } else if (order_list.status == "Shipped") {
          MySwal.fire({
            text: "This order has been shipped.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else if (order_list.status == "Delivered") {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
          navigate("/order/delivered");
        } else {
          MySwal.fire({
            text: "This order has been delivered.",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("china_url ", china_url);
  console.log("lao_url ", lao_url);

  const ChangeChinaURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      china_url: china_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API + `/store/order/update/china-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "China URL has been added.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeLaoURL = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      lao_url: lao_url,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/order/update/lao-url/${order_id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "Lao URL has been added.",
          icon: "success",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeOrderBill = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("order_bill", order_bill);

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
    };

    fetch(
      import.meta.env.VITE_API + `/store/order/update/order-bill/${order_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        MySwal.fire({
          text: "Add bill successfully.",
          icon: "success",
        });
        setPopupImageBill(false);
      })
      .catch((error) => console.error(error));
  };

  ///Choose image handleImageBill
  const [mainImageBill, setMainImagBill] = useState(null);
  const [isPopupImageBill, setPopupImageBill] = useState(false);

  const togglePopupImageBill = () => {
    setPopupImageBill(true);
  };

  const togglePopupCancelImageBill = () => {
    setPopupImageBill(false);
  };

  const handleImageBill = (e) => {
    const file = e.target.files[0];
    set_order_bill(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setMainImagBill([file]);
      };

      reader.readAsDataURL(file);
    }
  };

  console.log("order bill: ", order_bill);
  console.log("mainImageBill: ", mainImageBill);
  return (
    <>
      <AdminMenu />
      <section id="abill">
        <div className="abill-detial">
          <div className="container_Order_Bill">
            <Link to={goBack} className="back_Order_Bill">
              <FaAngleLeft id="box_icon_Back" />
              <p>Back</p>
            </Link>
            <h2>Orders</h2>
            <div></div>
          </div>
          <div className="aguopoidHead">
            <div className="aidf">
              <p>OrderID: {order_list.id}</p>
              <p>User: {name || email}</p>
            </div>
          </div>
          <hr />
          <div className="abillGopBox">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Color</th>
                  <th>Size</th>
                </tr>
              </thead>
              {order_list.items &&
                order_list.items.map((item) => (
                  <tbody key={item.id}>
                    <tr>
                      <td>{item.product.name}</td>
                      <td>
                        $
                        {parseFloat(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
          <hr />
          <div className="atitlePrice">
            <h3>Total:</h3>
            <h3>${order_list.total_prices}</h3>
          </div>
          <div className="aplace-on">
            <div className="container_aplace">
              <div className="box_places">
                <p>
                  Payment date:{" "}
                  {new Date(order_list.created_at).toLocaleString()}
                </p>
                <p>Payment method: Transfer</p>
                <p>Account name: {order_list.account_name}</p>
                <p>Status: {order_list.status}</p>
                <p>
                  Delivery: {order_list.shipping_company}, Province:{" "}
                  {order_list.province}, Destrict: {order_list.district},
                  Branch: {order_list.branch}
                </p>
              </div>

            </div>
            <form>
              {order_list.status === "Processing" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                </div>
              )}

              {order_list.status === "Shipped" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                  <div className="url">
                    <label htmlFor="branTobranURL">url Bran to Bran:</label>
                    <input
                      type="text"
                      id="branTobranURL"
                      name="branTobranURL"
                      placeholder="url delivery bran to bran"
                      value={lao_url}
                      onChange={(e) => set_lao_url(e.target.value)}
                    />
                    <button onClick={ChangeLaoURL}>add</button>
                  </div>
                  <div className="box_show_bill">
                    <div className="image_bill">
                      <img src={order_bill || imageicon} alt="image" />
                    </div>

                    <div
                      className="popup_image_bill"
                      onClick={() => {
                        togglePopupImageBill();
                      }}
                    >
                      <CiCamera id="box_icon_camera" />
                    </div>
                    {isPopupImageBill && (
                      <form className="background_addproductpopup_bill">
                        <div className="hover_addproductpopup_box_image">
                          <div className="box_input_image">
                            <p>Choose bill</p>
                            <label className="popup_Border_Boximagae">
                              {mainImageBill && mainImageBill.length > 0 ? (
                                <img
                                  src={URL.createObjectURL(mainImageBill[0])}
                                  alt="img"
                                />
                              ) : (
                                <img src={imageicon} alt="img" />
                              )}
                              {/* {order_bill ? (
                                <img
                                  src={URL.createObjectURL(order_bill[0])}
                                  alt="img"
                                />
                              ) : (
                                <img src={imageicon} alt="img" />
                              )} */}
                              <input
                                type="file"
                                onChange={handleImageBill}
                                id="img"
                              />
                              <p className="box_choose_bill">Choose bill</p>
                            </label>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={togglePopupCancelImageBill}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              type="submit"
                              onClick={ChangeOrderBill}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {order_list.status === "Delivered" && (
                <div className="status">
                  <div className="url">
                    <label htmlFor="chinaToLaoURL">url China to Lao:</label>
                    <input
                      type="text"
                      id="chinaToLaoURL"
                      name="chinaToLaoURL"
                      placeholder="url delivery from china"
                      value={china_url}
                      onChange={(e) => set_china_url(e.target.value)}
                    />
                    <button onClick={ChangeChinaURL}>add</button>
                  </div>
                  <div className="url">
                    <label htmlFor="branTobranURL">url Bran to Bran:</label>
                    <input
                      type="text"
                      id="branTobranURL"
                      name="branTobranURL"
                      placeholder="url delivery bran to bran"
                      value={lao_url}
                      onChange={(e) => set_lao_url(e.target.value)}
                    />
                    <button onClick={ChangeLaoURL}>add</button>
                  </div>

                  <div className="box_show_bill">
                    <div className="image_bill">
                      <img src={order_bill || imageicon} alt="image" />
                    </div>

                    <div
                      className="popup_image_bill"
                      onClick={() => {
                        togglePopupImageBill();
                      }}
                    >
                      <CiCamera id="box_icon_camera" />
                    </div>
                    {isPopupImageBill && (
                      <form className="background_addproductpopup_bill">
                        <div className="hover_addproductpopup_box_image">
                          <div className="box_input_image">
                            <p>Choose bill</p>
                            <label className="popup_Border_Boximagae">
                              {mainImageBill && mainImageBill.length > 0 ? (
                                <img
                                  src={URL.createObjectURL(mainImageBill[0])}
                                  alt="img"
                                />
                              ) : (
                                <img src={imageicon} alt="img" />
                              )}
                              {/* {order_bill ? (
                                <img
                                  src={URL.createObjectURL(order_bill[0])}
                                  alt="img"
                                />
                              ) : (
                                <img src={imageicon} alt="img" />
                              )} */}
                              <input
                                type="file"
                                onChange={handleImageBill}
                                id="img"
                              />
                              <p className="box_choose_bill">Choose bill</p>
                            </label>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={togglePopupCancelImageBill}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              type="submit"
                              onClick={ChangeOrderBill}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              <div className="status btn">
                {order_list.status !== "Delivered" && (
                  <button
                    type="submit"
                    className="aplace_form_button "
                    onClick={ConfirmOrder}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderBill;
