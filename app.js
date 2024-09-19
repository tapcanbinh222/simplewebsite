const express = require("express");
const path = require("path");
const Product = require("./models/product");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();  // Đọc các biến môi trường từ file .env

const app = express();
app.use(express.urlencoded({ extended: true }));

// Kết nối tới MongoDB Atlas sử dụng biến môi trường
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected successfully to MongoDB Atlas"))
  .catch(err => console.log("Failed to connect to MongoDB:", err));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Route lấy view list
app.get("/", async (req, res) => {
    try {
      const products = await Product.find();
      console.log("Fetched Products:", products); // Hiển thị dữ liệu ra console
      res.render("list", { products });
    } catch (err) {
      console.log("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
// Khởi động server sử dụng PORT từ biến môi trường
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});

// Route để insert data xuống MongoDB
app.post("/create", async (req, res) => {
  const data = req.body;
  await Product.create(data)
    .then(() => res.redirect("/"))
    .catch(error => {
      console.log("Error creating product:", error);
      res.status(500).send("Error creating product");
    });
});

app.get("/create", (req, res) => {
  res.render("create");
});

// Route để xóa sản phẩm
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await Product.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product");
  }
});

// Route để hiển thị form cập nhật
app.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("update", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product");
  }
});

// Route để cập nhật sản phẩm
app.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, brand } = req.body;
  try {
    const result = await Product.updateOne(
      { _id: id },
      { $set: { name, price, quantity, brand } }
    );
    if (result.matchedCount === 0) {
      res.status(404).send("Product not found");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
});

