import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './products.css';

const Products = (
    {
        products,
        setProducts,
        storeId,
        currentImageId,
        clickedPoint,
        clickedPointX,
        clickedPointY,
        setItemPopup,
        setIsPopupOpen,
        is3DMode
    }
) => {

    // Get goods
    useEffect(() => {
        let url = '';


        if ((currentImageId || storeId) && is3DMode) {
            url = import.meta.env.VITE_API + `/store/${storeId}/stocked-image/${currentImageId}/goods/list`;
        } else if (storeId && !is3DMode || currentImageId) {
            url = import.meta.env.VITE_API + `/store?store_id=${storeId}`;
        } else {
            url = import.meta.env.VITE_API + `/store`;
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
    }, [currentImageId, storeId, is3DMode]);

    // Get products by stocked-image
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
                    setItemPopup(response.data[0]);
                    setIsPopupOpen(true);
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
    return (
        <div className="products-container">
            {/* <h1 className="products-title">Products</h1> */}
            <h2 className="box_betavinOfob asd2">
                <span className="spennofStyle" />
                Products
            </h2>
            <div className="products-grid">
                {products.map((product, index) => (
                    <div key={index} className="product-card">
                        <Link to={`/goods/${product.id}`} onClick={handleClick}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                        </Link>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">$ {product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
