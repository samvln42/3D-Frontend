import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Menu from "../menuFooter/Menu";
import Header from "../header/Header";

const Search = () => {

  const [goods_list, set_goods_list] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  const filterParam = urlParams.get("filter") || "1";
  const [search, setSearch] = useState(searchParam || "");
  const [filter, set_filter] = useState(filterParam);
  const [visibleProducts, setVisibleProducts] = useState(12);

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
    const fetchData = async () => {
      try {
        let config;

        if (search) {
          config = {
            method: "post",
            url: import.meta.env.VITE_API + "/store/search",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({ 
              search,
              filter
            }),
          };
        } else {
          config = {
            method: "get",
            url: import.meta.env.VITE_API + `/store/?category_type=${filter}`,
            headers: {
              "Content-Type": "application/json",
            },
          };
        }

        const response = await axios.request(config);
        if (Array.isArray(response.data)) {
          let sortedData = [...response.data];
          switch (filter) {
            case "2":
              sortedData.sort((a, b) => b.price - a.price);
              break;
            case "3":
              sortedData.sort((a, b) => b.review_count - a.review_count);
              break;
            case "4":
              sortedData.sort((a, b) => a.price - b.price);
              break;
            default:
              sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          }
          set_goods_list(sortedData);
        } else {
          console.error("Expected an array of goods");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [search, filter]);

  const handleLoadMore = () => {
    setVisibleProducts(prevCount => prevCount + 12);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    set_filter(newFilter);
    
    const params = new URLSearchParams(window.location.search);
    params.set('filter', newFilter);
    if (search) {
      params.set('search', search);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div>
      <Header />
        <div className="productHead_content">
          <div className="htxthead">
            <span className="spennofStyle"></span>Product
          </div>
          <div className="categoryBoxfiler">
            <p>Sort by</p>
            <form className="boxfilterseach">
              <select
                className="filter_priceProduct"
                value={filter}
                onChange={handleFilterChange}
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
            {goods_list.slice(0, visibleProducts).map((product, index) => (
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
                  <p className="product-description">{product.description.length > 20
                    ? `${product.description.slice(0, 20)}...`
                    : product.description}</p>
                  <p className="product-price">{product.price} 원</p>
                </div>
              </div>
            ))}
          </div>

          {visibleProducts < goods_list.length && (
            <div className="view-more-container">
              <button className="view-more-button" onClick={handleLoadMore}>
                View More
              </button>
            </div>
          )}
        </div>
      <Menu />
    </div>
  );
};

export default Search;

