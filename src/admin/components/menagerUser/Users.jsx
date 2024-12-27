import React, { useEffect, useState } from "react";
import "./users.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import AdminMenu from "../adminMenu/AdminMenu";
import { Link, useNavigate } from "react-router-dom";
import userImage from "../../../img/user.png";
import profile from "../../../img/profile.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Users = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const itemsPerPage = 4;
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API}/user/check-token`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.result !== "success") {
          localStorage.clear();
          navigate("/loginuser");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/loginuser");
      }
    };

    checkToken();
  }, [token, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/user/client-users`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/user/client-users/${id}`
      );
      // alert("Delete user successful.");
      MySwal.fire({
        text: "Delete user successful.",
        icon: "success",
      });
      setId("");
      setShowConfirmation(false);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const nextPage = () =>
    setCurrentPage((prev) => (prev === totalPages ? totalPages : prev + 1));
  const prevPage = () =>
    setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <AdminMenu />
      <div className="container_body_adminuser">
        <div className="container_box_adminusers">
          <div className="box_users">
            <h2>Users</h2>
            {/* <form className="search">
              <div className="search-box_menageruser">
                <input type="text" placeholder="Search ..." />
                <button type="submit">
                  <IoSearchOutline />
                </button>
              </div>
            </form> */}
          </div>

          {users.length === 0 ? (
            <p className="no-reviews-message">No Users</p>
          ) : (
            currentUsers.map((user, index) => (
              <div key={index} className="box_users_user">
                <div className="box_dp_txtandiamge">
                  <div className="box_user_img">
                    <img src={user.profile_image || profile} alt="" />
                  </div>
                  <div className="box_user_text">
                    <p>{user.nickname}</p>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="btn_box_Cont">
                  <button
                    className="delete_storeDetails"
                    onClick={() => {
                      setShowConfirmation(true);
                      setId(user.id);
                    }}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/user-details/${user.id}`}
                    className="viewMore_storeDetails"
                  >
                    View
                  </Link>
                </div>
                {showConfirmation && (
                  <div className="background_addproductpopup_box">
                    <div className="hover_addproductpopup_box">
                      <div className="box_logout">
                        <p>Are you sure you want to delete?</p>
                      </div>
                      <div className="btn_foasdf">
                        <button
                          className="btn_cancel btn_addproducttxt_popup"
                          onClick={() => setShowConfirmation(false)}
                        >
                          No
                        </button>
                        <button
                          className="btn_confirm btn_addproducttxt_popup"
                          onClick={handleDelete}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {users.length > itemsPerPage && (
            <div className="box_container_next_resume">
              <button
                className="box_prev_left_resume"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <div className="box_num_resume" key={index}>
                  <button
                    className={`num_admin_resume ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
              <button
                className="box_prev_right_resume"
                disabled={currentPage === totalPages}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
