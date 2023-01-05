const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dafmrk2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const usersCollection = client.db("Capital").collection("users");
const ProductsCollection = client.db("Capital").collection("addedProducts");
app.post("/userInfo", async (req, res) => {
  const userInfo = req.body;
  const result = await usersCollection.insertOne(userInfo);
  res.send(result);
});
app.post("/products", async (req, res) => {
  const addedProduct = req.body;
  const result = await ProductsCollection.insertOne(addedProduct);
  res.send(result);
});
app.get("/products", async (req, res) => {
  const products = await ProductsCollection.find({}).toArray();
  res.send(products);
});
app.get("/", async (req, res) => {
  res.send("Homepage is working");
});
app.listen(port, () => {
  console.log(`my app is running on ${port}`);
});
