import React, { useState, useEffect } from "react";
import "./banner.css";
import banner1 from "../../img/banner1.svg";
import banner2 from "../../img/banner2.svg";
import banner3 from "../../img/banner3.svg";
import Logo1 from "../../img/Logo1.png";
import imageicon from "../../img/imageicon.jpg";
import axios from "axios";

const Banner = () => {
  const [background_image, set_background_image] = useState(null);
  const [slides, setSlides] = useState([background_image]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState("right");
  

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
        set_background_image(response.data[0].background);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [background_image]);

  const handlePrevSlide = () => {
    setDirection("left");
    setActiveSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
  };

  const handleNextSlide = () => {
    setDirection("right");
    setActiveSlide(activeSlide === slides.length - 1 ? 0 : activeSlide + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
      <div>
        <div className="slider_banner">
          <div className="slide_banner"  >
            <img src={background_image} alt="" />
          </div>
          {/* <div className={`slide_banner ${direction}`} style={{backgroundImage: `url(${slides[activeSlide]})`}}></div> */}
          <div className="navigation_banner but1_banner">
            <div className="nav-btn_banner " onClick={handlePrevSlide}>&#8249;</div>
          </div>
          <div className="navigation_banner but2_banner">
            <div className="nav-btn_banner " onClick={handleNextSlide}>&#8250;</div>
          </div>
        </div>
      </div>

  );
};

export default Banner;