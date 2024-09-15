const express = require('express');
const path = require("path");
const mysql = require('mysql');
const  { DataBaseHandler, checkAndInsertData, rentingObject} = require("./controller.js")
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());


connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"inventory_database"
})

connection.connect()






  



function InsertDataIntoInvetory(req,res,next){
  data = req.body
  console.log("heyyyyyyy",req.body)
  query = `INSERT INTO inventory(DeviceName , Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
  connection.query(query,(err,resp)=>{
    if(err){
      console.log("there is some issue in inserting data in inventory table",err)
    }
    else{
      console.log("data inserted successfully in inventory")
    }
    next()
  })



}















const newpath = __dirname
app.use(express.static('static'));

app.get("/",DataBaseHandler,(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"))
})


app.get("/add_item",(req,res)=>{
  res.sendFile(path.join(__dirname,"add_item.html"))

})




app.get("/rent",(req,res)=>{
  console.log("heyyy22332")
  res.sendFile(path.join(__dirname,"rent.html"))
})


app.get("/return",(req,res)=>{
  console.log("heyyy11111")
  res.sendFile(path.join(__dirname,"return.html"))

})


app.get("/overview",(req,res)=>{
  res.sendFile(path.join(__dirname,"overview.html"))
})


app.get("/contact",(req,res)=>{
  res.sendFile(path.join(__dirname,"contact.html"))

})

app.get("/customers",(req,res)=>{
  res.sendFile(path.join(__dirname,"customer.html"))


})


// app.post("/add_product",InsertDataIntoInvetory,(req,res)=>{
app.post("/add_product",checkAndInsertData,(req,res)=>{

  // for (const key in req.body) {
  //   console.log(key, req.body[key]);
  //   console.log("heyyyy") // Log key and value
  // }
  console.log(req.body,"my category data")
  res.send("data got successfullly")
})


app.post("/rent_item",rentingObject,(req,res)=>{
  console.log("rent wala data",req.body)
  res.send("apka rent data mil gya")
})





app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
