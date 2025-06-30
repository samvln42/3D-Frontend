import React, { useState, useEffect } from "react";
import "./banner.css";

const Banner = ({ storeId, adminId }) => {
  const [banners, setBanners] = useState(null);
  // Get background image for store
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${storeId || adminId}/banners`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setBanners(result[0].image);
        } else {
          setBanners(null);
        }
      })
      .catch((error) => console.error(error));
  }, [storeId, adminId]);


  return (
    <div className="banner-container">
      {banners && (
        <div className="banner_image">
          <img src={banners} alt="Store banner" />
        </div>
      )}
    </div>
  );
};

export default Banner;