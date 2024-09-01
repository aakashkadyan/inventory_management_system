const express = require('express');
const path = require("path");
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
console.log("newpathhhh",__dirname)
// const newpath = __dirname

const app = express();
// app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('static'));

app.get("/",(req,res)=>{
  console.log("heyyyqqssss")
  res.sendFile(path.join(__dirname,"templates","index.html"))
})


app.get("/add_item",(req,res)=>{
  console.log("heyyy22211")
  res.sendFile(path.join(__dirname,"templates","add_item.html"))

})

app.get("/rent",(req,res)=>{
  console.log("heyyy22332")
  res.sendFile(path.join(__dirname,"templates","rent.html"))
})


app.get("/return",(req,res)=>{
  console.log("heyyy11111")
  // const finalpath = newpath+"/return.html"
  // res.sendFile(finalpath)
  res.sendFile(path.join(__dirname,"templates","return.html"))

})


app.get("/overview",(req,res)=>{
  console.log("heyyy22332")
  res.sendFile(path.join(__dirname,"templates","overview.html"))

})


app.get("/contact",(req,res)=>{
  console.log("contact")
  res.sendFile(path.join(__dirname,"templates","contact.html"))

})

app.get("/customers",(req,res)=>{
  console.log("customer")
  res.sendFile(path.join(__dirname,"templates","customer.html"))


})

// function addItem(){
//   window.location.href='/add_item'
// }


// function rentItem(){
//   window.location.href="/rent"
// }

// function returnThings(){
//   window.location.href="/return"
// }

// function overView(){
//   window.location.href="/overview"
// }





// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "yourusername",
//   password: "yourpassword",
//   database: "inventory_management"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to the database!");
// });

// app.post('/addItem', (req, res) => {
//   const { deviceName, quantity, pricePerDay } = req.body;

//   const sql = "INSERT INTO inventory (deviceName, quantity, pricePerDay) VALUES (?, ?, ?)";
//   con.query(sql, [deviceName, quantity, pricePerDay], function(err, result) {
//     if (err) {
//       res.status(500).send("Error inserting data");
//       throw err;
//     }
//     res.send(`${result.affectedRows} record(s) inserted`);
//   });
// });




app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
