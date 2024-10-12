const findProductByName = async function (deviceName) {
  const [result, _] = await connection
    .promise()
    .query(`select * from inventory where deviceName = "${deviceName}";`);
  return result[0];
};

const findProductById = async function (id) {
  const [result, _] = await connection
    .promise()
    .query(`select * from inventory where id = "${id}";`);
  return result[0];
};

const insertProduct = async function ({ deviceName, quantity, pricePerDay }) {
  let insertQuery = `INSERT INTO inventory(deviceName, quantity, pricePerDay) VALUES('${deviceName}','${quantity}','${pricePerDay}');`;
  await connection.promise().query(insertQuery);
};

const updateProductByName = async function ({
  deviceName,
  quantity,
  pricePerDay,
}) {
  let updateQuery = `UPDATE inventory SET quantity=${quantity}, pricePerDay=${pricePerDay} WHERE deviceName="${deviceName}";`;
  await connection.promise().query(updateQuery);
};

const deleteProductByName = async function(deviceName) {
  let deleteQuery = `DELETE from inventory where deviceName="${deviceName}";`;
  await connection.promise().query(deleteQuery);
};

const listAllProducts = async function() {
  const [results, _] = await connection
    .promise()
    .query(`select * from inventory`);
  return results;
};

module.exports = {
  findProductByName,
  findProductById,
  insertProduct,
  updateProductByName,
  deleteProductByName,
  listAllProducts
};
