import "./store.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import banner from "../../../img/banner.jpg";
import productImage from "../../../img/productImage.png";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Store = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const [category, set_category] = useState(1);
  const [goods_list, set_goods_list] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(goods_list.length / itemsPerPage);

  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const handleConfirmDelete = (id) => {
    handleDelete();
    setShowConfirmationDelete(false);
  };
  const handleCancelDelete = () => {
    setShowConfirmationDelete(false);
  };

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

  //Function Delete
  const handleDelete = (id) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/product/delete/${id}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("Delete product uccessful.");
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log(goods_list);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${storage.store_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data.goods_set);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storage.store_id]);

  // ==== Paginator management ====
  // Calculate index range for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGoods = goods_list.slice(startIndex, endIndex);

  // Handle pagination click
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle next and previous page
  const nextPage = () => {
    setCurrentPage(currentPage === totalPages ? totalPages : currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage === 1 ? 1 : currentPage - 1);
  };

  return (
    <>
      <div className="box_store">
        <div className="store_container">
          <div className="store_item_head">
            <Link to="/" className="back_icons_back">
              <IoIosArrowBack />
              <p>Back</p>
            </Link>
            <div className="title_nameStore">
              <h3>Store: {storage.origin_store_name}</h3>
            </div>
            <Link to="/store-management" className="btn_add_editStore">
              Add/Edit
            </Link>
          </div>

          <div className="link_btn_store">
            <Link to="/stores" className="btn_link_store link_store_active">
              Sale items
            </Link>
            <Link to="/dashboard-seller" className="btn_link_store">
              Dashboard
            </Link>
            <Link to="/payment-store" className="btn_link_store">
              Payment
            </Link>
          </div>

          <div className="banner_box">
            <img src={banner} alt="" />
          </div>

          {/* <div className="product-area">
            {goods_list.map(
              (i, index) =>
                i.category !== "Food" && (
                  <div className="box-product" key={index}>
                    <Link to={`/edit-product/${i.goods_id}`}>
                      <div className="img">
                        <img src={i.images} alt="image" />
                      </div>
                      <ul className="txtOFproduct2">
                        <li className="name">{i.name}</li>
                        <li className="price">
                          {parseFloat(i.price).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                          })}{" "}
                          Kip
                        </li>
                      </ul>
                    </Link>
                  </div>
                )
            )}
          </div> */}

          <div className="product-area">
            {currentGoods.map(
              (product, index) =>
                product.category !== "Food" && (
                  <div className="box-product" key={index}>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.goods_id)}
                    >
                      Delete
                    </button>
                    <Link to={`/edit-product/${product.goods_id}`}>
                      <div className="img">
                        <img src={product.images} alt="image" />
                      </div>
                      <ul className="txtOFproduct2">
                        <li className="name">{product.name}</li>
                        <li className="price">
                          {parseFloat(product.price).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            useGrouping: true,
                          })}{" "}
                          Kip
                        </li>
                      </ul>
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>
        <br />
        {/* Render pagination */}
        <div className="pagination" style={{ textAlign: "center" }}>
          <button
            style={{ padding: "10px 20px", margin: "0 5px", fontSize: "16px" }}
            disabled={currentPage === 1}
            onClick={prevPage}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                style={{
                  padding: "10px 20px",
                  margin: "0 5px",
                  fontSize: "16px",
                  backgroundColor:
                    currentPage === page ? "#007bff" : "transparent",
                  color: currentPage === page ? "white" : "black",
                }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
          <button
            style={{ padding: "10px 20px", margin: "0 5px", fontSize: "16px" }}
            disabled={currentPage === totalPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Store;
