import React from "react";
import "./Offers.css";
import exclusive_image from "../Assets/exclusive_image.png";
import { useNavigate } from "react-router-dom";

const Offers = () => {
  const navigate = useNavigate();
  const handleCheck = () => {
    navigate("/womens");
  };
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>offers for you</h1>
        <p>only on best sellers products</p>
        <button onClick={handleCheck}>Check Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  );
};

export default Offers;
