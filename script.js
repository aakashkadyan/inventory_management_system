const express = require('express');
const path = require("path");
const mysql = require('mysql');
const  {checkAndInsertData, rentingObject, inventoryItemCheck} = require("./controllernew.js")
const {initDb} = require("./lib/db.js")
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());

initDb()

// connection.connect()






  



// function InsertDataIntoInvetory(req,res,next){
//   data = req.body
//   console.log("heyyyyyyy",req.body)
//   query = `INSERT INTO inventory(DeviceName , Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
//   connection.query(query,(err,resp)=>{
//     if(err){
//       console.log("there is some issue in inserting data in inventory table",err)
//     }
//     else{
//       console.log("data inserted successfully in inventory")
//     }
//     next()
//   })



// }







const newpath = __dirname+"/static/"
app.use(express.static('static'));

app.get("/",(req,res)=>{
  console.log("__dirname",__dirname)
  res.sendFile(path.join(newpath,"index.html"))
})


app.get("/add_item",(req,res)=>{
  console.log("__dirname",__dirname)
  res.sendFile(path.join(newpath,"add_item.html"))
})




app.get("/rent",(req,res)=>{
  console.log("heyyy22332")
  res.sendFile(path.join(newpath,"rent.html"))
})


app.get("/return",(req,res)=>{
  console.log("heyyy11111")
  res.sendFile(path.join(newpath,"return.html"))

})


app.get("/overview",(req,res)=>{
  res.sendFile(path.join(newpath,"overview.html"))
})


app.get("/contact",(req,res)=>{
  res.sendFile(path.join(newpath,"contact.html"))

})

app.get("/customers",(req,res)=>{
  res.sendFile(path.join(newpath,"customer.html"))


})


// app.post("/add_product",InsertDataIntoInvetory,(req,res)=>{
app.post("/add_product",checkAndInsertData,(req,res)=>{
  console.log(req.body,"my category data")
  res.send("data got successfullly")
})


app.post("/rent_item",rentingObject,(req,res)=>{

  console.log("rent wala data",req.body)
  res.send("apka rent data mil gya")
})



app.post("/rent_data",inventoryItemCheck,(req,res)=>{
   console.log("data i got",req.body.name)
   console.log("data i got from inventory db",req.datagot)
   res.send(req.datagot)
})


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
