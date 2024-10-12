const mysql = require("mysql2");

connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: "inventory_database",
});

const checkIfTableExists = async function (tableName) {
  const query = `SHOW TABLES LIKE '${tableName}';`;
  const [result, _] = await connection.promise().query(query);
  if (result.length) {
    return true;
  }
  return false;
};

const seedDatabaseIfRequired = async function () {
  if (!(await checkIfTableExists("inventory"))) {
    await connection.promise().query(`CREATE TABLE inventory(
          id INT AUTO_INCREMENT PRIMARY KEY ,
          deviceName VARCHAR(255) UNIQUE,
          quantity INT(5),
          pricePerDay Double);`);
    console.info("Inventory table created!");
  } else {
    console.info("Inventory table already present");
  }
  if (!(await checkIfTableExists("rent_history"))) {
    await connection.promise().query(`CREATE TABLE rent_history(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            rentedAt DATE NOT NULL,
            returnedAt Date,
            productId Int,
            FOREIGN KEY(productId) REFERENCES inventory(id),
            totalCharges DOUBLE,
            renterEmail VARCHAR(255),
            renterName VARCHAR(255),
            quantity INT(5) NOT NULL,
            status ENUM("ACTIVE","INACTIVE") NOT NULL);`);
    console.info("Rent history table created!");
  } else {
    console.info("Rent history table already present");
  }
};

const initDb = async function () {
  await connection.connect();

  await seedDatabaseIfRequired();
};

module.exports = {
  initDb,
};
