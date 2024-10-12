const express = require("express");
require("dotenv").config();
const { initDb } = require("./lib/db.js");
const {
  upsertProduct,
  findProducts,
  deleteProduct,
} = require("./controllers/inventory.controller.js");
const {
  rentProduct,
  returnProduct
} = require("./controllers/rent.controller.js");
const app = express();
const bodyParser = require("body-parser");

initDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("static"));

app.post("/upsert_product", upsertProduct);
app.get("/find_products", findProducts);
app.post("/delete_product", deleteProduct);

app.post("/rent_product", rentProduct);
app.post("/return_product", returnProduct);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
