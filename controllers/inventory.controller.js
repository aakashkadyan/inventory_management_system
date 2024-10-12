const {
  findProductByName,
  insertProduct,
  updateProductByName,
  deleteProductByName,
  listAllProducts
} = require("../services/inventory.service");

const upsertProduct = async function (req, res) {
  const { deviceName, quantity, pricePerDay } = req.body;
  let product = await findProductByName(deviceName);
  if (product) {
    let newQuantity = parseInt(product.quantity) + parseInt(quantity);
    await updateProductByName({
      deviceName,
      quantity: newQuantity,
      pricePerDay,
    });
  } else {
    await insertProduct({ deviceName, quantity, pricePerDay });
  }
  res.send(await findProductByName(deviceName));
};

const findProducts = async function (req, res, next) {
  let products = await listAllProducts();
  res.send(products || []);
};

const deleteProduct = async function (req, res) {
  const { deviceName } = req.body;
  if(!deviceName) {
    res.status(400).send("deviceName is mandatory");
    return;
  }
  let product = await findProductByName(deviceName);
  if (product) {
    await deleteProductByName(deviceName);
    res.send("Product deleted");
  } else {
    res.status(400).send("Product not found");
  }
};

module.exports = {
  upsertProduct,
  findProducts,
  deleteProduct,
};
