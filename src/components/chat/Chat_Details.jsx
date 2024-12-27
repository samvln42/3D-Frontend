import React, { useRef, useState, useEffect } from "react";
import User from "../../img/user.png";
import { VscSend } from "react-icons/vsc";
import "./chat_Details.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function Chat_Details() {
  const [message, setMessage] = useState("");
  const [user] = useState("u421")
  const [store] = useState("s412")
  const handleInputChange = (event) => {
    setMessage(event.target.value);
    autoGrowTextarea();
  };

  //   box size grow up
  const autoGrowTextarea = () => {
    const textarea = document.getElementById("multiline-input");
    const maxHeight = (8 * window.innerHeight) / 100;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  };


  const handleChat = (e) => {
    e.preventDefault();

    try {

      const ms = {
        user: user,
        message: message,
        store: store
      }

      console.log(ms)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="box_containerone">
      <div className="box_chatDetails_container">
        <div className="box_chatDetails_details">
          <div className="goback_box_chatdetils">
            <Link to="/chats" className="goback_btn_chatdetils">
              <FaAngleLeft id="box_icon_Back" />
              <p>Back</p>
            </Link>
          </div>
          <img src={User} alt="image" />
          <div className="txt_chat_boxdetails">
            <h4>Sompong</h4>
          </div>
        </div>
        <form className="message-form" onSubmit={handleChat}>
          <div className="box_chat_content_room">
            <div className="sender">
              <span className="text-box">Hi, I'm sender</span>
            </div>

            <div className="recipient ">
              <span className="text-box">Hi, I'm recipient</span>
            </div>
            <div className="sender">
              <span className="text-box">Hi, I'm sender</span>
            </div>

            <div className="recipient ">
              <span className="text-box">Hi, I'm recipient</span>
            </div>
            <div className="sender">
              <span className="text-box">Hi, I'm sender</span>
            </div>

            <div className="recipient ">
              <span className="text-box">Hi, I'm recipient</span>
            </div>
            <div className="sender">
              <span className="text-box">Hi, I'm sender</span>
            </div>

            <div className="recipient ">
              <span className="text-box">Hi, I'm recipient</span>
            </div>
            <div className="sender">
              <span className="text-box">Hi, I'm sender</span>
            </div>

            <div className="recipient ">
              <span className="text-box">Hi, I'm recipient</span>
            </div>
          </div>
          
          <div className="send-bar">
            <textarea
              className="multiline-input"
              id="multiline-input"
              placeholder="A-Z ..."
              rows="1"
              value={message}
              onChange={handleInputChange}
            />
            <button type="submit">
              <VscSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat_Details;
