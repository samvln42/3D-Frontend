import React from 'react'
import "./orderpage.css"
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import AdminMenu from '../adminMenu/AdminMenu';
import { IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  // prev next button user in react
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = orders.slice(firstIndex, lastIndex);
  const npage = Math.ceil(orders.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <>
      <AdminMenu />
      <section id='menager'>
        <div className='container_box_orderpage'>
          <div className='box_head_search'>
            <h2>Orders</h2>
            <form className="search">
              <div className="search-box_menageruser">
                <input
                  type="text"
                  placeholder="Search ..."
                />
                <button type="submit">
                  <IoSearchOutline />
                </button>
              </div>
            </form>
          </div>

          <form className='box_users_order'>
            <div className='box_order_text'>
              <p>No: 1</p>
              <div>
                <p>Name: Samsung</p>
              </div>
            </div>
            <div className='box_container_time'>
              <p>20/11/2023</p>
            </div>
            <div className='container_order_icon'>
              <div className='btn_pending'>
                Pending
              </div>
              <Link to='/orderbill-admin' className='btn_view' >
                View
              </Link>
            </div>
          </form>
          <form className='box_users_order'>
            <div className='box_order_text'>
              <p>No: 1</p>
              <div>
                <p>Name: Samsung</p>
              </div>
            </div>
            <div className='box_container_time'>
              <p>20/11/2023</p>
            </div>
            <div className='container_order_icon'>
              <div className='btn_pending'>
                Pending
              </div>
              <Link to='/orderbill-admin' className='btn_view' >
                View
              </Link>
            </div>
          </form>


          <div className="box_container_next_product">
            <button className="box_prev_left_product" onClick={prePage}>
              <AiOutlineLeft id="box_icon_left_right_product" />
              <p>Prev</p>
            </button>

            <div className="box_num_product">
              {numbers.map((n, i) => (
                <div
                  className={`page-link ${currentPage === n ? "active" : ""}`}
                  key={i}
                >
                  <div className="num_admin_product">
                    <p onClick={() => changeCPage(n)}>{n}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="box_prev_right_product" onClick={nextPage}>
              <p>Next</p>
              <AiOutlineRight id="box_icon_left_right_product" />
            </button>
          </div>

        </div>
      </section>
    </>
  )
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
  function changeCPage(userID) {
    setCurrentPage(userID);
  }
}

export default OrderPage