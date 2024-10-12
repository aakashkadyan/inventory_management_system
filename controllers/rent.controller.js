const { rentProductById, findActiveRentByProductIdAndRenterEmail, returnRentById } = require("../services/rent.service");
const { findProductByName } = require("../services/inventory.service");

const rentProduct = async function (req, res) {
  const { deviceName, renterEmail, renterName, quantity } = req.body;
  if ((!deviceName || !renterEmail || !renterName, !quantity)) {
    res
      .status(400)
      .send("Properties deviceName, renterEmail, renterName, quantity are mandatory.");
    return;
  }

  let product = await findProductByName(deviceName);

  if(!product) {
    res
      .status(400)
      .send(`Product ${deviceName} does not exist.`);
    return;
  }

  if(product.quantity < quantity) {
    res
      .status(400)
      .send(`We do not have ${quantity} ${deviceName} currently. Please check later.`);
    return;
  }


  const existingRent = await findActiveRentByProductIdAndRenterEmail(product.id, renterEmail);
  if(existingRent) {
    res
      .status(400)
      .send(`You already have ${existingRent.quantity} ${deviceName} rented with the email ${renterEmail}. Please return them before renting again.`);
    return;
  }
  await rentProductById(product, {renterEmail, renterName, quantity});
  res.send(`${quantity} ${deviceName} rented successfully!`);
};

const returnProduct = async function(req, res) {
  const { deviceName, renterEmail } = req.body;
  const product = await findProductByName(deviceName);
  if(!product) {
    res
      .status(400)
      .send(`We have no product called ${deviceName}`);
    return;
  }
  const rent = await findActiveRentByProductIdAndRenterEmail(product.id, renterEmail);
  if(!rent) {
    res
      .status(400)
      .send(`No active rent found for ${deviceName} from ${renterEmail}`);
    return;
  }
  await returnRentById(rent.id);
  res.send(`${rent.quantity} ${deviceName} returned successfully!`);
}
module.exports = {
  rentProduct,
  returnProduct
};
