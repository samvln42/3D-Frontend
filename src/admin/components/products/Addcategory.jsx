import React, { useState, useRef } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./category.css";
import { CiCamera } from "react-icons/ci";
import axios from "axios";
import Swal from "sweetalert2";
import imageicon from "../../../img/imageicon.jpg";

const AddCategory = () => {
  const [categories, setCategories] = useState({
    name: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCategories((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCategoryName = (e) => {
    const value = e.target.value;
    setCategories((prevState) => ({
      ...prevState,
      name: value,
    }));
  };
  const handleCategorySortedID = (e) => {
    const value = e.target.value;
    setCategories((prevState) => ({
      ...prevState,
      sorted_ID: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (categories.name.trim() === "") {
      Swal.fire({
        text: "Please enter a category name!",
        icon: "question",
      });
      return;
    }

    const data = new FormData();
    data.append("name", categories.name);
    data.append("image", categories.image);
    // data.append("sorted_ID", categories.sorted_ID);

    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/categories`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Category added:", response.data);
        setCategories({
          sorted_ID: "",
          name: "",
          image: null,
        });
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        Swal.fire({
          text: "Category added successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          text: "An error occurred while adding the category.",
          icon: "error",
        });
      });
  };

  return (
    <>
      <AdminMenu />
      <section id="posts">
        <div className="box_container_products">
          <div className="Box_btn_haed">
            <h2>Add Category</h2>
            <div className="btn_submit">
              <button type="submit" onClick={handleSubmit}>
                Post Category
              </button>
            </div>
          </div>

          <div className="group_container_category">
            <div className="Category_box_content">
              <div className="box_input-img_category">
                <img src={selectedImage || imageicon} alt="category" />
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>

              <div className="edit_images">
                <label
                  className="trigger_popup_fricc"
                  onClick={handleCameraClick}
                >
                  <CiCamera id="icon_ci_camera" />
                </label>
              </div>
              <div className="box_container_image">
                <div className="input-box">
                  <div className="box">
                    <input
                      type="text"
                      value={categories.name || ""}
                      onChange={handleCategoryName}
                      placeholder="Category name..."
                    />
                  </div>
                </div>
                {/* <div className="input-box">
                  <div className="box">
                    <input
                      type="text"
                      value={categories.sorted_ID || ""}
                      onChange={handleCategorySortedID}
                      placeholder="Category sorted ID..."

                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCategory;
