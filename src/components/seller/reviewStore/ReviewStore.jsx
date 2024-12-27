import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import './reivewStore.css'
import user from "../../../img/user.png";
import icon_star from "../../../img/icon_star.png"
import icon_star2 from "../../../img/icon_star2.png"
import productImage from "../../../img/productImage.png";

function ReviewStore() {
    return (
        <>
            <div className="header_box_management">
                <Link to="/stores" className="box_management_iconnback">
                    <IoIosArrowBack id="icons_back" />
                    <p>Back</p>
                </Link>
                <div>
                    <h3>Store management</h3>
                </div>
                <div></div>
            </div>
            <div className="box_container_review">
                <div className="link_btn_store">
                    <Link to="/stores" className="btn_link_store ">
                        Sale items
                    </Link>
                    <Link to="/dashboard_seller" className="btn_link_store link_store_active">
                        Dashboard
                    </Link>
                    <Link to="/payment_store" className="btn_link_store">
                        Payment
                    </Link>
                </div>
                <div className="box_content_review">
                    <div className="box_item_review">
                        <div className="box_comment_connntent">
                            <div className="box_head_user">
                                <div className="box_head_user_title">
                                    <div className="comment__userImg">
                                        <img src={user} alt="" />
                                    </div>
                                    <div className="box_head_user_titt_detils">
                                        <p>Name of user</p>
                                        <form className="review_boxstar_user">
                                            <img src={icon_star} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                        </form>
                                    </div>
                                </div>
                                <div className="box_user_time">
                                    <p>2023.08.23</p>
                                </div>
                            </div>
                            
                            <div className="comment_boxOfuser">
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est numquam sapiente voluptates ut porro quisquam eveniet voluptas sed. Nulla ducimus odit esse quam corporis, dolorem labore. Ipsa quis repudiandae nihil.</p>
                            </div>
                            <div className='img_review_product'>
                                <img src={productImage} alt="" />
                            </div>
                        </div>

                        <div className="box_comment_connntent">
                            <div className="box_head_user">
                                <div className="box_head_user_title">
                                    <div className="comment__userImg">
                                        <img src={user} alt="" />
                                    </div>
                                    <div className="box_head_user_titt_detils">
                                        <p>Name of user</p>
                                        <form className="review_boxstar_user">
                                            <img src={icon_star} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                            <img src={icon_star2} alt="" />
                                        </form>
                                    </div>
                                </div>
                                <div className="box_user_time">
                                    <p>2023.08.23</p>
                                </div>
                            </div>
                            <div className="comment_boxOfuser">
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Est numquam sapiente voluptates ut porro quisquam eveniet voluptas sed. Nulla ducimus odit esse quam corporis, dolorem labore. Ipsa quis repudiandae nihil.</p>
                            </div>
                            <div className='img_review_product'>
                                <img src={productImage} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewStore