import "./menu.css";
import { Link, useLocation } from "react-router-dom";
import QrdownloadApp from "../../img/QrdownloadApp.png";
import { FaCartShopping } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { BsShop, BsClipboardCheck } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { BsCart3 } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import axios from "axios";



const Menu = ({ storeId }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [logo, setLogo] = useState("");

  // Function to handle click on menu item
  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${storeId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setStoreName(result.name)
        setPhone(result.phone)
        setAddress(result.address)
      })
      .catch((error) => console.error(error));
  }, [storeId]);

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
        setLogo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section>
      {/*Footer Menu For PC */}

      <footer className="footerBox">
        <div className="footer_Container">
          <div className="image_logo">
            <h3 className="txt_footHead">About</h3>
            <Link to="/" className="txt_pFoot">
              <img src={logo} alt="" />
            </Link>
            <p>{storeName}</p>
          </div>


          <div className="footconentBox">
            <h3 className="txt_footHead">Contact us</h3>
            <p className="txt_pFoot">Phone: {phone}</p>
            <p className="txt_pFoot">Address: {address}</p>
          </div>

          {/* <div className="footconentBox3">
            <h3 className="txt_footHead txh3">Download App</h3>
            <div className="foot_contentItem">
              <img src={QrdownloadApp} alt="QrdownloadApp" />
              <div className="guop_btndownl">
                <Link to="#" className="footLink">
                  Play Store
                </Link>
                <Link to="#" className="footLink">
                  App Store
                </Link>
              </div>
            </div>
          </div> */}
        </div>
        <hr className="hrfoo" />
        <p className="lastFooter">Copyright &#169; TACA 2023</p>
      </footer>

      {/* Footer Menu For Mobile */}

      <div className="menubar">
        <Link
          to="/"
          className={location.pathname === "/" ? "box-menu active" : "box-menu"}
          onClick={() => handleMenuClick("/")}
        >
          <span className="iconMenuSpan">
            <HiOutlineHome />
          </span>
          <span>Home</span>
        </Link>

        <Link
          to="/order"
          className={
            location.pathname === "/order" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/order")}
        >
          <span className="iconMenuSpan">
            <BsClipboardCheck />
          </span>
          <span>Order</span>
        </Link>
        <Link
          to="/cart"
          className={
            location.pathname === "/cart" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/cart")}
        >
          <span className="iconMenuSpan">
            <BsCart3 />
          </span>
          <span>Cart</span>
        </Link>
        {/* <Link
          to="#"
          className={
            location.pathname === "/chats" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/chats")}
        >
          <span className="iconMenuSpan">
            <IoChatbubbleEllipsesOutline />
          </span>
          <span>Chat</span>
        </Link> */}
        {/* <Link
          to="/contact"
          className={
            location.pathname === "/contact" ? "box-menu active" : "box-menu"
          }
          onClick={() => handleMenuClick("/contact")}
        >
          <span className="iconMenuSpan">
            <GrContact />
          </span>
          <span>Contact</span>
        </Link> */}
      </div>
    </section>
  );
};

export default Menu;
