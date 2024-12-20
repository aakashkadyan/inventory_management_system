const express = require('express');
const path = require("path");
const mysql = require('mysql');
const  {inventoryItemCheck,rentingObject,getRentedDataByEmail,getItemNameFromItemId} = require("./controller/controllernew.js")
const {initDb,upsertData} = require("./lib/db.js")
const app = express();
const bodyParser = require('body-parser');
const hbs = require('hbs');
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);  // Convert object to JSON string
});



app.set('view engine', 'hbs');
app.set(__dirname+"/")


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());

initDb()

// connection.connect()

console.log("Directory,",__dirname)




  



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















const newpath = __dirname+"/templates/"
console.log("newwwwwww",newpath)
app.use(express.static('static'));

// app.get("/",DataBaseHandler,(req,res)=>{
app.get("/",(req,res)=>{
  res.sendFile(path.join(newpath,"index.html"))
})


app.get("/add_item",(req,res)=>{
  res.sendFile(path.join(newpath,"add_item.html"))
})




app.get("/rent",(req,res)=>{
  let date = new Date().toISOString().split('T')[0]
  console.log("heyyy22332",date)
  res.sendFile(path.join(newpath,"rent.html"))
})


app.get("/return",(req,res)=>{
  console.log("heyyy11111",)
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
app.post("/add_product",upsertData,(req,res)=>{

  // for (const key in req.body) {
  //   console.log(key, req.body[key]);
  //   console.log("heyyyy") // Log key and value
  // }
  console.log(req.body,"my category data")
  res.send("data got successfullly")
})


app.post("/rent_item",rentingObject,(req,res)=>{
})



app.post("/inventoryItemForRent",inventoryItemCheck,(req,res)=>{
   console.log("data i got",req.body.status)
   console.log("yee deh",res.newfinalData)
   res.send(res.newfinalData)

})



app.post("/returnItem",getRentedDataByEmail,getItemNameFromItemId,(req,res)=>{
  console.log("after all rented data",req.rentedDataForEmail)
  console.log("after all req.itemsWithDeviceNameAndId",req.itemsWithDeviceNameAndId)
  let finaldata = req.itemsWithDeviceNameAndId
  // res.sendFile(path.join(newpath,"rentedData.html"))
  // console.log("PATHSSS",path.join(newpath,"rentedData.html"))
  console.log("finaldata",finaldata)
  // res.sendFile(path.join(newpath,"rentedData.html"),finaldata)
  res.render("rentedData",{finaldata});
})


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

