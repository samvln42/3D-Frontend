import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Products from './Products';
import Header from "../header/Header";
import Store from './Store';
import Menu from "../menuFooter/Menu";
import Banner from "../header/Banner";
import './p3d.css';

const P3D = () => {
    const [products, setProducts] = useState([]);
    const [itemPopup, setItemPopup] = useState([]);

    const [storeId, setStoreId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // canvasRef
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);

    const imageRef = useRef(new Image());
    const [stockedImage, setStockedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [clickedPoint, setClickedPoint] = useState(null);

    const [mousePosition, setMousePosition] = useState(null);
    const [stocked, setStocked] = useState([]);
    const [currentImageId, setCurrentImageId] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [is3DMode, setIs3DMode] = useState(false);
    const [productsArea, setProductsArea] = useState([]);

    // Handle mouse move
    const handleMouseMove = useCallback((e) => {
        if (!stockedImage || stockedImage.length === 0) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // ใช้ RAF แทน debounce
        requestAnimationFrame(() => {
            setMousePosition({ x, y });
        });
    }, [stockedImage]);

    // Get products area
    useEffect(() => {
        if (!mousePosition || !currentImageId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        // ใช้ throttle แทน debounce สำหรับการเรียก API
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API}/store/stocked-image/${currentImageId}/products/area/?start_x=${mousePosition.x}&end_x=${mousePosition.x}&start_y=${mousePosition.y}&end_y=${mousePosition.y}`,
                    { signal }
                );
                
                if (response.data.length > 0) {
                    requestAnimationFrame(() => {
                        setProductsArea(response.data[0]);
                    });
                } else {
                    setProductsArea(null);
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.log("Error fetching product data:", error);
                }
            }
        }, 8); // ลดเวลา throttle ลงเหลือ 8ms

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [mousePosition, currentImageId]);

    // Handle close popup
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    }

    // Get stocked images
    const handleStocked = (id) => {
        setIsPopupOpen(false);
        setClickedPoint(null);
        setCurrentImageId(null);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: import.meta.env.VITE_API + `/store/stocked/${id}/images`,
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

        // วาดรูปภาพพื้นหลัง
        const img = imageRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // เพิ่มการตรวจสอบความสมบูรณ์ของ productsArea
        if (productsArea && 
            Array.isArray(productsArea.x_axis) && 
            Array.isArray(productsArea.y_axis) && 
            productsArea.x_axis.length >= 2 && 
            productsArea.y_axis.length >= 2) {
            
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            
            const width = productsArea.x_axis[1] - productsArea.x_axis[0];
            const height = productsArea.y_axis[1] - productsArea.y_axis[0];
            
            ctx.strokeRect(
                productsArea.x_axis[0],
                productsArea.y_axis[0],
                width,
                height
            );
        }
    }, [stockedImage, productsArea]);

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
        setMousePosition(null);
        setProductsArea([]);
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
        setCurrentImageId(null);
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
        setCurrentImageId(null);
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
        setIs3DMode(true);
        if (storeId && stocked && stocked.length > 0) {
            handleStocked(stocked[0].id);
        }
    }

    // Handle close 3D mode
    const handleClose3DMode = () => {
        setIs3DMode(false);
        setStocked([]);
    }

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Header />
            <Banner />
            <Store handleStocked={handleStocked} setStocked={setStocked} setStoreId={setStoreId} is3DMode={is3DMode} />
            <div className="p3d-container">
                {stockedImage && is3DMode &&
                    <div className="product-gallery">
                        <button className="fullscreen-button" onClick={toggleFullscreen}>
                            {isFullscreen ? '⤌' : '⤢'}
                        </button>

                        <div className="gallery-wrapper" ref={canvasContainerRef}>
                            <button className="nav-button prev" onClick={prevImage}>
                                &lt;
                            </button>

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

                            {isPopupOpen && itemPopup && (
                                <div className='product-container product-popup-container'>
                                    <Link to={`/goods/${itemPopup.goods_id}`} className='product-card product-card-popup' onClick={handleClick}>
                                        <img
                                            className="product-image image-popup"
                                            src={itemPopup.images}
                                            alt={itemPopup.name}
                                        />
                                        <div className="info-popup">
                                            <h3 className="product-name name-popup ">{itemPopup.name}</h3>
                                            <p className="product-price price-popup">$ {itemPopup.price}</p>
                                        </div>
                                    </Link>
                                    <button className='close-popup' onClick={handleClosePopup}>
                                        X
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="category-tags">
                            {stocked.map((item, index) => (
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
                setItemPopup={setItemPopup}
                setIsPopupOpen={setIsPopupOpen}
                is3DMode={is3DMode}
            />
            {!is3DMode && storeId && stocked && stocked.length > 0 &&
                <div className='open-3d-modal'>
                    <button className='open-3d-modal-button' onClick={handleOpen3DMode}>
                        <span>open 3D mode</span>
                    </button>
                </div>
            }
            {is3DMode &&
                <div className='open-3d-modal'>
                    <button className='open-3d-modal-button' onClick={handleClose3DMode}>
                        <span>close 3D mode</span>
                    </button>
                </div>
            }
            <Menu />
        </>
    );
};

export default P3D;
