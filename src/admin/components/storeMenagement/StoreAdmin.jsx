import React, { useEffect, useState } from "react";
import "./storeAdmin.css";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function StoreAdmin() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [stores, set_stores] = useState([]);
  const MySwal = withReactContent(Swal);

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
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/stores/",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_stores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {

    MySwal.fire({
      title: "Confirm deletion?",
      text: "Are you sure you want to delete store name?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow"
        };

        fetch(import.meta.env.VITE_API + `/store/${id}/`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            MySwal.fire({
              text: "Delete store successful.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => console.error(error));
      }
    });
  };

  // add store

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    phone_number: '0',
    store_name: '',
    store_address: '',
    store_phone: '',
    company_number: '0',
    sub_address: '',
    introduce: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(formData),
      redirect: "follow"
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/user/admin/create-seller-with-store`,
        requestOptions
      );

      const result = await response.json();

      if (!response.ok) {
        // Check for specific error message from our backend
        if (result.message === 'This email is already registered') {
          MySwal.fire({
            title: 'Error!',
            text: result.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }

        // Handle other errors
        throw new Error(result.message || 'Failed to create seller account');
      }

      // Success case
      MySwal.fire({
        title: 'Success!',
        text: result.message, // ใช้ message จาก backend
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // เพิ่มข้อมูลใหม่เข้าไปใน stores array
        set_stores([...stores, result.data.store]); // ใช้ result.data.store แทน result
        setShowForm(false);
        setFormData({
          email: '',
          nickname: '',
          password: '',
          phone_number: '',
          store_name: '',
          store_address: '',
          store_phone: '',
          company_number: '',
          sub_address: '',
          introduce: ''
        });
      });

    } catch (error) {
      console.error('Error:', error);

      MySwal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };



  return (
    <>

      <section id="menager">
        <AdminMenu />
        <div className="container_body_adminuser">
          {!showForm && (
            <div className="container_box_users">
              <div className="add_store">
                <h2 className="">store list</h2>
                <div className="add_store_btn">
                  <button className="viewMore_storeDetails" onClick={() => setShowForm(!showForm)}>Add Store</button>
                </div>
              </div>

              <div className="box_contanier_stoerNumonevb">
                {stores.length === 0 ? (
                  <p className="no-reviews-message">No Store</p>
                ) : (
                  stores.map((store, index) => (
                    <div className="box_contanier_stoer" key={index}>
                      <p>{store.name}</p>
                      <p>{store.address}</p>
                      <div className="btn_box_Cont">
                        {!store['is_admin'] ? (
                          <button
                            className="delete_storeDetails"
                            onClick={() => {
                              handleDelete(store.id);
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <p className="admin_store">Admin</p>
                        )}
                        <Link to={`/store_detail_edit/${store.id}`} className="viewMore_storeDetails">View</Link>
                        {/* <Link to={`/update_store/${store.id}`} className="viewMore_storeDetails">Update</Link> */}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </section>


      {showForm && (
        <div className="seller-registration-container">
          <h2>Create Seller Account</h2>
          <button className="close_form" onClick={() => setShowForm(!showForm)}>X</button>
          <form onSubmit={handleSubmit} className="seller-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="phone_number">Phone Number:</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="nickname">Nickname:</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="store_name">Store Name:</label>
              <input
                type="text"
                id="store_name"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="store_address">Store Address:</label>
              <input
                type="text"
                id="store_address"
                name="store_address"
                value={formData.store_address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="store_phone">Store Phone:</label>
              <input
                type="tel"
                id="store_phone"
                name="store_phone"
                value={formData.store_phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="company_number">Company Number:</label>
              <input
                type="text"
                id="company_number"
                name="company_number"
                value={formData.company_number}
                onChange={handleChange}
                required
              />
            </div> */}

            {/* <div className="form-group">
              <label htmlFor="sub_address">Sub Address:</label>
              <input
                type="text"
                id="sub_address"
                name="sub_address"
                value={formData.sub_address}
                onChange={handleChange}
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="introduce">Introduction:</label>
              <textarea
                id="introduce"
                name="introduce"
                value={formData.introduce}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <button type="submit" className="submit-button">Create Seller Account</button>
          </form>
        </div>
      )}
    </>
  );
}

export default StoreAdmin;
