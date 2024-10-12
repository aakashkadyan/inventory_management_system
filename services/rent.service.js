const { getDaysBetweenDates } = require("../lib/utils");
const { updateProductByName, findProductById } = require("./inventory.service");

const findActiveRentByProductIdAndRenterEmail = async function (
  productId,
  renterEmail,
) {
  const [result, _] = await connection
    .promise()
    .query(
      `select * from rent_history where productId = ${productId} and renterEmail = '${renterEmail}' and status = 'ACTIVE'`,
    );
  return result[0];
};

const rentProductById = async function (product, rentInfo) {
  let newQuantity = parseInt(product.quantity) - parseInt(rentInfo.quantity);
  let rentedAt = new Date();
  let rentQuery = `INSERT INTO rent_history(rentedAt, productId ,renterEmail ,renterName ,quantity ,status ) VALUES(?,?,?,?,?,?)`;
  await connection
    .promise()
    .query(rentQuery, [
      rentedAt,
      product.id,
      rentInfo.renterEmail,
      rentInfo.renterName,
      rentInfo.quantity,
      "ACTIVE",
    ]);
  await updateProductByName({
    deviceName: product.deviceName,
    quantity: newQuantity,
    pricePerDay: product.pricePerDay,
  });
  await findActiveRentByProductIdAndRenterEmail(
    product.id,
    rentInfo.renterEmail,
  );
};

const findActiveRentById = async function (rentId) {
  let findQuery = `select * from rent_history where id = ${rentId} and status = 'ACTIVE'`;
  const [result, _] = await connection.promise().query(findQuery);
  return result[0];
};

const returnRentById = async function (rentId) {
  const rent = await findActiveRentById(rentId);
  const product = await findProductById(rent.productId);
  const returnedAt = new Date();
  const totalCharges =
    product.pricePerDay * (getDaysBetweenDates(returnedAt, rent.rentedAt) + 1);
  const newQuantity = parseInt(rent.quantity) + parseInt(product.quantity);
  const updateQuery = `UPDATE rent_history SET returnedAt=?, totalCharges=?, status = ? WHERE id=?;`;
  await connection
    .promise()
    .query(updateQuery, [returnedAt, totalCharges, "INACTIVE", rent.id]);
  await updateProductByName({
    deviceName: product.deviceName,
    quantity: newQuantity,
    pricePerDay: product.pricePerDay,
  });
};

module.exports = {
  rentProductById,
  findActiveRentByProductIdAndRenterEmail,
  returnRentById,
};
