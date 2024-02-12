import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [state, setstate] = useState("LOGIN");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    try {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } catch (error) {}
  };
  const login = async () => {
    try {
      let responseData;
      await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        toast.success("Login successful");
        localStorage.setItem("token", responseData.token);
        navigate("/");
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async () => {
    try {
      // console.log(formData);
      let responseData;
      await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        toast.success("Registration successful");
        localStorage.setItem("token", responseData.token);
        navigate("/");
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <hr />
        <div className="loginsignup-fields">
          {state === "SIGNUP" ? (
            <input
              type="text"
              placeholder="Your name"
              name="name"
              value={formData.name}
              onChange={changeHandler}
            />
          ) : (
            <></>
          )}

          <input
            type="email"
            placeholder="Your email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
          />
          <input
            type="password"
            placeholder="Your password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
          />
        </div>

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <button
          onClick={() => {
            state === "LOGIN" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "SIGNUP" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              onClick={() => {
                setstate("LOGIN");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span
              onClick={() => {
                setstate("SIGNUP");
              }}
            >
              Register here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
