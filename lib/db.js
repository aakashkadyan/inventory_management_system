// here i will keep the function, responsible for creating and maintaining the tables in db

const mysql = require('mysql');





connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"inventory_database"
  })
  
connection.connect()

function ensureTableExists(req,res,next){
    let selectInventoryQuery = `SELECT * FROM inventory;`;
    let selectRentQuery = `SELECT * FROM rent;`;
    connection.query(selectInventoryQuery,(err,resp)=>{
      if(err){
        connection.query(`CREATE TABLE inventory(
          object_Id INT AUTO_INCREMENT PRIMARY KEY ,
          DeviceName VARCHAR(255) UNIQUE,
          Quantity INT(5),
          PricePerDay Double);`,(err,resp)=>{
            if(err){
              console.log("Error while creating Inventory Table")
            }
            else{
              console.log("Inventory table created successfully")
            }
          })
      }
      else{
        console.log("Inventory table already exists")
      }
      connection.query(selectRentQuery,(err,resp)=>{
        if(err){
          connection.query(`CREATE TABLE rent(
            Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            RentedDate DATE NOT NULL,
            object_Id Int,
            FOREIGN KEY(object_Id) REFERENCES inventory(object_Id),
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
            }
          )
        }else{
          console.log("rent table already exists")
        }
      })  
    })
}







module.exports = {
    ensureTableExists,
    connection
}
  


