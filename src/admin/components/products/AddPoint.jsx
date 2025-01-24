import React, { useState } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./addpoint.css";
import { HiPlus } from "react-icons/hi";
import imageicon from "../../../img/imageicon.jpg";
import { CiCamera } from "react-icons/ci";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AddPoint = () => {
  const MySwal = withReactContent(Swal);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const store_id = user?.store_id || null;

  const [pointView, setPointView] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedImages = [...images];
      updatedImages[index].image = reader.result;
      setImages(updatedImages);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    setImages([...images, { position: "", image: "" }]);
  };

  // const handleRemoveImage = (index) => {
  //   const updatedImages = images.filter((_, i) => i !== index);
  //   setImages(updatedImages);
  // };

  const handlePositionChange = (e, index) => {
    const updatedImages = [...images];
    updatedImages[index].position = e.target.value;
    setImages(updatedImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      point_view: pointView,
      images: images,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API}/store/${store_id}/stocked/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        MySwal.fire({
          title: "Success!",
          text: "Post point success!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
        MySwal.fire({
          title: "Error!",
          text: "There was an error posting the point.",
          icon: "error",
        });
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="posts">
        <div className="box_container_products">
          <form onSubmit={handleSubmit}>
            <div className="Box_btn_haed">
              <h2>Add point</h2>
              <div className="btn_submit">
                <button type="submit">Post point</button>
              </div>
            </div>

            <div className="group_container_point">
              <div className="Point_box_content">
                <div className="box_container_image">
                  <label>Point view</label>
                  <div className="input-box_image">
                    <input
                      type="text"
                      value={pointView}
                      placeholder="Please enter a point name"
                      onChange={(e) => setPointView(e.target.value)}
                    />
                  </div>
                </div>
                <div className="box_container_image">
                  <label>Position image</label>
                  <div className="input-box_image">
                    <div className="container_positions">
                      {images.map((image, index) => (
                        <div className="positions" key={index}>
                          <div className="box_input-img_point">
                            <img src={image.image || imageicon} alt="product" />
                            <input
                              id={`file-input-${index}`}
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </div>

                          <div className="edit_images">
                            <label
                              htmlFor={`file-input-${index}`}
                              className="trigger_popup_fricc"
                            >
                              <CiCamera id="icon_ci_camera" />
                            </label>
                          </div>

                          <select
                            className="product_category"
                            value={image.position}
                            onChange={(e) => handlePositionChange(e, index)}
                          >
                            <option value="">Select position</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                          </select>
                        </div>
                      ))}
                      <div className="Box_icon_HiPlus" onClick={handleAddImage}>
                        <HiPlus id="icon_HiPlus" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddPoint;
