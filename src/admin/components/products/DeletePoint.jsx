import "./product_Admin.css";
import { useState, useEffect, useRef } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Product_Admin = () => {
  const [id, set_id] = useState(null);
  const MySwal = withReactContent(Swal);
  const storage = JSON.parse(window.localStorage.getItem("user"));
  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }
  const imageRef = useRef(null);

  ////////// List displayed point ///////////
  const [point, setPoint] = useState([
    {
      point_view: "",
      images: [],
    },
  ]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}/stocked`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setPoint(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [selectedPointImages, setSelectedPointImages] = useState([]);
  const [selectedPointView, setSelectedPointView] = useState(null);
  const [imags, setImags] = useState([]);

  const image_id = imags[currentImageIndex]?.id;

  console.log("image_idimage_id.......", image_id);

  useEffect(() => {
    const imagesWithIds = selectedPointImages.map((image) => ({
      id: image.id,
      image: image.image,
    }));
    setImags(imagesWithIds);
  }, [selectedPointImages]);

  const handlePointClick = (id) => {
    const pointItem = point.find((pointItem) => pointItem.id === id);
    if (pointItem) {
      setSelectedPointId(id);
      setSelectedPointView(pointItem.point_view);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/stocked/${id}`,
        headers: {},
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.images && response.data.images.length > 0) {
            setSelectedPointImages(response.data.images);
            set_id(null);
          } else {
            console.log("No images found in response");
            setSelectedPointImages([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
          setSelectedPointImages([]);
        });
    } else {
      console.log("Point item not found");
    }
  };

  const handleDeletePoint = (id) => {
    MySwal.fire({
      text: "Are you sure you want to delete point?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        let data = JSON.stringify({
          point: id,
        });

        let config = {
          method: "delete",
          url: import.meta.env.VITE_API + `/store/stocked/${id}`,
          headers: {},
        };

        axios
          .request(config)
          .then((response) => {
            MySwal.fire({
              text: "Successful delete the product.",
              icon: "success",
            });
            setPoint((prevPoints) =>
              prevPoints.filter((pointItem) => pointItem.id !== id)
            );
          })
          .catch((error) => {
            console.error("Error deleting point:", error);
          });
      }
    });
  };

  return (
    <>
      <AdminMenu />
      <section id="product_admin">
        <div className="container_body_admin_product">
          <div className="productHead_content">
            <h1 className="htxthead">
              <span className="spennofStyleadmin"></span>Detail point
            </h1>
          </div>

          <div className="containner_slide_box3D_point_admin">
            <div className="slider_box3D_admin">
              <div
                ref={imageRef}
                style={{ position: "relative", display: "inline-block" }}
                className="slide_box3D_admin"
              >
                <svg width="1050" height="500" className="line-overlay">
                  <image
                    href={imags[currentImageIndex]?.image}
                    width="500"
                    height="500"
                    preserveAspectRatio="none"
                  />
                </svg>
              </div>

              <div className=" but1_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev > 0 ? prev - 1 : imags.length - 1
                    )
                  }
                >
                  &#8249;
                </div>
              </div>
              <div className=" but2_box3D_admin">
                <div
                  className="nav-btn_box3D_admin "
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev < imags.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  &#8250;
                </div>
              </div>
            </div>

            <div className="containner_point_admin">
              {point.length > 0 ? (
                point.map((pointItem, index) => (
                  <div
                    className="box_GrStatusGoodSmall_admin"
                    key={index}
                    onClick={() => handleDeletePoint(pointItem.id)}
                  >
                    <div className="GrStatusGoodSmall_admin"></div>
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product_Admin;
