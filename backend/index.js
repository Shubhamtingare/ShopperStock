const express = require("express");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

// Database connection with mongodb

const dbConn = async () => {
  await mongoose.connect(
    "mongodb+srv://shubhamtingare0661:9766Sstkit@cluster0.zz6546c.mongodb.net/Shopper"
  );
  console.log("database connected successfully");
};

//API creation

app.get("/", (req, res) => {
  try {
    res.status(200).send("This is home page");
  } catch (error) {
    console.log(error);
  }
});

// Image storage engine

const storage = multer.diskStorage({
  destination: "./Upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//creating upload endpoint to upload images

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.status(200).json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// creating API for add product

app.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = Number(last_product.id) + 1;
    } else {
      id = 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    // console.log(product);
    await product.save();
    console.log("saved");
    res.status(200).json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log(error);
  }
});

//creating API for deleting product

app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("removed");
    res.status(200).json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log(error);
  }
});

//creating API for getting all oproducts

app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({});
    // console.log("all products fetched");
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
});

//creating user schema

const Users = mongoose.model("Users", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint for user registration

app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });

    if (check) {
      res.status(400).send({ message: "Email already registered!" });
    }
    let cart = {};

    for (let index = 0; index < 300; index++) {
      cart[index] = 0;
    }

    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "SECRET_KEY");
    res.status(200).send({ success: true, token });
  } catch (error) {
    console.log(error);
  }
});

//creating endpoint for user login

app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).send({ success: false, message: "User not found!" });
    }
    const passCompare = req.body.password === user.password;

    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "SECRET_KEY");
      res.status(200).send({ success: true, token });
    }
    if (!passCompare) {
      res.status(400).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
  }
});

//creating API for getting new collections data

app.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    res.status(200).send(newcollection);
  } catch (error) {
    console.log(error);
  }
});

//creating API for getting popular in women data

app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popularInWomen = products.slice(0, 4);
    res.status(200).send(popularInWomen);
  } catch (error) {
    console.log(error);
  }
});

// creating middleware to fetch user

const fetchUser = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      res.status(401).send({ message: "Token not found" });
    } else {
      const data = await jwt.verify(token, "SECRET_KEY");
      req.user = data.user;
      next();
    }
  } catch (error) {
    res.status(401).send({ message: "Error while fetching user" });
  }
};

//creating endpoint for adding products in cart

app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.status(200).send({ message: "Added" });
  } catch (error) {
    console.log(error);
  }
});

//creating endpoint to remove products in cart

app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.status(200).send({ message: "Removed" });
  } catch (error) {
    console.log(error);
  }
});

//creating endpoint to get cartdata

app.post("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    res.status(200).send(userData.cartData);
  } catch (error) {
    console.log(error);
  }
});

dbConn().then(() => {
  app.listen(port, async () => {
    console.log(`server is listening at ${port}`);
  });
});
