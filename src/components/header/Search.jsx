import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Menu from "../menuFooter/Menu";
import Header from "../header/Header";

const Search = () => {

  const [goods_list, set_goods_list] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  const [search, setSearch] = useState(searchParam || "");
  const [filter, set_filter] = useState(1);

  var store_id = false;
  if (localStorage.getItem("user")) {
    store_id = JSON.parse(window.localStorage.getItem("user")).store_id;
  }

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParam]);


  useEffect(() => {
    let my_url = "";

    my_url = `/store/?category_type=${filter}`;

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
  }, [filter]);


  useEffect(() => {
    if (search !== "") {
      let data = JSON.stringify({
        search: search,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + "/store/search",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          set_goods_list(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [search]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/${store_id}/stocked`,
      headers: {},
    };

    if (!store_id) {
      console.error("Store ID is not available.");
      return;
    }

    axios
      .request(config)
      .then((response) => {
        setPoint(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      });
  }, [store_id]);


  return (
    <div>
      <Header />

      <div className="product">
        <div className="productHead_content">
          <h1 className="htxthead">
            <span className="spennofStyle"></span>Product search
          </h1>
          <div className="categoryBoxfiler">
            <p>Sort by</p>
            <form className="boxfilterseach">
              <select
                className="filter_priceProduct"
                value={filter}
                onChange={(e) => {
                  set_filter(e.target.value);
                  setSearch("");
                  const newUrl = window.location.pathname;
                  window.history.pushState({}, '', newUrl);
                }}
              >
                <option value="1">Latest</option>
                <option value="3">Sort by review</option>
                <option value="2">Highest price</option>
                <option value="4">Low to highest prices</option>
              </select>
            </form>
          </div>
        </div>

        <div className="products-container">
          <div className="products-grid">
            {goods_list.map((product, index) => (
              <div key={index} className="product-card">
                <Link to={`/goods/${product.id}`}>
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
      </div>
      <Menu />
    </div>
  );
};

export default Search;
