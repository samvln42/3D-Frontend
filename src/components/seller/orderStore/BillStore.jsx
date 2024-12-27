import { Link, useNavigate, useParams} from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import "./billStore.css";
import { useEffect, useState } from "react";
import axios from "axios";

const BillStore = () => {
  const token = localStorage.getItem("token");
  const order_id = useParams().id;
  const [order_list, setOrderList] = useState("");
  const goBack = () => {
    window.history.back();
  };

  console.log(order_list.status);

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
        setOrderList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [order_id]);

  const ConfirmOrder = () => {
    let data = "";
    if (order_list.status === "Pending") {
      data = JSON.stringify({
        status: "Processing",
      });
    } else if (order_list.status === "Processing") {
      data = JSON.stringify({
        status: "Shipped",
      });
    } else if (order_list.status === "Shipped") {
      data = JSON.stringify({
        status: "Delivered",
      });
    } else if (order_list.status === "Delivered") {
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
        console.log(response.data);
        alert("Order has been received");
        window.location("/order-store");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="header_box_management">
        <div onClick={goBack} className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </div>
        <div>
          <h3>Store management</h3>
        </div>
        <div></div>
      </div>
      <h3 className="txt_h3Bill">Bill</h3>
      <div className="bill_store_container">
        <div className="bill-detial newspanBox">
          <div className="guopoidHead">
            <div className="idf">
              <p>Order ID: {order_list.id}</p>
              <p>Date: {new Date(order_list.created_at).toLocaleString()}</p>
            </div>
          </div>
          <div className="billGopBox">
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
              <tbody>
                {/* <tr>
                  <td>name</td>
                  <td>2,000</td>
                  <td>3</td>
                  <td>red</td>
                  <td>L</td>
                </tr> */}
                {order_list.items &&
                  order_list.items.map((item, index) => (
                    // console.log(item.product)

                    <tr key={index}>
                      <td>{item.product.name}</td>
                      <td>
                        {parseFloat(item.price).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          useGrouping: true,
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      {/* <p hidden>{(totalPrice += item.price * item.quantity)}</p> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="titlePrice">
            <p>Total:</p>
            <p>
              {parseFloat(order_list.total_prices).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true,
              })}{" "}
              Kip
            </p>
          </div>
          <div className="place-on">
            {/* <p>Payment date: {new Date(order_list.created_at).toLocaleString()}</p> */}
            <p>Payment method: Transfer</p>
            <p>Account name: {order_list.account_name}</p>
            <p>Delivery: company name</p>
            <p>Status: {order_list.status}</p>
            <p>
              Delivery: {order_list.shipping_company}, Province:{" "}
              {order_list.province}, Destrict: {order_list.district}, Branch:{" "}
              {order_list.branch}
            </p>
            <form className="status_box">
              {/* <div className="status_box2">
                <p>Status: </p>
                <select className="filter_priceProduct2">
                  <option value="default">Pending</option>
                  <option value="higherPrice">Paid</option>
                </select>
              </div> */}
              <button onClick={ConfirmOrder} className="btn_confirm_orderD">
                confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillStore;
