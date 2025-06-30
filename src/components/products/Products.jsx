import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './products.css';
import istockphoto from "../../img/istockphoto.jpg";


const Products = (
    {
        products,
        setProducts,
        storeId,
        currentImageId,
        clickedPoint,
        clickedPointX,
        clickedPointY,
        // setItemPopup,
        setIsPopupOpen,
        is3DMode,
        adminId,
        setProductDetails,
        set_quantity
    }
) => {

    const [storeName, setStoreName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [visibleProducts, setVisibleProducts] = useState(12);

    // Get store info
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_API}/store/${storeId || adminId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setStoreName(result.name)
                setPhone(result.phone)
                setAddress(result.address)
            })
            .catch((error) => console.error(error));
        setVisibleProducts(12)
    }, [storeId, adminId]);


    // Get goods by stocked-image
    useEffect(() => {

        let url = '';


        if ((currentImageId || storeId || adminId) && is3DMode) {
            url = import.meta.env.VITE_API + `/store/${storeId || adminId}/stocked-image/${currentImageId}/goods/list`;
        } else if (storeId && !is3DMode || currentImageId || adminId) {
            url = import.meta.env.VITE_API + `/store?store_id=${storeId || adminId}`;
        }


        if (!url) return;


        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: url,
            headers: {
                "Content-Type": "application/json",
            },
        };

        axios
            .request(config)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                } else {
                    setProducts([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentImageId, storeId, is3DMode, adminId]);

    // Get products by stocked-image area
    useEffect(() => {
        if (!currentImageId || !clickedPoint) return;

        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: import.meta.env.VITE_API +
                `/store/stocked-image/${currentImageId}/products/area/?start_x=${clickedPointX}&end_x=${clickedPointX}&start_y=${clickedPointY}&end_y=${clickedPointY}`,
            headers: {},
        };

        axios.request(config)
            .then((response) => {
                if (response.data.length > 0) {
                    // setItemPopup(response.data[0]);
                    setIsPopupOpen(true);

                    const config = {
                        method: "get",
                        maxBodyLength: Infinity,
                        url: `${import.meta.env.VITE_API}/store/detail/${response.data[0].goods_id}`,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    };

                    axios
                        .request(config)
                        .then((response) => {
                            setProductDetails(response.data);
                            set_quantity(1)
                        })
                        .catch((error) => {
                            console.error("Error fetching products:", error);
                        });
                } else {
                    setItemPopup(null);
                    setIsPopupOpen(false);
                }
            })
            .catch((error) => {
                console.log("Error fetching product data:", error);
                setItemPopup(null);
                setIsPopupOpen(false);
            });
    }, [currentImageId, clickedPoint, clickedPointX, clickedPointY]);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleLoadMore = () => {
        setVisibleProducts(prevCount => prevCount + 12);
    };

    return (
        <div className={`${is3DMode === true ? 'products-container' : 'no3dpage'}`}>
            {/* <h1 className="products-title">Products</h1> */}
            <div className="store-info">
                <h2 className="box_betavinOfob asd2">
                    <span className="spennofStyle" />
                    Products {`of store ${storeName}`}
                </h2>
                <div className="products-header-info">
                    <p>tel: <span>{phone}</span></p>
                    <p>address: <span>{address}</span></p>
                </div>
            </div>
            <div className="products-grid">
                {products.slice(0, visibleProducts).map((product, index) => (
                    <div key={index} className="product-card">
                        <Link to={`/goods/${product.id}`} onClick={handleClick}>
                            <img
                                src={product.image ? product.image : istockphoto}
                                alt={product.name}
                                className="product-image"
                            />
                        </Link>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.description.length > 20
                                ? `${product.description.slice(0, 20)}...`
                                : product.description}</p>
                            <p className="product-price">{product.price} 원</p>
                        </div>
                    </div>
                ))}
            </div>

            {visibleProducts < products.length && (
                <div className="view-more-container">
                    <button className="view-more-button" onClick={handleLoadMore}>
                        View More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
