import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Products from './Products';
import Header from "../header/Header";
import Store from './Store';
import Menu from "../menuFooter/Menu";
import Banner from "../header/Banner";
import Map from './Map';
import './p3d.css';
import Panorama from '../panorama/PanoramaViewer'
import Swal from 'sweetalert2'

const P3D = () => {
    const [products, setProducts] = useState([]);
    // const [itemPopup, setItemPopup] = useState([]);

    const [productDetails, setProductDetails] = useState(null);
    // const [detailPopup, setDetailPopup] = useState(false);
    const [quantity, set_quantity] = useState(1);

    const [cart, setCart] = useState(() => {
        const localCart = localStorage.getItem("cart");
        return localCart ? JSON.parse(localCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const [storeId, setStoreId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [square, setSquare] = useState([]);
    const [hoveredArea, setHoveredArea] = useState(null);

    // canvasRef
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);

    const imageRef = useRef(new Image());
    const [stockedImage, setStockedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [clickedPoint, setClickedPoint] = useState(null);

    // const [mousePosition, setMousePosition] = useState(null);
    const [stocked, setStocked] = useState([]);
    const [currentImageId, setCurrentImageId] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 3d mode
    const [is3DMode, setIs3DMode] = useState(false);
    const [is3DModeOpen, setIs3DModeOpen] = useState(false);

    // 3d mode Panorama
    const [is3DModePanorama, setIs3DModePanorama] = useState(false);

    // admin id
    const [adminId, setAdminId] = useState(null);

    // panorama image
    const [panoramaImages, setPanoramaImages] = useState([]);

    const findPanoramaImage = panoramaImages.map(image => image.image);

    // const [showPayment, setShowPayment] = useState(false);
    // const [order, setOrder] = useState([]);
    // const user_id = JSON.parse(window.localStorage.getItem("user"))?.user_id;

    // const getProductDetails = (product_id) => {
    //     setDetailPopup(true);
    //     setIsPopupOpen(false);
    //     const config = {
    //         method: "get",
    //         maxBodyLength: Infinity,
    //         url: `${import.meta.env.VITE_API}/store/detail/${product_id}`,
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     axios
    //         .request(config)
    //         .then((response) => {
    //             setProductDetails(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching products:", error);
    //         });

    // }

    const decrease = () => {
        if (quantity > 1) {
            set_quantity(quantity - 1);
        }
    };

    const increase = () => {
        set_quantity(quantity + 1);
    };


    const addToCart = (productDetails, color, size, quantity) => {
        const existingProduct = cart.find(
            (item) =>
                item.id === productDetails.id &&
                item.store_name === productDetails.store_name &&
                item.color === color &&
                item.size === size
        );

        if (existingProduct) {
            setCart(
                cart.map((item) =>
                    item.id === productDetails.id &&
                        item.store_name === productDetails.store_name &&
                        item.color === color &&
                        item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...productDetails, quantity, color, size }]);
        }

        // ตรวจสอบว่า product-info-popup มีอยู่ใน DOM
        const popupContainer = document.querySelector('.product-info-popup');
        if (popupContainer) {
            // แสดง SweetAlert2
            Swal.fire({
                text: "This product has been added to cart.",
                icon: "success",
                position: "top",
                showConfirmButton: false,
                timer: 600,
                customClass: {
                    container: 'swal2-container',
                    popup: 'swal2-popup'
                },
                target: popupContainer,
                backdrop: false,
            });
            // setDetailPopup(false);
            // ปิด popup หลังจากแสดง alert
            // setTimeout(() => {
            //     setDetailPopup(false);
            // }, 2000);
        } else {
            console.error('product-info-popup not found in DOM');
        }
    };

    // const handlePay = (product, color, size, quantity) => {
    //     setOrder([
    //         {
    //             user: user_id,
    //             store: storeId,
    //             items: [
    //                 {
    //                     id: product.id,
    //                     name: product.name,
    //                     images: product.images,
    //                     quantity: quantity,
    //                     price: product.price,
    //                     color: color,
    //                     size: size,
    //                 },
    //             ],
    //         },
    //     ]);
    //     setShowPayment(true);
    // };

    // Get panorama images
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${import.meta.env.VITE_API}/store/${storeId || adminId}/mode-3d/images`, requestOptions)
            .then((response) => response.json())
            .then((result) => setPanoramaImages(result))
            .catch((error) => console.error(error));
    }, [storeId, adminId])

    // get 3d mode
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        if (storeId || adminId) {
            fetch(`${import.meta.env.VITE_API}/store/${storeId || adminId}/mode-3d`, requestOptions)
                .then((response) => response.json())
                .then((result) => setIs3DModeOpen(result.is_enabled))
                .catch((error) => console.error(error));
        }
    }, [storeId, adminId]);


    useEffect(() => {
        const coordinates = products.map(item => ({
            x_axis: item.x_axis,
            y_axis: item.y_axis
        }));

        setSquare(coordinates);
    }, [products]);

    // Handle mouse move for square
    const handleMouseMove = useCallback((e) => {
        if (!stockedImage || stockedImage.length === 0) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // ตรวจสอบว่า mouse อยู่ในพื้นที่ไหน
        const hoveredIndex = square.findIndex(area => {
            return x >= area.x_axis[0] &&
                x <= area.x_axis[1] &&
                y >= area.y_axis[0] &&
                y <= area.y_axis[1];
        });

        setHoveredArea(hoveredIndex !== -1 ? hoveredIndex : null);
    }, [stockedImage, square]);

    // Handle close popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        // setItemPopup(null);
        setProductDetails(null);
    }

    // Get stocked images
    const handleStocked = (id) => {
        setIsPopupOpen(false);
        setClickedPoint(null);
        setCurrentImageId(null);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_API}/store/stocked/${id}/images`,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                setCurrentImageIndex(0);
                setStockedImage(response.data);
                if (response.data && response.data.length > 0) {
                    setCurrentImageId(response.data[0].id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    const drawImage = useCallback(() => {
        if (!stockedImage || stockedImage.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Set fixed canvas dimensions
        canvas.width = 1000; // Fixed width
        canvas.height = 500; // Fixed height

        // วาดรูปภาพพื้นหลัง
        const img = imageRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // วาดเฉพาะพื้นที่ที่กำลัง hover
        if (hoveredArea !== null && square[hoveredArea]) {
            const area = square[hoveredArea];
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 2;

            const width = area.x_axis[1] - area.x_axis[0];
            const height = area.y_axis[1] - area.y_axis[0];

            ctx.strokeRect(
                area.x_axis[0],
                area.y_axis[0],
                width,
                height
            );
        }
    }, [stockedImage, square, hoveredArea]);

    // Load image
    useEffect(() => {
        if (stockedImage && stockedImage.length > 0) {
            const img = imageRef.current;
            img.crossOrigin = "anonymous";
            img.src = stockedImage[currentImageIndex].image;
            img.onload = () => {
                if (canvasRef.current) {
                    drawImage();
                }
            };
        }
    }, [stockedImage, currentImageIndex, drawImage]);

    // Handle mouse leave
    const handleMouseLeave = () => {
        setHoveredArea(null);
    }

    // Handle canvas click
    const handleCanvasClick = useCallback((e) => {
        if (!stockedImage || stockedImage.length === 0) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setClickedPoint({ x, y });
        drawImage();
    }, [stockedImage, drawImage]);

    // Next image
    const nextImage = useCallback(() => {
        if (stockedImage && stockedImage.length > 0) {
            setCurrentImageIndex((prev) => {
                const newIndex = (prev + 1) % stockedImage.length;
                setCurrentImageId(stockedImage[newIndex].id);
                return newIndex;
            });
        }
        setIsPopupOpen(false);
        setClickedPoint(null);
        // setItemPopup(null);

    }, [stockedImage]);

    // Previous image
    const prevImage = useCallback(() => {
        if (stockedImage && stockedImage.length > 0) {
            setCurrentImageIndex((prev) => {
                const newIndex = (prev - 1 + stockedImage.length) % stockedImage.length;
                setCurrentImageId(stockedImage[newIndex].id);
                return newIndex;
            });
        }
        setIsPopupOpen(false);
        setClickedPoint(null);
        // setItemPopup(null);
    }, [stockedImage]);

    // Fullscreen
    const toggleFullscreen = () => {
        const container = canvasContainerRef.current;
        if (container) {
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
                container.classList.add('fullscreen-canvas');
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                    setIs3DMode(false);

                    handleStocked(0);
                    setProductDetails(null);
                    // setIs3DModePanorama(false);
                }
                container.classList.remove('fullscreen-canvas');
            }
        }
    };

    // Add event listener for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const container = canvasContainerRef.current;
            if (container && !document.fullscreenElement) {
                container.classList.remove('fullscreen-canvas');
            }
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Handle open 3D mode
    const handleOpen3DMode = () => {
        // setIs3DMode(true);
        setIs3DModePanorama(true);
        // if (storeId && stocked && stocked.length > 0) {
        //     handleStocked(stocked[0].id);
        // }

        // setTimeout(() => {
        //     const container = canvasContainerRef.current;
        //     if (container) {
        //         if (container.requestFullscreen) {
        //             container.requestFullscreen();
        //         } else if (container.mozRequestFullScreen) {
        //             container.mozRequestFullScreen();
        //         } else if (container.webkitRequestFullscreen) {
        //             container.webkitRequestFullscreen();
        //         } else if (container.msRequestFullscreen) {
        //             container.msRequestFullscreen();
        //         }
        //         container.classList.add('fullscreen-canvas');
        //     }
        // }, 5);

        window.scrollTo({
            top: 650,
            behavior: "smooth",
        });

    }

    // Handle close 3D mode
    const handleClose3DMode = () => {
        setIs3DMode(false);
        setIs3DModePanorama(false);
        // setStocked([]);
    }

    useEffect(() => {
        if (!isFullscreen) {
            setIs3DMode(false);
            setIs3DModePanorama(false);
        }
    }, [isFullscreen]);

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Header />
            <Banner storeId={storeId} adminId={adminId} />
            <Store
                handleStocked={handleStocked}
                setStocked={setStocked}
                setStoreId={setStoreId}
                storeId={storeId}
                is3DMode={is3DMode}
                setAdminId={setAdminId}
                adminId={adminId}
            />
            {is3DModePanorama &&
                <Panorama
                    handleStocked={handleStocked}
                    handleOpen3DMode={handleOpen3DMode}
                    setIs3DMode={setIs3DMode}
                    handleClose3DMode={handleClose3DMode}
                    findPanoramaImage={findPanoramaImage}
                />
            }

            <div className="p3d-container">

                {stockedImage && is3DMode && stocked.length > 0 &&
                    <div className="product-gallery">
                        {!isFullscreen &&
                            <Map currentImageIndex={currentImageIndex} />
                        }

                        <button className="fullscreen-button" onClick={toggleFullscreen}>
                            ⤢
                        </button>

                        <div className="gallery-wrapper" ref={canvasContainerRef}>
                            <button className="nav-button prev" onClick={prevImage}>
                                &lt;
                            </button>
                            <button className="exit-fullscreen-button" onClick={toggleFullscreen}>
                                ←
                            </button>
                            <div className='fullscreen-map'>
                                {isFullscreen &&
                                    <Map currentImageIndex={currentImageIndex} />
                                }
                            </div>
                            <canvas
                                ref={canvasRef}
                                width={1000}
                                height={500}
                                onClick={handleCanvasClick}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            />

                            <button className="nav-button next" onClick={nextImage}>
                                &gt;
                            </button>

                            {isPopupOpen && productDetails && (
                                // <div className='product-container product-popup-container'>
                                //     <Link /*to={/goods/${itemPopup.goods_id}}*/ className='product-card product-card-popup' onClick={() => getProductDetails(itemPopup.goods_id)}>
                                //         <img
                                //             className="product-image image-popup"
                                //             src={itemPopup.images}
                                //             alt={itemPopup.name}
                                //         />
                                //         <div className="info-popup">
                                //             <h3 className="product-name name-popup ">{itemPopup.name}</h3>
                                //             <p className="product-price price-popup">{itemPopup.price} 원</p>
                                //         </div>
                                //     </Link>
                                //     <button className='close-popup' onClick={handleClosePopup}>
                                //         X
                                //     </button>
                                // </div>
                                <div className='product-info-popup'>
                                <div className="product-detail-container-popup">
                                    <div className="product-image-container-popup">
                                        <img
                                            src={productDetails?.images}
                                            alt={productDetails?.name}
                                            className="product-detail-image-popup"
                                        />
                                    </div>
                                    <div className="product-detail-content-popup">
                                        <h2 className="product-detail-title-popup">{productDetails?.name}</h2>
                                        <p className="product-detail-price-popup">{productDetails?.price} 원</p>
                                        <p className="product-detail-description-popup">{productDetails?.description}</p>
                                        <div className="product-detail-quantity-popup">
                                            <button className="quantity-btn-popup" onClick={decrease}>-</button>
                                            <span className="quantity-value-popup">{quantity}</span>
                                            <button className="quantity-btn-popup" onClick={increase}>+</button>
                                        </div>
                                        <div className="product-detail-buttons-popup">
                                            <button
                                                className="add-to-cart-btn-popup"
                                                onClick={() => {
                                                    if (productDetails) {
                                                        addToCart(productDetails, null, null, quantity)
                                                    }
                                                }}
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                    <button className="close-detail-btn-popup" onClick={handleClosePopup}>
                                        X
                                    </button>
                                </div>
                            </div>

                            )}

                            {/* product info */}
                            {/* {detailPopup &&
                                <div className='product-info-popup'>
                                    <div className="product-detail-container-popup">
                                        <div className="product-image-container-popup">
                                            <img
                                                src={productDetails?.images}
                                                alt={productDetails?.name}
                                                className="product-detail-image-popup"
                                            />
                                        </div>
                                        <div className="product-detail-content-popup">
                                            <h2 className="product-detail-title-popup">{productDetails?.name}</h2>
                                            <p className="product-detail-price-popup">{productDetails?.price} 원</p>
                                            <div className="product-detail-quantity-popup">
                                                <button className="quantity-btn-popup" onClick={decrease}>-</button>
                                                <span className="quantity-value-popup">{quantity}</span>
                                                <button className="quantity-btn-popup" onClick={increase}>+</button>
                                            </div>
                                            <div className="product-detail-buttons-popup">
                                                <button
                                                    className="add-to-cart-btn-popup"
                                                    onClick={() => {
                                                        if (productDetails) {
                                                            addToCart(productDetails, null, null, quantity)
                                                        }
                                                    }}
                                                >
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                        <button className="close-detail-btn-popup" onClick={() => setDetailPopup(false)}>
                                            X
                                        </button>
                                    </div>
                                </div>
                            } */}


                        </div>

                        <div className="category-tags">
                            {stocked && stocked.length > 0 && stocked.map((item, index) => (
                                <span
                                    className="category-tag"
                                    key={`stocked-${index}`}
                                    onClick={() => handleStocked(item.id)}
                                >
                                    {item.point_view}
                                </span>
                            ))}
                        </div>
                    </div>
                }
            </div>

            <Products
                products={products}
                setProducts={setProducts}
                storeId={storeId}
                currentImageId={currentImageId}
                clickedPoint={clickedPoint}
                clickedPointX={clickedPoint?.x}
                clickedPointY={clickedPoint?.y}
                // setItemPopup={setItemPopup}
                setIsPopupOpen={setIsPopupOpen}
                is3DMode={is3DMode}
                adminId={adminId}
                setProductDetails={setProductDetails}
                set_quantity={set_quantity}
            />

            {!is3DModePanorama && is3DModeOpen && stocked.length > 0 &&
                <div className='open-3d-modal'>
                    <button className='open-3d-modal-button' onClick={handleOpen3DMode} >
                        <span>open 3D mode</span>
                    </button>
                </div>
            }
            {is3DModeOpen && is3DModePanorama &&
                <div className='open-3d-modal'>
                    <button className='open-3d-modal-button' onClick={handleClose3DMode}>
                        <span>close 3D mode</span>
                    </button>
                </div>
            }

            <Menu storeId={storeId} />
        </>
    );
};

export default P3D;