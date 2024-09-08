const express = require('express');
const path = require("path");
const mysql = require('mysql');
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





function checkAndInsertData(req,res,next){
  try{
      console.log("checkdataaaa",req.body)
      data = req.body
      query1 = `select * from inventory;`
      connection.query(query1,(err,resp)=>{
      if(!err){
        for(let i = 0; i<resp.length;i++){
          if(data.name==resp[i]['DeviceName']){
            console.log("this iteam already exists",resp[i])
            newquantity = parseInt(resp[i]['Quantity'])+parseInt(data.quantity)
            console.log("newwwwquantity",newquantity)
            updatequery = `UPDATE inventory SET Quantity=${newquantity},PricePerDay=${data.price} WHERE DeviceName="${data.name}";`
            connection.query(updatequery,(err,resp)=>{
            if(!err){
              console.log("new values for the existing data is updated",resp)
              }
            else{
              console.log("value not inserted properly",err)

                }
                }
              )
              }
            }
          }    
      else{
        console.log("data is new")
        query = `INSERT INTO inventory(DeviceName,Quantity, PricePerDay) VALUES('${data.name}','${data.quantity}','${data.price}');`
        connection.query(query,(err,resp)=>{
          if(err){
            console.log("there is some issue in inserting data in inventory table",err)
          }
          else{
            console.log("Data inserted successfully",resp)
          }
        }
      )
    }
    next()
    })
    }
  catch(err){
    console.log(err.lineNumber,"ccc");
  }


}
  



function InsertDataIntoInvetory(req,res,next){
  data = req.body
  console.log("hey",req.body)
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







function DataBaseHandler(req,res,next){
  console.log("yhaa aya")
  // var query1 = `SELECT EXISTS( SELECT 1 FROM information_schema.tables WHERE table_schema = 'inventory_database' AND table_name = 'inventoryeeee');`
  var query1 = `SELECT * FROM inventory;`
  var query2 = `SELECT * FROM rent;`
  connection.query(query1,(err,resp)=>{
    if(err){
      connection.query(`CREATE TABLE inventory(
        Id INT AUTO_INCREMENT PRIMARY KEY ,
        DeviceName VARCHAR(255) UNIQUE,
        Quantity INT(5),
        PricePerDay Double);`,(err,resp)=>{
          if(err){
            console.log("Error while creating")
          }
          else{
            console.log("Inventory table created successfully")
          }
        })
    }
    else{
      console.log("Inventory table already exists")
    }
  connection.query(query2,(err,resp)=>{
    if(err){
      connection.query(`CREATE TABLE rent(
        Id INT NOT NULL PRIMARY KEY,
        RentedDate DATE NOT NULL,
        ReturnDate DATE NOT NULL,
        FOREIGN KEY(Id) REFERENCES inventory(Id),
        TotalCharges DOUBLE,
        RenterEmail VARCHAR(255),
        RenterName VARCHAR(255),
        Quantity INT(5) NOT NULL,
        status ENUM("ACTIVE","INACTIVE") NOT NULL);`,(err,resp)=>{
          if(err){
            console.log("Error while creating rent table",err)
          }
          else{
            console.log("rent table created successfully")
          }
        })
      }
      else{
        console.log("rent table already exists")
      }
  })

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


app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
