import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descrptionbox-navigator">
        <div className="descrptionbox-nav-box">Description</div>
        <div className="descrptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descrptionbox-descrption">
        <p>
          An e-commerce website is an online platform that facilitate buying and
          selling of products or services over the internet serves as a virtual
          marketplace where businesses and individuals showcase their products,
          interact with customers, and consuct transactions without the need for
          a physical presence. E-commerce websites have gained immense
          popularity due to their convenient accessibility, and the global reach
          they offer.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
