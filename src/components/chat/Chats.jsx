
import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { FaMagnifyingGlass } from "react-icons/fa6";
import User from "../../img/user.png";
import "./chats.css";
import { Link } from "react-router-dom";
import { IoMdMore } from "react-icons/io";


const Chats = () => {

  //PopUp box add banner
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef();
  const divsRef = useRef();
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const handleDocumentClick = (e) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(e.target) &&
      divsRef.current &&
      !divsRef.current.contains(e.target)
    ) {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="boc_chat_container">
        <form className="search_box_chat">
          <FaMagnifyingGlass className="iconSearch_chat" />
          <input
            type="text"
            className="input_search_chat"
            placeholder="Search..."
          ></input>
        </form>

        <div className="conversation_list_box" >

          <div className="conversation_item_box">
            <Link to="/chat-details" className="conversation_item">
              <div className="conversation_details">
                <img src={User} alt="image" />
                <div className="txt_chat_box">
                  <h4>Sompong</h4>
                  <p>new message...</p>
                </div>
              </div>
              <Link to="#" className="conversation_options" ref={buttonRef} onClick={toggleVisibility}>
                <IoMdMore />
              </Link>

            </Link>
            {/* PopUp box add banner */}
            {isVisible && (
              <div className="box_alter_delelte_chat" ref={divsRef}>
                <p>Delete</p>
                <span className="spanOfborderButtom_popup"></span>
                <p>Clear chat</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <Menu />
    </>
  );
};

export default Chats;

