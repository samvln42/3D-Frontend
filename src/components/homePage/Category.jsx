import "./category.css";
import womenfashion from "../../img/womenfashion.png";
import internet_of_things from "../../img/internet_of_things.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Category = () => {
  const navigate = useNavigate();
  const [category_list, set_category_list] = useState([]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + "/api/categories",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        set_category_list(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log("category_list: ", category_list);



  return (
    <div className="category_container2">
      {category_list.map((i, index) => (
        <div className="box-category" key={index}>
          <button>
            <img className="boxImage" src={i.image} alt="image" />
            <p>{i.name}</p>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Category;
