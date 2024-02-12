import React, { useContext, useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const getInfo = async () => {
    try {
      await fetch("http://localhost:4000/allproducts")
        .then((response) => response.json())
        .then((data) => {
          setAllProducts(data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      await getInfo();
    } catch (error) {}
  };
  return (
    <>
      <div className="listproduct">
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allProducts.map((item, index) => {
            return (
              <>
                <div
                  key={index}
                  className="listproduct-format-main listproduct-format"
                >
                  <img
                    className="listproduct-product-icon"
                    src={item.image}
                    alt=""
                  />
                  <p>{item.name}</p>
                  <p>${item.old_price}</p>
                  <p>${item.new_price}</p>
                  <p>{item.category}</p>
                  <img
                    onClick={() => {
                      removeProduct(item.id);
                    }}
                    src={cross_icon}
                    className="listproduct-remove-icon"
                    alt=""
                  />
                </div>
                <hr />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ListProduct;
