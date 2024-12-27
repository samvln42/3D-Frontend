import React from "react";
import "./contact.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";

const Contact = () => {
  return (
    <>
      <Header />
      <div className="contaner_contact">
        <div className="container_body">
          <p>Company name: Humascot</p>
          <br />
          <p>Phone: 020 998878788</p>
          <br />
          <p>Email: humascot@gmail.com</p>
          <br />
          <p>Address: Asean mall</p>
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Contact;
