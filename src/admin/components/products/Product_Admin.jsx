import "./product_Admin.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import { BiPlus } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import imageicon from "../../../img/imageicon.jpg";
import banner_no from "../../../img/banner_no.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Product_Admin = () => {
  const token = localStorage.getItem("token");
  const storage = JSON.parse(window.localStorage.getItem("user"));
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  const navigate = useNavigate();
  const [background_image, set_background_image] = useState(null);
  const [goods_list, set_goods_list] = useState([]);

  const [id, setId] = useState(null);
  const [data, set_data] = useState(null);
  const [point_data, set_point_data] = useState("");

  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const MySwal = withReactContent(Swal);

  // Products
  const [products, setProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      category: "",
      x_axis: [],
      y_axis: [],
      sizes: [],
      colors: [],
      images: [],
      imagePreview: "",
    },
  ]);

  const [isUpdatePopup, setIsUpdatePopup] = useState(false);
  const [isUpdatePopupArray, setIsUpdatePopupArray] = useState(false);
  const [isPopupImage, setIsPopupImage] = useState(false);
  const [parameter, setParameter] = useState("");

  // canvasRef
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [coordinates, setCoordinates] = useState({ x: [], y: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [stockedImage, setStockedImage] = useState(null);
  const [stocked, setStocked] = useState([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  // Get stocked
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(import.meta.env.VITE_API + `/store/${store_id}/stocked`, requestOptions)
      .then((response) => response.json())
      .then((result) => setStocked(result))
      .catch((error) => console.error(error));
  }, [store_id]);

  // Get stocked images
  const handleStocked = (id) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  // Get images
  useEffect(() => {
    if (stockedImage && stockedImage.length > 0) {
      const imageUrls = stockedImage.map(img => img.image);
      setCurrentImageId(stockedImage[currentImageIndex].id);

      const img = imageRef.current;
      img.crossOrigin = "anonymous";
      img.src = imageUrls[currentImageIndex];
      img.onload = () => {
        drawCanvas();
      };
    }
  }, [stockedImage, currentImageIndex]);

  // Get mouse position
  const getMousePosition = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Draw canvas
  const drawCanvas = useCallback(() => {

    if (!stockedImage || stockedImage.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = imageRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (isDrawing) {
      const x = Math.min(startPoint.x, endPoint.x);
      const y = Math.min(startPoint.y, endPoint.y);
      const width = Math.abs(startPoint.x - endPoint.x);
      const height = Math.abs(startPoint.y - endPoint.y);

      if (width > 0 && height > 0) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
    }
  }, [isDrawing, startPoint, endPoint, stockedImage]);

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    if (!stockedImage || stockedImage.length === 0) return;

    const { x, y } = getMousePosition(e);
    setIsDrawing(true);
    setStartPoint({ x, y });
    setEndPoint({ x, y });
  }, [getMousePosition, stockedImage]);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !stockedImage || stockedImage.length === 0) return;
    const { x, y } = getMousePosition(e);
    setEndPoint({ x, y });
    drawCanvas();
  }, [isDrawing, getMousePosition, drawCanvas, stockedImage]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    const sortedX = [startPoint.x, endPoint.x].sort((a, b) => a - b);
    const sortedY = [startPoint.y, endPoint.y].sort((a, b) => a - b);
    setCoordinates({ x: sortedX, y: sortedY });

    drawCanvas();
    setTimeout(() => {
      captureSelectedArea(sortedX, sortedY);
    }, 0);
  }, [startPoint, endPoint, drawCanvas, stockedImage]);

  // Capture selected area
  const captureSelectedArea = useCallback((x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const width = Math.abs(x[1] - x[0]);
    const height = Math.abs(y[1] - y[0]);

    if (width <= 0 || height <= 0) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    try {
      const imageData = ctx.getImageData(x[0], y[0], width, height);
      tempCtx.putImageData(imageData, 0, 0);
      const dataURL = tempCanvas.toDataURL('image/png');

      setProducts((prevProducts) =>
        prevProducts.map((product, index) =>
          index === 0 ? { ...product, imagePreview: dataURL } : product
        )
      );
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error capturing area:', error);
    }
  }, []);

  // Close popup
  const closePopup = useCallback(() => {
    setProducts([
      {
        name: "",
        description: "",
        price: "",
        category: "",
        x_axis: [],
        y_axis: [],
        sizes: [],
        colors: [],
        images: [],
        imagePreview: "",
      },
    ]);
    setIsPopupOpen(false);
  }, []);

  // Next image
  const nextImage = useCallback(() => {
    if (stockedImage && stockedImage.length > 0) {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev + 1) % stockedImage.length;
        setCurrentImageId(stockedImage[newIndex].id);
        return newIndex;
      });
    }
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
  }, [stockedImage]);


  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        e.target.value = null; // clear input
        return;
      }
      if (!file.type.match('image.*')) {
        alert("Please select an image file");
        e.target.value = null;
        return;
      }

      set_data(file);
    }
  };

  // Add color and size input
  const addColorInput = () => {
    if (currentColor.trim() !== "") {
      setColors([...colors, currentColor]);
      setCurrentColor("");
    }
  };

  // Remove color and size input
  const removeColorInput = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  // Check token
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
        navigate("/loginuser");
        return;
      });
  }, [token]);

  // Check token
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
        navigate("/loginuser");
        return;
      });
  }, []);

  // Get goods list
  useEffect(() => {
    let my_url = "";
    if (!storage.is_admin) {
      my_url = `/store/?store_id=${store_id}`;
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
        if (Array.isArray(response.data)) {
          set_goods_list(response.data);
        } else {
          console.error("Expected an array of goods");
        }
      })
      .catch((error) => {
        console.log("Error fetching goods:", error);
      });
  }, []);

  // Get products by stocked-image
  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${storage.store_id}/stocked-image/${currentImageId}/goods/list`,
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
  }, [currentImageId]);

  // Get background image
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
        set_background_image(response.data[0].background);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Toggle update popup
  const toggleUpdatePopup = (id, parameter, data) => {
    switch (parameter) {
      case "colors":
      case "sizes":
        setIsUpdatePopupArray(!isUpdatePopupArray);
        setColors(data);
        break;

      case "name":
      case "price":
      case "description":
      case "point_view":
        setIsUpdatePopup(!isUpdatePopup);
        break;

      default:
        setIsUpdatePopupArray(false);
        setIsUpdatePopup(false);
        break;
    }

    setId(id);
    setParameter(parameter);
  };

  // Toggle popup image
  const togglePopupImage = (id, parameter) => {
    setId(id);
    setIsPopupImage(!isPopupImage);
    setParameter(parameter);
  };

  // Update product
  const UpdateProduct = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw;
    switch (parameter) {
      case "colors":
      case "sizes":
        raw = JSON.stringify({
          [parameter]: colors
        });
        break;

      case "name":
      case "price":
      case "description":
        raw = JSON.stringify({
          [parameter]: data
        });
        break;

      default:
        console.warn(`Unhandled parameter type: ${parameter}`);
        raw = JSON.stringify({});
        break;
    }

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(import.meta.env.VITE_API + `/store/goods/${id}/update`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setIsUpdatePopup(false);
        setIsUpdatePopupArray(false);

        MySwal.fire({
          text: "Update successful",
          icon: "success"
        });

        // Refresh goods list
        let my_url = !storage.is_admin ? `/store/?store_id=${store_id}` : `/store/`;

        axios.get(import.meta.env.VITE_API + my_url)
          .then((response) => {
            if (Array.isArray(response.data)) {
              set_goods_list(response.data);
            }
          })
          .catch((error) => {
            console.log("Error fetching goods:", error);
          });
      })
      .catch((error) => {
        console.error(error);
        MySwal.fire({
          text: "Update failed",
          icon: "error"
        });
      });
  };

  // Update product image
  const UpdateImage = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append(parameter, data);

    const requestOptions = {
      method: "PATCH",
      body: formdata,
      redirect: "follow"
    };

    let url;
    switch (parameter) {
      case "images":
        url = `/store/goods/${id}/update`;
        break;
      case "background":
        url = `/store/web-info/1`;
        break;
      case "image":
        url = `/store/stocked-image/${currentImageId}/update`;
        break;
      default:
        MySwal.fire({
          text: "Invalid parameter type",
          icon: "error"
        });
        return;
    }

    fetch(import.meta.env.VITE_API + url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        setIsPopupImage(false);
        MySwal.fire({
          text: "Update successful",
          icon: "success"
        });

        // Refresh background image if parameter is "background"
        if (parameter === "background") {
          axios.get(import.meta.env.VITE_API + "/store/web-info")
            .then((response) => {
              set_background_image(response.data[0].background);
            })
            .catch((error) => {
              console.error("Error fetching background:", error);
            });
        }
        // Refresh goods list
        const listUrl = storage?.is_admin ? '/store/' : `/store/?store_id=${store_id}`;
        return axios.get(import.meta.env.VITE_API + listUrl);
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          set_goods_list(response.data);
        } else {
          console.error("Expected array response for goods list");
        }
      })
      .catch((error) => {
        console.error("Update failed:", error);
        MySwal.fire({
          text: "Update failed: " + error.message,
          icon: "error"
        });
      });
  };

  // Handle delete product
  const handleDelete = (id) => {
    MySwal.fire({
      title: "Confirm deletion?",
      text: "Are you sure you want to delete product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let data = JSON.stringify({
          goods_id: id,
        });

        let config = {
          method: "delete",
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_API + `/store/goods`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {

            // Refresh goods list
            let my_url = !storage.is_admin ? `/store/?store_id=${store_id}` : `/store/`;

            axios.get(import.meta.env.VITE_API + my_url)
              .then((response) => {
                if (Array.isArray(response.data)) {
                  set_goods_list(response.data);
                }
              })
              .catch((error) => {
                console.log("Error fetching goods:", error);
              });
            MySwal.fire({
              text: "Successful delete the product.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

    });
  };

  // Handle product post
  const handleProductName = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].name = value;
    setProducts(updatedProducts);
  };

  const handleProductPrice = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].price = value;
    setProducts(updatedProducts);
  };

  const handleProductDescription = (e, index) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index].description = value;
    setProducts(updatedProducts);
  };

  const handleImageProduct = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProducts = [...products];
        updatedProducts[index].images.push(reader.result);
        updatedProducts[index].imagePreview = reader.result;
        setProducts(updatedProducts);
      };
      reader.onerror = () => {
        console.error("Error reading the file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeInputChangeProduct = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentsizes = value;
    setProducts(updatedProducts);
  };

  const addSizeInputProduct = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentsizes.trim() !== "") {
      updatedProducts[index].sizes.push(updatedProducts[index].currentsizes);
      updatedProducts[index].currentsizes = "";
      setProducts(updatedProducts);
    }
  };

  const removeSizeInputProduct = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].sizes.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  const handleColorInputChangeProduct = (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index].currentcolors = value;
    setProducts(updatedProducts);
  };

  const addColorInputProduct = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].currentcolors.trim() !== "") {
      updatedProducts[index].colors.push(updatedProducts[index].currentcolors);
      updatedProducts[index].currentcolors = "";
      setProducts(updatedProducts);
    }
  };

  const removeColorInputProduct = (productIndex, sizeIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].colors.splice(sizeIndex, 1);
    setProducts(updatedProducts);
  };

  // Update point
  const Updatepoint = () => {
    let data = new FormData();
    data.append("point_view", point_data);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/stocked/${id}/update`,
      headers: {
        ...data,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        set_point_data(response.data);
        MySwal.fire({
          text: "Point name has been change.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Add product by stocked-image
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const post of products) {
      if (post.name.trim() === "") {
        Swal.fire({
          text: "Please enter a product name!",
          icon: "question",
        });
        return;
      }
    }

    for (const post of products) {
      if (post.price.trim() === "") {
        Swal.fire({
          text: "Please enter a product price!",
          icon: "question",
        });
        return;
      }
    }

    for (const post of products) {
      if (post.description.trim() === "") {
        Swal.fire({
          text: "Please enter a product description!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.sizes.length === 0) {
        Swal.fire({
          text: "Please enter a product sizes!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (post.colors.length === 0) {
        Swal.fire({
          text: "Please enter a product colors!",
          icon: "question",
        });
        return;
      }
    }
    for (const post of products) {
      if (!post.imagePreview) {
        Swal.fire({
          text: "Please add a product image!",
          icon: "question",
        });
        return;
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/store/${storage.store_id
        }/stocked-image/${currentImageId}/goods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goods_set: products.map((product) => ({
              ...product,
              x_axis: coordinates.x.map((coord) => parseFloat(coord.toFixed(3))),
              y_axis: coordinates.y.map((coord) => parseFloat(coord.toFixed(3))),
              images: [product.imagePreview],
            })),
          }),
        }
      );

      // Refresh goods list
      let my_url = !storage.is_admin ? `/store/?store_id=${store_id}` : `/store/`;

      axios.get(import.meta.env.VITE_API + my_url)
        .then((response) => {
          if (Array.isArray(response.data)) {
            set_goods_list(response.data);
          }
        })
        .catch((error) => {
          console.log("Error fetching goods:", error);
        });

      if (!response.ok) {
        MySwal.fire({
          text: "Add product failed.",
          icon: "question",
        });
        console.log(response);
        throw new Error("Add product failed.");
      }

      MySwal.fire({
        text: "Product addition has been completed..",
        icon: "success",


      }).then(() => {
        setProducts([
          {
            name: "",
            description: "",
            price: "",
            category: "",
            x_axis: [],
            y_axis: [],
            sizes: [],
            colors: [],
            images: [],
            imagePreview: "",
          },
        ]);
        setIsPopupOpen(false);
      });
    } catch (error) {
      console.error("Add product error:", error.message);
    }
  };


  return (
    <>
      <AdminMenu />
      <section id="product_admin">
        <div className="container_body_admin_product">
          <div className="productHead_content">
            <h1 className="htxthead">
              <span className="spennofStyleadmin"></span>Product
            </h1>
          </div>
          <div className="banner_no_box">
            <div className="banner_no_box_image">
              <div className="img">
                {background_image ? (
                  <img
                    src={background_image}
                    alt="Banner"
                  />
                ) : (
                  <img src={banner_no} alt="Banner" />
                )}
              </div>
            </div>
            {storage.is_admin === true && (
              <div className="edit_image_banner" onClick={() => togglePopupImage('', 'background')}>
                <CiCamera id="box_icon_camera" />
              </div>
            )}

          </div>

          <div className="box_category">

          </div>

          <div className="productHead_content_point">
            <Link to="/delete_point" className="box_add_product">
              <BiPlus id="icon_add_product" />
              <p>Delete Point</p>
            </Link>
            <Link to="/add_point" className="box_add_product">
              <BiPlus id="icon_add_product" />
              <p>Add Point</p>
            </Link>
          </div>

          <div className="containner_slide_box3D_point_admin">
            <div className="slider_box3D_admin">
              <canvas
                width={1000}
                height={500}
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              <div className="edit_image_banner_point">
                {stockedImage && stockedImage.length > 0 && (
                  <CiCamera
                    id="box_icon_camera"
                    onClick={() => togglePopupImage('', 'image')}
                  />
                )}
              </div>

              <div className=" but1_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={prevImage}
                >
                  &#8249;
                </div>
              </div>
              <div className=" but2_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={nextImage}
                >
                  &#8250;
                </div>
              </div>
            </div>

            <div className="containner_point_admin">
              {stocked.length > 0 && stocked.map((item) => (
                <div className="point" key={item.id} >
                  <button
                    className="GrStatusGoodSmall_admin"
                    onClick={() => handleStocked(item.id)}
                  >
                  </button>
                  <div className="point_name">
                    <p>{item.point_view}</p>
                    <MdOutlineEdit id="icon_edit_point"
                      onClick={() => toggleUpdatePopup(item.id, "point_view", "")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isPopupOpen && stockedImage && stockedImage.length > 0 && (
            <div className="group_container_product_popup">
              {products.map((post, index) => (
                <div className="addProduct_box_content_after_popup" key={index}>
                  <div className="box_input-img">
                    {post.imagePreview ? (
                      <img src={post.imagePreview} alt="product" />
                    ) : (
                      <img src={imageicon} alt="default" />
                    )}
                    <input
                      type="file"
                      id={`img-${index}`}
                      onChange={(e) => handleImageProduct(e, index)}
                      required
                    />
                  </div>

                  <div className="edit_images">
                    <label
                      htmlFor={`img-${index}`}
                      className="trigger_popup_fricc"
                    >
                      <CiCamera id="icon_ci_camera" />
                    </label>
                  </div>
                  <div className="box_container_image">
                    <div className="input-box">
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={post.name}
                          onChange={(e) => handleProductName(e, index)}
                        />
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Product Price"
                          value={post.price}
                          onChange={(e) => handleProductPrice(e, index)}
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Description"
                          value={post.handleProductDescription}
                          onChange={(e) => handleProductDescription(e, index)}
                        />
                      </div>
                      <div className="box">
                        <input
                          type="text"
                          placeholder="Coordinates X"
                          value={coordinates.x.map(coord => coord.toFixed(3)).join(", ")}
                          required
                          readOnly
                        />
                      </div>

                      <div className="box">
                        <input
                          type="text"
                          placeholder="Coordinates Y"
                          value={coordinates.y.map(coord => coord.toFixed(3)).join(", ")}
                          required
                          readOnly
                        />
                      </div>

                      <div className="box_size_product_container">
                        <div className="box_size_add">
                          {post.sizes.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="box_size_add_item">
                              <p>{size}</p>
                              <span
                                onClick={() =>
                                  removeSizeInputProduct(index, sizeIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Sizes..."
                            value={post.currentsizes || ""}
                            onChange={(e) =>
                              handleSizeInputChangeProduct(e, index)
                            }
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addSizeInputProduct(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>

                      <div className="box_size_product_containerWeb3d">
                        <div className="box_size_add">
                          {post.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="box_size_add_item">
                              <p>{color}</p>
                              <span
                                onClick={() =>
                                  removeColorInputProduct(index, colorIndex)
                                }
                              >
                                <MdClose id="icon_MdClose" />
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="box_size_content">
                          <input
                            type="text"
                            placeholder="Add Colors..."
                            value={post.currentcolors || ""}
                            onChange={(e) =>
                              handleColorInputChangeProduct(e, index)
                            }
                          />
                          <div
                            className="btn_addsize"
                            onClick={() => addColorInputProduct(index)}
                          >
                            Add
                          </div>
                        </div>
                      </div>

                      <div className="CancelAndSave">
                        <button
                          className="BTNCancel"
                          onClick={closePopup}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="BTNSave"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div id="container_product_admin">
            <div className="productHead_content">
              <h1 className="htxthead">
                <span className="spennofStyle"></span>ALL Product
              </h1>
            </div>
            <div className="contentImageProducts">
              {goods_list.map((product, index) => (
                <div className="box_product" key={index}>
                  <div className="box_input-img">
                    <div className="box_image">
                      <img src={product.image} alt="Product" />
                    </div>

                    <div
                      className="Box_delete_product"
                      onClick={() => handleDelete(product.id)}
                    >
                      <AiOutlineDelete />
                    </div>

                    <div
                      className="edit_image_product"
                      onClick={() => togglePopupImage(product.id, "images")}
                    >
                      <CiCamera id="box_icon_camera_product" />
                    </div>

                    {isPopupImage && (
                      <form
                        className="box_formUpdate"
                        onSubmit={UpdateImage}
                      >
                        <div className="formUpdate">
                          <div className="imageBox">
                            <p>Edit {parameter === "images" ? "product" : parameter === "background" ? "background" : "point"} image</p>
                            <label>
                              {data ? (
                                <img
                                  src={URL.createObjectURL(data)}
                                  alt="product"
                                />
                              ) : (
                                <img src={imageicon} alt="product" />
                              )}
                              <input
                                type="file"
                                id={`image-${index}`}
                                onChange={(e) => handleImage(e, index)}
                                required
                              />
                              <div className="choose">
                                <p>Choose img</p>
                              </div>
                            </label>
                          </div>
                          <div className="btn-update-del">
                            <button
                              type="button"
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={togglePopupImage}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              type="submit"
                              disabled={!data}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                  </div>

                  <div className="txtOFproduct">
                    <div className="box_icon_MdOutlineEdit">
                      <li>ProductName: {product.name}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => toggleUpdatePopup(product.id, "name", "")}
                      />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <li>Price: ${product.price}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => toggleUpdatePopup(product.id, "price", "")}
                      />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <li>Desc: {product.description}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => toggleUpdatePopup(product.id, "description", "")}
                      />
                    </div>
                    <div className="box_icon_MdOutlineEdit">
                      <li>X_axis: {JSON.stringify(product.x_axis)}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => toggleUpdatePopup(product.id, "x_axis", "")}
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>Y_axis: {JSON.stringify(product.y_axis)}</li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() => toggleUpdatePopup(product.id, "y_axis", "")}
                      />
                    </div>

                    {isUpdatePopup && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit {parameter}</p>
                            <input
                              type="text"
                              placeholder={parameter}
                              className="input_of_txtAddproduct"
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={toggleUpdatePopup}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={UpdateProduct}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 
                    {isConfirmationPoint && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit point name</p>
                            <input
                              type="text"
                              placeholder="Point name..."
                              className="input_of_txtAddproduct"
                              onChange={(e) => {
                                set_point_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationPoint}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => Updatepoint()}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* {isConfirmationX_axis && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit X_axis</p>
                            <input
                              type="text"
                              placeholder="X_axis..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationX_axis}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductX_axis();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* {isUpdatePopup && (
                      <div className="background_addproductpopup_box">
                        <div className="hover_addproductpopup_box">
                          <div className="box_input">
                            <p>Edit Y_axis</p>
                            <input
                              type="text"
                              placeholder="Y_axis..."
                              className="input_of_txtAddproduct"
                              value={data}
                              onChange={(e) => {
                                set_data(e.target.value);
                              }}
                            />
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={closeConfirmationY_axis}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={() => {
                                ChangeProductY_axis();
                              }}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )} */}

                    <div className="box_icon_MdOutlineEdit">
                      <li>
                        Size: {product.sizes ? product.sizes.join(", ") : ""}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          toggleUpdatePopup(product.id, "sizes", product.sizes)
                        }
                      />
                    </div>

                    <div className="box_icon_MdOutlineEdit">
                      <li>
                        Color: {product.colors ? product.colors.join(", ") : ""}
                      </li>
                      <MdOutlineEdit
                        id="icon_edit"
                        onClick={() =>
                          toggleUpdatePopup(product.id, "colors", product.colors)
                        }
                      />
                    </div>

                    {isUpdatePopupArray && (
                      <div className="background_addproductpopup_box">
                        <div className="addproductpopup_box">
                          <div className="box_size_input">
                            <p>Edit {parameter}</p>
                            <div className="box_size_container">
                              <div className="box_size_add">
                                {colors && colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="box_size_add_item"
                                  >
                                    <p>{color}</p>
                                    <span
                                      onClick={() =>
                                        removeColorInput(colorIndex)
                                      }
                                    >
                                      <MdClose id="icon_MdClose" />
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="box_size_content">
                                <input
                                  type="text"
                                  placeholder={`Add ${parameter}...`}
                                  value={currentColor}
                                  onChange={(e) =>
                                    setCurrentColor(e.target.value)
                                  }
                                />
                                <div
                                  className="btn_addsize"
                                  onClick={addColorInput}
                                >
                                  Add
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="btn_foasdf">
                            <button
                              className="btn_cancel btn_addproducttxt_popup"
                              onClick={toggleUpdatePopup}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_confirm btn_addproducttxt_popup"
                              onClick={UpdateProduct}>
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product_Admin;
