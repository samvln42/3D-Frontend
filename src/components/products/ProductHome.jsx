import "./productHome.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ProductHome = () => {
  const [logo, set_logo] = useState(null);
  const [goods_list, set_goods_list] = useState([]);
  const storage = JSON.parse(window.localStorage.getItem("user"));

  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  // Get logo
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/store/web-info",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_logo(response.data[0].logo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [logo]);

  // Get goods
  useEffect(() => {
    let my_url = "";
    if (storage) {
      if (!storage.is_admin && store_id) {
        my_url = `/store/?store_id=${store_id}`;
      } else {
        my_url = `/store/`;
      }
    } else {
      my_url = `/store/`;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + my_url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          set_goods_list(response.data);
        } else {
          set_goods_list([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [store_id, storage.is_admin]);

  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [itemPopup, setItemPopup] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // canvasRef
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());
  const [stockedImage, setStockedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [stocked, setStocked] = useState([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  // เพิ่ม state สำหรับควบคุมโหมดเต็มจอ
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClosePopup = () => {
    setIsPopupOpen(false);

  }

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,

      url: import.meta.env.VITE_API + "/store/stores/",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setStores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Get stocked
  const handleGetStocked = (id) => {
    setStoreId(id);
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(import.meta.env.VITE_API + `/store/${id}/stocked`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setStocked(result);
        if (result && result.length > 0) {
          handleStocked(result[0].id);
        }
      })
      .catch((error) => console.error(error));
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

  // ฟังก์ชันสำหรับวาดรูปภาพ
  const drawImage = useCallback(() => {
    if (!stockedImage || stockedImage.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [stockedImage]);

  useEffect(() => {
    if (stockedImage && stockedImage.length > 0) {
      const img = imageRef.current;
      img.crossOrigin = "anonymous";
      img.src = stockedImage[currentImageIndex].image;
      img.onload = drawImage;
    }
  }, [stockedImage, currentImageIndex, drawImage]);

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

  // Get products by stocked-image
  useEffect(() => {
    if (!currentImageId || !clickedPoint) return;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API +
        `/store/stocked-image/${currentImageId}/products/area/?start_x=${clickedPoint?.x}&end_x=${clickedPoint?.x}&start_y=${clickedPoint?.y}&end_y=${clickedPoint?.y}`,
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
  }, [currentImageId, clickedPoint]);

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


  // Get products by stocked-image
  useEffect(() => {
    if (!storeId || !currentImageId) return;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${storeId}/stocked-image/${currentImageId}/goods/list`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        set_goods_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentImageId, storeId]);

  // เพิ่มฟังก์ชันสำหรับเปิด/ปิด fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // เข้าสู่โหมด fullscreen
      const container = document.querySelector('.containner_slide_box3D_point_admin');
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      // ออกจากโหมด fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // เพิ่ม event listener สำหรับการเปลี่ยนแปลงสถานะ fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
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

  return (
    <div className="containner_product_home">
      {/* Store List Section */}
      <div className="store_list">
        <h2>Store List</h2>
        <div className="category_container2">
          {stores.map((store) => (
            <div className="store" key={store.id}>
              <button onClick={() => handleGetStocked(store.id)}>
                {store.name} store
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas and Controls Section */}
      {stockedImage && (
        <div className={`containner_slide_box3D_point_admin ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="slider_box3D_admin">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              width={1000}
              height={500}
            />
            <div className='but1_box3D_admin'>
              <button className='btn nav-btn_box3D1' onClick={prevImage}>
                &#8249;
              </button>
              <button className='btn nav-btn_box3D2' onClick={nextImage}>
                &#8250;
              </button>
            </div>
            <button
              className='fullscreen-btn'
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '×' : '⤢'}
            </button>
          </div>

          {/* Point View Section */}

          <div className="point_view">
            {!isFullscreen && (
              <div className="point_view_container">
                {stocked.map((item) => (
                  <button
                    key={item.id}
                    className="point_view_btn"
                    onClick={() => handleStocked(item.id)}
                  >
                    <span className="point-dot" aria-hidden="true">⩴</span>
                    <span className="point-text">{item.point_view}</span>
                  </button>
                ))}
              </div>
            )}
            {/* <p>scroll</p> */}
          </div>


          {/* Product Popup */}
          <div className={`box-product_popup${isFullscreen ? '2' : ''}`}>
            {isPopupOpen && itemPopup && (
              <div className="popup-content">
                <Link to={`/goods/${itemPopup.goods_id}`}>
                  <div className="box-img">
                    <img
                      src={`${import.meta.env.VITE_API}${itemPopup.images}`}
                      alt={itemPopup.name}
                    />
                  </div>
                  <div className="text">
                    <p className="name">{itemPopup.name}</p>
                    <p className="price">$ {itemPopup.price}</p>
                  </div>
                </Link>
                <button className="BTN_Close" onClick={handleClosePopup}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid Section */}
      <div className="product">
        <h2 className="htxthead">Products</h2>
        <div className="product-area">
          {goods_list.map((item) =>
            item.category !== "Food" && (
              <div className="box-product" key={item.id}>
                <Link to={`/goods/${item.id}`}>
                  <div className="img">
                    <img src={`${import.meta.env.VITE_API}${item.image}`} alt={item.name} />
                  </div>
                  <div className="txtOFproduct2">
                    <h3 className="name">{item.name}</h3>
                    <p className="price">$ {item.price}</p>
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHome;
