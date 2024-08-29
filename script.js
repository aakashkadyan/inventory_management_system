const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "inventory_management"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

app.post('/addItem', (req, res) => {
  const { deviceName, quantity, pricePerDay } = req.body;

  const sql = "INSERT INTO inventory (deviceName, quantity, pricePerDay) VALUES (?, ?, ?)";
  con.query(sql, [deviceName, quantity, pricePerDay], function(err, result) {
    if (err) {
      res.status(500).send("Error inserting data");
      throw err;
    }
    res.send(`${result.affectedRows} record(s) inserted`);
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
