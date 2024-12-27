import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import "../products/productBuy.css";
import Menu from "../menuFooter/Menu";
import Header from "../header/Header";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import Payment from "../cart/Payment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ReviewProduct(id) {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  const navigate = useNavigate();
  const product_id = id.id;
  const [showPayment, setShowPayment] = useState(false);
  const [product, setProduct] = useState(null);
  const [price, set_price] = useState(null);
  const [count, set_count] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState([]);
  const MySwal = withReactContent(Swal);

  var user_id = null;
  if (localStorage.getItem("user")) {
    user_id = JSON.parse(window.localStorage.getItem("user")).user_id;
  }

  console.log("#############################");
  console.log(review);
  console.log(user_id);
  console.log(product_id);
  console.log(rating);
  console.log(comment);

  const orderitems = [
    {
      user: user_id,
      items: [
        {
          product: product,
          quantity: count,
          price: price,
        },
      ],
    },
  ];

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
          navigate("/login");
          return;
        }
      })
      .catch((error) => {
        localStorage.clear();
        console.log(error);
        navigate("/login");
        return;
      });
  }, [token]);

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/detail/${product_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setProduct(response.data);
        set_price(response.data.price);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [product_id]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      // url:
      // import.meta.env.VITE_API +
      // `store/review/${product_id}/user/${user_id}/`,
      url:
        import.meta.env.VITE_API +
        `/store/reviews/by-product/${product_id}/user/${user_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setReview(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [product_id, user_id]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      product: product_id,
      user: user_id,
      rating: rating,
      comment: comment,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/review/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        MySwal.fire({
          text: "Successful review.",
          icon: "success",
        });
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });

    setRating(0);
    setComment("");
  };

  return (
    <>
      <Header />

      <div className="contentBody">
        <Link to="/" className="box_container_back_icons_back">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        {product ? (
          <div key={product.id}>
            <div className="boxProduct_deteils">
              <div className="slider">
                <React.Fragment>
                  <section className="product_details">
                    <div className="product-page-img">
                      <div className="myslides">
                        <img src={product.image_set[0]} alt="" />
                      </div>
                    </div>
                  </section>
                </React.Fragment>
              </div>

              <div className="txtContentproduct">
                <h1 className="txt_nameP">Name: {product.name}</h1>
                <p className="money_txt">
                  Price:{" "}
                  {parseFloat(product.price).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    useGrouping: true,
                  })}
                </p>

                <div className="hr">
                  <hr />
                </div>
                <br />

                {review.length != "" ? (
                  <div>
                    <h3>Already commented.</h3> <br />
                    <p>Comment: {review.comment}</p>
                    <p>Rating: {review.rating}</p>
                    <p>Date: {new Date(review.created_at).toLocaleString()}</p>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      width: "60%",
                      margin: "0 auto",
                    }}
                  >
                    <h2>Leave a Review</h2>
                    <div style={{ marginBottom: "20px" }}>
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: index < rating ? "#FFD700" : "#DDDDDD",
                          }}
                          onClick={() => handleRatingChange(index + 1)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <form
                      onSubmit={handleSubmitReview}
                      style={{ marginBottom: "20px" }}
                    >
                      <textarea
                        rows="4"
                        cols="50"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Write your review here..."
                        style={{ fontSize: "20px", padding: "10px" }}
                      />
                      <br />
                      <button
                        type="submit"
                        style={{
                          fontSize: "20px",
                          padding: "8px 25px",
                          border: "none",
                          borderRadius: "5px",
                          color: "white",
                          background: "#FF4F16",
                          cursor: "pointer",
                          marginTop: "3rem"
                        }}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Menu />
    </>
  );
}

export default ReviewProduct;
