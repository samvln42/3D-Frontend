import React, { useEffect, useState } from "react";
import "./header.css";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FaMagnifyingGlass, FaCartShopping, FaRegUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Logo1 from "../../img/Logo1.png";
import axios from "axios";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";

const Header = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [logo, set_logo] = useState(null);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const [search, setSearch] = useState(
    new URLSearchParams(window.location.search).get("search") || ""
  );
  var store_id = false;
  var is_admin = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  if (localStorage.getItem("user")) {
    is_admin = JSON.parse(window.localStorage.getItem("user")).is_admin;
  }

  const [activeMenu, setActiveMenu] = useState("Home");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
      })
      .catch((error) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);

  function OnSearch(e) {
    e.preventDefault();
    let data = JSON.stringify({
      search: search,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/api/search",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleSearch = (e) => {
    e.preventDefault();
    const searchPath = `/search/?search=${search}`;

    navigate(searchPath);
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="header">
        <div className="navbar">
          <div className="headWithBox">
            <div className="headMenu">
              <div className="logo1">
                <Link to="/">
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
              <div className="boxLiMenu">
                <div className="linkLi">
                  <Link
                    to="/"
                    className={`link ${activeMenu === "Home" ? "active" : ""}`}
                    onClick={() => handleMenuClick("Home")}
                  >
                    Home
                  </Link>
                  {/* <Link
                    to="#"
                    className={`link ${activeMenu === "Chat" ? "active" : ""}`}
                    onClick={() => handleMenuClick("Chat")}
                  >
                    Chat
                  </Link> */}
                  <Link
                    to="/order"
                    className={`link ${
                      activeMenu === "Orders" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleMenuClick("Orders");
                      handleClick();
                    }}
                  >
                    Orders
                  </Link>
                </div>
              </div>
            </div>

            <div className="ulHead_box">
              <form
                className="search_wrap search_wrap_2"
                onSubmit={handleSearch}
              >
                <div className="search_box">
                  <div className="btn_common">
                    <label htmlFor="search">
                      <FaMagnifyingGlass className="iconSearch" />
                    </label>
                  </div>
                  <input
                    id="search"
                    type="text"
                    className="input_search_heaederr"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                  ></input>
                </div>
              </form>

              {user && (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link
                      to="/cart"
                      className="link"
                      onClick={() => {
                        handleMenuClick("Cart");
                        handleClick();
                      }}
                    >
                      <FaCartShopping
                        className={`head_colorr ${
                          activeMenu === "Cart" ? "active" : ""
                        }`}
                      />
                    </Link>
                  </div>
                  <div className="userAndstore">
                    <Link
                      to="/more"
                      className="link"
                      onClick={() => handleMenuClick("More")}
                    >
                      <FaRegUser
                        className={`head_colorr ${
                          activeMenu === "More" ? "active" : ""
                        }`}
                      />
                    </Link>
                  </div>
                  {storage.store_id !== false && !storage.is_admin && (
                    <div className="userAndstore">
                      <Link
                        to={`/dashboard`}
                        className="link"
                        onClick={() => handleMenuClick("Dashboard")}
                      >
                        <HiOutlineBuildingStorefront
                          className={`head_colorr ${
                            activeMenu === "Dashboard" ? "active" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  )}
                  {storage.is_admin !== false && (
                    <div className="userAndstore">
                      <Link
                        to={`/dashboard`}
                        onClick={() => handleMenuClick("AdminDashboard")}
                      >
                        <AiOutlineDashboard
                          className={`head_colorr ${
                            activeMenu === "AdminDashboard" ? "active" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <div className="right_ofHeadBox">
                  <div className="boxsearchContainer">
                    <Link to="/cart" onClick={() => handleMenuClick("Cart")}>
                      <FaCartShopping
                        className={`head_colorr ${
                          activeMenu === "Cart" ? "active" : ""
                        }`}
                      />
                    </Link>
                  </div>
                  <div className="userAndstore">
                    <Link
                      to="/loginuser"
                      className="Box_icon_login_BiLogIn"
                      onClick={() => handleMenuClick("Login")}
                    >
                      Login
                      <BiLogIn
                        className={`head_colorr ${
                          activeMenu === "Login" ? "active" : ""
                        }`}
                        id="icon_BiLogIn"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
