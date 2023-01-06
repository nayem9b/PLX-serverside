const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
// Add a new product from the form
app.post("/products", async (req, res) => {
  const addedProduct = req.body;
  const result = await ProductsCollection.insertOne(addedProduct);
  res.send(result);
});
// Get all the products in the homepage
app.get("/products", async (req, res) => {
  const products = await ProductsCollection.find({}).toArray();
  res.send(products);
});

// What perticular user has added
app.get("/userproducts", async (req, res) => {
  let query = {};
  if (req.query.email) {
    query = {
      email: req.query.email,
    };
  }
  const cursor = ProductsCollection.find(query);
  const products = await cursor.toArray();
  res.send(products);
});

//
app.get("/allproducts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const requestedProduct = await ProductsCollection.findOne(query);
  res.send(requestedProduct);
});
app.get("/checkout/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const checkout = await ProductsCollection.findOne(query);
  res.send(checkout);
});
// Stripe payment intent
app.post("/create-payment-intent", async (req, res) => {
  const checkout = req.body;
  const price = checkout.price;
  const amount = price * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: "usd",
    amount: amount,
    payment_method_types: ["card"],
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.get("/", async (req, res) => {
  res.send("Homepage is working");
});
app.listen(port, () => {
  console.log(`my app is running on ${port}`);
});
