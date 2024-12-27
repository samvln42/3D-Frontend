import React from "react";
import "./addProduct.css";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

function AddProduct() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const storage = JSON.parse(window.localStorage.getItem("user"));

  const navigate = useNavigate();
  const [categories, set_categories] = useState([]);
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  console.log(store_id);

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
        console.log(response.data);
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

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/categories",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        set_categories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: [],
    colors: [],

    image: "",
    image_details: "",
    currentSize: "",
    currentColor: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSizeInputChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentSize: value,
    }));
  };

  const addSizeInput = () => {
    if (product.currentSize.trim() !== "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        sizes: [...prevProduct.sizes, prevProduct.currentSize],

        currentSize: "", // Reset the current color after adding
      }));
    }
  };

  const removeSizeInput = (index) => {
    if (product.sizes.length > 0) {
      setProduct((prevProduct) => {
        const updatedSizes = [...prevProduct.sizes];
        updatedSizes.splice(index, 1);
        return {
          ...prevProduct,
          sizes: updatedSizes,
        };
      });
    }
  };

  const handleColorInputChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentColor: value,
    }));
  };

  const addColorInput = () => {
    if (product.currentColor.trim() !== "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        colors: [...prevProduct.colors, prevProduct.currentColor],
        currentColor: "", // Reset the current color after adding
      }));
    }
  };

  const removeColorInput = (index) => {
    if (product.colors.length > 0) {
      setProduct((prevProduct) => {
        const updatedColors = [...prevProduct.colors];
        updatedColors.splice(index, 1);
        return {
          ...prevProduct,
          colors: updatedColors,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (product.name == "") {
      alert("Please add the name!");
      return; // Abort the function if tel is null
    }
    if (product.description == "") {
      alert("Please add the description!");
      return; // Abort the function if tel is null
    }
    if (product.price == "") {
      alert("Please add the price!");
      return; // Abort the function if tel is null
    }
    if (product.category == "") {
      alert("Please select the category!");
      return; // Abort the function if tel is null
    }
    if (product.sizes == "") {
      alert("Please add the sizes!");
      return; // Abort the function if tel is null
    }
    if (product.colors == "") {
      alert("Please add the colors!");
      return; // Abort the function if tel is null
    }
    if (product.image == "") {
      alert("Please add the image!");
      return; // Abort the function if tel is null
    }

    const formdata = new FormData();
    formdata.append("name", product.name);
    formdata.append("description", product.description);
    formdata.append("price", product.price);
    formdata.append("category", product.category);
    formdata.append("store", store_id);

    // Sizes array
    product.sizes.forEach((size, index) => {
      formdata.append(`sizes[${index}]`, size);
    });

    // Colors array
    product.colors.forEach((color, index) => {
      formdata.append(`colors[${index}]`, color);
    });

    formdata.append("images", fileInput.files[0]);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    console.log(product);

    fetch(import.meta.env.VITE_API + `/store/product/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.message === "success") {
          alert("Add product has been complated.");
          window.location.reload(false);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="header_box_management">
        <Link to="/store-management" className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        <div>
          <h3>Store management</h3>
        </div>
        <div></div>
      </div>

      <form className="addproduct_container" onSubmit={handleSubmit}>
        <h3>Add product</h3>
        <div className="inputproduct_box">
          <label htmlFor="name">Name:</label>
          <input
            className="inputproduct"
            name="name"
            type="text"
            placeholder="Product name"
            onChange={handleInputChange}
          />
        </div>
        <div className="inputproduct_box">
          <label htmlFor="description">Description:</label>
          <input
            className="inputproduct"
            name="description"
            type="text"
            placeholder="Description"
            onChange={handleInputChange}
          />
        </div>
        <div className="inputproduct_box">
          <label htmlFor="price">Price:</label>
          <input
            className="inputproduct"
            name="price"
            type="text"
            placeholder="Product price"
            onChange={handleInputChange}
          />
        </div>
        <div className="inputproduct_box">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            onChange={handleInputChange}
            className="inputproduct select_box"
          >
            <option className="inputproduct" value=""></option>
            {categories.map((item) => (
              <option key={item.id} className="inputproduct" value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="size_product_box">
          <h3>Size:</h3>
          <div className="size_product_box_container">
            <div className="box_sizeTso_add">
              {product.sizes.map((size, index) => (
                <div className="box_sizeTo_add_item" key={index}>
                  <p>{size}</p>
                  <span
                    className="spanCancelBox"
                    onClick={() => removeSizeInput(index)}
                  >
                    <IoIosClose className="iconn_close_addSize" />
                  </span>
                </div>
              ))}
            </div>

            <div className="size_content_box">
              <input
                className="inputproduct"
                type="text"
                placeholder="Add Size..."
                onChange={handleSizeInputChange}
                value={product.currentSize}
              />
              <div className="addsize_btn" onClick={addSizeInput}>
                Add
              </div>
            </div>
          </div>
        </div>{" "}
        <br />
        <div className="size_product_box">
          <h3>Color:</h3>
          <div className="size_product_box_container">
            <div className="box_sizeTso_add">
              {product.colors.map((color, index) => (
                <div className="box_sizeTo_add_item" key={index}>
                  <p>{color}</p>
                  <span
                    className="spanCancelBox"
                    onClick={() => removeColorInput(index)}
                  >
                    <IoIosClose className="iconn_close_addSize" />
                  </span>
                </div>
              ))}
            </div>

            <div className="size_content_box">
              <input
                className="inputproduct"
                type="text"
                placeholder="Add Color..."
                onChange={handleColorInputChange}
                value={product.currentColor}
              />
              <div className="addsize_btn" onClick={addColorInput}>
                Add
              </div>
            </div>
          </div>
        </div>
        <div className="add_img_product_box">
          <h3>Product image:</h3>
          <div className="boxicon_img_input">
            <CiImageOn className="boxicon_img_iconn" />
            <input
              type="file"
              name="image"
              className="input"
              id="fileInput"
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* <div className="add_img_product_box">
          <h3>Details image:</h3>
          <div className="boxicon_img_input">
            <CiImageOn className="boxicon_img_iconn" />
            <input
              type="file"
              name="image_details"
              className="input"
              onChange={handleInputChange}
            />
          </div>
        </div> */}
        <button type="submit" className="btn_save_productUser">
          Save
        </button>
      </form>
    </>
  );
}

export default AddProduct;
