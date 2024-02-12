import React, { useContext } from "react";
import "./RelatedProducts.css";
// import data_product from "../Assets/data";
import Item from "../Item/Item";
import { ShopContext } from "../../Context/shopContext";

const RelatedProducts = ({ currentProductCategory }) => {
  const { allProduct } = useContext(ShopContext);
  const relatedProducts = allProduct
    .filter((item) => item.category === currentProductCategory)
    .slice(1)
    .slice(-4);
  console.log(relatedProducts);
  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
