import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { AiOutlineDelete } from "react-icons/ai";
import "./cart.css";
import axios from "axios";
import Payment from "./Payment";

const Cart = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [store_id, set_store_id] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [show_payment, set_show_payment] = useState(false);
  const navigate = useNavigate();
  const [category, set_category] = useState(1);
  const [products_list, set_products_list] = useState([]);


  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/?category=${category}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_products_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);

  function StarAVG(value) {
    let star_avg = (value / 5) * 100;
    if (star_avg === 0) {
      star_avg = 100;
    }
    return star_avg;
  }

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (id, store_name, color, size) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.id === id &&
            item.store_name === store_name &&
            item.color === color &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (id, store_name, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, store_name, color, size);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id &&
            item.store_name === store_name &&
            item.color === color &&
            item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };


  const handlePayment = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    setCartItems(storeItems);
    set_store_id(storeItems[0].store_id);
    set_show_payment(true);
  };

  // Order array datas
  const orderitems = [
    {
      user: user_id,
      store: store_id,
      items: cartItems,
    },
  ];

  const getTotalItemForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPriceForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce(
      (total, item) => total + item.price * (item.quantity || 0),
      0
    );
  };

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

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


  if (!cart) {
    return <div className="cart">Loading...</div>;
  }

  const stores = [...new Set(cart.map((item) => item.store_name))];

  // const handlePay = () => {
  //   set_show_payment(true);
  // };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {show_payment ? (
        <Payment orders={orderitems} order_from="cart" onPay={handlePayment} />
      ) : (
        <>
          <Header />
          <div className="box_cart_container">
            {/* <Link to="/" className="box_container_back_icons_back">
              <IoIosArrowBack id="icons_back" />
              <p>Back</p>
            </Link> */}

            {stores.length === 0 ? (
              <p className="no-reviews-message">Your cart is emty</p>
            ) : (
              <div>
                {stores.map((store) => (
                  <div key={store}>
                    <div className="store">
                      <h3>{store}</h3>
                      <div>
                        {cart
                          .filter((item) => item.store_name === store)
                          .map((item, index) => (
                            <div className="box_item_gourp" key={index}>
                              <div className="box_item_image">
                                <img src={item.images} alt="" />
                                <div className="box_item_text">
                                  <p>name: {item.name}</p>
                                  <p>color: {item.color}</p>
                                  <p>size: {item.size}</p>
                                  <p>
                                    price{": "} $
                                    {parseFloat(item.price).toLocaleString(
                                      "en-US",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        useGrouping: true,
                                      }
                                    )}
                                  </p>
                                </div>
                                <div className="box_icon_order">
                                  <div className="btnicon_delete_order">
                                    <AiOutlineDelete
                                      id="btnicon_delete"
                                      onClick={() =>
                                        removeFromCart(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="box_item_icon">
                                    <div
                                      className="icon_minus_plus"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      -
                                    </div>
                                    <span>{item.quantity}</span>
                                    <div
                                      className="icon_minus_plus"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          store,
                                          item.color,
                                          item.size,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      +
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="box_item_total">
                      <div className="cart_Total_box">
                        <h3>Cart Total</h3>
                        <div className="box_item_total_text">
                          <p>Quantity:</p>
                          <p>{getTotalItemForStore(store)} Items</p>
                        </div>
                        <hr />
                        <div className="box_item_total_text">
                          <p className="txt_Total">Total: </p>
                          <p>${getTotalPriceForStore(store).toFixed(2)}</p>
                        </div>
                        <div className="btn">
                          <button
                            onClick={() => {
                              handlePayment(store);
                            }}
                            className="checkout_btn"
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <br />
            <br />

            <h2 className="box_betavinOfob asd2">
              <span className="spennofStyle" />
              Shopping
            </h2>
            <div className="products-container">
              <div className="products-grid">
                {products_list.map((product, index) => (
                  <div key={index} className="product-card">
                    <Link to={`/goods/${product.id}`} onClick={handleClick}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    </Link>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">$ {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Menu />
        </>
      )}
    </>
  );
};

export default Cart;
