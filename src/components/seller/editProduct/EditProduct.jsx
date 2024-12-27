import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";

function EditProduct() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user ? user.user_id : null;
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const navigate = useNavigate();
  const product_id = useParams().product_id;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    sizes: [],
    colors: [],
    images: null, // Store the selected image file
    imagePreviews: null, // Store the image preview as base64 string
    currentSize: "",
    currentColor: "",
  });

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

  // Function to handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the input

    // Read the file as a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: file, // Update the images property with the selected file
        imagePreviews: reader.result, // Update the imagePreviews with base64 string
      }));
    };
    reader.readAsDataURL(file); // Convert the file to base64 string
  };

  useEffect(() => {
    // Fetch product details
    axios
      .get(import.meta.env.VITE_API + `/store/detail/${product_id}`)
      .then((response) => {
        const { name, price, category, description, sizes, colors, images } =
          response.data;

        // Assuming `images` is the property containing the image URL from the database
        const imageFromDatabase = images; // Replace `images` with the correct property name

        setProduct({
          name,
          price,
          category: "",
          description,
          sizes,
          colors,
          images: imageFromDatabase, // Set the image from the database
          currentSize: "", // Initialize currentSize and currentColor for input fields
          currentColor: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch categories
    axios
      .get(import.meta.env.VITE_API + "/store/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [product_id]);

  console.log(product);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSizeInputChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentSize: e.target.value,
    }));
  };

  const addSizeInput = () => {
    if (product.currentSize.trim() !== "") {
      // Create a new size object
      const newSize = {
        name: product.currentSize,
        product: product_id, // Assuming product.id represents the ID of the current product
      };

      // Update the state to include the new size
      setProduct((prevProduct) => ({
        ...prevProduct,
        sizes: [...prevProduct.sizes, newSize],
        currentSize: "", // Reset the current size after adding
      }));
    }
  };

  const removeSizeInput = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: prevProduct.sizes.filter((_, idx) => idx !== index),
    }));
  };

  const handleColorInputChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentColor: e.target.value,
    }));
  };

  const addColorInput = () => {
    if (product.currentColor.trim() !== "") {
      // Create a new color object
      const newColor = {
        name: product.currentColor,
        product: product_id, // Assuming product.id represents the ID of the current product
      };

      // Update the state to include the new color
      setProduct((prevProduct) => ({
        ...prevProduct,
        colors: [...prevProduct.colors, newColor],
        currentColor: "", // Reset the current color after adding
      }));
    }
  };

  const removeColorInput = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      colors: prevProduct.colors.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (product.category == "") {
      alert("Please select the category!");
      return; // Abort the function if category is null
    }

    // Implement update logic here
    console.log("Updated product:", product);

    const formdata = new FormData();
    formdata.append("name", product.name);
    formdata.append("description", product.description);
    formdata.append("price", product.price);
    formdata.append("category", product.category);
    formdata.append("store", store_id);

    // formdata.append("sizes", '["S", "M", "L", "XL"]');
    // formdata.append("colors", '["Black", "White", "Red"]');

    product.sizes.forEach((size, index) => {
      formdata.append(`sizes[${index}]`, size.name);
    });

    // Colors array
    product.colors.forEach((color, index) => {
      formdata.append(`colors[${index}]`, color.name);
    });

    if (fileInput.files[0] != null) {
      formdata.append("images", fileInput.files[0]);
    }

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow",
    };

    // alert(JSON.stringify(product));

    // .get(import.meta.env.VITE_API + `/api/product/${product_id}`)

    fetch(
      import.meta.env.VITE_API + "/store/product/update/" + product_id,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "success") {
          alert("Update product has been complated.");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="header_box_management">
        <Link to="/stores" className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        <div>
          <h3>Update Product</h3>
        </div>
        <div></div>
      </div>

      <form className="addproduct_container" onSubmit={handleSubmit}>
        <div className="inputproduct_box">
          <label htmlFor="name">Name:</label>
          <input
            className="inputproduct"
            name="name"
            type="text"
            placeholder="Product name"
            value={product.name}
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
            value={product.description}
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
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="inputproduct_box">
          <label htmlFor="category">Category:</label>
          <select
            className="inputproduct"
            name="category"
            // value={product.category}
            value={product.category || selectedCategory}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="size_product_box">
          <h3>Sizes:</h3>
          <div className="size_product_box_container">
            <div className="box_sizeTso_add">
              {product.sizes.map((size, index) => (
                <div key={index} className="box_sizeTo_add_item">
                  <p>{size.name}</p>
                  <span
                    onClick={() => removeSizeInput(index)}
                    className="spanCancelBox"
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
                value={product.currentSize}
                onChange={handleSizeInputChange}
              />
              <div className="addsize_btn" onClick={addSizeInput}>
                Add
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="size_product_box">
          <h3>Colors:</h3>
          <div className="size_product_box_container">
            <div className="box_sizeTso_add">
              {product.colors.map((color, index) => (
                <div key={index} className="box_sizeTo_add_item">
                  <p>{color.name}</p>
                  <span
                    onClick={() => removeColorInput(index)}
                    className="spanCancelBox"
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
                value={product.currentColor}
                onChange={handleColorInputChange}
              />
              <div className="addsize_btn" onClick={addColorInput}>
                Add
              </div>
            </div>
          </div>
        </div>
        {/* <div className="add_img_product_box">
          <h3>Product image:</h3>
          <div className="boxicon_img_input">
            <CiImageOn className="boxicon_img_iconn" />
            <input
              type="file"
              name="image"
              className="input"
              onChange={handleInputChange}
            />
          </div>
        </div> */}

        <div className="add_img_product_box">
          <h3>Product image:</h3>
          <div className="boxicon_img_input">
            {product.images && !product.imagePreviews && (
              <div>
                <h3>Current Image:</h3>
                <img
                  src={product.images}
                  alt="Current"
                  style={{ width: "100px" }} // Set the width to 100 pixels
                />
              </div>
            )}

            {/* Display the new image if selected */}
            {product.imagePreviews && (
              <div>
                <h3>New Image:</h3>
                <img
                  src={product.imagePreviews}
                  alt="New"
                  style={{ width: "100px" }} // Set the width to 100 pixels
                />
              </div>
            )}

            {/* Input field to select a new image */}
            <div>
              <h3>Select New Image:</h3>
              <input
                type="file"
                name="images"
                className="input"
                id="fileInput"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn_save_productUser">
          Save
        </button>
      </form>
    </>
  );
}

export default EditProduct;
