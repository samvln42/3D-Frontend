import React from 'react'
import './SuccessfulBuy.css'
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function SuccessfulBuy() {
    return (
        <>
            <Header />
            <div className="bill">
                <Link to="/" className="box_container_back_icons_back">
                    <IoIosArrowBack id="icons_back" />
                    <p>Back</p>
                </Link>
                <div className="bill-detial newspanBox" >
                    <div className="guopoidHead">
                        <div className="idf">
                            <p>OrderID: </p>
                            <p>UserID: </p>
                            <p>Name: </p>
                        </div>
                    </div>
                    <div className="billGopBox">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>name</td>
                                    <td>2,000</td>
                                    <td>3</td>
                                    <td>red</td>
                                    <td>L</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="titlePrice">
                        <p>Total:</p>
                        <p>2,000 KIP</p>
                    </div>
                    <div className="place-on">
                        <p>Place on: BCEL ONE</p>
                        <p>Payment method: MasterCard</p>
                        <p>Status: something</p>
                        <p>Delivery: company name</p>
                    </div>
                </div>
                
            </div>
            <Menu />
        </>
    )
}

export default SuccessfulBuy