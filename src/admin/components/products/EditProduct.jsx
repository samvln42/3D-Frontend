import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../adminMenu/AdminMenu";
import { FaAngleLeft } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import "./addProduct.css";

const EditProduct = () => {

  const [product, setProduct] = useState({
    sizes: [],
  });

  const handleSizeInputChange = (e) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      currentsizes: value,
    }));
  };

  const addSizeInput = () => {
    if (product.currentsizes.trim() !== "") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        sizes: [...prevProduct.sizes, prevProduct.currentsizes],
        currentsizes: "", // Reset the current color after adding
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
  return (
    <>
      <AdminMenu />
      <section id="post">
        <div className="goback">
          <Link to="/product-admin" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
        </div>
        <div className="box_container_product">
          <form className="box_content_productadmin">
            <h3>Edit Product</h3>
            <div className='inputproduct_box'>
              <label >Name:</label>
              <input className="inputproduct" name='name' type="text" placeholder='Product name' />
            </div>
            <div className='inputproduct_box'>
              <label >Price:</label>
              <input className="inputproduct" name='price' type="text" placeholder='Product price' />
            </div>
            <div className='inputproduct_box'>
              <label>Category:</label>
              <select name="category" className="inputproduct select_box">
                <option className='option_itemD' value="Name1">Name1</option>
                <option className='option_itemD' value="Name1">Name1</option>
                <option className='option_itemD' value="Name1">Name1</option>
              </select>
            </div>
            <div className='inputproduct_box'>
              <label >Description:</label>
              <input className="inputproduct" name='description' type="text" placeholder='Description' />
            </div>

            <div className="size_product_box">
              <h3>Size:</h3>
              <div className="size_product_box_container">
                <div className="box_sizeTso_add" >
                  {product.sizes.map((size, index) => (
                    <div className="box_sizeTo_add_item">
                      <p>{size}</p>
                      <span
                        className="spanCancelBox"
                        onClick={() => removeSizeInput(index)}
                      >
                        <IoIosClose className='iconn_close_addSize' />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="size_content_box">
                  <input
                    className="inputproduct"
                    type="text"
                    placeholder='Add Size...'
                    onChange={handleSizeInputChange}
                  />
                  <div className="addsize_btn" onClick={addSizeInput}>
                    Add
                  </div>
                </div>
              </div>
            </div>

            <div className="add_img_product_box">
              <h3>Product image:</h3>
              <div className="boxicon_img_input">
                <CiImageOn className='boxicon_img_iconn' />
                <input type="file" name='image' className="input" />
              </div>
            </div>

            <div className="add_img_product_box">
              <h3>Details image:</h3>
              <div className="boxicon_img_input">
                <CiImageOn className='boxicon_img_iconn' />
                <input type="file" name='image_details' className="input" />
              </div>
            </div>

            <button type="submit" className="btn_save_productadmin">
              Save
            </button>

          </form>
        </div>
      </section>
    </>
  );
};

export default EditProduct;
