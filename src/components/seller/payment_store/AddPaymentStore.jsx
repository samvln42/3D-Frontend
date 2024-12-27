import "./addPaymentStore.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";

const AddPaymentStore = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const [is_has_bank_account, set_has_bank_account] = useState(false);
  var store_id = null;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const [dataPayment, setdataPayment] = useState({
    name: "",
    account_name: "",
    account_number: "",
    image: null,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setdataPayment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        import.meta.env.VITE_API +
        `/store/bank-accounts/${store_id}/has_bank_account`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data.has_bank_account));
        set_has_bank_account(response.data.has_bank_account);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  console.log(store_id);
  console.log(is_has_bank_account);

  const handleSubmit = async () => {
    const formdata = new FormData();
    formdata.append("name", dataPayment.name);
    formdata.append("account_name", dataPayment.account_name);
    formdata.append("account_number", dataPayment.account_number);
    formdata.append("image", fileInput.files[0]);
    formdata.append("store", store_id);

    if (is_has_bank_account === true) {
      // If the user already has a cart, update the existing cart
      const requestOptions = {
        method: "PUT",
        body: formdata,
        redirect: "follow",
      };

      fetch(
        `${import.meta.env.VITE_API}/store/bank-accounts/update/${store_id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // alert("The bank account has been updated.")
        })
        .catch((error) => console.error(error));
    } else {
      // If the user doesn't have a cart, create a new cart
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${import.meta.env.VITE_API}/store/bank-accounts`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // alert("The bank account has been added.")
        })
        .catch((error) => console.error(error));
    }

    alert("The Back account has been managed.");


    // if (is_has_bank_account === true) {
    //   alert("Bank account has been updated");
    // } else {
    //   alert("Bank account has been added");
    // }
  };

  return (
    <>
      <div className="header_box_management">
        <Link to="/payment-store" className="box_management_iconnback">
          <IoIosArrowBack id="icons_back" />
          <p>Back</p>
        </Link>
        <div>
          <h3>Store management</h3>
        </div>
        <div></div>
      </div>
      <form className="box_container_review1">
        <div className="add_payment_box">
          <h3>Add payment</h3>
          <div className="inputproduct_box">
            <p>Bank name:</p>
            <input
              className="inputproduct"
              type="text"
              name="name"
              placeholder="name..."
              onChange={handleInputChange}
            />
          </div>
          <div className="inputproduct_box">
            <p>Account name:</p>
            <input
              className="inputproduct"
              type="text"
              name="account_name"
              placeholder="Account name..."
              onChange={handleInputChange}
            />
          </div>
          <div className="inputproduct_box">
            <p>Account number:</p>
            <input
              className="inputproduct"
              type="text"
              name="account_number"
              placeholder="account number..."
              onChange={handleInputChange}
            />
          </div>
          <div className="add_img_product_box">
            <p>QR Code:</p>
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

          <button className="btn_save_productUser" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AddPaymentStore;
