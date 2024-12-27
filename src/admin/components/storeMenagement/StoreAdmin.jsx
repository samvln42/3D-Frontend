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
        let data = "";
        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/stores/${id}/delete`,
          headers: {},
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            MySwal.fire({
              text: "Delete store successful.",
              icon: "success",
            });
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <section id="menager">
        <AdminMenu />
        <div className="container_body_adminuser">
          <div className="container_box_users">
            <div className="box_users"></div>
            <div className="box_contanier_stoerNumonevb">
              {stores.length === 0 ? (
                <p className="no-reviews-message">No Store</p>
              ) : (
                stores.map((store, index) => (
                  <div className="box_contanier_stoer" key={index}>
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <div className="btn_box_Cont">
                      <button
                        className="delete_storeDetails"
                        onClick={() => {
                          handleDelete(store.id);
                        }}
                      >
                        Delete
                      </button>
                      <Link to={`/store_detail_edit/${store.id}`} className="viewMore_storeDetails">View</Link>
                      <Link to={`/update_store/${store.id}`} className="viewMore_storeDetails">Update</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default StoreAdmin;
